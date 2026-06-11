# 营收明细表字段修改及预警下钻功能实施计划

## 需求概述

### 1. 营收明细表字段修改
将"结转至当年及以后营收"字段后的字段修改为：
- 当年计划营收
- 当年预计完成营收
- 计划较上期调整(%)
- 当月完成营收
- 年度累计营收
- 开工累计营收
- 当月上报股份营收
- 年度上报股份营收
- 累计上报股份营收
- 截止当月剩余合同存量
- 形象进度
- 生产开项时间

### 2. 营收计划上报及时性下钻
- 点击"应上报"柱子 → 下钻至营收明细表，筛选条件：项目状态 ≠ 业务销项/财务销项
- 点击"已上报"柱子 → 下钻至营收明细表，筛选条件：当年计划营收有值

### 3. 黄色预警下钻
- **当年新接项目**：当前时间 > 生产开项时间 + 1个月 且 ≤ 生产开项时间 + 2个月
- **历年结转项目**：当前时间 > 本年1月1日 + 1个月 且 ≤ 本年1月1日 + 2个月
- **共同条件**：当年计划营收没有值

### 4. 橙色预警下钻
- **当年新接项目**：当前时间 > 生产开项时间 + 2个月 且 ≤ 生产开项时间 + 3个月
- **历年结转项目**：当前时间 > 本年1月1日 + 2个月
- **共同条件**：当年计划营收没有值

### 5. 取消红色预警
移除红色预警相关功能

---

## 修改文件清单

### 1. `src/components/revenue/RevenueDetail.vue`
- 修改表格列定义，替换为新字段列表
- 更新模拟数据，添加新字段值
- 添加生产开项时间字段（日期类型）
- 添加形象进度字段（百分比类型）
- 添加筛选逻辑支持

### 2. `src/views/RevenueDashboard.vue`
- 修改营收计划上报及时性模块，添加点击下钻事件
- 修改预警模块，保留黄色和橙色预警，移除红色预警
- 添加预警下钻函数

### 3. `src/App.vue`
- 确保handleDashboardNavigate支持新的筛选参数

---

## 详细实施步骤

### 第一步：修改RevenueDetail.vue

#### 1.1 替换表格列
删除原有列，添加新列：
```vue
<el-table-column label="当年计划营收" prop="annualPlanRevenue" width="140" align="right" />
<el-table-column label="当年预计完成营收" prop="annualEstimatedRevenue" width="160" align="right" />
<el-table-column label="计划较上期调整(%)" prop="planAdjustmentRate" width="140" align="right" />
<el-table-column label="当月完成营收" prop="monthActualRevenue" width="140" align="right" />
<el-table-column label="年度累计营收" prop="annualAccumulatedRevenue" width="140" align="right" />
<el-table-column label="开工累计营收" prop="startAccumulatedRevenue" width="140" align="right" />
<el-table-column label="当月上报股份营收" prop="monthReportedRevenue" width="160" align="right" />
<el-table-column label="年度上报股份营收" prop="annualReportedRevenue" width="160" align="right" />
<el-table-column label="累计上报股份营收" prop="totalReportedRevenue" width="160" align="right" />
<el-table-column label="截止当月剩余合同存量" prop="remainingContractAmount" width="160" align="right" />
<el-table-column label="形象进度" prop="progress" width="120" align="center" />
<el-table-column label="生产开项时间" prop="startTime" width="140" align="center" />
```

#### 1.2 更新模拟数据
为每条数据添加新字段值

#### 1.3 添加筛选支持
支持通过URL参数接收筛选条件：
- statusNotIn: 排除的状态列表
- hasPlanRevenue: 是否有当年计划营收
- warningLevel: 预警级别（yellow/orange）

### 第二步：修改RevenueDashboard.vue

#### 2.1 修改营收计划上报及时性模块
添加点击事件处理：
```javascript
const handleTimelinessDrill = (type) => {
  if (type === 'pending') {
    emit('navigate', {
      view: 'revenue',
      report: 'revenue-detail',
      filter: { statusNotIn: ['业务销项', '财务销项'] }
    })
  } else {
    emit('navigate', {
      view: 'revenue',
      report: 'revenue-detail',
      filter: { hasPlanRevenue: true }
    })
  }
}
```

#### 2.2 修改预警模块
- 移除红色预警显示
- 添加黄色/橙色预警点击事件：
```javascript
const handleWarningDrill = (level) => {
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-detail',
    filter: { warningLevel: level }
  })
}
```

### 第三步：修改App.vue
确保handleDashboardNavigate支持新的筛选参数格式

---

## 数据逻辑说明

### 预警判定逻辑

#### 黄色预警
```
当年新接项目：
currentDate > startTime + 1个月 AND currentDate <= startTime + 2个月 AND annualPlanRevenue = null

历年结转项目：
currentDate > 本年1月1日 + 1个月 AND currentDate <= 本年1月1日 + 2个月 AND annualPlanRevenue = null
```

#### 橙色预警
```
当年新接项目：
currentDate > startTime + 2个月 AND currentDate <= startTime + 3个月 AND annualPlanRevenue = null

历年结转项目：
currentDate > 本年1月1日 + 2个月 AND annualPlanRevenue = null
```

### 计划较上期调整率计算
```
计划较上期调整(%) = (当年计划营收 - 上年计划营收) / 上年计划营收 × 100%
```

---

## 风险评估

- **风险等级**：中等
- **主要风险**：字段变更可能影响现有报表显示
- **应对措施**：逐步修改，保留关键数据字段

---

## 验证方案

1. 启动开发服务器
2. 检查营收明细表字段是否正确显示
3. 测试营收计划上报及时性下钻功能
4. 测试黄色/橙色预警下钻功能
5. 验证红色预警已移除