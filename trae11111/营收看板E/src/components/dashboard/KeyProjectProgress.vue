<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">重点项目生产进度情况</h3>
      <span class="text-xs text-gray-400">2025-02-26 01</span>
    </div>
    
    <div class="flex items-center mb-4">
      <div 
        class="relative w-24 h-24 mr-4"
        :style="{ borderRadius: '50%', background: conicGradient }"
      >
        <div class="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
          <span class="text-xl font-bold text-blue-600">{{ completedCount }}</span>
          <span class="text-xs text-gray-500">已完成</span>
        </div>
      </div>
      <div class="flex-1">
        <div class="text-lg font-semibold text-gray-800">{{ milestoneTitle }}</div>
        <div class="text-sm text-gray-500">计划 {{ milestoneTotal }} 个</div>
      </div>
    </div>
    
    <div class="flex items-center space-x-4 mb-4">
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
        <span class="text-sm text-gray-600">已完成 {{ completedCount }}/{{ completedTotal }}</span>
      </div>
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
        <span class="text-sm text-gray-600">未完成 {{ completedTotal - completedCount }}</span>
      </div>
    </div>
    
    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="text-center p-2 bg-red-50 rounded-lg">
        <div class="text-lg font-bold text-red-600">{{ alerts.red }}</div>
        <div class="text-xs text-gray-500">红色预警</div>
      </div>
      <div class="text-center p-2 bg-orange-50 rounded-lg">
        <div class="text-lg font-bold text-orange-600">{{ alerts.orange }}</div>
        <div class="text-xs text-gray-500">橙色预警</div>
      </div>
      <div class="text-center p-2 bg-yellow-50 rounded-lg">
        <div class="text-lg font-bold text-yellow-600">{{ alerts.yellow }}</div>
        <div class="text-xs text-gray-500">黄色预警</div>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-2">
      <div class="p-2 bg-gray-50 rounded-lg">
        <div class="text-lg font-bold text-gray-800">{{ keyProjectCount }}</div>
        <div class="text-xs text-gray-500">重点项目数</div>
      </div>
      <div class="p-2 bg-gray-50 rounded-lg">
        <div class="text-lg font-bold text-red-600">{{ unreportedCount }}</div>
        <div class="text-xs text-gray-500">日报未上报</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  milestoneTitle: String,
  milestoneTotal: Number,
  completedCount: Number,
  completedTotal: Number,
  alerts: Object,
  keyProjectCount: Number,
  unreportedCount: Number
})

const percentage = computed(() => {
  if (!props.completedTotal) return 0
  return Math.round((props.completedCount / props.completedTotal) * 100)
})

const conicGradient = computed(() => {
  const percent = percentage.value
  return `conic-gradient(#1890ff ${percent}%, #e8f4fd ${percent}%)`
})
</script>