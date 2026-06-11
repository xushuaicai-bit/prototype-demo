<template>
  <div class="bg-white rounded-xl p-3 shadow-sm flex flex-col h-full">
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

    <!-- 等级列表区域 -->
    <div class="mt-3 border-t border-gray-100 pt-3 flex-1 flex flex-col min-h-0">
      <!-- I级风险：全宽大块 -->
      <div v-if="displayRiskData.length > 0"
           class="mb-2 px-2.5 py-8 bg-red-50 rounded-lg border border-red-100 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
            <span class="text-sm font-semibold text-gray-800">{{ displayRiskData[0].level }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-base"><span class="font-bold text-gray-900">{{ displayRiskData[0].count }}</span><span class="text-gray-400 ml-0.5">个</span></span>
            <span v-if="displayRiskData[0].completed > 0" class="text-sm text-green-600 font-medium">{{ displayRiskData[0].completed }}完成</span>
          </div>
        </div>
      </div>

      <!-- II级 + III级：各占1/2，铺满剩余空间 -->
      <div class="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <div v-for="item in displayRiskData.slice(1)" :key="item.level"
             class="px-2.5 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
          <div class="flex flex-col items-center text-center gap-1.5">
            <div class="flex items-center">
              <span :class="['w-2 h-2 rounded-full mr-1', levelColor(item.level)]"></span>
              <span class="text-sm font-medium text-gray-700">{{ item.level }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-gray-900">{{ item.count }}<span class="text-gray-400 text-xs ml-0.5">个</span></span>
              <span v-if="item.completed > 0" class="text-sm text-green-600">{{ item.completed }}完成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  riskData: Array,
  alerts: Object
})

const dateRange = ref(['2026-01', '2026-12'])
const annualOnly = ref(false)

const toggleAnnualFilter = () => {
  annualOnly.value = !annualOnly.value
}

// 完整数据（显示全部）
const fullRiskData = computed(() => {
  return props.riskData?.length > 0 ? props.riskData : [
    { level: 'I级风险', count: 16, completed: 6 },
    { level: 'II级风险', count: 10, completed: 4 },
    { level: 'III级风险', count: 12, completed: 5 }
  ]
})

// 过滤后数据（仅统计年度风险管控清单 - 数量约为原来的50%）
const filteredRiskData = computed(() => {
  return fullRiskData.value.map(item => ({
    ...item,
    count: Math.round(item.count * 0.5),
    completed: Math.round(item.completed * 0.5)
  }))
})

// 根据筛选状态返回不同数据源（指标名称不变，数量变少）
const displayRiskData = computed(() => {
  return annualOnly.value ? filteredRiskData.value : fullRiskData.value
})

const levelColor = (level) => ({
  'I级风险': 'bg-red-500',
  'II级风险': 'bg-orange-500',
  'III级风险': 'bg-yellow-500'
}[level] || 'bg-gray-500')
</script>
