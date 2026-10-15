# 资金管理报表改造计划（业财统计 / 按项目板块 / 按项目状态）

## Summary

本次共 3 项报表改造（需求 2 经确认跳过）：

1. **业财统计报表**（FinanceReport.vue）：新增 4 个"X月"动态字段、1 个专项储备字段、1 个协同项目字段
2. **按项目板块汇总**（SectorBusinessFinanceSummary.vue）：供水三级分类下每个项目类型行后插入"其中：城投供排水"统计行
3. **按项目状态汇总**（ProjectStatusSummary.vue）：停工行后插入"其中：合同签订超两年"子行；删除"上报项目"列；"平均利润率"改名"上报项目平均利润率"

---

## Current State Analysis

### FinanceReport.vue（业财统计报表）
- 表格列 + 列设置弹窗由 `allColumns` 数组（L416-L507）+ 模板中 `el-table-column`（按 `visibleColumns.includes(prop)` 控制）双重定义
- 列设置分组 filter 按	prop 白名单（如 L525 业务信息组、L534 专项储备组）
- Mock 数据在 `generateMockData()`（L638 起），已有先例：`isCTPGProject`（是否城投排管项目，是/否）、`specialReserveBeginning`（期初提取数 L739）、`specialReserveBalance`（结存数 L744）
- 已有 `specialReserveBeginning`（专项储备**期初提取数**），本次新增的是**期初使用数**（新字段，非改名）

### SectorBusinessFinanceSummary.vue（按项目板块汇总）
- 行生成在 `sortedFlatData` computed（L386-L430）：按 category1|2|3 分组 → 每组按 `projectTypeOptions`（2025年以前→新接→销项）push 项目类型行 → push 小计行（橙色 `subtotal-row`）
- 三级分类枚举：`'城镇水务': ['供水', '排水', '雨水']`（L156）——"供水"仅在"城镇水务"二级分类下
- Mock 数据无项目名称、无"城投供排水"标记字段
- 合并逻辑 `categorySpans` 基于相邻行 category 值相同计数，新插入行保留相同 category 值即可自动纳入合并
- CSV 导出直接遍历 `sortedFlatData`，新行自动包含

### ProjectStatusSummary.vue（按项目状态汇总）
- `summaryData` computed（L192-L325）：每个项目状态一行 → 竣工后插 3 个结算子行（`projectStatus: ''`）→ 总计行
- Mock 数据（L154-L184）无合同签订日期字段；金额经 `toWan` 转万元
- `reportedProjects` 列：模板 L76、行对象 L230/L280/L307、导出表头 L346/数据 L366
- `avgProfitMargin`（平均利润率）：模板 L77（`%` 格式）、导出 L346/L367
- 导出 CSV 表头数组在 `handleExport`（L341 起）

---

## Proposed Changes

### 1. FinanceReport.vue — 业财统计报表新增 6 个字段

**1a. 四个"X月"动态字段**（X = 当前月份，动态计算）：

定义动态月份：`const currentMonth = new Date().getMonth() + 1`，label 用 `` `${currentMonth}月完成总包营收（内部）` `` 形式。

| 新字段 prop | label（动态） | 插入位置 |
|---|---|---|
| `monthlyCompletedRevenue` | `${currentMonth}月完成总包营收（内部）` | `completedRevenue2026`（2026年完成总包营收（内部））之前 |
| `monthlyCompletedOutput` | `${currentMonth}月完成总包产值（内部）` | `completedOutput2026`（2026年完成总包产值（内部））之前 |
| `monthlyReportedRevenue` | `${currentMonth}月上报集团营收` | `reportedRevenue2026`（2026年上报集团营收）之前 |
| `monthlyReportedOutput` | `${currentMonth}月上报集团产值` | `reportedOutput2026`（2026年上报集团产值）之前 |

修改点：
- 模板表格列（L276、L278、L287、L291 前各插一列，`:label` 动态绑定）
- `allColumns` 数组（L441、L443、L452、L456 前各插一条，label 同步动态拼接——`allColumns` 若为普通数组，改为在定义处引用 `currentMonth`）
- 列设置"营收数据"分组 prop 白名单加入 4 个新 prop
- Mock 数据（`generateMockData`）：4 个新字段随机生成（取值量级为对应年度字段的 1/12 左右）

**1b. 专项储备期初使用数**：
- 新 prop：`specialReserveBeginningUsage`，label 固定"专项储备期初使用数"
- 位置：`specialReserveBalance`（专项储备结存数）之前（即 `cumulativeSpecialReserve使用` 之后）
- 同步：模板 L342 前、`allColumns` L507 前、专项储备分组白名单（L534）、Mock 数据（随机值）

**1c. 是否协同项目**：
- 新 prop：`isCollaborativeProject`，label"是否协同项目"，取值"是/否"（复用 `isCTPGProject` 的 randomItem 模式）
- 位置：`ownerUnitName`（业主单位名称）之后
- 同步：模板 L220 后、`allColumns` L416 后、业务信息分组白名单（L525）

### 2. SectorBusinessFinanceSummary.vue — 供水下插"其中：城投供排水"行

- **Mock 数据**：项目条目新增 `isCTGWater`（是否城投供排水）布尔字段；`category3 === '供水'` 的条目按约 60% 概率置 true，其他分类固定 false
- **行生成**（`sortedFlatData` computed，L404-L427）：`projectTypeOptions.forEach` 内，每个项目类型行 push 后，若 `group.category3 === '供水'` 且该项目类型行存在，则立即 push 一行：
  ```
  { category1/2/3: 同组值, projectType: '其中：城投供排水', isCTGSub: true, 各数值字段 = 该项目类型下 isCTGWater 条目汇总 }
  ```
  （averageProfitMargin 同样按项目数量加权；无城投供排水条目时数值全 0 但行仍显示，与图1一致）
- **样式**：`isCTGSub` 行加浅色区分（`row-class-name` 返回 `ctg-sub-row`，浅黄背景），小计行橙色样式不变
- **合并/导出**：新行保留 category 值，合并与 CSV 导出自动生效，无需额外改动；导出表头不变（新行在"项目类型"列显示"其中：城投供排水"）
- **小计**：仍只汇总 `group.items`（不含新插行），数值不受影响

### 3. ProjectStatusSummary.vue — 停工子行 + 列调整

**3a. "其中：合同签订超两年"子行**：
- Mock 数据新增 `contractSignDate`（随机日期，范围约 2018-2026，保证约 30-40% 的停工项目签订超过 2 年）
- `summaryData` 中，`status === '停工'` 的状态行 push 之后，插入子行：
  ```
  { projectStatus: '其中：', settlementStatus: '合同签订超两年', isSignOver2Years: true,
    统计条件：projectStatus === '停工' 且 (当前日期 - contractSignDate) >= 2 年，
    各金额字段与利润率计算逻辑与结算子行一致（toWan 转万元） }
  ```
- 样式：`row-class-name` 对 `isSignOver2Years` 行返回浅黄背景 class（对应图2黄色行）
- 分页数据 `paginatedData` 基于 `summaryData` 切片，自动包含

**3b. 删除"上报项目"列**：
- 删除模板 L76、行对象中 `reportedProjects`（L230、L280、L307）、导出表头"上报项目"（L346）与数据（L366）

**3c. "平均利润率"→"上报项目平均利润率"**：
- 模板 L77 label 改名；导出表头 L346 同步改名字段 prop 保持 `avgProfitMargin` 不变

---

## Assumptions & Decisions

- **需求 2 跳过**：用户确认"销项项目汇总表中 管道工程和..."描述不完整，本次不处理，待补充
- **X月动态**：X 取浏览器当前月份（`getMonth() + 1`），如当前为 10 月则显示"10月完成总包营收（内部）"
- **城投供排水行位置**：用户确认按图1形式——每个项目类型行后各插一行（共 3 行），小计行仍在其后
- **合同签订超两年统计日**：使用系统当前日期动态计算
- **"其中：城投供排水"行始终显示**（即使数值全 0），与图1一致
- Mock 数据均为演示用随机值，新字段量级与同组现有字段协调

## Verification

1. `npm run dev` 启动后浏览器访问 http://localhost:5174/（或 5173）
2. 业财统计报表：核对 4 个"10月"字段位置与动态 label、专项储备期初使用数位置、是否协同项目在业主单位名称后；列设置弹窗勾选/取消新字段正常
3. 按项目板块汇总：找到 水务→城镇水务→供水 分组，确认 3 个项目类型行后各有"其中：城投供排水"行，小计行仍为橙色且数值不含其中行；分类合并单元格不错位；导出 CSV 包含其中行
4. 按项目状态汇总：停工行下出现"其中：| 合同签订超两年"浅黄行，数值 ≤ 停工行；无"上报项目"列；列名为"上报项目平均利润率"；导出 CSV 同步
5. 控制台无报错
