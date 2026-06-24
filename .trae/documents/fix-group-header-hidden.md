# 修复：一级分组标题取消勾选后表格中仍显示

## Summary
列设置中取消一级分组字段后，其下子列虽然被隐藏了，但**分组表头本身**（如"结转至当年及以后营收"）仍在表格中显示。原因是 6 个父级 `<el-table-column>` 没有根据分组的 visible 状态添加 `v-if`。

## Current State Analysis

### 根因
模板中 6 个分组父列**没有 `v-if` 条件**：

| 行号 | 分组标题 | 当前状态 |
|---|---|---|
| 175 | `结转至当年及以后营收` | 无 v-if，始终渲染 |
| 211 | `当月计划营收` | 无 v-if，始终渲染 |
| ~258 | `当月完成营收` | 无 v-if，始终渲染 |
| 305 | `本年度计划营收` | 无 v-if，始终渲染 |
| 352 | `本年度累计完成营收` | 无 v-if，始终渲染 |
| 399 | `上报营收及剩余合同存量` | 无 v-if，始终渲染 |

### 当前 visibleColumns 的定义（第 984-986 行）
```js
const visibleColumns = computed(() => {
  return new Set(allColumnOptions.value.filter(col => col.visible && !col.isGroup).map(col => col.prop))
})
```
过滤掉了 `isGroup` 项，所以无法用来控制分组父列的显隐。

## Proposed Changes

### 文件：`e:\trae_demo_env\营收看板\src\components\revenue\RevenueSummary.vue`

#### 改动 1：修改 visibleColumns — 去掉 !col.isGroup 过滤，让分组 prop 也进入 Set

```js
// 改前
const visibleColumns = computed(() => {
  return new Set(allColumnOptions.value.filter(col => col.visible && !col.isGroup).map(col => col.prop))
})

// 改后
const visibleColumns = computed(() => {
  return new Set(allColumnOptions.value.filter(col => col.visible).map(col => col.prop))
})
```

这样 `visibleColumns` 会同时包含分组 prop（如 `_group_carryForward`）和普通字段 prop。

#### 改动 2：给 6 个父级分组列添加 v-if

```vue
<!-- 第175行 -->
<el-table-column label="结转至当年及以后营收" v-if="visibleColumns.has('_group_carryForward')">

<!-- 第211行 -->
<el-table-column label="当月计划营收" v-if="visibleColumns.has('_group_monthlyPlan')">

<!-- 当月完成营收（约第258行） -->
<el-table-column label="当月完成营收" v-if="visibleColumns.has('_group_monthlyActual')">

<!-- 第305行 -->
<el-table-column label="本年度计划营收" v-if="visibleColumns.has('_group_plan')">

<!-- 第352行 -->
<el-table-column label="本年度累计完成营收" v-if="visibleColumns.has('_group_actual')">

<!-- 第399行 -->
<el-table-column label="上报营收及剩余合同存量" v-if="visibleColumns.has('_group_report')">
```

## Verification Steps
1. 打开营收汇总表 → 列设置 → 取消勾选任意一个一级分组（如【结转至当年及以后营收】）
2. 确认表格中该分组标题及其下所有子列全部消失
3. 重新勾选该分组 → 确认分组标题和子列恢复显示
4. 对其余 5 个分组重复验证
5. 全选/反选 → 确认所有分组标题同步显隐
