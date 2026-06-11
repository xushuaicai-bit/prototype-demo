# 总体营收情况 — 小圆环进度条计划

## 一、需求概述

将总体营收情况模块中"当年累计营收"的**长条进度条**替换为**小圆环形进度条**，放在蓝色数值旁边（同一行内），使第一排两个模块高度一致。

## 二、当前状态分析

### 文件: [RevenueDashboard.vue](src/views/RevenueDashboard.vue)

**当前布局 (L167-180)**:

```
当年累计营收
[icon]  75,000.00 万元          ← 蓝色大字
──────────────────────────────    ← 分隔线
指标完成率  75.0%                 ← 标签+百分比
[████████████░░░░░░░░░░░░░░░]   ← 长条进度条
```

**目标布局**:

```
当年累计营收
[icon]  75,000.00 万元  [○75%]   ← 蓝色大字 + 右侧小圆环同行显示
```

## 三、具体改动

### 改动: RevenueDashboard.vue L167-180

将当前的 `mt-2` 数值行 + 独立 `border-t` 进度条区块 → 合并为单行：数值 + 圆环并排。

```html
<!-- 原来 -->
<div :class="['mt-2 text-xl font-bold', ...]">{{ card.value }}<span class="...">{{ card.unit }}</span></div>
<!-- 当年累计营收：总体指标完成率进度条 -->
<div v-if="card.title === '当年累计营收'" class="mt-2 pt-2 border-t border-gray-100">
  <div class="flex items-center justify-between mb-1">...</div>
  <div class="w-full bg-gray-200 rounded-full h-1.5">...</div>
</div>
```

改为：

```html
<div :class="['mt-2 flex items-center gap-3', card.drillable ? 'text-blue-600' : 'text-gray-800']">
  <span class="text-xl font-bold">{{ card.value }}<span class="...">{{ card.unit }}</span></span>
  <!-- 当年累计营收：小圆环进度条 -->
  <div v-if="card.title === '当年累计营收'"
       :title="'指标完成率: ' + overallCompletionRate + '%'"
       class="relative w-10 h-10 flex-shrink-0 cursor-help">
    <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
      <!-- 底色环 -->
      <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" stroke-width="3"/>
      <!-- 进度环 -->
      <circle cx="18" cy="18" r="15" fill="none"
              :stroke="overallCompletionRate >= 100 ? '#22c55e' : overallCompletionRate >= 50 ? '#eab308' : '#ef4444'"
              stroke-width="3"
              stroke-dasharray="94.25"
              :stroke-dashoffset="94.25 * (1 - Math.min(overallCompletionRate, 100) / 100)"
              stroke-linecap="round"/>
    </svg>
    <span class="absolute inset-0 flex items-center justify-center text-[8px] font-bold leading-none"
          :class="overallCompletionRate >= 100 ? 'text-green-600' : overallCompletionRate >= 50 ? 'text-yellow-600' : 'text-red-600'">
      {{ overallCompletionRate }}%
    </span>
  </div>
</div>
```

### 同步修改 UnifiedDashboard.vue

同样的改动应用到 UnifiedDashboard.vue 中对应的总体营收情况模块。

## 四、验证步骤

* [ ] 当年累计营收卡片：蓝色数值右侧紧邻一个小圆环(直径40px)，内部显示百分比数字

* [ ] 第一排施工类营收情况和总体营收情况两模块视觉高度一致

* [ ] 圆环颜色随百分比变化：≥100%绿 / ≥50%黄 / <50%红

