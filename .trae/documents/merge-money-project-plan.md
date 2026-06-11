# 合并 money 项目到营收看板 - 实施计划

## 概述

将 `C:\Users\Shuaicai-Huawei\Documents\trae_projects\money\` 仓库中的资金管理页面合并到当前项目 `e:\trae_demo_env\营收看板\`，放置于"资金管理"一级菜单下。

## 当前状态分析

### 源项目（money）
- 技术栈：Vue 3 + TypeScript + Element Plus + ECharts
- 无 vue-router，通过 `activeMenu` + `v-if` 切换页面
- **4个已实现组件**：
  - `InsuranceBrokerList.vue` - 保险经纪列表（含内联 Mock 数据）
  - `FinanceReport.vue` - 业财统计报表（含内联 Mock 数据，约816行）
  - `ProjectStatusSummary.vue` - 按项目状态分类汇总表（含内联 Mock 数据）
  - `BranchReport.vue` - 按分公司分类报表（含内联 Mock 数据）
- **2个未使用组件**：`MoneyChart.vue`、`SummaryPanel.vue`（依赖 `mockData.ts`，当前未被引用）
- **10个未实现菜单项**：收入确认汇总表、收入确认明细、项目台账、保证金管理、业务收款登记、应付保理付款、对公回单归档、税票管理、预算管理、收入确认

### 目标项目（营收看板）
- 技术栈：Vue 3 + JavaScript + Element Plus + Tailwind CSS + ECharts
- 无 vue-router，通过 `currentNav`/`currentMenu`/`currentSubMenu` 切换页面
- "资金管理"一级菜单已存在于 Header.vue（第6项）
- Sidebar.vue 中"资金管理"下仅有1个占位菜单项"财务报表"（无对应视图）
- App.vue 中无对应的视图映射和渲染逻辑

### 关键差异
- 源项目使用 TypeScript，目标项目使用 JavaScript → 需要转换
- 4个已实现组件均包含内联 Mock 数据，不依赖外部 `mockData.ts` → 无需迁移数据文件
- `MoneyChart.vue` 和 `SummaryPanel.vue` 在源项目中未被使用 → 暂不迁移

## 实施步骤

### 步骤1：创建资金管理组件目录并复制组件

在 `e:\trae_demo_env\营收看板\src\components\` 下创建 `fund/` 目录，将4个已实现组件复制过来并做 TypeScript → JavaScript 转换：

| 源文件 | 目标文件 | 转换要点 |
|--------|---------|---------|
| `money/src/components/InsuranceBrokerList.vue` | `营收看板/src/components/fund/InsuranceBrokerList.vue` | 移除 `lang="ts"`、`interface`、类型注解 |
| `money/src/components/FinanceReport.vue` | `营收看板/src/components/fund/FinanceReport.vue` | 移除 `lang="ts"`、`interface`、类型注解、泛型参数 |
| `money/src/components/ProjectStatusSummary.vue` | `营收看板/src/components/fund/ProjectStatusSummary.vue` | 移除 `lang="ts"`、`interface`、类型注解 |
| `money/src/components/BranchReport.vue` | `营收看板/src/components/fund/BranchReport.vue` | 移除 `lang="ts"`、`interface`、类型注解 |

TypeScript → JavaScript 转换规则：
- `<script setup lang="ts">` → `<script setup>`
- 移除所有 `interface` 声明
- 移除变量/参数的类型注解（如 `: string`、`: number`、`: FinanceData[]`）
- 移除泛型参数（如 `computed<GroupedColumns[]>(...)` → `computed(...)`）
- 移除 `as` 类型断言（如 `(item as any)[prop]` → `item[prop]`）
- 移除 `import type` 语句
- `ref<FinanceData[]>(...)` → `ref(...)`

### 步骤2：更新 Sidebar.vue 菜单配置

文件：`e:\trae_demo_env\营收看板\src\components\layout\Sidebar.vue`

将"资金管理"的菜单项从当前的单一占位项替换为 money 项目的完整菜单结构：

```javascript
'资金管理': [
  {
    name: '保险经纪',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
    ]),
    key: 'insurance-broker'
  },
  {
    name: '业财统计报表',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ]),
    key: 'finance-report'
  },
  {
    name: '按项目状态分类汇总表',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 10h16M4 14h16M4 18h16' })
    ]),
    key: 'project-status-summary'
  },
  {
    name: '按分公司分类报表',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
    ]),
    key: 'branch-report'
  },
  // 以下为未实现菜单项（仅展示）
  { name: '收入确认汇总表', icon: () => h('svg', ...), key: 'revenue-confirm-summary' },
  { name: '收入确认明细', icon: () => h('svg', ...), key: 'revenue-confirm-detail' },
  { name: '项目台账', icon: () => h('svg', ...), key: 'project-ledger' },
  { name: '保证金管理', icon: () => h('svg', ...), key: 'deposit-management' },
  { name: '业务收款登记', icon: () => h('svg', ...), key: 'payment-registration' },
  { name: '应付保理付款', icon: () => h('svg', ...), key: 'factoring-payment' },
  { name: '对公回单归档', icon: () => h('svg', ...), key: 'receipt-archive' },
  { name: '税票管理', icon: () => h('svg', ...), key: 'tax-invoice-management' },
  { name: '预算管理', icon: () => h('svg', ...), key: 'budget-management' },
  { name: '收入确认', icon: () => h('svg', ...), key: 'revenue-confirmation' }
]
```

### 步骤3：更新 App.vue 视图映射和渲染逻辑

文件：`e:\trae_demo_env\营收看板\src\App.vue`

**3a. 添加组件导入：**
```javascript
import InsuranceBrokerList from './components/fund/InsuranceBrokerList.vue'
import FinanceReport from './components/fund/FinanceReport.vue'
import ProjectStatusSummary from './components/fund/ProjectStatusSummary.vue'
import BranchReport from './components/fund/BranchReport.vue'
```

**3b. 在 viewMap 中添加映射：**
```javascript
const viewMap = {
  // ... 现有映射
  '保险经纪': markRaw(InsuranceBrokerList),
  '业财统计报表': markRaw(FinanceReport),
  '按项目状态分类汇总表': markRaw(ProjectStatusSummary),
  '按分公司分类报表': markRaw(BranchReport)
}
```

这4个页面作为看板类页面，通过 `viewMap` + `<component :is>` 动态渲染，与现有的"市场管理看板"、"经济管理看板"等页面保持一致的渲染方式。

### 步骤4：处理"资金管理"下的占位显示

当用户点击未实现的菜单项时，由于 `viewMap` 中没有对应映射，`currentViewComponent` 将返回 `null`，页面会显示空白。需要添加一个兜底显示，当 `currentViewComponent` 为 `null` 且 `currentNav` 不是"管理总览"/"安全管理"时，显示"该功能正在开发中"提示。

在 App.vue 模板中，在 `<component :is>` 之后添加：
```html
<div v-else class="h-full flex items-center justify-center text-gray-400">
  <div class="text-center">
    <p class="text-lg font-medium">该功能正在开发中</p>
  </div>
</div>
```

## 假设与决策

1. **不迁移 MoneyChart.vue 和 SummaryPanel.vue**：这两个组件在源项目中未被使用，且依赖独立的 `mockData.ts`，暂不迁移
2. **不迁移 mockData.ts**：4个已实现组件均包含内联 Mock 数据，无需外部数据文件
3. **TypeScript → JavaScript 转换**：目标项目使用 JavaScript，需移除所有 TypeScript 语法
4. **菜单结构保持扁平**：money 项目的菜单项均为同级，不使用父子层级
5. **未实现菜单项保留**：10个未实现的菜单项仍保留在侧边栏中，点击后显示"开发中"提示
6. **渲染方式使用 viewMap**：与现有看板页面保持一致，通过 `viewMap` + 动态组件渲染

## 验证步骤

1. 启动开发服务器 `npm run dev`
2. 点击顶部"资金管理"一级导航
3. 验证侧边栏显示14个菜单项（4个已实现 + 10个未实现）
4. 依次点击4个已实现菜单项，验证页面正常渲染：
   - 保险经纪：搜索过滤和表格展示
   - 业财统计报表：搜索、Tab切换、自定义字段、导出
   - 按项目状态分类汇总表：汇总表格和导出
   - 按分公司分类报表：搜索、小计/总计、导出
5. 点击未实现菜单项，验证显示"开发中"提示
6. 切换到其他一级导航再切回"资金管理"，验证状态正确重置
