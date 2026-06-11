# 营收看板"当年累计完成营收情况"图表优化方案

## 一、需求概述

对营收看板的"当年累计完成营收情况"图表模块进行两项核心优化：
1. 将累计营收的展示方式从**柱状图**改为**折线图**
2. 将上方的汇总说明文字从**居中对齐**改为**左对齐**

---

## 二、当前状态分析

### 2.1 模块位置
**文件**: `e:\trae_demo_env\营收看板\src\views\RevenueDashboard.vue`
- **模板部分**: 第358-377行（当年累计完成营收情况模块）
- **脚本部分**: 第503-520行（数据定义）、第735-805行（ECharts配置）

### 2.2 当前UI结构

```
┌─────────────────────────────────────────────┐
│ 当年累计完成营收情况                         │  ← 标题（左对齐）
│                                             │
│         共 63 个项目，                        │  ← 汇总文字（居中❌）
│         累计营收 146,500 万元                 │
│                                             │
│  ┌─────────────────────────────────────────┐ │
│  │  📊 ECharts 双轴柱状图                   │ │
│  │                                         │ │
│  │  蓝色柱子 = 累计营收（万元）             │ │  ← 需要改为折线
│  │  紫色柱子 = 项目数量                     │ │  ← 保持不变
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 2.3 当前代码实现

#### 模板部分（第358-377行）
```vue
<div class="bg-white rounded-xl p-4 shadow-sm">
  <h3 class="text-sm font-semibold text-gray-800 mb-1">当年累计完成营收情况</h3>
  <!-- 汇总文字 - 当前居中对齐 -->
  <div class="text-center text-xs text-gray-500 mb-2">
    共 <span class="font-bold text-gray-700">{{ totalProjects }}</span> 个项目，
    累计营收 <span class="font-bold text-blue-600">{{ totalRevenue.toLocaleString() }}</span> 万元
  </div>
  <!-- 图表容器 -->
  <div ref="sectorChartRef" class="h-72 cursor-pointer"
       @click="handleSectorChartClick"></div>
</div>
```

#### 图表配置（initSectorChart函数，第735-805行关键段）
```javascript
chart.setOption({
  legend: { data: ['累计营收', '项目数量'], bottom: 2 },
  xAxis: {
    type: 'category',
    data: data.map(item => item.name),  // 业务类型：水务/水环境治理/水利等
    axisLabel: { interval: 0, rotate: 35 }
  },
  yAxis: [
    { type: 'value', name: '累计营收(万元)', position: 'left' },
    { type: 'value', name: '项目数量', position: 'right' }
  ],
  series: [
    {
      name: '累计营收',
      type: 'bar',                          // ❌ 当前是柱状图
      data: data.map(item => item.revenue),
      itemStyle: { color: '#1890ff' }       // 蓝色
    },
    {
      name: '项目数量',
      type: 'bar',                          // ✅ 保持柱状图
      yAxisIndex: 1,
      data: data.map(item => item.projectCount),
      itemStyle: { color: '#722ed1' }       // 紫色
    }
  ]
})
```

### 2.4 数据源
```javascript
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

// 计算属性
const totalProjects = computed(() => businessData.value.reduce((sum, item) => sum + item.projectCount, 0))  // 63
const totalRevenue = computed(() => businessData.value.reduce((sum, item) => sum + item.revenue, 0))          // 146,500
```

---

## 三、目标设计

### 3.1 目标UI结构

```
┌─────────────────────────────────────────────┐
│ 当年累计完成营收情况                         │  ← 标题（保持左对齐）
│ 共 63 个项目，                               │  ← 汇总文字（改为左对齐✅）
│ 累计营收 146,500 万元                        │
│                                             │
│  ┌─────────────────────────────────────────┐ │
│  │  📈 ECharts 混合图表                    │ │
│  │                                         │ │
│  │  ╭─╮ 蓝色折线 = 累计营收（万元）        │ │  ← 折线图
│  │  │ │                                   │ │
│  │  ╰─╯ 紫色柱子 = 项目数量               │ │  ← 保持柱状图
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 3.2 视觉效果说明

| 元素 | 修改前 | 修改后 |
|------|--------|--------|
| **累计营收系列** | 蓝色柱状图 | **蓝色折线图**（带圆点标记） |
| **项目数量系列** | 紫色柱状图 | 紫色柱状图（**保持不变**） |
| **汇总文字对齐** | 居中 (`text-center`) | **左对齐** (移除 `text-center`) |
| **图表类型** | 双轴柱状图 | **混合图表**（折线+柱状图） |

---

## 四、实施方案

### 4.1 修改文件清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/views/RevenueDashboard.vue` | **编辑** | 修改模板和ECharts配置 |

### 4.2 详细修改步骤

#### 步骤1: 修改汇总文字对齐方式（模板第366-370行）

**改动内容**:
```vue
<!-- 旧代码：居中对齐 -->
<div class="text-center text-xs text-gray-500 mb-2">
  共 <span class="font-bold text-gray-700">{{ totalProjects }}</span> 个项目，
  累计营收 <span class="font-bold text-blue-600">{{ totalRevenue.toLocaleString() }}</span> 万元
</div>

<!-- 新代码：左对齐（移除 text-center） -->
<div class="text-left text-xs text-gray-500 mb-2">
  共 <span class="font-bold text-gray-700">{{ totalProjects }}</span> 个项目，
  累计营收 <span class="font-bold text-blue-600">{{ totalRevenue.toLocaleString() }}</span> 万元
</div>
```

**具体操作**: 将 `class="text-center"` 改为 `class="text-left"`

#### 步骤2: 修改ECharts图表配置（第770-785行左右）

**改动内容**: 将"累计营收"系列的 `type` 从 `'bar'` 改为 `'line'`

**旧配置**:
```javascript
series: [
  {
    name: '累计营收',
    type: 'bar',                                    // ❌ 柱状图
    data: data.map(item => item.revenue),
    itemStyle: { color: '#1890ff' }                 // 蓝色填充
  },
  {
    name: '项目数量',
    type: 'bar',                                    // ✅ 保持柱状图
    yAxisIndex: 1,
    data: data.map(item => item.projectCount),
    itemStyle: { color: '#722ed1' }                 // 紫色填充
  }
]
```

**新配置**:
```javascript
series: [
  {
    name: '累计营收',
    type: 'line',                                   // ✅ 改为折线图
    yAxisIndex: 0,                                  // 使用左Y轴（累计营收）
    data: data.map(item => item.revenue),
    smooth: false,                                  // 直线连接（非平滑曲线）
    symbol: 'circle',                               // 圆点标记
    symbolSize: 8,                                  // 标记大小
    lineStyle: {
      width: 2.5,                                   // 线宽
      color: '#1890ff'                              // 蓝色线条
    },
    itemStyle: {
      color: '#1890ff',                             // 标记点颜色
      borderColor: '#fff',                          // 白色边框
      borderWidth: 2                                // 边框宽度
    },
    areaStyle: undefined                            // 不显示面积填充
  },
  {
    name: '项目数量',
    type: 'bar',                                    // ✅ 保持柱状图
    yAxisIndex: 1,
    data: data.map(item => item.projectCount),
    itemStyle: { color: '#722ed1' },                // 紫色柱子
    barMaxWidth: 30                                 // 柱宽限制
  }
]
```

#### 步骤3: 可选优化 - Tooltip格式调整

由于改为折线图，建议微调tooltip显示逻辑以更好适配：

```javascript
tooltip: {
  trigger: 'axis',
  axisPointer: {
    type: 'cross',                    // 改为十字准星指示器（更适合折线图）
    crossStyle: {
      color: '#999'
    }
  },
  formatter: function(params) {
    let result = `<b>${params[0].axisValue}</b><br/>`
    params.forEach(item => {
      const marker = item.marker
      const value = item.seriesName === '累计营收'
        ? `${item.value.toLocaleString()} 万元`
        : `${item.value} 个`
      result += `${marker} ${item.seriesName}: <b>${value}</b><br/>`
    })
    return result
  }
}
```

---

## 五、技术实现细节

### 5.1 折线图样式参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| `type` | `'line'` | 图表类型为折线图 |
| `symbol` | `'circle'` | 数据点使用圆形标记 |
| `symbolSize` | `8` | 标记直径8px |
| `lineStyle.width` | `2.5` | 线条宽度2.5像素 |
| `smooth` | `false` | 使用直线连接（非贝塞尔曲线） |
| `areaStyle` | `undefined` | 不显示面积填充（避免遮挡柱状图） |

### 5.2 混合图表注意事项

1. **Y轴对应关系**:
   - 折线图（累计营收）→ 左Y轴 (`yAxisIndex: 0`)
   - 柱状图（项目数量）→ 右Y轴 (`yAxisIndex: 1`)

2. **视觉层次**:
   - 折线图在柱状图**上层渲染**（ECharts默认按series顺序渲染）
   - 避免面积填充遮挡柱状图

3. **交互体验**:
   - 使用十字准星指示器 (`axisPointer: { type: 'cross' }`) 更适合折线精确定位
   - 保留原有的点击下钻功能

### 5.3 文字对齐影响范围

仅影响汇总说明段落，不影响：
- 标题 "当年累计完成营收情况"（已左对齐）
- 图表内部元素（坐标轴标签等由ECharts控制）

---

## 六、假设与决策记录

### 6.1 设计假设
1. **折线样式**: 使用直线连接（非平滑曲线），更符合业务数据的严谨性
2. **面积填充**: 不启用，避免与紫色柱状图产生视觉冲突
3. **标记点**: 显示圆形标记，便于精确读取数值
4. **项目数量系列**: 保持柱状图不变，形成"折线+柱状"的混合对比效果

### 6.2 设计决策
1. **不改变数据源**: 复用现有 `businessData` 数据结构
2. **保留双Y轴**: 左轴显示营收金额，右轴显示项目数量
3. **最小化改动**: 仅修改必要的type和style属性，不重构整个图表配置

---

## 七、验证计划

### 7.1 功能验证
- [ ] 累计营收以**蓝色折线**显示（带圆点标记）
- [ ] 项目数量以**紫色柱状图**显示（与之前一致）
- [ ] 汇总文字**左对齐**显示在图表上方
- [ ] 标题保持左对齐不变
- [ ] 鼠标悬浮折线点时tooltip正确显示数值
- [ ] 点击图表区域仍可触发下钻导航
- [ ] 图例正确显示"累计营收"和"项目数量"

### 7.2 UI验证
- [ ] 折线颜色为蓝色 (#1890ff)
- [ ] 折线上的数据点清晰可见（白色边框+蓝色填充）
- [ ] 柱状图不被折线或标记点遮挡
- [ ] X轴标签（业务类型名称）旋转35度显示正常
- [ ] 左Y轴显示"累计营收(万元)"
- [ ] 右Y轴显示"项目数量"
- [ ] 在1920×1080分辨率下图表高度合适（h-72 = 288px）

### 7.3 数据准确性验证
- [ ] 折线图的8个数据点值正确：32000, 28000, 18000, 12000, 8000, 15000, 22000, 8500
- [ ] 柱状图的8个数据点值正确：15, 12, 8, 5, 3, 6, 10, 4
- [ ] 汇总文字显示：共63个项目，累计营收146,500万元

---

## 八、风险评估

| 风险项 | 影响 | 缓解措施 |
|-------|------|---------|
| 折线与柱状图视觉重叠 | 低 | 不使用面积填充；调整z-index如需要 |
| Y轴刻度不匹配 | 极低 | ECharts自动计算双轴刻度，无需手动干预 |
| Tooltip格式变化 | 无 | 已提供新的formatter函数 |

---

## 九、总结

本次优化涉及**1个文件的2处小改动**：
- **RevenueDashboard.vue**
  1. 模板：将汇总文字从 `text-center` 改为 `text-left`（第366行）
  2. 脚本：将累计营收系列的 `type: 'bar'` 改为 `type: 'line'` 并添加折线样式配置（约第775行）

**预期效果**:
- 累计营收趋势通过折线图更直观地呈现（适合观察波动和趋势）
- 汇总说明文字左对齐，符合整体UI规范
- 与项目数量柱状图形成混合对比，信息密度更高
