# 营收看板"月度营收偏差"模块优化方案

## 一、需求概述

对营收看板的"X月月度营收偏差"模块进行两项核心优化：

1. 将单月选择器升级为**年+月选择器**
2. 按照设计稿截图重新设计偏差内容UI，展示多基层单位的偏差统计

***

## 二、当前状态分析

### 2.1 当前实现位置

**文件**: `e:\trae_demo_env\营收看板\src\views\RevenueDashboard.vue`

* **模板部分**: 第261-305行（月度营收偏差模块）

* **脚本部分**: 第495-540行（选择器和数据定义）

### 2.2 当前UI结构

```
┌─────────────────────────────────────────────┐
│ X月月度营收偏差              [月份选择器▼]  │  ← 只有月份
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 城市环境                    查看详情 >  │ │
│ ├─────────────────────────────────────────┤ │
│ │  ┌──────────┐  ┌──────────┐            │ │
│ │  │重点项目偏差│  │一般项目偏差│           │ │
│ │  │  -680    │  │  -320    │            │ │
│ │  └──────────┘  └──────────┘            │ │
│ │ 项目总数:21个 总偏差: -1000万          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 2.3 当前数据结构

```javascript
// 选择器：仅月份（数字1-12）
selectedDeviationMonth = ref(8)  // 默认8月
monthOptions = [
  { value: 1, label: '1月' },
  ... // 共12个月
]

// 数据：单一城市对象
cityDeviationData = [{
  city: '城市环境',
  projectCount: 21,
  keyProjectCount: 12,
  generalProjectCount: 9,
  keyDeviation: -680,        // 重点项目偏差金额
  generalDeviation: -320,    // 一般项目偏差金额
  totalDeviation: -1000      // 总偏差金额
}]
```

***

## 三、目标UI设计（基于截图）

### 3.1 截图解析

```
┌─────────────────────────────────────────────────────────────────┐
│ 📊 X月营收偏差情况                    [2024年] [8月▼]         │  ← 年+月选择器
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    重点  非重点          重点  非重点            │
│  │  ╭────╮  │    城水管道  7 (6|1) -1,777万   二次养护 7 (6|1)  1,777万 │
│  │  │总数 │  │                                                   │
│  │  │4031│  │    浦东供排水 7 (6|1)  1,777万   设备安装 7 (6|1)  1,777万 │
│  │  ╰────╯  │                                                   │
│  └──────────┘                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 UI元素说明

| 元素        | 说明                            | 交互       |
| --------- | ----------------------------- | -------- |
| **标题**    | "X月营收偏差情况"                    | -        |
| **年选择器**  | 年份下拉（2023/2024/2025...）       | 切换年份     |
| **月选择器**  | 月份下拉（1-12月）                   | 切换月份     |
| **左侧环形图** | 显示偏差项目**总数** + 信息图标(i)        | 悬浮提示     |
| **右侧列表**  | 多个基层单位的偏差统计                   | 整行可点击下钻  |
| **单位行格式** | `[颜色圆点] 单位名 数量 (重点\|非重点) 总金额` | 悬浮显示明细金额 |

### 3.3 数据字段定义（每个基层单位）

```javascript
{
  name: '城水管道',              // 基层单位名称
  color: '#4ade80',              // 单位标识颜色（用于圆点）
  deviationCount: 7,             // 偏差项目数量
  keyProjectCount: 6,            // 重点项目偏差数量
  generalProjectCount: 1,        // 一般项目偏差数量
  totalAmount: -1777,            // 总偏差金额（万元，负数表示亏损）
  keyProjectAmount: -1500,       // 重点项目偏差金额（悬浮显示）
  generalProjectAmount: -277     // 一般项目偏差金额（悬浮显示）
}
```

***

## 四、实施方案

### 4.1 修改文件清单

| 文件路径                             | 修改类型   | 说明            |
| -------------------------------- | ------ | ------------- |
| `src/views/RevenueDashboard.vue` | **编辑** | 重构偏差模块UI和数据逻辑 |

### 4.2 详细修改步骤

#### 步骤1: 升级选择器为年+月双选择器

**位置**: 第264-271行

**改动内容**:

```vue
<!-- 旧代码：单月份选择器 -->
<h3 class="text-sm font-semibold text-gray-800">{{ selectedDeviationMonth }}月月度营收偏差</h3>
<select v-model="selectedDeviationMonth">
  <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
</select>

<!-- 新代码：年+月双选择器 -->
<h3 class="text-sm font-semibold text-gray-800">{{ selectedYear }}年{{ selectedMonth }}月营收偏差情况</h3>
<div class="flex items-center gap-2">
  <select v-model="selectedYear" class="...">
    <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
  </select>
  <select v-model="selectedMonth" class="...">
    <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
  </select>
</div>
```

#### 步骤2: 重构偏差数据结构

**位置**: 第508-536行

**新增数据**:

```javascript
// 年份选项（近5年）
const yearOptions = ref([
  new Date().getFullYear() - 2,
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
  new Date().getFullYear() + 1,
  new Date().getFullYear() + 2
])

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(getCurrentDeviationMonth())

// 多基层单位偏差数据（按截图样式）
const unitDeviationData = ref([
  {
    name: '城水管道',
    color: '#4ade80',      // 绿色
    deviationCount: 7,
    keyProjectCount: 6,
    generalProjectCount: 1,
    totalAmount: -1777,
    keyProjectAmount: -1500,
    generalProjectAmount: -277
  },
  {
    name: '浦东供排水',
    color: '#3b82f6',      // 蓝色
    deviationCount: 7,
    keyProjectCount: 6,
    generalProjectCount: 1,
    totalAmount: 1777,
    keyProjectAmount: 1500,
    generalProjectAmount: 277
  },
  {
    name: '二次养护',
    color: '#38bdf8',      // 浅蓝
    deviationCount: 7,
    keyProjectCount: 6,
    generalProjectCount: 1,
    totalAmount: 1777,
    keyProjectAmount: 1500,
    generalProjectAmount: 277
  },
  {
    name: '设备安装',
    color: '#60a5fa',      // 天蓝
    deviationCount: 7,
    keyProjectCount: 6,
    generalProjectCount: 1,
    totalAmount: 1777,
    keyProjectAmount: 1500,
    generalProjectAmount: 277
  }
])

// 计算总数（用于环形图）
const totalDeviationCount = computed(() => {
  return unitDeviationData.value.reduce((sum, item) => sum + item.deviationCount, 0)
})
```

#### 步骤3: 重写偏差模块UI模板

**位置**: 第261-305行（完整替换）

**新模板结构**:

```vue
<!-- 下半部分：X月营收偏差情况 -->
<div class="pt-4 border-t border-gray-100">
  <!-- 标题栏 + 双选择器 -->
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-sm font-semibold text-gray-800 flex items-center">
      <span class="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
      {{ selectedYear }}年{{ selectedMonth }}月营收偏差情况
    </h3>
    <div class="flex items-center gap-2">
      <!-- 年份选择器 -->
      <select
        v-model="selectedYear"
        class="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
      </select>
      <!-- 月份选择器 -->
      <select
        v-model="selectedMonth"
        class="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>
  </div>

  <!-- 内容区：左环形图 + 右单位列表 -->
  <div class="flex items-start gap-5">
    <!-- 左侧：环形图 -->
    <div class="flex-shrink-0 w-28 flex flex-col items-center">
      <div class="relative w-24 h-24">
        <!-- SVG环形图（多彩分段） -->
        <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <!-- 背景圆 -->
          <circle cx="50" cy="50" r="40" stroke="#f3f4f6" stroke-width="12" fill="none" />
          <!-- 数据段（按单位比例分配） -->
          <template v-for="(unit, idx) in unitDeviationData" :key="idx">
            <circle
              cx="50" cy="50" r="40"
              :stroke="unit.color" stroke-width="12" fill="none"
              :stroke-dasharray="`${(unit.deviationCount / totalDeviationCount) * 251.2} 251.2`"
              :stroke-dashoffset="-getCircleOffset(idx)"
              stroke-linecap="round"
            />
          </template>
        </svg>
        <!-- 中心文字 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-[10px] text-gray-500">总数</span>
          <div class="flex items-center">
            <span class="text-lg font-bold text-gray-800">{{ totalDeviationCount }}</span>
            <!-- 信息图标 -->
            <span class="ml-0.5 w-3.5 h-3.5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-500 cursor-help" title="各基层单位偏差项目数量汇总">i</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：基层单位列表（2列网格） -->
    <div class="flex-1 grid grid-cols-2 gap-x-6 gap-y-2.5">
      <div
        v-for="(unit, idx) in unitDeviationData"
        :key="idx"
        class="group flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
        @click="handleDeviationDrill(unit.name)"
        :title="`重点项目偏差: ${unit.keyProjectAmount}万 | 一般项目偏差: ${unit.generalProjectAmount}万`"
      >
        <!-- 左侧：颜色圆点 + 单位名称 -->
        <div class="flex items-center min-w-0">
          <span class="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" :style="{ backgroundColor: unit.color }"></span>
          <span class="text-sm text-gray-700 truncate">{{ unit.name }}</span>
        </div>
        
        <!-- 右侧：统计数据 -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- 偏差项目数量 -->
          <span class="text-sm font-medium text-blue-600">{{ unit.deviationCount }}</span>
          
          <!-- 重点/非重点分布 -->
          <span class="text-xs text-gray-500">
            (<span class="text-orange-600 font-medium">{{ unit.keyProjectCount }}</span>|<span class="text-gray-400">{{ unit.generalProjectCount }}</span>)
          </span>
          
          <!-- 总偏差金额 -->
          <span
            class="text-sm font-bold min-w-[70px] text-right"
            :class="unit.totalAmount >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ unit.totalAmount >= 0 ? '' : '' }}{{ formatAmount(unit.totalAmount) }}万
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 步骤4: 新增辅助函数

**位置**: 脚本部分（约第540行后）

```javascript
// 格式化金额（添加千分位逗号）
const formatAmount = (amount) => {
  const absAmount = Math.abs(amount)
  return absAmount.toLocaleString('zh-CN')
}

// 计算环形图各段偏移量
const getCircleOffset = (index) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    const ratio = unitDeviationData.value[i].deviationCount / totalDeviationCount.value
    offset += ratio * 251.2  // 2 * π * 40 ≈ 251.2
  }
  return offset
}
```

***

## 五、技术实现细节

### 5.1 环形图实现方案

使用**纯SVG**实现多彩分段环形图：

**技术要点**:

* 圆周长公式: `C = 2πr = 2 × 3.14159 × 40 ≈ 251.2`

* 每个单位的弧长占比: `(该单位偏差数 / 总数) × 251.2`

* 使用 `stroke-dasharray` 和 `stroke-dashoffset` 控制每段的位置

* 颜色取自各单位数据的 `color` 字段

**视觉效果**:

* 类似截图中蓝绿红橙的多彩分段效果

* 中心显示总数 + 信息图标

* 各段颜色与右侧列表的颜色圆点对应

### 5.2 Tooltip悬浮提示

使用原生HTML `title` 属性实现悬浮提示（轻量方案）：

```vue
:title="`重点项目偏差: ${unit.keyProjectAmount}万 | 一般项目偏差: ${unit.generalProjectAmount}万`"
```

**显示内容示例**:

```
悬浮前: 城水管道  7 (6|1)  -1,777万
悬浮提示: "重点项目偏差: -1500万 | 一般项目偏差: -277万"
```

### 5.3 金额显示规则

| 条件 | 显示格式      | 示例 |
| -- | --------- | -- |
| 正数 | `1,777万`  | 盈余 |
| 负数 | `-1,777万` | 亏损 |
| 零  | `0万`      | 持平 |

**颜色编码**:

* 正数（盈余）: `text-green-600` (#16a34a)

* 负数（亏损）: `text-red-600` (#dc2626)

### 5.4 响应式布局

* **桌面端（≥1024px）**: 环形图固定宽度128px，右侧单位列表2列网格

* **平板端（768-1023px）**: 环形图缩小至100px，列表改为单列

* **移动端（<768px）**: 环形图移至顶部居中，列表单列显示

***

## 六、假设与决策记录

### 6.1 数据假设

1. **基层单位数量**: 4个（城水管道、浦东供排水、二次养护、设备安装），与截图一致
2. **偏差项目总数**: 28个（4×7=28），环形图显示4031为示意值，实际按数据计算
3. **时间范围**: 年份选择器提供前后各2年共5个选项
4. **默认选中**: 当前年份 + 上个月（考虑月初延迟上报）

### 6.2 设计决策

1. **保留原有下钻逻辑**: 点击单位行仍触发 `handleDeviationDrill()` 导航到详情页
2. **使用原生select而非el-date-picker**: 保持与现有风格一致，减少组件依赖
3. **Tooltip用title属性**: 轻量实现，无需引入额外tooltip库
4. **环形图用纯SVG**: 无需ECharts依赖，性能更好且易于控制样式

***

## 七、验证计划

### 7.1 功能验证

* [ ] 年份选择器可正常切换（2022-2026年）

* [ ] 月份选择器可正常切换（1-12月）

* [ ] 标题随选择器联动更新（如"2024年8月营收偏差情况"）

* [ ] 环形图正确显示各单位的比例分配

* [ ] 环形图中心显示正确的总数

* [ ] 右侧列表显示所有4个基层单位

* [ ] 每行数据显示正确：名称、数量、(重点|非重点)、金额

* [ ] 金额正负数颜色区分正确（绿/红）

* [ ] 鼠标悬浮显示重点项目和一般项目的具体金额

* [ ] 点击单位行触发下钻导航

### 7.2 UI验证

* [ ] 与截图布局一致：左环右表

* [ ] 环形图颜色与列表圆点颜色一一对应

* [ ] 金额格式含千分位逗号（如1,777万）

* [ ] 在1920×1080分辨率下无横向溢出

* [ ] 选择器样式与整体UI风格一致

### 7.3 边界测试

* [ ] 切换年份/月份时数据是否应动态更新（当前为静态mock数据）

* [ ] 当某个单位偏差数为0时环形图处理

* [ ] 单位名称过长时的截断显示

***

## 八、风险评估

| 风险项        | 影响 | 缓解措施                                |
| ---------- | -- | ----------------------------------- |
| SVG环形图兼容性  | 低  | 使用标准SVG属性，现代浏览器均支持                  |
| 数据结构与原组件冲突 | 中  | 仅影响RevenueDashboard.vue内部变量，不影响其他组件 |
| 样式响应式问题    | 低  | 使用Tailwind响应式类，已内置断点适配              |

***

## 九、总结

本次优化涉及**1个文件的核心重构**：

* **RevenueDashboard.vue** - 重写偏差模块的模板和数据逻辑

**主要变更点**:

1. **选择器升级**: 月 → 年+月双选择器
2. **数据模型扩展**: 单一城市 → 多基层单位数组
3. **UI重新设计**: 卡片式 → 左环右表布局
4. **交互增强**: 悬浮Tooltip显示明细金额

**预期效果**:

* 符合截图的高保真UI设计

* 支持跨年度查看历史偏差数据

* 清晰展示各基层单位的偏差分布

* 通过视觉层级快速定位异常单位

