<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800">应上报-总包合同筛施工类</h2>
        <button 
          @click="goBack"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          返回
        </button>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-center items-center">
          <img 
            :src="imagePath" 
            alt="应上报-总包合同筛施工类"
            class="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const imagePath = '/src/pict/应上报-总包合同筛施工类'

const goBack = () => {
  window.history.back()
}
</script>