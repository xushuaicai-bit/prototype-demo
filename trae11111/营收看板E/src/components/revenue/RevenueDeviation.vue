<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">当月偏差项目明细表</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：万元</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目编号：</label>
        <el-input v-model="filters.projectCode" placeholder="请输入" class="w-40" />
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目名称：</label>
        <el-input v-model="filters.projectName" placeholder="请输入" class="w-56" />
      </div>

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
        <label class="text-sm text-gray-600 mr-2">是否产运管理重点项目：</label>
        <el-select v-model="filters.isKeyProject" placeholder="请选择" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">月份选择 (N)：</label>
        <el-select v-model="selectedMonth" placeholder="请选择月份" class="w-28">
          <el-option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
        </el-select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <el-table
        :data="filteredData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :row-class-name="getRowClassName"
        style="width: 100%; min-width: 1800px;"
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
          width="180"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        >
          <template #default="scope">
            <span class="truncate">{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="基层单位"
          prop="unit"
          width="140"
        />

        <el-table-column
          label="是否产运管理重点项目"
          prop="isKeyProject"
          width="160"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.isKeyProject === '是'" type="warning" size="small">
              是
            </el-tag>
            <span v-else class="text-gray-400">否</span>
          </template>
        </el-table-column>

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
          label="合同价(不含税)"
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
          label="本年计划营收"
          prop="annualPlanRevenue"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualPlanRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="本年累计营收"
          prop="annualAccumulatedRevenue"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualAccumulatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="开工累计营收"
          prop="totalAccumulatedRevenue"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.totalAccumulatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="`${selectedMonth}计划营收`"
          width="130"
          align="right"
        >
          <template #default="scope">
            <span 
              class="cursor-pointer hover:bg-blue-100 px-1 rounded"
              @dblclick="startEdit(scope.row, 'monthPlanRevenue')"
            >
              <el-input 
                v-if="editingCell === `${scope.row.id}-monthPlanRevenue`"
                v-model="editValue" 
                @blur="finishEdit(scope.row, 'monthPlanRevenue')" 
                @keyup.enter="finishEdit(scope.row, 'monthPlanRevenue')"
                class="w-full"
              />
              <span v-else>{{ formatNumber(scope.row.monthPlanRevenue) }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="`${selectedMonth}完成营收`"
          width="130"
          align="right"
        >
          <template #default="scope">
            <span 
              class="cursor-pointer hover:bg-blue-100 px-1 rounded"
              @dblclick="startEdit(scope.row, 'monthActualRevenue')"
            >
              <el-input 
                v-if="editingCell === `${scope.row.id}-monthActualRevenue`"
                v-model="editValue" 
                @blur="finishEdit(scope.row, 'monthActualRevenue')" 
                @keyup.enter="finishEdit(scope.row, 'monthActualRevenue')"
                class="w-full"
              />
              <span v-else>{{ formatNumber(scope.row.monthActualRevenue) }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="`${selectedMonth}营收完成率`"
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

        <el-table-column
          :label="`${selectedMonth}营收偏差`"
          width="130"
          align="right"
        >
          <template #default="scope">
            <span :class="{ 'text-red-600 font-medium': scope.row.deviation < 0 }">
              {{ formatNumber(scope.row.deviation) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="`${selectedMonth}营收偏差原因`"
          prop="deviationReason"
          width="180"
        >
          <template #default="scope">
            <span 
              class="cursor-pointer hover:bg-blue-100 px-1 rounded block truncate"
              @dblclick="startEdit(scope.row, 'deviationReason')"
            >
              <el-textarea 
                v-if="editingCell === `${scope.row.id}-deviationReason`"
                v-model="editValue" 
                @blur="finishEdit(scope.row, 'deviationReason')" 
                @keyup.enter="finishEdit(scope.row, 'deviationReason')"
                class="w-full"
                :rows="2"
              />
              <span v-else>{{ scope.row.deviationReason || '点击编辑' }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="计划采取措施及节点"
          prop="correctiveMeasures"
          width="200"
        >
          <template #default="scope">
            <span 
              class="cursor-pointer hover:bg-blue-100 px-1 rounded block truncate"
              @dblclick="startEdit(scope.row, 'correctiveMeasures')"
            >
              <el-textarea 
                v-if="editingCell === `${scope.row.id}-correctiveMeasures`"
                v-model="editValue" 
                @blur="finishEdit(scope.row, 'correctiveMeasures')" 
                @keyup.enter="finishEdit(scope.row, 'correctiveMeasures')"
                class="w-full"
                :rows="2"
              />
              <span v-else>{{ scope.row.correctiveMeasures || '点击编辑' }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="纠偏完成情况"
          prop="correctiveStatus"
          width="130"
          align="center"
        >
          <template #default="scope">
            <el-select 
              v-model="scope.row.correctiveStatus" 
              placeholder="请选择"
              size="small"
              class="w-full"
            >
              <el-option label="未开始" value="未开始" />
              <el-option label="纠偏中" value="纠偏中" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          label="备注"
          prop="remark"
          width="150"
        >
          <template #default="scope">
            <span 
              class="cursor-pointer hover:bg-blue-100 px-1 rounded"
              @dblclick="startEdit(scope.row, 'remark')"
            >
              <el-input 
                v-if="editingCell === `${scope.row.id}-remark`"
                v-model="editValue" 
                @blur="finishEdit(scope.row, 'remark')" 
                @keyup.enter="finishEdit(scope.row, 'remark')"
                class="w-full"
              />
              <span v-else>{{ scope.row.remark || '' }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const monthOptions = [
  { value: '1月', label: '1月' },
  { value: '2月', label: '2月' },
  { value: '3月', label: '3月' },
  { value: '4月', label: '4月' },
  { value: '5月', label: '5月' },
  { value: '6月', label: '6月' },
  { value: '7月', label: '7月' },
  { value: '8月', label: '8月' },
  { value: '9月', label: '9月' },
  { value: '10月', label: '10月' },
  { value: '11月', label: '11月' },
  { value: '12月', label: '12月' }
]

const selectedMonth = ref('8月')

const filters = ref({
  projectCode: '',
  projectName: '',
  unit: '',
  isKeyProject: ''
})

const editingCell = ref('')
const editValue = ref('')

const rawData = [
  {
    id: 1,
    projectCode: 'XM-2024-001',
    projectName: '上海市浦东新区污水处理厂扩建工程',
    unit: '生态环境事业部',
    isKeyProject: '是',
    status: '在建',
    contractAmount: 12500,
    carryForwardRevenue: 5000,
    annualPlanRevenue: 8000,
    annualAccumulatedRevenue: 4500,
    totalAccumulatedRevenue: 6500,
    monthPlanRevenue: 800,
    monthActualRevenue: 650,
    deviationReason: '',
    correctiveMeasures: '',
    correctiveStatus: '未开始',
    remark: ''
  },
  {
    id: 2,
    projectCode: 'XM-2024-002',
    projectName: '黄浦区老旧管网改造项目',
    unit: '管网运维事业部',
    isKeyProject: '否',
    status: '在建',
    contractAmount: 8600,
    carryForwardRevenue: 3500,
    annualPlanRevenue: 5200,
    annualAccumulatedRevenue: 3800,
    totalAccumulatedRevenue: 4200,
    monthPlanRevenue: 550,
    monthActualRevenue: 520,
    deviationReason: '材料供应延迟',
    correctiveMeasures: '已协调供应商加快供货',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 3,
    projectCode: 'XM-2024-003',
    projectName: '徐汇区雨水泵站新建工程',
    unit: '市政事业部',
    isKeyProject: '是',
    status: '完工',
    contractAmount: 4500,
    carryForwardRevenue: 1500,
    annualPlanRevenue: 4500,
    annualAccumulatedRevenue: 4500,
    totalAccumulatedRevenue: 4500,
    monthPlanRevenue: 0,
    monthActualRevenue: 0,
    deviationReason: '',
    correctiveMeasures: '',
    correctiveStatus: '已完成',
    remark: '项目已完工'
  },
  {
    id: 4,
    projectCode: 'XM-2024-004',
    projectName: '长宁区二次供水设施改造项目',
    unit: '二次养护',
    isKeyProject: '否',
    status: '待结算',
    contractAmount: 6200,
    carryForwardRevenue: 2000,
    annualPlanRevenue: 6200,
    annualAccumulatedRevenue: 5800,
    totalAccumulatedRevenue: 5800,
    monthPlanRevenue: 600,
    monthActualRevenue: 580,
    deviationReason: '验收流程延迟',
    correctiveMeasures: '加快验收进度',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 5,
    projectCode: 'XM-2024-005',
    projectName: '闵行区供水管道新建工程',
    unit: '管道工程',
    isKeyProject: '是',
    status: '在建',
    contractAmount: 9800,
    carryForwardRevenue: 4000,
    annualPlanRevenue: 7200,
    annualAccumulatedRevenue: 4200,
    totalAccumulatedRevenue: 5500,
    monthPlanRevenue: 750,
    monthActualRevenue: 450,
    deviationReason: '施工人员不足',
    correctiveMeasures: '增派施工班组',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 6,
    projectCode: 'XM-2024-006',
    projectName: '浦东新区供水管网维修工程',
    unit: '区域事业部',
    isKeyProject: '否',
    status: '已结算',
    contractAmount: 3500,
    carryForwardRevenue: 1000,
    annualPlanRevenue: 3500,
    annualAccumulatedRevenue: 3500,
    totalAccumulatedRevenue: 3500,
    monthPlanRevenue: 0,
    monthActualRevenue: 0,
    deviationReason: '',
    correctiveMeasures: '',
    correctiveStatus: '已完成',
    remark: '项目已结算'
  },
  {
    id: 7,
    projectCode: 'XM-2024-007',
    projectName: '松江区水环境治理项目',
    unit: '环境建设分公司',
    isKeyProject: '是',
    status: '在建',
    contractAmount: 15600,
    carryForwardRevenue: 6000,
    annualPlanRevenue: 10000,
    annualAccumulatedRevenue: 5800,
    totalAccumulatedRevenue: 7200,
    monthPlanRevenue: 950,
    monthActualRevenue: 780,
    deviationReason: '天气原因影响施工',
    correctiveMeasures: '调整施工计划，增加夜间施工',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 8,
    projectCode: 'XM-2024-008',
    projectName: '嘉定区污水提升泵站工程',
    unit: '区域发展事业部',
    isKeyProject: '否',
    status: '在建',
    contractAmount: 7800,
    carryForwardRevenue: 3000,
    annualPlanRevenue: 5800,
    annualAccumulatedRevenue: 4200,
    totalAccumulatedRevenue: 4800,
    monthPlanRevenue: 520,
    monthActualRevenue: 520,
    deviationReason: '',
    correctiveMeasures: '',
    correctiveStatus: '未开始',
    remark: '完成率100%'
  }
]

const calculateDerivedFields = (data) => {
  return data.map(item => {
    const deviation = item.monthActualRevenue - item.monthPlanRevenue
    const completionRate = item.monthPlanRevenue > 0 
      ? (item.monthActualRevenue / item.monthPlanRevenue) * 100 
      : 0
    
    return {
      ...item,
      deviation,
      completionRate
    }
  })
}

const filteredData = computed(() => {
  let data = calculateDerivedFields(rawData)
  
  if (filters.value.projectCode) {
    data = data.filter(item => item.projectCode.includes(filters.value.projectCode))
  }
  if (filters.value.projectName) {
    data = data.filter(item => item.projectName.includes(filters.value.projectName))
  }
  if (filters.value.unit) {
    data = data.filter(item => item.unit === filters.value.unit)
  }
  if (filters.value.isKeyProject) {
    data = data.filter(item => item.isKeyProject === filters.value.isKeyProject)
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

const getRowClassName = ({ row }) => {
  if (row.deviation < 0) {
    return 'deviation-row'
  }
  return ''
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

const startEdit = (row, field) => {
  editingCell.value = `${row.id}-${field}`
  editValue.value = row[field]
}

const finishEdit = (row, field) => {
  if (field === 'monthPlanRevenue' || field === 'monthActualRevenue') {
    row[field] = parseFloat(editValue.value) || 0
  } else {
    row[field] = editValue.value
  }
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
.deviation-row {
  background-color: #FFF2F0;
}
</style>