<template>
  <div class="sector-business-finance-summary">
    <div class="page-header">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">按项目板块汇总表</h2>
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

    <div class="filter-panel">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="城市环境一级分类：">
          <el-select v-model="filters.category1" multiple collapse-tags placeholder="请选择" class="w-52">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('category1')" />
            <el-option v-for="c in category1Options" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="城市环境二级分类：">
          <el-select v-model="filters.category2" multiple collapse-tags placeholder="请选择" class="w-52" :disabled="filters.category1.length === 0">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('category2')" />
            <el-option v-for="c in availableCategory2" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="城市环境三级分类：">
          <el-select v-model="filters.category3" multiple collapse-tags placeholder="请选择" class="w-52" :disabled="filters.category2.length === 0">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('category3')" />
            <el-option v-for="c in availableCategory3" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>

        <el-form-item label="项目类型：">
          <el-select v-model="filters.projectType" multiple collapse-tags placeholder="请选择" class="w-52">
            <el-option label="全选" value="__all__" @click.prevent="selectAll('projectType')" />
            <el-option v-for="t in projectTypeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
        <el-table
          :data="sortedFlatData"
          border
          stripe
          :height="tableHeight"
          class="summary-table"
          show-summary
          :summary-method="getSummaries"
          :span-method="spanMethod"
          :row-class-name="getRowClassName"
          :header-cell-style="{ backgroundColor: '#4a6fa5', color: '#fff', fontWeight: 'bold', fontSize: '12px' }"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="category1" label="城市环境一级分类" width="140" fixed="left" />
          <el-table-column prop="category2" label="城市环境二级分类" width="140" fixed="left" />
          <el-table-column prop="category3" label="城市环境三级分类" width="140" fixed="left" />
          <el-table-column prop="projectType" label="项目类型" width="120" fixed="left" />
          <el-table-column prop="projectCount" label="项目数量" width="100" align="right" sortable="custom" />
          <el-table-column prop="contractPrice" label="合同价/审定价" width="140" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.contractPrice) }}</template>
          </el-table-column>
          <el-table-column prop="internalNotReportedRevenue" label="已报内部未上报集团营收" width="160" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.internalNotReportedRevenue) }}</template>
          </el-table-column>
          <el-table-column prop="internalNotReportedGrossProfit" label="已报内部未上报集团毛利" width="160" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.internalNotReportedGrossProfit) }}</template>
          </el-table-column>
          <el-table-column prop="carryForwardRevenue2027" label="结转至2027年及以后内部营收" width="180" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.carryForwardRevenue2027) }}</template>
          </el-table-column>
          <el-table-column prop="completedRevenue2026" label="2026年完成总包营收（内部）" width="160" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.completedRevenue2026) }}</template>
          </el-table-column>
          <el-table-column prop="reportedRevenue2026" label="2026年上报集团营收" width="140" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.reportedRevenue2026) }}</template>
          </el-table-column>
          <el-table-column prop="remainingPlan2026" label="2026年剩余计划" width="120" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.remainingPlan2026) }}</template>
          </el-table-column>
          <el-table-column prop="realizedProfit2026" label="2026年内部营收实现利润" width="160" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.realizedProfit2026) }}</template>
          </el-table-column>
          <el-table-column prop="reportedGrossProfit2026" label="2026年上报集团毛利" width="140" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.reportedGrossProfit2026) }}</template>
          </el-table-column>
          <el-table-column prop="reportedProjects" label="上报项目" width="100" align="right" sortable="custom" />
          <el-table-column prop="averageProfitMargin" label="平均利润率" width="100" align="right" sortable="custom">
            <template #default="scope">{{ scope.row.averageProfitMargin.toFixed(1) }}%</template>
          </el-table-column>
          <el-table-column prop="remainingPlanGrossProfit2026" label="2026年剩余计划毛利" width="140" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.remainingPlanGrossProfit2026) }}</template>
          </el-table-column>
          <el-table-column prop="bookedCost" label="项目已入账成本" width="120" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.bookedCost) }}</template>
          </el-table-column>
          <el-table-column prop="carriedCost" label="项目已结转成本" width="120" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.carriedCost) }}</template>
          </el-table-column>
          <el-table-column prop="projectInventory" label="项目存货" width="100" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.projectInventory) }}</template>
          </el-table-column>
          <el-table-column prop="invoicedAmount" label="项目已开票（含税）" width="140" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.invoicedAmount) }}</template>
          </el-table-column>
          <el-table-column prop="receivedAmount" label="项目已收款（含税）" width="140" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.receivedAmount) }}</template>
          </el-table-column>
          <el-table-column prop="unreceivedAmount" label="未收款（含税）" width="120" align="right" sortable="custom">
            <template #default="scope">{{ formatNumber(scope.row.unreceivedAmount) }}</template>
          </el-table-column>
        </el-table>
    </div>

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

const category1Options = [
  '水务', '水环境治理', '水生态治理', '水利', '水历史与水文化',
  '土壤修复', '城乡更新', '节资减排', '市政园林营建', '其他'
]

const category2Map = {
  '水务': ['城镇水务', '水处理'],
  '水环境治理': ['水源水保护', '河湖水生态修复'],
  '水生态治理': ['水生态修复', '流域治理'],
  '水利': ['城乡水务建设', '水电与新能源'],
  '水历史与水文化': ['水文化旅游'],
  '土壤修复': ['耕地土壤修复', '建设用地土壤修复'],
  '城乡更新': ['老城更新', '新城建设'],
  '节资减排': ['节能', '减排'],
  '市政园林营建': ['市政道路', '市政景观'],
  '其他': ['其他工程']
}

const category3Map = {
  '城镇水务': ['供水', '排水', '雨水'],
  '水处理': ['生活污水处理', '再生水利用', '工业废水处理'],
  '水源水保护': ['饮用水源保护', '地下水保护'],
  '河湖水生态修复': ['河道治理', '湿地修复', '湖泊治理'],
  '水生态修复': ['生态补水', '生物多样性保护'],
  '流域治理': ['小流域治理', '黑臭水体治理'],
  '城乡水务建设': ['城乡供水', '污水处理'],
  '水电与新能源': ['水力发电', '抽水蓄能', '光伏电站'],
  '水文化旅游': ['水文化旅游', '水景观提升'],
  '耕地土壤修复': ['耕地安全利用', '严格管控'],
  '建设用地土壤修复': ['居住用地', '商业用地', '工业用地', '公共管理用地'],
  '老城更新': ['旧城改造', '城市空间提升'],
  '新城建设': ['新区开发', '产业园区'],
  '节能': ['工业节能', '建筑节能'],
  '减排': ['交通减排', '碳减排'],
  '市政道路': ['道路工程', '桥梁工程'],
  '市政景观': ['公园景观', '滨水景观'],
  '其他工程': ['其他']
}

const projectTypeOptions = [
  '2025年以前项目', '2025年新接项目', '2025年销项项目'
]

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
  category1: [],
  category2: [],
  category3: [],
  projectType: []
})

const tableHeight = ref(600)

const selectAll = (field) => {
  if (field === 'category1') {
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
  } else if (field === 'projectType') {
    if (filters.value.projectType.length === projectTypeOptions.length) {
      filters.value.projectType = []
    } else {
      filters.value.projectType = [...projectTypeOptions]
    }
  }
}

watch(() => filters.value.category1, () => {
  const validC2 = availableCategory2.value
  filters.value.category2 = filters.value.category2.filter(c => validC2.includes(c))
  filters.value.category3 = []
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
    category1: [],
    category2: [],
    category3: [],
    projectType: []
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
    const stored = localStorage.getItem('sectorBusinessFinanceSchemes')
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
  localStorage.setItem('sectorBusinessFinanceSchemes', JSON.stringify(savedSchemes.value))
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

  category1Options.forEach(c1 => {
    const c2List = category2Map[c1] || []
    c2List.forEach(c2 => {
      const c3List = category3Map[c2] || []
      c3List.forEach(c3 => {
        projectTypeOptions.forEach(pt => {
          const contractPrice = randomNumber(1000, 50000)
          const completedRevenue2026 = randomNumber(0, contractPrice * 0.8)
          const averageProfitMargin = randomNumber(3, 18, 1)
          const invoicedAmount = randomNumber(0, contractPrice * 1.1)
          const receivedAmount = randomNumber(0, invoicedAmount)

          data.push({
            id: id++,
            category1: c1,
            category2: c2,
            category3: c3,
            projectType: pt,
            projectCount: Math.floor(randomNumber(1, 20)),
            contractPrice: Number(contractPrice.toFixed(2)),
            internalNotReportedRevenue: randomNumber(0, 5000),
            internalNotReportedGrossProfit: randomNumber(0, 2000),
            carryForwardRevenue2027: randomNumber(0, 15000),
            completedRevenue2026: Number(completedRevenue2026.toFixed(2)),
            reportedRevenue2026: randomNumber(0, 12000),
            remainingPlan2026: randomNumber(0, 8000),
            realizedProfit2026: Number(randomNumber(0, completedRevenue2026 * 0.15).toFixed(2)),
            reportedGrossProfit2026: randomNumber(0, 3000),
            reportedProjects: Math.floor(randomNumber(0, 15)),
            averageProfitMargin,
            remainingPlanGrossProfit2026: randomNumber(0, 1500),
            bookedCost: randomNumber(0, contractPrice * 0.7),
            carriedCost: randomNumber(0, contractPrice * 0.6),
            projectInventory: randomNumber(0, 3000),
            invoicedAmount: Number(invoicedAmount.toFixed(2)),
            receivedAmount: Number(receivedAmount.toFixed(2)),
            unreceivedAmount: Number((invoicedAmount - receivedAmount).toFixed(2))
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

  if (filters.value.category1.length > 0) {
    result = result.filter(item => filters.value.category1.includes(item.category1))
  }
  if (filters.value.category2.length > 0) {
    result = result.filter(item => filters.value.category2.includes(item.category2))
  }
  if (filters.value.category3.length > 0) {
    result = result.filter(item => filters.value.category3.includes(item.category3))
  }
  if (filters.value.projectType.length > 0) {
    result = result.filter(item => filters.value.projectType.includes(item.projectType))
  }

  return result
})

// ============================ 构建树形表格数据 ============================

const sumFields = [
  'projectCount', 'contractPrice',
  'internalNotReportedRevenue', 'internalNotReportedGrossProfit',
  'carryForwardRevenue2027', 'completedRevenue2026',
  'reportedRevenue2026', 'remainingPlan2026', 'realizedProfit2026',
  'reportedGrossProfit2026', 'reportedProjects',
  'remainingPlanGrossProfit2026', 'bookedCost', 'carriedCost',
  'projectInventory', 'invoicedAmount', 'receivedAmount', 'unreceivedAmount'
]

const flatTableData = computed(() => {
  return filteredData.value.map(item => ({ ...item }))
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

const sortedFlatData = computed(() => {
  const result = []
  const sorted = sortFlat(flatTableData.value)

  // 按 category1+category2+category3 分组，保持原始顺序（使用 Map 保留插入顺序）
  const c3Groups = new Map()
  sorted.forEach(item => {
    const key = `${item.category1}|${item.category2}|${item.category3}`
    if (!c3Groups.has(key)) {
      c3Groups.set(key, {
        category1: item.category1,
        category2: item.category2,
        category3: item.category3,
        items: []
      })
    }
    c3Groups.get(key).items.push(item)
  })

  // 遍历每个三级分类组
  c3Groups.forEach(group => {
    // 按 projectType 固定顺序排列（2025年以前→新接→销项）
    projectTypeOptions.forEach(pt => {
      const item = group.items.find(i => i.projectType === pt)
      if (item) result.push(item)
    })

    // 添加小计行（汇总该三级分类下所有项目类型）
    const subtotal = {
      category1: group.category1,
      category2: group.category2,
      category3: group.category3,
      projectType: '小计',
      isSubtotal: true
    }
    sumFields.forEach(f => {
      subtotal[f] = group.items.reduce((s, i) => s + (i[f] || 0), 0)
    })
    subtotal.averageProfitMargin = subtotal.projectCount > 0
      ? Number((group.items.reduce((s, i) => s + (i.averageProfitMargin || 0) * (i.projectCount || 0), 0) / subtotal.projectCount).toFixed(1))
      : 0
    result.push(subtotal)
  })

  return result
})

// ============================ 单元格合并 ============================

const categorySpans = computed(() => {
  const data = sortedFlatData.value
  const spans1 = new Array(data.length).fill(0)
  const spans2 = new Array(data.length).fill(0)
  const spans3 = new Array(data.length).fill(0)

  let i = 0
  while (i < data.length) {
    // 一级分类合并（包含小计行，因为小计行保留了 category 值）
    let j = i
    while (j < data.length && data[j].category1 === data[i].category1) {
      j++
    }
    spans1[i] = j - i

    // 二级分类合并（在一级分类组内，包含小计行）
    let k = i
    while (k < j) {
      let m = k
      while (m < j && data[m].category2 === data[k].category2) {
        m++
      }
      spans2[k] = m - k

      // 三级分类合并（在二级分类组内，包含小计行）
      let n = k
      while (n < m) {
        let p = n
        while (p < m && data[p].category3 === data[n].category3) {
          p++
        }
        spans3[n] = p - n
        n = p
      }
      k = m
    }

    i = j
  }

  return { spans1, spans2, spans3 }
})

const spanMethod = ({ row, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    const span = categorySpans.value.spans1[rowIndex]
    return span > 0 ? [span, 1] : [0, 0]
  }
  if (columnIndex === 1) {
    const span = categorySpans.value.spans2[rowIndex]
    return span > 0 ? [span, 1] : [0, 0]
  }
  if (columnIndex === 2) {
    const span = categorySpans.value.spans3[rowIndex]
    return span > 0 ? [span, 1] : [0, 0]
  }
}

const getRowClassName = ({ row }) => {
  if (row.isSubtotal) return 'subtotal-row'
  return ''
}

// ============================ 汇总行 ============================

const getSummaries = ({ columns }) => {
  const data = filteredData.value
  const totals = {}
  sumFields.forEach(f => {
    totals[f] = data.reduce((s, i) => s + (i[f] || 0), 0)
  })
  const totalCount = totals.projectCount
  const weightedMargin = totalCount > 0
    ? data.reduce((s, i) => s + (i.averageProfitMargin || 0) * (i.projectCount || 0), 0) / totalCount
    : 0

  return columns.map((col) => {
    const prop = col.property
    if (prop === 'category1') return '合计'
    if (prop === 'averageProfitMargin') return weightedMargin.toFixed(1) + '%'
    if (prop === 'projectCount' || prop === 'reportedProjects') return totals[prop].toString()
    if (sumFields.includes(prop)) {
      return formatNumber(totals[prop])
    }
    return ''
  })
}

// ============================ 格式化 ============================

const formatNumber = (num, decimals = 2) => {
  if (num === 0) return decimals === 0 ? '0' : '0.00'
  if (!num) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

// ============================ 导出 ============================

const handleExport = () => {
  // 使用 sortedFlatData（含小计行），小计行保留 category 值便于识别归属
  const flatRows = sortedFlatData.value.map(item => ({
    category1: item.category1,
    category2: item.category2,
    category3: item.category3,
    projectType: item.projectType,
    projectCount: item.projectCount,
    contractPrice: formatNumber(item.contractPrice),
    internalNotReportedRevenue: formatNumber(item.internalNotReportedRevenue),
    internalNotReportedGrossProfit: formatNumber(item.internalNotReportedGrossProfit),
    carryForwardRevenue2027: formatNumber(item.carryForwardRevenue2027),
    completedRevenue2026: formatNumber(item.completedRevenue2026),
    reportedRevenue2026: formatNumber(item.reportedRevenue2026),
    remainingPlan2026: formatNumber(item.remainingPlan2026),
    realizedProfit2026: formatNumber(item.realizedProfit2026),
    reportedGrossProfit2026: formatNumber(item.reportedGrossProfit2026),
    reportedProjects: item.reportedProjects,
    averageProfitMargin: (item.averageProfitMargin || 0).toFixed(1) + '%',
    remainingPlanGrossProfit2026: formatNumber(item.remainingPlanGrossProfit2026),
    bookedCost: formatNumber(item.bookedCost),
    carriedCost: formatNumber(item.carriedCost),
    projectInventory: formatNumber(item.projectInventory),
    invoicedAmount: formatNumber(item.invoicedAmount),
    receivedAmount: formatNumber(item.receivedAmount),
    unreceivedAmount: formatNumber(item.unreceivedAmount)
  }))

  const headers = [
    '城市环境一级分类', '城市环境二级分类', '城市环境三级分类', '项目类型',
    '项目数量', '合同价/审定价', '已报内部未上报集团营收', '已报内部未上报集团毛利',
    '结转至2027年及以后内部营收', '2026年完成总包营收（内部）', '2026年上报集团营收',
    '2026年剩余计划', '2026年内部营收实现利润', '2026年上报集团毛利', '上报项目',
    '平均利润率', '2026年剩余计划毛利', '项目已入账成本', '项目已结转成本',
    '项目存货', '项目已开票（含税）', '项目已收款（含税）', '未收款（含税）'
  ]

  let csv = headers.join(',') + '\n'
  flatRows.forEach(row => {
    csv += [
      row.category1, row.category2, row.category3, row.projectType,
      row.projectCount, row.contractPrice, row.internalNotReportedRevenue,
      row.internalNotReportedGrossProfit, row.carryForwardRevenue2027,
      row.completedRevenue2026, row.reportedRevenue2026, row.remainingPlan2026,
      row.realizedProfit2026, row.reportedGrossProfit2026, row.reportedProjects,
      row.averageProfitMargin, row.remainingPlanGrossProfit2026, row.bookedCost,
      row.carriedCost, row.projectInventory, row.invoicedAmount, row.receivedAmount,
      row.unreceivedAmount
    ].join(',') + '\n'
  })

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '按项目板块汇总表.csv'
  link.click()
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.sector-business-finance-summary {
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

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: visible;
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

/* 小计行样式 */
:deep(.el-table .subtotal-row td) {
  background-color: #fff8e1 !important;
  font-weight: bold;
  color: #d97706;
}

/* 固定列小计行样式（同步背景色，避免半透明） */
:deep(.el-table .subtotal-row .el-table-fixed-column--left) {
  background-color: #fff8e1 !important;
}

/* 固定列表头样式（防止白底白字） */
:deep(.el-table th.el-table-fixed-column--left) {
  background-color: #4a6fa5 !important;
  color: #fff !important;
}
</style>
