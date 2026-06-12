# 修复营收明细表初始加载为空的问题

## 根因分析

[RevenueDetail.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueDetail.vue) 的 `onMounted`（L2088-2122）存在两个导致初始数据为空的原因：

### 原因 1：localStorage 持久化了过期的筛选值

组件在 `onMounted` 时从 `localStorage` 加载保存的筛选条件（L2090-2092）：
```javascript
const savedFilters = localStorage.getItem('revenueDetailFilters')
if (savedFilters) {
  filters.value = { ...filters.value, ...JSON.parse(savedFilters) }
}
```

如果用户之前使用的是旧版数据（`revenueCaliber` 值如 `'新增立项'`、`'结转在建项目'`），localStorage 中会保存这些旧值。但当前数据的 `revenueCaliber` 已改为 `'年初结转实施项目'` 等新名称，旧筛选值匹配不到任何记录 → 表格为空。

### 原因 2：initialFilter 的 statisticType 映射不完整

从看板页面跳转时，`props.initialFilter.statisticType` 可能传入旧名称（如 `'新增立项'`），而 `statisticTypeMap`（L2103-2107）只包含部分映射：
```javascript
const statisticTypeMap = {
  '新接项目': '新接项目',
  '年初结转实施项目': '年初结转实施项目',
  '年初结转待结项目': '年初结转待结项目'
}
```

缺少对旧名称的映射（`'新增立项'`、`'结转在建项目'`、`'完工待结算项目'` 等），导致 fallback 使用原始旧值，与当前数据不匹配。

### 为什么"重置"有效

`handleReset`（L1986-1998）将所有筛选条件重置为空值，清除了过期/不匹配的筛选条件，所以数据恢复显示。但重置后 watch 会把空状态存回 localStorage，下次进入时如果又有 initialFilter 注入不匹配值，问题仍会出现。

## 修改方案

### 文件: [RevenueDetail.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueDetail.vue)

#### 修改 1: 完善 statisticTypeMap 映射（L2103-2107）

增加旧名称到新名称的映射：
```javascript
const statisticTypeMap = {
  // 新名称
  '新接项目': '新接项目',
  '年初结转实施项目': '年初结转实施项目',
  '年初结转待结项目': '年初结转待结项目',
  // 旧名称映射到新名称（兼容从看板跳转）
  '新增立项': '年初结转实施项目',
  '结转在建项目': '年初结转实施项目',
  '完工待结算项目': '年初结转待结项目'
}
```

#### 修改 2: 增加初始加载后的数据校验（onMounted 末尾）

在 `onMounted` 最后添加校验逻辑：如果应用完所有筛选后结果为空且确实有 rawData 数据，则自动重置筛选条件：
```javascript
// 校验：如果筛选后无数据但有原始数据，说明筛选条件可能过期，自动重置
import { nextTick } from 'vue'
// 在 onMounted 末尾添加：
nextTick(() => {
  if (rawData.length > 0 && filteredData.value.length === 0) {
    // 有数据但筛选后为空，可能是过期筛选条件，自动重置
    handleReset()
  }
})
```

注意：需要在 import 中加入 `nextTick`（L391 行已有 ref/computed 等导入，追加 nextTick 即可）

## 验证

1. 清除浏览器 localStorage 后刷新 → 应正常显示全部数据
2. 从看板带筛选参数跳转 → 应正确映射并显示数据
3. 点击重置后数据正常 → 保持不变
