# 营收汇总表列设置：一级分组字段可取消勾选

## Summary
将 RevenueSummary.vue 列设置面板中的一级分组字段（如"结转至当年及以后营收"、"当月计划营收"等）从**强制选中、不可取消**改为**可自由勾选/取消**，取消时联动隐藏其下所有子列。

## Current State Analysis

### 当前问题
1. **模板第 98-103 行**：一级字段 checkbox 硬编码为 `:model-value="true"` + `disabled`，用户无法取消勾选
2. **allColumnOptions 数据（第 950 行起）**：`isGroup: true` 的项没有 `visible` 属性
3. **全选逻辑（第 988-997 行）**：`toggleAllColumns` 和 `isAllSelected` 均用 `!c.isGroup` 过滤掉了分组项
4. **表格渲染**：分组表头 `<el-table-column label="xxx">` 始终显示，仅子列通过 `v-if="visibleColumns.has(prop)"` 控制显隐

### 分组与子列的对应关系
| 分组 prop | 子列 props |
|---|---|
| `_group_carryForward` | carryForwardConstruction, completedPendingSettlement, carryForwardTotal |
| `_group_monthlyPlan` | monthlyPlanConstruction, monthlyPlanCompleted, monthlyPlanNew, monthlyPlanTotal |
| `_group_monthlyActual` | monthlyActualConstruction, monthlyActualCompleted, monthlyActualNew, monthlyActualTotal |
| `_group_plan` | planConstruction, planCompleted, planNew, planTotal |
| `_group_actual` | actualConstruction, actualCompleted, actualNew, actualTotal |
| `_group_report` | reportedRevenue, newContractAmount, remainingContract |

## Proposed Changes

### 文件：`e:\trae_demo_env\营收看板\src\components\revenue\RevenueSummary.vue`

#### 改动 1：模板 — 一级字段 checkbox 去掉 disabled，绑定 v-model（第 98-103 行）

```vue
<!-- 改前 -->
<el-checkbox
  v-if="col.isGroup"
  :model-value="true"
  disabled
  class="!font-bold !text-gray-500"
>{{ col.label }}</el-checkbox>

<!-- 改后 -->
<el-checkbox
  v-if="col.isGroup"
  v-model="col.visible"
  class="!font-bold !text-gray-700"
  @change="(val) => toggleGroup(col, val)"
>{{ col.label }}</el-checkbox>
```

#### 改动 2：allColumnOptions 数据 — 给每个 isGroup 项添加 visible: true（第 954/958/963/968/973/978 行）

共 6 个分组项，每项增加 `visible: true`：
```js
{ label: '【结转至当年及以后营收】', prop: '_group_carryForward', isGroup: true, visible: true },
{ label: '【当月计划营收】', prop: '_group_monthlyPlan', isGroup: true, visible: true },
// ... 其余4个同理
```

#### 改动 3：新增 toggleGroup 方法 — 一级字段勾选/取消时联动子列

在 `toggleAllColumns` 方法之前新增：

```js
// 分组与子列的映射关系
const groupChildMap = {
  _group_carryForward: ['carryForwardConstruction', 'completedPendingSettlement', 'carryForwardTotal'],
  _group_monthlyPlan: ['monthlyPlanConstruction', 'monthlyPlanCompleted', 'monthlyPlanNew', 'monthlyPlanTotal'],
  _group_monthlyActual: ['monthlyActualConstruction', 'monthlyActualCompleted', 'monthlyActualNew', 'monthlyActualTotal'],
  _group_plan: ['planConstruction', 'planCompleted', 'planNew', 'planTotal'],
  _group_actual: ['actualConstruction', 'actualCompleted', 'actualNew', 'actualTotal'],
  _group_report: ['reportedRevenue', 'newContractAmount', 'remainingContract']
}

// 切换分组时联动子列
const toggleGroup = (groupCol, visible) => {
  const children = groupChildMap[groupCol.prop] || []
  children.forEach(childProp => {
    const child = allColumnOptions.value.find(c => c.prop === childProp)
    if (child && !child.fixed) {
      child.visible = visible
    }
  })
}
```

#### 改动 4：更新 toggleAllColumns / isAllSelected — 移除 !c.isGroup 过滤

```js
// toggleAllColumns - 改前过滤了 !c.isGroup，改为不过滤分组项
const toggleAllColumns = () => {
  const allVisible = allColumnOptions.value.filter(c => !c.fixed).every(c => c.visible)
  allColumnOptions.value.forEach(col => {
    if (!col.fixed) col.visible = !allVisible
  })
}

// isAllSelected - 同理移除 !c.isGroup
const isAllSelected = computed(() => {
  return allColumnOptions.value.filter(c => !c.fixed).every(c => c.visible)
})
```

> 注意：全选时需要同步处理分组项的子列联动。由于 toggleAllColumns 直接设置每个项的 `col.visible`，而分组项的 `@change` 会触发 `toggleGroup`，所以全选操作会自动通过 checkbox 的 change 事件联动子列。但直接赋值可能不触发 change 事件，因此需要在 toggleAllColumns 中额外调用 toggleGroup：

```js
const toggleAllColumns = () => {
  const allVisible = allColumnOptions.value.filter(c => !c.fixed).every(c => c.visible)
  const newValue = !allVisible
  allColumnOptions.value.forEach(col => {
    if (!col.fixed) {
      col.visible = newValue
      // 如果是分组项，联动子列
      if (col.isGroup) {
        toggleGroup(col, newValue)
      }
    }
  })
}
```

#### 改动 5（可选增强）：子列全部手动勾选时自动勾选父级分组

当用户手动将某个分组的所有子列都勾选时，自动将该分组也标记为可见；反之所有子列都取消时自动取消分组。这可以通过 watch 或在每个子列 checkbox 的 change 中判断实现。

**建议暂不做此改动**，保持简单——用户可通过点击分组标题来批量操作，不需要反向联动。

## Assumptions & Decisions
- 取消一个分组时，其下所有子列统一隐藏（包括 non-fixed 子列）；fixed 列（如"基层单位"）不受影响
- 分组表头本身不需要额外加 v-if，因为 Element Plus 的 el-table-column 在没有可见子列时会自动收起
- 全选/反选时分组和子列一起切换

## Verification Steps
1. 打开营收汇总表 → 点击"列设置"
2. 验证每个一级分组字段（如【结转至当年及以后营收】）的 checkbox 可以正常勾选/取消
3. 取消某个分组 → 确认该分组下的所有子列在表格中被隐藏
4. 重新勾选某个分组 → 确认子列恢复显示
5. 点击"全选" → 确认所有分组和子列都被选中
6. 再次点击"全选"（反选）→ 确认所有分组和子列都取消
