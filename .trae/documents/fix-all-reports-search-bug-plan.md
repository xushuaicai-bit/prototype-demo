# 修复所有报表搜索/筛选无响应问题

## 根因分析

三个营收报表的 **el-table 绑定的分页数据源均直接从原始数据切片，绕过了筛选逻辑**，导致无论怎么选择筛选条件，表格显示的数据都不会变化。

### 各组件具体问题

| 组件 | 表格绑定数据 | 分页数据来源 | 筛选 computed | 问题 |
|------|-------------|-------------|-------------|------|
| RevenueDetail.vue | `paginatedData` (L120) | `rawData` 直接切片 (L1892) | `filteredData` (L1826) | paginatedData 未使用 filteredData |
| RevenueDeviation.vue 当月 tab | `monthlyPaginatedData` (L96) | `rawData` 直接切片 (L1403) | `filteredData` (L1380) | monthlyPaginatedData 未使用 filteredData |
| RevenueDeviation.vue 季度 tab | `quarterlyPaginatedData` (L447) | `quarterlyRawData` 直接切片 (L1429) | `quarterlyFilteredData` (L1406) | quarterlyPaginatedData 未使用 quarterlyFilteredData |

## 修改方案

### 文件 1: [RevenueDetail.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueDetail.vue)

**位置**: 第 1889-1893 行 `paginatedData`

```javascript
// 改前（bug）
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return calculateTotalReportedRevenue(rawData).slice(start, end)
})

// 改后（修复）
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})
```

### 文件 2: [RevenueDeviation.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueDeviation.vue)

**修改 A**: 第 1400-1404 行 `monthlyPaginatedData`

```javascript
// 改前（bug）
const monthlyPaginatedData = computed(() => {
  const start = (monthlyPage.value - 1) * monthlyPageSize.value
  const end = start + monthlyPageSize.value
  return calculateDerivedFields(rawData).slice(start, end)
})

// 改后（修复）
const monthlyPaginatedData = computed(() => {
  const start = (monthlyPage.value - 1) * monthlyPageSize.value
  const end = start + monthlyPageSize.value
  return filteredData.value.slice(start, end)
})
```

**修改 B**: 第 1426-1430 行 `quarterlyPaginatedData`

```javascript
// 改前（bug）
const quarterlyPaginatedData = computed(() => {
  const start = (quarterlyPage.value - 1) * quarterlyPageSize.value
  const end = start + quarterlyPageSize.value
  return calculateQuarterlyDerivedFields(quarterlyRawData).slice(start, end)
})

// 改后（修复）
const quarterlyPaginatedData = computed(() => {
  const start = (quarterlyPage.value - 1) * quarterlyPageSize.value
  const end = start + quarterlyPageSize.value
  return quarterlyFilteredData.value.slice(start, end)
})
```

### 文件 3: [RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue) — 无需修改

汇总表的 `paginatedConstructionData` 已正确使用 `filterDataByUnits` 进行筛选，搜索功能应正常工作。如用户反馈仍有问题则需进一步排查。

## 验证

修改后逐一测试：
1. 营收明细表：选择基层单位、项目状态、输入项目名称等 → 表格数据应变
2. 偏差项目表-当月：选择月份、输入项目编号 → 表格数据应变
3. 偏差项目表-季度：选择基层单位、是否重点项目 → 表格数据应变
