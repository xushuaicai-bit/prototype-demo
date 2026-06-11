<template>
  <div class="space-y-4">
    <SupplierContractReport 
      v-if="currentReport === 'supplier-contract'" 
    />
    <SupplierDetailReport 
      v-else-if="currentReport === 'supplier-detail'" 
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import SupplierContractReport from '../components/supply-chain/SupplierContractReport.vue'
import SupplierDetailReport from '../components/supply-chain/SupplierDetailReport.vue'

defineProps({
  currentReport: {
    type: String,
    default: 'supplier-contract'
  },
  reportFilter: {
    type: Object,
    default: () => ({})
  }
})
</script>