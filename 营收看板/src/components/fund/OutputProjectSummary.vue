<template>
  <div class="output-project-summary">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">2026年销项项目经营分析报表</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：万元</span>
      </div>
      <div class="header-actions">
        <el-select v-model="selectedScheme" placeholder="选择筛选方案" class="scheme-select" clearable @change="loadScheme">
          <el-option v-for="scheme in savedSchemes" :key="scheme.name" :label="scheme.name" :value="scheme.name" />
        </el-select>
        <el-button @click="showSaveDialog = true" size="small">保存筛选方案</el-button>
        <el-button @click="handleExport" type="warning" size="small">导出Excel</el-button>
      </div>
    </div>

    <!-- 顶部筛选区 -->
    <div class="filter-panel">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="基层单位：">
          <el-select v-model="filters.branches" multiple collapse-tags placeholder="请选择" class="w-52">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('branches')" />
            <el-option v-for="b in branchOptions" :key="b" :label="b" :value="b" />
          </el-select>
        </el-form-item>

        <el-form-item label="一级分类：">
          <el-select v-model="filters.category1" multiple collapse-tags placeholder="请选择" class="w-52">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('category1')" />
            <el-option v-for="c in category1Options" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类：">
          <el-select v-model="filters.category2" multiple collapse-tags placeholder="请选择" class="w-52" :disabled="filters.category1.length === 0">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('category2')" />
            <el-option v-for="c in availableCategory2" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类：">
          <el-select v-model="filters.category3" multiple collapse-tags placeholder="请选择" class="w-52" :disabled="filters.category2.length === 0">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('category3')" />
            <el-option v-for="c in availableCategory3" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="项目数量：">
          <div class="range-inputs">
            <el-input-number v-model="filters.projectCountMin" :controls="false" placeholder="最小" class="w-20" :min="0" />
            <span class="mx-1">-</span>
            <el-input-number v-model="filters.projectCountMax" :controls="false" placeholder="最大" class="w-20" :min="0" />
          </div>
        </el-form-item>

        <el-form-item label="合同金额(万元)：">
          <div class="range-inputs">
            <el-input-number v-model="filters.contractMin" :controls="false" placeholder="最小" class="w-20" :min="0" />
            <span class="mx-1">-</span>
            <el-input-number v-model="filters.contractMax" :controls="false" placeholder="最大" class="w-20" :min="0" />
          </div>
        </el-form-item>

        <el-form-item label="利润状态：">
          <el-select v-model="filters.profitStatus" placeholder="请选择" class="w-40">
            <el-option label="全部" value="" />
            <el-option label="正常项目" value="normal" />
            <el-option label="低利润项目" value="low" />
            <el-option label="负偏差项目" value="deviation" />
          </el-select>
        </el-form-item>

        <el-form-item label="平均销项利润率：">
          <el-select v-model="filters.profitRateRange" placeholder="请选择" class="w-40">
            <el-option label="全部" value="" />
            <el-option label="<0%" value="lt0" />
            <el-option label="0%-3%" value="0-3" />
            <el-option label="3%-5%" value="3-5" />
            <el-option label="5%-10%" value="5-10" />
            <el-option label=">10%" value="gt10" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 核心指标卡 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">项目总数</div>
        <div class="stat-value">{{ formatNumber(summaryStats.totalProjectCount) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">合同金额(万元)</div>
        <div class="stat-value">{{ formatNumber(summaryStats.totalContractPrice) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">审定金额(万元)</div>
        <div class="stat-value">{{ formatNumber(summaryStats.totalAuditPrice) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">平均目标利润率</div>
        <div class="stat-value">{{ summaryStats.avgTargetProfitRate.toFixed(2) }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">平均销项利润率</div>
        <div class="stat-value">{{ summaryStats.avgOutputProfitRate.toFixed(2) }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">利润偏差项目数</div>
        <div class="stat-value" :class="{ 'text-red-600': summaryStats.deviationCount > 0 }">{{ summaryStats.deviationCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">合同金额完成率</div>
        <div class="stat-value">{{ summaryStats.completionRate.toFixed(2) }}%</div>
      </div>
    </div>

    <!-- 核心数据表 -->
    <div class="table-container">
        <el-table
          :data="sortedFlatData"
          border
          stripe
          :height="tableHeight"
          class="summary-table"
          show-summary
          :summary-method="getSummaries"
          :header-cell-style="{ backgroundColor: '#4a6fa5', color: '#fff', fontWeight: 'bold', fontSize: '12px' }"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="branch" label="基层单位" width="120" />
          <el-table-column prop="category1" label="一级分类" width="120" />
          <el-table-column prop="category2" label="二级分类" width="120" />
          <el-table-column prop="category3" label="三级分类" width="120" />
          <el-table-column prop="projectCount" label="项目数量" width="100" align="right" sortable="custom">
            <template #default="scope">
              {{ scope.row.projectCount }}
            </template>
          </el-table-column>
          <el-table-column prop="contractPrice" label="合同价(不含税)" width="140" align="right" sortable="custom">
            <template #default="scope">
              {{ formatNumber(scope.row.contractPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="auditPrice" label="审定价(不含税)" width="140" align="right" sortable="custom">
            <template #default="scope">
              {{ formatNumber(scope.row.auditPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="contractRatio" label="合同金额占比" width="120" align="right" sortable="custom">
            <template #default="scope">
              {{ scope.row.contractRatio.toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="avgTargetProfitRate" label="平均目标利润率" width="130" align="right" sortable="custom">
            <template #default="scope">
              {{ scope.row.avgTargetProfitRate.toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="avgOutputProfitRate" label="平均销项利润率" width="130" align="right" sortable="custom">
            <template #default="scope">
              {{ scope.row.avgOutputProfitRate.toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="profitDeviation" label="利润率偏差" width="120" align="right" sortable="custom">
            <template #default="scope">
              <span :class="scope.row.profitDeviation < 0 ? 'text-red-600 font-medium' : ''">
                {{ scope.row.profitDeviation.toFixed(2) }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="deviationCount" label="负偏差项目个数" width="130" align="center">
            <template #default="scope">
              <span
                v-if="scope.row.deviationCount > 0"
                class="drill-link"
                @click="handleDeviationDrill(scope.row)"
              >{{ scope.row.deviationCount }}</span>
              <span v-else>0</span>
            </template>
          </el-table-column>
        </el-table>
    </div>

    <!-- 保存筛选方案弹窗 -->
    <el-dialog v-model="showSaveDialog" title="保存筛选方案" width="400px">
      <el-input v-model="schemeName" placeholder="请输入方案名称" />
      <template #footer>
        <el-button @click="showSaveDialog = false">取消</el-button>
        <el-button type="primary" @click="saveScheme">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['navigate'])

// ============================ 选项数据 ============================

const branchOptions = ['管道工程', '环境建设', '运营养护', '区域发展']

const category1Options = ['水务', '水环境治理', '城市更新', '其他']

// 一级→二级分类映射
const category2Map = {
  '水务': ['城镇水务', '水处理'],
  '水环境治理': ['清洁小流域治理', '水工构筑物工程'],
  '城市更新': ['旧城改造', '城市空间提升'],
  '其他': ['其他工程']
}

// 二级→三级分类映射
const category3Map = {
  '城镇水务': ['供水', '排水'],
  '水处理': ['生活污水处理', '再生水利用'],
  '清洁小流域治理': ['河道清淤', '生态护岸'],
  '水工构筑物工程': ['泵站', '水闸'],
  '旧城改造': ['房屋征收', '基础设施改造'],
  '城市空间提升': ['景观改造', '功能提升'],
  '其他工程': ['其他']
}

// 联动的二级分类选项
const availableCategory2 = computed(() => {
  if (filters.value.category1.length === 0) return []
  const result = []
  filters.value.category1.forEach(c1 => {
    if (category2Map[c1]) {
      category2Map[c1].forEach(c2 => {
        if (!result.includes(c2)) result.push(c2)
      })
    }
  })
  return result
})

// 联动的三级分类选项
const availableCategory3 = computed(() => {
  if (filters.value.category2.length === 0) return []
  const result = []
  filters.value.category2.forEach(c2 => {
    if (category3Map[c2]) {
      category3Map[c2].forEach(c3 => {
        if (!result.includes(c3)) result.push(c3)
      })
    }
  })
  return result
})

// ============================ 筛选条件 ============================

const filters = ref({
  branches: [],
  category1: [],
  category2: [],
  category3: [],
  projectCountMin: null,
  projectCountMax: null,
  contractMin: null,
  contractMax: null,
  profitStatus: '',
  profitRateRange: ''
})

const tableHeight = ref(600)

const selectAll = (field) => {
  if (field === 'branches') {
    if (filters.value.branches.length === branchOptions.length) {
      filters.value.branches = []
    } else {
      filters.value.branches = [...branchOptions]
    }
  } else if (field === 'category1') {
    if (filters.value.category1.length === category1Options.length) {
      filters.value.category1 = []
    } else {
      filters.value.category1 = [...category1Options]
    }
  } else if (field === 'category2') {
    if (filters.value.category2.length === availableCategory2.value.length) {
      filters.value.category2 = []
    } else {
      filters.value.category2 = [...availableCategory2.value]
    }
  } else if (field === 'category3') {
    if (filters.value.category3.length === availableCategory3.value.length) {
      filters.value.category3 = []
    } else {
      filters.value.category3 = [...availableCategory3.value]
    }
  }
}

// 监听一级分类变化，清理无效的二级三级
const onCategory1Change = () => {
  const validC2 = availableCategory2.value
  filters.value.category2 = filters.value.category2.filter(c => validC2.includes(c))
  filters.value.category3 = []
}

// 监听一级分类变化，清理无效的二级三级
watch(() => filters.value.category1, () => {
  onCategory1Change()
})
watch(() => filters.value.category2, () => {
  const validC3 = availableCategory3.value
  filters.value.category3 = filters.value.category3.filter(c => validC3.includes(c))
})

const handleSearch = () => {
  // computed 自动响应
}

const handleReset = () => {
  filters.value = {
    branches: [],
    category1: [],
    category2: [],
    category3: [],
    projectCountMin: null,
    projectCountMax: null,
    contractMin: null,
    contractMax: null,
    profitStatus: '',
    profitRateRange: ''
  }
  selectedScheme.value = ''
}

// ============================ 保存筛选方案 ============================

const showSaveDialog = ref(false)
const schemeName = ref('')
const selectedScheme = ref('')
const savedSchemes = ref([])

const loadSchemes = () => {
  try {
    const stored = localStorage.getItem('outputProjectSchemes')
    if (stored) {
      savedSchemes.value = JSON.parse(stored)
    }
  } catch (e) {
    savedSchemes.value = []
  }
}

const saveScheme = () => {
  if (!schemeName.value.trim()) {
    ElMessage.warning('请输入方案名称')
    return
  }
  const scheme = {
    name: schemeName.value.trim(),
    filters: JSON.parse(JSON.stringify(filters.value))
  }
  const existingIndex = savedSchemes.value.findIndex(s => s.name === scheme.name)
  if (existingIndex >= 0) {
    savedSchemes.value[existingIndex] = scheme
  } else {
    savedSchemes.value.push(scheme)
  }
  localStorage.setItem('outputProjectSchemes', JSON.stringify(savedSchemes.value))
  ElMessage.success('方案保存成功')
  showSaveDialog.value = false
  schemeName.value = ''
}

const loadScheme = (name) => {
  if (!name) return
  const scheme = savedSchemes.value.find(s => s.name === name)
  if (scheme) {
    filters.value = JSON.parse(JSON.stringify(scheme.filters))
  }
}

loadSchemes()

// ============================ Mock 数据生成 ============================

const randomNumber = (min, max, decimals = 2) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

const generateRawData = () => {
  const data = []
  let id = 1

  branchOptions.forEach(branch => {
    category1Options.forEach(c1 => {
      const c2List = category2Map[c1] || []
      c2List.forEach(c2 => {
        const c3List = category3Map[c2] || []
        c3List.forEach(c3 => {
          const projectCount = Math.floor(randomNumber(1, 15, 0))
          const contractPrice = randomNumber(100, 8000)
          const auditPrice = randomNumber(contractPrice * 0.85, contractPrice * 1.05)
          const avgTargetProfitRate = randomNumber(5, 20, 2)
          const avgOutputProfitRate = randomNumber(-2, 18, 2)

          data.push({
            id: id++,
            branch,
            category1: c1,
            category2: c2,
            category3: c3,
            projectCount,
            contractPrice,
            auditPrice,
            avgTargetProfitRate,
            avgOutputProfitRate,
            profitDeviation: Number((avgOutputProfitRate - avgTargetProfitRate).toFixed(2)),
            deviationCount: avgOutputProfitRate < avgTargetProfitRate ? Math.floor(projectCount * randomNumber(0.1, 0.5)) : 0
          })
        })
      })
    })
  })

  return data
}

const rawData = ref(generateRawData())

// ============================ 数据筛选 ============================

const filteredData = computed(() => {
  let result = rawData.value

  // 分公司筛选
  if (filters.value.branches.length > 0) {
    result = result.filter(item => filters.value.branches.includes(item.branch))
  }

  // 一级分类筛选
  if (filters.value.category1.length > 0) {
    result = result.filter(item => filters.value.category1.includes(item.category1))
  }

  // 二级分类筛选
  if (filters.value.category2.length > 0) {
    result = result.filter(item => filters.value.category2.includes(item.category2))
  }

  // 三级分类筛选
  if (filters.value.category3.length > 0) {
    result = result.filter(item => filters.value.category3.includes(item.category3))
  }

  // 项目数量范围
  if (filters.value.projectCountMin != null) {
    result = result.filter(item => item.projectCount >= filters.value.projectCountMin)
  }
  if (filters.value.projectCountMax != null) {
    result = result.filter(item => item.projectCount <= filters.value.projectCountMax)
  }

  // 合同金额范围
  if (filters.value.contractMin != null) {
    result = result.filter(item => item.contractPrice >= filters.value.contractMin)
  }
  if (filters.value.contractMax != null) {
    result = result.filter(item => item.contractPrice <= filters.value.contractMax)
  }

  // 利润状态筛选
  if (filters.value.profitStatus === 'normal') {
    result = result.filter(item => item.profitDeviation >= 0 && item.avgOutputProfitRate >= 3)
  } else if (filters.value.profitStatus === 'low') {
    result = result.filter(item => item.profitDeviation >= 0 && item.avgOutputProfitRate < 3)
  } else if (filters.value.profitStatus === 'deviation') {
    result = result.filter(item => item.profitDeviation < 0)
  }

  // 利润率区间筛选
  const range = filters.value.profitRateRange
  if (range === 'lt0') {
    result = result.filter(item => item.avgOutputProfitRate < 0)
  } else if (range === '0-3') {
    result = result.filter(item => item.avgOutputProfitRate >= 0 && item.avgOutputProfitRate < 3)
  } else if (range === '3-5') {
    result = result.filter(item => item.avgOutputProfitRate >= 3 && item.avgOutputProfitRate < 5)
  } else if (range === '5-10') {
    result = result.filter(item => item.avgOutputProfitRate >= 5 && item.avgOutputProfitRate < 10)
  } else if (range === 'gt10') {
    result = result.filter(item => item.avgOutputProfitRate >= 10)
  }

  return result
})

// ============================ 构建扁平表格数据 ============================

const flatTableData = computed(() => {
  const data = filteredData.value
  const totalContractPrice = data.reduce((sum, item) => sum + item.contractPrice, 0)

  return data.map(item => ({
    ...item,
    contractRatio: totalContractPrice > 0 ? (item.contractPrice / totalContractPrice * 100) : 0
  }))
})

// ============================ 核心指标卡 ============================

const summaryStats = computed(() => {
  const data = filteredData.value
  const totalProjectCount = data.reduce((s, i) => s + i.projectCount, 0)
  const totalContractPrice = data.reduce((s, i) => s + i.contractPrice, 0)
  const totalAuditPrice = data.reduce((s, i) => s + i.auditPrice, 0)
  const deviationCount = data.reduce((s, i) => s + i.deviationCount, 0)

  const avgTargetProfitRate = totalContractPrice > 0
    ? data.reduce((s, i) => s + i.avgTargetProfitRate * i.contractPrice, 0) / totalContractPrice
    : 0
  const avgOutputProfitRate = totalContractPrice > 0
    ? data.reduce((s, i) => s + i.avgOutputProfitRate * i.contractPrice, 0) / totalContractPrice
    : 0

  const completionRate = totalContractPrice > 0 ? (totalAuditPrice / totalContractPrice * 100) : 0

  return {
    totalProjectCount,
    totalContractPrice,
    totalAuditPrice,
    avgTargetProfitRate,
    avgOutputProfitRate,
    deviationCount,
    completionRate
  }
})

// ============================ 排序 ============================

const sortProp = ref('')
const sortOrder = ref('')

const handleSortChange = ({ prop, order }) => {
  sortProp.value = prop || ''
  sortOrder.value = order || ''
}

const sortFlat = (data) => {
  if (!sortProp.value || !sortOrder.value) return data
  const sortFn = (a, b) => {
    const va = a[sortProp.value] ?? 0
    const vb = b[sortProp.value] ?? 0
    return sortOrder.value === 'ascending' ? va - vb : vb - va
  }
  return [...data].sort(sortFn)
}

// 排序后的扁平数据
const sortedFlatData = computed(() => {
  return sortFlat(flatTableData.value)
})

// ============================ 汇总行 ============================

const getSummaries = ({ columns }) => {
  const data = filteredData.value
  const totalContractPrice = data.reduce((s, i) => s + i.contractPrice, 0)
  const totalAuditPrice = data.reduce((s, i) => s + i.auditPrice, 0)
  const totalProjectCount = data.reduce((s, i) => s + i.projectCount, 0)
  const totalDeviationCount = data.reduce((s, i) => s + i.deviationCount, 0)
  const avgTargetProfitRate = totalContractPrice > 0
    ? data.reduce((s, i) => s + i.avgTargetProfitRate * i.contractPrice, 0) / totalContractPrice
    : 0
  const avgOutputProfitRate = totalContractPrice > 0
    ? data.reduce((s, i) => s + i.avgOutputProfitRate * i.contractPrice, 0) / totalContractPrice
    : 0

  return columns.map((col, index) => {
    if (index === 0) return '合计'
    const prop = col.property
    if (prop === 'projectCount') return totalProjectCount.toString()
    if (prop === 'contractPrice') return formatNumber(totalContractPrice)
    if (prop === 'auditPrice') return formatNumber(totalAuditPrice)
    if (prop === 'contractRatio') return '100.00%'
    if (prop === 'avgTargetProfitRate') return avgTargetProfitRate.toFixed(2) + '%'
    if (prop === 'avgOutputProfitRate') return avgOutputProfitRate.toFixed(2) + '%'
    if (prop === 'profitDeviation') return (avgOutputProfitRate - avgTargetProfitRate).toFixed(2) + '%'
    if (prop === 'deviationCount') return totalDeviationCount.toString()
    return ''
  })
}

// ============================ 格式化 ============================

const formatNumber = (num) => {
  if (num === 0) return '0.00'
  if (!num) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ============================ 下钻 ============================

const handleDeviationDrill = (row) => {
  emit('navigate', {
    view: 'finance-report',
    filter: {
      branch: row.branch || '',
      category1: row.category1 || '',
      category2: row.category2 || '',
      category3: row.category3 || '',
      type: 'deviation'
    }
  })
}

// ============================ 导出 ============================

const handleExport = () => {
  const flatRows = flatTableData.value.map(row => ({
    branch: row.branch,
    category1: row.category1,
    category2: row.category2,
    category3: row.category3,
    projectCount: row.projectCount,
    contractPrice: row.contractPrice,
    auditPrice: row.auditPrice,
    contractRatio: row.contractRatio.toFixed(2) + '%',
    avgTargetProfitRate: row.avgTargetProfitRate.toFixed(2) + '%',
    avgOutputProfitRate: row.avgOutputProfitRate.toFixed(2) + '%',
    profitDeviation: row.profitDeviation.toFixed(2) + '%',
    deviationCount: row.deviationCount
  }))

  const headers = [
    '基层单位', '一级分类', '二级分类', '三级分类', '项目数量',
    '合同价(不含税)', '审定价(不含税)', '合同金额占比',
    '平均目标利润率', '平均销项利润率', '利润率偏差', '负偏差项目个数'
  ]

  let csv = headers.join(',') + '\n'
  flatRows.forEach(row => {
    csv += [
      row.branch, row.category1, row.category2, row.category3,
      row.projectCount, row.contractPrice, row.auditPrice,
      row.contractRatio, row.avgTargetProfitRate, row.avgOutputProfitRate,
      row.profitDeviation, row.deviationCount
    ].join(',') + '\n'
  })

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '2026年销项项目经营分析报表.csv'
  link.click()
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.output-project-summary {
  padding: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scheme-select {
  width: 160px;
}

.filter-panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.range-inputs {
  display: flex;
  align-items: center;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #2563eb;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: visible;
}

.drill-link {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
}

.drill-link:hover {
  color: #1d4ed8;
}

:deep(.el-table th) {
  white-space: nowrap;
}

:deep(.el-table .el-table__body-wrapper) {
  overflow-x: auto !important;
}

:deep(.el-table td) {
  font-size: 12px;
}

:deep(.el-table .el-table__footer-wrapper) {
  font-weight: bold;
  background-color: #f5f7fa;
}

:deep(.el-table .el-table__footer-wrapper td) {
  background-color: #e8f4fc;
  font-weight: bold;
}
</style>
