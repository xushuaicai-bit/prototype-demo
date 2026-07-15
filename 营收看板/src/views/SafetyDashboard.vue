<!-- 安全子看板：单点登录数智施工-安全在线、过程管控模块。 -->
<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center gap-1 bg-blue-600 px-4 py-1.5 rounded-t-xl">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="switchTab(tab.key)"
        :class="[
          'px-4 py-1 text-sm rounded-t transition-colors',
          activeTab === tab.key
            ? 'bg-white text-blue-600 font-semibold'
            : 'text-white hover:bg-blue-500'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="flex-1 bg-white rounded-b-xl overflow-hidden flex items-center justify-center">
      <!-- 安全在线 - 主图 -->
      <div v-if="activeTab === 'online' && view === 'main'" class="relative inline-block">
        <img src="/safe-board.png" alt="安全在线" class="w-full h-auto block" />
        <button
          v-for="btn in enterButtons"
          :key="btn.key"
          @click="view = btn.key"
          class="absolute bg-blue-600/80 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition-colors -translate-x-1/2"
          :style="btn.style"
        >
          进入专版
        </button>
      </div>

      <!-- 安全在线 - 子专版 -->
      <div v-else-if="activeTab === 'online' && view !== 'main'" class="relative inline-block">
        <img :src="subViewImage" :alt="viewLabel" class="w-full h-auto block" />
        <button
          @click="view = 'main'"
          class="absolute top-3 left-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors shadow"
        >
          返回
        </button>
      </div>

      <!-- 过程管控 -->
      <div v-else class="relative inline-block">
        <img src="/safe-daily.png" alt="过程管控" class="w-full h-auto block" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('online')
const view = ref('main')

const tabs = [
  { key: 'online', label: '安全在线' },
  { key: 'process', label: '过程管控' }
]

const enterButtons = [
  { key: 'realname', style: { left: '25%', top: '19%' } },
  { key: 'hazard', style: { left: '50%', top: '19%' } },
  { key: 'video', style: { left: '75%', top: '19%' } }
]

const subViewImage = computed(() => {
  const map = { realname: '/safe-1.png', hazard: '/safe-2.png', video: '/safe-3.png' }
  return map[view.value] || '/safe-board.png'
})

const viewLabel = computed(() => {
  const map = { realname: '实名制', hazard: '隐患排查', video: '视频监控' }
  return map[view.value] || ''
})

const switchTab = (key) => {
  activeTab.value = key
  view.value = 'main'
}
</script>
