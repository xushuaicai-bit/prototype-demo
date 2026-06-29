# 营收明细表新增"是否已上报年度计划"字段方案

## Summary（摘要）

在营收明细表（`RevenueDetail.vue`）中新增搜索筛选条件和列表列"是否已上报年度计划"（值：是/否），并按业务规则调整预警等级计算逻辑，最后造 10 条"否"的数据覆盖橙预警、黄预警、正常三种预警等级。

## Current State Analysis（现状分析）

### 关键文件
- **营收明细表组件**：`e:\trae_demo_env\营收看板\src\components\revenue\RevenueDetail.vue`
- 当前共有 **35 条**记录（id 1-35），全部定义在组件内部的 `rawData` 数组（第 482-1813 行）。
- **所有 35 条记录的 `annualPlanRevenue` 均 > 0**（即全部为"已上报年度计划=是"的情况）。

### 当前预警等级计算逻辑（`calculateTotalReportedRevenue`，第 1815-1871 行）
- **无 `annualPlanRevenue` 的项目**（≤0）：基于开工时长判断
  - 新接项目：开工 >2 月→橙色预警；>1 月→黄色预警；否则→正常
  - 历年结转项目：年度已过 >1 月→橙色预警；>0.5 月→黄色预警；否则→正常
- **有 `annualPlanRevenue` 的项目**（>0）：基于营收完成率判断
  - 完成率 < 预期*0.5→橙色预警；<预期*0.75→黄色预警；否则→正常

### 当前搜索筛选条件（filters ref，第 465-477 行）
已有：基层单位、项目状态、营收统计口径、是否协管项目、项目名称、项目编号、下调百分比、预警等级、年月。

### 当前表格列（第 139-398 行）
共 21 列，其中第 10 列为"当年计划营收"（`annualPlanRevenue`），第 21 列为"预警等级"（`warningLevel`）。

## Assumptions & Decisions（假设与决策）

1. **`isReportedAnnualPlan` 字段采用"派生"方式**：在 `calculateTotalReportedRevenue()` 中根据 `annualPlanRevenue` 派生（`annualPlanRevenue > 0 → '是'`，否则→`'否'`）。**无需修改 35 条现有记录**，避免大量重复编辑且保证数据一致性。

2. **预警等级计算调整**：根据业务规则——
   - "是"（已上报）→ `warningLevel` 强制为 `''`（正常），**移除原有的完成率判断逻辑**。
   - "否"（未上报）→ 保留原有的开工时长判断逻辑（已能产生橙色/黄色/正常）。

3. **新列位置**：表格列插入在"当年计划营收"列**之前**，与计划相关字段成组。搜索筛选插入在"是否协管项目"筛选之后。

4. **10 条新数据分布**：4 条橙色预警 + 3 条黄色预警 + 3 条正常。全部为"新接项目"（`revenueCaliber: '新接项目'`），通过 `startTime` 控制预警等级。当前日期 2026-06-29，30 天前≈5/30，60 天前≈4/30。

## Proposed Changes（具体变更）

### 变更 1：修改预警等级计算逻辑（`calculateTotalReportedRevenue`，第 1815-1871 行）

**目的**：派生 `isReportedAnnualPlan` 字段并调整预警等级计算。

**修改后逻辑**：
```js
const calculateTotalReportedRevenue = (data) => {
  const currentMonth = new Date().getMonth() + 1
  return data.map(item => {
    let total = 0
    let monthReported = 0
    for (let i = 1; i <= 12; i++) {
      const val = item[`month${i}`] || 0
      total += val
      if (i === currentMonth) {
        monthReported = val
      }
    }

    // 派生：是否已上报年度计划
    const isReportedAnnualPlan = (item.annualPlanRevenue && item.annualPlanRevenue > 0) ? '是' : '否'

    // 预警等级计算
    const now = new Date()
    const currentYear = now.getFullYear()
    const yearStart = new Date(currentYear, 0, 1)
    const startTimeVal = item.startTime ? new Date(item.startTime) : null
    const isNewProject = item.revenueCaliber === '新接项目'

    let oneMonth = 30 * 24 * 60 * 60 * 1000
    let twoMonths = 2 * oneMonth

    let warningLevel = ''
    // 仅"否"（未上报年度计划）的项目参与预警等级计算
    if (isReportedAnnualPlan === '否') {
      if (isNewProject && startTimeVal) {
        const elapsed = now.getTime() - startTimeVal.getTime()
        if (elapsed > twoMonths) warningLevel = '橙色预警'
        else if (elapsed > oneMonth) warningLevel = '黄色预警'
      } else {
        const yearElapsed = now.getTime() - yearStart.getTime()
        if (yearElapsed > oneMonth) warningLevel = '橙色预警'
        else if (yearElapsed > oneMonth / 2) warningLevel = '黄色预警'
      }
    }
    // "是"（已上报年度计划）的项目预警等级恒为正常（''）

    return {
      ...item,
      isReportedAnnualPlan,
      totalReportedRevenue: total,
      monthReportedRevenue: monthReported,
      warningLevel: warningLevel
    }
  })
}
```

**关键变化**：删除原第 1852-1862 行的"基于完成率的预警"分支（针对有 annualPlanRevenue 的项目），新增 `isReportedAnnualPlan` 派生字段并加入返回对象。

### 变更 2：新增搜索筛选条件

**2a. filters ref 新增字段**（第 465-477 行）：
在 `isCoManaged: '',` 之后新增 `isReportedAnnualPlan: '',`

**2b. 筛选 UI**（第 67 行后，"是否协管项目"筛选之后）：
```vue
<div class="flex items-center">
  <label class="text-sm text-gray-600 mr-2">是否已上报年度计划：</label>
  <el-select v-model="filters.isReportedAnnualPlan" placeholder="请选择" class="w-32">
    <el-option label="全部" value="" />
    <el-option label="是" value="是" />
    <el-option label="否" value="否" />
  </el-select>
</div>
```

**2c. 筛选逻辑**（`filteredData` computed，第 1887 行 `isCoManaged` 筛选之后）：
```js
if (filters.value.isReportedAnnualPlan) {
  data = data.filter(item => item.isReportedAnnualPlan === filters.value.isReportedAnnualPlan)
}
```

**2d. handleReset**（第 2033-2045 行）：在重置对象中新增 `isReportedAnnualPlan: '',`

**2e. watch**（第 1943-1947 行）：在监听数组中新增 `() => filters.value.isReportedAnnualPlan`

### 变更 3：新增表格列

**位置**：第 242 行（"当年计划营收"列）之前插入新列：
```vue
<el-table-column
  label="是否已上报年度计划"
  prop="isReportedAnnualPlan"
  width="160"
  align="center"
>
  <template #default="scope">
    <el-tag :type="scope.row.isReportedAnnualPlan === '是' ? 'success' : 'info'" size="small">
      {{ scope.row.isReportedAnnualPlan }}
    </el-tag>
  </template>
</el-table-column>
```

### 变更 4：新增 10 条"否"的数据（rawData 末尾，第 1812 行 `}` 后追加）

**数据设计**（id 36-45，全部 `annualPlanRevenue: 0`，`revenueCaliber: '新接项目'`）：

| id | 预警等级 | startTime | 设计依据（距今） |
|----|---------|-----------|----------------|
| 36 | 橙色预警 | 2026-03-05 | ~116 天 > 60 天 |
| 37 | 橙色预警 | 2026-03-12 | ~109 天 > 60 天 |
| 38 | 橙色预警 | 2026-03-20 | ~101 天 > 60 天 |
| 39 | 橙色预警 | 2026-04-10 | ~80 天 > 60 天 |
| 40 | 黄色预警 | 2026-05-05 | ~55 天，>30 且 ≤60 |
| 41 | 黄色预警 | 2026-05-12 | ~48 天，>30 且 ≤60 |
| 42 | 黄色预警 | 2026-05-20 | ~40 天，>30 且 ≤60 |
| 43 | 正常 | 2026-06-05 | ~24 天 ≤ 30 |
| 44 | 正常 | 2026-06-12 | ~17 天 ≤ 30 |
| 45 | 正常 | 2026-06-20 | ~9 天 ≤ 30 |

**单条记录结构示例（id 36）**：
```js
{
  id: 36,
  projectCode: 'XM-2024-036',
  projectName: '闵行区河道生态修复工程（未上报计划）',
  unit: '生态事业部',
  region: '闵行',
  owner: '闵行区水务局',
  status: '在建',
  revenueCaliber: '新接项目',
  isCoManaged: '否',
  businessType: '水环境治理',
  contractAmount: 32000000,
  carryForwardRevenue: 0,
  annualAccumulatedRevenue: 4500000,
  quarterlyAccumulatedRevenue: 1500000,
  annualReportedRevenue: 4200000,
  totalReportedRevenue: 4200000,
  remainingContractAmount: 27500000,
  annualPlanRevenue: 0,
  annualEstimatedRevenue: 0,
  planAdjustmentRate: 0,
  monthActualRevenue: 800000,
  startAccumulatedRevenue: 4500000,
  progress: 15,
  startTime: '2026-03-05',
  month1: 0, month2: 0, month3: 0,
  month4: 1500000, month5: 1300000, month6: 1400000,
  month7: 0, month8: 0, month9: 0,
  month10: 0, month11: 0, month12: 0
}
```
其余 9 条按上表 startTime 和预警等级要求构造，字段保持完整、数值合理。`carryForwardRevenue`、`annualPlanRevenue`、`annualEstimatedRevenue` 均设为 0；月度营收按开工时间分布。

### 变更 5：Excel 导出新增列（`exportExcel`，第 2049-2084 行 & 2087-2119 行）

**Sheet1（实际）**：在 `'当年计划营收'` 字段之前新增：
```js
'是否已上报年度计划': (item.annualPlanRevenue && item.annualPlanRevenue > 0) ? '是' : '否',
```
**Sheet2（计划）**：在 `'合同金额(不含税)'` 之前（或`'业务类型'`之后）新增同样的字段。

**列宽**：在 `ws1['!cols']` 和 `ws2['!cols']` 数组中对应位置插入 `{ wch: 18 }`。

## Verification Steps（验证步骤）

1. **启动项目**：`cd e:\trae_demo_env\营收看板 && npm run dev`，打开营收看板→营收明细表。
2. **验证列显示**：确认"当年计划营收"列左侧出现"是否已上报年度计划"列，现有 35 条显示为绿色"是"标签，新增 10 条显示为灰色"否"标签。
3. **验证搜索筛选**：
   - 选"是"→仅显示 35 条原数据，预警等级全部为"正常"。
   - 选"否"→仅显示 10 条新数据，预警等级包含橙色/黄色/正常。
   - 配合"预警等级"筛选：选"否"+橙色预警→4 条；选"否"+黄色预警→3 条；选"否"+正常→3 条。
4. **验证当年计划营收列**："否"的记录该列显示"-"（formatNumber 对 0 返回 '-'）。
5. **验证重置**：点击"重置"按钮，"是否已上报年度计划"筛选恢复为"全部"。
6. **验证 Excel 导出**：点击导出，检查两个 Sheet 均含"是否已上报年度计划"列且值正确。
7. **验证合计行**：新列合计行显示"-"（非数值字段）。
