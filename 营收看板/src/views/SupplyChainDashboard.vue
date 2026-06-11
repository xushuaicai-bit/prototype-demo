<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">供应链管理看板</h2>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in filterTabs"
          :key="item.name"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedFilter === item.name
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="handleFilterChange(item.name)"
        >
          {{ item.name }}
          <span v-if="item.count > 0" class="ml-1 opacity-75">({{ item.count }})</span>
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 flex flex-col">
        <SupplyChainTimeliness
          :title="timelinessData.title"
          :total-orders="timelinessData.totalOrders"
          :signed-orders="timelinessData.signedOrders"
          :total-signed="timelinessData.totalSigned"
          :yellow-alert="timelinessData.yellowAlert"
          :orange-alert="timelinessData.orangeAlert"
          :red-alert="timelinessData.redAlert"
          :sub-items="timelinessData.subItems"
          :sub-circles="timelinessData.subCircles"
          :current-unit="selectedFilter"
          @drill-down="handleDrillDown"
        />
      </div>
      <div class="lg:col-span-1 flex flex-col">
        <SupplyContractChart
          :title="contractChartData.title"
          :sub-title="contractChartData.subTitle"
          :categories="contractChartData.categories"
          :series="contractChartData.series"
          :warning-data="contractChartData.warningData"
          :current-unit="selectedFilter"
          @drill-down="handleDrillDown"
          @category-change="handleCategoryChange"
        />
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 flex flex-col">
        <div class="bg-white rounded-xl p-4 shadow-sm flex flex-col h-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <SupplierStatChart
              :title="supplierStat1Data.title"
              :sub-title="supplierStat1Data.subTitle"
              :categories="supplierStat1Data.categories"
              :series="supplierStat1Data.series"
              :current-unit="selectedFilter"
              @drill-down="handleSupplierStatDrill"
            />
            <SupplierStatChart
              :title="supplierStat2Data.title"
              :sub-title="supplierStat2Data.subTitle"
              :categories="supplierStat2Data.categories"
              :series="supplierStat2Data.series"
              :top-line="supplierStat2Data.topLine"
              @drill-down="handleSupplierStatDrill"
            />
          </div>
        </div>
      </div>
      <div class="lg:col-span-1 flex flex-col">
        <MaterialProcurementChart
          :title="procurementData.title"
          :categories="procurementData.categories"
          :series="procurementData.series"
          :category-options="procurementData.categoryOptions"
          :current-unit="selectedFilter"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SupplyChainTimeliness from '../components/dashboard/SupplyChainTimeliness.vue'
import SupplyContractChart from '../components/dashboard/SupplyContractChart.vue'
import SupplierStatChart from '../components/dashboard/SupplierStatChart.vue'
import MaterialProcurementChart from '../components/dashboard/MaterialProcurementChart.vue'
import {
  supplyChainTimelinessData,
  supplyContractChartData,
  supplierStatChart1Data,
  supplierStatChart2Data,
  materialProcurementData,
  totalProjectCount
} from '../data/mockData.js'

const emit = defineEmits(['drill-down', 'navigate'])

const selectedFilter = ref('全部')

const filterTabs = ref([
  { name: '全部', count: totalProjectCount },
  { name: '管网事业部', count: 24 },
  { name: '生态事业部', count: 18 },
  { name: '区域事业部', count: 22 },
  { name: '市政事业部', count: 16 },
  { name: '环境建设', count: 15 },
  { name: '管道工程', count: 19 },
  { name: '管道分公司', count: 21 },
  { name: '运营养护', count: 17 },
  { name: '二次养护', count: 20 }
])

const timelinessData = computed(() => {
  if (selectedFilter.value === '全部') {
    return supplyChainTimelinessData
  }
  return {
    ...supplyChainTimelinessData,
    totalOrders: Math.floor(supplyChainTimelinessData.totalOrders / 9),
    signedOrders: Math.floor(supplyChainTimelinessData.signedOrders / 9),
    totalSigned: Math.floor(supplyChainTimelinessData.totalSigned / 9),
    yellowAlert: Math.floor(supplyChainTimelinessData.yellowAlert / 3),
    orangeAlert: Math.floor(supplyChainTimelinessData.orangeAlert / 3),
    redAlert: Math.floor(supplyChainTimelinessData.redAlert / 3),
    subItems: supplyChainTimelinessData.subItems.map(item => ({
      ...item,
      yellow: Math.floor(item.yellow / 3),
      orange: Math.floor(item.orange / 3) || 0,
      red: Math.floor(item.red / 3) || 0
    })),
    subCircles: supplyChainTimelinessData.subCircles.map(circle => ({
      ...circle,
      signed: Math.floor(circle.signed / 9),
      pending: Math.floor(circle.pending / 9),
      total: Math.floor(circle.total / 9)
    }))
  }
})

const contractChartData = supplyContractChartData
const supplierStat1Data = supplierStatChart1Data
const supplierStat2Data = supplierStatChart2Data
const procurementData = materialProcurementData

const handleFilterChange = (name) => {
  selectedFilter.value = name
  sessionStorage.setItem('supplyChainFilter', name)
}

const handleDrillDown = (filter) => {
  emit('navigate', { 
    view: 'supply-chain', 
    report: 'supplier-contract', 
    filter: { ...filter, unit: selectedFilter.value } 
  })
}

const handleCategoryChange = (category) => {
  console.log('Category changed to:', category)
}

const handleSupplierStatDrill = (drillData) => {
  if (drillData.type === 'a-level') {
    const filter = { supplierLevel: 'A', unit: selectedFilter.value }
    if (drillData.contractCategory && drillData.contractCategory !== '全部') {
      filter.category = drillData.contractCategory
    }
    emit('navigate', { 
      view: 'supply-chain', 
      report: 'supplier-detail', 
      filter 
    })
  } else if (drillData.type === 'contract-count') {
    emit('navigate', { 
      view: 'supply-chain', 
      report: 'supplier-contract', 
      filter: { 
        contractStatus: '正常履约', 
        category: drillData.category,
        unit: selectedFilter.value 
      } 
    })
  } else if (drillData.type === 'top10-supplier') {
    const filter = { supplierName: drillData.supplierName, unit: selectedFilter.value }
    if (drillData.contractCategory && drillData.contractCategory !== '全部') {
      filter.category = drillData.contractCategory
    }
    emit('navigate', { 
      view: 'supply-chain', 
      report: 'supplier-detail', 
      filter 
    })
  }
}
</script>