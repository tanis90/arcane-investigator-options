# NOTICE — 章鱼调查员扩展资料包

本模块提供两份可选 Item 包：`arcane-investigator-skills`（31 项扩展技能）与 `arcane-investigator-professions`（148 个扩展职业）。它由章鱼料理研究会系统（id `brp`）的可选模块加载，不属于系统默认运行时包。

## 定位

- 本模块不是 Chaosium 的官方产品，不是 Call of Cthulhu 的 SRD，也不是任何官方出版物的一部分。
- 不声称任何形式的官方授权、认可或背书。
- `module.json` 不写远端 `manifest` / `download` / `url`；安装与否由使用者自行决定从哪里取得目录或 ZIP。

## 许可范围

- [LICENSE.txt](LICENSE.txt) 是标准 MIT 许可证。
- MIT **仅覆盖本仓的原创代码与原创文案**：`module.json`、`tools/pack.mjs`、README、NOTICE，以及各条目的中文描述与结构化字段。
- MIT **不覆盖、也不授权任何第三方事实**。SealDice builtins（`sealdice/sealdice-builtins`）、`coc-cardwright`、Roll20 Compendium、Chaosium 公开 wiki 及其他公开页面的权利仍归各自权利人；它们不因本仓的 MIT 声明获得 MIT 授权，也不因本仓公开分发而被再许可。
- 本仓不声称这些第三方材料已获授权，也不保证其使用在法律上无风险。公开分发是本仓维护者的决定；如权利人提出异议，按 README 的下架流程处理。

## 数据来源与边界

条目里的数值、公式、信用区间与技能名来自下列次级来源，逐条记录在 `octopus-system` 的 `content/coc/provenance.json`：

- SealDice 内置 `COC职业查询` helpdoc（`sealdice/sealdice-builtins`）。`sealdice-core` 是 MIT，但 `sealdice-builtins` 未声明许可证。本模块不分发其 JSON、helpdoc 正文或【介绍】段落，只取职业点公式、信用评级区间与技能构成，全部描述自写。
- `coc-cardwright`（`tanis90/coc-cardwright`）：只取数值、公式、信用区间与技能名，不复制其模板、HTML/CSS、Python 实现或其他仓代码。
- Roll20 Compendium、Chaosium 公开 wiki、Gamers' Plane、callofcthulhu.org.uk、RPG Stack 等公开页面：只取字段语义与数值事实，证据等级记为 secondary。

**没有复制第三方原文。** 描述文案、字段组织、包格式、LevelDB WAL 与打包脚本为本项目原创。

## 运行行为

- 无 `esmodules`、无脚本、无设置项、无 hooks：模块只声明两个 Item 包。
- 不写入 `system.json`；系统默认运行时包列表保持四个（`octopus-skills`、`octopus-professions`、`coc-skills`、`coc-professions`）。
- 存在即启用：模块被加载且两个包被勾选时，两个包出现在 Compendium；禁用或撤下后世界回到核心 60 技能 / 9 职业入口。核心固定技能不依赖扩展文档，扩展族成员只作可选引用，缺席时省略。

## 下架

收到权利人异议时，按下架流程停止仓库与 Release。删除仓库或 Release 不会撤回已经下载、转存或分发的副本，也不会清除他人 clone、fork 或既有 git 历史中的内容。
