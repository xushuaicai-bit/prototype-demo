# 生产看板年份筛选+重点项目切换（正确目标：UnifiedDashboard.vue）

## 问题原因

之前误改了 `ProductionDashboard.vue`（独立页面），但实际生产看板渲染在 **`UnifiedDashboard.vue`** 中（第455-534行）。需将同样的改动迁移到 UnifiedDashboard.vue。

## 改动文件

### 1. mockData.js — 已完成 ✅
之前已新增的6组数据无需再改：
- `completedByYear`, `keyProjectOnlyStats`, `keyProjectOnlyManagementTimeliness`, `keyProjectOnlyRiskAlertTimeliness`, `keyProjectOnlyRiskByLevel`, `keyProjectOnlyKeyProjectProgress`

### 2. UnifiedDashboard.vue — 需要改动

#### 2a. import 补充（第563-574行）
在已有的 import 中追加新数据：

```javascript
import {
  projectStats,
  // ...已有导入不变...
  completedByYear,              // 新增
  keyProjectOnlyStats,          // 新增
  keyProjectOnlyManagementTimeliness,  // 新增
  keyProjectOnlyRiskAlertTimeliness,   // 新增
  keyProjectOnlyRiskByLevel,           // 新增
  keyProjectOnlyKeyProjectProgress      // 新增
} from '../data/mockData.js'
```

#### 2b. 响应式状态 + computed（第1085行后新增）

```javascript
// ============ 生产看板的全部 script 逻辑 ============
const activeCategory = ref(categoryTabs[0].name)

// --- 新增：年份筛选 ---
const selectedYear = ref('')

// --- 新增：仅看产运重点项目 ---
const showKeyProjectsOnly = ref(false)

// 项目统计数据（受年份+重点项目双重影响）
const displayProjectStats = computed(() => {
  const baseStats = showKeyProjectsOnly.value ? keyProjectOnlyStats : projectStats
  const yearData = selectedYear.value ? completedByYear[selectedYear.value] : completedByYear.default
  return baseStats.map((item, idx) => {
    if (idx === 3) return { ...item, value: yearData.completed }
    if (idx === 4) return { ...item, value: yearData.currentYear }
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

**头部区域（第457-468行）**：右侧增加年份选择器 + 重点项目切换按钮

当前：
```html
<div class="flex items-center justify-between px-4 pb-3 pt-1">
  <div class="flex items-center gap-2">...</div>
  <div class="text-right cursor-pointer" @click="handleProjectTotalClick">
    <div class="text-lg font-bold text-blue-600">{{ totalProjectCount }}</div>
    <div class="text-xs text-gray-500">项目总数</div>
  </div>
</div>
```

改为：
```html
<div class="flex items-center justify-between px-4 pb-3 pt-1">
  <div class="flex items-center gap-2">...</div>
  <div class="flex items-center gap-3">
    <!-- 年份选择器 -->
    <div class="flex items-center space-x-1">
      <span class="text-xs text-gray-500">年份:</span>
      <select v-model="selectedYear" class="border rounded px-1.5 py-0.5 text-xs">
        <option value="">全部</option>
        <option value="2026">2026年</option>
        <option value="2025">2025年</option>
      </select>
    </div>
    <!-- 仅看产运重点项目 -->
    <div class="flex items-center space-x-1 px-2 py-0.5 rounded border cursor-pointer hover:bg-gray-50 select-none"
         :class="showKeyProjectsOnly ? 'bg-blue-50 border-blue-300' : 'border-gray-200'"
         @click="showKeyProjectsOnly = !showKeyProjectsOnly">
      <input type="checkbox" :checked="showKeyProjectsOnly" class="w-3 h-3 rounded cursor-pointer" @click.stop />
      <span class="text-xs whitespace-nowrap" :class="showKeyProjectsOnly ? 'text-blue-700 font-medium' : 'text-gray-600'">
        仅看产运重点项目
      </span>
    </div>
    <!-- 项目总数 -->
    <div class="text-right cursor-pointer" @click="handleProjectTotalClick">
      <div class="text-lg font-bold text-blue-600 hover:text-yellow-600 transition-colors">{{ totalProjectCount }}</div>
      <div class="text-xs text-gray-500">项目总数</div>
    </div>
  </div>
</div>
```

**数据引用替换**（模板中）：

| 行号 | 原来 | 替换为 |
|------|------|--------|
| 第473行 | `v-for="stat in projectStats"` | `v-for="stat in displayProjectStats"` |
| 第485-488行 | `managementTimelinessData.*` | `displayManagementTimeliness.*` |
| 第493行 | `riskAlertTimeliness` | `displayRiskAlertTimeliness` |
| 第498行 | `riskByLevel` | `displayRiskByLevel` |
| 第510-516行 | `keyProjectProgress.*` | `displayKeyProjectProgress.*` |

## 验证
刷新页面 http://localhost:5173/ → 生产看板区域应显示年份选择器和「仅看产运重点项目」按钮
