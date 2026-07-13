# 资金管理 - 新增"销项项目汇总"报表实现计划

## 概述

在资金管理模块下新增"销项项目汇总"报表（《2026年销项项目经营分析报表》），包含顶部筛选区、核心指标卡、多级展开数据表、图表及项目下钻功能。

## 当前状态分析

### 技术栈
- Vue 3 (Composition API `<script setup>`) + Vite
- UI库：Element Plus（el-table、el-select、el-form、el-pagination 等）
- 样式：Tailwind CSS + scoped CSS
- 无路由库，通过 App.vue 的 `viewMap` + `currentMenu` 状态切换视图
- 无状态管理库，数据在各组件内部用 ref/computed 管理，使用 mock 数据

### 资金管理现有结构
- 侧边栏配置在 [Sidebar.vue](file:///e:/trae_demo_env/营收看板/src/components/layout/Sidebar.vue) 的 `menuMap['资金管理']`，现有3项：业财统计报表、按项目状态分类汇总表、按分公司分类报表
- App.vue 的 `viewMap` 映射菜单名到组件，当前资金管理映射了 FinanceReport、ProjectStatusSummary、BranchReport
- 组件位于 `src/components/fund/` 目录

### 关键模式（从现有代码中提取）
- **筛选区**：el-form inline + el-select/el-input，搜索/重置按钮（参考 BranchReport.vue、FinanceReport.vue）
- **指标卡**：使用 div + Tailwind 网格布局（参考 RevenueSummary.vue 顶部区域）
- **数据表**：el-table with border、stripe、show-summary、sortable="custom"（参考 RevenueSummary.vue、ProjectStatusSummary.vue）
- **多级展开**：el-table 的 `row-key` + `tree-props`（children/hasChildren）或 `type="expand"` 展开行
- **导出Excel**：现有组件使用 CSV Blob 方式导出（参考 ProjectStatusSummary.vue handleExport）
- **下钻导航**：emit('navigate', { view, report, filter })，App.vue handleNavigate 处理跳转
- **固定列**：el-table-column `fixed="left"`

## 实现方案

### 1. 新建组件文件

**文件**：`e:\trae_demo_env\营收看板\src\components\fund\OutputProjectSummary.vue`

组件结构（自上而下）：

#### 1.1 页面标题区
- 标题："2026年销项项目经营分析报表"
- 单位标注：万元
- 右侧操作按钮：导出Excel、保存筛选方案

#### 1.2 顶部筛选区
使用 el-form inline 布局，包含以下筛选项：

| 筛选项 | 类型 | 选项/规则 |
|--------|------|-----------|
| 分公司 | el-select multiple（支持全选/清空） | 管道工程、环境建设、运营养护、区域发展 |
| 一级分类 | el-select multiple | 水务、水环境治理、水利、城市更新、市政路桥房建、固废处理与处置、土壤修复、其他 |
| 二级分类 | el-select multiple | 根据一级分类联动过滤 |
| 三级分类 | el-select multiple | 根据二级分类联动过滤 |
| 项目数量范围 | 两个 el-input-number（最小值-最大值） | |
| 合同金额范围 | 两个 el-input-number（万元） | >=xxx 和 <=xxx |
| 利润状态 | el-select | 全部、正常项目、低利润项目、负偏差项目 |
| 平均销项利润率 | el-select | <0%、0%-3%、3%-5%、5%-10%、>10% |

- 筛选条件实时刷新数据（使用 computed 响应式过滤）
- "重置"按钮清空所有筛选条件
- "保存筛选方案"按钮：将当前筛选条件存入 localStorage，可下拉选择已保存方案

#### 1.3 核心指标卡区
使用 Tailwind 网格布局，6-7个指标卡：

| 指标卡 | 计算 |
|--------|------|
| 项目总数 | SUM(项目数量) |
| 合同金额(万元) | SUM(合同价) |
| 审定金额(万元) | SUM(审定价) |
| 平均目标利润率 | 加权平均 |
| 平均销项利润率 | 加权平均 |
| 利润偏差项目数 | COUNT(负偏差项目) |
| 合同金额完成率 | 审定价/合同价 ×100% |

#### 1.4 核心数据表（多级展开）
使用 el-table 的 tree-props 实现多级展开：

**展开层级**：分公司 → 一级分类 → 二级分类 → 三级分类

**数据结构**：将原始数据按层级聚合为树形结构，每个节点包含 children 数组

**表格列**：

| 列 | prop | 宽度 | 说明 |
|----|------|------|------|
| 分公司 | branch | 120 | fixed="left" |
| 一级分类 | category1 | 120 | fixed="left" |
| 二级分类 | category2 | 120 | |
| 三级分类 | category3 | 120 | |
| 项目数量 | projectCount | 100 | sortable |
| 合同价(不含税) | contractPrice | 140 | sortable，万元 |
| 审定价(不含税) | auditPrice | 140 | sortable，万元 |
| 合同金额占比 | contractRatio | 120 | 该行合同价/总合同价 |
| 平均目标利润率 | avgTargetProfitRate | 130 | sortable |
| 平均销项利润率 | avgOutputProfitRate | 130 | sortable |
| 利润率偏差 | profitDeviation | 120 | 销项利润率-目标利润率，负值红色 |
| 负偏差项目个数 | deviationCount | 130 | 可点击下钻，蓝色链接样式 |
| 风险等级 | riskLevel | 100 | 高风险(红)/正常(绿) 标签 |

**功能**：
- 排序：合同金额、项目数量、利润率、风险项目（sortable="custom" + sort-change 事件）
- 固定左侧分类字段（fixed="left"）
- 底部汇总行（show-summary + summary-method）
- 树形展开（row-key + :tree-props="{ children: 'children' }" + default-expand-all 可选）

#### 1.5 图表区
使用简单柱状图展示各分公司的合同价与审定价对比，以及利润率偏差分布。
- 使用 Element Plus 无内置图表库，现有组件使用纯 CSS 进度条或简单 SVG。为保持一致性，使用 CSS 柱状图（div + width百分比）展示各分公司合同金额对比。

#### 1.6 项目下钻
- 点击"负偏差项目个数"列的数字
- emit('navigate', { view: 'finance-report', filter: { branch, category1, category2, category3, type: 'deviation' } })
- App.vue 中 finance-report 已映射到 FinanceReport.vue，通过 currentMenu 跳转

### 2. Mock 数据设计

在组件内部生成 mock 数据：
- 分公司：管道工程、环境建设、运营养护、区域发展
- 一级分类及下属二/三级分类的映射关系数据
- 每个分公司×分类组合生成随机但合理的经营指标数据
- 使用 randomNumber 辅助函数生成

### 3. 修改 Sidebar.vue

**文件**：`e:\trae_demo_env\营收看板\src\components\layout\Sidebar.vue`

在 `menuMap['资金管理']` 数组中新增一项：

```js
{
  name: '销项项目汇总',
  icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ]),
  key: 'output-project-summary'
}
```

位置：放在 '按分公司分类报表' 之后。

### 4. 修改 App.vue

**文件**：`e:\trae_demo_env\营收看板\src\App.vue`

1. 在 script setup 中导入新组件：
```js
import OutputProjectSummary from './components/fund/OutputProjectSummary.vue'
```

2. 在 `viewMap` 中新增映射：
```js
'销项项目汇总': markRaw(OutputProjectSummary)
```

3. 下钻导航处理：由于 finance-report 已在 viewMap 中（'业财统计报表': markRaw(FinanceReport)），App.vue 的 handleNavigate 需要补充 finance-report 的 menuMap 映射。在 handleNavigate 的 menuMap 中新增：
```js
'finance-report': '业财统计报表'
```

### 5. 字段计算逻辑

- **利润率偏差** = 平均销项利润率 - 平均目标利润率
- **风险等级** = 利润率偏差 < 0 ? '高风险' : '正常'
- **负偏差项目** = 平均销项利润率 < 平均目标利润率 的项目
- **合同金额占比** = 当前行合同价 / 总合同价 × 100%
- **合同金额完成率** = 审定价合计 / 合同价合计 × 100%
- **汇总行** = 所有数值列 SUM，利润率为加权平均

### 6. 导出Excel

复用现有 CSV Blob 导出模式（参考 ProjectStatusSummary.vue）：
- 展开树形数据为平铺行
- 构建CSV字符串，添加 BOM 头
- 使用 Blob + URL.createObjectURL 下载

## 假设与决策

1. **数据来源**：使用 mock 数据（与现有所有报表一致），在组件内生成
2. **图表实现**：使用 CSS 柱状图（与现有 RevenueSummary 的进度条风格一致），不引入第三方图表库
3. **多级展开实现**：使用 el-table 的 tree-props 模式（children 嵌套），而非 type="expand"，这样展开行保持同列对齐
4. **下钻目标**：点击"负偏差项目个数"跳转到业财统计报表（FinanceReport），传递分公司和分类筛选条件
5. **保存筛选方案**：使用 localStorage 存储，下拉菜单选择已保存方案
6. **利润率区间筛选**：使用 el-select 下拉选择预设区间（<0%、0%-3%、3%-5%、5%-10%、>10%）
7. **联动过滤**：二级分类选项根据已选一级分类联动，三级分类根据已选二级分类联动

## 验证步骤

1. 启动开发服务器：`cd e:\trae_demo_env\营收看板 && npm run dev`
2. 在浏览器中打开应用，切换到"资金管理"导航
3. 验证侧边栏出现"销项项目汇总"菜单项
4. 点击进入，验证：
   - 顶部筛选区所有筛选项正常显示
   - 二级/三级分类联动过滤正常
   - 核心指标卡数据正确
   - 数据表多级展开正常（分公司→一级→二级→三级）
   - 排序功能正常
   - 左侧分类列固定
   - 底部汇总行显示正确
   - 点击"负偏差项目个数"跳转到业财统计报表
   - 导出Excel功能正常
   - 重置筛选功能正常
   - 保存/加载筛选方案功能正常
