<template>
  <div 
    :class="[
      'bg-white rounded-xl p-4 shadow-sm transition-all cursor-pointer',
      drillable ? 'hover:shadow-lg hover:border-blue-200 border border-transparent' : 'hover:shadow-md'
    ]"
    @click="handleClick"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500 mb-1">{{ title }}</p>
        <div class="flex items-baseline">
          <span :class="['text-2xl font-bold', drillable ? 'text-blue-600' : 'text-gray-800']">{{ value }}</span>
          <span class="text-sm text-gray-500 ml-1">{{ unit }}</span>
        </div>
      </div>
      <div class="flex items-center">
        <div :class="['w-12 h-12 rounded-full flex items-center justify-center', iconBgClass]">
          <svg :class="['w-6 h-6', iconClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="icon === 'trending-up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            <path v-else-if="icon === 'target'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path v-else-if="icon === 'bar-chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            <path v-else-if="icon === 'check-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            <path v-else-if="icon === 'file-text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path v-else-if="icon === 'calendar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div v-if="drillable" class="drill-indicator ml-2 relative group">
          <svg class="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <div class="drill-tooltip absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            点击查看详情
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: String,
  unit: String,
  icon: String,
  color: String,
  drillable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['drill'])

const handleClick = () => {
  if (props.drillable) {
    emit('drill')
  }
}

const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    cyan: 'bg-cyan-50',
    orange: 'bg-orange-50',
    pink: 'bg-pink-50',
    gray: 'bg-gray-50'
  }
  return colorMap[props.color] || 'bg-blue-50'
})

const iconClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    cyan: 'text-cyan-500',
    orange: 'text-orange-500',
    pink: 'text-pink-500',
    gray: 'text-gray-500'
  }
  return colorMap[props.color] || 'text-blue-500'
})
</script>
