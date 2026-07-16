# 资金管理报表6项修改计划

## 修改1：项目板块业务财务信息汇总 - 项目类型取值

**文件**：`e:\trae_demo_env\营收看板\src\components\fund\SectorBusinessFinanceSummary.vue`

**现状**：`projectTypeOptions` = `['BT', 'BOT', 'PPP', 'EPC', 'EPC+O', 'DB', 'DBO', '施工总承包', '施工分包', '其他模式']`（约L228）

**修改**：改为 `['2025年以前项目', '2025年新接项目', '2025年销项项目']`

---

## 修改2：所有报表的基层单位筛选改为多选

需修改的文件（基层单位筛选为单选的）：

### 2a. `e:\trae_demo_env\营收看板\src\components\fund\BranchReport.vue`
- L6：`<el-select v-model="searchForm.basicUnit" placeholder="请选择">` → 添加 `multiple collapse-tags`
- L96：`basicUnit: ''` → `basicUnit: []`（改为数组）
- L151-152：筛选逻辑从 `!searchForm.value.basicUnit || item.basicUnit === ...` 改为 `searchForm.value.basicUnit.length === 0 || searchForm.value.basicUnit.includes(item.basicUnit)`
- L265：重置时 `basicUnit: []`

### 2b. `e:\trae_demo_env\营收看板\src\components\fund\FinanceReport.vue`
- L15：`<el-select v-model="searchForm.basicUnit" placeholder="请选择">` → 添加 `multiple collapse-tags`
- searchForm 中 `basicUnit: ''` → `basicUnit: []`
- L598-599：筛选逻辑从 `!searchForm.value.basicUnit || item.basicUnit === searchForm.value.basicUnit` 改为 `searchForm.value.basicUnit.length === 0 || searchForm.value.basicUnit.includes(item.basicUnit)`
- 重置时 `basicUnit: []`

**说明**：OutputProjectSummary.vue 已是多选，无需修改。SectorBusinessFinanceSummary.vue 和 ProjectStatusSummary.vue 无基层单位筛选。

---

## 修改3：按项目状态分类汇总表 - 结算状态行位置调整

**文件**：`e:\trae_demo_env\营收看板\src\components\fund\ProjectStatusSummary.vue`

**现状**：`summaryData` computed（L179-258）中，先遍历 `projectStatuses` = `['待建', '在建', '停工', '完工', '竣工', '业务销项', '财务销项']` 生成7行，再在末尾追加3行结算状态行。最终顺序：
1.待建 2.在建 3.停工 4.完工 5.竣工 6.业务销项 7.财务销项 8.结算编制中 9.结算已送审 10.结算已完成

**修改**：将结算状态行插入到"竣工"之后、"业务销项"之前。修改 `summaryData` 遍历逻辑：遇到"竣工"时，先 push 竣产行，再 push 3个结算状态行，然后继续。

最终顺序：
1.待建 2.在建 3.停工 4.完工 5.竣工 6.结算编制中 7.结算已送审 8.结算已完成 9.业务销项 10.财务销项

---

## 修改4：销项项目汇总 - 一二三级分类平铺

**文件**：`e:\trae_demo_env\营收看板\src\components\fund\OutputProjectSummary.vue`

**现状**：el-table 使用 `tree-props="{ children: 'children' }"` + `default-expand-all` + `row-key="id"` 构建树形展开。`treeTableData` computed（L513-673）将数据按 分公司→一级→二级→三级 聚合成树。

**修改**：
1. el-table 移除 `row-key`、`:tree-props`、`default-expand-all`
2. 将 `treeTableData` 改为返回扁平数组：每行包含 基层单位、一级分类、二级分类、三级分类 + 所有指标字段，直接来自 `filteredData`
3. 排序逻辑 `sortedTreeData` / `sortTree` 简化为对扁平数组排序
4. 导出函数 `handleExport` 中 `flatten(treeTableData)` 简化为直接遍历扁平数据

---

## 修改5：按公司分类报表 - 底部加3行项目类型汇总

**文件**：`e:\trae_demo_env\营收看板\src\components\fund\BranchReport.vue`

**现状**：el-table 使用 `show-summary` + `getSummaries` 返回1行"总计"。数据有3种项目类型：'2025年以前项目'、'2025年新接项目'、'2025年销项项目'。

**修改**：在 `displayData` computed 末尾（所有单位小计行之后），追加3行按项目类型汇总的行：
- `basicUnit: '2025年以前项目 - 合计'`，筛选 `item.projectType === '2025年以前项目'` 的数据聚合
- `basicUnit: '2025年新接项目 - 合计'`，同理
- `basicUnit: '2025年销项项目 - 合计'`，同理

每行计算所有数值列的 SUM（与现有 subtotal 逻辑相同），标记 `isProjectTypeTotal: true` 用于样式区分。

在 scoped CSS 中添加样式：
```css
:deep(.el-table__row .is-project-type-total) {
  background-color: #e8f4fc;
  font-weight: bold;
}
```
通过 `:row-class-name` 回调给这些行添加 class。

---

## 修改6：业财统计报表 - 预警标识缩小

**文件**：`e:\trae_demo_env\营收看板\src\components\fund\FinanceReport.vue`

**现状**：预警框 CSS（L1053-1089）：
- `.warning-box`：`width: 150px; padding: 12px 16px;`
- `.warning-label`：`font-size: 14px;`
- `.warning-count`：`font-size: 28px;`
- `.warning-desc`：`font-size: 12px;`

**修改**：缩小尺寸：
- `.warning-box`：`width: 110px; padding: 6px 10px;` → 更紧凑
- `.warning-label`：`font-size: 12px;`
- `.warning-count`：`font-size: 18px;`
- `.warning-desc`：`font-size: 10px;`
- `.warning-box` 的 `border-radius` 从 `8px` 改为 `6px`

---

## 验证步骤

1. 确认开发服务器运行
2. 资金管理 → 项目板块业务财务信息汇总：验证项目类型筛选选项为3个新值
3. 资金管理 → 按分公司分类报表：验证基层单位筛选为多选
4. 资金管理 → 业财统计报表：验证基层单位筛选为多选；预警框明显变小
5. 资金管理 → 按项目状态分类汇总表：验证结算编制中/结算已送审/结算已完成 在竣工和业务销项之间
6. 资金管理 → 销项项目汇总：验证表格为平铺（无树形展开）
7. 资金管理 → 按分公司分类报表：滚动到底部验证3行项目类型合计行
