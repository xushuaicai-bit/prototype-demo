<template>
  <div class="project-status-summary">
    <div class="table-container">
      <div class="table-header-right">
        <span class="summary-info">数据时间：{{ currentDate }}</span>
        <el-button @click="handleExport" type="warning">导出</el-button>
      </div>

      <div class="table-scroll-wrapper">
        <el-table
          :data="paginatedData"
          border
          stripe
          :height="tableHeight"
          class="summary-table"
          show-summary
        >
          <el-table-column prop="projectStatus" label="项目状态" width="120" align="center" />
          <el-table-column prop="settlementStatus" label="结算状态" width="120" align="center" />
          <el-table-column prop="projectCount" label="项目数量" width="100" align="right" />
          <el-table-column prop="contractPrice" label="合同价/审定价" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.contractPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="internalNotReportedRevenue" label="已报内部未上报集团营收" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.internalNotReportedRevenue) }}
            </template>
          </el-table-column>
          <el-table-column prop="internalNotReportedGrossProfit" label="已报内部未上报集团毛利" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.internalNotReportedGrossProfit) }}
            </template>
          </el-table-column>
          <el-table-column prop="carryForwardRevenue2027" label="结转至2027年及以后内部营收" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.carryForwardRevenue2027) }}
            </template>
          </el-table-column>
          <el-table-column prop="completedRevenue2026" label="2026年完成总包营收（内部）" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.completedRevenue2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportedRevenue2026" label="2026年上报集团营收" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.reportedRevenue2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="remainingPlan2026" label="2026年剩余计划" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.remainingPlan2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="realizedProfit2026" label="2026年内部营收实现利润" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.realizedProfit2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportedGrossProfit2026" label="2026年上报集团毛利" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.reportedGrossProfit2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportedProjects" label="上报项目" width="100" align="right" />
          <el-table-column prop="avgProfitMargin" label="平均利润率" width="120" align="right">
            <template #default="scope">
              {{ scope.row.avgProfitMargin }}%
            </template>
          </el-table-column>
          <el-table-column prop="remainingPlanGrossProfit2026" label="2026年剩余计划毛利" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.remainingPlanGrossProfit2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="bookedCost" label="项目已入账成本" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.bookedCost) }}
            </template>
          </el-table-column>
          <el-table-column prop="carriedCost" label="项目已结转成本" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.carriedCost) }}
            </template>
          </el-table-column>
          <el-table-column prop="projectInventory" label="项目存货" width="100" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.projectInventory) }}
            </template>
          </el-table-column>
          <el-table-column prop="invoicedAmount" label="项目已开票（含税）" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.invoicedAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="receivedAmount" label="项目已收款（含税）" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.receivedAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="unreceivedAmount" label="未收款（含税）" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.unreceivedAmount) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="summaryData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>

      <div class="unit-note">
        <span>注：以上金额单位均为万元，按会计专用格式显示</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const projectStatuses = ['待建', '在建', '停工', '完工', '竣工', '业务销项', '财务销项']
const settlementStatuses = ['结算编制中', '结算已送审', '结算已完成']

const tableHeight = ref(600)
const currentDate = new Date().toLocaleDateString('zh-CN')

const randomNumber = (min, max, decimals = 2) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

const generateMockData = () => {
  const data = []
  const statuses = ['待建', '在建', '停工', '完工', '竣工', '业务销项', '财务销项']

  for (let i = 1; i <= 150; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const contractPriceTax = randomNumber(500, 50000)

    data.push({
      projectStatus: status,
      settlementStatus: status === '竣工' ? settlementStatuses[Math.floor(Math.random() * settlementStatuses.length)] : '',
      contractPriceTax,
      internalNotReportedRevenue: randomNumber(0, 10000),
      grossProfitNotReported: randomNumber(0, 2000),
      carryForwardRevenue2027: status === '待建' ? randomNumber(1000, 30000) : randomNumber(0, 10000),
      completedRevenue2026: status === '业务销项' || status === '财务销项' ? contractPriceTax * randomNumber(0.9, 1.0) : randomNumber(0, contractPriceTax * 0.8),
      reportedRevenue2026: randomNumber(0, 15000),
      remainingPlan2026: status === '待建' || status === '在建' ? randomNumber(0, 10000) : 0,
      realizedProfit2026: randomNumber(-500, 3000),
      realizedProfitGroup2026: randomNumber(0, 2500),
      bookedCost: randomNumber(0, contractPriceTax * 0.9),
      carriedCost: randomNumber(0, contractPriceTax * 0.8),
      projectInventory: randomNumber(0, 5000),
      cumulativeInvoiced: randomNumber(0, contractPriceTax),
      cumulativeReceived: randomNumber(0, contractPriceTax * 0.9),
      profitMargin: randomNumber(2, 20)
    })
  }
  return data
}

const financeData = ref(generateMockData())

const filteredData = computed(() => {
  return financeData.value
})

const summaryData = computed(() => {
  const result = []

  projectStatuses.forEach(status => {
    const statusData = filteredData.value.filter(item => item.projectStatus === status)

    const totalContractPrice = statusData.reduce((sum, item) => sum + item.contractPriceTax, 0)
    const totalInternalNotReportedRevenue = statusData.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0)
    const totalInternalNotReportedGrossProfit = statusData.reduce((sum, item) => sum + item.grossProfitNotReported, 0)
    const totalCarryForwardRevenue2027 = statusData.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0)
    const totalCompletedRevenue2026 = statusData.reduce((sum, item) => sum + item.completedRevenue2026, 0)
    const totalReportedRevenue2026 = statusData.reduce((sum, item) => sum + item.reportedRevenue2026, 0)
    const totalRemainingPlan2026 = statusData.reduce((sum, item) => sum + item.remainingPlan2026, 0)
    const totalRealizedProfit2026 = statusData.reduce((sum, item) => sum + item.realizedProfit2026, 0)
    const totalReportedGrossProfit2026 = statusData.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0)
    const totalBookedCost = statusData.reduce((sum, item) => sum + item.bookedCost, 0)
    const totalCarriedCost = statusData.reduce((sum, item) => sum + item.carriedCost, 0)
    const totalProjectInventory = statusData.reduce((sum, item) => sum + item.projectInventory, 0)
    const totalInvoicedAmount = statusData.reduce((sum, item) => sum + item.cumulativeInvoiced, 0)
    const totalReceivedAmount = statusData.reduce((sum, item) => sum + item.cumulativeReceived, 0)

    const avgProfitMargin = statusData.length > 0
      ? Number((statusData.reduce((sum, item) => sum + item.profitMargin, 0) / statusData.length).toFixed(2))
      : 0

    result.push({
      projectStatus: status,
      settlementStatus: status === '竣工' ? '按结算状态细分' : '',
      projectCount: statusData.length,
      contractPrice: Number(totalContractPrice.toFixed(2)),
      internalNotReportedRevenue: Number(totalInternalNotReportedRevenue.toFixed(2)),
      internalNotReportedGrossProfit: Number(totalInternalNotReportedGrossProfit.toFixed(2)),
      carryForwardRevenue2027: Number(totalCarryForwardRevenue2027.toFixed(2)),
      completedRevenue2026: Number(totalCompletedRevenue2026.toFixed(2)),
      reportedRevenue2026: Number(totalReportedRevenue2026.toFixed(2)),
      remainingPlan2026: Number(totalRemainingPlan2026.toFixed(2)),
      realizedProfit2026: Number(totalRealizedProfit2026.toFixed(2)),
      reportedGrossProfit2026: Number(totalReportedGrossProfit2026.toFixed(2)),
      reportedProjects: Math.floor(statusData.length * 0.8),
      avgProfitMargin,
      remainingPlanGrossProfit2026: Number((totalRemainingPlan2026 * avgProfitMargin / 100).toFixed(2)),
      bookedCost: Number(totalBookedCost.toFixed(2)),
      carriedCost: Number(totalCarriedCost.toFixed(2)),
      projectInventory: Number(totalProjectInventory.toFixed(2)),
      invoicedAmount: Number(totalInvoicedAmount.toFixed(2)),
      receivedAmount: Number(totalReceivedAmount.toFixed(2)),
      unreceivedAmount: Number((totalInvoicedAmount - totalReceivedAmount).toFixed(2))
    })
  })

  const completedData = filteredData.value.filter(item => item.projectStatus === '竣工')
  settlementStatuses.forEach(settlementStatus => {
    const settlementData = completedData.filter(item => item.settlementStatus === settlementStatus)

    const totalContractPrice = settlementData.reduce((sum, item) => sum + item.contractPriceTax, 0)
    const totalInternalNotReportedRevenue = settlementData.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0)
    const totalInternalNotReportedGrossProfit = settlementData.reduce((sum, item) => sum + item.grossProfitNotReported, 0)
    const totalCarryForwardRevenue2027 = settlementData.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0)
    const totalCompletedRevenue2026 = settlementData.reduce((sum, item) => sum + item.completedRevenue2026, 0)
    const totalReportedRevenue2026 = settlementData.reduce((sum, item) => sum + item.reportedRevenue2026, 0)
    const totalRemainingPlan2026 = settlementData.reduce((sum, item) => sum + item.remainingPlan2026, 0)
    const totalRealizedProfit2026 = settlementData.reduce((sum, item) => sum + item.realizedProfit2026, 0)
    const totalReportedGrossProfit2026 = settlementData.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0)
    const totalBookedCost = settlementData.reduce((sum, item) => sum + item.bookedCost, 0)
    const totalCarriedCost = settlementData.reduce((sum, item) => sum + item.carriedCost, 0)
    const totalProjectInventory = settlementData.reduce((sum, item) => sum + item.projectInventory, 0)
    const totalInvoicedAmount = settlementData.reduce((sum, item) => sum + item.cumulativeInvoiced, 0)
    const totalReceivedAmount = settlementData.reduce((sum, item) => sum + item.cumulativeReceived, 0)

    const avgProfitMargin = settlementData.length > 0
      ? Number((settlementData.reduce((sum, item) => sum + item.profitMargin, 0) / settlementData.length).toFixed(2))
      : 0

    result.push({
      projectStatus: '',
      settlementStatus: settlementStatus,
      projectCount: settlementData.length,
      contractPrice: Number(totalContractPrice.toFixed(2)),
      internalNotReportedRevenue: Number(totalInternalNotReportedRevenue.toFixed(2)),
      internalNotReportedGrossProfit: Number(totalInternalNotReportedGrossProfit.toFixed(2)),
      carryForwardRevenue2027: Number(totalCarryForwardRevenue2027.toFixed(2)),
      completedRevenue2026: Number(totalCompletedRevenue2026.toFixed(2)),
      reportedRevenue2026: Number(totalReportedRevenue2026.toFixed(2)),
      remainingPlan2026: Number(totalRemainingPlan2026.toFixed(2)),
      realizedProfit2026: Number(totalRealizedProfit2026.toFixed(2)),
      reportedGrossProfit2026: Number(totalReportedGrossProfit2026.toFixed(2)),
      reportedProjects: Math.floor(settlementData.length * 0.8),
      avgProfitMargin,
      remainingPlanGrossProfit2026: Number((totalRemainingPlan2026 * avgProfitMargin / 100).toFixed(2)),
      bookedCost: Number(totalBookedCost.toFixed(2)),
      carriedCost: Number(totalCarriedCost.toFixed(2)),
      projectInventory: Number(totalProjectInventory.toFixed(2)),
      invoicedAmount: Number(totalInvoicedAmount.toFixed(2)),
      receivedAmount: Number(totalReceivedAmount.toFixed(2)),
      unreceivedAmount: Number((totalInvoicedAmount - totalReceivedAmount).toFixed(2))
    })
  })

  const totals = {
    projectStatus: '总计',
    settlementStatus: '',
    projectCount: filteredData.value.length,
    contractPrice: Number(filteredData.value.reduce((sum, item) => sum + item.contractPriceTax, 0).toFixed(2)),
    internalNotReportedRevenue: Number(filteredData.value.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0).toFixed(2)),
    internalNotReportedGrossProfit: Number(filteredData.value.reduce((sum, item) => sum + item.grossProfitNotReported, 0).toFixed(2)),
    carryForwardRevenue2027: Number(filteredData.value.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0).toFixed(2)),
    completedRevenue2026: Number(filteredData.value.reduce((sum, item) => sum + item.completedRevenue2026, 0).toFixed(2)),
    reportedRevenue2026: Number(filteredData.value.reduce((sum, item) => sum + item.reportedRevenue2026, 0).toFixed(2)),
    remainingPlan2026: Number(filteredData.value.reduce((sum, item) => sum + item.remainingPlan2026, 0).toFixed(2)),
    realizedProfit2026: Number(filteredData.value.reduce((sum, item) => sum + item.realizedProfit2026, 0).toFixed(2)),
    reportedGrossProfit2026: Number(filteredData.value.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0).toFixed(2)),
    reportedProjects: Math.floor(filteredData.value.length * 0.8),
    avgProfitMargin: filteredData.value.length > 0
      ? Number((filteredData.value.reduce((sum, item) => sum + item.profitMargin, 0) / filteredData.value.length).toFixed(2))
      : 0,
    remainingPlanGrossProfit2026: 0,
    bookedCost: Number(filteredData.value.reduce((sum, item) => sum + item.bookedCost, 0).toFixed(2)),
    carriedCost: Number(filteredData.value.reduce((sum, item) => sum + item.carriedCost, 0).toFixed(2)),
    projectInventory: Number(filteredData.value.reduce((sum, item) => sum + item.projectInventory, 0).toFixed(2)),
    invoicedAmount: Number(filteredData.value.reduce((sum, item) => sum + item.cumulativeInvoiced, 0).toFixed(2)),
    receivedAmount: Number(filteredData.value.reduce((sum, item) => sum + item.cumulativeReceived, 0).toFixed(2)),
    unreceivedAmount: Number((filteredData.value.reduce((sum, item) => sum + item.cumulativeInvoiced, 0) -
      filteredData.value.reduce((sum, item) => sum + item.cumulativeReceived, 0)).toFixed(2))
  }
  totals.remainingPlanGrossProfit2026 = Number((totals.remainingPlan2026 * totals.avgProfitMargin / 100).toFixed(2))

  result.push(totals)

  return result
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return summaryData.value.slice(start, end)
})

const formatNumber = (num) => {
  if (num === 0) return '0.00'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleExport = () => {
  const headers = [
    '项目状态', '结算状态', '项目数量', '合同价/审定价', '已报内部未上报集团营收',
    '已报内部未上报集团毛利', '结转至2027年及以后内部营收', '2026年完成总包营收（内部）',
    '2026年上报集团营收', '2026年剩余计划', '2026年内部营收实现利润',
    '2026年上报集团毛利', '上报项目', '平均利润率', '2026年剩余计划毛利',
    '项目已入账成本', '项目已结转成本', '项目存货', '项目已开票（含税）',
    '项目已收款（含税）', '未收款（含税）'
  ]

  let csv = headers.join(',') + '\n'
  summaryData.value.forEach(row => {
    const rowData = [
      row.projectStatus,
      row.settlementStatus,
      row.projectCount,
      row.contractPrice,
      row.internalNotReportedRevenue,
      row.internalNotReportedGrossProfit,
      row.carryForwardRevenue2027,
      row.completedRevenue2026,
      row.reportedRevenue2026,
      row.remainingPlan2026,
      row.realizedProfit2026,
      row.reportedGrossProfit2026,
      row.reportedProjects,
      row.avgProfitMargin + '%',
      row.remainingPlanGrossProfit2026,
      row.bookedCost,
      row.carriedCost,
      row.projectInventory,
      row.invoicedAmount,
      row.receivedAmount,
      row.unreceivedAmount
    ]
    csv += rowData.join(',') + '\n'
  })

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '按项目状态分类汇总表.csv'
  link.click()
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.project-status-summary {
  padding: 20px;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.summary-info {
  font-size: 13px;
  color: #666;
  margin-right: auto;
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.summary-table {
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

:deep(.el-table .el-table__footer-wrapper) {
  font-weight: bold;
  background-color: #f5f7fa;
}

:deep(.el-table .el-table__footer-wrapper td) {
  background-color: #e8f4fc;
  font-weight: bold;
}

.unit-note {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e8e8e8;
  font-size: 12px;
  color: #666;
  text-align: right;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}
</style>
