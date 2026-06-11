# 合计行悬浮底部 — 修复方案（CSS sticky不可用）

## 一、问题分析

上一轮已添加的CSS `position: sticky; bottom: 0` 在 **Element Plus el-table 内部滚动容器**中对 `<tr>` 元素**不生效**。el-table 的 `max-height="600"` 创建了内部滚动区域，浏览器对 `<tr>` 在滚动容器内的sticky支持极差。

## 二、修复方案：将合计行从表格数据中分离，作为固定底部展示

### 核心思路

1. 从 `filteredConstructionData` 中**去掉合计行**
2. 合计数据单独计算存储
3. 表格下方增加一个**固定的合计行div**，与表格列宽对齐

### 具体改动

#### 文件: [RevenueSummary.vue](src/components/revenue/RevenueSummary.vue)

##### 改动1: filteredConstructionData 去掉合计行 (L755-L759)

```javascript
// 原来
return [...filtered, calculateTotalsForFiltered(filtered)]

// 改为
const totals = calculateTotalsForFiltered(filtered)
constructionTotals.value = totals  // 存储合计供底部显示
return [...filtered]  // 不再包含合计行
```

新增 ref：
```javascript
const constructionTotals = ref(null)
```

##### 改动2: 模板 — 表格下方增加固定合计行

在 `</el-table>` 的闭合标签之后、`</div>` (overflow-x-auto容器) 之前，插入：

```html
<!-- 固定底部合计行 -->
<div v-if="constructionTotals" class="total-footer-row">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="width: 200px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5;">合计</td>
        <td style="background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ constructionTotals.revenueTarget?.toLocaleString() }}</td>
        <td style="background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ constructionTotals.completionRate?.toFixed(1) }}%</td>
        <!-- ... 其余列按同样格式 ... -->
      </tr>
    </tbody>
  </table>
</div>
```

##### 改动3: CSS — 固定底部样式

```css
.total-footer-row {
  position: sticky;
  bottom: 0;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
.total-footer-row td {
  background-color: #f9fafb !important;
}
```

##### 改动4: rowClassName 去掉 total-row-sticky（不再需要）

恢复为：
```javascript
const rowClassName = ({ row }) => {
  if (row.name === '合计') return 'font-bold bg-gray-50'
  return ''
}
```

## 三、验证步骤

- [ ] 营收报表 → 营收汇总表 → 施工类总营收表 → 滚动时合计行始终固定在底部
- [ ] 合计行的数值与之前一致
