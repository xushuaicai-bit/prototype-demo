# 营收明细表筛选栏统一改造计划

## 一、问题分析

当前营收明细表筛选栏中：
- "基层单位"和"项目状态"已使用 el-select 下拉单选
- "营收统计口径"和"是否协管项目"使用的是 el-radio-group

用户要求统一使用 el-select 下拉单选，并允许取消选择。

## 二、实施步骤

修改 RevenueDetail.vue 中的筛选栏：
1. 将"营收统计口径"从 el-radio-group 改为 el-select
2. 将"是否协管项目"从 el-radio-group 改为 el-select
3. 添加"全部"选项支持取消选择

## 三、输出文件

修改 `src/components/revenue/RevenueDetail.vue`