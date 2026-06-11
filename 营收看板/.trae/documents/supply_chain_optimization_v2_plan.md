# 供应链看板优化计划（第二阶段）

## 需求分析

根据用户需求，需要对供应链看板进行以下优化：

1. **A级承包商统计图表优化**
   - 正在执行的合同额改为平滑线性显示
   - 双轴纵坐标：左侧为数量，右侧为金额
   - 点击A级承包商数量柱子下钻至供应商详情表（按A级筛选）

2. **供应商合同签订报表新增字段**
   - 供应商名称
   - 供应商等级（A/B/C级）
   - 合同状态（正常履约、履约结束、合同作废）

3. **下钻功能优化**
   - 点击正在执行合同数下钻至供应商签订报表
   - 按"正常履约"状态筛选，并按对应合同类型筛选

4. **横轴标签优化**
   - 合同类型标记清楚（当前只标记了两个类型）

5. **Top10供应商图表优化**
   - 横轴显示供应商名称而非数字
   - 点击柱子下钻至供应商合同签订报表（按供应商名称筛选）

## 技术方案

### 1. A级承包商统计图表优化
- 修改 `SupplierStatChart.vue` 支持双轴显示
- "正在执行合同额"改为折线图，使用右侧Y轴
- 修改点击事件，区分点击的是哪个系列

### 2. 供应商合同签订报表新增字段
- 修改 `SupplierContractReport.vue` 添加新列
- 更新数据模型添加供应商名称、等级、合同状态字段

### 3. 下钻功能优化
- 修改图表点击事件，传递合同类型和状态筛选条件

### 4. 横轴标签优化
- 更新 `mockData.js` 中的 `supplierStatChart1Data.categories` 确保显示所有四个合同类型

### 5. Top10供应商图表优化
- 修改 `mockData.js` 中的 `supplierStatChart2Data.categories` 为供应商名称
- 更新 `SupplierStatChart.vue` 点击事件支持按供应商名称下钻

## 文件修改清单

| 文件路径 | 修改内容 |
|---------|---------|
| `src/components/dashboard/SupplierStatChart.vue` | 支持双轴、折线图显示、区分系列点击 |
| `src/components/supply-chain/SupplierContractReport.vue` | 添加供应商名称、等级、合同状态列 |
| `src/data/mockData.js` | 更新Top10供应商categories为供应商名称 |
| `src/views/SupplyChainDashboard.vue` | 更新下钻事件处理逻辑 |

## 实施步骤

1. **Step 1**: 修改 `mockData.js` 更新Top10供应商数据和合同类型
2. **Step 2**: 修改 `SupplierStatChart.vue` 支持双轴和折线图
3. **Step 3**: 修改 `SupplierContractReport.vue` 添加新字段
4. **Step 4**: 更新 `SupplyChainDashboard.vue` 处理下钻事件

## 风险评估

- 双轴图表可能影响响应式效果，需要测试
- 数据模型变更需确保向后兼容
- 下钻事件逻辑需要确保正确传递筛选条件