<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">供应商合同签订报表</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：元</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded">数据源：经济管理-分包分供策划</span>
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
    </div>

    <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目名称：</label>
        <el-input v-model="selectedProject" placeholder="请输入项目名称" class="w-48" clearable />
      </div>
      
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">基层单位：</label>
        <el-select 
          v-model="selectedUnit" 
          placeholder="请选择基层单位" 
          class="w-64"
          clearable
        >
          <el-option 
            v-for="unit in allUnits" 
            :key="unit" 
            :label="unit" 
            :value="unit" 
          />
        </el-select>
      </div>
      
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目状态：</label>
        <el-select 
          v-model="selectedStatus" 
          placeholder="请选择项目状态" 
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
      
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">合同分类：</label>
        <el-select 
          v-model="selectedCategory" 
          placeholder="请选择合同分类" 
          class="w-64"
          clearable
        >
          <el-option 
            v-for="category in allCategories" 
            :key="category" 
            :label="category" 
            :value="category" 
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">供应商名称：</label>
        <el-input v-model="selectedSupplier" placeholder="请输入供应商名称" class="w-48" clearable />
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">合同状态：</label>
        <el-select
          v-model="selectedContractStatus"
          placeholder="请选择合同状态"
          class="w-64"
          clearable
        >
          <el-option
            v-for="cs in allContractStatus"
            :key="cs"
            :label="cs"
            :value="cs"
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">供应商等级：</label>
        <el-select
          v-model="selectedSupplierLevel"
          placeholder="请选择供应商等级"
          class="w-64"
          clearable
        >
          <el-option
            v-for="level in allSupplierLevels"
            :key="level"
            :label="level"
            :value="level"
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">签订状态：</label>
        <el-select
          v-model="selectedSignStatus"
          placeholder="请选择签订状态"
          class="w-64"
          clearable
        >
          <el-option
            v-for="signStatus in allSignStatus"
            :key="signStatus"
            :label="signStatus"
            :value="signStatus"
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">超期天数：</label>
        <el-select 
          v-model="selectedOverdue" 
          placeholder="请选择超期天数" 
          class="w-64"
          clearable
        >
          <el-option 
            v-for="option in allOverdueOptions" 
            :key="option.value" 
            :label="option.label" 
            :value="option.value" 
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

    <div class="overflow-x-auto" style="max-width: 100%;">
      <el-table
        :data="paginatedTableData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        />
        
        <el-table-column
          label="签订状态"
          prop="signStatus"
          width="100"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.signStatus === '已签订'" class="text-green-600 font-medium">已签订</span>
            <span v-else :class="getSignStatusClass(scope.row)">{{ getWarningLabel(scope.row) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="项目编号"
          prop="projectCode"
          width="120"
          align="center"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />
        
        <el-table-column
          label="项目名称"
          prop="projectName"
          width="200"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />
        
        <el-table-column
          label="基层单位（简称）"
          prop="unit"
          width="150"
          align="center"
        />
        
        <el-table-column
          label="项目状态"
          prop="status"
          width="120"
          align="center"
        />
        
        <el-table-column
          label="合同分类"
          prop="category"
          width="130"
          align="center"
        />

        <el-table-column
          label="供应商名称"
          prop="supplierName"
          width="160"
        />

        <el-table-column
          label="供应商等级"
          prop="supplierLevel"
          width="110"
          align="center"
        >
          <template #default="scope">
            <span :class="getSupplierLevelClass(scope.row.supplierLevel)">
              {{ scope.row.supplierLevel }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="合同状态"
          prop="contractStatus"
          width="120"
          align="center"
        >
          <template #default="scope">
            <span :class="getContractStatusClass(scope.row.contractStatus)">
              {{ scope.row.contractStatus }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="分包合同名称"
          prop="contractName"
          width="200"
        />
        
        <el-table-column
          label="工作范围及内容"
          prop="workScope"
          width="200"
        />
        
        <el-table-column
          label="主要工程量"
          prop="workVolume"
          width="120"
          align="center"
        />
        
        <el-table-column
          label="初始策划金额"
          prop="plannedAmount"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.plannedAmount) }}
          </template>
        </el-table-column>
        
        <el-table-column
          label="合同选用形式"
          prop="contractForm"
          width="120"
          align="center"
        />
        
        <el-table-column
          label="计划签订日期"
          prop="plannedDate"
          width="130"
          align="center"
        />

        <el-table-column
          label="实际签订日期"
          prop="actualDate"
          width="130"
          align="center"
        />

        <el-table-column
          label="合同开始时间"
          prop="contractStartDate"
          width="130"
          align="center"
        />

        <el-table-column
          label="合同计划/实际结束时间"
          prop="contractEndDate"
          width="160"
          align="center"
        />
        
        <el-table-column
          label="超期天数"
          prop="overdueDays"
          width="100"
          align="center"
        >
          <template #default="scope">
            <span :class="scope.row.overdueDays > 0 ? 'text-red-500 font-medium' : ''">
              {{ scope.row.overdueDays }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-3">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="tableData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  initialFilter: {
    type: Object,
    default: () => ({})
  }
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

const selectedProject = ref('')
const selectedUnit = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')
const selectedSignStatus = ref('')
const selectedSupplier = ref('')
const selectedContractStatus = ref('')
const selectedOverdue = ref('')
const selectedSupplierLevel = ref('')
const allSupplierLevels = ['A', 'B', 'C']

const allUnits = [
  '管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设',
  '管道工程', '管道分公司', '运营养护', '二次养护', '浦东供排水'
]

const allStatus = ['在建', '停工', '完工', '竣工未送审', '已送审', '审定未销项', '业务销项', '财务销项']
const allCategories = ['专业分包', '劳务分包', '材料/设备采购', '周转材料/设备租赁']
const allSignStatus = ['已签订', '未签订', '红色预警', '橙色预警', '黄色预警']
const allContractStatus = ['正常履约', '履约结束', '违约中']
const allOverdueOptions = [
  { label: '超期21-44天', value: '21-44' },
  { label: '超期45-60天', value: '45-60' },
  { label: '超期60天及以上', value: '60+' }
]

const rawData = [
  {
    projectCode: 'P001',
    projectName: '城乡水务局供水管网改造工程',
    unit: '管网事业部',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        supplierName: '北京华建工程有限公司',
        supplierLevel: 'A',
        contractStatus: '正常履约',
        contractName: '管道安装分包合同',
        workScope: 'DN300-DN800管道安装及调试',
        workVolume: '5000米',
        plannedAmount: 5000000,
        contractForm: '公开招标',
        plannedDate: '2026-01-15',
        actualDate: '2026-02-20',
        signStatus: '已签订',
        overdueDays: 30,
        contractStartDate: '2026-02-20',
        contractEndDate: '2027-08-20'
      },
      {
        category: '劳务分包',
        supplierName: '深圳劳务有限公司',
        supplierLevel: 'B',
        contractStatus: '正常履约',
        contractName: '管道安装劳务合同',
        workScope: '管道安装劳务作业',
        workVolume: '5000米',
        plannedAmount: 1500000,
        contractForm: '邀请招标',
        plannedDate: '2026-01-20',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 55,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '材料/设备采购',
        supplierName: '上海水务建设集团',
        supplierLevel: 'A',
        contractStatus: '履约结束',
        contractName: '管材采购合同',
        workScope: 'PE管材采购及运输',
        workVolume: '5000米',
        plannedAmount: 3000000,
        contractForm: '集采',
        plannedDate: '2026-01-10',
        actualDate: '2026-01-10',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-01-10',
        contractEndDate: '2026-10-10'
      },
      {
        category: '周转材料/设备租赁',
        supplierName: '广州设备租赁公司',
        supplierLevel: 'C',
        contractStatus: '正常履约',
        contractName: '挖掘机租赁合同',
        workScope: '土方开挖设备租赁',
        workVolume: '2台',
        plannedAmount: 500000,
        contractForm: '比价',
        plannedDate: '2026-02-01',
        actualDate: '2026-02-04',
        signStatus: '已签订',
        overdueDays: 3,
        contractStartDate: '2026-02-04',
        contractEndDate: '2026-06-04'
      },
      {
        category: '材料/设备采购',
        supplierName: '天津建材供应公司',
        supplierLevel: 'B',
        contractStatus: '正常履约',
        contractName: '阀门配件采购合同',
        workScope: '各类阀门及管件采购',
        workVolume: '1批',
        plannedAmount: 800000,
        contractForm: '比价',
        plannedDate: '2026-03-01',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 12,
        contractStartDate: '',
        contractEndDate: ''
      }
    ]
  },
  {
    projectCode: 'P002',
    projectName: '生态环境治理项目',
    unit: '生态事业部',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        supplierName: '广州管道工程公司',
        supplierLevel: 'B',
        contractStatus: '正常履约',
        contractName: '绿化工程分包合同',
        workScope: '景观绿化种植及养护',
        workVolume: '10万平方米',
        plannedAmount: 4000000,
        contractForm: '公开招标',
        plannedDate: '2026-01-01',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 65,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '劳务分包',
        supplierName: '杭州劳务公司',
        supplierLevel: 'C',
        contractStatus: '正常履约',
        contractName: '绿化养护劳务合同',
        workScope: '绿化养护劳务作业',
        workVolume: '10万平方米',
        plannedAmount: 800000,
        contractForm: '竞争性谈判',
        plannedDate: '2026-01-25',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 25,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '材料/设备采购',
        supplierName: '深圳环保科技有限公司',
        supplierLevel: 'C',
        contractStatus: '履约结束',
        contractName: '苗木采购合同',
        workScope: '苗木采购及运输',
        workVolume: '5000株',
        plannedAmount: 1200000,
        contractForm: '集采',
        plannedDate: '2026-02-05',
        actualDate: '2026-02-07',
        signStatus: '已签订',
        overdueDays: 2,
        contractStartDate: '2026-02-07',
        contractEndDate: '2026-11-07'
      },
      {
        category: '劳务分包',
        supplierName: '苏州园林养护公司',
        supplierLevel: 'C',
        contractStatus: '正常履约',
        contractName: '景观绿化补种劳务合同',
        workScope: '苗木补种及日常养护',
        workVolume: '2万平方米',
        plannedAmount: 300000,
        contractForm: '竞争性谈判',
        plannedDate: '2026-03-05',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 7,
        contractStartDate: '',
        contractEndDate: ''
      }
    ]
  },
  {
    projectCode: 'P003',
    projectName: '区域供水一体化工程',
    unit: '区域事业部',
    status: '已送审',
    contracts: [
      {
        category: '专业分包',
        contractName: '水厂建设分包合同',
        workScope: '水厂土建及安装工程',
        workVolume: '1座',
        plannedAmount: 8000000,
        contractForm: '公开招标',
        plannedDate: '2026-02-15',
        actualDate: '2026-02-15',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-02-15',
        contractEndDate: '2027-08-15'
      },
      {
        category: '材料/设备采购',
        contractName: '净水设备采购合同',
        workScope: '净水设备采购及安装',
        workVolume: '1套',
        plannedAmount: 3500000,
        contractForm: '集和',
        plannedDate: '2026-02-20',
        actualDate: '2026-02-20',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-02-20',
        contractEndDate: '2026-11-20'
      },
      {
        category: '周转材料/设备租赁',
        contractName: '塔吊租赁合同',
        workScope: '施工塔吊租赁',
        workVolume: '2台',
        plannedAmount: 600000,
        contractForm: '单一来源',
        plannedDate: '2026-03-01',
        actualDate: '2026-03-01',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-03-01',
        contractEndDate: '2026-07-01'
      },
      {
        category: '材料/设备采购',
        supplierName: '南京电气设备公司',
        supplierLevel: 'A',
        contractStatus: '正常履约',
        contractName: '配电柜采购合同',
        workScope: '高低压配电柜及配套设备',
        workVolume: '15台',
        plannedAmount: 1200000,
        contractForm: '集采',
        plannedDate: '2026-03-10',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 3,
        contractStartDate: '',
        contractEndDate: ''
      }
    ]
  },
  {
    projectCode: 'P004',
    projectName: '市政道路新建项目',
    unit: '市政事业部',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        contractName: '道路工程分包合同',
        workScope: '道路路基及路面施工',
        workVolume: '2公里',
        plannedAmount: 6000000,
        contractForm: '公开招标',
        plannedDate: '2026-01-10',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 35,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '劳务分包',
        contractName: '道路施工劳务合同',
        workScope: '道路施工劳务作业',
        workVolume: '2公里',
        plannedAmount: 1200000,
        contractForm: '邀请招标',
        plannedDate: '2026-01-05',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 70,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '材料/设备采购',
        contractName: '沥青采购合同',
        workScope: '沥青材料采购',
        workVolume: '500吨',
        plannedAmount: 1500000,
        contractForm: '集采',
        plannedDate: '2026-02-10',
        actualDate: '2026-02-10',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-02-10',
        contractEndDate: '2026-11-10'
      }
    ]
  },
  {
    projectCode: 'P005',
    projectName: '污水处理厂升级改造',
    unit: '环境建设',
    status: '完工',
    contracts: [
      {
        category: '专业分包',
        contractName: '污水处理设备安装合同',
        workScope: '设备安装及调试',
        workVolume: '1套',
        plannedAmount: 5500000,
        contractForm: '公开招标',
        plannedDate: '2026-01-01',
        actualDate: '2026-01-01',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-01-01',
        contractEndDate: '2027-07-01'
      },
      {
        category: '材料/设备采购',
        contractName: '污水处理设备采购合同',
        workScope: '污水处理设备采购',
        workVolume: '1套',
        plannedAmount: 4000000,
        contractForm: '集和',
        plannedDate: '2026-01-05',
        actualDate: '2026-01-05',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-01-05',
        contractEndDate: '2026-10-05'
      }
    ]
  },
  {
    projectCode: 'P006',
    projectName: '管道改造二期工程',
    unit: '管道工程',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        contractName: '管道敷设分包合同',
        workScope: 'DN200-DN600管道敷设',
        workVolume: '3000米',
        plannedAmount: 3500000,
        contractForm: '公开招标',
        plannedDate: '2026-01-28',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 22,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '劳务分包',
        contractName: '管道敷设劳务合同',
        workScope: '管道敷设劳务作业',
        workVolume: '3000米',
        plannedAmount: 900000,
        contractForm: '邀请招标',
        plannedDate: '2026-01-12',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 48,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '材料/设备采购',
        contractName: '阀门采购合同',
        workScope: '阀门采购及运输',
        workVolume: '200个',
        plannedAmount: 800000,
        contractForm: '集采',
        plannedDate: '2026-01-01',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 75,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '周转材料/设备租赁',
        contractName: '吊车租赁合同',
        workScope: '管道吊装设备租赁',
        workVolume: '1台',
        plannedAmount: 300000,
        contractForm: '比价',
        plannedDate: '2026-02-15',
        actualDate: '2026-02-15',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-02-15',
        contractEndDate: '2026-06-15'
      }
    ]
  },
  {
    projectCode: 'P007',
    projectName: '水务综合管理平台',
    unit: '管道分公司',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        contractName: '系统集成分包合同',
        workScope: '智慧水务系统集成',
        workVolume: '1套',
        plannedAmount: 6500000,
        contractForm: '公开招标',
        plannedDate: '2026-01-20',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 40,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '劳务分包',
        contractName: '设备安装劳务合同',
        workScope: '设备安装劳务作业',
        workVolume: '1套',
        plannedAmount: 1100000,
        contractForm: '竞争性谈判',
        plannedDate: '2026-01-12',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 58,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '材料/设备采购',
        contractName: '传感器采购合同',
        workScope: '水质传感器采购',
        workVolume: '100套',
        plannedAmount: 2000000,
        contractForm: '集采',
        plannedDate: '2026-02-08',
        actualDate: '2026-02-08',
        signStatus: '已签订',
        overdueDays: 0
      },
      {
        category: '周转材料/设备租赁',
        contractName: '测试设备租赁合同',
        workScope: '检测设备租赁',
        workVolume: '5套',
        plannedAmount: 400000,
        contractForm: '单一来源',
        plannedDate: '2026-01-05',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 80,
        contractStartDate: '',
        contractEndDate: ''
      }
    ]
  },
  {
    projectCode: 'P008',
    projectName: '智慧水务云平台',
    unit: '运营养护',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        contractName: '云平台开发合同',
        workScope: '智慧水务云平台开发',
        workVolume: '1套',
        plannedAmount: 8500000,
        contractForm: '公开招标',
        plannedDate: '2026-01-18',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 28
      },
      {
        category: '劳务分包',
        contractName: '数据录入劳务合同',
        workScope: '数据录入及整理',
        workVolume: '10万条',
        plannedAmount: 500000,
        contractForm: '邀请招标',
        plannedDate: '2026-01-08',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 52
      },
      {
        category: '材料/设备采购',
        contractName: '服务器采购合同',
        workScope: '云服务器采购',
        workVolume: '20台',
        plannedAmount: 3000000,
        contractForm: '集采',
        plannedDate: '2026-01-02',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 68
      },
      {
        category: '周转材料/设备租赁',
        contractName: '临时办公设备租赁',
        workScope: '办公设备租赁',
        workVolume: '30套',
        plannedAmount: 200000,
        contractForm: '比价',
        plannedDate: '2026-02-05',
        actualDate: '2026-02-05',
        signStatus: '已签订',
        overdueDays: 0
      },
      {
        category: '专业分包',
        contractName: 'APP开发合同',
        workScope: '移动应用开发',
        workVolume: '2个',
        plannedAmount: 2000000,
        contractForm: '竞争性谈判',
        plannedDate: '2026-01-25',
        actualDate: '2026-01-25',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-01-25',
        contractEndDate: '2026-10-25'
      }
    ]
  },
  {
    projectCode: 'P009',
    projectName: '管网监测系统',
    unit: '二次养护',
    status: '已送审',
    contracts: [
      {
        category: '专业分包',
        contractName: '监测系统安装合同',
        workScope: '管网监测系统安装调试',
        workVolume: '500个点',
        plannedAmount: 5000000,
        contractForm: '公开招标',
        plannedDate: '2026-01-15',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 33,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '劳务分包',
        contractName: '现场施工劳务合同',
        workScope: '监测点现场施工',
        workVolume: '500个点',
        plannedAmount: 1000000,
        contractForm: '邀请招标',
        plannedDate: '2026-01-10',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 45
      },
      {
        category: '材料/设备采购',
        contractName: '监测设备采购合同',
        workScope: '管网监测设备采购',
        workVolume: '500套',
        plannedAmount: 3500000,
        contractForm: '集采',
        plannedDate: '2026-01-01',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 85,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '周转材料/设备租赁',
        contractName: '工程车租赁合同',
        workScope: '工程车辆租赁',
        workVolume: '10台',
        plannedAmount: 350000,
        contractForm: '单一来源',
        plannedDate: '2026-02-01',
        actualDate: '2026-02-01',
        signStatus: '已签订',
        overdueDays: 0
      },
      {
        category: '专业分包',
        contractName: '数据通信工程合同',
        workScope: '通信网络建设',
        workVolume: '1套',
        plannedAmount: 1500000,
        contractForm: '比价',
        plannedDate: '2026-01-22',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 24,
        contractStartDate: '',
        contractEndDate: ''
      }
    ]
  },
  {
    projectCode: 'P010',
    projectName: '浦东供水管网扩建工程',
    unit: '浦东供排水',
    status: '在建',
    contracts: [
      {
        category: '专业分包',
        supplierName: '上海建工集团',
        supplierLevel: 'A',
        contractStatus: '正常履约',
        contractName: '管网敷设专业分包合同',
        workScope: 'DN200-DN500管网敷设及附属设施安装',
        workVolume: '8000米',
        plannedAmount: 4200000,
        contractForm: '公开招标',
        plannedDate: '2026-01-10',
        actualDate: '2026-01-10',
        signStatus: '已签订',
        overdueDays: 0,
        contractStartDate: '2026-01-10',
        contractEndDate: '2026-10-10'
      },
      {
        category: '劳务分包',
        supplierName: '上海劳务公司',
        supplierLevel: 'B',
        contractStatus: '正常履约',
        contractName: '管网敷设劳务分包合同',
        workScope: '管网敷设劳务作业及辅助施工',
        workVolume: '8000米',
        plannedAmount: 1200000,
        contractForm: '邀请招标',
        plannedDate: '2026-01-15',
        actualDate: '',
        signStatus: '未签订',
        overdueDays: 40,
        contractStartDate: '',
        contractEndDate: ''
      },
      {
        category: '材料/设备采购',
        supplierName: '上海水务物资公司',
        supplierLevel: 'A',
        contractStatus: '正常履约',
        contractName: '管材管件采购合同',
        workScope: '球墨铸铁管及配件采购',
        workVolume: '8000米',
        plannedAmount: 2800000,
        contractForm: '集采',
        plannedDate: '2026-01-05',
        actualDate: '2026-01-08',
        signStatus: '已签订',
        overdueDays: 3,
        contractStartDate: '2026-01-08',
        contractEndDate: '2026-10-08'
      },
      {
        category: '周转材料/设备租赁',
        supplierName: '浦东设备租赁公司',
        supplierLevel: 'C',
        contractStatus: '正常履约',
        contractName: '施工机械租赁合同',
        workScope: '挖掘机、吊车等机械设备租赁',
        workVolume: '5台',
        plannedAmount: 450000,
        contractForm: '比价',
        plannedDate: '2026-02-01',
        actualDate: '2026-02-03',
        signStatus: '已签订',
        overdueDays: 2,
        contractStartDate: '2026-02-03',
        contractEndDate: '2026-06-03'
      }
    ]
  }
]

// 应用初始筛选条件
const applyInitialFilter = () => {
  if (props.initialFilter && Object.keys(props.initialFilter).length > 0) {
    if (props.initialFilter.category) {
      selectedCategory.value = props.initialFilter.category
    }
    if (props.initialFilter.signStatus) {
      selectedSignStatus.value = props.initialFilter.signStatus
    }
    if (props.initialFilter.overdueDays) {
      selectedOverdue.value = props.initialFilter.overdueDays
    }
    if (props.initialFilter.unit && props.initialFilter.unit !== '全部') {
      selectedUnit.value = props.initialFilter.unit
    }
    if (props.initialFilter.contractStatus) {
      selectedContractStatus.value = props.initialFilter.contractStatus
    }
    if (props.initialFilter.supplierLevel) {
      selectedSupplierLevel.value = props.initialFilter.supplierLevel
    }
  } else {
    try {
      const savedFilter = sessionStorage.getItem('supplyChainFilter')
      if (savedFilter) {
        const filter = JSON.parse(savedFilter)
        if (filter.category) {
          selectedCategory.value = filter.category
        }
        if (filter.signStatus) {
          selectedSignStatus.value = filter.signStatus
        }
        if (filter.overdueDays) {
          selectedOverdue.value = filter.overdueDays
        }
        sessionStorage.removeItem('supplyChainFilter')
      }
    } catch (e) {
      console.error('Failed to load saved filter:', e)
    }
  }
}

const filteredData = computed(() => {
  return rawData.filter(project => {
    if (selectedProject.value && !project.projectName.includes(selectedProject.value)) return false
    if (selectedUnit.value && project.unit !== selectedUnit.value) return false
    if (selectedStatus.value && project.status !== selectedStatus.value) return false
    return true
  })
})

const tableData = computed(() => {
  const result = []
  filteredData.value.forEach(project => {
    project.contracts.forEach(contract => {
      if (selectedCategory.value && contract.category !== selectedCategory.value) return
      if (selectedSignStatus.value) {
        if (selectedSignStatus.value === '未签订') {
          // 未签订 = 所有非已签订合同（含红/橙/黄预警）
          if (contract.signStatus === '已签订') return
        } else {
          const statusVal = getWarningLabel(contract)
          if (statusVal !== selectedSignStatus.value) return
        }
      }
      if (selectedSupplier.value && !contract.supplierName.includes(selectedSupplier.value)) return
      if (selectedContractStatus.value && contract.contractStatus !== selectedContractStatus.value) return
      if (selectedSupplierLevel.value && contract.supplierLevel !== selectedSupplierLevel.value) return
      if (selectedOverdue.value) {
        const days = contract.overdueDays
        if (selectedOverdue.value === '21-44' && (days < 21 || days > 44)) return
        if (selectedOverdue.value === '45-60' && (days < 45 || days > 60)) return
        if (selectedOverdue.value === '60+' && days < 60) return
      }
      result.push({
        ...contract,
        projectCode: project.projectCode,
        projectName: project.projectName,
        unit: project.unit,
        status: project.status
      })
    })
  })
  return result
})

// 分页数据
const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const objectSpanMethod = ({ row, column, rowIndex }) => {
  if (column.prop === 'projectCode' || column.prop === 'projectName' || column.prop === 'unit' || column.prop === 'status') {
    const code = row.projectCode
    const data = paginatedTableData.value
    const prevRow = rowIndex > 0 ? data[rowIndex - 1] : null

    if (!prevRow || prevRow.projectCode !== code) {
      const count = data.filter(r => r.projectCode === code).length
      return {
        rowspan: count,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0 })
}

const getSignStatusClass = (row) => {
  if (row.signStatus === '已签订') return ''
  const days = row.overdueDays
  if (days >= 60) return 'bg-red-100 text-red-800 px-2 py-1 rounded'
  if (days >= 45) return 'bg-orange-100 text-orange-800 px-2 py-1 rounded'
  if (days >= 21) return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded'
  return ''
}

const getWarningLabel = (row) => {
  const days = row.overdueDays
  if (days >= 60) return '红色预警'
  if (days >= 45) return '橙色预警'
  if (days >= 21) return '黄色预警'
  return '未签订'
}

const getSupplierLevelClass = (level) => {
  const classMap = {
    'A': 'px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700',
    'B': 'px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700',
    'C': 'px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700'
  }
  return classMap[level] || ''
}

const getContractStatusClass = (status) => {
  const classMap = {
    '正常履约': 'text-green-600 font-medium',
    '履约结束': 'text-gray-500',
    '违约中': 'text-red-500 font-medium'
  }
  return classMap[status] || ''
}

const handleSearch = () => {
  // 搜索：filteredData computed 已自动响应筛选条件变化
}

const handleReset = () => {
  selectedProject.value = ''
  selectedUnit.value = ''
  selectedStatus.value = ''
  selectedCategory.value = ''
  selectedSupplier.value = ''
  selectedContractStatus.value = ''
  selectedSupplierLevel.value = ''
  selectedSignStatus.value = ''
  selectedOverdue.value = ''
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}

onMounted(() => {
  applyInitialFilter()
})

watch(() => props.initialFilter, (newFilter) => {
  if (newFilter && Object.keys(newFilter).length > 0) {
    applyInitialFilter()
  }
}, { deep: true })
</script>
