# 营收看板下钻功能实现计划

## 需求分析

用户要求实现以下下钻功能：

### 1. 施工类当年计划营收
- 点击「新接项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=新接项目）
- 点击「结转在建项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=结转在建项目）
- 点击「完工未结算项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=完工未结算项目）

### 2. 施工类当年累计营收
- 点击「新接项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=新接项目）
- 点击「结转在建项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=结转在建项目）
- 点击「完工未结算项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=完工未结算项目）

### 3. 下月计划
- 点击「新接项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=新接项目）
- 点击「结转在建项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=结转在建项目）
- 点击「完工未结算项目」行 → 下钻至营收明细表（筛选条件：营收统计口径=完工未结算项目）

### 4. 当年累计营收
- 点击「施工类」行 → 下钻至营收汇总表（tab=施工类）
- 点击「产品类」行 → 下钻至营收汇总表（tab=产品类）
- 点击「其他业态类」行 → 下钻至营收汇总表（tab=其他业态类）

## 文件分析

### 目标文件

1. **`src/views/RevenueDashboard.vue`**
   - 需要为四个列表模块的每行添加点击事件
   - 需要修改 `handleDrill` 函数支持多种下钻类型

2. **`src/App.vue`**
   - 需要修改 `handleDashboardNavigate` 函数支持更复杂的筛选条件

3. **`src/components/revenue/RevenueDetail.vue`**
   - 需要支持接收并应用「营收统计口径」筛选条件

4. **`src/components/revenue/RevenueSummary.vue`**
   - 需要支持接收并切换不同业态类型的tab

## 修改方案

### 1. RevenueDashboard.vue 修改

在四个列表模块的 `<li>` 元素上添加点击事件，传递不同的下钻参数：

```vue
<li 
  v-for="item in planRevenue" 
  :key="item.name" 
  class="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
  @click="handleDetailDrill('revenue-detail', { statisticType: item.name })"
>
```

### 2. 新增下钻处理函数

在 RevenueDashboard.vue 中添加两个下钻函数：
- `handleDetailDrill(report, filter)` - 下钻至营收明细表
- `handleSummaryDrill(tab)` - 下钻至营收汇总表指定tab

### 3. App.vue 修改

修改 `handleDashboardNavigate` 函数支持更复杂的筛选参数结构。

### 4. RevenueDetail.vue 修改

接收并应用 `statisticType`（营收统计口径）筛选条件。

### 5. RevenueSummary.vue 修改

接收并切换业态类型tab。

## 步骤

1. 修改 RevenueDashboard.vue，为四个列表模块添加点击事件
2. 修改 App.vue 的 handleDashboardNavigate 函数
3. 修改 RevenueDetail.vue 支持营收统计口径筛选
4. 修改 RevenueSummary.vue 支持业态tab切换
5. 验证所有下钻功能正常工作

## 风险评估

- 中等风险：需要修改多个组件，涉及组件间通信
- 需要确保筛选条件在页面间正确传递和应用

## 验证方式

1. 启动开发服务器
2. 测试每个列表项的点击下钻功能
3. 验证筛选条件正确应用到目标页面