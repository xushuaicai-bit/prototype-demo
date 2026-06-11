<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-semibold text-gray-800">风险开工令预警</h3>
      <span class="text-xs text-gray-400">2025-02-26 01</span>
    </div>
    <div class="flex items-center justify-around">
      <div class="text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
          <span class="text-xl font-bold text-red-600">{{ redAlert }}</span>
        </div>
        <div class="text-xs text-gray-500">红色预警</div>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
          <span class="text-xl font-bold text-orange-600">{{ orangeAlert }}</span>
        </div>
        <div class="text-xs text-gray-500">橙色预警</div>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
          <span class="text-xl font-bold text-yellow-600">{{ yellowAlert }}</span>
        </div>
        <div class="text-xs text-gray-500">黄色预警</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  redAlert: Number,
  orangeAlert: Number,
  yellowAlert: Number
})
</script>