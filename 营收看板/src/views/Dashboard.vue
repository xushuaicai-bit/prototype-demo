<template>
  <div class="space-y-3 h-full flex flex-col">
    <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3 shadow-sm flex-shrink-0">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-bold text-white">生产管理看板</h2>
        <div class="text-right cursor-pointer" @click="handleProjectTotalClick">
          <div class="text-2xl font-bold text-white hover:text-yellow-300 transition-colors">{{ totalProjectCount }}</div>
          <div class="text-blue-100 text-xs">项目总数</div>
        </div>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button 
          v-for="item in categoryTabs" 
          :key="item.name"
          :class="[
            'px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap',
            activeCategory === item.name 
              ? 'bg-white text-blue-600 shadow-md' 
              : 'bg-blue-500/50 text-white hover:bg-blue-400'
          ]"
          @click="handleCategoryChange(item.name)"
        >
          {{ item.name }}
          <span v-if="item.count > 0" class="ml-1 opacity-75">({{ item.count }})</span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="grid grid-cols-12 gap-3 h-full">
        <div class="col-span-12 grid grid-cols-5 gap-3">
          <ProjectStatCard 
            v-for="stat in projectStats" 
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
            :unit="stat.unit"
            :drillable="true"
            :link="'https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/prod-project/index'"
          />
        </div>
        
        <div class="col-span-4 cursor-pointer" @click="handleManagementTimelinessClick">
          <ManagementTimeliness 
            :title="managementTimelinessData.title"
            :registration-alerts="managementTimelinessData.registrationAlerts"
            :planning-alerts="managementTimelinessData.planningAlerts"
            :sub-items="managementTimelinessData.subItems"
          />
        </div>
        
        <div class="col-span-4 cursor-pointer" @click="handleRiskTimelinessClick">
          <RiskTimelinessDisplay :timeliness-data="riskAlertTimeliness" :risk-by-level="riskByLevel" />
        </div>
        
        <div class="col-span-4 cursor-pointer" @click="handleProductionRiskClick">
          <ProductionRiskSituation 
            :risk-data="riskByLevel"
            :alerts="windRiskAlert"
          />
        </div>
        
        <div class="col-span-4 cursor-pointer" @click="handleProductionProgressClick">
          <ProductionProgress 
            :milestone-title="productionProgress.milestone.title"
            :milestone-total="productionProgress.milestone.total"
            :completed-count="productionProgress.completed.count"
            :completed-total="productionProgress.completed.total"
            :alerts="productionProgress.alerts"
            :key-project-count="keyProjectProgress.keyProjectCount"
            :unreported-count="keyProjectProgress.unreportedCount"
            :key-project-milestone-title="keyProjectProgress.milestone.title"
            :key-project-milestone-total="keyProjectProgress.milestone.total"
            :key-project-completed-count="keyProjectProgress.completed.count"
            :key-project-completed-total="keyProjectProgress.completed.total"
            :key-project-alerts="keyProjectProgress.alerts"
          />
        </div>
        
        <div class="col-span-4">
          <CertificateProgress :certificate-data="certificateData" />
        </div>
        
        <div class="col-span-4 cursor-pointer" @click="handleInspectionClick">
          <InspectionStatus 
            :total-count="inspectionData.totalCount"
            :completed-count="inspectionData.completedCount"
            :pending-count="inspectionData.pendingCount"
            :red-alerts="inspectionData.redAlerts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProjectStatCard from '../components/dashboard/ProjectStatCard.vue'
import ManagementTimeliness from '../components/dashboard/ManagementTimeliness.vue'
import RiskTimelinessDisplay from '../components/dashboard/RiskTimelinessDisplay.vue'
import ProductionRiskSituation from '../components/dashboard/ProductionRiskSituation.vue'
import ProductionProgress from '../components/dashboard/ProductionProgress.vue'
import CertificateProgress from '../components/dashboard/CertificateProgress.vue'
import InspectionStatus from '../components/dashboard/InspectionStatus.vue'
import {
  projectStats,
  categoryTabs,
  totalProjectCount,
  managementTimelinessData,
  riskAlertTimeliness,
  riskByLevel,
  windRiskAlert,
  productionProgress,
  keyProjectProgress,
  certificateData,
  inspectionData
} from '../data/mockData.js'

const activeCategory = ref(categoryTabs[0].name)

const handleCategoryChange = (name) => {
  activeCategory.value = name
}

const handleProjectTotalClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/prod-project/index', '_blank')
}

const handleManagementTimelinessClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/schedule/milestone', '_blank')
}

const handleRiskTimelinessClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/risk/list', '_blank')
}

const handleProductionRiskClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/risk/list', '_blank')
}

const handleProductionProgressClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/schedule/milestone', '_blank')
}

const handleInspectionClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/quality/inspection/list', '_blank')
}
</script>