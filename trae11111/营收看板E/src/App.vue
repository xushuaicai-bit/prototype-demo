<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar @menu-change="handleMenuChange" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @nav-change="handleNavChange" />
      <main class="flex-1 overflow-auto p-4">
        <SupplyChainDashboard v-if="currentView === 'supply-chain'" />
        <ProductionDashboard v-else-if="currentView === 'production'" />
        <RevenueDashboard v-else-if="currentView === 'revenue-dashboard'" />
        <MarketDashboard v-else-if="currentView === 'market'" />
        <RevenueReport 
          v-else-if="currentView === 'revenue'" 
          :current-report="currentReport" 
          :report-filter="reportFilter"
          @navigate="handleReportNavigate"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Dashboard from './views/Dashboard.vue'
import RevenueReport from './views/RevenueReport.vue'
import MarketDashboard from './views/MarketDashboard.vue'
import RevenueDashboard from './views/RevenueDashboard.vue'
import SupplyChainDashboard from './views/SupplyChainDashboard.vue'
import ProductionDashboard from './views/ProductionDashboard.vue'

const currentView = ref('supply-chain')
const currentReport = ref('revenue-summary')
const reportFilter = ref({})

const handleMenuChange = ({ menu, subMenu }) => {
  if (menu === '供应链管理看板') {
    currentView.value = 'supply-chain'
  } else if (menu === '生产看板') {
    currentView.value = 'production'
  } else if (menu === '营收管理看板') {
    currentView.value = 'revenue-dashboard'
  } else if (menu === '营收报表' && subMenu) {
    currentView.value = 'revenue'
    currentReport.value = subMenu
    reportFilter.value = {}
  } else if (menu === '市场管理看板') {
    currentView.value = 'market'
  } else {
    currentView.value = 'supply-chain'
  }
}

const handleNavChange = (navName) => {
  if (navName === '市场管理') {
    currentView.value = 'market'
  } else if (navName === '产运管理') {
    currentView.value = 'revenue-dashboard'
  }
}

const handleReportNavigate = ({ view, report, filter }) => {
  if (view === 'revenue') {
    currentView.value = 'revenue'
    currentReport.value = report
    reportFilter.value = filter || {}
  }
}
</script>
