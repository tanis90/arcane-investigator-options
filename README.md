# 章鱼调查员扩展资料包

「章鱼料理研究会」（Foundry VTT 系统 id `brp`）的可选内容模块。它把 CoC 7e 调查员资料中的扩展技能与扩展职业装进两个独立 Item 包；不启用本模块时，世界仍然只有核心 60 项技能与 9 个职业入口。

本模块**不是** Chaosium 的官方产品，也**不是** Call of Cthulhu 的 SRD，不声称任何官方授权、认可或背书。许可边界见 [NOTICE.md](NOTICE.md)。

## 内容

| 包 | 类型 | 条目 | 说明 |
| --- | --- | --- | --- |
| `arcane-investigator-skills` | Item | **31** | 扩展技能（其中 28 项专精） |
| `arcane-investigator-professions` | Item | **148** | 扩展职业 |

- 系统核心包（不在本模块内）：`coc-skills` **60** 项技能（22 项专精）、`coc-professions` **9** 个职业入口。
- 两套合并：**91** 项技能（50 项专精）、**157** 个职业入口 = **156** 个转录职业 + **1** 个自定义调查员模板。
- 拆分不重复：每一项技能、每一个职业只属于一个包，合并后与 `octopus-system` 的单一事实源逐条相等。

## 安装（ArcaneMap）

1. 从 Release 下载 `arcane-investigator-options-0.1.0.zip`；仓库内构建产物在 `dist/`（`dist/` 不入 git）。
2. 打开「资料库」，点右上角「上传合集包」，上传这个 ZIP。模块内的两个 Item 包会登记为「我的内容包」下的两个 user pack：
   - `章鱼调查员扩展 · 技能` — `user-arcane-investigator-options.arcane-investigator-skills`
   - `章鱼调查员扩展 · 职业` — `user-arcane-investigator-options.arcane-investigator-professions`
3. 打开「战役管理」，在「内容包」里勾选这两个 user pack 并保存。
4. 重开或刷新车卡器 / 调查员创建器。

**只上传 ZIP 不勾选，或只勾选其中一个包，本模块都不启用：** 前者两个包都不会进入战役；后者只得到技能或职业的一半，车卡器拿到的扩展内容不完整。两个都勾选并保存后，扩展技能与职业才会一起进入战役「合集」页签和车卡器。ArcaneMap 只导入两个 Item 包的内容，不执行模块脚本；本模块没有 `esmodules`，不注册设置或 hooks，也不写入系统的 `system.json`。

> 原生 Foundry VTT 的手工解压（`Data/modules/arcane-investigator-options/`）属于高级备选；ArcaneMap 不需要手工解压。

## 核心 8 个职业与自定义调查员

核心包给出的 9 个职业入口是 8 个核心职业加 1 个自定义模板：

| 职业 | 职业点公式 | 信用评级 |
| --- | --- | --- |
| 古董商 Antiquarian | `EDU*4` | 30–50 |
| 作家 Author | `EDU*4` | 9–30 |
| 纨绔子弟 Dilettante | `EDU*2+APP*2` | 50–99 |
| 医生（医学博士）Doctor of Medicine | `EDU*4` | 30–80 |
| 调查记者 Investigative Journalist | `EDU*4` | 9–30 |
| 警探 Police Detective | `EDU*2+DEX*2` **或** `EDU*2+STR*2` | 20–50 |
| 私家侦探 Private Investigator | `EDU*2+STR*2` **或** `EDU*2+DEX*2` | 9–30 |
| 教授 Professor | `EDU*4` | 20–70 |
| 自定义调查员 Custom Investigator | 五选一（见下） | 0–99（守密人审核） |

作家的文学方向保留为 `specialismSlots` 里的开放「艺术/手艺（文学）」槽，由玩家填写专精名；不会用扩展里的具体艺术/手艺条目替换。

### 自定义调查员

`custom-investigator`（brpid `i.profession.coc.custom-investigator`）是一个**产品定义的建卡模板**，不是任何印刷职业：

- 技能：`choiceGroups` 只有一组 `custom-eight`，`choose: 8`，`options: [{ kind: "any" }]`，玩家自选 8 项任意技能。
- 职业点公式：从 `EDU*4`、`EDU*2+DEX*2`、`EDU*2+APP*2`、`EDU*2+STR*2`、`EDU*2+POW*2` 五条白名单公式中选一条；没有第六条自创公式。
- 信用评级：0–99，由守密人审核；不是财富档。
- 来源标注：`evidence: "product"` + `productBoundary`；不声称任何来源印过这个职业。

## 事实源与构建

本仓是 `octopus-system` 的**确定性分发产物**，不是第二事实源：

- 事实源：`octopus-system` 的 `content/coc/skills.json` 与 `content/coc/professions.json`。
- 构建：`octopus-system/tools/coc-pack/build.mjs` 默认把扩展输出到 sibling 目录 `../arcane-investigator-options`；可用 `--out <dir>` 或环境变量 `ARCANE_INVESTIGATOR_OPTIONS_OUT=<dir>` 覆盖。
- `packs-json/` 保留完整 JSON 文档，供 review 和 diff；`packs/<包名>/000001.log` 是真实 LevelDB WAL（WriteBatch），键为 `!items!<_id>`，值为完整 JSON 文档。
- 打包：`node tools/pack.mjs` 生成 `dist/arcane-investigator-options-0.1.0.zip`。ZIP 根是 `module.json` 和 `packs/`，另附 `README.md`、`LICENSE.txt`、`NOTICE.md`；`dist/` 不入 git。

```bash
cd ../octopus-system
node tools/coc-pack/build.mjs

cd ../arcane-investigator-options
node tools/pack.mjs
```

确定性：扩展文档按 `_id` 稳定排序，WAL 使用固定 sequence，ZIP 条目使用固定时间戳 1980-01-01 00:00 和 STORED；连续两次构建字节一致。`packs-json`、`packs-index`、`packs` 和 ZIP 都来自同一次数据构建。

## 许可

- [LICENSE.txt](LICENSE.txt) 是标准 MIT，只覆盖本仓的原创代码与原创文案：`module.json`、`tools/pack.mjs`、本 README、NOTICE，以及各条目的中文描述和结构化字段。
- MIT **不覆盖、也不授权**第三方事实：SealDice builtins、`coc-cardwright`、Roll20 Compendium、Chaosium wiki 等材料的权利仍归各自权利人。它们不因本仓的 MIT 声明获得 MIT 授权。
- 本仓不声称 Chaosium、SealDice、`coc-cardwright`、Roll20、Chaosium wiki 或其他第三方的授权、认可或背书；也不保证这些第三方事实的使用在法律上无风险。
- 公开分发是本仓维护者的决定。若权利人提出异议，按下面的下架流程处理。

## 下架流程（收到权利人异议时）

1. **停止仓库**：GitHub 仓库 Settings → Archive this repository（或改为 Private），停止继续分发。
2. **停止 Release**：删除对应 Release 及其 ZIP 资产；如已打 tag，删除 tag。
3. **删除仓库**：如决定彻底停止，可删除仓库。
4. **说明**：在任何仍可访问的位置写明已停止分发及联系方式。

删除仓库或 Release **不会撤回**已经下载、转存或分发的副本，也不会清除他人 clone、fork 或既有 git 历史中的内容。下架只停止后续获取。
