# 生产看板：年份筛选器 + 重点项目切换

## 摘要

在 `ProductionDashboard.vue` 中实现两个新功能：
1. **年份筛选器**：仅对「完工」和「当年竣工」生效，未选年份时显示默认值（完工=累计完成，当年竣工=当年值）
2. **仅看产运重点项目**切换：影响5个板块的数据（项目统计、管理提示及时性、风险预警及时性、生产风险情况、重点项目进度）

## 当前状态分析

**文件**: `src/views/ProductionDashboard.vue` (310行)

- 年份选择器在第18-24行，**纯静态UI**，无 `v-model`、无事件处理
- `projectStats` 直接从 `mockData.js` 导入使用（第218行）
- 所有数据均为**硬编码导入**，无任何 computed 过滤逻辑
- 管理提示及时性、风险预警、风险等级分布等全部内联展示

## 改动方案

### 改动1: mockData.js — 新增按年份和按重点项目的数据变体

**文件**: `src/data/mockData.js`

新增导出数据：

```javascript
// 按年份的完工/当年竣工数据
export const completedByYear = {
  default: { completed: '1458', currentYear: '22' },    // 未选年份时的默认值
  '2026': { completed: '320', currentYear: '22' },       // 2026年数据
  '2025': { completed: '280', currentYear: '18' },       // 2025年数据
}

// 仅看重点项目时的数据（约为全量的40%）
export const keyProjectOnlyStats = [
  { title: '待建', value: '31', unit: '个' },
  { title: '在建', value: '159', unit: '个' },
  { title: '停工', value: '232', unit: '个' },
  { title: '完工', value: '583', unit: '个' },
  { title: '当年竣工', value: '9', unit: '个' }
]

export const keyProjectOnlyManagementTimeliness = { ... } // 约40%
export const keyProjectOnlyRiskAlertTimeliness = [ ... ]  // 约40%
export const keyProjectOnlyRiskByLevel = [ ... ]          // 约40%
export const keyProjectOnlyKeyProjectProgress = { ... }   // 约40%
```

### 改动2: ProductionDashboard.vue — 响应式状态 + computed + UI

**文件**: `src/views/ProductionDashboard.vue`

#### 2a. 新增响应式状态 (script 部分)

```javascript
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 年份筛选
const selectedYear = ref('')  // '' 表示未选（默认）

// 重点项目切换
const showKeyProjectsOnly = ref(false)

// 导入全量数据和重点项目数据
import { projectStats, managementTimelinessData, riskAlertTimeliness,
         riskByLevel, keyProjectProgress, completedByYear,
         keyProjectOnlyStats, keyProjectOnlyManagementTimeliness,
         keyProjectOnlyRiskAlertTimeliness, keyProjectOnlyRiskByLevel,
         keyProjectOnlyKeyProjectProgress } from '../data/mockData.js'
```

#### 2b. Computed 属性 — 核心过滤逻辑

```javascript
// 项目统计数据（受年份+重点项目双重影响）
const displayProjectStats = computed(() => {
  let stats = showKeyProjectsOnly.value ? keyProjectOnlyStats : projectStats
  // 只修改完工(索引3)和当年竣工(索引4)的值
  return stats.map((item, idx) => {
    if (idx === 3 || idx === 4) {
      const yearData = selectedYear.value ? completedByYear[selectedYear.value] : completedByYear.default
      return { ...item, value: idx === 3 ? yearData.completed : yearData.currentYear }
    }
    return item
  })
})

// 管理提示及时性（仅受重点项目影响）
const displayManagementTimeliness = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyManagementTimeliness : managementTimelinessData
)

// 风险预警及时性（仅受重点项目影响）
const displayRiskAlertTimeliness = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyRiskAlertTimeliness : riskAlertTimeliness
)

// 风险等级分布（仅受重点项目影响）
const displayRiskByLevel = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyRiskByLevel : riskByLevel
)

// 重点项目进度（仅受重点项目影响）
const displayKeyProjectProgress = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyKeyProjectProgress : keyProjectProgress
)
```

#### 2c. 模板改动

**头部区域（第11-25行）**：

1. 年份选择器绑定 `v-model="selectedYear"`，增加"全部"(默认选项)
2. 右上角新增「仅看产运重点项目」checkbox 切换按钮

```html
<div class="flex items-center space-x-4">
  <!-- 公司选择器（不变） -->
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500">公司:</span>
    <select class="border rounded px-2 py-1 text-sm">
      <option>城乡水务</option>
    </select>
  </div>

  <!-- 年份选择器：绑定v-model -->
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500">年份:</span>
    <select v-model="selectedYear" class="border rounded px-2 py-1 text-sm">
      <option value="">全部</option>
      <option value="2026">2026年</option>
      <option value="2025">2025年</option>
    </select>
  </div>

  <!-- 仅看产运重点项目：新增 -->
  <div class="flex items-center space-x-1 px-2 py-1 rounded-md border cursor-pointer hover:bg-gray-50"
       :class="showKeyProjectsOnly ? 'bg-blue-50 border-blue-300' : 'border-gray-200'"
       @click="showKeyProjectsOnly = !showKeyProjectsOnly">
    <input type="checkbox" :checked="showKeyProjectsOnly" class="w-3 h-3 rounded cursor-pointer" />
    <span class="text-xs whitespace-nowrap"
          :class="showKeyProjectsOnly ? 'text-blue-700 font-medium' : 'text-gray-600'">
      仅看产运重点项目
    </span>
  </div>
</div>
```

**模板中各数据引用替换**：

| 行号 | 原来 | 替换为 |
|------|------|--------|
| 第30行 | `v-for="stat in projectStats"` | `v-for="stat in displayProjectStats"` |
| 第46行 | `managementTimelinessData.redAlert` | `displayManagementTimeliness.redAlert` |
| 第49行 | `managementTimelinessData.orangeAlert` | `displayManagementTimeliness.orangeAlert` |
| 第53行 | `managementTimelinessData.yellowAlert` | `displayManagementTimeliness.yellowAlert` |
| 第59行 | `managementTimelinessData.subItems` | `displayManagementTimeliness.subItems` |
| 第69行 | `v-for="item in riskAlertTimeliness"` | `v-for="item in displayRiskAlertTimeliness"` |
| 第79行 | `v-for="item in riskByLevel"` | `v-for="item in displayRiskByLevel"` |
| 第152行 | `keyProjectProgress.unreportedCount` | `displayKeyProjectProgress.unreportedCount` |
| 第155行 | `keyProjectProgress.completed.count` | `displayKeyProjectProgress.completed.count` |
| 第156行 | `keyProjectProgress.milestone.total` | `displayKeyProjectProgress.milestone.total` |
| 第157行 | `keyProjectProgress.keyProjectCount` | `displayKeyProjectProgress.keyProjectCount` |
| 第160-162行 | `keyProjectProgress.alerts.*` | `displayKeyProjectProgress.alerts.*` |

## 受影响的组件范围

当勾选「仅看产运重点项目」后，以下板块数据变化（约40%）：

| 板块 | 数据源 | 变化 |
|------|--------|------|
| 待建/在建/停工/完工/当年竣工 | `projectStats` → `keyProjectOnlyStats` | 数量减少 |
| 管理提示及时性 | `managementTimelinessData` → `keyProjectOnly...` | 所有指标减少 |
| 风险预警及时性 | `riskAlertTimeliness` → `keyProjectOnly...` | 所有数值减少 |
| 生产风险情况(风险等级分布) | `riskByLevel` → `keyProjectOnly...` | 各级数量减少 |
| 重点项目生产进度 | `keyProjectProgress` → `keyProjectOnly...` | 进度数值变化 |

**不受影响的板块**：
- 风险开工令预警
- 里程碑节点进度
- 证照办理进度
- 巡检计划完成情况
- 生产进度趋势

## 验证步骤

1. 页面加载 → 默认不选年份、不勾选重点项目 → 完工=1458、当年竣工=22
2. 选择2026年 → 完工=320、当年竣工=22（仅这两个变化）
3. 选择2025年 → 完工=280、当年竣工=18
4. 切回"全部"年份 → 恢复默认值
5. 勾选「仅看产运重点项目」→ 5个板块所有数值约减至40%
6. 取消勾选 → 恢复全量数据
7. 同时选中年份+重点项目 → 两层过滤叠加
