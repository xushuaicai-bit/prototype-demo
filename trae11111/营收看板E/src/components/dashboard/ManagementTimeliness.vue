<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
        <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          <span class="text-sm font-bold text-red-600">{{ redAlert }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
          <span class="text-sm font-bold text-orange-600">{{ orangeAlert }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
          <span class="text-sm font-bold text-yellow-600">{{ yellowAlert }}</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2">
      <div 
        v-for="(item, index) in subItems" 
        :key="index"
        class="text-center p-2 bg-gray-50 rounded-lg"
      >
        <div class="text-sm font-medium text-gray-800">{{ item.value }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  redAlert: Number,
  orangeAlert: Number,
  yellowAlert: Number,
  subItems: Array
})
</script>