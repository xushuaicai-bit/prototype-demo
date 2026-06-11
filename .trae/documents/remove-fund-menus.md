# 删除资金管理下的二级菜单项

## 概述
删除资金管理一级菜单下的11个二级菜单项，仅保留3个已实现的报表页面。

## 需删除的菜单项（11个）
保险经纪、收入确认汇总表、收入确认明细、项目台账、保证金管理、业务收款登记、应付保理付款、对公回单归档、税票管理、预算管理、收入确认

## 保留的菜单项（3个）
业财统计报表、按项目状态分类汇总表、按分公司分类报表

## 变更文件

### 1. `e:\trae_demo_env\营收看板\src\components\layout\Sidebar.vue`
- 将 `'资金管理'` 数组从14项缩减为3项，删除上述11个菜单对象

### 2. `e:\trae_demo_env\营收看板\src\App.vue`
- 删除 `import InsuranceBrokerList from './components/fund/InsuranceBrokerList.vue'`（保险经纪菜单已删除）
- 删除 viewMap 中的 `'保险经纪': markRaw(InsuranceBrokerList)` 条目

### 3. `e:\trae_demo_env\营收看板\src\components\fund\InsuranceBrokerList.vue`
- 删除该文件（保险经纪菜单已删除，组件不再使用）

## 验证
- 启动开发服务器，点击"资金管理"，确认侧边栏仅显示3个菜单项
- 3个报表页面正常渲染
