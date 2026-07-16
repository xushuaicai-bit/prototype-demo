# 资金管理报表 4 项优化 — 实施计划

## 摘要

用户提出 4 项优化需求，涉及 BranchReport、SectorBusinessFinanceSummary、FinanceReport 三个组件。核心改动包括：底部汇总行固定、树形表改平铺、表格高度自适应、预警框精简。

---

## 需求 1：按公司分类报表 — 3 行项目类型汇总固定在表格底部

### 问题分析
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\BranchReport.vue`
- 当前 3 行项目类型汇总行（"2025年以前项目 - 合计"等）作为普通数据行添加在 `displayData` computed 末尾（第 208-240 行），位于表格 body 中，随表格内容垂直滚动。
- 原始"总计"行通过 Element Plus 的 `show-summary` + `:summary-method` 渲染在 `.el-table__footer-wrapper` 中，固定在表格可视区域底部，不随 body 滚动。
- 用户要求：3 行新增汇总行与原始"总计"行一样，固定在表格底部。

### 解决方案
使用独立汇总表方案：在主表下方添加第二个 `el-table`，专门显示 3 行项目类型汇总。两个表放在同一个 `table-scroll-wrapper` 内，共享水平滚动。

### 具体修改

**模板修改**（`e:\trae_demo_env\营收看板\src\components\fund\BranchReport.vue`）：

1. 从 `displayData` computed 中移除 3 行项目类型汇总逻辑（第 208-240 行）
2. 新增 `projectTypeSummaryRows` computed，返回 3 个汇总行对象（逻辑与原代码相同，只是独立出来）
3. 在 `table-scroll-wrapper` 内、主 `el-table` 之后添加汇总表：

```html
<div class="table-scroll-wrapper">
  <el-table :data="paginatedData" ... show-summary :summary-method="getSummaries" ...>
    <!-- 原有列定义不变 -->
  </el-table>
  <el-table
    :data="projectTypeSummaryRows"
    :show-header="false"
    border
    class="summary-footer-table"
    :row-class-name="() => 'project-type-total-row'"
    :header-cell-style="{ backgroundColor: '#4a6fa5', color: '#fff', fontWeight: 'bold', fontSize: '12px' }"
  >
    <!-- 与主表相同的列定义，但去掉 show-summary/height 等属性 -->
    <el-table-column prop="basicUnit" label="基层单位" width="120" />
    <el-table-column prop="projectType" label="项目类型" width="140" />
    <!-- ...其余列与主表一致... -->
  </el-table>
</div>
```

**脚本修改**：
- 移除 `displayData` 中的 3 行项目类型汇总代码块
- 新增 `projectTypeSummaryRows` computed（包含原有汇总逻辑，返回数组）

**CSS 修改**：
```css
.summary-footer-table {
  margin-top: -1px; /* 消除与主表之间的间隙 */
}
.summary-footer-table :deep(.el-table__body-wrapper) {
  overflow: hidden !important; /* 汇总表不需要自身滚动 */
}
```

### 效果
- 主表：数据行 + 小计行（可垂直滚动），底部固定"总计"行（show-summary）
- 汇总表：3 行项目类型合计（始终可见，不随主表滚动）
- 两表共享水平滚动（在同一 `table-scroll-wrapper` 内）

---

## 需求 2：项目板块业务财务信息汇总 — 一级/二级/三级平铺（非树结构）

### 问题分析
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\SectorBusinessFinanceSummary.vue`
- 当前使用树形表格：`row-key="id"` + `:tree-props="{ children: 'children' }"` + `default-expand-all`
- `treeTableData` computed（第 505-588 行）将扁平数据按 category1→category2→category3→projectType 递归构建为树
- `sortTree`/`sortedTreeData`（第 625-642 行）递归排序树节点
- 导出函数使用递归 `flatten`（第 680-714 行）
- 与之前 OutputProjectSummary.vue 的改造完全相同，已有成熟方案

### 具体修改

**模板修改**：
- el-table 移除 `row-key="id"`、`:tree-props="{ children: 'children' }"`、`default-expand-all`
- `:data="sortedTreeData"` 改为 `:data="sortedFlatData"`

**脚本修改**：
1. 删除 `createEmptyNode` 函数（第 482-494 行）
2. 删除 `aggregateChildren` 函数（第 496-503 行）
3. 替换 `treeTableData` computed（第 505-588 行）为 `flatTableData`：
```js
const flatTableData = computed(() => {
  return filteredData.value.map(item => ({ ...item }))
})
```
4. 替换 `sortTree` 函数（第 625-638 行）为 `sortFlat`：
```js
const sortFlat = (data) => {
  if (!sortProp.value || !sortOrder.value) return data
  const sortFn = (a, b) => {
    const va = a[sortProp.value] ?? 0
    const vb = b[sortProp.value] ?? 0
    return sortOrder.value === 'ascending' ? va - vb : vb - va
  }
  return [...data].sort(sortFn)
}
```
5. 替换 `sortedTreeData` computed（第 640-642 行）为：
```js
const sortedFlatData = computed(() => {
  return sortFlat(flatTableData.value)
})
```
6. 简化 `handleExport`（第 678-747 行），用 `flatTableData.value.map()` 替代递归 `flatten`：
```js
const flatRows = flatTableData.value.map(item => ({
  category1: item.category1,
  category2: item.category2,
  category3: item.category3,
  projectType: item.projectType,
  projectCount: item.projectCount,
  contractPrice: formatNumber(item.contractPrice),
  // ... 其余字段
}))
```

---

## 需求 3：业财统计报表 — 底部滚动条进入页面即可见

### 问题分析
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\FinanceReport.vue`
- 表格 `tableHeight` 固定为 600px（第 767 行）
- 页面内容：搜索面板 + 版本横幅 + 预警框 + 标签页 + 表头工具栏 + 表格 + 分页
- 当视口高度不足以容纳全部内容时，表格底部的水平滚动条在视口之外，需向下滚动才能看到

### 具体修改

**脚本修改**：
1. 将 `tableHeight` 改为动态计算（基于窗口高度）：
```js
const tableHeight = ref(Math.max(300, window.innerHeight - 450))

const updateTableHeight = () => {
  tableHeight.value = Math.max(300, window.innerHeight - 450)
}
```
2. 在 `onMounted` 中添加 resize 监听（合并到现有 onMounted）：
```js
onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
  loadVersions()
  // ... 现有版本加载逻辑
})
```
3. 添加 `onUnmounted` 清理监听：
```js
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})
```

**预留空间说明**：
- 450px 预留量包含：padding(40) + 搜索面板(~80) + 版本横幅(~50) + 预警框(~40) + 标签页(~60) + 表头工具栏(~50) + 分页(~50) + 边距(~80)
- 最小高度 300px 保证表格可用性

---

## 需求 4：业财统计报表 — 蓝黄红预警框精简（移除"预警项目数量"文字）

### 问题分析
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\FinanceReport.vue`
- 当前预警框结构（第 64-99 行）：
```html
<div class="warning-box warning-blue">
  <span class="warning-label">蓝色预警</span>
  <span class="warning-count">{{ blueWarningCount }}</span>
  <span class="warning-desc">预警项目数量</span>  <!-- 要删除 -->
</div>
```
- 用户要求：移除"预警项目数量"文字，用小标签预警，不占大空间

### 具体修改

**模板修改**（第 64-99 行）：
- 删除 3 个 `<span class="warning-desc">预警项目数量</span>`
- 改为紧凑的行内标签布局（label + count 并排）：
```html
<div class="warning-box warning-blue" :class="{ active: activeWarningFilter === 'blue' }" @click="toggleWarningFilter('blue')">
  <span class="warning-label">蓝色预警</span>
  <span class="warning-count">{{ blueWarningCount }}</span>
</div>
```
（黄色、红色同理）

**CSS 修改**（第 1052-1088 行）：
```css
.warning-box {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.warning-label {
  font-size: 12px;
  font-weight: bold;
}

.warning-count {
  font-size: 13px;
  font-weight: bold;
}

/* 删除 .warning-desc 相关 CSS */
```

**效果**：预警框变为紧凑的行内标签（如"蓝色预警 5"），高度和宽度都大幅减小，作为辅助预警不抢占主视觉。

---

## 假设与决策

1. **需求 1 固定汇总行方案**：使用独立汇总表（第二个 el-table）而非 CSS sticky，因为 sticky 在 el-table 内部 body 中兼容性差。两个表共享 `table-scroll-wrapper` 的水平滚动。
2. **需求 2 平铺改造**：与之前 OutputProjectSummary.vue 改造完全相同，已有验证过的方案。
3. **需求 3 高度计算**：预留 450px 空间，最小高度 300px。如不同分辨率下仍有问题，可微调预留量。
4. **需求 4 预警框精简**：移除描述文字，改为 inline-flex 行内布局，进一步压缩尺寸。

---

## 验证步骤

1. **BranchReport**：进入页面后，3 行项目类型汇总始终可见在表格底部（不随表格滚动消失），"总计"行仍在最底部
2. **SectorBusinessFinanceSummary**：表格为平铺展示，每行直接显示一级/二级/三级分类，无展开/折叠箭头
3. **FinanceReport 滚动条**：进入页面后无需向下滚动即可看到表格底部水平滚动条
4. **FinanceReport 预警框**：预警框为紧凑小标签（"蓝色预警 N"），无"预警项目数量"文字，占用空间大幅减小
