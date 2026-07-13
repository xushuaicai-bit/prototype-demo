# 业财统计报表 — 导入功能与版本留存计划

## 概述
为「资金管理 → 业财统计报表」（`FinanceReport.vue`）增加 Excel 导入功能，导入后数据留存为版本并提示「每月留存版本以当月25号前手动导入的最后一版为准」。每月一旦手动导入过数据，不再自动更新上月25-本月25的数据；移除「手动更新数据」按钮，新增「导入数据」按钮，并提供模板下载与版本历史列表。

## 现状分析
- 技术栈：Vue 3 + Element Plus + Tailwind，纯前端项目，无路由/无 Pinia，数据为前端 mock。
- 目标组件：[FinanceReport.vue](file:///e:/trae_demo_env/营收看板/src/components/fund/FinanceReport.vue)
  - 第 35 行：`<el-button @click="handleRefresh" type="success">手动更新数据</el-button>` —— 重新生成 mock 数据，需移除。
  - 第 668-671 行：`handleRefresh` 函数，调用 `generateMockData()` 重新赋值 `financeData`。
  - 第 629 行：`const financeData = ref(generateMockData())` —— 每次加载组件都重新生成 mock 数据（即"自动更新"）。
  - 第 680-699 行：`handleExport` 导出 CSV。
  - 第 301-404 行：`allColumnsFlat` 定义了全部列（prop + label），可作为导入列映射与模板表头依据。
- `xlsx` 库（v0.18.5）已是依赖（[package.json](file:///e:/trae_demo_env/营收看板/package.json) 第 14 行），其他组件已用 `utils, writeFile` 做导出，可直接复用 `read` 做导入解析。
- 组件通过 [App.vue](file:///e:/trae_demo_env/营收看板/src/App.vue) 第 92 行 `viewMap['业财统计报表']` 渲染，无独立路由。
- 纯前端项目，版本持久化使用 `localStorage`。

## 改动方案

### 只改一个文件：`src/components/fund/FinanceReport.vue`

#### 1. 移除「手动更新数据」按钮与逻辑
- 删除模板第 35 行的「手动更新数据」按钮。
- 删除 `handleRefresh` 函数（第 668-671 行）。

#### 2. 新增「导入数据」「下载导入模板」「版本记录」按钮
在搜索区按钮行（原手动更新按钮位置）新增：
- `导入数据`（type="success"）：触发隐藏的 `el-upload` 选择 Excel 文件。
- `下载导入模板`（type="default"）：调用 xlsx 生成并下载含全部列头的空白模板。
- `版本记录`（type="default"）：打开版本历史对话框。

#### 3. 导入解析逻辑
- 引入 `import { utils, writeFile, read } from 'xlsx'`（替换原 CSV 导出为 xlsx 导出，保持与项目其他报表一致；同时用 `read` 解析导入文件）。
- 构建列头映射表 `labelToProp`：由 `allColumnsFlat` 生成 `{ [label]: prop }`（排除 `index` 列）。
- `handleImport(file)`：
  1. 用 `FileReader` 读取文件为 ArrayBuffer。
  2. `read(data, { type: 'array' })` 解析工作簿，取第一个 sheet。
  3. `utils.sheet_to_json(sheet, { header: 1 })` 得到二维数组，首行为表头。
  4. 按表头 `labelToProp` 映射为数据对象数组；未匹配的列忽略；补全缺失字段为默认空值。
  5. 重建 `index`/`productionProjectNo` 等必填字段缺失时的默认值。
  6. 调用 `saveVersion(parsedData, file.name)` 留存版本，并将 `financeData` 替换为导入数据。
  7. `ElMessage.success` 提示导入成功（含条数）。

#### 4. 模板下载逻辑
- `handleDownloadTemplate()`：
  1. 取 `allColumnsFlat`（排除 `index`）的 `label` 作为表头行。
  2. `utils.aoa_to_sheet([headers])` 生成 sheet，`utils.book_new()` + `book_append_sheet`。
  3. `writeFile(wb, '业财统计报表导入模板.xlsx')` 下载。

#### 5. 版本留存与月度周期逻辑
- **周期键**：`periodKey = YYYY-MM`（当前年月，如 `'2026-07'`）。一个周期对应「上月25-本月25」的数据区间。
- **localStorage 存储**：键名 `financeReport_versions`，值为数组：
  ```js
  [{
    id: Number,              // Date.now()
    importTime: 'YYYY-MM-DD HH:mm:ss',
    periodKey: '2026-07',
    fileName: 'xxx.xlsx',
    rowCount: 100,
    data: [...]              // 完整导入数据
  }]
  ```
- **留存版本判定**：某周期内，导入时间在当月25号（含）之前的最后一版为该周期的「留存版本」。
  - `getLockedVersion(periodKey)`：过滤该周期版本中 `importTime` 日期 ≤ 当月25号的，取 `importTime` 最大者。
- **自动更新禁用**：`hasManualImport(periodKey)` 判断当前周期是否已有任何导入版本。
  - 组件 `onMounted` / 初始化时：若当前周期存在留存版本 → `financeData` 加载该留存版本数据（不再 `generateMockData()`）；否则保留原 mock 生成行为。
  - 即"每月一旦手动导入过数据后，不再自动更新上月25-本月25的数据"。

#### 6. 版本历史对话框
- 新增 `el-dialog`（标题「版本记录」，宽度 700px）：
  - 顶部提示文字：「每月留存版本以当月25号前手动导入的最后一版为准」。
  - `el-table` 列：导入时间、文件名、数据条数、是否留存版本（标签标记）、操作。
  - 操作列：「查看」（临时切换表格数据到该版本预览）、「恢复为此版本」（设为当前 `financeData`）。
  - 当前生效版本行高亮/标记。

#### 7. 页面提示横幅
- 在搜索面板上方或表格上方新增提示条（`el-alert` type="info" :closable="false"）：
  - 文案：「每月留存版本以当月25号前手动导入的最后一版为准」。
  - 若当前为留存版本数据，追加显示：「当前数据：留存版本，导入时间 XXXX，共 N 条」。
  - 若当前为 mock 数据（未导入），显示：「当前为系统默认数据，导入后将留存版本」。

#### 8. 导出逻辑统一（可选小调整）
- 将 `handleExport` 由 CSV 改为 xlsx 导出（`utils.json_to_sheet` + `writeFile`），与项目其他报表一致；导出当前 `tabFilteredData`。此为一致性优化，非必须，但建议顺带统一。

## 假设与决策
1. **纯前端持久化**：项目无后端，版本数据存 `localStorage`（键 `financeReport_versions`）。清除浏览器数据会丢失版本，符合 demo 性质。
2. **导入列映射**：以 `allColumnsFlat` 的 `label` 作为 Excel 表头匹配依据，表头需与模板一致；未识别列忽略，缺失字段补空值。
3. **周期定义**：`periodKey = 当前年月`，对应「上月25-本月25」区间；25号前的最后一版为留存版本。
4. **自动更新语义**：当前"自动更新"= 组件加载时 `generateMockData()` 重新生成。导入后改从 localStorage 读取留存版本，不再重新生成。
5. **模板下载**：复用 xlsx 能力，表头取全部列（排除序号列）。
6. **不新增文件**：所有改动集中在 `FinanceReport.vue`，不创建新组件/新文件。
7. **不改动 App.vue / 路由 / 其他组件**。

## 验证步骤
1. 启动开发服务器（`npm run dev`），导航至「资金管理 → 业财统计报表」。
2. 确认「手动更新数据」按钮已消失，「导入数据」「下载导入模板」「版本记录」按钮已出现。
3. 点击「下载导入模板」→ 下载 `业财统计报表导入模板.xlsx`，打开确认表头与列一致。
4. 在模板中填写若干行数据，点击「导入数据」选择该文件 → 表格刷新为导入数据，提示导入成功（含条数）。
5. 确认页面提示横幅显示「每月留存版本以当月25号前手动导入的最后一版为准」及当前版本信息。
6. 再次导入另一份文件 → 打开「版本记录」对话框，确认两条版本记录，25号前的最后一版标记为「留存版本」。
7. 在版本记录中点击「恢复为此版本」→ 表格切换为该版本数据。
8. 刷新浏览器页面 → 确认数据仍为留存版本（未重新生成 mock），即"不再自动更新"生效。
9. 确认导出功能正常（导出当前表格数据）。
10. 确认查询/重置/Tab 切换/自定义字段等原有功能不受影响。
