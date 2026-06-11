# 风险预警及时性 + 生产风险情况 优化方案

## 一、需求概述

### 模块1: 风险预警及时性 (RiskTimelinessDisplay)
将当前的单一环形图改为**双环形图**布局，每个环形图的中心和圆环都有清晰的文字描述：

- **环形图1（当前风险）**:
  - 中心总值: **当前进入风险数量**（如"15个 当前进入风险数量"）
  - 圆环构成: **当年完成风险数量** + **当年剩余风险数量**

- **环形图2（未来两周）**:
  - 中心总值: **未来两周进入风险数量**（如"9个 未来两周进入风险"）
  - 圆环构成: **I级** + **II级** + **III级** 未来两周进入风险数量（按占比）

### 模块2: 生产风险情况 (ProductionRiskSituation)
在现有时间筛选器基础上新增筛选功能：
- 增加 **"仅统计年度风险管控清单"** 切换选项
- 点击后：**指标名称不变，数量变少**（模拟数据过滤效果）

---

## 二、当前状态分析

### 2.1 RiskTimelinesDisplay.vue 当前实现

**文件**: `src/components/dashboard/RiskTimelinesDisplay.vue` (156行)

**当前UI**: 单一环形图 + 底部6个指标卡片
```
┌─────────────────────────────────────┐
│ 🔴 风险预警及时性                   │
│                                     │
│   ╭──────╮                         │
│   │  2个  │  ← 仅显示数值，无含义❌  │
│   │当前进入│                        │
│   ╰──────╯                         │
│   [I/II/III级扇区]                 │
│                                     │
│ [一二风险2] [完成2] [剩余2]         │
│ [I级2] [II级2] [III级2]            │
└─────────────────────────────────────┘
```

**问题**:
1. 只有一个环形图，无法同时展示两组数据关系
2. 中心只显示"2个 当前进入风险"，缺少完整的描述
3. 底部卡片只有缩略名和数值，信息密度低

### 2.2 ProductionRiskSituation.vue 当前实现

**文件**: `src/components/dashboard/ProductionRiskSituation.vue` (98行)

**当前功能**:
- ✅ 月份范围选择器 (`el-date-picker` type="monthrange")
- ✅ 风险开工令预警（红橙黄三色圆圈）
- ✅ 生产风险按等级列表（I/II/III级 + 数量 + 完成数）
- ❌ 缺少"仅统计年度风险管控清单"筛选选项

### 2.3 数据源 (mockData.js 第52-68行)

```javascript
// 风险预警及时性数据（当前为扁平数组）
riskAlertTimeliness = [
  { title: '当年一、二级风险数量', value: '2个' },       // index 0
  { title: '当前进入风险数量', value: '2个' },             // index 1
  { title: '当年完成风险数量', value: '2个' },            // index 2
  { title: '当年剩余风险数量', value: '2个' },            // index 3
  { title: '未来两周进入风险数量', value: '2个' },        // index 4
  { title: 'I级未来两周进入风险数量', value: '2个' },     // index 5
  { title: 'II级未来两周进入风险数量', value: '2个' },    // index 6
  { title: 'III级未来两周进入风险数量', value: '2个' }    // index 7
]

// 风险等级分布
riskByLevel = [
  { level: 'I级风险', count: 2, completed: 0 },
  { level: 'II级风险', count: 6, completed: 1 },
  { level: 'III级风险', count: 8, completed: 2 }
]
```

---

## 三、目标设计

### 3.1 RiskTimelinesDisplay 目标UI

```
┌─────────────────────────────────────────────────────┐
│ 🔴 风险预警及时性                                    │
├──────────────────────────┬──────────────────────────┤
│ 【当前进入风险】           │ 【未来两周进入风险】       │
│                          │                           │
│  ╭──────────╮            │  ╭──────────╮            │
│  │   15个   │            │  │   9个    │            │
│  │当前进入  │            │  │ 未来两周  │            │
│  │ 风险数量  │            │  │ 进入风险  │            │
│  ╰──────────╯            │  ╰──────────╯            │
│  ╭────╮  ╰────╮          │  ╭──╮╭──╮╰──╮          │
│  │8个 │  │7个 │          │  │2 ││4 ││3 │          │
│  │完成│  │剩余│          │  │I级││II级││III│         │
│  ╰────╯  ╰────╯          │  ╰──╯╰──╯╰──╯          │
│                          │                           │
│  🟢完成8 🟠剩余7         │  🔴I级2 🟠II级4 🟡III级3  │
└──────────────────────────┴──────────────────────────┘
```

### 3.2 ProductionRiskSituation 目标UI

```
┌─────────────────────────────────────────────┐
│ 🔴 生产风险情况                               │
│ [2026-01 至 2026-12 ▼]  ☑仅统计年度风险管控清单 │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 风险开工令预警                            │ │
│ │   🔴2  🟠12  🟡17                       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 生产风险情况（按等级）    ☐ 显示全部     │ │
│ ├─────────────────────────────────────────┤ │
│ │ ● I级风险      16个（6个已完成）        │ │
│ │ ● II级风险     10个（4个已完成）        │ │ ← 筛选前
│ │ ● III级风险    12个（5个已完成）        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 点击☑后:                                   │
│ │ ● I级风险       8个（3个已完成）        │ │ ← 数量变少
│ │ ● II级风险      5个（2个已完成）        │ │    指标不变
│ │ ● III级风险     6个（2个已完成）        │ │
└─────────────────────────────────────────────┘
```

---

## 四、实施方案

### 4.1 修改文件清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/components/dashboard/RiskTimelinesDisplay.vue` | **重写** | 双环形图 + 清晰文字描述 |
| `src/components/dashboard/ProductionRiskSituation.vue` | **编辑** | 新增筛选切换功能 |
| `src/data/mockData.js` | **编辑** | 更新riskAlertTimeliness数据结构 |

---

### 4.2 详细修改步骤

#### 步骤1: 重写 RiskTimelinesDisplay.vue

**新模板结构**:
```vue
<template>
  <div class="bg-white rounded-xl p-3 shadow-sm h-full flex flex-col">
    <!-- 标题 -->
    <div class="flex items-center mb-2">
      <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
      <h3 class="text-sm font-semibold text-gray-800">风险预警及时性</h3>
    </div>

    <!-- 双环形图区域 -->
    <div class="flex-1 grid grid-cols-2 gap-3">

      <!-- ========== 环形图1：当前进入风险 ========== -->
      <div class="flex flex-col">
        <div ref="currentChartRef" class="flex-1 min-h-[100px]"></div>
        <!-- 图例说明 -->
        <div class="flex items-center justify-center gap-3 mt-1.5 pt-1.5 border-t border-gray-100">
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            <span class="text-gray-600">完成<span class="font-bold text-green-600 ml-0.5">{{ currentCompleted }}</span>个</span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-orange-400 mr-1"></span>
            <span class="text-gray-600">剩余<span class="font-bold text-orange-600 ml-0.5">{{ currentRemaining }}</span>个</span>
          </span>
        </div>
      </div>

      <!-- ========== 环形图2：未来两周进入风险 ========== -->
      <div class="flex flex-col">
        <div ref="futureChartRef" class="flex-1 min-h-[100px]"></div>
        <!-- 图例说明 -->
        <div class="flex items-center justify-center gap-2 mt-1.5 pt-1.5 border-t border-gray-100">
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
            <span class="text-gray-600">I级<span class="font-bold text-red-600 ml-0.5">{{ futureI }}</span></span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
            <span class="text-gray-600">II级<span class="font-bold text-orange-600 ml-0.5">{{ futureII }}</span></span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
            <span class="text-gray-600">III级<span class="font-bold text-yellow-600 ml-0.5">{{ futureIII }}</span></span>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>
```

**环形图1配置 - 当前进入风险**:
```javascript
const initCurrentChart = () => {
  const d = {
    total: 15,              // 当前进入风险总数
    completed: 8,           // 当年完成风险数量
    remaining: 7            // 当年剩余风险数量
  }

  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: {
        show: true,
        position: 'center',
        formatter: () =>
          `{total|${d.total}个}\n` +
          `{label|当前进入}`,
          `{sub|风险数量}`,
        rich: {
          total: { fontSize: 18, fontWeight: 'bold', color: '#dc2626', lineHeight: 24, align: 'center' },
          label: { fontSize: 11, color: '#374151', fontWeight: '600', lineHeight: 16, align: 'center' },
          sub: { fontSize: 11, color: '#374151', lineHeight: 14, align: 'center' }
        }
      },
      data: [
        { value: d.completed, name: '当年完成风险数量', itemStyle: { color: '#22c55e' } },
        { value: d.remaining, name: '当年剩余风险数量', itemStyle: { color: '#fb923c' } }
      ]
    }]
  })
}
```

**环形图2配置 - 未来两周进入风险**:
```javascript
const initFutureChart = () => {
  const d = {
    total: 9,               // 未来两周进入风险总数
    levelI: 2,              // I级
    levelII: 4,             // II级
    levelIII: 3             // III级
  }

  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: {
        show: true,
        position: 'center',
        formatter: () =>
          `{total|${d.total}个}\n` +
          `{label|未来两周}`,
          `{sub|进入风险}`,
        rich: {
          total: { fontSize: 18, fontWeight: 'bold', color: '#7c3aed', lineHeight: 24, align: 'center' },
          label: { fontSize: 11, color: '#374151', fontWeight: '600', lineHeight: 16, align: 'center' },
          sub: { fontSize: 11, color: '#374151', lineHeight: 14, align: 'center' }
        }
      },
      data: [
        { value: d.levelI, name: 'I级未来两周进入风险数量', itemStyle: { color: '#ef4444' } },
        { value: d.levelII, name: 'II级未来两周进入风险数量', itemStyle: { color: '#f97316' } },
        { value: d.levelIII, name: 'III级未来两周进入风险数量', itemStyle: { color: '#eab308' } }
      ]
    }]
  })
}
```

#### 步骤2: 编辑 ProductionRiskSituation.vue

**新增内容**: 在标题栏右侧添加筛选切换

**位置**: 第7行之后（日期选择器旁边）

```vue
<!-- 新增：筛选切换 -->
<div class="flex items-center space-x-1 ml-3 px-2 py-1 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
     @click="toggleAnnualFilter"
     :class="{ 'bg-blue-50 border-blue-300': annualOnly }">
  <input type="checkbox" 
         :checked="annualOnly" 
         class="w-3 h-3 rounded text-blue-600 focus:ring-blue-500" />
  <span class="text-xs" :class="annualOnly ? 'text-blue-700 font-medium' : 'text-gray-600'">
    仅统计年度风险管控清单
  </span>
</div>
```

**脚本逻辑**:
```javascript
const annualOnly = ref(false)

// 原始完整数据
const fullRiskData = ref([
  { level: 'I级风险', count: 16, completed: 6 },
  { level: 'II级风险', count: 10, completed: 4 },
  { level: 'III级风险', count: 12, completed: 5 }
])

// 过滤后的数据（模拟"仅统计年度风险管控清单"效果）
const filteredRiskData = ref([
  { level: 'I级风险', count: 8, completed: 3 },
  { level: 'II级风险', count: 5, completed: 2 },
  { level: 'III级风险', count: 6, completed: 2 }
])

// 计算属性：根据筛选状态返回不同数据
const riskData = computed(() => {
  return annualOnly.value ? filteredRiskData.value : fullRiskData.value
})

const toggleAnnualFilter = () => {
  annualOnly.value = !annualOnly.value
}
```

#### 步骤3: 更新 mockData.js 数据

将 `riskAlertTimelines` 从扁平数组改为对象结构，便于消费:

```javascript
export const riskAlertTimeliness = {
  // 当前进入风险
  currentRisk: {
    total: 15,
    completed: 8,
    remaining: 7,
    level12: 10,
    level3: 5
  },
  // 未来两周进入风险
  futureRisk: {
    total: 9,
    levelI: 2,
    levelII: 4,
    levelIII: 3
  }
}
```

---

## 五、技术实现细节

### 5.1 双环形图布局要点

- 使用 `grid grid-cols-2` 实现左右等分
- 每个图表容器使用 `flex-1 min-h-[100px]` 自适应高度
- 图例放在各图表下方，用 `border-t` 分隔

### 5.2 中心文字设计（3行rich文本）

| 行 | 内容 | 字号 | 颜色 | 用途 |
|---|------|------|------|------|
| 第1行 | `15个` | 18px bold | 红/紫色 | 总数 |
| 第2行 | `当前进入` | 11px semi-bold | 深灰 | 主描述 |
| 第3行 | `风险数量` | 11px normal | 深灰 | 辅助描述 |

**总高度**: 24 + 16 + 14 = 54px

### 5.3 ProductionRiskSituation 筛选交互

- 使用 checkbox + 文字的组合按钮
- 点击切换 `annualOnly` 状态
- 通过 computed 属性动态切换数据源
- **关键**: 指标名称(I级风险/II级风险/III级风险)不变，只变数量

### 5.4 颜色编码

| 元素 | 颜色 |
|------|------|
| 当前风险主色 | #dc2626 (红色) |
| 未来风险主色 | #7c3aed (紫色) |
| 完成扇区 | #22c55e (绿色) |
| 剩余扇区 | #fb923c (橙色) |
| I级 | #ef4444 (红色) |
| II级 | #f97316 (橙色) |
| III级 | #eab308 (黄色) |

---

## 六、假设与决策记录

### 6.1 数据假设
- 当前进入风险: 15个 = 完成8 + 剩余7
- 未来两周进入风险: 9个 = I级2 + II级4 + III级3
- 年度风险管控清单筛选后: 各等级数量约为原来的50%

### 6.2 设计决策
1. **双环形图并排**: 而非上下堆叠，节省垂直空间
2. **中心3行文字**: 充分描述含义，避免歧义
3. **图例放底部**: 不占用环形图内部空间
4. **checkbox筛选**: 直观的开关体验

---

## 七、验证计划

### 7.1 RiskTimelinesDisplay 验证
- [ ] 左侧环形图中心显示 "15个 / 当前进入 / 风险数量"
- [ ] 左侧圆环由绿色(完成8)和橙色(剩余7)两段组成
- [ ] 右侧环形图中心显示 "9个 / 未来两周 / 进入风险"
- [ ] 右侧圆环由红(I级2)、橙(II级4)、黄(III级3)三段组成
- [ ] 底部图例正确显示各部分数量
- [ ] 鼠标悬浮显示tooltip

### 7.2 ProductionRiskSituation 验证
- [ ] 标题栏显示日期选择器 + "仅统计年度风险管控清单"复选框
- [ ] 默认状态显示完整数据（I级16, II级10, III级12）
- [ ] 点击复选框后数据量减少（I级8, II级5, III级6）
- [ ] 再次点击恢复原始数据
- [ ] 指标名称始终不变（I级风险/II级风险/III级风险）
- [ ] 各等级的已完成数量同步变化

---

## 八、总结

本次优化涉及**3个文件的修改**：

| 文件 | 改动量 | 核心 |
|------|-------|------|
| **RiskTimelinesDisplay.vue** | 重写(~220行) | 双环形图 + 清晰文字描述 |
| **ProductionRiskSituation.vue** | 编辑(~30行新增) | 年度风险管控清单筛选 |
| **mockData.js** | 编辑(~20行) | 数据结构调整 |

**预期效果**:
- 风险预警及时性的数据关系通过双环形图一目了然
- 所有数字都有明确的文字说明（不再有歧义）
- 生产风险情况支持灵活的数据筛选
