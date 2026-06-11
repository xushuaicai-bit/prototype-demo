<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center mb-4">
      <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
      <h3 class="text-base font-semibold text-gray-800">风险预警及时性</h3>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div 
        v-for="(item, index) in timelinessData" 
        :key="index"
        class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
      >
        <span class="text-xs text-gray-600">{{ item.title }}</span>
        <span class="text-sm font-bold text-gray-800">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  timelinessData: Array
})
</script>