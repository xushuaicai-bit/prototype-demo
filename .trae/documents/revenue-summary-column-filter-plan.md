# 营收汇总表添加列筛选（显示/隐藏列）组件

## 需求

在营收汇总表施工类总营收 tab 的工具栏区域添加一个 **"列设置"按钮**，点击后弹出下拉面板，用户可通过勾选/取消勾选来控制各列的显示与隐藏。

## 当前状态

[RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue) 施工类表格共 **25 列**，分为以下列组：

| 序号 | 列名 | prop | 列组 |
|------|------|------|------|
| 1 | 基层单位 | name | 固定列 |
| 2 | 营收指标 | revenueTarget | - |
| 3 | 指标完成率 | completionRate | - |
| 4-6 | 结转至当年及以后营收(3子列) | carryForward* / completedPendingSettlement / carryForwardTotal | 结转组 |
| 7-10 | 当月计划营收(4子列) | monthlyPlan* (4) | 计划组 |
| 11-14 | 当月完成营收(4子列) | monthlyActual* (4) | 完成组 |
| 15-18 | 本年度计划营收(4子列) | plan* (4) | 年度计划组 |
| 19-22 | 本年度累计完成营收(4子列) | actual* (4) | 年度完成组 |
| 23-25 | 上报营收及剩余合同存量(3子列) | reportedRevenue / newContractAmount / remainingContract | 上报组 |

当前工具栏区域在 L30-L83，包含基层单位筛选器、搜索和重置按钮。

## 修改方案

### 文件：[RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue)

#### 修改 1：定义可见列配置（script 区域，约 L620 之后）

```javascript
// 列定义配置
const allColumnOptions = ref([
  { label: '基层单位', prop: 'name', visible: true, fixed: true },          // 固定不可隐藏
  { label: '营收指标', prop: 'revenueTarget', visible: true },
  { label: '指标完成率', prop: 'completionRate', visible: true },

  // 分组标题 - 仅用于展示
  { label: '【结转至当年及以后营收】', prop: '_group_carryForward', visible: true, isGroup: true },
  { label: '结转在建项目', prop: 'carryForwardConstruction', visible: true, group: 'carryForward' },
  { label: '完工待结算项目', prop: 'completedPendingSettlement', visible: true, group: 'carryForward' },
  { label: '结转至当年及以后营收合计', prop: 'carryForwardTotal', visible: true, group: 'carryForward' },

  { label: '【当月计划营收】', prop: '_group_monthlyPlan', visible: true, isGroup: true },
  { label: '结转在建项目', prop: 'monthlyPlanConstruction', visible: true, group: 'monthlyPlan' },
  { label: '完工待结算项目', prop: 'monthlyPlanCompleted', visible: true, group: 'monthlyPlan' },
  { label: '新接项目', prop: 'monthlyPlanNew', visible: true, group: 'monthlyPlan' },
  { label: '当月计划营收-合计', prop: 'monthlyPlanTotal', visible: true, group: 'monthlyPlan' },

  { label: '【当月完成营收】', prop: '_group_monthlyActual', visible: true, isGroup: true },
  { label: '结转在建项目', prop: 'monthlyActualConstruction', visible: true, group: 'monthlyActual' },
  { label: '完工待结算项目', prop: 'monthlyActualCompleted', visible: true, group: 'monthlyActual' },
  { label: '新接项目', prop: 'monthlyActualNew', visible: true, group: 'monthlyActual' },
  { label: '当月完成营收-合计', prop: 'monthlyActualTotal', visible: true, group: 'monthlyActual' },

  { label: '【本年度计划营收】', prop: '_group_plan', visible: true, isGroup: true },
  { label: '结转在建项目', prop: 'planConstruction', visible: true, group: 'plan' },
  { label: '完工待结算项目', prop: 'planCompleted', visible: true, group: 'plan' },
  { label: '新接项目', prop: 'planNew', visible: true, group: 'plan' },
  { label: '本年度计划营收-合计', prop: 'planTotal', visible: true, group: 'plan' },

  { label: '【本年度累计完成营收】', prop: '_group_actual', visible: true, isGroup: true },
  { label: '结转在建项目', prop: 'actualConstruction', visible: true, group: 'actual' },
  { label: '完工待结算项目', prop: 'actualCompleted', visible: true, group: 'actual' },
  { label: '新接项目', prop: 'actualNew', visible: true, group: 'actual' },
  { label: '本年度累计完成营收-合计', prop: 'actualTotal', visible: true, group: 'actual' },

  { label: '【上报营收及剩余合同存量】', prop: '_group_report', visible: true, isGroup: true },
  { label: '本年上报股份营收', prop: 'reportedRevenue', visible: true, group: 'report' },
  { label: '新接项目合同额（去税）', prop: 'newContractAmount', visible: true, group: 'report' },
  { label: '截止本月剩余合同存量', prop: 'remainingContract', visible: true, group: 'report' }
])

// 可见列的 prop 集合
const visibleColumns = computed(() => {
  return new Set(allColumnOptions.value.filter(col => col.visible && !col.isGroup).map(col => col.prop))
})

// 全选/取消全选
const toggleAllColumns = () => {
  const allVisible = allColumnOptions.value.every(c => c.visible || c.fixed)
  allColumnOptions.value.forEach(col => {
    if (!col.fixed && !col.isGroup) col.visible = !allVisible
  })
}

// 是否全选
const isAllSelected = computed(() => {
  return allColumnOptions.value.filter(c => !c.fixed && !c.isGroup).every(c => c.visible)
})
```

#### 修改 2：模板 - 添加列设置按钮（L82 搜索按钮之后）

在搜索/重置按钮的 `</div>` 内部末尾添加：

```html
<el-popover placement="bottom-end" :width="260" trigger="click">
  <template #reference>
    <button class="flex items-center px-4 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
      </svg>
      列设置
    </button>
  </template>
  <div class="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
    <div class="flex items-center justify-between pb-2 mb-2 border-b">
      <span class="text-sm font-medium text-gray-600">选择显示列</span>
      <el-checkbox :model-value="isAllSelected" @change="toggleAllColumns">全选</el-checkbox>
    </div>
    <div v-for="col in allColumnOptions" :key="col.prop" :class="{ 'pt-2 mt-1 border-t': col.isGroup }">
      <el-checkbox
        v-if="col.isGroup"
        :model-value="true"
        disabled
        :class="'font-bold text-gray-500'"
      >{{ col.label }}</el-checkbox>
      <el-checkbox
        v-else
        v-model="col.visible"
        :disabled="col.fixed"
        class="w-full"
      >
        {{ col.label }}
      </el-checkbox>
    </div>
  </div>
</el-popover>
```

#### 修改 3：每个 el-table-column 添加 v-if 控制

为每个 `el-table-column`（除固定列外）添加 `v-if` 条件：

```html
<el-table-column
  ...
  v-if="visibleColumns.has('revenueTarget')"
>
```

对全部 24 个非固定列逐一添加 `v-if="visibleColumns.has('对应prop')"`。

**注意**：对于多级表头组的父级 `<el-table-column label="xxx组">`，其 `v-if` 应基于该组内所有子列是否至少有一个可见。简化处理方式：父级列不设 v-if（即使子列全隐藏也不影响渲染），或用 computed 计算每组是否有可见子列。

**推荐简化方案**：仅对叶子节点（有 prop 的列）加 `v-if`，父级分组列不加。父级分组列即使子列全隐藏也保留表头结构即可（Element Plus 会自动处理空分组）。

#### 修改 4：底部固定合计行同步控制

底部合计行的每个 `<td>` 也需要对应的 `v-if`，保持与表格列一致。但 HTML `<table>` 中动态显隐 `<td>` 会导致列错位。

**更优方案**：底部合计行不做 v-if 控制，始终显示全部单元格。因为合计行是独立的 `<table>` 元素，与 el-table 的列宽通过 CSS 对齐，隐藏某些列时合计行仍显示完整数据不影响体验（用户可接受）。

## 涉及文件

仅 [RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue)

## 验证

1. 点击"列设置"按钮 → 弹出带分组的列选择面板
2. 取消勾选某列 → 表格中该列立即隐藏
3. 勾选回某列 → 该列恢复显示
4. "基层单位"列为 fixed，不可取消勾选
5. "全选"可一键切换所有可选列
6. 筛选条件不受影响
