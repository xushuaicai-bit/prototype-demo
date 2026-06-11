<template>
  <div class="space-y-4">
    <ProjectTrackingReport 
      v-if="currentReport === 'project-tracking'" 
    />
    <KeyProjectListReport 
      v-else-if="currentReport === 'key-project-list'" 
    />
    <BidSummaryReport 
      v-else-if="currentReport === 'bid-summary'" 
    />
    <WinningBidReport 
      v-else-if="currentReport === 'winning-bid'" 
    />
    <InBidReport 
      v-else-if="currentReport === 'in-bid'" 
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ProjectTrackingReport from '../components/market/ProjectTrackingReport.vue'
import KeyProjectListReport from '../components/market/KeyProjectListReport.vue'
import BidSummaryReport from '../components/market/BidSummaryReport.vue'
import WinningBidReport from '../components/market/WinningBidReport.vue'
import InBidReport from '../components/market/InBidReport.vue'

defineProps({
  currentReport: {
    type: String,
    default: 'project-tracking'
  },
  reportFilter: {
    type: Object,
    default: () => ({})
  }
})
</script>
