# 营收明细表 — 预警等级调整计划

## 一、需求概述

1. 当前所有项目预警等级都是"正常" → 需要让部分项目显示**橙色预警**和**黄色预警**
2. **删除红色预警**：从筛选器选项和数据计算逻辑中完全移除

## 二、当前状态分析

### 文件: [RevenueDetail.vue](src/components/revenue/RevenueDetail.vue)

#### 筛选器 (L86-92)
```html
<el-option label="红色预警" value="red" />     ← 需删除
<el-option label="黄色预警" value="yellow" />
<el-option label="橙色预警" value="orange" />
<el-option label="正常" value="normal" />
```

#### 过滤逻辑 (L1849-L1852)
```javascript
if (filters.value.warningLevel === 'red') return ...    ← 需删除
if (filters.value.warningLevel === 'yellow') return ...
if (filters.value.warningLevel === 'orange') return ...
if (filters.value.warningLevel === 'normal') return ...
```

#### 数据计算 (L1776-L1788) — 核心问题所在
```javascript
let warningLevel = ''
if (!item.annualPlanRevenue || item.annualPlanRevenue <= 0) {
  if (isNewProject && startTimeVal) {
    const elapsed = now.getTime() - startTimeVal.getTime()
    if (elapsed > threeMonths) warningLevel = '红色预警'     ← 删除此行
    else if (elapsed > twoMonths) warningLevel = '橙色预警'
    else if (elapsed > oneMonth) warningLevel = '黄色预警'
  } else {
    const yearElapsed = now.getTime() - yearStart.getTime()
    if (yearElapsed > twoMonths) warningLevel = '红色预警'   ← 删除此行
    else if (yearElapsed > oneMonth) warningLevel = '橙色预警'
    else if (yearElapsed > oneMonth / 2) warningLevel = '黄色预警'
  }
}
```

**为什么全是"正常"？** 因为大部分 `rawData` 项目都有 `annualPlanRevenue > 0`，导致整个 if 块不进入，warningLevel 保持空字符串（显示为"正常"）。

## 三、具体改动

### 改动1: 删除筛选器中的红色预警 (L88)

删除 `<el-option label="红色预警" value="red" />` 这一行。

### 改动2: 删除过滤逻辑中的红色 (L1849)

删除 `if (filters.value.warningLevel === 'red') return item.warningLevel === '红色预警'` 这一行。

### 改动3: 修改预警计算逻辑 (L1780, L1785)

两处改动：

**a. 新增立项分支**: 将 `threeMonths → twoMonths`（原红→橙），`twoMonths → oneMonth`（原橙→黄）
```javascript
// 原来
if (elapsed > threeMonths) warningLevel = '红色预警'
else if (elapsed > twoMonths) warningLevel = '橙色预警'
else if (elapsed > oneMonth) warningLevel = '黄色预警'

// 改为
if (elapsed > twoMonths) warningLevel = '橙色预警'
else if (elapsed > oneMonth) warningLevel = '黄色预警'
```

**b. 非新增立项分支**: 同样降级，并将阈值缩短让更多项目触发
```javascript
// 原来
if (yearElapsed > twoMonths) warningLevel = '红色预警'
else if (yearElapsed > oneMonth) warningLevel = '橙色预警'
else if (yearElapsed > oneMonth / 2) warningLevel = '黄色预警'

// 改为：基于营收完成率判断（更合理）
```

### 改动4: 增加基于完成率的预警判定（确保有橙/黄值）

在现有 `if (!item.annualPlanRevenue || item.annualPlanRevenue <= 0)` 块**之后**，追加新的预警逻辑：

```javascript
// 基于营收完成率的预警（针对有计划营收的项目）
if (!warningLevel && item.annualPlanRevenue > 0) {
  const rate = (item.annualAccumulatedRevenue || 0) / item.annualPlanRevenue
  // 年中(6月)完成率低于30%→橙色，30%-50%→黄色
  const monthNow = now.getMonth() + 1  // 当前月份
  const expectedRate = monthNow / 12   // 期望完成率（6月=50%）
  if (rate < expectedRate * 0.5) {
    warningLevel = '橙色预警'
  } else if (rate < expectedRate * 0.75) {
    warningLevel = '黄色预警'
  }
}
```

这样：
- 完成率远低于期望进度 → 橙色预警
- 完成率略低 → 黄色预警
- 正常进度 → 空字符串（显示"正常"）

## 四、验证步骤

- [ ] 筛选器只有：全部/黄色预警/橙色预警/正常（无红色预警）
- [ ] 表格中部分项目显示橙色预警(el-tag warning)、部分显示黄色预警、其余为正常
- [ ] 选择"橙色预警"/"黄色预警"可正确过滤
