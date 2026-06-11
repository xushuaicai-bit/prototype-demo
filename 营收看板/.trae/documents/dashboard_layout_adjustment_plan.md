# 营收看板模块顺序调整实施计划

## 需求概述

### 1. 模块顺序调整

将营收看板的模块按以下顺序排列，没提到的部分保持原样：

1. **营收计划上报及时性**
2. **营收月度统计**
3. **当年累计完成营收情况**
4. **X月营收偏差情况**（位于底部自成一排）

### 2. 布局要求

* 前3个模块（营收计划上报及时性、营收月度统计、当年累计完成营收情况）放在一排

* 横坐标文字内容不变，位置排布自适应收窄。

* 如果空间不够，横坐标文字竖向排布或提供横向拉动条

* X月营收偏差情况位于看板底部自成一排

### 3. 营收计划上报及时性图例修改

* 蓝色代表应上报

* 绿色代表已上报

* 橙色代表待上报

* 绿色和橙色做堆叠柱状图，相加数量等于蓝色

### 4. 营收月度统计tooltip修改

* 鼠标悬浮显示的内容应为金额（万元）

* 当前显示的是数量

### 5. 当年累计营收下钻功能

* 点击"产品类" → 下钻至营收汇总表的"产品类总营收"tab

* 点击"其他业态类" → 下钻至营收汇总表的"其他业态总营收"tab

***

## 修改文件清单

仅修改 `src/views/RevenueDashboard.vue` 一个文件

***

## 详细实施步骤

### 第一步：调整模板布局结构

#### 1.1 将三个图表模块移到同一行

```vue
<!-- 新布局：三个图表并排 -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <!-- 营收计划上报及时性 -->
  <div class="bg-white rounded-xl p-4 shadow-sm">
    ...
  </div>
  
  <!-- 营收月度统计 -->
  <div class="bg-white rounded-xl p-4 shadow-sm">
    ...
  </div>
  
  <!-- 当年累计完成营收情况 -->
  <div class="bg-white rounded-xl p-4 shadow-sm">
    ...
  </div>
</div>

<!-- X月营收偏差情况独占一行 -->
<div class="grid grid-cols-1 gap-4">
  <div class="lg:col-span-3 bg-white rounded-xl p-4 shadow-sm">
    <!-- X月营收偏差情况 -->
  </div>
</div>
```

### 第二步：修改营收计划上报及时性图表配置

#### 2.1 修改图例和数据

```javascript
// 修改前
legend: { data: ['已上报', '未上报'], bottom: 0 },
series: [
  { name: '已上报', type: 'bar', data: [180, ...], itemStyle: { color: '#1890ff' } },
  { name: '未上报', type: 'bar', data: [60, ...], itemStyle: { color: '#52c41a' } }
]

// 修改后
legend: { data: ['应上报', '已上报', '待上报'], bottom: 0 },
series: [
  { name: '应上报', type: 'bar', data: [240, ...], itemStyle: { color: '#1890ff' } },
  { name: '已上报', type: 'bar', stack: 'status', data: [180, ...], itemStyle: { color: '#52c41a' } },
  { name: '待上报', type: 'bar', stack: 'status', data: [60, ...], itemStyle: { color: '#fa8c16' } }
]
```

#### 2.2 配置横坐标自适应

```javascript
xAxis: {
  type: 'category',
  data: [...],
  axisLabel: {
    interval: 0,
    rotate: 45,
    fontSize: 10
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      type: 'slider',
      height: 20,
      bottom: 10
    }
  ]
}
```

### 第三步：修改营收月度统计tooltip

#### 3.1 修改tooltip显示内容

```javascript
// 修改前
tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }

// 修改后
tooltip: {
  trigger: 'axis',
  axisPointer: { type: 'shadow' },
  formatter: (params) => {
    const name = params[0].name
    let result = `<div style="font-weight:bold;margin-bottom:8px;">${name}</div>`
    params.forEach(param => {
      result += `<div>${param.marker}${param.seriesName}: ${param.value}万元</div>`
    })
    return result
  }
}
```

### 第四步：修改当年累计营收下钻函数

#### 4.1 更新handleSummaryDrill函数

```javascript
const handleSummaryDrill = (tabType) => {
  const tabMap = {
    '施工类': 'construction',
    '产品类': 'product-revenue',
    '其他业态类': 'other-revenue'
  }
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-summary',
    filter: {
      unit: selectedFilter.value,
      tab: tabMap[tabType] || 'construction'
    }
  })
}
```

***

## 数据说明

### 营收计划上报及时性数据调整

* 应上报 = 已上报 + 待上报

* 示例数据：

  * 管网事业部：应上报240，已上报180，待上报60

  * 生态事业部：应上报240，已上报160，待上报80

  * 以此类推...

### 营收月度统计数据

* 保持现有数据不变

* 仅修改tooltip显示格式

***

## 风险评估

* **风险等级**：低

* **主要风险**：布局调整可能影响响应式显示

* **应对措施**：使用grid布局确保自适应

***

## 验证方案

1. 启动开发服务器
2. 检查模块顺序是否正确
3. 验证三个图表是否在同一行
4. 测试营收计划上报及时性的堆叠柱状图
5. 验证营收月度统计的tooltip显示金额
6. 测试产品类和其他业态类的下钻功能

