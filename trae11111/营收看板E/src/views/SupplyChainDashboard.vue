<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center mb-4">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">供应链管理看板</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white shadow-md">
          供应链管理
        </button>
        <div class="flex items-center ml-auto">
          <span class="text-sm text-gray-500 mr-2">公司:</span>
          <select class="border rounded px-2 py-1 text-sm">
            <option>城乡水务</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SupplyChainStatCard
        v-for="card in statCards"
        :key="card.title"
        v-bind="card"
      />
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
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
        />
      </div>
      <div>
        <SupplyContractChart
          :title="contractChartData.title"
          :sub-title="contractChartData.subTitle"
          :categories="contractChartData.categories"
          :series="contractChartData.series"
        />
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SupplierStatChart
        :title="supplierStat1Data.title"
        :sub-title="supplierStat1Data.subTitle"
        :categories="supplierStat1Data.categories"
        :series="supplierStat1Data.series"
      />
      <SupplierStatChart
        :title="supplierStat2Data.title"
        :sub-title="supplierStat2Data.subTitle"
        :categories="supplierStat2Data.categories"
        :series="supplierStat2Data.series"
        :top-line="supplierStat2Data.topLine"
      />
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="lg:col-span-1">
        <MaterialProcurementChart
          :title="procurementData.title"
          :categories="procurementData.categories"
          :series="procurementData.series"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SupplyChainStatCard from '../components/dashboard/SupplyChainStatCard.vue'
import SupplyChainTimeliness from '../components/dashboard/SupplyChainTimeliness.vue'
import SupplyContractChart from '../components/dashboard/SupplyContractChart.vue'
import SupplierStatChart from '../components/dashboard/SupplierStatChart.vue'
import MaterialProcurementChart from '../components/dashboard/MaterialProcurementChart.vue'
import {
  supplyChainStatCards,
  supplyChainTimelinessData,
  supplyContractChartData,
  supplierStatChart1Data,
  supplierStatChart2Data,
  materialProcurementData
} from '../data/mockData.js'

const statCards = supplyChainStatCards
const timelinessData = supplyChainTimelinessData
const contractChartData = supplyContractChartData
const supplierStat1Data = supplierStatChart1Data
const supplierStat2Data = supplierStatChart2Data
const procurementData = materialProcurementData
</script>
