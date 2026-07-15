<template>
  <div class="insurance-broker-list">
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="项目名称：">
          <el-input v-model="searchForm.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="分公司：">
          <el-input v-model="searchForm.branchCompany" placeholder="请输入分公司" />
        </el-form-item>
        <el-form-item label="子公司：">
          <el-input v-model="searchForm.subsidiary" placeholder="请输入子公司" />
        </el-form-item>
        <el-form-item label="保险经纪公司：">
          <el-input v-model="searchForm.brokerCompany" placeholder="请输入保险经纪公司" />
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="paginatedData"
      border
      stripe
      :height="tableHeight"
      class="insurance-table"
    >
      <el-table-column prop="projectName" label="项目名称" width="140" />
      <el-table-column prop="branchCompany" label="分公司" width="100" />
      <el-table-column prop="subsidiary" label="子公司" width="100" />
      <el-table-column prop="brokerCompany" label="保险经纪公司" width="140" />
      <el-table-column prop="brokerAgreement" label="保险经纪委托书/协议" width="140" />
      <el-table-column prop="insuranceProposal" label="保险建议书" width="100" />
      <el-table-column prop="insurancePlan" label="保险方案" width="100" />
      <el-table-column prop="insuranceContract" label="保单/保险合同" width="120" />
      <el-table-column prop="trainingMaterials" label="保险培训课件" width="120" />
      <el-table-column prop="claimDocuments" label="赔案资料" width="100" />
      <el-table-column prop="riskSurveyRecords" label="风险勘察记录(含TIS)" width="160" />
      <el-table-column prop="finalReport" label="项目终期保险服务报告" width="160" />
      <el-table-column prop="otherDocuments" label="其他文件" width="100" />
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredData.length"
        layout="total, sizes, prev, pager, next"
        background
        small
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const searchForm = ref({
  projectName: '',
  branchCompany: '',
  subsidiary: '',
  brokerCompany: ''
})

const tableHeight = ref(400)

const insuranceData = [
  {
    projectName: '上海黄浦区示范线1.2标',
    branchCompany: '市政分公司',
    subsidiary: '上海隧道',
    brokerCompany: '华泰保险经纪有限公司',
    brokerAgreement: '',
    insuranceProposal: '',
    insurancePlan: '附件1',
    insuranceContract: '',
    trainingMaterials: '附件1',
    claimDocuments: '',
    riskSurveyRecords: '',
    finalReport: '',
    otherDocuments: ''
  },
  {
    projectName: '上海青浦区11号线区间S1.3标',
    branchCompany: '机施分公司',
    subsidiary: '市政集团',
    brokerCompany: '上海全顺保险经纪有限公司',
    brokerAgreement: '',
    insuranceProposal: '附件1\n附件2',
    insurancePlan: '',
    insuranceContract: '',
    trainingMaterials: '附件1',
    claimDocuments: '',
    riskSurveyRecords: '',
    finalReport: '',
    otherDocuments: ''
  },
  {
    projectName: '浙江金华市S748高速路2.3标',
    branchCompany: '市政事业部',
    subsidiary: '上海路桥',
    brokerCompany: '韦莱保险经纪有限公司',
    brokerAgreement: '',
    insuranceProposal: '',
    insurancePlan: '附件1',
    insuranceContract: '',
    trainingMaterials: '附件1',
    claimDocuments: '',
    riskSurveyRecords: '',
    finalReport: '',
    otherDocuments: ''
  }
]

const filteredData = computed(() => {
  return insuranceData.filter(item => {
    const matchProjectName = !searchForm.value.projectName ||
      item.projectName.toLowerCase().includes(searchForm.value.projectName.toLowerCase())
    const matchBranch = !searchForm.value.branchCompany ||
      item.branchCompany.toLowerCase().includes(searchForm.value.branchCompany.toLowerCase())
    const matchSubsidiary = !searchForm.value.subsidiary ||
      item.subsidiary.toLowerCase().includes(searchForm.value.subsidiary.toLowerCase())
    const matchBroker = !searchForm.value.brokerCompany ||
      item.brokerCompany.toLowerCase().includes(searchForm.value.brokerCompany.toLowerCase())
    return matchProjectName && matchBranch && matchSubsidiary && matchBroker
  })
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})
watch(searchForm, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.insurance-broker-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  gap: 16px;
  align-items: center;
}

.insurance-table {
  width: 100%;
}

:deep(.el-table th) {
  background-color: #4a6fa5;
  color: white;
  font-weight: bold;
}

:deep(.el-table td) {
  max-width: 160px;
  white-space: pre-wrap;
  word-break: break-all;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}
</style>
