<template>
  <div class="flex space-x-1">
    <button 
      v-for="item in tabs" 
      :key="item.name"
      :class="[
        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
        item.active 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-50'
      ]"
      @click="$emit('change', item.name)"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  }
})

defineEmits(['change'])
</script>
