<template>
  <div class="bg-white rounded-xl p-3 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-800">
        {{ keyProjectMode ? '重点项目生产进度情况' : '生产进度情况' }}
      </h3>
    </div>
    
    <div class="flex-1 flex flex-col">
      <div class="flex items-center mb-3">
        <div 
          class="relative w-20 h-20 mr-3 flex-shrink-0"
          :style="{ borderRadius: '50%', background: conicGradient }"
        >
          <div class="absolute inset-1.5 bg-white rounded-full flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-blue-600">{{ currentData.completedCount }}</span>
            <span class="text-xs text-gray-500">已完成</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-800">{{ currentData.milestoneTitle }}</div>
          <div class="text-xs text-gray-500">计划 {{ currentData.milestoneTotal }} 个</div>
        </div>
      </div>
      
      <div class="flex items-center space-x-3 mb-3 text-xs">
        <div class="flex items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>
          <span class="text-gray-600">已完成 {{ currentData.completedCount }}/{{ currentData.completedTotal }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-gray-300 mr-1.5"></span>
          <span class="text-gray-600">未完成 {{ currentData.completedTotal - currentData.completedCount }}</span>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-1.5">
        <div class="text-center p-2 bg-red-50 rounded-lg">
          <div class="text-lg font-bold text-red-600">{{ currentData.alerts.red }}</div>
          <div class="text-xs text-gray-500">红色预警</div>
        </div>
        <div class="text-center p-2 bg-orange-50 rounded-lg">
          <div class="text-lg font-bold text-orange-600">{{ currentData.alerts.orange }}</div>
          <div class="text-xs text-gray-500">橙色预警</div>
        </div>
        <div class="text-center p-2 bg-yellow-50 rounded-lg">
          <div class="text-lg font-bold text-yellow-600">{{ currentData.alerts.yellow }}</div>
          <div class="text-xs text-gray-500">黄色预警</div>
        </div>
      </div>
      
      <div v-if="keyProjectMode" class="grid grid-cols-2 gap-1.5 mt-2">
        <div class="p-1.5 bg-gray-50 rounded-lg text-center">
          <div class="text-sm font-bold text-gray-800">{{ keyProjectCount }}</div>
          <div class="text-xs text-gray-500">重点项目数</div>
        </div>
        <div class="p-1.5 bg-red-50 rounded-lg text-center">
          <div class="text-sm font-bold text-red-600">{{ unreportedCount }}</div>
          <div class="text-xs text-gray-500">日报未上报</div>
        </div>
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
  unreportedCount: Number,
  keyProjectMilestoneTitle: String,
  keyProjectMilestoneTotal: Number,
  keyProjectCompletedCount: Number,
  keyProjectCompletedTotal: Number,
  keyProjectAlerts: Object,
  keyProjectMode: { type: Boolean, default: false }
})

const currentData = computed(() => {
  if (props.keyProjectMode) {
    return {
      milestoneTitle: props.keyProjectMilestoneTitle || '重点管控里程碑节点',
      milestoneTotal: props.keyProjectMilestoneTotal || props.milestoneTotal,
      completedCount: props.keyProjectCompletedCount || props.completedCount,
      completedTotal: props.keyProjectCompletedTotal || props.completedTotal,
      alerts: props.keyProjectAlerts || props.alerts
    }
  }
  return {
    milestoneTitle: props.milestoneTitle,
    milestoneTotal: props.milestoneTotal,
    completedCount: props.completedCount,
    completedTotal: props.completedTotal,
    alerts: props.alerts
  }
})

const percentage = computed(() => {
  if (!currentData.value.completedTotal) return 0
  return Math.round((currentData.value.completedCount / currentData.value.completedTotal) * 100)
})

const conicGradient = computed(() => {
  const percent = percentage.value
  return `conic-gradient(#1890ff ${percent}%, #e8f4fd ${percent}%)`
})
</script>