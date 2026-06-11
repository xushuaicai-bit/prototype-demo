# Vue营收管理看板复原计划

## 项目概述

根据用户提供的截图，需要复原一个企业管理系统的营收管理看板。这是一个典型的管理后台Dashboard，包含：
- 顶部导航栏（管理首页、市场管理、产品管理、经营管理、安全管理、资金管理）
- 左侧侧边栏菜单
- 主内容区域（统计卡片、图表展示）

## 技术栈

- **框架**: Vue 3 + Composition API
- **UI框架**: Element Plus
- **图表库**: ECharts
- **构建工具**: Vite
- **样式**: TailwindCSS 3

## 项目结构

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.vue          # 顶部导航栏
│   │   └── Sidebar.vue         # 左侧侧边栏
│   ├── dashboard/
│   │   ├── StatCard.vue        # 统计卡片组件
│   │   ├── RevenueChart.vue    # 营收月度统计图表
│   │   ├── TimelinessChart.vue # 营收计划上报及时性图表
│   │   └── PieChart.vue        # 营收构成饼图
│   └── common/
│       └── TabNav.vue          # 标签页导航
├── views/
│   └── Dashboard.vue           # 主看板页面
├── data/
│   └── mockData.js             # 模拟数据
├── App.vue
├── main.js
└── style.css
```

## 实现步骤

### 步骤1：初始化Vue项目

使用Vite初始化Vue项目，安装必要依赖：
- vue@3
- element-plus
- echarts
- tailwindcss@3
- postcss
- autoprefixer

### 步骤2：配置TailwindCSS

创建tailwind.config.js和postcss.config.js配置文件

### 步骤3：创建布局组件

1. Header.vue - 顶部导航栏，包含logo、导航菜单、用户信息
2. Sidebar.vue - 左侧侧边栏，包含功能菜单

### 步骤4：创建Dashboard组件

1. StatCard.vue - 统计卡片，展示关键指标
2. RevenueChart.vue - 柱状图展示营收月度统计
3. TimelinessChart.vue - 柱状图展示营收计划上报及时性
4. PieChart.vue - 饼图展示X月营收构成

### 步骤5：创建主页面和模拟数据

1. Dashboard.vue - 整合所有组件
2. mockData.js - 提供截图中的模拟数据

### 步骤6：样式调整

确保界面风格与截图一致（蓝色主题、圆角卡片等）

## 风险与注意事项

1. **图表数据**：需要根据截图手动创建模拟数据，可能与原图存在细微差异
2. **样式匹配**：需要仔细调整颜色、间距、字体等以尽可能接近原图
3. **响应式设计**：确保在不同屏幕尺寸下正常显示

## 预期成果

一个完整可运行的Vue 3项目，展示与截图相似的营收管理看板界面。