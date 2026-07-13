<template>
  <div class="h-full flex flex-col">
    <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">经济管理看板</h2>
      </div>
    </div>
    
    <div class="flex-1 bg-white rounded-xl shadow-sm overflow-hidden relative" style="min-height: calc(100vh - 200px);">
      <iframe
        v-if="iframeUrl"
        ref="iframeRef"
        :src="iframeUrl"
        class="w-full border-0"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
        allowfullscreen
        @load="onIframeLoad"
      ></iframe>

      <div v-if="!iframeUrl" class="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
        <div class="text-center p-8">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 001-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 001 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-800">跳转至环境项管系统对应模块</h3>
        </div>
      </div>

      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p class="text-gray-600">正在加载经济管理数据...</p>
        </div>
      </div>
      
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
        <div class="text-center p-8">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-800 mb-2">加载失败</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="reloadIframe"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { externalUrls } from '@/config/externalUrls'

const iframeRef = ref(null)
const iframeUrl = externalUrls.economyDashboard
const loading = ref(!!iframeUrl)
const error = ref('')

const onIframeLoad = () => {
  loading.value = false
  error.value = ''
}

const reloadIframe = () => {
  loading.value = true
  error.value = ''
  if (iframeRef.value) {
    iframeRef.value.src = iframeUrl
  }
}

onMounted(() => {
  setTimeout(() => {
    if (loading.value) {
      error.value = '加载超时，请检查网络连接或稍后重试'
      loading.value = false
    }
  }, 30000)
})
</script>
