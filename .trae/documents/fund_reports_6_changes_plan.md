# 资金管理报表 6 项修改 — 计划

## 摘要

用户提出 6 项修改需求，涉及资金管理模块下多个报表组件。经 Phase 1 代码审查（Grep + Read），**全部 6 项修改已在代码中实现完成**，无诊断错误。本计划记录各项修改的代码位置，并提供浏览器端验证步骤。

---

## 当前状态分析（基于 Phase 1 代码审查）

### 修改 1：项目板块业务财务信息汇总表 — 项目类型取值 ✅ 已实现
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\SectorBusinessFinanceSummary.vue`
- **代码位置**：第 229 行
- **代码确认**：
  ```js
  const projectTypeOptions = [
    '2025年以前项目', '2025年新接项目', '2025年销项项目'
  ]
  ```
- 项目类型筛选为多选（`filters.projectType` 为数组，筛选逻辑用 `includes`）。

### 修改 2：资金管理所有报表基层单位支持多选筛选 ✅ 已实现
- **涉及文件**（经 Grep 确认含"基层单位"的 3 个报表）：
  1. `BranchReport.vue` — 第 6 行：`multiple collapse-tags`
  2. `FinanceReport.vue` — 第 15 行：`multiple collapse-tags`
  3. `OutputProjectSummary.vue` — 第 25 行：`multiple collapse-tags`（原有即多选）
- **未涉及文件**（无基层单位筛选）：SectorBusinessFinanceSummary.vue、ProjectStatusSummary.vue、InsuranceBrokerList.vue
- 三个文件筛选逻辑均改为 `searchForm.value.basicUnit.length === 0 || searchForm.value.basicUnit.includes(...)`。

### 修改 3：按项目状态分类汇总表 — 结算状态行位置 ✅ 已实现
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\ProjectStatusSummary.vue`
- **代码位置**：第 229 行 `if (status === '竣工')` 分支内（第 229-277 行）
- **代码确认**：结算状态行（结算编制中、结算已送审、结算已完成）在 forEach 内 `if (status === '竣工')` 时插入，位于"业务销项"行之前。
- **最终行序**：待建→在建→停工→完工→竣工→结算编制中→结算已送审→结算已完成→业务销项→财务销项→总计

### 修改 4：销项项目汇总 — 一级/二级/三级字段平铺 ✅ 已实现
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\OutputProjectSummary.vue`
- **代码位置**：
  - 第 130 行：`:data="sortedFlatData"`（绑定扁平数据）
  - 第 509 行：`flatTableData` computed（直接 map，无递归建树）
  - 第 569 行：`sortedFlatData` computed（简单排序）
  - 第 629 行：导出用 `flatTableData.value.map()`
- el-table 已移除 `row-key`、`:tree-props`、`default-expand-all`。

### 修改 5：按公司分类报表 — 底部加 3 行项目类型汇总 ✅ 已实现
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\BranchReport.vue`
- **代码位置**：第 209 行起（displayData computed 末尾）
- **代码确认**：遍历 `['2025年以前项目', '2025年新接项目', '2025年销项项目']`，对每个类型聚合 `filteredData`，生成 `${pt} - 合计` 行，标记 `isProjectTypeTotal: true`（第 237 行）。
- **样式**：`getRowClassName` 函数（第 255 行）+ CSS `.project-type-total-row`（橙色背景）和 `.subtotal-row`（灰色背景）。
- **分页**：pageSize=50，page-sizes=[50, 100, 200]。

### 修改 6：业财统计报表 — 蓝黄红预警框缩小 ✅ 已实现
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\FinanceReport.vue`
- **代码位置**：第 1057 行起（CSS）
- **CSS 确认**：
  ```css
  .warning-box { width: 110px; padding: 6px 10px; border-radius: 6px; }
  .warning-label { font-size: 12px; margin-bottom: 2px; }
  .warning-count { font-size: 18px; }
  .warning-desc { font-size: 10px; margin-top: 2px; }
  ```

---

## 假设与决策

1. **所有代码修改已完成**：Phase 1 代码审查确认 6 项修改全部在代码中实现，无遗漏。
2. **无其他报表含基层单位筛选**：Grep 确认仅 BranchReport、FinanceReport、OutputProjectSummary 三个文件含"基层单位"。
3. **无需额外代码修改**：当前仅需浏览器端验证；如验证中发现异常再针对性修复。

---

## 验证步骤

### 前置条件
- 开发服务器运行中（端口 5174，因 5173 被占用）
- 浏览器导航到 http://localhost:5174/

### 验证 1：项目板块业务财务信息汇总 — 项目类型筛选
1. 导航：资金管理 → 项目板块业务财务信息汇总
2. 打开"项目类型"下拉框
3. **预期**：选项为"2025年以前项目"、"2025年新接项目"、"2025年销项项目"（共 3 项，无旧值）
4. 勾选 1-2 项，表格数据随之过滤

### 验证 2：基层单位多选筛选（3 个报表）
1. **按分公司分类报表**：基层单位下拉可多选，tag 折叠显示
2. **业财统计报表**：基层单位下拉可多选
3. **销项项目汇总**：基层单位下拉可多选（原有功能）

### 验证 3：按项目状态分类汇总表 — 结算状态行位置
1. 导航：资金管理 → 按项目状态分类汇总表
2. **预期行序**：待建→在建→停工→完工→竣工→结算编制中→结算已送审→结算已完成→业务销项→财务销项→总计
3. **关键点**：3 个结算状态行位于"竣工"和"业务销项"之间

### 验证 4：销项项目汇总 — 平铺表格
1. 导航：资金管理 → 销项项目汇总
2. **预期**：每行直接显示基层单位、一级/二级/三级分类、项目数量等；行前无展开/折叠箭头
3. 验证排序和汇总行正常

### 验证 5：按公司分类报表 — 底部 3 行项目类型汇总
1. 导航：资金管理 → 按分公司分类报表
2. 滚动到表格底部
3. **预期**：底部有 3 行橙色背景的合计行："2025年以前项目 - 合计"、"2025年新接项目 - 合计"、"2025年销项项目 - 合计"

### 验证 6：业财统计报表 — 预警框缩小
1. 导航：资金管理 → 业财统计报表
2. **预期**：蓝/黄/红预警框尺寸变小（width 110px），字体紧凑；点击仍可触发筛选

---

## 执行流程

1. 确认开发服务器运行中（已在端口 5174 启动）
2. 使用 browser_use 子代理逐页验证 6 个验证点
3. 如发现异常，定位问题并修复
4. 全部验证通过后向用户汇报结果
