# 科研管理看板 PRD 导出计划

## 一、任务概要

为"技术科研看板"（TechResearchDashboard）生成一份完整的产品需求文档（PRD），覆盖看板全部 6 个功能模块的交互、数据、图表、外部跳转等需求。

## 二、当前看板结构分析

文件：`e:\trae_demo_env\营收看板\src\views\TechResearchDashboard.vue`（804 行）
数据：`e:\trae_demo_env\营收看板\src\data\mockData.js`
路由：App.vue 中 `viewMap['技术科研看板']` 映射到 `TechResearchDashboard`
外部链接：`e:\trae_demo_env\营收看板\src\config\externalUrls.js`

### 看板包含 6 个模块：

| # | 模块 | 类型 | 交互 |
|---|------|------|------|
| 1 | 顶部筛选区 | 按钮组 | 10 个筛选标签（全部+9家基层单位），带计数 |
| 2 | 施工方案及交底 | 柱状图+折线图 | 3 个 Tab（审批完成率/方案退回率/交底完成率）× 2 维度（9家基层单位/8大业态），点击柱子跳转外部 |
| 3 | 知识库使用情况 | 指标卡+柱状图 | 3 个统计卡（总上传/总下载/下载人数）+ 双柱图，点击跳转外部 |
| 4 | 基层单位科研项目数量 | 渐变柱状图 | 9 家单位项目数，"查看全部"跳转外部，点击柱子带单位名跳转 |
| 5 | 科研成果统计 | 柱状图/饼图 | 2 个 Tab（按成果类型/按基层单位），"查看详情"跳转外部 |
| 6 | 科研费用管控 | 双柱+计划线 | 季度选择(Q1-Q4)，专项/配套双柱+橙色计划指标线，tooltip 显示完成率/偏差，点击 alert 提示 |

### 外部跳转链接（5个）：
- 科研项目列表：`/micro/project/biz/scientific-research/project?company=xxx`
- 科研成果详情：`/micro/project/biz/scientific-research/achievement?type=xxx`
- 施工方案计划：`/micro/project/biz/technology/scheme/plan?company=xxx`
- 施工方案专项：`/micro/project/biz/technology/scheme/special?company=xxx`
- 企业工艺知识库：`/micro/project/biz/technology/knowledge/enterprise-procedure`

## 三、PRD 文档结构

将生成以下章节的 PRD 文档：

1. **文档信息** — 版本、日期、作者
2. **产品概述** — 看板定位、目标用户、核心价值
3. **功能架构** — 6 大模块概览图
4. **详细功能需求** — 逐模块描述：
   - 功能描述
   - 数据来源与结构
   - 交互逻辑（Tab 切换、点击跳转、悬浮提示）
   - 图表配置（图表类型、颜色、轴配置）
   - 外部链接规则
5. **非功能需求** — 性能、兼容性、安全
6. **数据字典** — 9 家基层单位、8 大业态、6 种成果类型
7. **附录** — 外部 URL 配置表

## 四、输出文件

生成 PRD 文档到：`e:\trae_demo_env\.trae\documents\科研管理看板PRD.md`

## 五、验证

- PRD 内容覆盖全部 6 个模块
- 数据结构描述与 mockData.js 一致
- 外部链接路径与 externalUrls.js 一致
- 图表交互描述与代码实现一致
