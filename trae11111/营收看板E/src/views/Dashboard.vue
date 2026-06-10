<template>
  <div class="space-y-4">
    <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white">生产管理看板</h2>
          <p class="text-blue-100 text-sm mt-1">项目统计</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-white">{{ totalProjectCount }}</div>
          <div class="text-blue-100 text-sm">项目总数</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <ProjectStatCard 
        v-for="stat in projectStats" 
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :unit="stat.unit"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ManagementTimeliness 
        :title="managementTimelinessData.title"
        :red-alert="managementTimelinessData.redAlert"
        :orange-alert="managementTimelinessData.orangeAlert"
        :yellow-alert="managementTimelinessData.yellowAlert"
        :sub-items="managementTimelinessData.subItems"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskTimeliness :timeliness-data="riskAlertTimeliness" />
        <WindRiskAlert 
          :title="windRiskAlert.title"
          :red-alert="windRiskAlert.redAlert"
          :orange-alert="windRiskAlert.orangeAlert"
          :yellow-alert="windRiskAlert.yellowAlert"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskTimeliness :timeliness-data="riskAlertTimeliness" />
        <RiskByLevel :risk-data="riskByLevel" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductionProgress 
          :milestone-title="productionProgress.milestone.title"
          :milestone-total="productionProgress.milestone.total"
          :completed-count="productionProgress.completed.count"
          :completed-total="productionProgress.completed.total"
          :alerts="productionProgress.alerts"
        />
        <KeyProjectProgress 
          :milestone-title="keyProjectProgress.milestone.title"
          :milestone-total="keyProjectProgress.milestone.total"
          :completed-count="keyProjectProgress.completed.count"
          :completed-total="keyProjectProgress.completed.total"
          :alerts="keyProjectProgress.alerts"
          :key-project-count="keyProjectProgress.keyProjectCount"
          :unreported-count="keyProjectProgress.unreportedCount"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CertificateProgress :certificate-data="certificateData" />
      <InspectionStatus 
        :total-count="inspectionData.totalCount"
        :completed-count="inspectionData.completedCount"
        :pending-count="inspectionData.pendingCount"
        :red-alerts="inspectionData.redAlerts"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProjectStatCard from '../components/dashboard/ProjectStatCard.vue'
import ManagementTimeliness from '../components/dashboard/ManagementTimeliness.vue'
import RiskTimeliness from '../components/dashboard/RiskTimeliness.vue'
import RiskByLevel from '../components/dashboard/RiskByLevel.vue'
import WindRiskAlert from '../components/dashboard/WindRiskAlert.vue'
import ProductionProgress from '../components/dashboard/ProductionProgress.vue'
import KeyProjectProgress from '../components/dashboard/KeyProjectProgress.vue'
import CertificateProgress from '../components/dashboard/CertificateProgress.vue'
import InspectionStatus from '../components/dashboard/InspectionStatus.vue'
import {
  projectStats,
  managementTimelinessData,
  riskAlertTimeliness,
  riskByLevel,
  windRiskAlert,
  productionProgress,
  keyProjectProgress,
  certificateData,
  inspectionData
} from '../data/mockData.js'

const totalProjectCount = computed(() => {
  return projectStats.reduce((sum, stat) => sum + parseInt(stat.value), 0).toLocaleString()
})
</script>