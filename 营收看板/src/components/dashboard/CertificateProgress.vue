<template>
  <div class="bg-white rounded-xl p-4 shadow-sm h-full flex flex-col">
    <div class="flex items-center mb-4">
      <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
      <h3 class="text-base font-semibold text-gray-800">证件办理情况</h3>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="item in certificateData" 
        :key="item.name"
        class="p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm font-medium text-gray-800">{{ item.name }}</span>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>应办总数: {{ item.total }}</span>
          <span>已办数量: {{ item.completed }}</span>
          <span>剩余代办: {{ item.remaining }}</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500 rounded-full transition-all"
            :style="{ width: item.percentage + '%' }"
          ></div>
        </div>
        <div class="text-right text-xs text-blue-600 mt-1">{{ item.percentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  certificateData: Array
})
</script>