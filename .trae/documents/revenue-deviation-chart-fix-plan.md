# 营收看板三项调整计划

## 一、需求概述

对 `RevenueDashboard.vue` 进行3项改动：
1. **X月营收偏差情况**: 基层单位改为9家(与顶部筛选栏一致)、删除左侧环形图、名称完整显示(可换行)、重点/一般项目直接标记在界面
2. **营收月度统计**: Y轴单位"万元"/"%"未完全显示
3. **当年累计完成营收情况**: 双Y轴互换位置 — 左侧=项目数量，右侧=累计营收(万元)

## 二、当前状态分析

### 改动1: X月营收偏差情况（L261-L355, L584-L647）

**当前问题**:
- `unitDeviationData` 只有4个单位（城水管道/浦东供排水/二次养护/设备安装）
- 顶部筛选栏有9家单位（管网事业部/生态事业部/区域事业部/市政事业部/环境建设/管道工程/管道分公司/运营养护/二次养护）
- 左侧有SVG环形图（L289-L317），需要删除
- 单位名称用`truncate`截断（L331），需改为换行显示
- 重点/一般项目数只在悬浮窗title中显示（L326），需直接展示在界面行内

**目标结构**:
```
┌─────────────────────────────────────────────┐
│ [2026年X月营收偏差情况]        [年] [月选择器▼] │
├─────────────────────────────────────────────┤
│ 基层单位列表（名称完整显示，可换行）            │
│ ┌──────────────────────────────────────────┐ │
│ │ ● 管网事业部   重点:6 一般:1  偏差:-1777万 │ │
│ │ ● 生态事业部   重点:5 一般:2  偏差:-1200万 │ │
│ │ ... (共9家，超出高度则滚动)                 │ │
│ └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 改动2: 营收月度统计 Y轴单位（L717-L719）

当前：
```javascript
yAxis: [
  { type: 'value', name: '万元' },
  { type: 'value', name: '%', min: 0, max: 100, position: 'right' }
]
```
grid.left=8%, right=12% 可能仍不够显示完整名称。需增大边距或使用更短的name。

### 改动3: 当年累计完成营收 Y轴互换（L788-L791）

当前：
```javascript
yAxis: [
  { type: 'value', name: '累计营收(万元)', position: 'left' },    // ← 当前在左
  { type: 'value', name: '项目数量', position: 'right' }           // ← 当前在右
]
```
目标：左侧=项目数量(bar)，右侧=累计营收(line)

## 三、具体改动清单

### 改动1: X月营收偏差全面改造

#### 1a. 数据更新 — unitDeviationData 改为9家（L584-L627）

与顶部筛选栏 filterTabs(L390-L401) 的9家单位一一对应：

```javascript
const unitDeviationData = ref([
  { name: '管网事业部', color: '#4ade80', deviationCount: 7, keyProjectCount: 6, generalProjectCount: 1, totalAmount: -1777, keyProjectAmount: -1500, generalProjectAmount: -277 },
  { name: '生态事业部', color: '#3b82f6', deviationCount: 5, keyProjectCount: 4, generalProjectCount: 1, totalAmount: -1200, keyProjectAmount: -1000, generalProjectAmount: -200 },
  { name: '区域事业部', color: '#38bdf8', deviationCount: 9, keyProjectCount: 7, generalProjectCount: 2, totalAmount: -2100, keyProjectAmount: -1800, generalProjectAmount: -300 },
  { name: '市政事业部', color: '#60a5fa', deviationCount: 4, keyProjectCount: 3, generalProjectCount: 1, totalAmount: -900, keyProjectAmount: -750, generalProjectAmount: -150 },
  { name: '环境建设', color: '#a78bfa', deviationCount: 6, keyProjectCount: 4, generalProjectCount: 2, totalAmount: -1350, keyProjectAmount: -1100, generalProjectAmount: -250 },
  { name: '管道工程', color: '#f59e0b', deviationCount: 8, keyProjectCount: 6, generalProjectCount: 2, totalAmount: -1900, keyProjectAmount: -1600, generalProjectAmount: -300 },
  { name: '管道分公司', color: '#ef4444', deviationCount: 5, keyProjectCount: 3, generalProjectCount: 2, totalAmount: -1100, keyProjectAmount: -850, generalProjectAmount: -250 },
  { name: '运营养护', color: '#10b981', deviationCount: 6, keyProjectCount: 5, generalProjectCount: 1, totalAmount: -1500, keyProjectAmount: -1300, generalProjectAmount: -200 },
  { name: '二次养护', color: '#8b5cf6', deviationCount: 7, keyProjectCount: 5, generalProjectCount: 2, totalAmount: -1650, keyProjectAmount: -1400, generalProjectAmount: -250 }
])
```

#### 1b. 模板改造 — 删除环形图 + 改为单列列表（L287-L354）

替换整个内容区（从 `<div class="flex items-start gap-5">` 到其闭合标签）为：

```html
<!-- 内容区：基层单位列表（无环形图） -->
<div class="max-h-[320px] overflow-y-auto pr-1">
  <div class="space-y-2">
    <div
      v-for="(unit, idx) in unitDeviationData"
      :key="idx"
      class="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      @click="handleDeviationDrill(unit.name)"
    >
      <!-- 左侧：颜色圆点 + 单位名称（完整显示，允许换行） -->
      <div class="flex items-center flex-1 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" :style="{ backgroundColor: unit.color }"></span>
        <span class="text-sm text-gray-700 whitespace-normal leading-relaxed">{{ unit.name }}</span>
      </div>

      <!-- 右侧：重点/一般项目 + 偏差额（直接标记在界面） -->
      <div class="flex items-center gap-3 ml-3 flex-shrink-0">
        <!-- 重点项目 -->
        <span class="text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-medium">
          重点{{ unit.keyProjectCount }}
        </span>
        <!-- 一般项目 -->
        <span class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
          一般{{ unit.generalProjectCount }}
        </span>
        <!-- 总偏差额 -->
        <span
          class="text-sm font-bold min-w-[80px] text-right"
          :class="unit.totalAmount >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatAmount(unit.totalAmount) }}万
        </span>
      </div>
    </div>
  </div>
</div>
```

关键变化：
- 删除左侧SVG环形图（L289-L317整个div）
- `grid grid-cols-2` → 单列 `space-y-2`
- 名称用 `whitespace-normal` 允许换行（不再truncate）
- 重点/一般项目用**彩色小标签**直接显示在界面上（不再只在title悬浮窗里）
- 外层加 `max-h-[320px] overflow-y-auto` 实现滚动（9家放不下时下拉展示）

#### 1c. 删除不再需要的代码（可选清理）

以下函数/变量因删除环形图后不再需要，但保留也无害（不影响运行）：
- `totalDeviationCount` computed (L629-L631) — 不再用于环形图中心文字
- `getCircleOffset` 函数 (L640-L647) — 环形图偏移计算

> 决定：**保留**这些代码，避免引入意外副作用。它们只是未被引用的冗余代码。

---

### 改动2: 营收月度统计 Y轴单位显示修复

**位置**: [RevenueDashboard.vue#L715-L720](src/views/RevenueDashboard.vue#L715-L720)

将 yAxis 的 name 属性增加 `margin` 和 `fontSize` 确保"万元"/"%"不被截断：

```javascript
// 当前
yAxis: [
  { type: 'value', name: '万元' },
  { type: 'value', name: '%', min: 0, max: 100, position: 'right' }
]

// 改为
yAxis: [
  { type: 'value', name: '万元', nameTextStyle: { fontSize: 12, padding: [0, 0, 0, 8] } },
  { type: 'value', name: '%', min: 0, max: 100, position: 'right', nameTextStyle: { fontSize: 12, padding: [0, 8, 0, 0] } }
]
```

同时微调grid确保空间充足（当前 left:8%/right:12% 已足够，保持不变）。

---

### 改动3: 当年累计完成营收 Y轴互换

**位置**: [RevenueDashboard.vue#L788-L791](src/views/RevenueDashboard.vue#L788-L791)

```javascript
// 当前
yAxis: [
  { type: 'value', name: '累计营收(万元)', position: 'left' },     // line图绑定yAxisIndex:0
  { type: 'value', name: '项目数量', position: 'right' }            // bar图绑定yAxisIndex:1
]

// 改为
yAxis: [
  { type: 'value', name: '项目数量', position: 'left' },           // bar → 左轴
  { type: 'value', name: '累计营收(万元)', position: 'right' }     // line → 右轴
]
```

同时修改 series 中对应的 yAxisIndex：
```javascript
// 累计营收(line): yAxisIndex: 0 → yAxisIndex: 1
// 项目数量(bar): yAxisIndex: 1 → yAxisIndex: 0
```

## 四、验证步骤

开发服务器已在 http://localhost:5173/ 运行，刷新后验证：
- [ ] 偏差模块：9家基层单位全部列出，无环形图，名称完整可换行，每行有橙色"重点N"+灰色"一般N"标签+偏差额
- [ ] 9家单位过多时可滚动查看
- [ ] 营收月度统计左右Y轴"万元"/"%"完整可见
- [ ] 累计营收图表：左侧Y轴=项目数量(柱状)，右侧Y轴=累计营收(折线)
