<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <h3 class="text-base font-semibold text-gray-800 mb-3">{{ title }}</h3>
    <div class="flex items-center justify-between">
      <div v-if="value1 && value2" class="flex space-x-4">
        <div>
          <span class="text-sm text-gray-500">{{ subtitle1 }}</span>
          <span class="text-3xl font-bold text-blue-600">{{ value1 }}</span>
          <span class="text-gray-500">{{ unit }}</span>
        </div>
        <div>
          <span class="text-sm text-gray-500">{{ subtitle2 }}</span>
          <span class="text-3xl font-bold text-green-600">{{ value2 }}</span>
          <span class="text-gray-500">{{ unit }}</span>
        </div>
      </div>
      <div v-else class="flex flex-col">
        <div>
          <span class="text-3xl font-bold text-gray-800">{{ value }}</span>
          <span class="text-gray-500">{{ unit }}</span>
        </div>
        <div class="flex space-x-4 mt-2">
          <span class="text-sm text-gray-500">{{ detail1 }}</span>
          <span class="text-sm text-gray-500">{{ detail2 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value1: String,
  value2: String,
  subtitle1: String,
  subtitle2: String,
  value: String,
  unit: String,
  detail1: String,
  detail2: String,
  color: String
})
</script>
