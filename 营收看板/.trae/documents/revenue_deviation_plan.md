# 营收偏差情况模块实施计划

## 需求概述

### 1. 模块更名
将"X月营收构成情况"修改为"X月营收偏差情况"

### 2. X月取值逻辑
当月5日至次月5日，显示数据为上月的数据
- 5月5日-6月5日期间显示**4月**的偏差数据
- 6月5日-7月5日期间显示**5月**的偏差数据
- 以此类推

### 3. 偏差情况显示内容
显示9个基层单位的数据：
- 项目偏差数（当月营收完成率<80%的项目数量）
- 重点项目偏差数（是否产运管理重点项目=是的项目中，完成率<80%的）
- 一般项目偏差数（完成率<80% 且 |偏差| > 500万元）
- 总偏差额

### 4. 下钻功能
点击某基层单位行，下钻至"当月偏差项目表"，按该单位筛选

### 5. 当月偏差项目表新增字段
在"备注"字段前新增：
- 当月完成率 = 当月完成营收 / 当月计划营收
- 当月营收负偏差 = 当月完成营收 - 当月计划营收

---

## 修改文件清单

### 1. `src/views/RevenueDashboard.vue`
- 修改"X月营收构成情况"模块为"X月营收偏差情况"
- 实现X月动态取值逻辑
- 添加9个基层单位的偏差数据展示
- 添加点击下钻功能

### 2. `src/components/revenue/RevenueDeviation.vue`
- 新增"当月完成率"字段（在备注前）
- 新增"当月营收负偏差"字段（在备注前）
- 补充偏差相关模拟数据

### 3. `src/App.vue`
- 确保handleDashboardNavigate函数支持传递筛选参数到当月偏差项目表

---

## 详细实施步骤

### 第一步：修改RevenueDashboard.vue - X月偏差情况模块

#### 1.1 添加X月计算逻辑
```javascript
const getCurrentDeviationMonth = () => {
  const now = new Date()
  const day = now.getDate()
  const currentMonth = now.getMonth() + 1
  
  if (day < 5) {
    return currentMonth - 1
  }
  return currentMonth
}
```

#### 1.2 添加偏差数据
```javascript
const deviationData = ref([
  { unit: '管网事业部', keyProjectCount: 2, generalProjectCount: 1, totalDeviation: -1500 },
  // ... 9个单位
])
```

#### 1.3 添加点击事件
```javascript
const handleDeviationDrill = (unit) => {
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-deviation',
    filter: { unit: unit }
  })
}
```

#### 1.4 修改模板
将"X月营收构成情况"模块改为显示偏差数据

### 第二步：修改RevenueDeviation.vue - 新增字段

#### 2.1 新增表格列
在"备注"字段前添加：
```html
<el-table-column label="当月完成率" width="120" align="center">
  <template #default="scope">
    {{ (scope.row.completionRate).toFixed(2) }}%
  </template>
</el-table-column>

<el-table-column label="当月营收负偏差" width="130" align="right">
  <template #default="scope">
    <span :class="{ 'text-red-600': scope.row.negativeDeviation < 0 }">
      {{ formatNumber(scope.row.negativeDeviation) }}
    </span>
  </template>
</el-table-column>
```

#### 2.2 计算新增字段
```javascript
const calculateDeviationFields = (data) => {
  return data.map(item => {
    const negativeDeviation = item.monthActualRevenue - item.monthPlanRevenue
    return {
      ...item,
      negativeDeviation,
      completionRate: item.monthPlanRevenue > 0 
        ? (item.monthActualRevenue / item.monthPlanRevenue) * 100 
        : 0
    }
  })
}
```

#### 2.3 补充模拟数据
增加更多项目数据，确保9个基层单位都有数据

### 第三步：修改App.vue - 支持筛选参数传递

#### 3.1 修改handleDashboardNavigate
确保支持revenue-deviation报表的筛选参数传递

---

## 数据逻辑说明

### 偏差计算规则
1. **当月完成率** = 当月完成营收 / 当月计划营收 × 100%
2. **当月营收负偏差** = 当月完成营收 - 当月计划营收
3. **偏差数判定**：
   - 重点项目负偏差：完成率 < 80%
   - 一般项目负偏差：完成率 < 80% 且 |负偏差| > 500万元

### X月显示逻辑
```
日期判定：
- 如果当前日期 < 5号：显示上月数据
- 如果当前日期 >= 5号：显示当月数据
```

---

## 风险评估

- **风险等级**：中等
- **主要风险**：数据量大时性能问题
- **应对措施**：使用计算属性进行筛选，避免重复计算

---

## 验证方案

1. 启动开发服务器
2. 检查X月偏差情况模块显示是否正确
3. 测试点击下钻功能
4. 验证当月偏差项目表新增字段是否正确显示
5. 测试不同日期的X月取值逻辑