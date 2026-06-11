# 营收汇总表进度条 + 供应商合同数据修复计划

## 一、需求概述

两个问题：

1. **营收汇总表(RevenueSummary.vue)**：确认浦东供排水已在基层单位中；在"当年累计营收"KPI卡片区域增加一个**总体指标完成率**进度条（不是每个分类都加，只加一个总的）
2. **供应商合同签订报表(SupplierContractReport.vue)**：数据丢失，需要恢复/补充之前造过的数据

***

## 二、当前状态分析

### 问题1: RevenueSummary.vue 当年累计营收进度条

**浦东供排水状态**: 已在上轮添加到 rawData (L634-650, id:10) 和 allUnits (L638)。**此项已完成。**

**当年累计营收位置**: 在 [RevenueDashboard.vue#L141-L169](src/views/RevenueDashboard.vue#L141-L169)，"总体营收情况"模块中的KPI卡片：

```html
<!-- 总体营收KPI卡片 -->
<div v-for="card in overallStatCards" :key="card.title" ...>
  <span>{{ card.title }}</span>          <!-- ← "当年累计营收" -->
  <div>{{ card.value }}{{ card.unit }}</div>   <!-- ← "3.56万元" -->
</div>
```

用户要求：在这个KPI卡片的数值后面，增加**一个**总体指标完成率进度条（公式=(施工类actual+产品类actual)/(施工类target+产品类target)\*100%），而不是在每个yearTotalRevenue列表项上都加（上轮已经加了列表项级别的，用户说"不是每类都加"）。

> 解读：用户可能希望的是——在"当年累计营收"这个**KPI卡片本身**的值下面，显示一个总体的完成率进度条。或者去掉上轮加在每个列表项上的进度条，改为只在KPI卡片上加一个总体的。
>
> 基于用户原话"当年累计营收这个指标后面增加...不是每类都加"，最合理的做法是：
>
> * **不要 **yearTotalRevenue 列表中每项的进度条（已做）
>
> * **额外**在"当年累计营收"KPI卡片下方新增一行总体完成率进度条

### 问题2: SupplierContractReport.vue 数据丢失

**当前数据现状** (L341-L831):

* `rawData` 有 **9个项目** (P001-P009)

* `allUnits` 有 **9个单位** (缺浦东供排水)

* 每个项目下有 3-5 个合同记录

* 总计约 **35-40 条合同记录**

**可能丢失的数据**：

* 之前可能为"浦东供排水"单位造过项目数据

* `allUnits` 缺少 `'浦东供排水'`

* 可能还有更多项目被遗漏

***

## 三、具体改动清单

### 改动1: 当年累计营收KPI卡片增加总体完成率进度条

**文件**: [RevenueDashboard.vue](src/views/RevenueDashboard.vue) + [UnifiedDashboard.vue](src/views/UnifiedDashboard.vue)

**位置**: "当年累计营收"KPI卡片的 value div 之后（约 L167 和 UnifiedDashboard 对应位置）

在 `<div :class="['mt-2 text-xl font-bold', ...]">{{ card.value }}<span ...>{{ card.unit }}</span></div>` 之后，针对 title === '当年累计营收' 的卡片，增加总体完成率：

```html
<!-- 当年累计营收 KPI 卡片 -->
<div ...>
  <span>当年累计营收</span>
  ...
  <div class="mt-2 text-xl font-bold ...">3.56<span class="...">万元</span></div>
  <!-- 新增：总体指标完成率进度条 -->
  <div class="mt-2 pt-2 border-t border-gray-100">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs text-gray-500">指标完成率</span>
      <span class="text-xs font-bold" :class="overallCompletionRate >= 100 ? 'text-green-600' : overallCompletionRate >= 50 ? 'text-yellow-600' : 'text-red-600'">{{ overallCompletionRate }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-1.5">
      <div
        class="h-1.5 rounded-full transition-all"
        :style="{ width: Math.min(overallCompletionRate, 100) + '%', background: overallCompletionRate >= 100 ? '#22c55e' : overallCompletionRate >= 50 ? '#eab308' : '#ef4444' }"
      ></div>
    </div>
  </div>
</div>
```

**数据层**（两个文件各添加）:

```javascript
// 总体指标完成率（基于yearTotalRevenue的target和actual计算）
const overallCompletionRate = computed(() => {
  const totalActual = yearTotalRevenue.value.reduce((s, i) => s + (i.actual || 0), 0)
  const totalTarget = yearTotalRevenue.value.reduce((s, i) => s + (i.target || 0), 0)
  if (totalTarget <= 0) return 0
  return ((totalActual / totalTarget) * 100).toFixed(1)
})
```

> 当前值 = (3000+2000+1000)/(4000+2500+1500) = 6000/8000 = **75.0%**

***

### 改动2: 供应商合同签订报表补充数据

**文件**: [SupplierContractReport.vue](src/components/supply-chain/SupplierContractReport.vue)

#### 2a. allUnits 增加"浦东供排水" (L320-323)

```javascript
const allUnits = [
  '管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设',
  '管道工程', '管道分公司', '运营养护', '二次养护', '浦东供排水'
]
```

#### 2b. rawData 追加第10个项目 — 浦东供排水相关 (L831 `]` 之前)

在现有9个项目之后追加1个新项目，包含完整的合同数据：

```javascript
{
  projectCode: 'P010',
  projectName: '浦东供水管网扩建工程',
  unit: '浦东供排水',
  status: '在建',
  contracts: [
    {
      category: '专业分包',
      supplierName: '上海建工集团',
      supplierLevel: 'A',
      contractStatus: '正常履约',
      contractName: '管网敷设专业分包合同',
      workScope: 'DN200-DN500管网敷设及附属设施安装',
      workVolume: '8000米',
      plannedAmount: 4200000,
      contractForm: '公开招标',
      plannedDate: '2026-01-10',
      actualDate: '2026-01-10',
      signStatus: '已签订',
      overdueDays: 0
    },
    {
      category: '劳务分包',
      supplierName: '上海劳务公司',
      supplierLevel: 'B',
      contractStatus: '正常履约',
      contractName: '管网敷设劳务分包合同',
      workScope: '管网敷设劳务作业及辅助施工',
      workVolume: '8000米',
      plannedAmount: 1200000,
      contractForm: '邀请招标',
      plannedDate: '2026-01-15',
      actualDate: '',
      signStatus: '未签订',
      overdueDays: 40
    },
    {
      category: '材料/设备采购',
      supplierName: '上海水务物资公司',
      supplierLevel: 'A',
      contractStatus: '正常履约',
      contractName: '管材管件采购合同',
      workScope: '球墨铸铁管及配件采购',
      workVolume: '8000米',
      plannedAmount: 2800000,
      contractForm: '集采',
      plannedDate: '2026-01-05',
      actualDate: '2026-01-08',
      signStatus: '已签订',
      overdueDays: 3
    },
    {
      category: '周转材料/设备租赁',
      supplierName: '浦东设备租赁公司',
      supplierLevel: 'C',
      contractStatus: '正常履约',
      contractName: '施工机械租赁合同',
      workScope: '挖掘机、吊车等机械设备租赁',
      workVolume: '5台',
      plannedAmount: 450000,
      contractForm: '比价',
      plannedDate: '2026-02-01',
      actualDate: '2026-02-03',
      signStatus: '已签订',
      overdueDays: 2
    }
  ]
}
```

***

## 四、验证步骤

开发服务器 <http://localhost:5173/> 运行中：

* [ ] 营收看板 → 总体营收情况 → "当年累计营收"KPI卡片下方出现总体指标完成率进度条（75.0%，黄色）

* [ ] 营收报表 → 营收汇总表 → 施工类总营收表 → 浦东供排水行出现在二次养护和合计之间

* [ ] 供应链报表 → 供应商合同签订报表 → 筛选器基层单位含"浦东供排水"

* [ ] 供应商合同签订报表 → 表格中可见"P010 浦东供水管网扩建工程"项目的4条合同记录

