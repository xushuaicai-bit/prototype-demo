<template>
  <div class="branch-report">
    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="基层单位：">
          <el-select v-model="searchForm.basicUnit" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option v-for="unit in basicUnitOptions" :key="unit.value" :label="unit.label" :value="unit.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型：">
          <el-select v-model="searchForm.projectType" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option v-for="type in projectTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleExport" type="warning">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <div class="table-scroll-wrapper">
        <el-table
          :data="paginatedData"
          border
          stripe
          :height="tableHeight"
          class="branch-table"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column prop="basicUnit" label="基层单位" width="120" />
          <el-table-column prop="projectType" label="项目类型" width="140" />
          <el-table-column prop="projectCount" label="项目数量" width="100" align="right" />
          <el-table-column prop="contractPrice" label="合同价/审定价" width="140" align="right" />
          <el-table-column prop="internalNotReportedRevenue" label="已报内部未上报集团营收" width="160" align="right" />
          <el-table-column prop="internalNotReportedGrossProfit" label="已报内部未上报集团毛利" width="160" align="right" />
          <el-table-column prop="carryForwardRevenue2027" label="结转至2027年及以后内部营收" width="180" align="right" />
          <el-table-column prop="completedRevenue2026" label="2026年完成总包营收（内部）" width="160" align="right" />
          <el-table-column prop="reportedRevenue2026" label="2026年上报集团营收" width="140" align="right" />
          <el-table-column prop="remainingPlan2026" label="2026年剩余计划" width="120" align="right" />
          <el-table-column prop="realizedProfit2026" label="2026年内部营收实现利润" width="160" align="right" />
          <el-table-column prop="reportedGrossProfit2026" label="2026年上报集团毛利" width="140" align="right" />
          <el-table-column prop="reportedProjects" label="上报项目" width="100" align="right" />
          <el-table-column prop="averageProfitMargin" label="平均利润率" width="100" align="right" />
          <el-table-column prop="remainingPlanGrossProfit2026" label="2026年剩余计划毛利" width="140" align="right" />
          <el-table-column prop="bookedCost" label="项目已入账成本" width="120" align="right" />
          <el-table-column prop="carriedCost" label="项目已结转成本" width="120" align="right" />
          <el-table-column prop="projectInventory" label="项目存货" width="100" align="right" />
          <el-table-column prop="invoicedAmount" label="项目已开票（含税）" width="140" align="right" />
          <el-table-column prop="receivedAmount" label="项目已收款（含税）" width="140" align="right" />
          <el-table-column prop="unreceivedAmount" label="未收款（含税）" width="120" align="right" />
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="displayData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const basicUnitOptions = [
  { value: '城水管道', label: '城水管道' },
  { value: '设备安装', label: '设备安装' },
  { value: '二次养护', label: '二次养护' },
  { value: '市政事业部', label: '市政事业部' },
  { value: '水建管道', label: '水建管道' },
  { value: '运营养护', label: '运营养护' },
  { value: '环境建设', label: '环境建设' },
  { value: '区域发展', label: '区域发展' }
]

const projectTypeOptions = [
  { value: 'before2025', label: '2025年以前项目' },
  { value: 'new2025', label: '2025年新接项目' },
  { value: 'closed2025', label: '2025年销项项目' }
]

const searchForm = ref({
  basicUnit: '',
  projectType: ''
})

const tableHeight = ref(600)

const randomNumber = (min, max, decimals = 2) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

const generateMockData = () => {
  const data = []
  const projectTypes = ['2025年以前项目', '2025年新接项目', '2025年销项项目']

  basicUnitOptions.forEach(unit => {
    projectTypes.forEach(type => {
      const contractPrice = randomNumber(1000, 50000)
      const completedRevenue2026 = randomNumber(0, contractPrice * 0.8)
      const averageProfitMargin = randomNumber(3, 18, 1)
      const invoicedAmount = randomNumber(0, contractPrice * 1.1)
      const receivedAmount = randomNumber(0, invoicedAmount)

      data.push({
        basicUnit: unit.label,
        projectType: type,
        projectCount: Math.floor(randomNumber(1, 20)),
        contractPrice: Number(contractPrice.toFixed(2)),
        internalNotReportedRevenue: Number(randomNumber(0, 5000).toFixed(2)),
        internalNotReportedGrossProfit: Number(randomNumber(0, 2000).toFixed(2)),
        carryForwardRevenue2027: Number(randomNumber(0, 15000).toFixed(2)),
        completedRevenue2026: Number(completedRevenue2026.toFixed(2)),
        reportedRevenue2026: Number(randomNumber(0, 12000).toFixed(2)),
        remainingPlan2026: Number(randomNumber(0, 8000).toFixed(2)),
        realizedProfit2026: Number(randomNumber(0, completedRevenue2026 * 0.15).toFixed(2)),
        reportedGrossProfit2026: Number(randomNumber(0, 3000).toFixed(2)),
        reportedProjects: Math.floor(randomNumber(0, 15)),
        averageProfitMargin: averageProfitMargin,
        remainingPlanGrossProfit2026: Number(randomNumber(0, 1500).toFixed(2)),
        bookedCost: Number(randomNumber(0, contractPrice * 0.7).toFixed(2)),
        carriedCost: Number(randomNumber(0, contractPrice * 0.6).toFixed(2)),
        projectInventory: Number(randomNumber(0, 3000).toFixed(2)),
        invoicedAmount: Number(invoicedAmount.toFixed(2)),
        receivedAmount: Number(receivedAmount.toFixed(2)),
        unreceivedAmount: Number((invoicedAmount - receivedAmount).toFixed(2))
      })
    })
  })

  return data
}

const rawData = ref(generateMockData())

const filteredData = computed(() => {
  return rawData.value.filter(item => {
    const matchBasicUnit = !searchForm.value.basicUnit ||
      item.basicUnit === basicUnitOptions.find(u => u.value === searchForm.value.basicUnit)?.label
    const matchProjectType = !searchForm.value.projectType ||
      (searchForm.value.projectType === 'before2025' && item.projectType === '2025年以前项目') ||
      (searchForm.value.projectType === 'new2025' && item.projectType === '2025年新接项目') ||
      (searchForm.value.projectType === 'closed2025' && item.projectType === '2025年销项项目')
    return matchBasicUnit && matchProjectType
  })
})

const displayData = computed(() => {
  const data = [...filteredData.value]
  const result = []

  const unitGroups = {}
  data.forEach(item => {
    if (!unitGroups[item.basicUnit]) {
      unitGroups[item.basicUnit] = []
    }
    unitGroups[item.basicUnit].push(item)
  })

  Object.keys(unitGroups).forEach(unit => {
    const items = unitGroups[unit]
    items.forEach(item => {
      result.push({ ...item })
    })

    const subtotal = {
      basicUnit: `${unit} - 小计`,
      projectType: '',
      projectCount: items.reduce((sum, i) => sum + i.projectCount, 0),
      contractPrice: Number(items.reduce((sum, i) => sum + i.contractPrice, 0).toFixed(2)),
      internalNotReportedRevenue: Number(items.reduce((sum, i) => sum + i.internalNotReportedRevenue, 0).toFixed(2)),
      internalNotReportedGrossProfit: Number(items.reduce((sum, i) => sum + i.internalNotReportedGrossProfit, 0).toFixed(2)),
      carryForwardRevenue2027: Number(items.reduce((sum, i) => sum + i.carryForwardRevenue2027, 0).toFixed(2)),
      completedRevenue2026: Number(items.reduce((sum, i) => sum + i.completedRevenue2026, 0).toFixed(2)),
      reportedRevenue2026: Number(items.reduce((sum, i) => sum + i.reportedRevenue2026, 0).toFixed(2)),
      remainingPlan2026: Number(items.reduce((sum, i) => sum + i.remainingPlan2026, 0).toFixed(2)),
      realizedProfit2026: Number(items.reduce((sum, i) => sum + i.realizedProfit2026, 0).toFixed(2)),
      reportedGrossProfit2026: Number(items.reduce((sum, i) => sum + i.reportedGrossProfit2026, 0).toFixed(2)),
      reportedProjects: items.reduce((sum, i) => sum + i.reportedProjects, 0),
      averageProfitMargin: Number((items.reduce((sum, i) => sum + i.averageProfitMargin * i.projectCount, 0) /
        items.reduce((sum, i) => sum + i.projectCount, 0)).toFixed(1)),
      remainingPlanGrossProfit2026: Number(items.reduce((sum, i) => sum + i.remainingPlanGrossProfit2026, 0).toFixed(2)),
      bookedCost: Number(items.reduce((sum, i) => sum + i.bookedCost, 0).toFixed(2)),
      carriedCost: Number(items.reduce((sum, i) => sum + i.carriedCost, 0).toFixed(2)),
      projectInventory: Number(items.reduce((sum, i) => sum + i.projectInventory, 0).toFixed(2)),
      invoicedAmount: Number(items.reduce((sum, i) => sum + i.invoicedAmount, 0).toFixed(2)),
      receivedAmount: Number(items.reduce((sum, i) => sum + i.receivedAmount, 0).toFixed(2)),
      unreceivedAmount: Number(items.reduce((sum, i) => sum + i.unreceivedAmount, 0).toFixed(2)),
      isSubtotal: true
    }
    result.push(subtotal)
  })

  return result
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return displayData.value.slice(start, end)
})
watch(searchForm, () => {
  currentPage.value = 1
})

const getSummaries = (param) => {
  const { columns } = param
  const data = filteredData.value
  const sums = []

  columns.forEach((column, index) => {
    if (index === 0) {
      sums.push('总计')
      return
    }
    if (index === 1) {
      sums.push('')
      return
    }
    if (index === 13) {
      const totalCount = data.reduce((sum, item) => sum + (item.projectCount || 0), 0)
      const weightedSum = data.reduce((sum, item) => sum + (item.averageProfitMargin || 0) * (item.projectCount || 0), 0)
      const avg = totalCount > 0 ? (weightedSum / totalCount).toFixed(1) : '0.0'
      sums.push(avg)
      return
    }

    const prop = column.property || column.prop
    const values = data.map((item) => {
      const value = item[prop]
      return typeof value === 'number' ? value : 0
    })
    const sum = values.reduce((prev, curr) => prev + curr, 0)

    if (index === 2 || index === 12) {
      sums.push(Math.floor(sum))
    } else {
      sums.push(sum.toFixed(2))
    }
  })

  return sums
}

const handleSearch = () => {}

const handleReset = () => {
  searchForm.value = {
    basicUnit: '',
    projectType: ''
  }
}

const handleExport = () => {
  const headers = [
    '基层单位', '项目类型', '项目数量', '合同价/审定价', '已报内部未上报集团营收',
    '已报内部未上报集团毛利', '结转至2027年及以后内部营收', '2026年完成总包营收（内部）',
    '2026年上报集团营收', '2026年剩余计划', '2026年内部营收实现利润', '2026年上报集团毛利',
    '上报项目', '平均利润率', '2026年剩余计划毛利', '项目已入账成本', '项目已结转成本',
    '项目存货', '项目已开票（含税）', '项目已收款（含税）', '未收款（含税）'
  ]
  const props = [
    'basicUnit', 'projectType', 'projectCount', 'contractPrice', 'internalNotReportedRevenue',
    'internalNotReportedGrossProfit', 'carryForwardRevenue2027', 'completedRevenue2026',
    'reportedRevenue2026', 'remainingPlan2026', 'realizedProfit2026', 'reportedGrossProfit2026',
    'reportedProjects', 'averageProfitMargin', 'remainingPlanGrossProfit2026', 'bookedCost', 'carriedCost',
    'projectInventory', 'invoicedAmount', 'receivedAmount', 'unreceivedAmount'
  ]

  let csv = headers.join(',') + '\n'
  displayData.value.forEach(item => {
    const row = props.map(prop => {
      const value = item[prop]
      return typeof value === 'number' ? value.toFixed(prop === 'projectCount' || prop === 'reportedProjects' ? 0 : 2) : value
    })
    csv += row.join(',') + '\n'
  })

  const totals = getSummaries({ columns: props.map(p => ({ prop: p })), data: rawData.value })
  csv += totals.join(',') + '\n'

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '按分公司分类报表.csv'
  link.click()
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.branch-report {
  padding: 20px;
}

.search-panel {
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.branch-table {
  min-width: max-content;
  width: 100%;
}

:deep(.el-table th) {
  background-color: #4a6fa5;
  color: #000;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
}

:deep(.el-table td) {
  font-size: 12px;
  white-space: nowrap;
}

:deep(.el-table .el-table__summary-row td) {
  background-color: #e8f4fc;
  font-weight: bold;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}
</style>
