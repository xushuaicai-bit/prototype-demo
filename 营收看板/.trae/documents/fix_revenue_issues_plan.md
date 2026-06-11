# 修复营收明细表问题计划

## 一、问题分析

### 问题1：收入统计口径字段枚举值不正确
当前数据中 `revenueCaliber` 字段的值为"施工类"，需要修改为标准枚举值：
- 新增立项
- 结转在建项目
- 完工待结算项目

### 问题2：表格横向滚动列显示不完整
当前表格布局存在以下问题：
- 列宽配置不合理，导致横向滚动时部分列无法完整显示
- 需要优化列宽配置，确保所有字段在滚动时均可完整展示

## 二、实施步骤

### 2.1 修改 RevenueDetail.vue
1. 更新 mock 数据中的 `revenueCaliber` 字段值为标准枚举值
2. 添加收入统计口径字段的下拉选择功能
3. 优化列宽配置，调整各列宽度确保完整显示

### 2.2 修改 RevenueSummary.vue
1. 优化表格横向滚动布局
2. 调整列宽配置

## 三、输出文件

1. 修改 `src/components/revenue/RevenueDetail.vue`
2. 修改 `src/components/revenue/RevenueSummary.vue`