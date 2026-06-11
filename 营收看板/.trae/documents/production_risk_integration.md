# 生产风险情况模块整合计划

## 需求分析

将现有的三个小模块整合成一个大模块：
1. **风险预警及时性** - 显示风险预警相关统计
2. **生产风险情况** - 按等级统计风险数量
3. **风险开工令预警** - 显示红、橙、黄预警数量

整合后：
- 命名为"生产风险情况"
- 包含年月区间时间选择器
- 占一整行的位置

## 当前状态

- 三个组件各自独立分散在Dashboard中
- RiskTimeliness.vue：风险预警及时性
- RiskByLevel.vue：生产风险情况（按等级）
- WindRiskAlert.vue：风险开工令预警

## 实施步骤

### 1. 创建整合组件 ProductionRiskSituation.vue
- 文件：`src/components/dashboard/ProductionRiskSituation.vue`
- **布局结构**：三列布局
  - 第一列：风险预警及时性
  - 第二列：生产风险情况（按等级）
  - 第三列：风险开工令预警
- **顶部功能**：
  - 模块标题："生产风险情况"
  - 年月区间时间选择器（使用Element UI的DatePicker）
  - 年月范围选择，如：2025-01 至 2025-12

### 2. 创建组合组件 RiskTimelinessGroup.vue（可选）
- 将三个子组件的展示部分提取为可复用的展示组件
- 或者直接在主组件中内联实现

### 3. 更新mockData.js
- 文件：`src/data/mockData.js`
- 可以添加时间选择相关的数据结构（可选）

### 4. 更新Dashboard.vue
- 文件：`src/views/Dashboard.vue`
- 移除原有的RiskTimeliness、RiskByLevel、WindRiskAlert三个组件
- 添加新的ProductionRiskSituation组件
- 更新组件引用和props传递

## 组件设计

### ProductionRiskSituation.vue 结构

```vue
<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">生产风险情况</h3>
      <el-date-picker
        v-model="dateRange"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始年月"
        end-placeholder="结束年月"
        format="YYYY-MM"
        value-format="YYYY-MM"
      />
    </div>
    
    <div class="grid grid-cols-3 gap-4">
      <!-- 风险预警及时性 -->
      <RiskTimelinessInline />
      
      <!-- 生产风险情况（按等级） -->
      <RiskByLevelInline />
      
      <!-- 风险开工令预警 -->
      <WindRiskAlertInline />
    </div>
  </div>
</template>
```

### 子组件内联设计

为了保持一致性，可以在主组件中内联实现三个子模块的展示逻辑：

1. **风险预警及时性内联**：显示8个数据项（当年风险数量、进入风险、完成风险、剩余风险、未来两周风险等）

2. **生产风险情况（按等级）内联**：I级、II级、III级风险统计，带颜色标识

3. **风险开工令预警内联**：红色、橙色、黄色预警统计圆点

## 时间选择器功能

- 使用Element UI的DatePicker组件
- 设置type为"monthrange"（月份范围选择）
- 双向绑定到dateRange变量
- 格式化为"YYYY-MM"年月格式

## 数据流设计

```javascript
const dateRange = ref(['2025-01', '2025-12'])

const handleDateChange = (newRange) => {
  console.log('日期范围变更:', newRange)
  // 可以在这里触发数据更新
}
```

## 预期效果

```
┌─────────────────────────────────────────────────────────────────┐
│ 生产风险情况                    [2025-01 至 2025-12  📅]        │
├──────────────────────┬──────────────────────┬──────────────────┤
│ 风险预警及时性        │ 生产风险情况（按等级） │ 风险开工令预警    │
│ 当年一、二级风险: 2个 │ 🔴 I级风险 2个       │ 🔴 2  🟠 12 🟡 17 │
│ 当前进入风险: 2个     │ 🟠 II级风险 6个 1完成 │                   │
│ 当年完成风险: 2个     │ 🟡 III级风险 8个 2完成 │                   │
│ ...                  │                       │                   │
└──────────────────────┴──────────────────────┴──────────────────┘
```
