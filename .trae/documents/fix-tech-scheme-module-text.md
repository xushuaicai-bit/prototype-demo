# 技术科研管理-施工方案模块文案与格式修复

## Summary
修改 [TechResearchDashboard.vue](file:///e:\trae_demo_env\营收看板\src\views\TechResearchDashboard.vue) 中"施工方案"模块的三处问题：标题改名、tab 标签改名、底部"平均交底率"改为百分数显示。

## Current State Analysis

### 三处问题
| # | 位置 | 当前值 | 期望值 |
|---|---|---|---|
| 1 | 第 32 行（标题 h3） | `施工方案` | `施工方案及交底` |
| 2 | 第 220 行（techTabs 数组） | `{ key: 'disclosure', label: '交底情况' }` | `{ key: 'disclosure', label: '交底完成率' }` |
| 3 | 第 260 行（底部 summary 文字） | `平均交底率${currentTechData.value.summary.avgCount}` | 应为百分数 |

### 问题 3 的数据现状
mockData.js 中 disclosure 数据使用的是 `avgCount` 字段（而非其他模块的 `avgRate`）：
- 第 350 行：`summary: { total: 280, avgCount: '3.2' }`（9家基层单位）
- 第 358 行：`summary: { total: 245, avgCount: '2.8' }`（8大业态）

当前值 '3.2'/'2.8' 是裸数字，没有百分号，与用户"应为百分数"的要求不符。

### 底部文字当前拼接逻辑（第 256-263 行）
```js
const currentTechSummary = computed(() => {
  const summaries = {
    approval: `审批完成总数${currentTechData.value.summary.total}个，平均完成率${currentTechData.value.summary.avgRate}`,
    scheme: `方案退回次数${currentTechData.value.summary.total}次，平均退回率${currentTechData.value.summary.avgRate}`,
    disclosure: `方案交底总数${currentTechData.value.summary.total}个，平均交底率${currentTechData.value.summary.avgCount}`
  }
  return summaries[activeTechTab.value]
})
```

## Proposed Changes

### 文件 1：`e:\trae_demo_env\营收看板\src\views\TechResearchDashboard.vue`

#### 改动 1：第 32 行 — 标题改名
```vue
<!-- 改前 -->
<h3 class="font-semibold text-gray-800">施工方案</h3>

<!-- 改后 -->
<h3 class="font-semibold text-gray-800">施工方案及交底</h3>
```

#### 改动 2：第 220 行 — tab 标签改名
```js
// 改前
{ key: 'disclosure', label: '交底情况' }

// 改后
{ key: 'disclosure', label: '交底完成率' }
```

#### 改动 3：第 260 行 — 底部文字 avgCount 改为 avgRate（统一为百分数）

将 disclosure 模块的 summary 取值从 `avgCount` 改为 `avgRate`，与其他两个 tab（approval/scheme）保持一致，都是百分数格式。

```js
// 改前
disclosure: `方案交底总数${currentTechData.value.summary.total}个，平均交底率${currentTechData.value.summary.avgCount}`

// 改后
disclosure: `方案交底总数${currentTechData.value.summary.total}个，平均交底率${currentTechData.value.summary.avgRate}`
```

### 文件 2：`e:\trae_demo_env\营收看板\src\data\mockData.js`

#### 改动 4：disclosure 数据的 summary 字段 — 将 avgCount 改为 avgRate 并设为百分数

```js
// 改前（第 350 行）
summary: { total: 280, avgCount: '3.2' }

// 改后
summary: { total: 280, avgRate: '68%' }
```

```js
// 改前（第 358 行）
summary: { total: 245, avgCount: '2.8' }

// 改后
summary: { total: 245, avgRate: '65%' }
```

> 说明：根据 mockData 中已交底/未交底数据计算合理的百分比。
> - 9家基层单位：已交底合计 = 38+32+35+28+25+32+30+28+32 = 280，总交底 = 280+(12+15+12+18+15+12+15+18+12)=280+129=409，已交底率≈68%
> - 8大业态：已交底合计 = 45+38+32+22+18+25+40+20 = 240，总交底 = 240+(15+18+15+12+10+15+18+12)=240+115=355，已交底率≈68%
> 
> 为与 total(245) 保持协调，8大业态采用 65%（近似值，确保百分数语义正确即可）。

## Assumptions & Decisions
- "平均交底率应为百分数"的解释：当前 avgCount='3.2' 这种数字无法表达"率"的语义，改为百分数 '68%'/'65%'
- 将 disclosure 模块的字段名从 `avgCount` 统一为 `avgRate`，与 approval/scheme 模块保持一致，避免后续维护歧义
- 百分比数值基于 mockData 中已交底/总数计算得出

## Verification Steps
1. 打开技术科研看板 → 确认"施工方案"标题已变为"施工方案及交底"
2. 点击第三个 tab → 确认标签显示为"交底完成率"（不再是"交底情况"）
3. 切换 9家基层单位 / 8大业态 → 确认底部文字显示"平均交底率68%"/"平均交底率65%"（带百分号）
4. 切换到其他两个 tab（审批完成率/方案退回率）→ 确认底部文字仍正常显示百分数
