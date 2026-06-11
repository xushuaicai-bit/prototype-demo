# 营收汇总表多级表头修复计划

## 一、问题分析

用户反馈子列没有正确拆出来，需要使用 Element Plus 的嵌套 el-table-column 来实现真正的多级表头结构。

## 二、实施步骤

修改 RevenueSummary.vue 中的表格结构：
1. 将 `:columns` 属性方式改为显式嵌套的 el-table-column 定义
2. 实现真正的多级表头效果

## 三、输出文件

修改 `src/components/revenue/RevenueSummary.vue`