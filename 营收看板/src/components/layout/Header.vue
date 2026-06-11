<template>
  <header class="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-3 flex items-center justify-between shadow-lg">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <span class="text-lg font-bold">企业管理</span>
    </div>
    
    <nav class="flex items-center space-x-1">
      <button 
        v-for="item in navItems" 
        :key="item.name"
        :class="[
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeNav === item.name 
            ? 'bg-blue-400 text-white' 
            : 'hover:bg-blue-600 text-white/80'
        ]"
        @click="handleNavClick(item.name)"
      >
        {{ item.name }}
      </button>
    </nav>
    
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <span class="text-sm">张莉</span>
    </div>
  </header>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['nav-change'])

const activeNav = ref('市场管理')

const navItems = [
  { name: '管理总览' },
  { name: '市场管理' },
  { name: '产运管理' },
  { name: '经济管理' },
  { name: '安全管理' },
  { name: '资金管理' },
  { name: '技术科研管理' }
]

const handleNavClick = (name) => {
  activeNav.value = name
  emit('nav-change', name)
}
</script>