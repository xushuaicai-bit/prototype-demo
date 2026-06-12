# 供应链下钻报表无数据 Bug 修复计划

## 概述
从供应链看板点击任意位置下钻至「供应商合同签订报表」后，表格显示无数据。

## 根因分析

### 数据流追踪

```
SupplyChainDashboard.vue (第 165-171 行)
  handleDrillDown(filter) → emit('navigate', {
    view: 'supply-chain',
    report: 'supplier-contract',
    filter: { ...filter, unit: selectedFilter.value }  // ⚠️ selectedFilter 默认值 = '全部'
  })

    ↓

App.vue handleNavigate() → navigateFilter = { ..., unit: '全部' }

    ↓

SupplierContractReport.vue applyInitialFilter()
  → selectedUnit.value = '全部'  // ⚠️ 被设置为 '全部'

    ↓

filteredData computed (第 1132-1139 行):
  if (selectedUnit.value && project.unit !== selectedUnit.value) return false
  // selectedUnit.value = '全部' (truthy!)
  // 所有项目的 project.unit 都不等于 '全部'
  // → 全部被过滤掉 → 空数组 ❌
```

**核心问题**：`selectedFilter` 在 SupplyChainDashboard 中默认值为 **`'全部'`**（第 113 行），下钻时将 `unit: '全部'` 合并到 filter 中传递给报表。报表的 `filteredData` 将 `selectedUnit` 设为 `'全部'` 后，用 `project.unit !== '全部'` 过滤，导致所有项目数据都被排除。

## 修改方案

### 修改文件：`src/components/supply-chain/SupplierContractReport.vue`

**修改位置 1：`applyInitialFilter` 函数（第 1104-1106 行）**

当 `initialFilter.unit === '全部'` 时，不设置 `selectedUnit`（保持为空字符串），这样 `filteredData` 中的 `if (selectedUnit.value && ...)` 判断会因为空字符串为 falsy 而跳过单位过滤，显示全部单位的数据。

```javascript
// 修改前：
if (props.initialFilter.unit) {
  selectedUnit.value = props.initialFilter.unit
}

// 修改后：
if (props.initialFilter.unit && props.initialFilter.unit !== '全部') {
  selectedUnit.value = props.initialFilter.unit
}
```

**修改位置 2（可选加固）：`onMounted` 和 `watch` 去除 `nextTick` 包裹**

之前为了"加固时序"添加的 `nextTick` 可能导致在某些情况下 filter 应用延迟。恢复为直接调用：

```javascript
// 修改前：
onMounted(() => {
  nextTick(() => {
    applyInitialFilter()
  })
})
watch(() => props.initialFilter, (newFilter) => {
  if (newFilter && Object.keys(newFilter).length > 0) {
    nextTick(() => {
      applyInitialFilter()
    })
  }
}, { deep: true })

// 修改后：
onMounted(() => {
  applyInitialFilter()
})
watch(() => props.initialFilter, (newFilter) => {
  if (newFilter && Object.keys(newFilter).length > 0) {
    applyInitialFilter()
  }
}, { deep: true })
```

## 不需要修改的文件
- SupplyChainDashboard.vue — 下钻逻辑本身正确，无需改动
- App.vue — 路由切换逻辑正确
- 其他组件 — 无关

## 验证步骤
1. 启动开发服务器 `npm run dev`
2. 进入「产运管理」→「供应链管理看板」
3. 点击顶部「待签订总数」卡片 → 报表应显示未签订的合同数据
4. 点击顶部「已签订总数」卡片 → 报表应显示已签订的合同数据
5. 点击某分类下的「待签订」/「已签订」数字 → 应筛选对应分类+状态的数据
6. 点击红/橙/黄预警圆点 → 应显示对应预警级别的数据
7. 切换单位模式，点击饼图各扇区 → 应正确筛选
8. **切换"全部"模式，点击堆叠柱状图各颜色段 → 应显示对应数据（这是之前完全没数据的场景）**
