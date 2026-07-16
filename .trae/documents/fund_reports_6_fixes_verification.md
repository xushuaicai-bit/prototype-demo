# 资金管理报表 6 项修改 — 验证计划

## 摘要

用户提出 6 项修改需求，涉及资金管理模块下的多个报表组件。经 Phase 1 代码审查确认，**全部 6 项修改已在代码中实现完成**，无诊断错误。本计划聚焦于浏览器端验证，确认各项修改在运行时表现符合预期。

---

## 当前状态分析（基于代码审查）

### 修改 1：项目板块业务财务信息汇总表 — 项目类型取值
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\SectorBusinessFinanceSummary.vue`
- **代码位置**：第 228-230 行
- **当前状态**：✅ 已实现
- **代码确认**：
  ```js
  const projectTypeOptions = [
    '2025年以前项目', '2025年新接项目', '2025年销项项目'
  ]
  ```
- **说明**：项目类型筛选为多选，`filters.projectType` 为数组，筛选逻辑使用 `includes`。

### 修改 2：资金管理所有报表基层单位支持多选筛选
- **涉及文件**（经 Grep 确认含"基层单位"的 3 个报表）：
  1. `BranchReport.vue` — 第 6 行：`multiple collapse-tags` ✅
  2. `FinanceReport.vue` — 第 15 行：`multiple collapse-tags` ✅
  3. `OutputProjectSummary.vue` — 第 25 行：`multiple collapse-tags` ✅（原有即多选）
- **未涉及文件**（无基层单位筛选）：
  - `SectorBusinessFinanceSummary.vue`（只有分类/项目类型筛选）
  - `ProjectStatusSummary.vue`（无筛选区）
  - `InsuranceBrokerList.vue`（无基层单位字段）
- **筛选逻辑确认**：三个文件均已改为 `searchForm.value.basicUnit.length === 0 || searchForm.value.basicUnit.includes(...)`。

### 修改 3：按项目状态分类汇总表 — 结算状态行位置
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\ProjectStatusSummary.vue`
- **代码位置**：第 228-277 行
- **当前状态**：✅ 已实现
- **代码确认**：结算状态行（结算编制中、结算已送审、结算已完成）在 `if (status === '竣工')` 分支内插入，位于"业务销项"行之前。
- **最终行序**：待建→在建→停工→完工→竣工→结算编制中→结算已送审→结算已完成→业务销项→财务销项→总计

### 修改 4：销项项目汇总 — 一级/二级/三级字段平铺（非树结构）
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\OutputProjectSummary.vue`
- **代码位置**：第 130 行（模板）、第 509-517 行（flatTableData）、第 558-571 行（sortFlat/sortedFlatData）
- **当前状态**：✅ 已实现
- **代码确认**：
  - el-table 已移除 `row-key`、`:tree-props`、`default-expand-all`
  - `:data="sortedFlatData"` 绑定扁平数据
  - `flatTableData` computed 直接 `map` 数据，增加 `contractRatio` 字段，无递归构建树
  - `sortFlat` 为简单数组排序，无递归
  - 导出函数使用 `flatTableData.value.map()` 而非递归 `flatten()`

### 修改 5：按公司分类报表 — 底部加 3 行项目类型汇总
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\BranchReport.vue`
- **代码位置**：第 208-240 行（displayData computed 末尾）
- **当前状态**：✅ 已实现
- **代码确认**：遍历 `['2025年以前项目', '2025年新接项目', '2025年销项项目']`，对每个类型聚合 `filteredData`，生成 `${pt} - 合计` 行，标记 `isProjectTypeTotal: true`。
- **样式**：`getRowClassName` 函数 + CSS `.project-type-total-row`（橙色背景 #fff3e0）和 `.subtotal-row`（灰色背景 #f5f7fa）。
- **分页**：pageSize 改为 50，page-sizes 改为 [50, 100, 200]，确保汇总行在首页可见。

### 修改 6：业财统计报表 — 蓝黄红预警框缩小
- **文件**：`e:\trae_demo_env\营收看板\src\components\fund\FinanceReport.vue`
- **代码位置**：第 1052-1088 行（CSS）
- **当前状态**：✅ 已实现
- **CSS 确认**：
  ```css
  .warning-box { width: 110px; padding: 6px 10px; border-radius: 6px; } /* 原 150px / 12px 16px / 8px */
  .warning-label { font-size: 12px; margin-bottom: 2px; }                /* 原 14px / 4px */
  .warning-count { font-size: 18px; }                                    /* 原 28px */
  .warning-desc { font-size: 10px; margin-top: 2px; }                   /* 原 12px / 4px */
  ```

---

## 验证步骤

### 前置条件
- 开发服务器已启动（`npm run dev` 在 `e:\trae_demo_env\营收看板`）
- 浏览器导航到 http://localhost:5173/（或当前实际端口）

### 验证 1：项目板块业务财务信息汇总 — 项目类型筛选
1. 导航：资金管理 → 项目板块业务财务信息汇总
2. 打开"项目类型"下拉框
3. **预期**：选项为"2025年以前项目"、"2025年新接项目"、"2025年销项项目"（共 3 项，无旧值如 BT/BOT/PPP 等）
4. 验证多选筛选生效：勾选其中 1-2 项，表格数据随之过滤

### 验证 2：基层单位多选筛选（3 个报表）
1. **按分公司分类报表**：
   - 导航：资金管理 → 按分公司分类报表
   - 打开"基层单位"下拉框
   - **预期**：可多选，选中项以 tag 形式折叠显示
   - 勾选 2 个基层单位，查询后表格只显示对应单位数据
2. **业财统计报表**：
   - 导航：资金管理 → 业财统计报表
   - 打开"基层单位"下拉框
   - **预期**：可多选
   - 勾选多个单位，验证表格过滤
3. **销项项目汇总**：
   - 导航：资金管理 → 销项项目汇总
   - 打开"基层单位"下拉框
   - **预期**：可多选（原有功能，确认未被破坏）

### 验证 3：按项目状态分类汇总表 — 结算状态行位置
1. 导航：资金管理 → 按项目状态分类汇总表
2. 查看表格"项目状态"列
3. **预期行序**：
   - 待建
   - 在建
   - 停工
   - 完工
   - 竣工（结算状态列显示"按结算状态细分"）
   - 结算编制中（项目状态列为空，结算状态列显示"结算编制中"）
   - 结算已送审
   - 结算已完成
   - 业务销项
   - 财务销项
   - 总计（show-summary 合计行）
4. **关键点**：3 个结算状态行位于"竣工"和"业务销项"之间

### 验证 4：销项项目汇总 — 平铺表格（无树形展开）
1. 导航：资金管理 → 销项项目汇总
2. 查看表格
3. **预期**：
   - 每行直接显示：基层单位、一级分类、二级分类、三级分类、项目数量等字段值
   - 行前**无展开/折叠箭头图标**（非树形表格）
   - 每行数据独立，无父子层级关系
4. 验证排序功能正常（点击列头排序）
5. 验证汇总行（合计）正常显示

### 验证 5：按公司分类报表 — 底部 3 行项目类型汇总
1. 导航：资金管理 → 按分公司分类报表
2. 滚动到表格底部（或在第一页内查看，因 pageSize=50）
3. **预期**：
   - 各基层单位数据行 + 各单位小计行（灰色背景 `subtotal-row`）
   - 底部 3 行项目类型合计（橙色背景 `project-type-total-row`）：
     - "2025年以前项目 - 合计"
     - "2025年新接项目 - 合计"
     - "2025年销项项目 - 合计"
   - 最底部为 show-summary 的总计行
4. 验证合计行数值正确（等于对应项目类型所有行的汇总）

### 验证 6：业财统计报表 — 预警框缩小
1. 导航：资金管理 → 业财统计报表
2. 查看蓝/黄/红预警框区域
3. **预期**：
   - 预警框尺寸明显变小（width: 110px）
   - 预警标签字体 12px，数字字体 18px，描述字体 10px
   - 整体更紧凑，作为辅助预警不抢占主视觉
   - 点击预警框仍可触发筛选功能（active 状态高亮）

---

## 假设与决策

1. **所有代码修改已完成**：Phase 1 代码审查确认 6 项修改全部在代码中实现，无遗漏。
2. **无其他报表含基层单位筛选**：Grep 确认仅 BranchReport、FinanceReport、OutputProjectSummary 三个文件含"基层单位"。
3. **验证方式**：使用浏览器自动化（browser_use 子代理）逐页验证，必要时截图。
4. **无需额外代码修改**：若验证中发现问题，再针对性修复。

---

## 执行流程

1. 确认开发服务器运行中（或重新启动）
2. 使用 browser_use 子代理，按上述 6 个验证步骤逐页检查
3. 每个验证点截图或记录结果
4. 如发现异常，定位问题并修复
5. 全部验证通过后，向用户汇报最终结果
