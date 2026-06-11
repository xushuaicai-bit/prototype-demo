# 营收汇总表合计行悬浮底部计划

## 一、需求概述

对 [RevenueSummary.vue](src/components/revenue/RevenueSummary.vue) 施工类总营收表做1项改动：
- **合计行**固定悬浮在表格底部（滚动时始终可见）

> 注：浦东供排水已在二次养护和合计之间（rawData中id:10在id:9之后，合计通过spread追加在最后），此项无需改动。

## 二、当前状态分析

### 表格结构 (L70-76)
```html
<div class="overflow-x-auto" style="max-width: 100%;">
  <el-table :data="filteredConstructionData" border :max-height="600">
```

### 数据结构 (L755-759)
```javascript
const filteredConstructionData = computed(() => {
  const calculated = calculateDerivedFields(rawData)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  return [...filtered, calculateTotalsForFiltered(filtered)]  // ← 合计在最后
})
```

### 行样式 (L778-L783)
```javascript
const rowClassName = ({ row }) => {
  if (row.name === '合计') return 'font-bold bg-gray-50'
  return ''
}
```

## 三、具体改动

### 改动: 合计行CSS悬浮底部

**方案**: 使用 `position: sticky; bottom: 0` 让合计行粘在表格底部。

#### 3a. rowClassName 增加专用class (L778-L783)

将 `'font-bold bg-gray-50'` 改为增加一个sticky定位的class：

```javascript
const rowClassName = ({ row }) => {
  if (row.name === '合计') return 'font-bold bg-gray-50 total-row-sticky'
  return ''
}
```

#### 3b. 添加CSS样式

在 `<script setup>` 之前或文件末尾 `<style>` 中添加：

```css
.total-row-sticky {
  position: sticky;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

/* 确保合计行的所有子单元格也sticky */
.total-row-sticky > td {
  position: sticky;
  bottom: 0;
  background-color: #f9fafb !important;
  z-index: 2;
}
```

如果文件没有 `<style>` 块，则在 `</script>` 后添加：
```vue
<style scoped>
.total-row-sticky {
  position: sticky;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}
.total-row-sticky > td {
  position: sticky;
  bottom: 0;
  background-color: #f9fafb !important;
  z-index: 2;
}
</style>
```

## 四、验证步骤

开发服务器 http://localhost:5173/ 运行中：
- [ ] 营收报表 → 营收汇总表 → 施工类总营收表 → 数据行多时滚动表格
- [ ] 合计行始终固定在表格底部可见，带阴影分隔效果
