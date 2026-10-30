// Deterministic ZIP builder for the arcane-investigator-options module.
//
// The ZIP is the Foundry upload artifact: module.json, packs/ (real LevelDB WAL)
// and the three documents at the root. No dependencies outside Node's standard
// library. Entries are STORED with a fixed 1980-01-01 timestamp, so two runs over
// the same files produce byte-identical archives.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "module.json"), "utf8"));
const args = process.argv.slice(2);
const outIndex = args.findIndex((arg) => arg === "--out" || arg === "--output");
const outArg = outIndex >= 0 ? args[outIndex + 1] : null;
if (outIndex >= 0 && !outArg) throw new Error("--out 需要一个路径");
const outPath = resolve(outArg ?? join(ROOT, "dist", `${manifest.id}-${manifest.version}.zip`));

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (bytes) => {
  let c = 0xFFFFFFFF;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
};

const u16 = (value) => {
  const out = Buffer.alloc(2);
  out.writeUInt16LE(value, 0);
  return out;
};
const u32 = (value) => {
  const out = Buffer.alloc(4);
  out.writeUInt32LE(value, 0);
  return out;
};

// Local header + central directory + EOCD. STORED (method 0), no data
// descriptor, no extra fields, DOS time 00:00 and date 1980-01-01 fixed.
function makeZip(entries) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.concat([
      u32(0x04034B50), u16(20), u16(0), u16(0), u16(0), u16(0x21),
      u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0),
      nameBytes,
    ]);
    parts.push(local, data);
    central.push(Buffer.concat([
      u32(0x02014B50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0x21),
      u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset), nameBytes,
    ]));
    offset += local.length + data.length;
  }
  const centralBytes = Buffer.concat(central);
  const eocd = Buffer.concat([
    u32(0x06054B50), u16(0), u16(0), u16(entries.length), u16(entries.length),
    u32(centralBytes.length), u32(offset), u16(0),
  ]);
  return Buffer.concat([...parts, centralBytes, eocd]);
}

const add = (entries, rel) => {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) throw new Error(`缺少打包文件：${rel}（先运行 octopus-system/tools/coc-pack/build.mjs）`);
  entries.push([rel, readFileSync(abs)]);
};

const entries = [];
for (const rel of ["module.json", "README.md", "LICENSE.txt", "NOTICE.md"]) add(entries, rel);

const declared = (manifest.packs ?? []).map((pack) => String(pack.path ?? "").replace(/^\.\//, "").replace(/\/+$/, ""));
const packRoot = join(ROOT, "packs");
if (!existsSync(packRoot)) throw new Error("缺少 packs/：先运行 octopus-system/tools/coc-pack/build.mjs");
const actual = readdirSync(packRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `packs/${entry.name}`)
  .sort();
if (JSON.stringify(actual) !== JSON.stringify([...declared].sort())) {
  throw new Error(`packs/ 目录与 module.json 声明不一致：${JSON.stringify({ actual, declared })}`);
}
for (const dir of actual) {
  const files = readdirSync(join(ROOT, dir), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  if (files.length !== 1 || files[0] !== "000001.log") {
    throw new Error(`${dir} 必须是单个 LevelDB WAL 000001.log，实际：${JSON.stringify(files)}`);
  }
  add(entries, `${dir}/${files[0]}`);
}

const zip = makeZip(entries);
mkdirSync(dirname(outPath), { recursive: true });
const temp = `${outPath}.tmp`;
writeFileSync(temp, zip);
try {
  renameSync(temp, outPath);
} catch (error) {
  rmSync(temp, { force: true });
  throw error;
}

const sha256 = createHash("sha256").update(zip).digest("hex");
console.log(`ZIP ${outPath}`);
console.log(`条目 ${entries.length}：${entries.map(([name]) => name).join(", ")}`);
console.log(`字节 ${zip.length}；sha256 ${sha256}`);
