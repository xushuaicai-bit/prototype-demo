# 营收看板多项调整计划

## 一、需求概述

涉及4个文件、6项改动：

| # | 改动 | 文件 |
|---|------|------|
| 1 | KPI卡片名称去掉"施工类"前缀 | RevenueDashboard.vue + UnifiedDashboard.vue |
| 2 | 当年累计营收增加指标完成率进度条 | RevenueDashboard.vue + UnifiedDashboard.vue |
| 3 | 删除红色预警 | RevenueDashboard.vue + UnifiedDashboard.vue |
| 4 | 累计营收图表新增业务类型/区域Tab切换 | RevenueDashboard.vue + UnifiedDashboard.vue |
| 5 | 施工类总营收表合计上方增加浦东供排水行 | RevenueSummary.vue |
| 6 | 供应商合同名称去掉"合同签订及时性" | mockData.js |

---

## 二、当前状态分析

### 文件A: RevenueDashboard.vue（主营收看板）

**statCards** (L376-384) — 6个KPI含"施工类"前缀：
```
施工类当年计划营收 / 施工类当月完成营收 / 施工类当年累计营收 / 施工类当年预计完成营收 / 截止当月剩余合同存量 / 施工类下月计划
```

**yearTotalRevenue** (L609-613) — 3项列表，无完成率：
```js
[{name:'施工类',value:'3,000万元'},{name:'产品类',value:'2,000万元'},{name:'其他类',value:'1,000万元'}]
```
模板位于 L173-190，每项只显示名称+数值。

**红色预警** (L204-211) — 红橙黄三色预警中的红色项：
```html
<div @click="handleWarningDrill('red')">
  <span style="background:#f5222d">●</span>红色预警<span>{{ timelinessSingle.redAlert }}</span>
</div>
```

**当年累计完成营收情况图表** (L337-349) — 无Tab，固定显示businessData：
- 标题: `当年累计完成营收情况` (L339)
- 统计文字: 共XX个项目... (L340-343)
- 图表容器: sectorChartRef (L345)
- initSectorChart() (L677-764): 固定使用 businessData，X轴=8个业务类型

### 文件B: UnifiedDashboard.vue（产运看板）

与 RevenueDashboard.vue 的营收管理部分**代码结构完全一致**，需要同步修改：
- statCards (L574-582) — 同样的6个KPI
- yearTotalRevenue (L813-817) — 同样3项
- 红色预警 (L208-215)
- 累计营收图表 (L342-353) + initSectorChart (L881+)

### 文件C: RevenueSummary.vue（营收汇总表）

**rawData** (L480-634) — 9家基层单位数据，无"浦东供排水"
**filteredConstructionData** computed (L755-758):
```js
const filteredConstructionData = computed(() => {
  const calculated = calculateDerivedFields(rawData)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  return [...filtered, calculateTotalsForFiltered(filtered)]  // ← 合计在最后
})
```

### 文件D: mockData.js (L169-174)

supplyChainTimelinessData.subItems 的4个名称含"合同签订及时性"后缀：
```js
{ name: '专业分包合同签订及时性', ... }
{ name: '劳务分包合同签订及时性', ... }
{ name: '周转材料/设备租赁合同签订及时性', ... }
{ name: '材料/设备采购合同签订及时性', ... }
```
对应 categoryMap (SupplyChainTimeliness.vue L172-177) 也需同步修改。

---

## 三、具体改动清单

### 改动1: KPI卡片名称去掉"施工类"

#### 1a. RevenueDashboard.vue statCards (L376-384)

| 原名称 | 新名称 |
|--------|--------|
| `施工类当年计划营收` | `当年计划营收` |
| `施工类当月完成营收` | `当月完成营收` |
| `施工类当年累计营收` | `当年累计营收` |
| `施工类当年预计完成营收` | `当年预计完成营收` |
| `截止当月剩余合同存量` | 不变(无施工类前缀) |
| `施工类下月计划` | `下月计划` |

#### 1b. UnifiedDashboard.vue statCards (L574-582) — 同步修改

---

### 改动2: 当年累计营收增加指标完成率

#### 2a. 数据层：yearTotalRevenue 增加 target/completionRate 字段

**RevenueDashboard.vue L609-613** 和 **UnifiedDashboard.vue L813-817**：

```javascript
// 原来
const yearTotalRevenue = ref([
  { name: '施工类', value: '3,000万元' },
  { name: '产品类', value: '2,000万元' },
  { name: '其他类', value: '1,000万元' }
])

// 改为
const yearTotalRevenue = ref([
  { name: '施工类', value: '3,000万元', target: 4000, actual: 3000 },
  { name: '产品类', value: '2,000万元', target: 2500, actual: 2000 },
  { name: '其他类', value: '1,000万元', target: 1500, actual: 1000 }
])

// 新增computed: 总体指标完成率
const overallCompletionRate = computed(() => {
  const totalActual = yearTotalRevenue.value.reduce((s, i) => s + i.actual, 0)
  const totalTarget = yearTotalRevenue.value.reduce((s, i) => s + i.target, 0)
  return totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : 0
})
```

> 公式说明：总体完成率 = (施工类实际3000 + 产品类实际2000) / (施工类目标4000 + 产品类目标2500) * 100% = 5000/6500 = 76.9%

#### 2b. 模板层：每个列表项增加进度条

**RevenueDashboard.vue L174-189** 和 **UnifiedDashboard.vue L178-193**：

在 `<li>` 内部，数值后面增加进度条：

```html
<li ...>
  <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background:#13c2c2;"></span>{{ item.name }}</span>
  <div class="flex items-center gap-3">
    <!-- 数值 -->
    <span class="text-gray-600">{{ item.value }}</span>
    <!-- 进度条 -->
    <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all" :style="{ width: ((item.actual/item.target)*100)+'%', background: getRateColor(item.actual/item.target*100) }"></div>
    </div>
    <!-- 完成率数字 -->
    <span class="text-xs font-medium whitespace-nowrap" :class="getRateTextClass(item.actual/item.target*100)">
      {{ ((item.actual/item.target)*100).toFixed(1) }}%
    </span>
    <!-- 钻取箭头 -->
    <svg ...>→</svg>
  </div>
</li>
```

新增辅助函数（两个文件各加一次）：
```javascript
const getRateColor = (rate) => {
  if (rate >= 100) return '#22c55e'
  if (rate >= 50) return '#eab308'
  return '#ef4444'
}
const getRateTextClass = (rate) => {
  if (rate >= 100) return 'text-green-600'
  if (rate >= 50) return 'text-yellow-600'
  return 'text-red-600'
}
```

> 注意：`getRateClass`/`getRateTextClass` 在 RevenueSummary.vue 中已存在(L766-776)，可直接复用相同逻辑。但为了避免跨文件依赖，在各自文件中内联即可。

---

### 改动3: 删除红色预警

#### 3a. RevenueDashboard.vue (L203-211)

删除整个红色预警 `<div>` 块（从 `<div class="flex items-center..." @click="handleWarningDrill('red')">` 到其闭合 `</div>`）：

```html
<!-- 删除此块 -->
<div class="flex items-center gap-1.5 cursor-pointer hover:bg-red-50 ..." @click="handleWarningDrill('red')">
  <span class="w-2.5 h-2.5 rounded-full" style="background:#f5222d;"></span>
  <span class="text-xs text-gray-600">红色预警</span>
  <span class="text-sm font-bold" style="color:#f5222d;">{{ timelinessSingle.redAlert }}</span>
</div>
```

保留橙色和黄色预警不变。

#### 3b. UnifiedDashboard.vue (L207-215) — 同步删除

---

### 改动4: 当年累计完成营收情况新增Tab切换

#### 4a. 模板改造：标题区增加Tab按钮

**RevenueDashboard.vue L337-349** 和 **UnifiedDashboard.vue L342-353**：

将原来的标题行替换为：

```html
<div class="bg-white rounded-xl p-4 shadow-sm">
  <!-- 标题栏 + Tab切换 -->
  <div class="flex items-center justify-between mb-1">
    <h3 class="text-sm font-semibold text-gray-800">当年累计完成营收情况</h3>
    <div class="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      <button
        :class="['px-3 py-1 text-xs rounded-md transition-all', sectorViewMode === 'business' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-500']"
        @click="switchSectorView('business')"
      >业务类型</button>
      <button
        :class="['px-3 py-1 text-xs rounded-md transition-all', sectorViewMode === 'region' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-500']"
        @click="switchSectorView('region')"
      >区域</button>
    </div>
  </div>
  <!-- 统计文字 -->
  <div class="text-left text-xs text-gray-500 mb-2">
    共 <b>{{ totalProjects }}</b> 个项目，累计营收 <b class="text-blue-600">{{ totalRevenue.toLocaleString() }}</b> 万元
  </div>
  <!-- 图表 -->
  <div ref="sectorChartRef" class="h-72 cursor-pointer" @click="handleSectorChartClick"></div>
</div>
```

#### 4b. 数据层：新增响应式变量和方法

**RevenueDashboard.vue** 和 **UnifiedDashboard.vue** 各添加：

```javascript
// Tab状态
const sectorViewMode = ref('business')  // 'business' | 'region'

// 区域维度数据（从tooltip中提取的6个区域）
const regionData = ref([
  { name: '上海', projectCount: 25, revenue: 45000 },
  { name: '长三角总部', projectCount: 24, revenue: 38000 },
  { name: '中原总部', projectCount: 16, revenue: 22000 },
  { name: '大湾区总部', projectCount: 18, revenue: 28000 },
  { name: '境外区域', projectCount: 3, revenue: 8500 },
  { name: '其他城市区域', projectCount: 10, revenue: 7000 }
])

// 切换视图
const switchSectorView = (mode) => {
  sectorViewMode.value = mode
  initSectorChart()  // 重新渲染图表
}
```

#### 4c. initSectorChart 根据 sectorViewMode 选择数据源

**RevenueDashboard.vue L677** 和 **UnifiedDashboard.vue L881**：

在 `initSectorChart()` 函数开头，根据 mode 选择数据：

```javascript
const initSectorChart = () => {
  if (sectorChartRef.value) {
    const chart = echarts.init(sectorChartRef.value)
    // 根据Tab选择数据源
    const data = sectorViewMode.value === 'region' ? regionData.value : businessData.value
    
    // 其余配置保持不变...
    // xAxis.data = data.map(item => item.name)
    // series data = data.map(...)
  }
}
```

当 `sectorViewMode === 'region'` 时：
- X轴 = 6个区域名（上海/长三角总部/中原总部/大湾区总部/境外区域/其他城市区域）
- Y轴配置与业务类型完全一致（左=项目数量bar，右=累计营收line）
- Tooltip也保持同样格式（显示项目数量+营收金额）

---

### 改动5: 施工类总营收表增加浦东供排水行

**文件**: [RevenueSummary.vue](src/components/revenue/RevenueSummary.vue)

#### 5a. rawData 数组中增加浦东供排水（在二次养护之后）

**位置**: L630（rawData数组最后一个元素之后，`]`之前）

```javascript
// 在二次养护(id:9)之后追加
{
  id: 10,
  name: '浦东供排水',
  revenueTarget: 12000,
  carryForwardConstruction: 2400,
  completedPendingSettlement: 1200,
  planConstruction: 2800,
  planCompleted: 1400,
  planNew: 2400,
  actualConstruction: 2600,
  actualCompleted: 1300,
  actualNew: 2100,
  reportedRevenue: 6000,
  newContractAmount: 3600,
  remainingContract: 7200,
  nextMonthPlan: 650
}
```

> 数据设计依据：浦东供排水作为独立基层单位，规模略小于管道工程(14000万)，设定为12000万营收指标，各项字段按比例合理分配。

#### 5b. allUnits 数组同步更新

**位置**: L636-639

在 `'二次养护'` 后面追加 `'浦东供排水'`。

> 注：filteredConstructionData 的计算逻辑会自动将新单位纳入并重新计算合计行，无需额外改动。

---

### 改动6: 供应商合同名称去掉"合同签订及时性"

#### 6a. mockData.js subItems 名称 (L169-174)

| 原名称 | 新名称 |
|--------|--------|
| `专业分包合同签订及时性` | `专业分包` |
| `劳务分包合同签订及时性` | `劳务分包` |
| `周转材料/设备租赁合同签订及时性` | `周转材料/设备租赁` |
| `材料/设备采购合同签订及时性` | `材料/设备采购` |

#### 6b. SupplyChainTimeliness.vue categoryMap 同步 (L172-177)

categoryMap 的 key 需要与新名称匹配：

```javascript
const categoryMap = {
  '专业分包': '专业分包',
  '劳务分包': '劳务分包',
  '周转材料/设备租赁': '周转材料/设备租赁',
  '材料/设备采购': '材料/设备采购'
}
```

> 实际上 key 和 value 相同了，但保留映射结构以兼容 handleCategoryTitleClick 函数。

---

## 四、假设与决策

1. UnifiedDashboard.vue 与 RevenueDashboard.vue 的营收管理部分需**完全同步修改**（用户明确说"产运看板中的营收管理看板部分"）
2. 指标完成率的 target 值使用合理的模拟数据（施工类4000/产品类2500/其他类1500），actual 从原value解析
3. 区域维度的 revenue 数据按区域重要性分配（上海最高45000万，境外最低8500万）
4. 浦东供排水的表格数据参照管道工程按比例缩放生成
5. 不引入新的npm依赖

## 五、验证步骤

开发服务器已在 http://localhost:5173/ 运行，刷新后逐项验证：

- [ ] **改动1**: 6个KPI卡片名称均不含"施工类"前缀
- [ ] **改动2**: 当年累计营收每项后有彩色进度条+百分比数值
- [ ] **改动3**: 营收计划上报及时性仅剩橙色+黄色预警，无红色
- [ ] **改动4**: 累计营收图表右上角有"业务类型"/"区域"两个tab；点击"区域"后X轴变为6个区域名，Y轴不变
- [ ] **改动5**: 营收汇总表→施工类总营收表中，"浦东供排水"行出现在"二次供水"和"合计"之间
- [ ] **改动6**: 供应链看板的4个合同类别名称不再包含"合同签订及时性"
