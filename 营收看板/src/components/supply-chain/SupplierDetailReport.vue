<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">项目采购合同（系统已有）</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：元</span>
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

    <div class="mb-3 text-sm text-gray-500 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg px-4 py-2">
      注：需在系统现有的"项目采购合同"列表增加"合同开始时间"、"合同计划/实际结束时间"。
    </div>

    <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">供应商名称：</label>
        <el-select 
          v-model="selectedSupplier" 
          placeholder="请选择供应商名称" 
          class="w-64"
          clearable
        >
          <el-option 
            v-for="supplier in allSuppliers" 
            :key="supplier" 
            :label="supplier" 
            :value="supplier" 
          />
        </el-select>
      </div>
      
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">合同分类：</label>
        <el-select 
          v-model="selectedCategory" 
          placeholder="请选择合同分类" 
          class="w-64"
          clearable
        >
          <el-option value="全部" label="全部" />
          <el-option value="专业分包" label="专业分包" />
          <el-option value="劳务分包" label="劳务分包" />
          <el-option value="材料/设备采购" label="材料/设备采购" />
          <el-option value="周转材料/设备租赁" label="周转材料/设备租赁" />
        </el-select>
      </div>
      
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目名称：</label>
        <el-select 
          v-model="selectedProject" 
          placeholder="请选择项目名称" 
          class="w-64"
          clearable
        >
          <el-option 
            v-for="project in allProjects" 
            :key="project" 
            :label="project" 
            :value="project" 
          />
        </el-select>
      </div>
      
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">合同状态：</label>
        <el-select 
          v-model="selectedStatus" 
          placeholder="请选择合同状态" 
          class="w-64"
          clearable
        >
          <el-option 
            v-for="status in allStatus" 
            :key="status" 
            :label="status" 
            :value="status" 
          />
        </el-select>
      </div>

      <div class="flex items-center gap-2 ml-auto">
        <button
          class="flex items-center px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          @click="handleSearch"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          搜索
        </button>
        <button
          class="flex items-center px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
          @click="handleReset"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置
        </button>
      </div>
    </div>

    <div style="max-width: 100%;">
      <el-table
        :data="filteredData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :max-height="600"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        />
        
        <el-table-column
          label="供应商名称"
          prop="supplierName"
          width="180"
        />
        
        <el-table-column
          label="供应商等级"
          prop="supplierLevel"
          width="120"
          align="center"
        >
          <template #default="scope">
            <span :class="getLevelClass(scope.row.supplierLevel)">
              {{ scope.row.supplierLevel }}级
            </span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="项目名称"
          prop="projectName"
          width="200"
        />
        
        <el-table-column
          label="基层单位"
          prop="unit"
          width="150"
          align="center"
        />
        
        <el-table-column
          label="分包合同名称"
          prop="contractName"
          width="200"
        />
        
        <el-table-column
          label="合同分类"
          prop="category"
          width="130"
          align="center"
        />
        
        <el-table-column
          label="合同金额（不含税）"
          prop="amount"
          width="150"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.amount) }}
          </template>
        </el-table-column>
        
        <el-table-column
          label="合同开始时间"
          prop="startTime"
          width="130"
          align="center"
        />
        
        <el-table-column
          label="合同计划/实际结束时间"
          prop="endTime"
          width="180"
          align="center"
        />
        
        <el-table-column
          label="合同状态"
          prop="status"
          width="120"
          align="center"
        >
          <template #default="scope">
            <span :class="getStatusClass(scope.row.status)">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedSupplier = ref('')
const selectedCategory = ref('')
const selectedProject = ref('')
const selectedStatus = ref('')

const allSuppliers = [
  '北京华建工程有限公司',
  '上海水务建设集团',
  '广州管道工程公司',
  '深圳环保科技有限公司',
  '杭州城建集团',
  '南京水务工程公司',
  '成都建工集团',
  '武汉市政工程公司'
]

const allProjects = [
  '城乡水务局供水管网改造工程',
  '生态环境治理项目',
  '区域供水一体化工程',
  '市政道路新建项目',
  '污水处理厂升级改造',
  '管道改造二期工程',
  '水务综合管理平台',
  '智慧水务云平台'
]

const allStatus = ['待建', '在建', '待结算', '结算已完成']

const rawData = [
  {
    supplierName: '北京华建工程有限公司',
    supplierLevel: 'A',
    projectName: '城乡水务局供水管网改造工程',
    unit: '管网事业部',
    contractName: '管道安装分包合同',
    category: '专业分包',
    amount: 5000000,
    startTime: '2026-01-15',
    endTime: '2026-06-30',
    status: '在建'
  },
  {
    supplierName: '上海水务建设集团',
    supplierLevel: 'A',
    projectName: '城乡水务局供水管网改造工程',
    unit: '管网事业部',
    contractName: '管材采购合同',
    category: '材料/设备采购',
    amount: 3000000,
    startTime: '2026-01-10',
    endTime: '2026-02-10',
    status: '结算已完成'
  },
  {
    supplierName: '广州管道工程公司',
    supplierLevel: 'B',
    projectName: '生态环境治理项目',
    unit: '生态事业部',
    contractName: '绿化工程分包合同',
    category: '专业分包',
    amount: 4000000,
    startTime: '2026-01-01',
    endTime: '2026-05-31',
    status: '在建'
  },
  {
    supplierName: '深圳环保科技有限公司',
    supplierLevel: 'C',
    projectName: '生态环境治理项目',
    unit: '生态事业部',
    contractName: '苗木采购合同',
    category: '材料/设备采购',
    amount: 1200000,
    startTime: '2026-02-05',
    endTime: '2026-02-28',
    status: '结算已完成'
  },
  {
    supplierName: '杭州城建集团',
    supplierLevel: 'A',
    projectName: '区域供水一体化工程',
    unit: '区域事业部',
    contractName: '水厂建设分包合同',
    category: '专业分包',
    amount: 8000000,
    startTime: '2026-02-15',
    endTime: '2026-12-31',
    status: '待建'
  },
  {
    supplierName: '南京水务工程公司',
    supplierLevel: 'B',
    projectName: '区域供水一体化工程',
    unit: '区域事业部',
    contractName: '净水设备采购合同',
    category: '材料/设备采购',
    amount: 3500000,
    startTime: '2026-02-20',
    endTime: '2026-04-30',
    status: '在建'
  },
  {
    supplierName: '成都建工集团',
    supplierLevel: 'A',
    projectName: '市政道路新建项目',
    unit: '市政事业部',
    contractName: '道路工程分包合同',
    category: '专业分包',
    amount: 6000000,
    startTime: '2026-01-10',
    endTime: '2026-07-31',
    status: '在建'
  },
  {
    supplierName: '武汉市政工程公司',
    supplierLevel: 'C',
    projectName: '市政道路新建项目',
    unit: '市政事业部',
    contractName: '沥青采购合同',
    category: '材料/设备采购',
    amount: 1500000,
    startTime: '2026-02-10',
    endTime: '2026-02-28',
    status: '待结算'
  },
  {
    supplierName: '北京华建工程有限公司',
    supplierLevel: 'A',
    projectName: '污水处理厂升级改造',
    unit: '环境建设',
    contractName: '污水处理设备安装合同',
    category: '专业分包',
    amount: 5500000,
    startTime: '2026-01-01',
    endTime: '2026-03-31',
    status: '结算已完成'
  },
  {
    supplierName: '上海水务建设集团',
    supplierLevel: 'A',
    projectName: '污水处理厂升级改造',
    unit: '环境建设',
    contractName: '污水处理设备采购合同',
    category: '材料/设备采购',
    amount: 4000000,
    startTime: '2026-01-05',
    endTime: '2026-02-20',
    status: '结算已完成'
  },
  {
    supplierName: '广州管道工程公司',
    supplierLevel: 'B',
    projectName: '管道改造二期工程',
    unit: '管道工程',
    contractName: '管道敷设分包合同',
    category: '专业分包',
    amount: 3500000,
    startTime: '2026-01-28',
    endTime: '2026-06-30',
    status: '在建'
  },
  {
    supplierName: '深圳环保科技有限公司',
    supplierLevel: 'C',
    projectName: '管道改造二期工程',
    unit: '管道工程',
    contractName: '阀门采购合同',
    category: '材料/设备采购',
    amount: 800000,
    startTime: '2026-01-01',
    endTime: '2026-02-15',
    status: '待结算'
  },
  {
    supplierName: '杭州城建集团',
    supplierLevel: 'A',
    projectName: '水务综合管理平台',
    unit: '管道分公司',
    contractName: '系统集成分包合同',
    category: '专业分包',
    amount: 6500000,
    startTime: '2026-01-20',
    endTime: '2026-09-30',
    status: '在建'
  },
  {
    supplierName: '南京水务工程公司',
    supplierLevel: 'B',
    projectName: '水务综合管理平台',
    unit: '管道分公司',
    contractName: '传感器采购合同',
    category: '材料/设备采购',
    amount: 2000000,
    startTime: '2026-02-08',
    endTime: '2026-03-15',
    status: '在建'
  },
  {
    supplierName: '成都建工集团',
    supplierLevel: 'A',
    projectName: '智慧水务云平台',
    unit: '运营养护',
    contractName: '云平台开发合同',
    category: '专业分包',
    amount: 8500000,
    startTime: '2026-01-18',
    endTime: '2026-12-31',
    status: '待建'
  },
  {
    supplierName: '武汉市政工程公司',
    supplierLevel: 'C',
    projectName: '智慧水务云平台',
    unit: '运营养护',
    contractName: '服务器采购合同',
    category: '材料/设备采购',
    amount: 3000000,
    startTime: '2026-01-02',
    endTime: '2026-03-01',
    status: '待结算'
  }
]

const props = defineProps({
  reportFilter: {
    type: Object,
    default: () => ({})
  }
})

const filteredData = computed(() => {
  let data = [...rawData]
  
  if (props.reportFilter.supplierLevel) {
    data = data.filter(item => item.supplierLevel === props.reportFilter.supplierLevel)
  }
  
  if (props.reportFilter.category && props.reportFilter.category !== '全部') {
    data = data.filter(item => item.category === props.reportFilter.category)
  }
  
  if (props.reportFilter.supplierName) {
    data = data.filter(item => item.supplierName === props.reportFilter.supplierName)
  }
  
  if (selectedSupplier.value) {
    data = data.filter(item => item.supplierName === selectedSupplier.value)
  }
  
  if (selectedCategory.value && selectedCategory.value !== '全部') {
    data = data.filter(item => item.category === selectedCategory.value)
  }
  
  if (selectedProject.value) {
    data = data.filter(item => item.projectName === selectedProject.value)
  }
  
  if (selectedStatus.value) {
    data = data.filter(item => item.status === selectedStatus.value)
  }
  
  return data
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0 })
}

const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums.push('合计')
      return
    }
    if (column.prop === 'amount') {
      const total = data.reduce((sum, item) => {
        return sum + Number(item[column.prop])
      }, 0)
      sums.push(formatNumber(total))
    } else {
      sums.push('')
    }
  })
  return sums
}

const getStatusClass = (status) => {
  switch (status) {
    case '待建':
      return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm'
    case '在建':
      return 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm'
    case '待结算':
      return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm'
    case '结算已完成':
      return 'bg-green-100 text-green-700 px-2 py-1 rounded text-sm'
    default:
      return ''
  }
}

const getLevelClass = (level) => {
  switch (level) {
    case 'A':
      return 'bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium'
    case 'B':
      return 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium'
    case 'C':
      return 'bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-medium'
    default:
      return ''
  }
}

const handleSearch = () => {
  // 搜索：filteredData computed 已自动响应筛选条件变化
}

const handleReset = () => {
  selectedSupplier.value = ''
  selectedCategory.value = ''
  selectedProject.value = ''
  selectedStatus.value = ''
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>