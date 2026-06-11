# 当年累计完成营收情况模块实施计划

## 需求概述

### 1. 新增"当年累计完成营收情况"模块
- 显示8个业态类型的项目数量和当年累计完成营收值
- 8个业态类型：投资、房产、产品销售、总承包、数字、设计、管线、城市运营
- 右上角切换标签：业态维度 ↔ 业务类型
- 使用柱状图展示
- 点击柱子可下钻至营收明细表

### 2. 业务类型维度
- 8个业务类型：水务、水环境治理、水利、固废处理与处置、土壤修复、城市更新、市政路桥房建、其他
- 同样显示项目数量和当年累计完成营收值

### 3. 营收明细表新增字段
- 业态类型
- 业务类型

---

## 修改文件清单

### 1. `src/views/RevenueDashboard.vue`
- 添加"当年累计完成营收情况"模块
- 添加业态/业务类型切换标签
- 添加柱状图展示
- 添加下钻函数

### 2. `src/components/revenue/RevenueDetail.vue`
- 添加"业态类型"字段列
- 添加"业务类型"字段列
- 更新模拟数据，添加新字段值
- 添加筛选逻辑支持

### 3. `src/App.vue`
- 确保下钻导航支持新的筛选参数

---

## 详细实施步骤

### 第一步：修改RevenueDashboard.vue

#### 1.1 添加新模块模板
```vue
<div class="bg-white rounded-xl p-4 shadow-sm">
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-sm font-semibold text-gray-800">当年累计完成营收情况</h3>
    <div class="flex bg-gray-100 rounded-lg p-1">
      <button 
        :class="[
          'px-3 py-1 text-sm rounded-md transition-colors',
          viewMode === 'sector' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        ]"
        @click="viewMode = 'sector'"
      >
        业态维度
      </button>
      <button 
        :class="[
          'px-3 py-1 text-sm rounded-md transition-colors',
          viewMode === 'business' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        ]"
        @click="viewMode = 'business'"
      >
        业务类型
      </button>
    </div>
  </div>
  <div ref="sectorChartRef" class="h-64"></div>
  <div class="mt-3 grid grid-cols-2 gap-4 text-center">
    <div class="bg-gray-50 rounded-lg p-3">
      <div class="text-2xl font-bold text-gray-800">{{ totalProjects }}</div>
      <div class="text-sm text-gray-500">项目总数</div>
    </div>
    <div class="bg-gray-50 rounded-lg p-3">
      <div class="text-2xl font-bold text-blue-600">{{ totalRevenue }}</div>
      <div class="text-sm text-gray-500">累计营收(万元)</div>
    </div>
  </div>
</div>
```

#### 1.2 添加数据和逻辑
```javascript
const viewMode = ref('sector')

const sectorData = ref([
  { name: '投资', projectCount: 5, revenue: 25000 },
  { name: '房产', projectCount: 3, revenue: 18000 },
  { name: '产品销售', projectCount: 12, revenue: 8500 },
  { name: '总承包', projectCount: 18, revenue: 45000 },
  { name: '数字', projectCount: 8, revenue: 12000 },
  { name: '设计', projectCount: 6, revenue: 6000 },
  { name: '管线', projectCount: 20, revenue: 38000 },
  { name: '城市运营', projectCount: 4, revenue: 15000 }
])

const businessData = ref([
  { name: '水务', projectCount: 15, revenue: 32000 },
  { name: '水环境治理', projectCount: 12, revenue: 28000 },
  { name: '水利', projectCount: 8, revenue: 18000 },
  { name: '固废处理与处置', projectCount: 5, revenue: 12000 },
  { name: '土壤修复', projectCount: 3, revenue: 8000 },
  { name: '城市更新', projectCount: 6, revenue: 15000 },
  { name: '市政路桥房建', projectCount: 10, revenue: 22000 },
  { name: '其他', projectCount: 4, revenue: 8500 }
])

const totalProjects = computed(() => {
  const data = viewMode.value === 'sector' ? sectorData.value : businessData.value
  return data.reduce((sum, item) => sum + item.projectCount, 0)
})

const totalRevenue = computed(() => {
  const data = viewMode.value === 'sector' ? sectorData.value : businessData.value
  return data.reduce((sum, item) => sum + item.revenue, 0)
})

const handleSectorDrill = (name) => {
  const filterKey = viewMode.value === 'sector' ? 'sector' : 'businessType'
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-detail',
    filter: { [filterKey]: name }
  })
}
```

### 第二步：修改RevenueDetail.vue

#### 2.1 添加表格列
```vue
<el-table-column
  label="业态类型"
  prop="sector"
  width="120"
  align="center"
/>
<el-table-column
  label="业务类型"
  prop="businessType"
  width="140"
  align="center"
/>
```

#### 2.2 更新模拟数据
为每条数据添加 sector 和 businessType 字段

#### 2.3 添加筛选支持
```javascript
if (filters.value.sector) {
  data = data.filter(item => item.sector === filters.value.sector)
}
if (filters.value.businessType) {
  data = data.filter(item => item.businessType === filters.value.businessType)
}
```

---

## 数据说明

### 业态类型列表
1. 投资
2. 房产
3. 产品销售
4. 总承包
5. 数字
6. 设计
7. 管线
8. 城市运营

### 业务类型列表
1. 水务
2. 水环境治理
3. 水利
4. 固废处理与处置
5. 土壤修复
6. 城市更新
7. 市政路桥房建
8. 其他

---

## 风险评估

- **风险等级**：中等
- **主要风险**：字段变更可能影响现有报表显示
- **应对措施**：逐步修改，保留关键数据字段

---

## 验证方案

1. 启动开发服务器
2. 检查新模块是否正确显示
3. 测试业态/业务类型切换功能
4. 测试柱状图下钻功能
5. 验证营收明细表新增字段是否正确显示