<template>
  <div class="space-y-4">
    <RevenueSummary
      v-if="currentReport === 'revenue-summary'"
      :initial-filter="reportFilter"
      @navigate="$emit('navigate', $event)"
    />
    <RevenueDetail 
      v-else-if="currentReport === 'revenue-detail'" 
      :initial-filter="reportFilter"
    />
    <RevenueDeviation v-else-if="currentReport === 'revenue-deviation'" />
    <RevenueSummary
      v-else
      :initial-filter="reportFilter"
      @navigate="$emit('navigate', $event)"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import RevenueSummary from '../components/revenue/RevenueSummary.vue'
import RevenueDetail from '../components/revenue/RevenueDetail.vue'
import RevenueDeviation from '../components/revenue/RevenueDeviation.vue'

const props = defineProps({
  currentReport: {
    type: String,
    default: 'revenue-summary'
  },
  reportFilter: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['navigate'])
</script>