# 环形图中心文字黑色化 + 生产风险等级布局优化

## 一、需求概述

1. **所有圆环中间的统计数字改为黑色**（不再用五颜六色）
2. **生产风险情况**：删掉副标题，I/II/III级改为块状布局（I级占最大块，II/III各占下半1/2）

***

## 二、当前状态与改动点

### 改动1：环形图中心文字颜色统一为黑色

涉及 **2个文件、4个环形图**：

| 文件                           | 环形图    | 当前颜色                                    | → 目标 |
| ---------------------------- | ------ | --------------------------------------- | ---- |
| **ManagementTimelines.vue**  | 登记环形图  | `rate`: #22c55e(绿), `done`: #16a34a(深绿) | → 黑色 |
| **ManagementTimelines.vue**  | 筹划环形图  | `rate`: #3b82f6(蓝), `done`: #2563eb(深蓝) | → 黑色 |
| **RiskTimelinesDisplay.vue** | 当前进入风险 | `total`: #dc2626(红)                     | → 黑色 |
| **RiskTimelinesDisplay.vue** | 未来两周   | `total`: #7c3aed(紫)                     | → 黑色 |

**统一目标值**：

* 数字行 (rate/total): `color: '#111827'` (gray-900, 近黑)

* 已完成行 (done): `color: '#374151'` (gray-700)

* 未完成/描述行 (pending/label/sub): `color: '#374151'` (gray-700)

### 改动2：ProductionRiskSituation 布局重构

**当前**（等高列表）:

```
生产风险情况（按等级）          ← 删除❌
● I级风险      16个  6完成
● II级风险     10个  4完成
● III级风险    12个  5完成
```

**目标**（块状布局）:

```
┌─────────────────────────────┐
│ ● I级风险   16个   6完成   │  ← 全宽大块
├──────────┬──────────────────┤
│ ●II级10个│ ●III级12个 5完成 │  ← 各占1/2
│  4完成   │                  │
└──────────┴──────────────────┘
```

***

## 三、实施方案

### 文件1: ManagementTimelines.vue

**登记环形图** (第150-171行 rich配置):

```javascript
// rate: color '#22c55e' → '#111827'
// done: color '#16a34a' → '#374151'
// pending: 保持 '#9ca3af' 不变
```

**筹划环形图** (第227-246行 rich配置):

```javascript
// rate: color '#3b82f6' → '#111827'
// done: color '#2563eb' → '#374151'
// pending: 保持 '#9ca3af' 不变
```

### 文件2: RiskTimelinesDisplay.vue

**当前进入风险** (第123-143行 rich配置):

```javascript
// total: color '#dc2626' → '#111827'
// label/sub: 保持 '#374151' 不变
```

**未来两周** (第202-222行 rich配置):

```javascript
// total: color '#7c3aed' → '#111827'
// label/sub: 保持 '#374151' 不变
```

### 文件3: ProductionRiskSituation.vue

**模板改动** (第33-57行):

删除 `<h4>` 副标题行，将 `space-y-1.5` 的 v-for 列表改为 grid 块状布局：

```vue
<!-- 等级列表区域 -->
<div class="mt-3 border-t border-gray-100 pt-3">
  <!-- I级风险：全宽大块 -->
  <div class="mb-2 px-2.5 py-3 bg-red-50 rounded-lg border border-red-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
        <span class="text-xs font-semibold text-gray-800">{{ displayRiskData[0].level }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm"><span class="font-bold text-gray-900">{{ displayRiskData[0].count }}</span><span class="text-gray-400 ml-0.5">个</span></span>
        <span v-if="displayRiskData[0].completed > 0" class="text-xs text-green-600 font-medium">{{ displayRiskData[0].completed }}完成</span>
      </div>
    </div>
  </div>

  <!-- II级 + III级：各占1/2 -->
  <div class="grid grid-cols-2 gap-2">
    <div v-for="item in displayRiskData.slice(1)" :key="item.level"
         class="px-2.5 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div class="flex flex-col items-center text-center gap-1">
        <div class="flex items-center">
          <span :class="['w-2 h-2 rounded-full mr-1', levelColor(item.level)]"></span>
          <span class="text-xs font-medium text-gray-700">{{ item.level }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-gray-900">{{ item.count }}<span class="text-gray-400 text-xs ml-0.5">个</span></span>
          <span v-if="item.completed > 0" class="text-xs text-green-600">{{ item.completed }}完成</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

***

## 四、验证

* [ ] ManagementTimelines 两个环形图中心数字均为黑色

* [ ] RiskTimelinesDisplay 两个环形图中心数字均为黑色

* [ ] ProductionRiskSituation 无"生产风险情况（按等级）"副标题

* [ ] I级风险独占全宽一行（大块）

* [ ] II级和III级各占底部1/2宽度

* [ ] 年度清单筛选功能仍正常工作\
  其他没提到的不修改

* [ ] <br />

