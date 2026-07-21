<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar 
      :current-nav="currentNav" 
      @menu-change="handleMenuChange" 
    />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @nav-change="handleNavChange" />
      <main class="flex-1 overflow-auto p-4">
        <div v-if="currentNav === '管理总览'" class="h-full flex items-center justify-center text-gray-400">
          <div class="text-center">
            <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-lg font-medium">该模块正在开发中</p>
            <p class="text-sm mt-2">{{ currentNav }}功能即将上线</p>
          </div>
        </div>
        
        <RevenueReport
          v-else-if="currentMenu === '营收报表'"
          :current-report="currentSubMenu || 'revenue-summary'"
          :report-filter="navigateFilter"
          @navigate="handleNavigate"
          @menu-change="handleChildMenuChange"
        />
        <SupplyChainReport
          v-else-if="currentMenu === '供应链报表'"
          :current-report="currentSubMenu || 'supplier-contract'"
          :report-filter="navigateFilter"
          @navigate="handleNavigate"
          @menu-change="handleChildMenuChange"
        />
        <MarketReport
          v-else-if="currentMenu === '市场报表'"
          :current-report="currentSubMenu || 'project-tracking'"
          :report-filter="navigateFilter"
          @navigate="handleNavigate"
          @menu-change="handleChildMenuChange"
        />
        <component 
          v-else-if="currentViewComponent"
          :is="currentViewComponent" 
          @drill-down="handleDrillDown"
          @navigate="handleNavigate"
          @menu-change="handleChildMenuChange"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          <div class="text-center">
            <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-lg font-medium">该功能正在开发中</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Dashboard from './views/Dashboard.vue'
import RevenueDashboard from './views/RevenueDashboard.vue'
import SupplyChainDashboard from './views/SupplyChainDashboard.vue'
import TechResearchDashboard from './views/TechResearchDashboard.vue'
import MarketDashboard from './views/MarketDashboard.vue'
import RevenueReport from './views/RevenueReport.vue'
import SupplyChainReport from './views/SupplyChainReport.vue'
import MarketReport from './views/MarketReport.vue'
import EconomyDashboard from './views/EconomyDashboard.vue'
import UnifiedDashboard from './views/UnifiedDashboard.vue'
import SafetyDashboard from './views/SafetyDashboard.vue'
import FinanceReport from './components/fund/FinanceReport.vue'
import ProjectStatusSummary from './components/fund/ProjectStatusSummary.vue'
import BranchReport from './components/fund/BranchReport.vue'
import OutputProjectSummary from './components/fund/OutputProjectSummary.vue'
import SectorBusinessFinanceSummary from './components/fund/SectorBusinessFinanceSummary.vue'

const currentNav = ref('市场管理')
const currentMenu = ref('')
const currentSubMenu = ref('')
const navigateFilter = ref({})

const viewMap = {
  '市场管理看板': markRaw(MarketDashboard),
  '营收管理看板': markRaw(RevenueDashboard),
  '供应链管理看板': markRaw(SupplyChainDashboard),
  '生产看板': markRaw(Dashboard),
  '技术科研看板': markRaw(TechResearchDashboard),
  '经济管理看板': markRaw(EconomyDashboard),
  '产运看板': markRaw(UnifiedDashboard),
  '安全子看板': markRaw(SafetyDashboard),
  '业财统计报表': markRaw(FinanceReport),
  '按项目状态分类汇总表': markRaw(ProjectStatusSummary),
  '按分公司分类报表': markRaw(BranchReport),
  '销项项目汇总': markRaw(OutputProjectSummary),
  '按项目板块汇总表': markRaw(SectorBusinessFinanceSummary)
}

const currentViewComponent = computed(() => {
  return viewMap[currentMenu.value] || null
})

const handleNavChange = (navName) => {
  if (currentNav.value === navName) return
  currentNav.value = navName
  currentMenu.value = ''
  currentSubMenu.value = ''
}

const handleMenuChange = ({ menu, subMenu, key }) => {
  currentMenu.value = menu
  currentSubMenu.value = subMenu || ''
  navigateFilter.value = {}
}

const handleDrillDown = (filter) => {
  console.log('Drill down:', filter)
}

const handleNavigate = (data) => {
  console.log('Navigate to:', data)
  // 保存下钻筛选条件
  if (data && data.filter) {
    navigateFilter.value = typeof data.filter === 'string' ? { unit: data.filter } : data.filter
  } else {
    navigateFilter.value = {}
  }
  if (data && data.view) {
    const menuMap = {
      'revenue': '营收报表',
      'supply-chain': '供应链报表',
      'production': '生产看板',
      'tech': '技术科研看板',
      'market': '市场报表',
      'finance-report': '业财统计报表'
    }
    const targetMenu = menuMap[data.view] || data.view
    if (data.report) {
      currentMenu.value = targetMenu
      currentSubMenu.value = data.report
    } else if (data.filter && data.filter.report) {
      currentMenu.value = targetMenu
      currentSubMenu.value = data.filter.report
    } else {
      currentMenu.value = targetMenu
      currentSubMenu.value = ''
    }
  }
}

const handleChildMenuChange = ({ menu, subMenu }) => {
  currentMenu.value = menu
  currentSubMenu.value = subMenu || ''
}
</script>
