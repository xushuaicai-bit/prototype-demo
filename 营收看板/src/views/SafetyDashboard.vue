<template>
  <div class="h-full relative">
    <template v-if="boardUrl">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white rounded-xl">
        <div class="text-center">
          <div class="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p class="text-gray-500 text-sm">正在加载安全在线管控平台...</p>
        </div>
      </div>
      <iframe
        :src="boardUrl"
        class="w-full h-full border-0 rounded-xl bg-white"
        allowfullscreen
        @load="loading = false"
      />
    </template>
    <div v-else class="absolute inset-0 flex items-center justify-center bg-white rounded-xl">
      <div class="text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 001-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 001 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-800 mb-2">演示环境</h3>
        <p class="text-gray-600">安全看板外部系统未配置</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { externalUrls } from '@/config/externalUrls'

const boardUrl = externalUrls.safetyBoard
const loading = ref(!!boardUrl)
</script>
