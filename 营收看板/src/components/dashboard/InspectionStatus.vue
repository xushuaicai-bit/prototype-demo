<template>
  <div class="bg-white rounded-xl p-4 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">巡检情况</h3>
      <span class="text-xs text-gray-400">2025-02-26 01</span>
    </div>
    
    <!-- 两行标签：等高、等宽、铺满剩余空间 -->
    <div class="flex-1 flex flex-col justify-center gap-4">
      <div class="grid grid-cols-3 gap-3 flex-1 items-stretch">
        <div class="text-center p-3 bg-gray-50 rounded-lg flex flex-col justify-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalCount }}</div>
          <div class="text-xs text-gray-500 mt-1">巡检总数</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg flex flex-col justify-center">
          <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
          <div class="text-xs text-gray-500 mt-1">整改完成数</div>
        </div>
        <div class="text-center p-3 bg-red-50 rounded-lg flex flex-col justify-center">
          <div class="text-2xl font-bold text-red-600">{{ pendingCount }}</div>
          <div class="text-xs text-gray-500 mt-1">未整改数</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 flex-1 items-stretch">
        <!-- 开单红色预警 -->
        <div class="text-center p-2 bg-red-50 rounded-lg flex flex-col justify-center">
          <div class="text-lg font-bold text-red-600">{{ redAlerts[0] }}</div>
          <div class="text-xs text-gray-500">开单红色预警</div>
        </div>
        <!-- 开单橙色预警 -->
        <div class="text-center p-2 bg-orange-50 rounded-lg flex flex-col justify-center">
          <div class="text-lg font-bold text-orange-600">{{ redAlerts[1] }}</div>
          <div class="text-xs text-gray-500">开单橙色预警</div>
        </div>
        <!-- 开单黄色预警 -->
        <div class="text-center p-2 bg-yellow-50 rounded-lg flex flex-col justify-center">
          <div class="text-lg font-bold text-yellow-600">{{ redAlerts[2] }}</div>
          <div class="text-xs text-gray-500">开单黄色预警</div>
        </div>
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