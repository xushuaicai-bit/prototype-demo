# 偏差模块文字修正 + 总数显示计划

## 一、需求概述

对 `RevenueDashboard.vue` X月营收偏差情况模块做3处小改动：
1. `重点` → `重点项目`
2. `一般` → `一般项目`
3. 新增偏差项目总数显示

## 二、具体改动

**文件**: [RevenueDashboard.vue](src/views/RevenueDashboard.vue) 第302-318行

### 改动1: 标签文字修正

| 位置 | 当前 | 改为 |
|------|------|------|
| L306 | `重点{{ unit.keyProjectCount }}` | `重点项目{{ unit.keyProjectCount }}` |
| L310 | `一般{{ unit.generalProjectCount }}` | `一般项目{{ unit.generalProjectCount }}` |

### 改动2: 新增偏差项目总数

在列表区域上方（`<div class="max-h-[320px]...">` 内部，`<div class="space-y-2">` 之前）添加一行汇总文字：

```html
<div class="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 text-xs text-gray-500">
  <span>偏差项目总数: <b class="text-blue-600">{{ totalDeviationCount }}</b> 个</span>
  <span>涉及基层单位: <b class="text-gray-700">{{ unitDeviationData.length }}</b> 家</span>
</div>
```

> 注：`totalDeviationCount` computed 已存在（L597-L599），无需新增数据逻辑。

## 三、验证

开发服务器已在 http://localhost:5173/ 运行，刷新后验证标签显示"重点项目N"和"一般项目N"，列表顶部有偏差项目总数。
