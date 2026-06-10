# 布局调整计划

## 一、需求概述

对 `RevenueDashboard.vue` 进行2项布局调整：
1. 施工类营收情况 + 总体营收情况 并排，前者4/5宽、后者1/5宽
2. '营收计划上报及时性' 和 'X月月度营收偏差' 合并为一个模块上下分布

## 二、当前状态分析

**核心文件**: [RevenueDashboard.vue](src/views/RevenueDashboard.vue)

### 需要修改的区域：

| 改动 | 当前代码位置 | 行号 | 现状 |
|------|-------------|------|------|
| 1. 两模块比例 | `grid grid-cols-1 lg:grid-cols-2 gap-4` | L31 | 1:1 均分 |
| 2. 及时性+偏差合并 | 及时性在grid-cols-3(L196-L258)，偏差单独一行(L280-L326) | L196-L326 | 分开两个独立区块 |

## 三、具体改动清单

### 改动1: 两模块比例 — 4/5 : 1/5

**位置**: [RevenueDashboard.vue#L31](src/views/RevenueDashboard.vue#L31)

**当前**:
```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
```

**改为**: 使用 Tailwind 的自定义比例或 col-span 实现 4:1 比例
```html
<div class="grid grid-cols-12 gap-4">
```
- 模块一（施工类）添加: `col-span-10 lg:col-span-10`
- 模块二（总体营收）添加: `col-span-12 lg:col-span-2`

> 注：Tailwind CSS 默认支持 `col-span-{n}` 到 12 列。10+2=12，即 4/5 : 1/5。

---

### 改动2: '营收计划上报及时性' + 'X月月度营收偏差' 合并到一个模块

#### 2.1 结构变化

**当前布局**:
```
[grid-cols-3]
  [及时性] [月度统计] [累计营收]
[mt-4 单独一行]
  [月度偏差]
```

**目标布局**:
```
[grid-cols-2]
  [合并模块：及时性(上) + 月度偏差(下)]   [月度统计]   [累计营收]
```

即：将第196行的 `grid-cols-3` 改为 `grid-cols-2`，第一列变为包含"及时性+偏差"的复合模块。

#### 2.2 具体操作

**步骤A**: 将第196行的外层容器从 `grid-cols-3` 改为 `grid-cols-2`:
```html
<!-- 原来 -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
<!-- 改为 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
```

**步骤B**: 将"营收计划上报及时性"(L198-L257)和"X月月度营收偏差"(L281-L326)包裹在一个新的容器div中，作为第一列：

```html
<div class="bg-white rounded-xl p-4 shadow-sm space-y-4">
  <!-- 上半部分：营收计划上报及时性 (原L199-L257内容，去掉外层div) -->
  <div>
    <h3 class="text-base font-semibold text-gray-800 mb-4">营收计划上报及时性</h3>
    <!-- 红橙黄预警 + 圆环... -->
  </div>

  <!-- 下半部分：X月月度营收偏差 (原L282-L325内容，去掉外层div) -->
  <div class="pt-4 border-t border-gray-100">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-800">{{ selectedDeviationMonth }}月月度营收偏差</h3>
      <!-- 年月选择器 -->
      ...
    </div>
    <!-- 偏差卡片... -->
  </div>
</div>
```

**步骤C**: 删除原第280-326行的独立偏差区块（已移入合并模块内）

**步骤D**: "营收月度统计"(L260-L263)和"当年累计完成营收情况"(L266-L277)保持不变，成为第2、3列

## 四、假设与决策

1. 仅修改模板结构，不涉及脚本逻辑变更
2. 合并模块使用 `space-y-4` 控制上下间距，用 `border-t border-gray-100` 分隔两个子模块
3. 其他所有功能（数据绑定、事件处理、图表配置等）完全不变

## 五、验证步骤

1. 开发服务器已在 http://localhost:5173/ 运行
2. 刷新页面后验证：
   - [ ] 施工类营收情况占约80%宽度，总体营收情况占约20%宽度
   - [ ] 营收计划上报及时性和月度营收偏差在同一个卡片内上下排列
   - [ ] 营收月度统计和当年累计完成营收情况仍正常显示
