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
        <el-form-item label="分公司：">
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

    <!-- 图表区 -->
    <div class="chart-section">
      <div class="chart-title">各分公司合同价与审定价对比</div>
      <div class="bar-chart">
        <div v-for="item in branchChartData" :key="item.branch" class="bar-group">
          <div class="bar-label">{{ item.branch }}</div>
          <div class="bar-row">
            <div class="bar bar-contract" :style="{ width: item.contractWidth + '%' }">
              <span class="bar-text">{{ formatNumber(item.contractPrice) }}</span>
            </div>
          </div>
          <div class="bar-row">
            <div class="bar bar-audit" :style="{ width: item.auditWidth + '%' }">
              <span class="bar-text">{{ formatNumber(item.auditPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-color contract"></span>合同价</span>
        <span class="legend-item"><span class="legend-color audit"></span>审定价</span>
      </div>
    </div>

    <!-- 核心数据表 -->
    <div class="table-container">
      <div class="table-scroll-wrapper">
        <el-table
          :data="sortedTreeData"
          border
          stripe
          row-key="id"
          :tree-props="{ children: 'children' }"
          default-expand-all
          :height="tableHeight"
          class="summary-table"
          show-summary
          :summary-method="getSummaries"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="branch" label="分公司" width="120" fixed="left" />
          <el-table-column prop="category1" label="一级分类" width="120" fixed="left" />
          <el-table-column prop="category2" label="二级分类" width="120" />
          <el-table-column prop="category3" label="三级分类" width="120" />
          <el-table-column prop="projectCount" label="项目数量" width="100" align="right" sortable="custom">
            <template #default="scope">
              <span v-if="scope.row.children">{{ scope.row.projectCount }}</span>
              <span v-else>{{ scope.row.projectCount }}</span>
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
          <el-table-column prop="riskLevel" label="风险等级" width="100" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.riskLevel === '高风险' ? 'danger' : 'success'" size="small">
                {{ scope.row.riskLevel }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
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

const category1Options = ['水务', '水环境治理', '水利', '城市更新', '市政路桥房建', '固废处理与处置', '土壤修复', '其他']

// 一级→二级分类映射
const category2Map = {
  '水务': ['供水工程', '排水工程', '污水处理', '管网工程'],
  '水环境治理': ['河道治理', '湖泊整治', '黑臭水体治理', '生态修复'],
  '水利': ['水库工程', '灌溉工程', '防洪工程', '水闸泵站'],
  '城市更新': ['旧城改造', '城中村改造', '老旧小区改造'],
  '市政路桥房建': ['道路工程', '桥梁工程', '隧道工程', '房建工程'],
  '固废处理与处置': ['垃圾处理', '危废处置', '污泥处理'],
  '土壤修复': ['污染土壤修复', '矿山修复'],
  '其他': ['其他工程']
}

// 二级→三级分类映射
const category3Map = {
  '供水工程': ['自来水厂', '供水管网', '加压泵站'],
  '排水工程': ['雨水分流', '污水管网', '排涝泵站'],
  '污水处理': ['污水处理厂', '再生水利用', '污泥处理'],
  '管网工程': ['主管网', '支管网', '接驳工程'],
  '河道治理': ['清淤疏浚', '护岸工程', '水系连通'],
  '湖泊整治': ['湖泊清淤', '生态护坡', '水质改善'],
  '黑臭水体治理': ['截污工程', '曝气增氧', '生态浮岛'],
  '生态修复': ['水生植物', '人工湿地', '生态护岸'],
  '水库工程': ['大坝工程', '溢洪道', '放空建筑物'],
  '灌溉工程': ['渠道工程', '泵站工程', '节水灌溉'],
  '防洪工程': ['堤防工程', '防洪闸', '排涝站'],
  '水闸泵站': ['节制闸', '排水泵站', '引水闸'],
  '旧城改造': ['房屋征收', '基础设施', '配套建设'],
  '城中村改造': ['拆迁安置', '市政配套', '环境整治'],
  '老旧小区改造': ['外墙改造', '管网更新', '加装电梯'],
  '道路工程': ['城市道路', '公路工程', '园区道路'],
  '桥梁工程': ['跨河桥', '立交桥', '人行天桥'],
  '隧道工程': ['盾构隧道', '明挖隧道', '暗挖隧道'],
  '房建工程': ['住宅建筑', '公共建筑', '工业厂房'],
  '垃圾处理': ['垃圾焚烧', '垃圾填埋', '垃圾分类'],
  '危废处置': ['医疗废物', '工业废物', '化学废物'],
  '污泥处理': ['污泥干化', '污泥焚烧', '污泥填埋'],
  '污染土壤修复': ['重金属修复', '有机物修复', '复合修复'],
  '矿山修复': ['边坡治理', '植被恢复', '土地复垦'],
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
            deviationCount: avgOutputProfitRate < avgTargetProfitRate ? Math.floor(projectCount * randomNumber(0.1, 0.5)) : 0,
            riskLevel: avgOutputProfitRate < avgTargetProfitRate ? '高风险' : '正常'
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

// ============================ 构建树形表格数据 ============================

const treeTableData = computed(() => {
  const data = filteredData.value
  const totalContractPrice = data.reduce((sum, item) => sum + item.contractPrice, 0)

  // 按 分公司 → 一级 → 二级 → 三级 聚合
  const branchMap = {}

  data.forEach(item => {
    if (!branchMap[item.branch]) {
      branchMap[item.branch] = {}
    }
    if (!branchMap[item.branch][item.category1]) {
      branchMap[item.branch][item.category1] = {}
    }
    if (!branchMap[item.branch][item.category1][item.category2]) {
      branchMap[item.branch][item.category1][item.category2] = []
    }
    branchMap[item.branch][item.category1][item.category2].push(item)
  })

  const tree = []
  let branchIdx = 0

  Object.keys(branchMap).sort().forEach(branch => {
    branchIdx++
    const branchNode = {
      id: `b${branchIdx}`,
      branch,
      category1: '',
      category2: '',
      category3: '',
      projectCount: 0,
      contractPrice: 0,
      auditPrice: 0,
      avgTargetProfitRate: 0,
      avgOutputProfitRate: 0,
      profitDeviation: 0,
      deviationCount: 0,
      riskLevel: '',
      contractRatio: 0,
      children: []
    }

    let c1Idx = 0
    Object.keys(branchMap[branch]).sort().forEach(c1 => {
      c1Idx++
      const c1Node = {
        id: `b${branchIdx}-c1${c1Idx}`,
        branch: '',
        category1: c1,
        category2: '',
        category3: '',
        projectCount: 0,
        contractPrice: 0,
        auditPrice: 0,
        avgTargetProfitRate: 0,
        avgOutputProfitRate: 0,
        profitDeviation: 0,
        deviationCount: 0,
        riskLevel: '',
        contractRatio: 0,
        children: []
      }

      let c2Idx = 0
      Object.keys(branchMap[branch][c1]).sort().forEach(c2 => {
        c2Idx++
        const c2Node = {
          id: `b${branchIdx}-c1${c1Idx}-c2${c2Idx}`,
          branch: '',
          category1: '',
          category2: c2,
          category3: '',
          projectCount: 0,
          contractPrice: 0,
          auditPrice: 0,
          avgTargetProfitRate: 0,
          avgOutputProfitRate: 0,
          profitDeviation: 0,
          deviationCount: 0,
          riskLevel: '',
          contractRatio: 0,
          children: []
        }

        const c3Items = branchMap[branch][c1][c2]
        c3Items.forEach((item, idx) => {
          const c3Node = {
            id: `${c2Node.id}-c3${idx + 1}`,
            branch: '',
            category1: '',
            category2: '',
            category3: item.category3,
            projectCount: item.projectCount,
            contractPrice: item.contractPrice,
            auditPrice: item.auditPrice,
            avgTargetProfitRate: item.avgTargetProfitRate,
            avgOutputProfitRate: item.avgOutputProfitRate,
            profitDeviation: item.profitDeviation,
            deviationCount: item.deviationCount,
            riskLevel: item.riskLevel,
            contractRatio: totalContractPrice > 0 ? (item.contractPrice / totalContractPrice * 100) : 0
          }
          c2Node.children.push(c3Node)
        })

        // 汇总二级
        c2Node.projectCount = c3Items.reduce((s, i) => s + i.projectCount, 0)
        c2Node.contractPrice = c3Items.reduce((s, i) => s + i.contractPrice, 0)
        c2Node.auditPrice = c3Items.reduce((s, i) => s + i.auditPrice, 0)
        c2Node.avgTargetProfitRate = c3Items.length > 0
          ? c3Items.reduce((s, i) => s + i.avgTargetProfitRate * i.contractPrice, 0) / c2Node.contractPrice
          : 0
        c2Node.avgOutputProfitRate = c3Items.length > 0
          ? c3Items.reduce((s, i) => s + i.avgOutputProfitRate * i.contractPrice, 0) / c2Node.contractPrice
          : 0
        c2Node.profitDeviation = Number((c2Node.avgOutputProfitRate - c2Node.avgTargetProfitRate).toFixed(2))
        c2Node.deviationCount = c3Items.reduce((s, i) => s + i.deviationCount, 0)
        c2Node.riskLevel = c2Node.profitDeviation < 0 ? '高风险' : '正常'
        c2Node.contractRatio = totalContractPrice > 0 ? (c2Node.contractPrice / totalContractPrice * 100) : 0

        c1Node.children.push(c2Node)
      })

      // 汇总一级
      const c2All = c1Node.children
      c1Node.projectCount = c2All.reduce((s, i) => s + i.projectCount, 0)
      c1Node.contractPrice = c2All.reduce((s, i) => s + i.contractPrice, 0)
      c1Node.auditPrice = c2All.reduce((s, i) => s + i.auditPrice, 0)
      c1Node.avgTargetProfitRate = c1Node.contractPrice > 0
        ? c2All.reduce((s, i) => s + i.avgTargetProfitRate * i.contractPrice, 0) / c1Node.contractPrice
        : 0
      c1Node.avgOutputProfitRate = c1Node.contractPrice > 0
        ? c2All.reduce((s, i) => s + i.avgOutputProfitRate * i.contractPrice, 0) / c1Node.contractPrice
        : 0
      c1Node.profitDeviation = Number((c1Node.avgOutputProfitRate - c1Node.avgTargetProfitRate).toFixed(2))
      c1Node.deviationCount = c2All.reduce((s, i) => s + i.deviationCount, 0)
      c1Node.riskLevel = c1Node.profitDeviation < 0 ? '高风险' : '正常'
      c1Node.contractRatio = totalContractPrice > 0 ? (c1Node.contractPrice / totalContractPrice * 100) : 0

      branchNode.children.push(c1Node)
    })

    // 汇总分公司
    const c1All = branchNode.children
    branchNode.projectCount = c1All.reduce((s, i) => s + i.projectCount, 0)
    branchNode.contractPrice = c1All.reduce((s, i) => s + i.contractPrice, 0)
    branchNode.auditPrice = c1All.reduce((s, i) => s + i.auditPrice, 0)
    branchNode.avgTargetProfitRate = branchNode.contractPrice > 0
      ? c1All.reduce((s, i) => s + i.avgTargetProfitRate * i.contractPrice, 0) / branchNode.contractPrice
      : 0
    branchNode.avgOutputProfitRate = branchNode.contractPrice > 0
      ? c1All.reduce((s, i) => s + i.avgOutputProfitRate * i.contractPrice, 0) / branchNode.contractPrice
      : 0
    branchNode.profitDeviation = Number((branchNode.avgOutputProfitRate - branchNode.avgTargetProfitRate).toFixed(2))
    branchNode.deviationCount = c1All.reduce((s, i) => s + i.deviationCount, 0)
    branchNode.riskLevel = branchNode.profitDeviation < 0 ? '高风险' : '正常'
    branchNode.contractRatio = totalContractPrice > 0 ? (branchNode.contractPrice / totalContractPrice * 100) : 0

    tree.push(branchNode)
  })

  return tree
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

// ============================ 图表数据 ============================

const branchChartData = computed(() => {
  const data = filteredData.value
  const branchMap = {}

  branchOptions.forEach(b => { branchMap[b] = { contractPrice: 0, auditPrice: 0 } })
  data.forEach(item => {
    if (!branchMap[item.branch]) branchMap[item.branch] = { contractPrice: 0, auditPrice: 0 }
    branchMap[item.branch].contractPrice += item.contractPrice
    branchMap[item.branch].auditPrice += item.auditPrice
  })

  const result = Object.keys(branchMap).map(b => ({
    branch: b,
    contractPrice: branchMap[b].contractPrice,
    auditPrice: branchMap[b].auditPrice
  })).filter(item => item.contractPrice > 0 || item.auditPrice > 0)

  const maxVal = Math.max(...result.map(r => Math.max(r.contractPrice, r.auditPrice)), 1)
  result.forEach(r => {
    r.contractWidth = (r.contractPrice / maxVal * 100)
    r.auditWidth = (r.auditPrice / maxVal * 100)
  })

  return result
})

// ============================ 排序 ============================

const sortProp = ref('')
const sortOrder = ref('')

const handleSortChange = ({ prop, order }) => {
  sortProp.value = prop || ''
  sortOrder.value = order || ''
}

const sortTree = (nodes) => {
  if (!sortProp.value || !sortOrder.value) return nodes
  const sortFn = (a, b) => {
    const va = a[sortProp.value] ?? 0
    const vb = b[sortProp.value] ?? 0
    return sortOrder.value === 'ascending' ? va - vb : vb - va
  }
  return [...nodes].sort(sortFn).map(node => {
    if (node.children) {
      return { ...node, children: sortTree(node.children) }
    }
    return node
  })
}

// 排序后的树形数据
const sortedTreeData = computed(() => {
  return sortTree(treeTableData.value)
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
    if (prop === 'riskLevel') return ''
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
  // 展开树形数据为平铺行
  const flatRows = []
  const flatten = (nodes, level = 0) => {
    nodes.forEach(node => {
      flatRows.push({
        branch: node.branch,
        category1: node.category1,
        category2: node.category2,
        category3: node.category3,
        projectCount: node.projectCount,
        contractPrice: node.contractPrice,
        auditPrice: node.auditPrice,
        contractRatio: node.contractRatio.toFixed(2) + '%',
        avgTargetProfitRate: node.avgTargetProfitRate.toFixed(2) + '%',
        avgOutputProfitRate: node.avgOutputProfitRate.toFixed(2) + '%',
        profitDeviation: node.profitDeviation.toFixed(2) + '%',
        deviationCount: node.deviationCount,
        riskLevel: node.riskLevel || ''
      })
      if (node.children) {
        flatten(node.children, level + 1)
      }
    })
  }
  flatten(treeTableData.value)

  const headers = [
    '分公司', '一级分类', '二级分类', '三级分类', '项目数量',
    '合同价(不含税)', '审定价(不含税)', '合同金额占比',
    '平均目标利润率', '平均销项利润率', '利润率偏差', '负偏差项目个数', '风险等级'
  ]

  let csv = headers.join(',') + '\n'
  flatRows.forEach(row => {
    csv += [
      row.branch, row.category1, row.category2, row.category3,
      row.projectCount, row.contractPrice, row.auditPrice,
      row.contractRatio, row.avgTargetProfitRate, row.avgOutputProfitRate,
      row.profitDeviation, row.deviationCount, row.riskLevel
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

.chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 80px;
  font-size: 13px;
  color: #666;
  flex-shrink: 0;
}

.bar-row {
  flex: 1;
  display: flex;
  align-items: center;
}

.bar {
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  min-width: 40px;
  transition: width 0.5s ease;
}

.bar-contract {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.bar-audit {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.bar-text {
  font-size: 11px;
  color: #fff;
  white-space: nowrap;
}

.chart-legend {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 12px;
  border-radius: 2px;
  margin-right: 6px;
}

.legend-color.contract {
  background: #3b82f6;
}

.legend-color.audit {
  background: #f59e0b;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-scroll-wrapper {
  overflow-x: auto;
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
  background-color: #4a6fa5;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
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

:deep(.el-table .el-table__body-wrapper .el-table__body) {
  width: max-content;
}
</style>
