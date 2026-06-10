# 生产看板优化方案

## 一、需求概述

对生产看板的"管理提示及时性"和"风险预警及时性"两个核心模块进行UI布局调整和数据展示优化。

---

## 二、当前状态分析

### 2.1 ManagementTimeliness 组件现状
**文件**: `src/components/dashboard/ManagementTimeliness.vue`

**当前布局结构**:
```
┌─────────────────────────────────────┐
│ 第一行：[登记预警] [筹划预警]        │  ← 预警区块（左右排列）
├─────────────────────────────────────┤
│ 第二行：[应登记] [待登记] [已登记]    │  ← 整行可点击下钻
├─────────────────────────────────────┤
│ 第三行：[应筹划] [待筹划] [项目筹划完]│  ← 三项一行
├─────────────────────────────────────┤
│ 第四行：基本信息完成率               │  ← 单独一行
└─────────────────────────────────────┘
```

**当前数据结构** (`mockData.js` 第30-50行):
```javascript
subItems: [
  { name: '应登记', value: 508 },           // index 0
  { name: '待登记', value: 300 },           // index 1
  { name: '已登记', value: 208 },           // index 2 (缺失！当前是应筹划)
  { name: '应筹划', value: 508 },           // index 3
  { name: '待筹划', value: 300 },           // index 4
  { name: '基本信息完成率', value: '72%' }, // index 5
  { name: '项目筹划完成率', value: '45%' }  // index 6
]
```

⚠️ **问题发现**: 当前subItems数组只有6项，但组件引用了index 0-6（共7项），且顺序与用户描述不符！

### 2.2 RiskTimelinessDisplay 组件现状
**文件**: `src/components/dashboard/RiskTimelinessDisplay.vue`

**当前UI**: 简单的2列网格平铺显示8个指标，所有值均为"2个"

**当前数据** (`mockData.js` 第52-61行):
```javascript
riskAlertTimeliness = [
  { title: '当年一、二级风险数量', value: '2个' },
  { title: '当前进入风险数量', value: '2个' },
  { title: '当年完成风险数量', value: '2个' },
  { title: '当年剩余风险数量', value: '2个' },
  { title: '未来两周进入风险数量（按等级+总量）', value: '2个' },
  { title: 'I级未来两周进入风险数量', value: '2个' },
  { title: 'II级未来两周进入风险数量', value: '2个' },
  { title: 'III级未来两周进入风险数量', value: '2个' }
]
```

---

## 三、需求详细解读

### 3.1 布局调整要求（管理提示及时性）

| 序号 | 要求 | 当前状态 | 需要修改 |
|------|------|---------|---------|
| 1 | 待登记、已登记、应登记点击整体下钻至待登记 | ✅ 已实现 | 无需修改 |
| 2 | 应筹划、待筹划、项目筹划完成率放一排 | ✅ 已实现 | 无需修改 |
| 3 | **筹划预警和登记预警调换位置，且置于首行** | ❌ 左右相反 | **需要调换** |
| 4 | 基本信息完成率单独一行 | ✅ 已实现 | 无需修改 |

**结论**: 仅需调换预警区块的左右顺序即可。

### 3.2 数据逻辑关系（风险预警及时性）

根据内置公式：
```
① 当前进入风险数量 = 当年完成风险数量 + 当年剩余风险数量
② 当前进入风险数量 = 当年一、二级风险数量 + 当年三级风险数量
③ 未来两周进入风险数量 = I级 + II级 + III级未来两周进入风险数量
```

**设计目标**:
- 不直接展示公式，而是通过**层级化UI结构**体现数据聚合关系
- 使用符合逻辑的高保真模拟数据
- 视觉上体现"汇总→明细"的层次感

---

## 四、实施方案

### 4.1 修改文件清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/components/dashboard/ManagementTimeliness.vue` | **编辑** | 调换预警区块位置 |
| `src/components/dashboard/RiskTimelinessDisplay.vue` | **重写** | 全新层级化UI设计 |
| `src/data/mockData.js` | **编辑** | 更新数据结构和数值 |

---

### 4.2 详细修改步骤

#### 步骤1: 调整管理提示及时性组件布局

**文件**: `src/components/dashboard/ManagementTimeliness.vue`

**修改内容**:
- 第9-45行：将第一行的两个预警区块左右调换
- 原来：左=登记预警，右=筹划预警
- 改为：**左=筹划预警，右=登记预警**

**具体改动**:
```vue
<!-- 第一行：预警区块（筹划预警左、登记记预警右） -->
<div class="grid grid-cols-2 gap-3 mb-3">
  <!-- 筹划预警（移至左侧） -->
  <div class="bg-orange-50 rounded-lg p-2">
    <div class="text-xs font-semibold text-gray-700 mb-2 text-center">筹划预警</div>
    ...
  </div>

  <!-- 登记预警（移至右侧） -->
  <div class="bg-red-50 rounded-lg p-2">
    <div class="text-xs font-semibold text-gray-700 mb-2 text-center">登记预警</div>
    ...
  </div>
</div>
```

#### 步骤2: 优化风险预警及时性数据和UI

**文件1**: `src/data/mockData.js` - 更新 `riskAlertTimeliness` 数据结构

**新的数据模型设计**（体现层级关系）:

```javascript
export const riskAlertTimeliness = {
  // ========== 主指标区 ==========
  primaryMetrics: {
    currentRiskEntry: {
      title: '当前进入风险数量',
      value: 15,
      unit: '个',
      breakdown: {
        completed: { title: '当年完成风险数量', value: 8, unit: '个' },
        remaining: { title: '当年剩余风险数量', value: 7, unit: '个' }
      },
      levelBreakdown: {
        level12: { title: '当年一、二级风险数量', value: 10, unit: '个' },
        level3: { title: '当年三级风险数量', value: 5, unit: '个' }
      }
    },
    
    futureTwoWeeks: {
      title: '未来两周进入风险数量',
      value: 9,
      unit: '个',
      levelDetails: [
        { level: 'I级', value: 2, unit: '个', color: '#ef4444' },
        { level: 'II级', value: 4, unit: '个', color: '#f97316' },
        { level: 'III级', value: 3, unit: '个', color: '#eab308' }
      ]
    }
  }
}
```

**数据验证**（满足所有公式约束）:
- ✓ 15 = 8(完成) + 7(剩余)
- ✓ 15 = 10(一二三级) + 5(三级)
- ✓ 9 = 2(I级) + 4(II级) + 3(III级)

**文件2**: `src/components/dashboard/RiskTimelinessDisplay.vue` - 重写UI模板

**新UI设计方案**（层级化卡片布局）:

```
┌──────────────────────────────────────────────────┐
│ ⚠️ 风险预警及时性                                 │
├──────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐  │
│ │ 📊 当前进入风险数量          【15 个】       │  │ ← 主指标突出显示
│ ├─────────────────────────────────────────────┤  │
│ │  按状态分:                                   │  │
│ │  ┌──────────┐  ┌──────────┐                 │  │
│ │  │ 完成 8个  │  │ 剩余 7个  │                 │  │ ← 明细1：完成+剩余
│ │  └──────────┘  └──────────┘                 │  │
│ │                                             │  │
│ │  按等级分:                                   │  │
│ │  ┌────────────┐  ┌──────────┐               │  │
│ │  │ 一二级 10个 │  │ 三级 5个  │               │  │ ← 明细2：等级分布
│ │  └────────────┘  └──────────┘               │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│ ┌─────────────────────────────────────────────┐  │
│ │ 🔮 未来两周进入风险数量     【9 个】         │  │ ← 第二主指标
│ ├─────────────────────────────────────────────┤  │
│ │  ┌──────┐  ┌──────┐  ┌──────┐              │  │
│ │  │ I级 2│  │II级 4│  │III级3│              │  │ ← 等级明细（带颜色）
│ │  └──────┘  └──────┘  └──────┘              │  │
│ └─────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**UI特性**:
1. **视觉层次分明**: 主指标使用大字号+渐变背景，明细指标使用小卡片
2. **颜色编码**: 
   - 当前风险用蓝色系（#3b82f6）
   - 未来风险用紫色系（#8b5cf6）
   - 等级沿用红/橙/黄三色预警体系
3. **响应式布局**: 使用Flexbox确保在不同屏幕尺寸下自适应
4. **交互反馈**: 悬浮效果增强可点击感知

#### 步骤3: 更新Dashboard.vue中的props传递

**文件**: `src/views/Dashboard.vue` (第52-54行)

由于 `riskAlertTimelines` 数据结构从Array变为Object，需更新props绑定：

```vue
<!-- 旧代码 -->
<RiskTimelinessDisplay :timeliness-data="riskAlertTimeliness" />

<!-- 新代码 -->
<RiskTimelinessDisplay :timeliness-data="riskAlertTimeliness" />
```

（属性名保持不变，内部解析逻辑适配新结构）

---

## 五、技术实现细节

### 5.1 ManagementTimeliness.vue 完整修改

**修改范围**: 第9-45行（仅调换两个div的顺序）

**改动量**: ~40行代码位置互换

### 5.2 RiskTimelinesDisplay.vue 完整重构

**新组件结构**:
```vue
<template>
  <div class="bg-white rounded-xl p-3 shadow-sm h-full flex flex-col">
    <!-- 标题栏 -->
    <header class="flex items-center mb-3">
      <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
      <h3 class="text-sm font-semibold text-gray-800">风险预警及时性</h3>
    </header>

    <!-- 内容区：滚动容器 -->
    <div class="flex-1 overflow-y-auto space-y-3">
      
      <!-- 卡片1：当前进入风险数量 -->
      <section class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
        <!-- 主指标标题 -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-700">当前进入风险数量</span>
          <span class="text-xl font-bold text-blue-600">{{ timelinessData.primaryMetrics.currentRiskEntry.value }}{{ timelinessData.primaryMetrics.currentRiskEntry.unit }}</span>
        </div>

        <!-- 明细行1：按状态分 -->
        <div class="mb-2">
          <div class="text-[10px] text-gray-500 mb-1.5">按状态分</div>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-white rounded p-2 text-center shadow-sm">
              <div class="text-sm font-semibold text-green-600">{{ timelinessData.primaryMetrics.currentRiskEntry.breakdown.completed.value }}</div>
              <div class="text-[10px] text-gray-500">{{ timelinessData.primaryMetrics.currentRiskEntry.breakdown.completed.title.replace('当年', '') }}</div>
            </div>
            <div class="bg-white rounded p-2 text-center shadow-sm">
              <div class="text-sm font-semibold text-orange-600">{{ timelinessData.primaryMetrics.currentRiskEntry.breakdown.remaining.value }}</div>
              <div class="text-[10px] text-gray-500">{{ timelinessData.primaryMetrics.currentRiskEntry.breakdown.remaining.title.replace('当年', '') }}</div>
            </div>
          </div>
        </div>

        <!-- 明细行2：按等级分 -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1.5">按等级分</div>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-white rounded p-2 text-center shadow-sm">
              <div class="text-sm font-semibold text-red-600">{{ timelinessData.primaryMetrics.currentRiskEntry.levelBreakdown.level12.value }}</div>
              <div class="text-[10px] text-gray-500">{{ timelinessData.primaryMetrics.currentRiskEntry.levelBreakdown.level12.title.replace('当年', '') }}</div>
            </div>
            <div class="bg-white rounded p-2 text-center shadow-sm">
              <div class="text-sm font-semibold text-yellow-600">{{ timelinessData.primaryMetrics.currentRiskEntry.levelBreakdown.level3.value }}</div>
              <div class="text-[10px] text-gray-500">{{ timelinessData.primaryMetrics.currentRiskEntry.level3.title.replace('当年', '') }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 卡片2：未来两周进入风险数量 -->
      <section class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
        <!-- 主指标标题 -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-700">未来两周进入风险数量</span>
          <span class="text-xl font-bold text-purple-600">{{ timelinessData.primaryMetrics.futureTwoWeeks.value }}{{ timelinessData.primaryMetrics.futureTwoWeeks.unit }}</span>
        </div>

        <!-- 等级明细条 -->
        <div class="space-y-1.5">
          <div 
            v-for="(level, idx) in timelinessData.primaryMetrics.futureTwoWeeks.levelDetails"
            :key="idx"
            class="flex items-center justify-between bg-white rounded px-2 py-1.5 shadow-sm"
          >
            <div class="flex items-center">
              <span class="w-2 h-2 rounded-full mr-2" :style="{ backgroundColor: level.color }"></span>
              <span class="text-xs text-gray-600">{{ level.level }}风险</span>
            </div>
            <span class="text-sm font-bold" :style="{ color: level.color }">{{ level.value }}{{ level.unit }}</span>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
```

### 5.3 样式说明

**新增Tailwind类用途**:
- `from-blue-50 to-indigo-50`: 当前风险卡片渐变背景（冷色调）
- `from-purple-50 to-pink-50`: 未来风险卡片渐变背景（暖色调）
- `space-y-3`: 卡片间距控制
- `overflow-y-auto`: 内容溢出时纵向滚动
- `shadow-sm`: 明细卡片轻微阴影增强层次感

---

## 六、假设与决策记录

### 6.1 数据假设
1. **当前进入风险数量**: 设为15个（满足8+7和10+5两种分解）
2. **未来两周风险**: 设为9个（满足2+4+3的等级分布）
3. **等级权重**: I级风险最严重（红色），III级相对较轻（黄色）

### 6.2 设计决策
1. **不显示等式符号**: 通过视觉层级（主指标在上、明细在下）隐式表达聚合关系
2. **保持两卡片式布局**: 符合原组件的空间约束（col-span-4）
3. **保留原有交互**: 点击事件保持不变（仍跳转风险列表页）

---

## 七、验证计划

### 7.1 功能验证
- [ ] 确认筹划预警在左侧、登记预警在右侧
- [ ] 点击应登记/待登记/已登记整行触发下钻
- [ ] 应筹划/待筹划/项目筹划完成率在同一行显示
- [ ] 基本信息完成率独立成行
- [ ] 风险预警及时性的数据值满足三个数学关系式

### 7.2 UI验证
- [ ] 当前风险卡片显示主指标15个，包含完成8个+剩余7个子卡片
- [ ] 当前风险卡片显示一二级10个+三级5个子卡片
- [ ] 未来风险卡片显示总计9个，包含I级2个+II级4个+III级3个
- [ ] 颜色编码正确（红/橙/黄对应I/II/III级）
- [ ] 在1920x1080分辨率下无横向滚动条
- [ ] 移动端视图下可正常滚动查看完整内容

### 7.3 浏览器测试
- [ ] Chrome 120+
- [ ] Firefox 120+
- [ ] Edge 120+

---

## 八、风险评估

| 风险项 | 影响 | 缓解措施 |
|-------|------|---------|
| 数据结构变更影响其他组件 | 低 | 仅RiskTimelinesDisplay消费此数据 |
| 样式冲突 | 极低 | 使用作用域样式或唯一类名 |
| 性能影响 | 无 | 纯静态渲染，无复杂计算 |

---

## 九、总结

本次优化涉及**3个文件的核心修改**：
1. **ManagementTimeliness.vue** - 微调（调换预警位置）
2. **RiskTimelinesDisplay.vue** - 重构（全新层级化UI）
3. **mockData.js** - 更新（结构化风险数据）

**预期效果**:
- 管理提示及时性模块符合业务要求的布局规范
- 风险预警及时性通过可视化层级清晰展现数据内在逻辑
- 高保真测试数据真实反映生产环境的风险分布特征
