<template>
  <div 
    :class="[
      'bg-white rounded-xl p-4 shadow-sm transition-all cursor-pointer',
      drillable ? 'hover:shadow-lg hover:border-blue-200 border border-transparent' : ''
    ]"
    @click="handleClick"
  >
    <div class="text-center relative">
      <div :class="['text-3xl font-bold', drillable ? 'text-blue-600' : 'text-gray-800']">{{ value }}</div>
      <div class="text-sm text-gray-500 mt-1">{{ unit }}</div>
      <div :class="['mt-2 font-medium', drillable ? 'text-blue-600 text-base' : 'text-gray-400 text-sm']">{{ title }}</div>
      <div v-if="drillable" class="drill-indicator absolute top-2 right-2 group">
        <svg class="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <div class="drill-tooltip absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
          点击查看详情
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { openExternal } from '@/config/externalUrls'

const props = defineProps({
  title: String,
  value: String,
  unit: String,
  drillable: {
    type: Boolean,
    default: false
  },
  link: String
})

const handleClick = () => {
  if (props.drillable) {
    openExternal(props.link)
  }
}
</script>