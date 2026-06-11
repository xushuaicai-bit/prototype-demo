# 供应链看板优化计划

## 需求分析

根据用户需求，需要对供应链看板进行以下优化：

1. **上方筛选同营收看板一样，按全部和9家基层单位筛**
2. **供应商合同签订情况支持下钻到供应商合同签订报表**
3. **供应商统计-A级承包商、供应商统计-Top10承包商、材料集采推广情况放在一排**
4. **供应商详情表新增'供应商等级'列**
5. **供应商统计-A级承包商点击下钻供应商详情表（按A级筛选）**
6. **供应商统计-Top10承包商点击下钻供应商详情表（按金额Top10筛选）**

## 技术方案

### 1. 筛选器实现
- 在 `SupplyChainDashboard.vue` 顶部添加与营收看板相同的筛选器组件
- 使用 `departmentData` 作为筛选数据源

### 2. 供应商合同签订情况图表下钻
- 修改 `SupplyContractChart.vue` 添加点击事件
- 支持按已签订、黄色预警、橙色预警、红色预警分别下钻

### 3. 布局调整
- 修改 `SupplyChainDashboard.vue` 布局
- 将供应商统计-A级承包商、供应商统计-Top10承包商、材料集采推广情况放在同一排
- 前两个打包成一个模块组

### 4. 供应商详情表添加供应商等级列
- 修改 `SupplierDetailReport.vue` 添加供应商等级列
- 在数据中添加供应商等级字段（A/B/C级）

### 5. 供应商统计-A级承包商下钻
- 修改 `SupplierStatChart.vue` 添加点击事件
- 点击时传递A级供应商筛选条件

### 6. 供应商统计-Top10承包商下钻
- 修改 `SupplierStatChart.vue` 添加点击事件
- 点击时传递Top10供应商筛选条件

## 文件修改清单

| 文件路径 | 修改内容 |
|---------|---------|
| `src/views/SupplyChainDashboard.vue` | 添加筛选器、调整布局、添加下钻事件处理 |
| `src/components/dashboard/SupplyContractChart.vue` | 添加图表点击事件，支持下钻 |
| `src/components/dashboard/SupplierStatChart.vue` | 添加图表点击事件，支持下钻 |
| `src/components/dashboard/MaterialProcurementChart.vue` | 添加下钻指示 |
| `src/components/supply-chain/SupplierDetailReport.vue` | 添加供应商等级列 |
| `src/data/mockData.js` | 更新供应商数据，添加等级字段 |

## 实施步骤

1. **Step 1**: 修改 `SupplyChainDashboard.vue` 添加筛选器
2. **Step 2**: 修改 `SupplyContractChart.vue` 添加下钻功能
3. **Step 3**: 修改 `SupplierStatChart.vue` 添加下钻功能
4. **Step 4**: 修改 `SupplierDetailReport.vue` 添加供应商等级列
5. **Step 5**: 更新 `mockData.js` 添加供应商等级数据
6. **Step 6**: 调整 `SupplyChainDashboard.vue` 布局

## 风险评估

- 布局调整可能影响响应式效果，需要测试不同屏幕尺寸
- 下钻功能需要确保事件传递正确
- 供应商等级数据需要与实际业务逻辑匹配