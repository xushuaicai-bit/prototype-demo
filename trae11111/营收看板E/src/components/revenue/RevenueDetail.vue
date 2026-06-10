<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">营收明细表</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：元</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">基层单位：</label>
        <el-select v-model="filters.unit" placeholder="请选择" class="w-40">
          <el-option label="全部" value="" />
          <el-option label="管网事业部" value="管网事业部" />
          <el-option label="生态事业部" value="生态事业部" />
          <el-option label="区域事业部" value="区域事业部" />
          <el-option label="市政事业部" value="市政事业部" />
          <el-option label="环境建设" value="环境建设" />
          <el-option label="管道工程" value="管道工程" />
          <el-option label="管道分公司" value="管道分公司" />
          <el-option label="运营养护" value="运营养护" />
          <el-option label="二次养护" value="二次养护" />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目状态：</label>
        <el-select v-model="filters.status" placeholder="请选择" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="在建" value="在建" />
          <el-option label="完工" value="完工" />
          <el-option label="待结算" value="待结算" />
          <el-option label="已结算" value="已结算" />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">是否协管项目：</label>
        <el-radio-group v-model="filters.isCoManaged" class="flex">
          <el-radio label="">全部</el-radio>
          <el-radio label="是">是</el-radio>
          <el-radio label="否">否</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="overflow-x-auto">
      <el-table
        :data="filteredData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :row-class-name="rowClassName"
        style="width: 100%; min-width: 2000px;"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          label="序号"
          type="index"
          fixed="left"
          width="70"
          align="center"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />

        <el-table-column
          label="项目编号"
          prop="projectCode"
          fixed="left"
          width="120"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />

        <el-table-column
          label="项目名称"
          prop="projectName"
          fixed="left"
          width="200"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        >
          <template #default="scope">
            <el-tooltip :content="scope.row.projectName" placement="top">
              <span class="truncate">{{ scope.row.projectName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          label="基层单位"
          prop="unit"
          width="140"
        />

        <el-table-column
          label="所属区域"
          prop="region"
          width="100"
        />

        <el-table-column
          label="业主名称"
          prop="owner"
          width="150"
        />

        <el-table-column
          label="项目状态"
          prop="status"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="营收统计口径"
          prop="revenueCaliber"
          width="120"
        />

        <el-table-column
          label="是否协管项目"
          prop="isCoManaged"
          width="120"
          align="center"
          :header-cell-style="{ backgroundColor: '#95DE64', color: '#fff' }"
          :cell-style="{ backgroundColor: '#F6FFED' }"
        >
          <template #default="scope">
            <el-switch :value="scope.row.isCoManaged === '是'" disabled />
          </template>
        </el-table-column>

        <el-table-column
          label="业务类型"
          prop="businessType"
          width="120"
        >
          <template #default="scope">
            <el-tag size="small">{{ scope.row.businessType }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="合同金额(不含税)"
          prop="contractAmount"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.contractAmount) }}
          </template>
        </el-table-column>

        <el-table-column
          label="结转至当年及以后营收"
          prop="carryForwardRevenue"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.carryForwardRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="年度累计营收"
          prop="annualAccumulatedRevenue"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualAccumulatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="季度累计营收"
          prop="quarterlyAccumulatedRevenue"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.quarterlyAccumulatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="年度上报股份营收"
          prop="annualReportedRevenue"
          width="150"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualReportedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="累计上报股份营收"
          prop="totalReportedRevenue"
          width="150"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.totalReportedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          v-for="month in months"
          :key="month.key"
          :label="month.label"
          :prop="month.key"
          width="120"
          align="right"
        >
          <template #default="scope">
            <span 
              class="cursor-pointer hover:bg-blue-100 px-1 rounded"
              @dblclick="startEdit(scope.row, month.key)"
            >
              <el-input 
                v-if="editingCell === `${scope.row.id}-${month.key}`"
                ref="editInputRef"
                v-model="editValue" 
                @blur="finishEdit(scope.row, month.key)" 
                @keyup.enter="finishEdit(scope.row, month.key)"
                class="w-full"
              />
              <span v-else>{{ formatNumber(scope.row[month.key]) }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'

const props = defineProps({
  initialFilter: {
    type: Object,
    default: () => ({})
  }
})

const months = [
  { key: 'month1', label: '1月上报营收' },
  { key: 'month2', label: '2月上报营收' },
  { key: 'month3', label: '3月上报营收' },
  { key: 'month4', label: '4月上报营收' },
  { key: 'month5', label: '5月上报营收' },
  { key: 'month6', label: '6月上报营收' },
  { key: 'month7', label: '7月上报营收' },
  { key: 'month8', label: '8月上报营收' },
  { key: 'month9', label: '9月上报营收' },
  { key: 'month10', label: '10月上报营收' },
  { key: 'month11', label: '11月上报营收' },
  { key: 'month12', label: '12月上报营收' }
]

const filters = ref({
  unit: '',
  status: '',
  isCoManaged: ''
})

onMounted(() => {
  if (props.initialFilter.unit) {
    filters.value.unit = props.initialFilter.unit
  }
})

const editingCell = ref('')
const editValue = ref('')

const rawData = [
  {
    id: 1,
    projectCode: 'XM-2024-001',
    projectName: '上海市浦东新区污水处理厂扩建工程',
    unit: '生态环境事业部',
    region: '浦东',
    owner: '上海市水务局',
    status: '在建',
    revenueCaliber: '施工类',
    isCoManaged: '否',
    businessType: '污水处理',
    contractAmount: 125000000,
    carryForwardRevenue: 50000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 32000000,
    month1: 2500000,
    month2: 2800000,
    month3: 3200000,
    month4: 3500000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 2,
    projectCode: 'XM-2024-002',
    projectName: '黄浦区老旧管网改造项目',
    unit: '管网运维事业部',
    region: '黄浦',
    owner: '上海市城投集团',
    status: '在建',
    revenueCaliber: '施工类',
    isCoManaged: '是',
    businessType: '管网改造',
    contractAmount: 86000000,
    carryForwardRevenue: 35000000,
    annualAccumulatedRevenue: 28000000,
    quarterlyAccumulatedRevenue: 9500000,
    annualReportedRevenue: 26000000,
    month1: 2000000,
    month2: 2200000,
    month3: 2500000,
    month4: 2800000,
    month5: 3000000,
    month6: 3500000,
    month7: 3800000,
    month8: 4200000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 3,
    projectCode: 'XM-2024-003',
    projectName: '徐汇区雨水泵站新建工程',
    unit: '市政事业部',
    region: '徐汇',
    owner: '徐汇区市政工程管理中心',
    status: '完工',
    revenueCaliber: '施工类',
    isCoManaged: '否',
    businessType: '泵站建设',
    contractAmount: 45000000,
    carryForwardRevenue: 15000000,
    annualAccumulatedRevenue: 45000000,
    quarterlyAccumulatedRevenue: 15000000,
    annualReportedRevenue: 42000000,
    month1: 3500000,
    month2: 3800000,
    month3: 4200000,
    month4: 4500000,
    month5: 4800000,
    month6: 5200000,
    month7: 5500000,
    month8: 5500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 4,
    projectCode: 'XM-2024-004',
    projectName: '长宁区二次供水设施改造项目',
    unit: '二次养护',
    region: '长宁',
    owner: '长宁区水务管理局',
    status: '待结算',
    revenueCaliber: '施工类',
    isCoManaged: '是',
    businessType: '二次供水',
    contractAmount: 62000000,
    carryForwardRevenue: 20000000,
    annualAccumulatedRevenue: 58000000,
    quarterlyAccumulatedRevenue: 19500000,
    annualReportedRevenue: 55000000,
    month1: 4200000,
    month2: 4500000,
    month3: 4800000,
    month4: 5200000,
    month5: 5500000,
    month6: 5800000,
    month7: 6200000,
    month8: 6500000,
    month9: 5000000,
    month10: 4500000,
    month11: 0,
    month12: 0
  },
  {
    id: 5,
    projectCode: 'XM-2024-005',
    projectName: '闵行区供水管道新建工程',
    unit: '管道工程',
    region: '闵行',
    owner: '闵行区水务局',
    status: '在建',
    revenueCaliber: '施工类',
    isCoManaged: '否',
    businessType: '管道建设',
    contractAmount: 98000000,
    carryForwardRevenue: 40000000,
    annualAccumulatedRevenue: 32000000,
    quarterlyAccumulatedRevenue: 11000000,
    annualReportedRevenue: 30000000,
    month1: 2200000,
    month2: 2500000,
    month3: 2800000,
    month4: 3200000,
    month5: 3500000,
    month6: 3800000,
    month7: 4200000,
    month8: 4500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 6,
    projectCode: 'XM-2024-006',
    projectName: '浦东新区供水管网维修工程',
    unit: '区域事业部',
    region: '浦东',
    owner: '浦东水务集团',
    status: '已结算',
    revenueCaliber: '施工类',
    isCoManaged: '否',
    businessType: '管网维修',
    contractAmount: 35000000,
    carryForwardRevenue: 10000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 33000000,
    month1: 3000000,
    month2: 3200000,
    month3: 3500000,
    month4: 3800000,
    month5: 4000000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 7,
    projectCode: 'XM-2024-007',
    projectName: '松江区水环境治理项目',
    unit: '环境建设分公司',
    region: '松江',
    owner: '松江区生态环境局',
    status: '在建',
    revenueCaliber: '施工类',
    isCoManaged: '是',
    businessType: '水环境治理',
    contractAmount: 156000000,
    carryForwardRevenue: 60000000,
    annualAccumulatedRevenue: 48000000,
    quarterlyAccumulatedRevenue: 16500000,
    annualReportedRevenue: 45000000,
    month1: 3500000,
    month2: 3800000,
    month3: 4200000,
    month4: 4500000,
    month5: 4800000,
    month6: 5200000,
    month7: 5500000,
    month8: 5800000,
    month9: 5000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 8,
    projectCode: 'XM-2024-008',
    projectName: '嘉定区污水提升泵站工程',
    unit: '区域发展事业部',
    region: '嘉定',
    owner: '嘉定区水务局',
    status: '在建',
    revenueCaliber: '施工类',
    isCoManaged: '否',
    businessType: '泵站建设',
    contractAmount: 78000000,
    carryForwardRevenue: 30000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 33000000,
    month1: 2800000,
    month2: 3000000,
    month3: 3300000,
    month4: 3600000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  }
]

const calculateTotalReportedRevenue = (data) => {
  return data.map(item => {
    let total = 0
    for (let i = 1; i <= 12; i++) {
      total += item[`month${i}`] || 0
    }
    return { ...item, totalReportedRevenue: total }
  })
}

const filteredData = computed(() => {
  let data = calculateTotalReportedRevenue(rawData)
  
  if (filters.value.unit) {
    data = data.filter(item => item.unit === filters.value.unit)
  }
  if (filters.value.status) {
    data = data.filter(item => item.status === filters.value.status)
  }
  if (filters.value.isCoManaged) {
    data = data.filter(item => item.isCoManaged === filters.value.isCoManaged)
  }
  
  return data
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusType = (status) => {
  const types = {
    '在建': 'warning',
    '完工': 'success',
    '待结算': 'info',
    '已结算': 'primary'
  }
  return types[status] || 'default'
}

const rowClassName = ({ row }) => {
  if (row.isCoManaged === '是') {
    return 'co-managed-row'
  }
  return ''
}

const startEdit = (row, field) => {
  editingCell.value = `${row.id}-${field}`
  editValue.value = row[field]
}

const finishEdit = (row, field) => {
  row[field] = parseFloat(editValue.value) || 0
  editingCell.value = ''
}

const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
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
      sums[index] = values.reduce((prev, curr) => prev + curr, 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      sums[index] = '0.00'
    }
  })
  return sums
}
</script>

<style scoped>
.co-managed-row {
  background-color: #F6FFED;
}
</style>