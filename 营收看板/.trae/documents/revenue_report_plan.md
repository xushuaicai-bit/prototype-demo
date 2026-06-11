# 营收报表功能实现计划

## 一、需求分析

根据用户需求，需要在"集采功能单"下新增以下目录结构：
- 一级目录：营收报表
  - 二级目录：营收汇总表
  - 二级目录：营收明细表
  - 二级目录：当月偏差项目表

### 1.1 营收汇总表需求
- 多级表头结构
- 树形层级（本部、城建水务、水务建设、合计）
- 支持分组折叠/展开
- 横向滚动
- 一键导出 Excel
- 进度条展示完成率
- 自动计算列

### 1.2 营收明细表需求
- 虚拟滚动支持大数据量
- 前三列固定左侧
- 高级检索过滤（基层单位、项目状态、协管项目）
- 1-12月月度上报流水
- 自动计算累计上报营收
- 底部总计行

### 1.3 当月偏差项目表需求
- 动态月份联动
- N月营收完成率和偏差自动计算
- 行内编辑功能（偏差原因、措施）
- 负数偏差红色预警
- 偏差项目视觉标记

## 二、技术方案

### 2.1 项目结构
```
src/
├── components/
│   ├── layout/
│   │   └── Sidebar.vue          # 修改：添加营收报表子菜单
│   └── revenue/
│       ├── RevenueSummary.vue   # 营收汇总表组件
│       ├── RevenueDetail.vue    # 营收明细表组件
│       └── RevenueDeviation.vue # 当月偏差项目表组件
├── views/
│   ├── Dashboard.vue
│   └── RevenueReport.vue        # 营收报表主视图
├── data/
│   └── mockData.js              # 添加营收相关 mock 数据
├── App.vue                      # 修改：支持视图切换
└── main.js
```

### 2.2 核心技术点
- 使用 Element Plus 的 ElTable 组件实现数据网格
- 使用 ElTable 的 tree-props 实现树形层级
- 使用 fixed 属性实现固定列
- 使用 span-method 实现合并单元格
- 自定义计算逻辑实现自动汇总

## 三、实施步骤

### 3.1 修改 Sidebar.vue
- 添加"营收报表"一级菜单（作为"集采功能单"的子菜单）
- 添加三个二级菜单：营收汇总表、营收明细表、当月偏差项目表

### 3.2 创建 RevenueReport.vue 主视图
- 作为营收报表的容器组件
- 根据侧边栏选择显示不同的报表组件

### 3.3 创建 RevenueSummary.vue
- 实现多级表头结构
- 实现树形数据展示
- 实现完成率进度条
- 实现自动计算逻辑
- 实现导出 Excel 功能

### 3.4 创建 RevenueDetail.vue
- 实现虚拟滚动
- 实现固定列
- 实现高级检索过滤
- 实现月度流水列
- 实现累计计算和总计行

### 3.5 创建 RevenueDeviation.vue
- 实现月份动态联动
- 实现完成率和偏差自动计算
- 实现行内编辑
- 实现负数预警样式

### 3.6 更新 mockData.js
- 添加营收汇总表数据
- 添加营收明细表数据
- 添加偏差项目数据

### 3.7 更新 App.vue
- 添加视图切换逻辑

## 四、依赖与风险

### 4.1 依赖确认
- Element Plus 已安装（^2.6.1）
- Tailwind CSS 已安装（^3.4.14）
- Vue 3 已安装（^3.4.21）

### 4.2 潜在风险
- 多级表头的复杂程度可能导致样式问题
- 虚拟滚动与固定列的兼容性
- 大数据量下的性能问题

## 五、输出物

1. 修改 `src/components/layout/Sidebar.vue`
2. 新建 `src/components/revenue/RevenueSummary.vue`
3. 新建 `src/components/revenue/RevenueDetail.vue`
4. 新建 `src/components/revenue/RevenueDeviation.vue`
5. 新建 `src/views/RevenueReport.vue`
6. 更新 `src/data/mockData.js`
7. 更新 `src/App.vue`