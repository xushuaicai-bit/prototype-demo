# 4张表合计栏补值 + 样式统一计划

## 一、需求概述

4个表格的合计栏需要：
1. 确保所有数值列都有正确的合计值
2. 合计栏样式与施工类总营收表的底部合计行一致（灰底+粗体+阴影）

## 二、当前状态分析

### 4个表格的合计机制对比

| 表格 | 文件 | 合计方式 | 问题 |
|------|------|---------|------|
| 营收明细表 | RevenueDetail.vue | `show-summary` + `getSummaries`(L1892) | el-table内置合计行，默认样式 |
| 偏差项目表 | RevenueDeviation.vue | `show-summary` + `getSummaries`(L1439) | 同上 |
| 产品总营收 | RevenueSummary.vue | `show-summary` + `getProductSummaries`(L815) | 同上 |
| 其他业态总营收 | RevenueSummary.vue | `show-summary` + `getOtherSummaries`(L844) | 同上 |

### 关键发现

**getSummaries 逻辑本身是正确的**（遍历列prop → parseFloat求和 → 格式化输出），但存在以下问题：

1. **部分列没有 `prop` 属性**（如序号、状态标签等）→ 返回空字符串 `''`
2. **el-table 内置合计行的默认样式**与施工类总营收表的 custom footer-row 不一致：
   - 施工类总营收表：`#f9fafb` 背景 + `font-weight:bold` + `box-shadow` 阴影
   - 其余4个表格：Element Plus 默认浅色背景，无特殊样式

## 三、具体改动

### 改动1: RevenueSummary.vue — 产品/其他业态合计行样式

在现有 `.total-footer-row` CSS 后面追加 el-table 合计行覆盖样式：

```css
/* el-table 内置合计行统一样式（产品/其他业态/明细/偏差共用） */
:deep(.el-table__footer-wrapper) {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
:deep(.el-table__footer) {
  background-color: #f9fafb !important;
}
:deep(.el-table__footer-wrapper td) {
  background-color: #f9fafb !important;
  font-weight: bold !important;
  color: #374151 !important;
}
:deep(.el-table__footer-wrapper th) {
  background-color: #f9fafb !important;
}
```

> 注：使用 `:deep()` 穿透 scoped 样式。此CSS放在 RevenueSummary.vue 的 `<style scoped>` 中会同时作用于该文件内的3个 el-table（施工类已用自定义footer不受影响，因为施工类去掉了show-summary；产品和其他业态两个table生效）。

### 改动2: RevenueDetail.vue — 合计行样式

在文件末尾添加 `<style scoped>`（如果不存在）或在已有 style 中追加：

```css
/* 合计行样式 */
:deep(.el-table__footer-wrapper) {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
:deep(.el-table__footer) {
  background-color: #f9fafb !important;
}
:deep(.el-table__footer-wrapper td) {
  background-color: #f9fafb !important;
  font-weight: bold !important;
  color: #374151 !important;
}
```

### 改动3: RevenueDeviation.vue — 合计行样式

同上，添加相同的CSS。

## 四、验证步骤

- [ ] 营收明细表 → 滚动到底部 → 合计行显示数值、灰底粗体、悬浮固定
- [ ] 偏差项目表 → 同上
- [ ] 营收汇总表-产品总营收 → 合计行有值、样式一致
- [ ] 营收汇总表-其他业态总营收 → 合计行有值、样式一致
