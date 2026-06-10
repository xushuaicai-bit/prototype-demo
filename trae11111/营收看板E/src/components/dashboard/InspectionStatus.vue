<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">巡检情况</h3>
      <span class="text-xs text-gray-400">2025-02-26 01</span>
    </div>
    
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ totalCount }}</div>
        <div class="text-xs text-gray-500 mt-1">巡检总数</div>
      </div>
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
        <div class="text-xs text-gray-500 mt-1">整改完成数</div>
      </div>
      <div class="text-center p-3 bg-red-50 rounded-lg">
        <div class="text-2xl font-bold text-red-600">{{ pendingCount }}</div>
        <div class="text-xs text-gray-500 mt-1">未整改数</div>
      </div>
    </div>
    
    <div class="grid grid-cols-3 gap-2">
      <div 
        v-for="(alert, index) in redAlerts" 
        :key="index"
        class="text-center p-2 bg-red-50 rounded-lg"
      >
        <div class="text-lg font-bold text-red-600">{{ alert }}</div>
        <div class="text-xs text-gray-500">红色预警</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalCount: Number,
  completedCount: Number,
  pendingCount: Number,
  redAlerts: Array
})
</script>