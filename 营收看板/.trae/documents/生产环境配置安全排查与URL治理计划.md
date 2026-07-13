# 生产环境配置安全排查与外部 URL 治理计划

## 一、总结

对项目 `e:\trae_demo_env\营收看板` 进行全面排查后，结论如下：

| 排查项 | 结果 | 说明 |
|--------|------|------|
| 生产环境配置文件（.env / .env.production / config.js / application.yml） | ✅ 未发现 | 项目中不存在任何此类配置文件 |
| 数据库密码 / API Key / Token | ✅ 未发现 | 源码中无任何敏感凭证 |
| 前端 API 请求层（axios / fetch / XMLHttpRequest） | ✅ 不存在 | 项目为纯 Mock 数据驱动，无网络请求 |
| baseURL / 环境变量使用 | ✅ 不存在 | 无 baseURL 配置，未使用 import.meta.env / process.env |
| **硬编码的外部生产 URL** | ⚠️ **发现 26 处** | 通过 window.open 跳转和 iframe 嵌入指向 `www.smart-worksite.com` / `szsg-test.stec.net` |

**核心问题**：项目虽然没有 API 请求层（数据全部来自 `src/data/mockData.js`），但存在 **26 处硬编码的外部生产环境 URL**，分布在 7 个文件中。这些 URL 通过 `window.open()` 打开外部生产系统页面，或通过 `<iframe>` 嵌入外部页面。在 Demo 演示场景下，这些链接会直接打开真实生产系统，存在安全风险。

**治理方案**：创建统一的 URL 配置文件，将所有外部 URL 抽取为集中管理，通过环境变量控制基础地址，Demo 环境默认禁用外部跳转。

---

## 二、当前状态分析

### 2.1 已确认安全的部分

1. **无配置文件**：Glob 搜索 `**/.env*` 返回空，项目中不存在任何 .env 文件
2. **无 API 层**：Grep 搜索 `axios|fetch|XMLHttpRequest|baseURL` 在 `src/` 目录下无匹配
3. **纯 Mock 数据**：所有数据来自 [mockData.js](file:///e:/trae_demo_env/营收看板/src/data/mockData.js)
4. **vite.config.js**：仅包含 Vue 插件和路径别名，无代理/环境配置
5. **main.js**：仅初始化 Vue + ElementPlus，无全局网络配置

### 2.2 发现的硬编码外部 URL 清单

**基础地址 1**：`https://www.smart-worksite.com/hj/#`（24 处）
**基础地址 2**：`https://szsg-test.stec.net/#`（1 处，安全看板 iframe）

| # | 文件 | 行号 | 用途 | URL 路径 |
|---|------|------|------|----------|
| 1 | [Dashboard.vue](file:///e:/trae_demo_env/营收看板/src/views/Dashboard.vue#L39) | 39 | :link 属性 | /micro/market/biz/ent/market/prod-project/index |
| 2 | Dashboard.vue | 127 | window.open | /micro/market/biz/ent/market/prod-project/index |
| 3 | Dashboard.vue | 131 | window.open | /micro/project/biz/ent/production/schedule/milestone |
| 4 | Dashboard.vue | 135 | window.open | /micro/project/biz/ent/production/risk/list |
| 5 | Dashboard.vue | 139 | window.open | /micro/project/biz/ent/production/risk/list |
| 6 | Dashboard.vue | 143 | window.open | /micro/project/biz/ent/production/schedule/milestone |
| 7 | Dashboard.vue | 147 | window.open | /micro/project/biz/ent/production/quality/inspection/list |
| 8 | [UnifiedDashboard.vue](file:///e:/trae_demo_env/营收看板/src/views/UnifiedDashboard.vue#L501) | 501 | :link 属性 | /micro/market/biz/ent/market/prod-project/index |
| 9 | UnifiedDashboard.vue | 1184 | window.open | /micro/market/biz/ent/market/prod-project/index |
| 10 | UnifiedDashboard.vue | 1188 | window.open | /micro/market/biz/ent/market/general/contract |
| 11 | UnifiedDashboard.vue | 1192 | window.open | /micro/project/biz/ent/production/schedule/milestone |
| 12 | UnifiedDashboard.vue | 1196 | window.open | /micro/project/biz/ent/production/risk/list |
| 13 | UnifiedDashboard.vue | 1200 | window.open | /micro/project/biz/ent/production/risk/list |
| 14 | UnifiedDashboard.vue | 1204 | window.open | /micro/project/biz/ent/production/schedule/milestone |
| 15 | UnifiedDashboard.vue | 1208 | window.open | /micro/project/biz/ent/production/quality/inspection/list |
| 16 | [MarketDashboard.vue](file:///e:/trae_demo_env/营收看板/src/views/MarketDashboard.vue#L266) | 266 | window.open | /micro/market/biz/ent/market/project/potential |
| 17 | MarketDashboard.vue | 270 | window.open | /micro/market/biz/ent/market/project/bid |
| 18 | [TechResearchDashboard.vue](file:///e:/trae_demo_env/营收看板/src/views/TechResearchDashboard.vue#L273) | 273 | window.open | /micro/project/biz/scientific-research/project |
| 19 | TechResearchDashboard.vue | 281 | window.open | /micro/project/biz/scientific-research/achievement |
| 20 | TechResearchDashboard.vue | 297 | window.open | /micro/project/biz/technology/scheme/plan?company=xxx |
| 21 | TechResearchDashboard.vue | 299 | window.open | /micro/project/biz/technology/scheme/special?company=xxx |
| 22 | TechResearchDashboard.vue | 452 | window.open | /micro/project/biz/technology/knowledge/enterprise-procedure |
| 23 | [EconomyDashboard.vue](file:///e:/trae_demo_env/营收看板/src/views/EconomyDashboard.vue#L56) | 56 | iframe src | /micro/economic/biz/ent/economy/dashboard |
| 24 | [SafetyDashboard.vue](file:///e:/trae_demo_env/营收看板/src/views/SafetyDashboard.vue#L22) | 22 | iframe src | /enterprise/statistics/safety/board?t=xxx |
| 25 | [MaterialProcurementChart.vue](file:///e:/trae_demo_env/营收看板/src/components/dashboard/MaterialProcurementChart.vue#L132) | 132 | window.open | /micro/supplies/biz/enterprise/supplies/frame-contract/index |
| 26 | MaterialProcurementChart.vue | 229 | window.open | /micro/supplies/biz/enterprise/supplies/frame-contract/index |

---

## 三、拟议变更

### 3.1 新建文件：`src/config/externalUrls.js`

**目的**：集中管理所有外部系统 URL，通过环境变量控制基础地址，Demo 环境默认安全禁用。

**设计要点**：
- 从 `import.meta.env.VITE_SMART_WORKSITE_URL` 和 `import.meta.env.VITE_STEC_SAFETY_URL` 读取基础地址
- 未设置环境变量时（当前 Demo 状态），基础地址为空字符串，所有 URL 返回空字符串
- 提供 `openExternal(url)` 辅助函数：URL 为空时不执行 window.open
- 提供动态 URL 构建函数（带 query 参数的科研/技术跳转）
- 文件顶部注释说明如何在未来启用真实跳转（创建 .env 文件）

**文件内容**：

```js
/**
 * 外部系统 URL 集中配置
 *
 * 安全说明：
 * - 所有外部 URL 基础地址通过环境变量配置，默认为空（Demo 演示安全模式）
 * - Demo 环境下 openExternal() 不会打开任何外部页面，iframe 显示占位提示
 * - 如需启用真实跳转，在项目根目录创建 .env 文件并设置：
 *     VITE_SMART_WORKSITE_URL=https://www.smart-worksite.com/hj/#
 *     VITE_STEC_SAFETY_URL=https://szsg-test.stec.net/#
 */

const SMART_WORKSITE = import.meta.env.VITE_SMART_WORKSITE_URL || ''
const STEC_SAFETY = import.meta.env.VITE_STEC_SAFETY_URL || ''

function buildUrl(base, path, query) {
  if (!base) return ''
  let url = `${base}${path}`
  if (query) url += `?${query}`
  return url
}

/** 是否启用外部跳转 */
export const isExternalEnabled = !!(SMART_WORKSITE || STEC_SAFETY)

/** 外部系统 URL */
export const externalUrls = {
  // 市场
  marketProdProject: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/prod-project/index'),
  marketContract: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/general/contract'),
  marketPotential: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/project/potential'),
  marketBid: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/project/bid'),
  // 生产
  productionMilestone: buildUrl(SMART_WORKSITE, '/micro/project/biz/ent/production/schedule/milestone'),
  productionRisk: buildUrl(SMART_WORKSITE, '/micro/project/biz/ent/production/risk/list'),
  productionInspection: buildUrl(SMART_WORKSITE, '/micro/project/biz/ent/production/quality/inspection/list'),
  // 科研技术
  researchProject: (company) => buildUrl(SMART_WORKSITE, '/micro/project/biz/scientific-research/project', company ? `company=${encodeURIComponent(company)}` : ''),
  researchAchievement: (type) => buildUrl(SMART_WORKSITE, '/micro/project/biz/scientific-research/achievement', type ? `type=${encodeURIComponent(type)}` : ''),
  techSchemePlan: (company) => buildUrl(SMART_WORKSITE, '/micro/project/biz/technology/scheme/plan', `company=${encodeURIComponent(company)}`),
  techSchemeSpecial: (company) => buildUrl(SMART_WORKSITE, '/micro/project/biz/technology/scheme/special', `company=${encodeURIComponent(company)}`),
  techProcedure: buildUrl(SMART_WORKSITE, '/micro/project/biz/technology/knowledge/enterprise-procedure'),
  // 经济管理
  economyDashboard: buildUrl(SMART_WORKSITE, '/micro/economic/biz/ent/economy/dashboard'),
  // 供应链
  suppliesFrameContract: buildUrl(SMART_WORKSITE, '/micro/supplies/biz/enterprise/supplies/frame-contract/index'),
  // 安全管理
  safetyBoard: buildUrl(STEC_SAFETY, '/enterprise/statistics/safety/board', 't=1783930391415'),
}

/**
 * 安全地打开外部链接
 * Demo 环境（URL 为空）时不执行任何操作
 */
export function openExternal(url) {
  if (!url) return
  window.open(url, '_blank')
}
```

### 3.2 修改 `src/views/Dashboard.vue`

- **新增 import**：`import { externalUrls, openExternal } from '@/config/externalUrls'`
- **第 39 行**：`:link="'https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/prod-project/index'"` → `:link="externalUrls.marketProdProject"`
- **第 127 行**：`window.open('https://...prod-project/index', '_blank')` → `openExternal(externalUrls.marketProdProject)`
- **第 131 行**：→ `openExternal(externalUrls.productionMilestone)`
- **第 135 行**：→ `openExternal(externalUrls.productionRisk)`
- **第 139 行**：→ `openExternal(externalUrls.productionRisk)`
- **第 143 行**：→ `openExternal(externalUrls.productionMilestone)`
- **第 147 行**：→ `openExternal(externalUrls.productionInspection)`

### 3.3 修改 `src/views/UnifiedDashboard.vue`

- **新增 import**：`import { externalUrls, openExternal } from '@/config/externalUrls'`
- **第 501 行**：`:link="'https://...'"` → `:link="externalUrls.marketProdProject"`
- **第 1184 行**：→ `openExternal(externalUrls.marketProdProject)`
- **第 1188 行**：→ `openExternal(externalUrls.marketContract)`
- **第 1192 行**：→ `openExternal(externalUrls.productionMilestone)`
- **第 1196 行**：→ `openExternal(externalUrls.productionRisk)`
- **第 1200 行**：→ `openExternal(externalUrls.productionRisk)`
- **第 1204 行**：→ `openExternal(externalUrls.productionMilestone)`
- **第 1208 行**：→ `openExternal(externalUrls.productionInspection)`

### 3.4 修改 `src/views/MarketDashboard.vue`

- **新增 import**：`import { externalUrls, openExternal } from '@/config/externalUrls'`
- **第 266 行**：→ `openExternal(externalUrls.marketPotential)`
- **第 270 行**：→ `openExternal(externalUrls.marketBid)`

### 3.5 修改 `src/views/TechResearchDashboard.vue`

- **新增 import**：`import { externalUrls, openExternal } from '@/config/externalUrls'`
- **第 272-278 行**（openResearchProjectList）：`let url = 'https://...'` → `let url = externalUrls.researchProject(company)`
- **第 280-286 行**（openAchievementList）：→ `let url = externalUrls.researchAchievement(type)`
- **第 296-300 行**（chart click）：`url = \`https://...plan?company=...\`` → `url = externalUrls.techSchemePlan(category)`；`url = \`https://...special?company=...\`` → `url = externalUrls.techSchemeSpecial(category)`
- **第 452 行**：→ `openExternal(externalUrls.techProcedure)`

### 3.6 修改 `src/views/EconomyDashboard.vue`

- **新增 import**：`import { externalUrls, isExternalEnabled } from '@/config/externalUrls'`
- **第 56 行**：`const iframeUrl = 'https://...'` → `const iframeUrl = externalUrls.economyDashboard`
- **模板调整**：当 `!isExternalEnabled` 时显示占位提示（"演示环境：经济管理看板外部系统未配置"），不渲染 iframe

### 3.7 修改 `src/views/SafetyDashboard.vue`

- **新增 import**：`import { externalUrls, isExternalEnabled } from '@/config/externalUrls'`
- **第 22 行**：`const boardUrl = 'https://...'` → `const boardUrl = externalUrls.safetyBoard`
- **模板调整**：当 `!isExternalEnabled` 时显示占位提示（"演示环境：安全看板外部系统未配置"），不渲染 iframe

### 3.8 修改 `src/components/dashboard/MaterialProcurementChart.vue`

- **新增 import**：`import { externalUrls, openExternal } from '@/config/externalUrls'`
- **第 132 行**：`window.open('https://...', '_blank')` → `openExternal(externalUrls.suppliesFrameContract)`
- **第 229 行**：同上

---

## 四、假设与决策

1. **仅处理主项目 `营收看板/`**：`trae11111/营收看板E/` 为旧副本，不在本次修改范围内（如需同步可后续处理）
2. **不创建 .env 文件**：遵循用户选择，不创建 .env.development。配置文件通过 `import.meta.env.VITE_* || ''` 实现：无 .env 文件时环境变量为 undefined，自动回退为空字符串，所有外部跳转安全禁用
3. **不修改 dist/ 目录**：`dist/` 为构建产物，下次 `npm run build` 会重新生成。内置的旧 URL 会在重新构建后自动更新
4. **iframe 占位提示**：EconomyDashboard 和 SafetyDashboard 在 URL 为空时显示中文占位提示，而非空白 iframe
5. **动态 URL 处理**：科研/技术看板中带 query 参数的 URL（如 `?company=xxx`）通过配置文件中的函数动态构建，保持原有参数传递逻辑
6. **:link 属性兼容**：Dashboard.vue 和 UnifiedDashboard.vue 中 ProjectStatCard 组件的 `:link` 属性现在接收空字符串，需确认组件对空 link 的处理（预期：不触发跳转）

---

## 五、验证步骤

1. **启动开发服务器**：`npm run dev`（在 `e:\trae_demo_env\营收看板` 目录）
2. **验证外部跳转已禁用**：
   - 打开各看板页面（综合看板、市场看板、生产看板、科研技术看板、供应链看板）
   - 点击各图表/卡片的可点击区域 → 确认**不会**打开任何 `smart-worksite.com` 或 `stec.net` 页面
3. **验证 iframe 占位**：
   - 打开经济管理看板 → 确认显示占位提示而非加载外部页面
   - 打开安全管理-安全在线 → 确认显示占位提示而非加载外部页面
4. **验证 Mock 数据正常**：各看板图表数据正常显示（未受影响）
5. **Grep 复查**：在 `src/` 目录搜索 `smart-worksite.com|stec.net` → 确认返回 0 结果（所有 URL 已迁移到配置文件）
6. **Grep 复查敏感信息**：搜索 `password|secret|token|api_key` → 确认源码中无残留
