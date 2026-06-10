<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <h3 class="text-base font-semibold text-gray-800 mb-3">{{ title }}</h3>
    
    <div class="flex items-center space-x-6 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-800">{{ totalOrders }}</div>
        <div class="text-sm text-gray-500">应签订总数</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-800">{{ signedOrders }}</div>
        <div class="text-sm text-gray-500">待签订总数</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-800">{{ totalSigned }}</div>
        <div class="text-sm text-gray-500">已签订总数</div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
          <span class="text-sm text-gray-600">{{ yellowAlert }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
          <span class="text-sm text-gray-600">{{ orangeAlert }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          <span class="text-sm text-gray-600">{{ redAlert }}</span>
        </div>
      </div>
    </div>
    
    <div class="space-y-2 mb-4">
      <div v-for="(item, index) in subItems" :key="index" class="flex items-center justify-between text-sm">
        <span class="text-gray-600">{{ item.name }}</span>
        <div class="flex items-center space-x-3">
          <span v-if="item.yellow > 0" class="text-yellow-500">{{ item.yellow }}</span>
          <span v-else class="text-gray-300">0</span>
          <span v-if="item.orange > 0" class="text-orange-500">{{ item.orange }}</span>
          <span v-else class="text-gray-300">0</span>
          <span v-if="item.red > 0" class="text-red-500">{{ item.red }}</span>
          <span v-else class="text-gray-300">0</span>
        </div>
      </div>
    </div>
    
    <div class="flex justify-between">
      <div v-for="(circle, index) in subCircles" :key="index" class="text-center">
        <div class="relative w-20 h-20 mx-auto mb-1">
          <svg class="w-20 h-20" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              stroke-width="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              :stroke="getColor(circle.color)"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="`${circle.percentage * 2.51} 251`"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xs font-semibold text-gray-800">{{ circle.percentage }}%</span>
          </div>
        </div>
        <div class="text-xs text-gray-600">{{ circle.title }}</div>
        <div class="text-xs text-gray-500">已签订 {{ circle.signed }}/{{ circle.total }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  totalOrders: String,
  signedOrders: String,
  totalSigned: String,
  yellowAlert: Number,
  orangeAlert: Number,
  redAlert: Number,
  subItems: Array,
  subCircles: Array
})

const getColor = (color) => {
  const colors = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    cyan: '#06b6d4'
  }
  return colors[color] || '#3b82f6'
}
</script>
