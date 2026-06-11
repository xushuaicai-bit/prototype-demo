# 合计栏数据显示修复计划

## 一、问题分析

用户反馈4张表的合计栏数据为空。经代码审查，`getSummaries` 函数逻辑本身正确（遍历列prop→求和→格式化），但可能存在以下问题：

1. **部分数值列缺少 `prop` 属性** → `column.prop` 为空 → 返回 `''`
2. **`total > 0` 条件过严** → RevenueDetail.vue 中 `total > 0` 才显示值，否则显示 `'-'`
3. **CSS 可能影响渲染** → 新增的 `:deep()` 样式可能意外隐藏了内容

## 二、具体改动

### 文件1: RevenueDetail.vue — 营收明细表

#### 改动1a: getSummaries 放宽条件 (L1922)

将：
```javascript
sums[index] = total > 0 ? total.toLocaleString(...) : '-'
```
改为（始终显示数值，包括0）：
```javascript
sums[index] = total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
```

#### 改动1b: 非数值列也显示占位符

将 `if (!prop)` 分支的 `sums[index] = ''` 改为 `sums[index] = '-'`

### 文件2: RevenueDeviation.vue — 偏差项目表

getSummaries 已始终显示数值，检查确认无误。仅需确保非prop列返回 `'-'` 而非空。

### 文件3: RevenueSummary.vue — 产品/其他业态

`getProductSummaries` 和 `getOtherSummaries` 同上处理。

## 三、验证

- [ ] 每张表的合计行：第1列显示"总计"/"合计"，数值列显示求和结果，非数值列显示"-"
