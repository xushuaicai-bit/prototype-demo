# 统一公司名称修改计划

## 问题分析

根据搜索结果，项目中有多处使用旧的公司名称（城乡管道、二次养护、浦东供排水、设备安装），需要统一替换为新的9家公司标准列表：

1. 管网事业部
2. 生态事业部
3. 区域事业部
4. 市政事业部
5. 环境建设
6. 管道工程
7. 管道分公司
8. 运营养护
9. 二次养护

## 需要修改的文件

### 1. src/data/mockData.js
- 第166-169行：contractData 中的公司名称
- 第176行：chartData.categories

### 2. src/views/RevenueDashboard.vue
- 第170-173行：subTabs 筛选选项
- 第212-215行：pieDetails 饼图数据
- 第229行：timelinessChart xAxis 数据
- 第268-271行：pieChart 数据

### 3. src/views/MarketDashboard.vue
- 第16-19行：下拉选项
- 第446、456、466、477、488、497行：categories 数据

### 4. src/views/ProductionDashboard.vue
- 第252行：xAxis 数据

### 5. src/components/revenue/RevenueDetail.vue
- 第22-23行：下拉选项
- 第364、422行：数据中的公司名称

### 6. src/components/revenue/RevenueSummary.vue
- 第206、222行：数据中的公司名称

### 7. src/components/revenue/RevenueDeviation.vue
- 第32-33行：下拉选项
- 第441、479行：数据中的公司名称

## 实施步骤

1. 修改 mockData.js 中的公司名称
2. 修改 RevenueDashboard.vue 中的公司名称和图表数据
3. 修改 MarketDashboard.vue 中的公司名称和图表数据
4. 修改 ProductionDashboard.vue 中的图表数据
5. 修改 RevenueDetail.vue 中的下拉选项和数据
6. 修改 RevenueSummary.vue 中的数据
7. 修改 RevenueDeviation.vue 中的下拉选项和数据
8. 验证构建是否成功

## 预期效果

所有图表、报表和数据可视化展示中，公司名称统一为9家标准公司列表，顺序一致。