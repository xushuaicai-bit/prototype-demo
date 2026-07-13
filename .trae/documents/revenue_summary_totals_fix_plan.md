# 营收汇总表-施工类总营收合计值丢失修复方案

## Summary（摘要）

营收汇总表"施工类"标签页的合计行在初始渲染时为空，因为 `constructionTotals` 通过 computed 副作用赋值，导致 `el-table` 的 `getConstructionSummaries` 在首次渲染时读到 `null`。修复方式是将 `constructionTotals` 从 `ref` 改为独立 `computed`。

## Current State Analysis（现状分析）

**文件**：`e:\trae_demo_env\营收看板\src\components\revenue\RevenueSummary.vue`

**Bug 根因**（3 处代码协作导致）：

1. **第 652 行**：`const constructionTotals = ref(null)` — 初始化为 `null`。
2. **第 1223-1229 行**：`filteredConstructionData` computed 内部通过副作用 `constructionTotals.value = totals` 赋值（第 1227 行）。这是 Vue 反模式——computed 不应有副作用。
3. **第 120 行**：`el-table` 绑定的是 `paginatedConstructionData`（第 1232-1239 行），该 computed **不触发** `filteredConstructionData`，因此不设置 `constructionTotals`。
4. **第 468 行**：`filteredConstructionData` 仅被分页组件的 `:total="filteredConstructionData.length"` 消费，渲染顺序在 `el-table` 之后。

**结果**：首次渲染时 `el-table` 调用 `getConstructionSummaries`（第 1262 行），此时 `constructionTotals.value` 仍为 `null`，`|| {}` 回退使所有合计列返回空字符串 `''`。虽然后续 `filteredConstructionData` 被求值后可能触发重渲染，但在某些场景下（如切换标签页、筛选条件变化时）合计行会持续为空。

## Proposed Changes（具体变更）

### 变更 1：删除 `constructionTotals` ref 声明（第 652 行）

删除：
```js
const constructionTotals = ref(null)
```

### 变更 2：移除 `filteredConstructionData` 中的副作用（第 1223-1229 行）

**修改前**：
```js
const filteredConstructionData = computed(() => {
  const calculated = calculateDerivedFields(constructionData.value)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  const totals = calculateTotalsForFiltered(filtered)
  constructionTotals.value = totals
  return [...filtered]
})
```

**修改后**：
```js
const filteredConstructionData = computed(() => {
  const calculated = calculateDerivedFields(constructionData.value)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  return filtered
})
```

### 变更 3：新增 `constructionTotals` computed（紧接 `filteredConstructionData` 之后）

```js
const constructionTotals = computed(() => {
  const calculated = calculateDerivedFields(constructionData.value)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  return calculateTotalsForFiltered(filtered)
})
```

### 无需修改的部分

- `getConstructionSummaries`（第 1262-1273 行）：已使用 `constructionTotals.value` 读取，`computed` 与 `ref` 访问方式一致，无需改动。

## Assumptions & Decisions（假设与决策）

1. **选择 `computed` 而非其他方案**：`computed` 保证响应式且无副作用，Vue 会自动缓存和惰性求值，`getConstructionSummaries` 调用时总能拿到最新值。
2. **`filteredConstructionData` 返回值简化**：原代码 `return [...filtered]` 创建浅拷贝无实际必要（filter 已返回新数组），简化为 `return filtered`。
3. **重复计算可接受**：`calculateDerivedFields` + `filterDataByUnits` 会在 `filteredConstructionData`、`constructionTotals`、`paginatedConstructionData` 三个 computed 中各执行一次。数据量仅 10 行，性能影响可忽略。未来优化可提取公共 computed，但不在本次修复范围内。

## Verification Steps（验证步骤）

1. 启动服务，进入"营收管理看板 → 营收汇总表"。
2. 确认"施工类"标签页的合计行首次渲染即显示数值（非空）。
3. 切换年份/月份，确认合计行同步更新。
4. 使用筛选功能选择部分单位，确认合计行仅反映筛选后的数据。
5. 切换到其他标签页再切回"施工类"，确认合计行正常显示。
6. 翻页操作，确认合计行保持不变（合计应反映全部筛选数据，非当前页）。
