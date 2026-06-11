# 生产风险情况组件 UI 精简方案

## 一、需求概述

对 `ProductionRiskSituation.vue` 进行大幅精简：

1. 删除"显示全部"复选框
2. 时间筛选框缩窄
3. 标题不跨行
4. **删除** 风险开工令预警的三个大色块圆圈
5. **删除** "生产风险情况（按等级）"列表区域
6. 保留的内容做自适应和UI优化

***

## 二、当前状态

**文件**: `src/components/dashboard/ProductionRiskSituation.vue` (144行)

**当前UI结构**:

```
┌─────────────────────────────────────────────┐
│ 🔴 生产风险情况                               │
│ [2026-01 至 2026-12 ▼] ☑仅统计年度...        │ ← 标题可能跨行❌
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 风险开工令预警                            │ │
│ │   🔴大色块  🟠大色块  🟡大色块           │ │ ← 删除❌
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 生产风险情况（按等级）   ☐ 显示全部      │ │ ← 删除❌
│ │ ● I级风险    16个（6个已完成）          │ │
│ │ ● II级风险   10个（4个已完成）          │ │
│ │ ● III级风险  12个（5个已完成）          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

***

## 三、目标设计

### 删除后保留的内容

```
┌───────────────────────────────────────────┐
│ 🔴 生产风险情况     [2026-01 至 2026-12]  │ ← 标题行：紧凑+不跨行
│                   ☑ 仅统计年度风险管控清单  │
└───────────────────────────────────────────┘
```

**仅保留**: 标题 + 时间筛选器 + 年度管控清单筛选开关

***

## 四、实施方案

### 修改文件: `src/components/dashboard/ProductionRiskSituation.vue`

#### 具体改动点

| # | 改动          | 当前代码                                                         | 目标                       |
| - | ----------- | ------------------------------------------------------------ | ------------------------ |
| 1 | 删除"显示全部"    | 第66-69行                                                      | 整段删除                     |
| 2 | 缩窄时间筛选器     | `class="w-56"` (224px)                                       | `class="w-44"` (176px)   |
| 3 | 标题不跨行       | 文字长容易换行                                                      | 用`whitespace-nowrap`强制单行 |
| 4 | **删除**预警色块区 | 第39-62行整块                                                    | 删除                       |
| 5 | **删除**等级列表区 | 第64-93行整块                                                    | 删除                       |
| 6 | 清理无用逻辑      | fullRiskData, filteredRiskData, displayRiskData, levelColor等 | 删除                       |
| 7 | 容器自适应       | `h-full flex flex-col` + 内部flex-1                            | 改为紧凑布局                   |

### 新模板 (\~35行)

```vue
<template>
  <div class="bg-white rounded-xl p-3 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
        <h3 class="text-sm font-semibold text-gray-800 whitespace-nowrap">生产风险情况</h3>
      </div>
      <div class="flex items-center gap-2">
        <el-date-picker
          v-model="dateRange"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始年月"
          end-placeholder="结束年月"
          format="YYYY-MM"
          value-format="YYYY-MM"
          size="small"
          class="w-44"
        />
        <div
          class="flex items-center space-x-1 px-2 py-1 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors select-none shrink-0"
          :class="annualOnly ? 'bg-blue-50 border-blue-300' : 'border-gray-200'"
          @click="toggleAnnualFilter"
        >
          <input type="checkbox" :checked="annualOnly" class="w-3 h-3 rounded text-blue-600 cursor-pointer" @click.stop />
          <span class="text-xs whitespace-nowrap" :class="annualOnly ? 'text-blue-700 font-medium' : 'text-gray-600'">
            仅统计年度风险管控清单
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  alerts: Object
})

const dateRange = ref(['2026-01', '2026-12'])
const annualOnly = ref(false)

const toggleAnnualFilter = () => {
  annualOnly.value = !annualOnly.value
}
</script>
```

***

## 五、验证

* [ ] 组件只显示标题行（标题 + 时间选择器 + 年度清单开关）

* [ ] 无预警色块圆圈

* [ ] 无等级列表

* [ ] 时间选择器宽度为 w-44 (176px)

* [ ] 所有文字不跨行（whitespace-nowrap）

* [ ] 年度清单切换功能正常

  其他没提到的不要动

