<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">营收汇总表</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：万元</span>
      </div>
      <button 
        class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        @click="exportExcel"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        导出 Excel
      </button>
    </div>

    <div class="flex gap-4 mb-4">
      <div class="flex-1">
        <el-tabs v-model="activeTab" type="card" class="w-full">
          <el-tab-pane label="施工类总营收" name="construction"></el-tab-pane>
          <el-tab-pane label="产品类总营收" name="product"></el-tab-pane>
          <el-tab-pane label="其他业态总营收" name="other"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div v-if="activeTab === 'construction'" class="mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">基层单位：</label>
        <el-select 
          v-model="selectedUnits" 
          multiple 
          placeholder="请选择基层单位" 
          class="w-80"
          collapse-tags
        >
          <el-option 
            v-for="unit in allUnits" 
            :key="unit" 
            :label="unit" 
            :value="unit" 
          />
        </el-select>
        <button 
          v-if="selectedUnits.length > 0" 
          class="ml-2 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          @click="selectedUnits = []"
        >
          清空筛选
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'construction'" class="overflow-x-auto">
      <el-table
        :data="filteredConstructionData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :row-class-name="rowClassName"
        style="width: 100%; min-width: 1600px;"
      >
        <el-table-column
          label="基层单位"
          prop="name"
          fixed="left"
          width="200"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        >
          <template #default="scope">
            <span 
              class="ml-2 cursor-pointer text-blue-600 hover:underline"
              @click="drillDown(scope.row.name)"
            >{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="营收指标 (④)"
          prop="revenueTarget"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.revenueTarget) }}
          </template>
        </el-table-column>

        <el-table-column
          label="指标完成率"
          prop="completionRate"
          width="140"
          align="center"
        >
          <template #default="scope">
            <div class="flex flex-col items-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getRateClass(scope.row.completionRate)"
                  :style="{ width: Math.min(scope.row.completionRate, 100) + '%' }"
                ></div>
              </div>
              <span :class="getRateTextClass(scope.row.completionRate)" class="text-sm">
                {{ scope.row.completionRate.toFixed(2) }}%
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="结转至当年及以后营收" :columns="carryForwardColumns" />

        <el-table-column label="本年度计划营收" :columns="planColumns" />

        <el-table-column label="本年度累计完成营收" :columns="actualColumns" />

        <el-table-column label="上报营收及剩余合同存量" :columns="reportColumns" />
      </el-table>
    </div>

    <div v-if="activeTab === 'product'" class="overflow-x-auto">
      <el-table
        :data="productData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        show-summary
        :summary-method="getProductSummaries"
        style="width: 100%; min-width: 800px;"
      >
        <el-table-column
          label="基层单位"
          prop="name"
          width="150"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />
        <el-table-column
          label="营收指标"
          prop="revenueTarget"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.revenueTarget) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当年计划"
          prop="annualPlan"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualPlan) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当月完成"
          prop="monthlyActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.monthlyActual) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当年完成"
          prop="annualActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualActual) }}
          </template>
        </el-table-column>
        <el-table-column
          label="下月计划"
          prop="nextMonthPlan"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.nextMonthPlan) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="activeTab === 'other'" class="overflow-x-auto">
      <el-table
        :data="otherData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        show-summary
        :summary-method="getOtherSummaries"
        style="width: 100%; min-width: 600px;"
      >
        <el-table-column
          label="业态类型"
          prop="name"
          width="150"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />
        <el-table-column
          label="当月完成"
          prop="monthlyActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.monthlyActual) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当年完成"
          prop="annualActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualActual) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['navigate'])

const activeTab = ref('construction')
const selectedUnits = ref([])

const carryForwardColumns = [
  { label: '结转在建项目', prop: 'carryForwardConstruction', width: 130, align: 'right' },
  { label: '完工待结算项目', prop: 'completedPendingSettlement', width: 130, align: 'right' },
  { label: '结转至当年及以后营收合计', prop: 'carryForwardTotal', width: 160, align: 'right' }
]

const planColumns = [
  { label: '结转在建项目', prop: 'planConstruction', width: 130, align: 'right' },
  { label: '完工待结算项目', prop: 'planCompleted', width: 130, align: 'right' },
  { label: '新接项目', prop: 'planNew', width: 120, align: 'right', className: 'green-border' },
  { label: '本年度计划营收合计', prop: 'planTotal', width: 160, align: 'right' }
]

const actualColumns = [
  { label: '结转在建项目', prop: 'actualConstruction', width: 130, align: 'right' },
  { label: '完工待结算项目', prop: 'actualCompleted', width: 130, align: 'right' },
  { label: '新接项目', prop: 'actualNew', width: 120, align: 'right' },
  { label: '本年度累计完成营收合计', prop: 'actualTotal', width: 160, align: 'right' }
]

const reportColumns = [
  { label: '本年上报股份营收', prop: 'reportedRevenue', width: 140, align: 'right' },
  { label: '新接项目合同额 (去税)', prop: 'newContractAmount', width: 140, align: 'right' },
  { label: '截止本月剩余合同存量', prop: 'remainingContract', width: 140, align: 'right' },
  { label: '本年上报股份营收合计', prop: 'reportTotal', width: 160, align: 'right' }
]

const rawData = [
  {
    id: 1,
    name: '本部',
    revenueTarget: 50000,
    carryForwardConstruction: 10000,
    completedPendingSettlement: 5000,
    planConstruction: 12000,
    planCompleted: 6000,
    planNew: 10000,
    actualConstruction: 11000,
    actualCompleted: 5500,
    actualNew: 9500,
    reportedRevenue: 25000,
    newContractAmount: 15000,
    remainingContract: 30000
  },
  {
    id: 2,
    name: '城水管道',
    hasChildren: true,
    children: [
      {
        id: 21,
        name: '生态环境事业部',
        revenueTarget: 20000,
        carryForwardConstruction: 4000,
        completedPendingSettlement: 2000,
        planConstruction: 5000,
        planCompleted: 2500,
        planNew: 4000,
        actualConstruction: 4500,
        actualCompleted: 2200,
        actualNew: 3800,
        reportedRevenue: 10500,
        newContractAmount: 6000,
        remainingContract: 12000
      },
      {
        id: 22,
        name: '管网运维事业部',
        revenueTarget: 15000,
        carryForwardConstruction: 3000,
        completedPendingSettlement: 1500,
        planConstruction: 3500,
        planCompleted: 1800,
        planNew: 3000,
        actualConstruction: 3200,
        actualCompleted: 1600,
        actualNew: 2800,
        reportedRevenue: 7600,
        newContractAmount: 4500,
        remainingContract: 9000
      },
      {
        id: 23,
        name: '市政事业部',
        revenueTarget: 18000,
        carryForwardConstruction: 3500,
        completedPendingSettlement: 1800,
        planConstruction: 4200,
        planCompleted: 2100,
        planNew: 3500,
        actualConstruction: 3800,
        actualCompleted: 1900,
        actualNew: 3300,
        reportedRevenue: 9000,
        newContractAmount: 5200,
        remainingContract: 10800
      },
      {
        id: 24,
        name: '城建水务管道',
        revenueTarget: 12000,
        carryForwardConstruction: 2500,
        completedPendingSettlement: 1200,
        planConstruction: 2800,
        planCompleted: 1400,
        planNew: 2400,
        actualConstruction: 2600,
        actualCompleted: 1300,
        actualNew: 2200,
        reportedRevenue: 6100,
        newContractAmount: 3600,
        remainingContract: 7200
      },
      {
        id: 25,
        name: '二次养护',
        revenueTarget: 10000,
        carryForwardConstruction: 2000,
        completedPendingSettlement: 1000,
        planConstruction: 2200,
        planCompleted: 1100,
        planNew: 2000,
        actualConstruction: 2100,
        actualCompleted: 1050,
        actualNew: 1900,
        reportedRevenue: 5050,
        newContractAmount: 3000,
        remainingContract: 6000
      },
      {
        id: 26,
        name: '区域事业部',
        revenueTarget: 15000,
        carryForwardConstruction: 3000,
        completedPendingSettlement: 1500,
        planConstruction: 3500,
        planCompleted: 1800,
        planNew: 3000,
        actualConstruction: 3300,
        actualCompleted: 1700,
        actualNew: 2800,
        reportedRevenue: 7800,
        newContractAmount: 4500,
        remainingContract: 9000
      }
    ]
  },
  {
    id: 3,
    name: '水务建设',
    hasChildren: true,
    children: [
      {
        id: 31,
        name: '环境建设分公司',
        revenueTarget: 25000,
        carryForwardConstruction: 5000,
        completedPendingSettlement: 2500,
        planConstruction: 6000,
        planCompleted: 3000,
        planNew: 5000,
        actualConstruction: 5500,
        actualCompleted: 2700,
        actualNew: 4600,
        reportedRevenue: 12800,
        newContractAmount: 7500,
        remainingContract: 15000
      },
      {
        id: 32,
        name: '区域发展事业部',
        revenueTarget: 18000,
        carryForwardConstruction: 3500,
        completedPendingSettlement: 1800,
        planConstruction: 4200,
        planCompleted: 2100,
        planNew: 3500,
        actualConstruction: 3900,
        actualCompleted: 1900,
        actualNew: 3200,
        reportedRevenue: 9000,
        newContractAmount: 5400,
        remainingContract: 10800
      },
      {
        id: 33,
        name: '运营养护分公司',
        revenueTarget: 12000,
        carryForwardConstruction: 2500,
        completedPendingSettlement: 1200,
        planConstruction: 2800,
        planCompleted: 1400,
        planNew: 2400,
        actualConstruction: 2600,
        actualCompleted: 1300,
        actualNew: 2200,
        reportedRevenue: 6100,
        newContractAmount: 3600,
        remainingContract: 7200
      },
      {
        id: 34,
        name: '水务建设管道',
        revenueTarget: 15000,
        carryForwardConstruction: 3000,
        completedPendingSettlement: 1500,
        planConstruction: 3500,
        planCompleted: 1800,
        planNew: 3000,
        actualConstruction: 3200,
        actualCompleted: 1700,
        actualNew: 2800,
        reportedRevenue: 7700,
        newContractAmount: 4500,
        remainingContract: 9000
      }
    ]
  }
]

const allUnits = [
  '本部', '生态环境事业部', '管网运维事业部', '市政事业部', '城建水务管道', 
  '二次养护', '区域事业部', '环境建设分公司', '区域发展事业部', 
  '运营养护分公司', '水务建设管道'
]

const productData = [
  {
    id: 1,
    name: '水表厂',
    revenueTarget: 8000,
    annualPlan: 8000,
    monthlyActual: 650,
    annualActual: 5200,
    nextMonthPlan: 700
  },
  {
    id: 2,
    name: '设备成套',
    revenueTarget: 5000,
    annualPlan: 5000,
    monthlyActual: 420,
    annualActual: 3360,
    nextMonthPlan: 450
  }
]

const otherData = [
  {
    id: 1,
    name: '资管类',
    monthlyActual: 150,
    annualActual: 1800
  },
  {
    id: 2,
    name: '利息等',
    monthlyActual: 80,
    annualActual: 960
  }
]

const calculateDerivedFields = (data) => {
  return data.map(item => {
    let result = { ...item }
    
    result.carryForwardTotal = item.carryForwardConstruction + item.completedPendingSettlement
    result.planTotal = item.planConstruction + item.planCompleted + item.planNew
    result.actualTotal = item.actualConstruction + item.actualCompleted + item.actualNew
    result.reportTotal = item.reportedRevenue + item.newContractAmount + item.remainingContract
    
    if (item.revenueTarget > 0) {
      result.completionRate = (result.actualTotal / item.revenueTarget) * 100
    } else {
      result.completionRate = 0
    }
    
    if (item.children) {
      result.children = calculateDerivedFields(item.children)
    }
    
    return result
  })
}

const filterDataByUnits = (data, units) => {
  if (units.length === 0) return data
  
  return data.map(item => {
    if (units.includes(item.name)) {
      return item
    }
    if (item.children) {
      const filteredChildren = item.children.filter(child => units.includes(child.name))
      if (filteredChildren.length > 0) {
        return { ...item, children: calculateDerivedFields(filteredChildren) }
      }
    }
    return null
  }).filter(item => item !== null)
}

const calculateTotalsForFiltered = (data) => {
  const allItems = []
  
  const collectItems = (data) => {
    data.forEach(item => {
      if (!item.children) {
        allItems.push(item)
      }
      if (item.children) {
        collectItems(item.children)
      }
    })
  }
  
  collectItems(data)
  
  const totals = {
    id: 999,
    name: '合计',
    revenueTarget: 0,
    carryForwardConstruction: 0,
    completedPendingSettlement: 0,
    carryForwardTotal: 0,
    planConstruction: 0,
    planCompleted: 0,
    planNew: 0,
    planTotal: 0,
    actualConstruction: 0,
    actualCompleted: 0,
    actualNew: 0,
    actualTotal: 0,
    reportedRevenue: 0,
    newContractAmount: 0,
    remainingContract: 0,
    reportTotal: 0,
    completionRate: 0
  }
  
  allItems.forEach(item => {
    totals.revenueTarget += item.revenueTarget
    totals.carryForwardConstruction += item.carryForwardConstruction
    totals.completedPendingSettlement += item.completedPendingSettlement
    totals.carryForwardTotal += item.carryForwardTotal
    totals.planConstruction += item.planConstruction
    totals.planCompleted += item.planCompleted
    totals.planNew += item.planNew
    totals.planTotal += item.planTotal
    totals.actualConstruction += item.actualConstruction
    totals.actualCompleted += item.actualCompleted
    totals.actualNew += item.actualNew
    totals.actualTotal += item.actualTotal
    totals.reportedRevenue += item.reportedRevenue
    totals.newContractAmount += item.newContractAmount
    totals.remainingContract += item.remainingContract
    totals.reportTotal += item.reportTotal
  })
  
  if (totals.revenueTarget > 0) {
    totals.completionRate = (totals.actualTotal / totals.revenueTarget) * 100
  }
  
  return totals
}

const filteredConstructionData = computed(() => {
  const calculated = calculateDerivedFields(rawData)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  return [...filtered, calculateTotalsForFiltered(filtered)]
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const getRateClass = (rate) => {
  if (rate >= 100) return 'bg-green-500'
  if (rate >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getRateTextClass = (rate) => {
  if (rate >= 100) return 'text-green-600 font-medium'
  if (rate >= 50) return 'text-yellow-600'
  return 'text-red-600 font-medium'
}

const rowClassName = ({ row }) => {
  if (row.name === '合计') {
    return 'font-bold bg-gray-50'
  }
  return ''
}

const getProductSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    
    const prop = column.prop
    if (!prop) {
      sums[index] = ''
      return
    }
    
    const values = data.map(item => {
      const value = parseFloat(item[prop])
      return isNaN(value) ? 0 : value
    })
    
    if (values.length > 0) {
      sums[index] = values.reduce((prev, curr) => prev + curr, 0).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    } else {
      sums[index] = '0.00'
    }
  })
  return sums
}

const getOtherSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    
    const prop = column.prop
    if (!prop) {
      sums[index] = ''
      return
    }
    
    const values = data.map(item => {
      const value = parseFloat(item[prop])
      return isNaN(value) ? 0 : value
    })
    
    if (values.length > 0) {
      sums[index] = values.reduce((prev, curr) => prev + curr, 0).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    } else {
      sums[index] = '0.00'
    }
  })
  return sums
}

const drillDown = (unitName) => {
  emit('navigate', { view: 'revenue', report: 'revenue-detail', filter: { unit: unitName } })
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>

<style scoped>
.green-border {
  border: 2px solid #52c41a;
}
</style>