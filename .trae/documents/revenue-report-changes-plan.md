# 营收报表改动实施计划

## 一、需求概述

本次改动涉及三大营收报表组件的全面调整，包括：营收汇总表列调整、营收明细表重构（表头+搜索+导出）、偏差项目表改造（改名+新增季度tab+导出）。

## 二、当前状态分析

### 涉及文件清单

| 文件    | 绝对路径                                                                | 当前行数     |
| ----- | ------------------------------------------------------------------- | -------- |
| 营收汇总表 | `e:\trae_demo_env\营收看板\src\components\revenue\RevenueSummary.vue`   | \~801 行  |
| 营收明细表 | `e:\trae_demo_env\营收看板\src\components\revenue\RevenueDetail.vue`    | \~1773 行 |
| 偏差项目表 | `e:\trae_demo_env\营收看板\src\components\revenue\RevenueDeviation.vue` | \~869 行  |
| 侧边栏菜单 | `e:\trae_demo_env\营收看板\src\components\layout\Sidebar.vue`           | \~239 行  |
| 依赖配置  | `e:\trae_demo_env\营收看板\package.json`                                | \~22 行   |

### 当前技术约束

* **无 Excel 导出库**：当前 package.json 中未安装 xlsx / exceljs 等导出库，需新增依赖

* **导出功能为 Mock**：仅 RevenueSummary 有 alert 占位实现

* **数据内嵌**：三个组件的 mock 数据均写在各自组件内部

***

## 三、具体改动方案

### 改动 1：安装 Excel 导出依赖

**文件**: `package.json`
**操作**: 安装 `xlsx` 库用于多 sheet 导出功能
**命令**: `npm install xlsx`

***

### 改动 2：营收汇总表 (`RevenueSummary.vue`)

#### 2.1 施工类总营收 tab — 增加"下月计划"列

**位置**: 第 233-264 行的 `<el-table-column label="上报营收及剩余合同存量">` 多级表头组内
**操作**: 在该组的最后一个子列（截止本月剩余合同存量）之后，增加一列：

```html
<el-table-column
  label="下月计划"
  prop="nextMonthPlan"
  width="120"
  align="right"
>
  <template #default="scope">
    {{ formatNumber(scope.row.nextMonthPlan) }}
  </template>
</el-table-column>
```

**数据层修改**:

* `rawData` 数组中每条记录增加 `nextMonthPlan` 字段（合理模拟值）

* `calculateDerivedFields` 函数无需改动

* `calculateTotalsForFiltered` 函数增加 `nextMonthPlan` 的合计累加

* `reportColumns` 配置数组增加对应项

#### 2.2 产品类总营收 tab — 在"当年计划"前增加"指标完成率"

**位置**: 第 293-302 行的"当年计划"列之前
**操作**: 插入"指标完成率"列（复用施工类的进度条样式）：

```html
<el-table-column
  label="指标完成率"
  prop="completionRate"
  width="140"
  align="center"
>
  <template #default="scope">
    <!-- 进度条 + 百分比 -->
  </template>
</el-table-column>
```

**数据层修改**:

* `productData` 数组每条记录增加 `completionRate = (annualActual / revenueTarget) * 100`

* `getProductSummaries` 方法处理新列

#### 2.3 单位确认

* 当前已显示"单位：万元"（第 9 行），**无需改动**

***

### 改动 3：营收明细表 (`RevenueDetail.vue`) — 大幅重构

#### 3.1 表头字段调整

**新的表头列顺序**（共 22 列）：

| 序号 | 列名         | 对应 prop                  | 类型             | 备注           |
| -- | ---------- | ------------------------ | -------------- | ------------ |
| 1  | 序号         | type=index               | 固定左            | -            |
| 2  | 项目编号       | projectCode              | 固定左            | -            |
| 3  | 项目名称       | projectName              | 固定左            | tooltip 截断   |
| 4  | 基层单位（简称）   | unit                     | el-tag         | 标签显示         |
| 5  | 项目状态       | status                   | el-tag         | 颜色区分         |
| 6  | 营收统计口径     | revenueCaliber           | el-tag primary | -            |
| 7  | 是否协管项目     | isCoManaged              | el-switch      | 绿色高亮行        |
| 8  | 合同金额(不含税)  | contractAmount           | 数字右对齐          | formatNumber |
| 9  | 结转至当年及以后营收 | carryForwardRevenue      | 数字右对齐          | formatNumber |
| 10 | 当年计划营收     | annualPlanRevenue        | 数字右对齐          | formatNumber |
| 11 | 当年预计完成营收   | annualEstimatedRevenue   | 数字右对齐          | formatNumber |
| 12 | 计划较上期调整(%) | planAdjustmentRate       | 百分比            | 正负颜色         |
| 13 | 当月完成营收     | monthActualRevenue       | 数字右对齐          | formatNumber |
| 14 | 年度累计营收     | annualAccumulatedRevenue | 数字右对齐          | formatNumber |
| 15 | 开工累计营收     | startAccumulatedRevenue  | 数字右对齐          | formatNumber |
| 16 | 当月上报股份营收   | monthReportedRevenue     | 数字右对齐          | formatNumber |
| 17 | 年度上报股份营收   | annualReportedRevenue    | 数字右对齐          | formatNumber |
| 18 | 累计上报股份营收   | totalReportedRevenue     | 数字右对齐          | formatNumber |
| 19 | 截止当月剩余合同存量 | remainingContractAmount  | **数值型**        | 右对齐数字        |
| 20 | 形象进度       | progress                 | **进度条**        | 三色阈值         |
| 21 | 预警等级       | warningLevel             | el-tag         | 新增计算字段       |

**删除的列**:

* ~~所属区域~~ (`region`)

* ~~业主名称~~ (`owner`)

* ~~业态类型~~ (`sector`)

* ~~业务类型~~ (`businessType`)

* ~~生产开项时间~~ (`startTime`)

* ~~12 个月份列~~ (`month1`\~`month12`) — 从界面表格移除（保留在数据中供导出用）

#### 3.2 搜索栏扩展

**新增筛选条件**（在第 13-59 行筛选区域追加）：

| 筛选项   | 类型              | 说明                          |
| ----- | --------------- | --------------------------- |
| 项目名称  | el-input        | 文本模糊搜索 projectName          |
| 项目编号  | el-input        | 文本模糊搜索 projectCode          |
| 下调百分比 | el-input-number | 过滤 planAdjustmentRate < 输入值 |
| 预警等级  | el-select       | 全部/黄色预警/橙色预警/红色预警           |

**保留原有筛选**: 基层单位、项目状态、营收统计口径、是否协管项目

#### 3.3 特殊字段处理

**剩余合同存量（数值型）**:

* 当前已是数值型展示（formatNumber），确认保持不变即可

**形象进度（进度条）**:

* 当前已有进度条实现（第 314-332 行），**保持现有实现**

**预警等级（新增计算字段）**:

* 基于 `startTime` 和 `revenueCaliber` 计算三级预警逻辑（复用现有 filteredData 中的 warningLevel 筛选逻辑）

* 在 `calculateTotalReportedRevenue` 或独立 computed 中派生 `warningLevel` 字段

#### 3.4 导出功能实现

**导出按钮位置**: 标题栏右侧（与汇总表风格一致）

**导出逻辑**（使用 xlsx 库）:

**Sheet1 — 营收明细表（实际）**:
字段：序号、项目编号、项目名称、基层单位、所属区域、业主名称、项目状态、营收统计口径、是否协管项目、业务类型、合同金额(不含税)、结转至当年及以后营收、当年计划营收、当年预计完成营收、年度累计营收、开工累计营收、年度上报股份营收、累计上报股份营收、1月完成营收\~12月完成营收

**Sheet2 — 营收明细表（计划）**:
字段：序号、项目编号、项目名称、基层单位、所属区域、业主名称、项目状态、营收统计口径、是否协管项目、业务类型、合同金额(不含税)、结转至当年及以后营收、年度累计营收、年度上报股份营收、累计上报股份营收、1月上报营收\~12月上报营收

**注意**: rawData 中已有 month1-month12 数据和 region/owner/businessType 字段，导出时直接从 rawData 取值。单位统一为元。

#### 3.5 单位确认

* 当前已显示"单位：元"（第 9 行），**无需改动**

***

### 改动 4：偏差项目表 (`RevenueDeviation.vue`)

#### 4.1 菜单改名 & Tab 化改造

**侧边栏菜单修改** (`Sidebar.vue` 第 150 行):

```javascript
// 改前
{ name: '当月偏差项目表', key: 'revenue-deviation' }
// 改后
{ name: '偏差项目表', key: 'revenue-deviation' }
```

**标题修改** (第 8 行):

```html
<!-- 改前 -->
<h2>当月偏差项目明细表</h2>
<!-- 改后 -->
<h2>偏差项目表</h2>
```

**Tab 结构改造**:

* 外层包裹 `<el-tabs v-model="activeDeviationTab">`

* Tab1: `label="当月偏差项目表"` name="monthly" — **原有内容迁移至此**

* Tab2: `label="季度偏差表"` name="quarterly" — **全新内容**

#### 4.2 当月偏差项目表 Tab（原内容迁移）

* 将现有全部模板内容（筛选栏 + 表格）移入 `v-if="activeDeviationTab === 'monthly'"` 条件块

* **新增导出按钮**（标题栏右侧）

* 数据和逻辑基本保持不变

* 导出时以万元为单位，保留两位小数

#### 4.3 季度偏差表 Tab（全新）

**表头字段**（共 20 列）：

| 序号 | 列名         | prop                     | 类型           | <br /> |
| -- | ---------- | ------------------------ | ------------ | :----- |
| 1  | 序号         | type=index               | 固定左          | <br /> |
| 2  | 项目编号       | projectCode              | 固定左          | <br /> |
| 3  | 项目名称       | projectName              | 固定左          | <br /> |
| 4  | 基层单位       | unit                     | -            | <br /> |
| 5  | 是否产运管理重点项目 | isKeyProject             | el-tag       | <br /> |
| 6  | 项目状态       | status                   | el-tag       | <br /> |
| 7  | 偏差触发类型     | deviationTriggerType     | el-tag       | 新增字段   |
| 8  | 合同价（不含税）   | contractAmount           | 数字           | <br /> |
| 9  | 结转至当年及以后营收 | carryForwardRevenue      | 数字           | <br /> |
| 10 | 本年计划营收     | annualPlanRevenue        | 数字           | <br /> |
| 11 | 本年累计营收     | annualAccumulatedRevenue | 数字           | <br /> |
| 12 | 开工累计营收     | totalAccumulatedRevenue  | 数字           | <br /> |
| 13 | 本季度原批复计划   | quarterOriginalPlan      | 数字可编辑        | <br /> |
| 14 | 本季度修订后计划   | quarterRevisedPlan       | 数字可编辑        | <br /> |
| 15 | 本年/本季计划下调额 | planReductionAmount      | 派生计算         | <br /> |
| 16 | 营收偏差原因     | deviationReason          | textarea 可编辑 | <br /> |
| 17 | 计划采取措施及节点  | correctiveMeasures       | textarea 可编辑 | <br /> |
| 18 | 纠偏完成情况     | correctiveStatus         | el-select    | <br /> |
| 19 | 备注         | remark                   | input 可编辑    | <br /> |

**Mock 数据**: 新增 `quarterlyRawData` 数组（约 10-15 条记录），包含上述所有字段

**筛选栏**: 复用项目编号、项目名称、基层单位、是否重点项目筛选器

**导出功能**: 以万元为单位，保留两位小数

#### 4.4 单位变更

**界面显示单位**: 从"万元"改为"元"（第 9 行 span 文本）
**数据层面**: rawData 中的金额值保持万元量级不变（因为当前 mock 值已经是万元），但标注改为"元"。如果需要数值上真正变为"元"（即乘以 10000），则需要对所有金额字段 × 10000。

**决策**: 界面标签改为"元"，但 mock 数据值暂时保持不变（后续对接真实接口时再调整）。导出时按用户要求以万元为单位并保留两位小数。

***

## 四、假设与决策

| # | 假设/决策                        | 理由                     |
| - | ---------------------------- | ---------------------- |
| 1 | 使用 `xlsx` 库实现导出              | 轻量、支持多 sheet、社区成熟      |
| 2 | 明细表界面移除 12 月份列但保留在数据中        | 用户要求的界面表头不含月份列，但导出需要   |
| 3 | 预警等级基于现有 warningLevel 筛选逻辑反推 | 复用已有的黄/橙/红三级时间判断逻辑     |
| 4 | 偏差表界面单位改"元"但数据暂不 ×10000      | 避免 mock 数据出现超大数值，标注优先  |
| 5 | 季度偏差表使用独立的 mock 数据源          | 与当月偏差表结构差异较大，不宜共用      |
| 6 | 不引入额外的状态管理库                  | 当前项目规模适合 props/emit 模式 |

***

## 五、实施步骤（按执行顺序）

### Step 1: 安装依赖

* 运行 `npm install xlsx`

### Step 2: 修改营收汇总表 RevenueSummary.vue

* 2a: rawData 增加 nextMonthPlan 字段

* 2b: 施工类 tab 的"上报营收及剩余合同存量"组增加"下月计划"列

* 2c: productData 增加 completionRate 字段

* 2d: 产品类 tab 的"当年计划"前插入"指标完成率"列

* 2e: 更新 calculateTotalsForFiltered 和 getProductSummaries

### Step 3: 重构营收明细表 RevenueDetail.vue

* 3a: 调整表头列定义（删除 5 列 + 删除 12 月列 + 增加预警等级列）

* 3b: 扩展搜索栏（增加项目名称、项目编号、下调百分比、预警等级）

* 3c: 增加 warningLevel 派生字段计算

* 3d: 更新 filteredData 筛选逻辑

* 3e: 实现导出功能（双 sheet，含 12 月数据）

* 3f: 添加导出按钮到标题栏

### Step 4: 改造偏差项目表 RevenueDeviation.vue

* 4a: 修改标题为"偏差项目表"，单位改为"元"

* 4b: 引入 el-tabs 包裹，原内容迁入"当月偏差项目表"tab

* 4c: 为当月偏差 tab 添加导出按钮和导出逻辑

* 4d: 新增"季度偏差表"tab（完整表格 + Mock 数据 + 筛选）

* 4e: 为季度偏差 tab 添加导出按钮和导出逻辑

### Step 5: 修改侧边栏菜单 Sidebar.vue

* 5a: "当月偏差项目表" → "偏差项目表"

### Step 6: 验证测试

* 6a: 启动 dev server `npm run dev`

* 6b: 逐页验证各表格列、筛选、导出功能\
  其他没提到的不做修改

