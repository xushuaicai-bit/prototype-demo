# 供应链看板和生产看板故障排查修复计划

## 问题分析

通过检查代码，发现以下问题导致看板无法正常显示：

### 1. 数据层问题
- **mockData.js** 文件被覆盖，缺少供应链相关数据导出
- 供应链看板组件依赖的 `supplyChainStatCards`、`supplyChainTimelinessData`、`supplyContractChartData`、`supplierStatChart1Data`、`supplierStatChart2Data`、`materialProcurementData` 等数据不存在

### 2. 导航层问题
- **Sidebar.vue** 缺少供应链管理看板菜单选项
- 没有生产看板菜单

### 3. 应用层问题
- **App.vue** 没有导入 `SupplyChainDashboard` 组件
- 路由逻辑没有处理供应链看板和生产看板的切换

## 修复步骤

### 步骤 1：恢复 mockData.js 中的供应链数据
添加供应链管理看板所需的完整数据结构，包括：
- supplyChainStatCards - 统计卡片数据
- supplyChainTimelinessData - 合同签订及时性数据
- supplyContractChartData - 供应商合同图表数据
- supplierStatChart1Data - 供应商统计图表1数据
- supplierStatChart2Data - 供应商统计图表2数据
- materialProcurementData - 材料集采推广数据

### 步骤 2：更新 Sidebar.vue
- 添加"供应链管理看板"菜单
- 添加"生产看板"菜单

### 步骤 3：更新 App.vue
- 导入 `SupplyChainDashboard` 组件
- 更新路由逻辑，支持供应链看板和生产看板的切换

## 文件修改清单

| 文件路径 | 修改内容 | 优先级 |
|---------|---------|--------|
| src/data/mockData.js | 添加供应链数据 | 高 |
| src/components/layout/Sidebar.vue | 添加供应链和生产看板菜单 | 高 |
| src/App.vue | 导入组件并更新路由 | 高 |

## 验证步骤

修复完成后，验证以下功能：
1. 侧边栏菜单显示供应链管理看板和生产看板
2. 点击菜单能正确切换到对应的看板页面
3. 看板页面能正确加载数据并展示图表
4. 数据展示完整，无控制台错误