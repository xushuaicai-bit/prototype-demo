<template>
  <div class="bg-white rounded-xl p-4 shadow-sm h-full flex flex-col">
    <h3 class="text-base font-semibold text-gray-800 mb-4">{{ title }}</h3>
    
    <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
      <div 
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        @click="handleTopCardClick('totalOrders')"
      >
        <div class="text-sm text-gray-500 mb-1">应签订总数</div>
        <div class="text-2xl font-bold text-gray-800">{{ totalOrders }}</div>
      </div>
      <div 
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        @click="handleTopCardClick('signedOrders')"
      >
        <div class="text-sm text-gray-500 mb-1">待签订总数</div>
        <div class="text-2xl font-bold text-gray-800">{{ signedOrders }}</div>
      </div>
      <div 
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        @click="handleTopCardClick('totalSigned')"
      >
        <div class="text-sm text-gray-500 mb-1">已签订总数</div>
        <div class="text-2xl font-bold text-gray-800">{{ totalSigned }}</div>
      </div>
      <div 
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 cursor-pointer hover:bg-yellow-50 transition-colors"
        @click="handleTopCardClick('yellowAlert')"
      >
        <div class="text-sm text-gray-500 mb-1">黄色预警</div>
        <div class="text-2xl font-bold text-yellow-500">{{ yellowAlert }}</div>
      </div>
      <div 
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 cursor-pointer hover:bg-orange-50 transition-colors"
        @click="handleTopCardClick('orangeAlert')"
      >
        <div class="text-sm text-gray-500 mb-1">橙色预警</div>
        <div class="text-2xl font-bold text-orange-500">{{ orangeAlert }}</div>
      </div>
      <div 
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 cursor-pointer hover:bg-red-50 transition-colors"
        @click="handleTopCardClick('redAlert')"
      >
        <div class="text-sm text-gray-500 mb-1">红色预警</div>
        <div class="text-2xl font-bold text-red-500">{{ redAlert }}</div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
      <div v-for="(item, index) in combinedItems" :key="index" class="bg-white flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div 
            class="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
            @click="handleCategoryTitleClick(item.name)"
          >
            {{ item.name }}
          </div>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div class="flex items-center space-x-4 mb-3">
          <div 
            class="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            @click="handleAlertClick(item.name, 'yellow', item.yellow)"
          >
            <span class="w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
            <span class="text-sm text-yellow-600 font-medium">{{ item.yellow }}</span>
          </div>
          <div 
            class="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            @click="handleAlertClick(item.name, 'orange', item.orange)"
          >
            <span class="w-3 h-3 rounded-full bg-orange-400 mr-1"></span>
            <span class="text-sm text-orange-600 font-medium">{{ item.orange }}</span>
          </div>
          <div 
            class="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            @click="handleAlertClick(item.name, 'red', item.red)"
          >
            <span class="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            <span class="text-sm text-red-600 font-medium">{{ item.red }}</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <div 
            :title="'完成率：' + item.circle.percentage + '%'"
            class="relative w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity"
            @click="handleCircleClick(item.name)"
          >
            <svg class="w-24 h-24" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                stroke-width="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                stroke-width="10"
                fill="none"
                stroke-linecap="round"
                :stroke-dasharray="item.circle.percentage * 2.51 + ' 251'"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-base font-bold text-gray-800">{{ item.circle.total }}</span>
              <span class="text-sm text-gray-500">应签订</span>
              <span class="text-sm text-gray-500">总数</span>
            </div>
          </div>
          
          <div class="flex-1 text-sm">
            <div class="text-gray-700 mb-1">
              <span class="text-blue-600 font-medium">●</span> 已签订 
              <span 
                class="ml-1 font-medium text-blue-600 cursor-pointer hover:underline"
                @click="handleSignedClick(item.name)"
              >{{ item.circle.signed }}</span>
            </div>
            <div class="text-gray-500">
              <span class="text-gray-400 font-medium">○</span> 待签订 
              <span 
                class="ml-1 font-medium text-gray-600 cursor-pointer hover:underline"
                @click="handlePendingClick(item.name)"
              >{{ item.circle.pending }}</span>
            </div>
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
  totalOrders: String,
  signedOrders: String,
  totalSigned: String,
  yellowAlert: Number,
  orangeAlert: Number,
  redAlert: Number,
  subItems: Array,
  subCircles: Array,
  currentUnit: {
    type: String,
    default: '全部'
  }
})

const emit = defineEmits(['drill-down'])

const combinedItems = computed(() => {
  return props.subItems.map((item, index) => ({
    ...item,
    circle: props.subCircles[index] || { percentage: 52, signed: 55, pending: 50, total: 105 }
  }))
})

const categoryMap = {
  '专业分包': '专业分包',
  '劳务分包': '劳务分包',
  '周转材料/设备租赁': '周转材料/设备租赁',
  '材料/设备采购': '材料/设备采购'
}

const handleTopCardClick = (cardType) => {
  let filter = {}
  switch (cardType) {
    case 'totalOrders':
      filter = {}
      break
    case 'signedOrders':
      filter = { signStatus: '未签订' }
      break
    case 'totalSigned':
      filter = { signStatus: '已签订' }
      break
    case 'yellowAlert':
      filter = { overdueDays: '21-44' }
      break
    case 'orangeAlert':
      filter = { overdueDays: '45-60' }
      break
    case 'redAlert':
      filter = { overdueDays: '60+' }
      break
  }
  emit('drill-down', filter)
}

const handleCategoryTitleClick = (categoryName) => {
  const category = categoryMap[categoryName]
  if (category) emit('drill-down', { category })
}

const handleAlertClick = (categoryName, alertType, alertValue) => {
  if (alertValue <= 0) return
  const category = categoryMap[categoryName]
  let overdueDays = ''
  switch (alertType) {
    case 'yellow':
      overdueDays = '21-44'
      break
    case 'orange':
      overdueDays = '45-60'
      break
    case 'red':
      overdueDays = '60+'
      break
  }
  emit('drill-down', { category, overdueDays })
}

const handleCircleClick = (categoryName) => {
  const category = categoryMap[categoryName]
  if (category) emit('drill-down', { category })
}

const handleSignedClick = (categoryName) => {
  const category = categoryMap[categoryName]
  if (category) emit('drill-down', { category, signStatus: '已签订' })
}

const handlePendingClick = (categoryName) => {
  const category = categoryMap[categoryName]
  if (category) emit('drill-down', { category, signStatus: '未签订' })
}
</script>
