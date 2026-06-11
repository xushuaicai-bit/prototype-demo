# 营收看板点击下钻修复计划

## 问题分析

用户反馈点击指标卡片时无法跳转到报表页面。

**问题根源**：在 `App.vue` 中，`RevenueDashboard` 组件没有监听 `navigate` 事件。

当前代码：
```vue
<RevenueDashboard v-else-if="currentView === 'revenue-dashboard'" />
```

缺少 `@navigate` 事件监听器，导致组件 emit 的事件无法被处理。

## 解决方案

在 `App.vue` 中：
1. 给 `RevenueDashboard` 组件添加 `@navigate` 监听
2. 添加 `handleDashboardNavigate` 函数处理导航事件

## 修改文件

### src/App.vue

1. 修改 `<RevenueDashboard>` 组件，添加 `@navigate` 监听：
   ```vue
   <RevenueDashboard 
     v-else-if="currentView === 'revenue-dashboard'" 
     @navigate="handleDashboardNavigate" 
   />
   ```

2. 添加 `handleDashboardNavigate` 函数：
   ```javascript
   const handleDashboardNavigate = ({ view, report, filter }) => {
     if (view === 'revenue') {
       currentView.value = 'revenue'
       currentReport.value = report || 'revenue-summary'
       reportFilter.value = { unit: filter || '' }
       if (filter) {
         sessionStorage.setItem('revenueFilter', filter)
       }
     }
   }
   ```

## 实施步骤

1. 修改 App.vue 中的 RevenueDashboard 组件，添加 @navigate 监听
2. 在 App.vue 中添加 handleDashboardNavigate 函数
3. 验证构建是否成功

## 预期效果

- 点击指标卡片时触发 navigate 事件
- App.vue 捕获事件并切换视图到 RevenueReport
- 营收汇总表正确显示筛选条件