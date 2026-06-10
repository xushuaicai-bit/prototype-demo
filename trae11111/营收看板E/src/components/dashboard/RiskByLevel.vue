<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">生产风险情况（按等级）</h3>
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-500">仅统计年度风险管控清单</span>
        <input type="checkbox" id="showAll" class="w-4 h-4" />
        <label for="showAll" class="text-xs text-gray-500">显示全部</label>
      </div>
    </div>
    <div class="space-y-3">
      <div 
        v-for="item in riskData" 
        :key="item.level"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center">
          <span :class="['w-3 h-3 rounded-full mr-2', levelColor(item.level)]"></span>
          <span class="text-sm font-medium text-gray-800">{{ item.level }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm">
            <span class="font-bold text-gray-800">{{ item.count }}</span>
            <span class="text-gray-500 ml-1">个</span>
          </span>
          <span v-if="item.completed > 0" class="text-sm text-green-600">
            <span class="font-bold">{{ item.completed }}</span>
            <span class="ml-1">已完成</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  riskData: Array
})

const levelColor = (level) => {
  const colors = {
    'I级风险': 'bg-red-500',
    'II级风险': 'bg-orange-500',
    'III级风险': 'bg-yellow-500'
  }
  return colors[level] || 'bg-gray-500'
}
</script>