# 营收报表：年月筛选 + 偏差字段只读 + 负偏差报警

## 摘要

3个文件、4类改动：
1. **RevenueDeviation.vue** — "计划采取措施及节点"只读 + 月份→年月筛选 + 仅负偏差报警
2. **RevenueDetail.vue** — 新增年月筛选器
3. **RevenueSummary.vue** — 3个tab均新增年月筛选器

---

## 改动1: RevenueDeviation.vue — 偏差项目表

### 1a. "计划采取措施及节点"改为只读（2处）

**当月偏差项目表（第307-328行）**：
- 删除 `@dblclick="startEdit(scope.row, 'correctiveMeasures')"` 触发器
- 删除 `<el-textarea>` 编辑模式，仅保留纯文本显示
- 删除 `'点击编辑'` 占位文字

```vue
<!-- 改前 -->
<span class="cursor-pointer hover:bg-blue-100 px-1 rounded block truncate"
      @dblclick="startEdit(scope.row, 'correctiveMeasures')">
  <el-textarea v-if="editingCell === `${scope.row.id}-correctiveMeasures`" ... />
  <span v-else>{{ scope.row.correctiveMeasures || '点击编辑' }}</span>
</span>

<!-- 改后 -->
<span class="px-1 rounded block truncate">
  {{ scope.row.correctiveMeasures || '' }}
</span>
```

**季度偏差表（第646-667行）**：同上，完全相同的改动。

### 1b. 当月偏差项目表：月份选择 → 年+月双选

**当前状态**（第65-70行）：
```html
<label>月份选择 (N)：</label>
<el-select v-model="selectedMonth" ...>
  <option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
</el-select>
```

**改为**：年份 + 月份两个 select

```html
<div class="flex items-center">
  <label class="text-sm text-gray-600 mr-2">年月：</label>
  <el-select v-model="deviationYear" placeholder="年" class="w-24">
    <el-option v-for="y in yearOptions" :key="y.value" :label="y.label" :value="y.value" />
  </el-select>
  <el-select v-model="deviationMonth" placeholder="月" class="w-20 ml-1">
    <el-option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
  </el-select>
</div>
```

**script 变更**：

新增变量：
```javascript
const yearOptions = [
  { value: '2026', label: '2026年' },
  { value: '2025', label: '2025年' },
  { value: '2024', label: '2024年' }
]
const deviationYear = ref('2026')
const deviationMonth = ref('8')
```

保留原 `monthOptions` 数组不变（值仍为 `'1月'...'12月'` 格式）。

**模板中引用 `selectedMonth` 的列标题需更新**：
- 第298行: `` `${selectedMonth}营收偏差原因` `` → `` `${deviationMonth}月营收偏差原因` ``
- 第221行: `` `${selectedMonth}计划营收` `` → `` `${deviationMonth}月计划营收` ``
- 第243行: `` `${selectedMonth}完成营收` `` → `` `${deviationMonth}月完成营收` ``
- 第265行: `` `${selectedMonth}营收完成率` `` → `` `${deviationMonth}月营收完成率` ``
- 第286行: `` `${selectedMonth}营收偏差` `` → `` `${deviationMonth}月营收偏差` ``

**filteredData computed 中**：将 `selectedMonth` 的过滤逻辑替换为 `deviationMonth`。

### 1c. 季度偏差表：新增年月筛选

在第442行后（是否产运管理重点项目之后），增加年月筛选器UI（同上格式）。
新增独立的季度年月变量：`quarterlyYear` / `quarterlyMonth`。

### 1d. 偏差报警：仅负偏差

**当前行为**（第1447-1452行）：
```javascript
const getRowClassName = ({ row }) => {
  if (row.deviation < 0) return 'deviation-row'
  return ''
}
```
以及第291行的显示样式：`:class="{ 'text-red-600 font-medium': scope.row.deviation < 0 }"`

**分析**：当前代码已经只在 `deviation < 0` 时标红/加背景色。正偏差不触发任何视觉报警。**此需求已满足**，无需额外修改。但为保险起见，确认第359行"当月营收负偏差"列的正数绿色显示也保持不变（正偏差绿色 = 不报警）。

---

## 改动2: RevenueDetail.vue — 营收明细表新增年月筛选

**位置**：在现有筛选区（第22-116行）的"预警等级"之后、"搜索/重置"之前插入。

**新增UI**：
```html
<div class="flex items-center">
  <label class="text-sm text-gray-600 mr-2">年月：</label>
  <el-select v-model="filters.detailYear" placeholder="年" class="w-24">
    <el-option label="2026年" value="2026" />
    <el-option label="2025年" value="2025" />
    <el-option label="2024年" value="2024" />
  </el-select>
  <el-select v-model="filters.detailMonth" placeholder="月" class="w-20 ml-1">
    <el-option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
  </el-select>
</div>
```

**script 新增**：
- 在 `filters.ref()` 对象中追加 `detailYear: '2026'`, `detailMonth: ''`
- 复用已有的 `monthOptions` 数组（第405行已定义）
- 在 `filteredData` computed（第1826行）中追加按 `detailYear` 和 `detailMonth` 过滤逻辑（如果数据中有对应字段则过滤；若数据无年月字段则仅作为UI占位）

---

## 改动3: RevenueSummary.vue — 营收汇总表3个tab均增年月筛选

**位置**：在 tabs 区域（第22-30行）下方、施工类筛选区（第32行）之前，添加一个**全局年月筛选区**（所有tab共用）。

**新增UI**（tabs和construction筛选之间）：
```html
<div class="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
  <label class="text-sm text-gray-600 mr-2">年月：</label>
  <el-select v-model="summaryYear" placeholder="年" class="w-24">
    <el-option label="2026年" value="2026" />
    <el-option label="2025年" value="2025" />
    <el-option label="2024年" value="2024" />
  </el-select>
  <el-select v-model="summaryMonth" placeholder="月" class="w-20">
    <el-option v-for="m in monthOptions" :key="m" :label="m+'月'" :value="m" />
  </el-select>
</div>
```

**script 新增**：
```javascript
const summaryYear = ref('2026')
const summaryMonth = ref('')
const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

**注意**：产品类和其他类 tab 当前无独立筛选区，年月筛选放在 tabs 下方全局位置即可同时覆盖3个tab。

---

## 涉及文件清单

| 文件 | 改动项 |
|------|--------|
| [RevenueDeviation.vue](src/components/revenue/RevenueDeviation.vue) | 计划措施只读(×2)、月份→年月(当月)、新增年月(季度)、列标题更新 |
| [RevenueDetail.vue](src/components/revenue/RevenueDetail.vue) | 新增年月筛选器 |
| [RevenueSummary.vue](src/components/revenue/RevenueSummary.vue) | 全局年月筛选器(3tab共用) |

## 验证步骤
1. 偏差项目表：双击"计划采取措施及节点" → 无反应（不可编辑）
2. 当月偏差表：可见"年:"+"月:"两个下拉框，切换后列标题同步变化
3. 季度偏差表：可见年月筛选器
4. 明细表：筛选区末尾出现年月选择器
5. 汇总表：tabs下方出现年月选择器，切换tab后仍在
