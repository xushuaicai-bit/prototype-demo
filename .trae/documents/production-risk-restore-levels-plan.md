# 恢复生产风险等级列表方案

## 一、问题

上次精简时误删了 **"生产风险情况（按等级）"** 的 I/II/III级 风险数量 + 完成数列表。需要恢复该区域。

---

## 二、当前状态 vs 目标

### 当前 (49行) - 缺少等级列表
```
┌──────────────────────────────────────────┐
│ 🔴 生产风险情况   [2026-01..] ☑仅统计... │
└──────────────────────────────────────────┘
```

### 目标 - 恢复等级列表
```
┌────────────────────────────────────────────┐
│ 🔴 生产风险情况   [2026-01..] ☑仅统计...   │  ← 标题行（不变）
├────────────────────────────────────────────┤
│ ● I级风险      16个  （6完成）            │  ← 恢复 ✅
│ ● II级风险     10个  （4完成）            │
│ ● III级风险    12个  （5完成）            │
└────────────────────────────────────────────┘
```

**仍然删除的内容**（用户明确要求删除的）：
- ~~风险开工令预警的红/黄/橙色大色块圆圈~~ ❌ 不恢复
- ~~"显示全部"复选框~~ ❌ 不恢复

---

## 三、实施方案

在现有49行基础上，追加等级列表区域 + 恢复相关逻辑。

### 文件: `src/components/dashboard/ProductionRiskSituation.vue`

**模板改动**: 在第31行 `</div>` (标题行结束) 之后、第32行 `</div>` (根容器结束) 之前，插入等级列表区域。

**脚本改动**: 恢复 `riskData` prop、`fullRiskData`/`filteredRiskData`/`displayRiskData` computed、`levelColor` 函数。

### 新增模板 (~25行)

```vue
<!-- 等级列表区域 -->
<div class="mt-3 border-t border-gray-100 pt-3">
  <h4 class="text-xs font-semibold text-gray-700 mb-2">生产风险情况（按等级）</h4>
  <div class="space-y-1.5">
    <div
      v-for="item in displayRiskData"
      :key="item.level"
      class="flex items-center justify-between px-2.5 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div class="flex items-center">
        <span :class="['w-2 h-2 rounded-full mr-2', levelColor(item.level)]"></span>
        <span class="text-xs font-medium text-gray-800">{{ item.level }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs">
          <span class="font-bold text-gray-800">{{ item.count }}</span>
          <span class="text-gray-400 ml-0.5">个</span>
        </span>
        <span v-if="item.completed > 0" class="text-xs text-green-600 font-medium">
          {{ item.completed }}完成
        </span>
      </div>
    </div>
  </div>
</div>
```

### 新增脚本 (~30行)

```javascript
import { ref, computed } from 'vue'

const props = defineProps({
  riskData: Array,
  alerts: Object
})

// ... dateRange, annualOnly, toggleAnnualFilter 保持不变 ...

// 完整数据
const fullRiskData = computed(() => {
  return props.riskData?.length > 0 ? props.riskData : [
    { level: 'I级风险', count: 16, completed: 6 },
    { level: 'II级风险', count: 10, completed: 4 },
    { level: 'III级风险', count: 12, completed: 5 }
  ]
})

// 年度清单过滤后数据（约50%）
const filteredRiskData = computed(() => {
  return fullRiskData.value.map(item => ({
    ...item,
    count: Math.round(item.count * 0.5),
    completed: Math.round(item.completed * 0.5)
  }))
})

// 根据筛选状态切换数据源
const displayRiskData = computed(() => {
  return annualOnly.value ? filteredRiskData.value : fullRiskData.value
})

const levelColor = (level) => ({
  'I级风险': 'bg-red-500',
  'II级风险': 'bg-orange-500',
  'III级风险': 'bg-yellow-500'
}[level] || 'bg-gray-500')
```

---

## 四、验证

- [ ] I/II/III级风险名称正确显示
- [ ] 数量和完成数正确显示
- [ ] 点击"仅统计年度风险管控清单"后数量变少（~50%），指标名不变
- [ ] 无预警色块圆圈
- [ ] 无"显示全部"复选框
- [ ] 时间选择器 w-44，标题不跨行
