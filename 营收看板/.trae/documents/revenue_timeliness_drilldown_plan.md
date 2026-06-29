# 营收计划上报及时性下钻方案

## Summary（摘要）

在营收管理看板的"营收计划上报及时性"模块中，为"应上报"、"已上报"、"待上报"三个数据项添加点击下钻功能，跳转至营收明细表并分别展示全部数据、`是否已上报年度计划=是`、`是否已上报年度计划=否`的数据。

## Current State Analysis（现状分析）

### 关键文件
- **看板视图**：`e:\trae_demo_env\营收看板\src\views\RevenueDashboard.vue`
- **明细表组件**：`e:\trae_demo_env\营收看板\src\components\revenue\RevenueDetail.vue`

### 现状
1. **"营收计划上报及时性"模板**（RevenueDashboard.vue 第 218-272 行）：
   - 圆环中心显示"应上报"数值（`timelinessSingle.totalShouldReport`，第 256 行），圆环 div 有 `cursor-pointer` 样式但**无 @click**。
   - "已上报"数值（`timelinessSingle.submitted`，第 264 行）和"待上报"数值（`timelinessSingle.pending`，第 268 行）均**无 @click**。
2. **`handleTimelinessDrill` 函数**（第 465-479 行）：已存在但**未绑定到模板**。当前逻辑：`type === 'pending'` 跳转 `image-view`，其余跳转 `revenue-detail` 并传 `{ hasPlanRevenue: true }`。
3. **下钻事件流**：`emit('navigate', { view: 'revenue', report: 'revenue-detail', filter: {...} })` → App.vue `handleNavigate` → RevenueReport.vue → RevenueDetail.vue `initialFilter` prop。
4. **RevenueDetail.vue onMounted**（第 2438-2491 行）：读取 `props.initialFilter` 各字段设置筛选器，已支持 `unit`、`statisticType`、`statusNotIn`、`hasPlanRevenue`、`warningLevel`、`detailYear`、`detailMonth`，但**不支持 `isReportedAnnualPlan`**。

## Proposed Changes（具体变更）

### 变更 1：为三个数据项添加点击事件（RevenueDashboard.vue 模板）

**1a. 圆环"应上报"**（第 245 行，已有 `cursor-pointer`，补加 `@click`）：
```html
<div :title="'完成率：' + timelinessSingle.percentage + '%'"
     class="relative w-24 h-24 cursor-pointer hover:opacity-90 flex-shrink-0"
     @click="handleTimelinessDrill('all')">
```

**1b. "已上报"行**（第 262-265 行，添加 `cursor-pointer hover:bg-blue-50 rounded px-1` 和 `@click`）：
```html
<div class="text-gray-700 cursor-pointer hover:bg-blue-50 rounded px-1 transition-colors"
     @click="handleTimelinessDrill('submitted')">
  <span class="text-blue-600 font-medium">&#9679;</span> 已上报
  <span class="ml-1.5 font-medium text-blue-600">{{ timelinessSingle.submitted }}</span>
</div>
```

**1c. "待上报"行**（第 266-269 行，添加 `cursor-pointer hover:bg-gray-100 rounded px-1` 和 `@click`）：
```html
<div class="text-gray-500 cursor-pointer hover:bg-gray-100 rounded px-1 transition-colors"
     @click="handleTimelinessDrill('pending')">
  <span class="text-gray-400 font-medium">&#9711;</span> 待上报
  <span class="ml-1.5 font-medium text-gray-600">{{ timelinessSingle.pending }}</span>
</div>
```

### 变更 2：重写 `handleTimelinessDrill` 函数（RevenueDashboard.vue 第 465-479 行）

```js
const handleTimelinessDrill = (type) => {
  if (type === 'all') {
    // 应上报：查看全部数据（传空字符串显式重置筛选）
    emit('navigate', {
      view: 'revenue',
      report: 'revenue-detail',
      filter: { isReportedAnnualPlan: '' }
    })
  } else if (type === 'submitted') {
    // 已上报：查看是否已上报年度计划=是的数据
    emit('navigate', {
      view: 'revenue',
      report: 'revenue-detail',
      filter: { isReportedAnnualPlan: '是' }
    })
  } else if (type === 'pending') {
    // 待上报：查看是否已上报年度计划=否的数据
    emit('navigate', {
      view: 'revenue',
      report: 'revenue-detail',
      filter: { isReportedAnnualPlan: '否' }
    })
  }
}
```

### 变更 3：RevenueDetail.vue onMounted 新增 `isReportedAnnualPlan` 处理（第 2481 行后）

在 `detailMonth` 处理之后、`nextTick` 校验之前插入：
```js
if (props.initialFilter.isReportedAnnualPlan !== undefined) {
  filters.value.isReportedAnnualPlan = props.initialFilter.isReportedAnnualPlan
}
```

**说明**：使用 `!== undefined` 判断（而非 `if (props.initialFilter.isReportedAnnualPlan)`），确保空字符串 `''` 也能正确设置——"应上报"传 `''` 时显式重置筛选为"全部"，覆盖 localStorage 中可能保存的旧值。

## Assumptions & Decisions（假设与决策）

1. **使用 `isReportedAnnualPlan` 而非 `hasPlanRevenue`**：虽然两者逻辑等价（`hasPlanRevenue: true` ≡ `isReportedAnnualPlan: '是'`），但用户明确要求"查看是否已上报年度计划=是/否的数据"，且 `isReportedAnnualPlan` 是用户可见的筛选字段，下钻后下拉框会显示对应值，体验更直观。
2. **"应上报"传 `{ isReportedAnnualPlan: '' }`**：传空字符串而非 `{}`，确保显式重置筛选条件，避免 localStorage 缓存的旧筛选值干扰。
3. **`handleTimelinessDrill` 原有 'pending'→'image-view' 逻辑被替换**：原函数未绑定到模板，可安全替换。

## Verification Steps（验证步骤）

1. 打开营收管理看板，找到"营收计划上报及时性"模块。
2. 点击圆环中心"应上报"数值 → 跳转至营收明细表，筛选栏"是否已上报年度计划"显示"全部"，展示全部 45 条数据。
3. 返回看板，点击"已上报" → 跳转至营收明细表，筛选栏显示"是"，展示 35 条已上报数据。
4. 返回看板，点击"待上报" → 跳转至营收明细表，筛选栏显示"否"，展示 10 条待上报数据。
5. 验证鼠标悬停时三个元素有可点击的视觉反馈（hover 背景色变化）。
