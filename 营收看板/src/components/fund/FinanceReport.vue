<template>
  <div class="finance-report">
    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="生产项目编号：">
          <el-input v-model="searchForm.productionProjectNo" placeholder="精确查询" />
        </el-form-item>
        <el-form-item label="核算项目编号：">
          <el-input v-model="searchForm.accountingProjectNo" placeholder="精确查询" />
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input v-model="searchForm.projectName" placeholder="模糊查询" />
        </el-form-item>
        <el-form-item label="基层单位：">
          <el-select v-model="searchForm.basicUnit" multiple collapse-tags placeholder="请选择" class="w-52">
            <el-option v-for="unit in basicUnitOptions" :key="unit.value" :label="unit.label" :value="unit.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="核算组织：">
          <el-input v-model="searchForm.accountingOrg" placeholder="模糊查询" />
        </el-form-item>
        <el-form-item label="合同金额：">
          <el-input v-model="searchForm.contractAmount" placeholder="模糊查询" />
        </el-form-item>
        <el-form-item label="项目状态：">
          <el-select v-model="searchForm.projectStatus" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option v-for="status in projectStatusOptions" :key="status.value" :label="status.label" :value="status.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="triggerImport" type="success">导入数据</el-button>
          <el-button @click="handleDownloadTemplate" type="default">下载导入模板</el-button>
          <el-button @click="showVersionDialog = true" type="default">版本记录</el-button>
          <el-button @click="handleExport" type="warning">导出</el-button>
          <input
            ref="importInputRef"
            type="file"
            accept=".xlsx,.xls"
            style="display: none"
            @change="handleImport"
          />
        </el-form-item>
      </el-form>
    </div>

    <el-alert
      class="version-banner"
      type="info"
      :closable="false"
      show-icon
    >
      <template #title>
        <span>每月留存版本以当月25号前手动导入的最后一版为准。</span>
        <span v-if="currentVersionInfo" class="version-current">
          当前数据：留存版本，导入时间 {{ currentVersionInfo.importTime }}，共 {{ currentVersionInfo.rowCount }} 条。
        </span>
        <span v-else class="version-current">当前为系统默认数据，导入后将留存版本。</span>
      </template>
    </el-alert>

    <div class="warning-boxes">
      <div
        class="warning-box warning-blue"
        :class="{ active: activeWarningFilter === 'blue' }"
        @click="toggleWarningFilter('blue')"
      >
        <span class="warning-label">蓝色预警</span>
        <span class="warning-count">{{ blueWarningCount }}</span>
      </div>
      <div
        class="warning-box warning-yellow"
        :class="{ active: activeWarningFilter === 'yellow' }"
        @click="toggleWarningFilter('yellow')"
      >
        <span class="warning-label">黄色预警</span>
        <span class="warning-count">{{ yellowWarningCount }}</span>
      </div>
      <div
        class="warning-box warning-red"
        :class="{ active: activeWarningFilter === 'red' }"
        @click="toggleWarningFilter('red')"
      >
        <span class="warning-label">红色预警</span>
        <span class="warning-count">{{ redWarningCount }}</span>
      </div>
      <el-button
        v-if="activeWarningFilter"
        link
        type="info"
        size="small"
        @click="activeWarningFilter = null"
      >清除筛选</el-button>
    </div>

    <div class="table-container">
      <div class="tab-container">
        <el-tabs v-model="activeTab" class="finance-tabs">
          <el-tab-pane label="转接" name="transfer">
            <template #label>
              <span>转接</span>
              <el-badge :value="transferCount" class="tab-badge" />
            </template>
          </el-tab-pane>
          <el-tab-pane label="新接" name="new">
            <template #label>
              <span>新接</span>
              <el-badge :value="newCount" class="tab-badge" />
            </template>
          </el-tab-pane>
          <el-tab-pane label="当年已销项" name="completed">
            <template #label>
              <span>当年已销项</span>
              <el-badge :value="completedCount" class="tab-badge" />
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="table-header-right">
        <el-button type="default" @click="showColumnDialog = true">
          <span class="column-icon">⚙</span> 自定义字段
        </el-button>
        <el-button @click="resetColumns" type="text" size="small">恢复默认</el-button>
      </div>

      <el-dialog
        v-model="showColumnDialog"
        title="自定义字段"
        width="1000px"
        @close="handleDialogClose"
      >
        <div class="column-selector">
          <el-input
            v-model="columnSearch"
            placeholder="搜索字段"
            style="margin-bottom: 16px"
            clearable
            prefix-icon="Search"
          />
          <el-row :gutter="16">
            <el-col :span="12" v-for="group in groupedColumns" :key="group.group">
              <div class="column-group">
                <div class="group-title">{{ group.group }}</div>
                <div class="column-items">
                  <el-checkbox
                    v-for="col in filterColumns(group.columns)"
                    :key="col.prop"
                    v-model="localVisibleColumns"
                    :value="col.prop"
                    :disabled="col.required"
                  >
                    {{ col.label }}
                    <span v-if="col.required" style="color: #f56c6c; margin-left: 4px;">*</span>
                  </el-checkbox>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <template #footer>
          <el-button @click="showColumnDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmColumns">确定</el-button>
        </template>
      </el-dialog>

      <el-dialog
        v-model="showVersionDialog"
        title="版本记录"
        width="760px"
      >
        <el-alert
          type="warning"
          :closable="false"
          show-icon
          style="margin-bottom: 12px"
        >
          <template #title>每月留存版本以当月25号前手动导入的最后一版为准。</template>
        </el-alert>
        <el-table :data="versions" border stripe size="small">
          <el-table-column prop="importTime" label="导入时间" width="170" />
          <el-table-column prop="fileName" label="文件名" min-width="160" show-overflow-tooltip />
          <el-table-column prop="rowCount" label="数据条数" width="90" />
          <el-table-column label="留存版本" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.id === lockedVersionId" type="success" size="small">留存版本</el-tag>
              <span v-else class="version-plain">—</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170">
            <template #default="{ row }">
              <el-button
                v-if="row.id !== currentVersionId"
                link type="primary" size="small"
                @click="handleApplyVersion(row)"
              >恢复为此版本</el-button>
              <el-tag v-else type="primary" size="small" effect="plain">当前生效</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <el-button @click="showVersionDialog = false">关闭</el-button>
        </template>
      </el-dialog>

      <div class="table-scroll-wrapper">
        <el-table
          :data="paginatedData"
          border
          stripe
          :height="tableHeight"
          class="finance-table"
        >
          <el-table-column v-if="visibleColumns.includes('index')" type="index" label="序号" width="60" />
          <el-table-column v-if="visibleColumns.includes('productionProjectNo')" prop="productionProjectNo" label="生产项目编号" width="120" />
          <el-table-column v-if="visibleColumns.includes('accountingProjectNo')" prop="accountingProjectNo" label="核算项目编号" width="120" />
          <el-table-column v-if="visibleColumns.includes('projectName')" prop="projectName" label="项目名称" width="150" />
          <el-table-column v-if="visibleColumns.includes('ownerUnitName')" prop="ownerUnitName" label="业主单位名称" width="140" />

          <el-table-column v-if="['customerType', 'customerNature', 'basicUnit', 'accountingOrg', 'originalSector', 'regionMarket', 'implementationMode', 'subcontractMode'].some(p => visibleColumns.includes(p))" label="业务信息">
            <el-table-column v-if="visibleColumns.includes('customerType')" prop="customerType" label="客户情况" width="100" />
            <el-table-column v-if="visibleColumns.includes('customerNature')" prop="customerNature" label="客户性质" width="100" />
            <el-table-column v-if="visibleColumns.includes('basicUnit')" prop="basicUnit" label="所属基层单位" width="120" />
            <el-table-column v-if="visibleColumns.includes('accountingOrg')" prop="accountingOrg" label="核算组织" width="120" />
            <el-table-column v-if="visibleColumns.includes('originalSector')" prop="originalSector" label="原所属板块" width="100" />
            <el-table-column v-if="visibleColumns.includes('regionMarket')" prop="regionMarket" label="所属区域市场" width="100" />
            <el-table-column v-if="visibleColumns.includes('implementationMode')" prop="implementationMode" label="项目实施模式" width="100" />
            <el-table-column v-if="visibleColumns.includes('subcontractMode')" prop="subcontractMode" label="分包模式" width="100" />
          </el-table-column>

          <el-table-column v-if="['cityEnvLevel1', 'cityEnvLevel2', 'cityEnvLevel3', 'provinceCity', 'cityDistrict', 'bidDate', 'contractSignDate', 'contractPriceTax', 'provisionalSumTax', 'contractPriceNoTax', 'contractTaxRate'].some(p => visibleColumns.includes(p))" label="业务信息-市场部">
            <el-table-column v-if="visibleColumns.includes('cityEnvLevel1')" prop="cityEnvLevel1" label="城市环境一级分类" width="120" />
            <el-table-column v-if="visibleColumns.includes('cityEnvLevel2')" prop="cityEnvLevel2" label="城市环境二级分类" width="120" />
            <el-table-column v-if="visibleColumns.includes('cityEnvLevel3')" prop="cityEnvLevel3" label="城市环境三级分类" width="120" />
            <el-table-column v-if="visibleColumns.includes('provinceCity')" prop="provinceCity" label="所属省/市" width="100" />
            <el-table-column v-if="visibleColumns.includes('cityDistrict')" prop="cityDistrict" label="所属市/区" width="100" />
            <el-table-column v-if="visibleColumns.includes('bidDate')" prop="bidDate" label="中标时间" width="100" />
            <el-table-column v-if="visibleColumns.includes('contractSignDate')" prop="contractSignDate" label="合同签订时间" width="120" />
            <el-table-column v-if="visibleColumns.includes('contractPriceTax')" prop="contractPriceTax" label="合同签约价（含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('provisionalSumTax')" prop="provisionalSumTax" label="暂列金（含税）" width="120" />
            <el-table-column v-if="visibleColumns.includes('contractPriceNoTax')" prop="contractPriceNoTax" label="合同价（不含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('contractTaxRate')" prop="contractTaxRate" label="总包合同税率" width="100" />
          </el-table-column>

          <el-table-column v-if="['startDate', 'projectStatus', 'currentStatusStartDate', 'completionDate'].some(p => visibleColumns.includes(p))" label="业务信息-工程部">
            <el-table-column v-if="visibleColumns.includes('startDate')" prop="startDate" label="开工时间" width="100" />
            <el-table-column v-if="visibleColumns.includes('projectStatus')" prop="projectStatus" label="项目状态" width="100" />
            <el-table-column v-if="visibleColumns.includes('currentStatusStartDate')" prop="currentStatusStartDate" label="当前状态开始时间" width="140" />
            <el-table-column v-if="visibleColumns.includes('completionDate')" prop="completionDate" label="竣工时间" width="100" />
          </el-table-column>

          <el-table-column v-if="['planRevenue2027', 'completedRevenue2026', 'cumulativeRevenue', 'completedOutput2026', 'cumulativeOutput', 'lastOutput', 'approvalDate', 'remainingPlan2026', 'contractCompletionRate', 'carryForwardRevenue2027', 'carryForwardPlanRevenue2027', 'reportedRevenue2025', 'reportedRevenue2026', 'cumulativeReportedRevenue', 'internalNotReportedRevenue', 'internalNotReportedOutput', 'reportedOutput2026', 'cumulativeReportedOutput', 'contractAsset'].some(p => visibleColumns.includes(p))" label="营收数据">
            <el-table-column v-if="visibleColumns.includes('planRevenue2027')" prop="planRevenue2027" label="2027年计划完成营收（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('completedRevenue2026')" prop="completedRevenue2026" label="2026年完成总包营收（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('cumulativeRevenue')" prop="cumulativeRevenue" label="开累总包营收（内部）" width="140" />
            <el-table-column v-if="visibleColumns.includes('completedOutput2026')" prop="completedOutput2026" label="2026年完成总包产值（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('cumulativeOutput')" prop="cumulativeOutput" label="开累总包产值（内部）" width="140" />
            <el-table-column v-if="visibleColumns.includes('lastOutput')" prop="lastOutput" label="最后一次总包产值" width="120" />
            <el-table-column v-if="visibleColumns.includes('approvalDate')" prop="approvalDate" label="批复时间" width="100" />
            <el-table-column v-if="visibleColumns.includes('remainingPlan2026')" prop="remainingPlan2026" label="26年剩余计划" width="120" />
            <el-table-column v-if="visibleColumns.includes('contractCompletionRate')" prop="contractCompletionRate" label="开累完成合同百分比" width="140" />
            <el-table-column v-if="visibleColumns.includes('carryForwardRevenue2027')" prop="carryForwardRevenue2027" label="结转至2027年及以后营收（内部）" width="180" />
            <el-table-column v-if="visibleColumns.includes('carryForwardPlanRevenue2027')" prop="carryForwardPlanRevenue2027" label="结转至2027年及以后计划营收" width="180" />
            <el-table-column v-if="visibleColumns.includes('reportedRevenue2025')" prop="reportedRevenue2025" label="至2025年上报集团开累营收" width="160" />
            <el-table-column v-if="visibleColumns.includes('reportedRevenue2026')" prop="reportedRevenue2026" label="2026年上报集团营收" width="140" />
            <el-table-column v-if="visibleColumns.includes('cumulativeReportedRevenue')" prop="cumulativeReportedRevenue" label="上报集团开累营收" width="140" />
            <el-table-column v-if="visibleColumns.includes('internalNotReportedRevenue')" prop="internalNotReportedRevenue" label="已报内部未上报集团营收" width="160" />
            <el-table-column v-if="visibleColumns.includes('internalNotReportedOutput')" prop="internalNotReportedOutput" label="已报内部未上报集团产值" width="160" />
            <el-table-column v-if="visibleColumns.includes('reportedOutput2026')" prop="reportedOutput2026" label="2026年上报集团产值" width="140" />
            <el-table-column v-if="visibleColumns.includes('cumulativeReportedOutput')" prop="cumulativeReportedOutput" label="上报集团开累产值" width="140" />
            <el-table-column v-if="visibleColumns.includes('contractAsset')" prop="contractAsset" label="合同资产" width="100" />
          </el-table-column>

          <el-table-column v-if="['settlementStatus', 'settlementPriceTax', 'settlementPriceNoTax', 'settlementDate', 'projectManager', 'projectLeader'].some(p => visibleColumns.includes(p))" label="业务信息-经管部">
            <el-table-column v-if="visibleColumns.includes('settlementStatus')" prop="settlementStatus" label="项目结算状态" width="120" />
            <el-table-column v-if="visibleColumns.includes('settlementPriceTax')" prop="settlementPriceTax" label="结算审定价（含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('settlementPriceNoTax')" prop="settlementPriceNoTax" label="结算审定价（不含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('settlementDate')" prop="settlementDate" label="结算完成日期" width="120" />
            <el-table-column v-if="visibleColumns.includes('projectManager')" prop="projectManager" label="项目经理" width="100" />
            <el-table-column v-if="visibleColumns.includes('projectLeader')" prop="projectLeader" label="项目负责人" width="100" />
          </el-table-column>

          <el-table-column v-if="['cumulativeRevenue2025', 'cumulativeOutput2025', 'carryForwardRevenue2026', 'planRevenue2026', 'planAdjustment2026', 'adjustedPlanNoTax'].some(p => visibleColumns.includes(p))" label="营收数据-工程部">
            <el-table-column v-if="visibleColumns.includes('cumulativeRevenue2025')" prop="cumulativeRevenue2025" label="至2025年末开累总包营收（内部）" width="180" />
            <el-table-column v-if="visibleColumns.includes('cumulativeOutput2025')" prop="cumulativeOutput2025" label="至2025年末开累总包产值（内部）" width="180" />
            <el-table-column v-if="visibleColumns.includes('carryForwardRevenue2026')" prop="carryForwardRevenue2026" label="结转至2026年以后营收（内部）" width="180" />
            <el-table-column v-if="visibleColumns.includes('planRevenue2026')" prop="planRevenue2026" label="2026年计划完成营收（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('planAdjustment2026')" prop="planAdjustment2026" label="2026年计划调整数" width="140" />
            <el-table-column v-if="visibleColumns.includes('adjustedPlanNoTax')" prop="adjustedPlanNoTax" label="调整后计划（不含税）" width="140" />
          </el-table-column>

          <el-table-column v-if="['targetProfitMarginNoTax', 'targetProfitMarginTax'].some(p => visibleColumns.includes(p))" label="利润数据-经管部">
            <el-table-column v-if="visibleColumns.includes('targetProfitMarginNoTax')" prop="targetProfitMarginNoTax" label="目标利润率（不含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('targetProfitMarginTax')" prop="targetProfitMarginTax" label="目标利润率（含税）" width="140" />
          </el-table-column>

          <el-table-column v-if="['grossProfitNotReported', 'targetProfit', 'profitMargin', 'actualProfit', 'currentProfitImpact', 'carryForwardGrossProfit2026', 'accruedGrossProfit2025', 'realizedProfit2026', 'cumulativeAccruedGrossProfit', 'planGrossProfit2026', 'carryForwardTargetGrossProfit2027', 'accruedGrossProfitGroup2025', 'realizedProfitGroup2026', 'cumulativeAccruedGrossProfitGroup', 'remainingPlanGrossProfit2026'].some(p => visibleColumns.includes(p))" label="利润数据">
            <el-table-column v-if="visibleColumns.includes('grossProfitNotReported')" prop="grossProfitNotReported" label="已报内部未上报集团毛利" width="160" />
            <el-table-column v-if="visibleColumns.includes('targetProfit')" prop="targetProfit" label="项目销项目标利润" width="140" />
            <el-table-column v-if="visibleColumns.includes('profitMargin')" prop="profitMargin" label="销项利润率" width="100" />
            <el-table-column v-if="visibleColumns.includes('actualProfit')" prop="actualProfit" label="项目销项实际利润" width="140" />
            <el-table-column v-if="visibleColumns.includes('currentProfitImpact')" prop="currentProfitImpact" label="销项影响当期利润" width="140" />
            <el-table-column v-if="visibleColumns.includes('carryForwardGrossProfit2026')" prop="carryForwardGrossProfit2026" label="结转至2026年及以后毛利" width="160" />
            <el-table-column v-if="visibleColumns.includes('accruedGrossProfit2025')" prop="accruedGrossProfit2025" label="至2025年已计提毛利（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('realizedProfit2026')" prop="realizedProfit2026" label="2026年内部营收实现利润" width="160" />
            <el-table-column v-if="visibleColumns.includes('cumulativeAccruedGrossProfit')" prop="cumulativeAccruedGrossProfit" label="开累已计提毛利（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('planGrossProfit2026')" prop="planGrossProfit2026" label="2026年计划完成毛利（内部）" width="160" />
            <el-table-column v-if="visibleColumns.includes('carryForwardTargetGrossProfit2027')" prop="carryForwardTargetGrossProfit2027" label="结转至2027年及以后目标毛利" width="180" />
            <el-table-column v-if="visibleColumns.includes('accruedGrossProfitGroup2025')" prop="accruedGrossProfitGroup2025" label="至2025年已计提上报集团营收毛利" width="180" />
            <el-table-column v-if="visibleColumns.includes('realizedProfitGroup2026')" prop="realizedProfitGroup2026" label="2026年上报集团营收实现利润" width="180" />
            <el-table-column v-if="visibleColumns.includes('cumulativeAccruedGrossProfitGroup')" prop="cumulativeAccruedGrossProfitGroup" label="开累已计提上报集团营收毛利" width="180" />
            <el-table-column v-if="visibleColumns.includes('remainingPlanGrossProfit2026')" prop="remainingPlanGrossProfit2026" label="26年剩余计划毛利（内部）" width="160" />
          </el-table-column>

          <el-table-column v-if="['rdCost2025', 'rdCostJan', 'cumulativeRdCost', 'bookedCost', 'carriedCost', 'projectInventory', 'rdPlusCarriedCost', 'estimatedCost', 'subcontractComparison', 'taxAmount', 'accruedProfit', 'grossMarginInProgress', 'grossMarginDeviation'].some(p => visibleColumns.includes(p))" label="成本数据">
            <el-table-column v-if="visibleColumns.includes('rdCost2025')" prop="rdCost2025" label="至2025年已归集研发费用" width="160" />
            <el-table-column v-if="visibleColumns.includes('rdCostJan')" prop="rdCostJan" label="1月2026年研发费用" width="140" />
            <el-table-column v-if="visibleColumns.includes('cumulativeRdCost')" prop="cumulativeRdCost" label="累计归集研发费用" width="140" />
            <el-table-column v-if="visibleColumns.includes('bookedCost')" prop="bookedCost" label="已入账成本" width="100" />
            <el-table-column v-if="visibleColumns.includes('carriedCost')" prop="carriedCost" label="已结转成本" width="100" />
            <el-table-column v-if="visibleColumns.includes('projectInventory')" prop="projectInventory" label="项目存货" width="100" />
            <el-table-column v-if="visibleColumns.includes('rdPlusCarriedCost')" prop="rdPlusCarriedCost" label="研发+已结转成本" width="140" />
            <el-table-column v-if="visibleColumns.includes('estimatedCost')" prop="estimatedCost" label="暂估" width="80" />
            <el-table-column v-if="visibleColumns.includes('subcontractComparison')" prop="subcontractComparison" label="总分包比对" width="100" />
            <el-table-column v-if="visibleColumns.includes('taxAmount')" prop="taxAmount" label="税金" width="80" />
            <el-table-column v-if="visibleColumns.includes('accruedProfit')" prop="accruedProfit" label="预提利润" width="100" />
            <el-table-column v-if="visibleColumns.includes('grossMarginInProgress')" prop="grossMarginInProgress" label="（过程中）毛利率" width="120" />
            <el-table-column v-if="visibleColumns.includes('grossMarginDeviation')" prop="grossMarginDeviation" label="毛利率偏差" width="120" />
          </el-table-column>

          <el-table-column v-if="['safetyFeeRate', 'specialReserveBeginning', 'specialReserveJan提取', 'cumulativeSafetyFee提取', 'specialReserveJan使用', 'cumulativeSpecialReserve使用', 'specialReserveBalance'].some(p => visibleColumns.includes(p))" label="专项储备">
            <el-table-column v-if="visibleColumns.includes('safetyFeeRate')" prop="safetyFeeRate" label="安措费计提比率" width="120" />
            <el-table-column v-if="visibleColumns.includes('specialReserveBeginning')" prop="specialReserveBeginning" label="专项储备期初提取数" width="140" />
            <el-table-column v-if="visibleColumns.includes('specialReserveJan提取')" prop="specialReserveJan提取" label="1月提取数" width="100" />
            <el-table-column v-if="visibleColumns.includes('cumulativeSafetyFee提取')" prop="cumulativeSafetyFee提取" label="安全生产费累计提取数" width="140" />
            <el-table-column v-if="visibleColumns.includes('specialReserveJan使用')" prop="specialReserveJan使用" label="1月使用数" width="100" />
            <el-table-column v-if="visibleColumns.includes('cumulativeSpecialReserve使用')" prop="cumulativeSpecialReserve使用" label="专项储备累计使用数" width="140" />
            <el-table-column v-if="visibleColumns.includes('specialReserveBalance')" prop="specialReserveBalance" label="专项储备结存数" width="120" />
          </el-table-column>

          <el-table-column v-if="['invoicedThisYear', 'cumulativeInvoiced', 'lastInvoiceDate', 'receivedThisYear', 'cumulativeReceived', 'invoicedNotReceived'].some(p => visibleColumns.includes(p))" label="资金数据">
            <el-table-column v-if="visibleColumns.includes('invoicedThisYear')" prop="invoicedThisYear" label="本年度开票（含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('cumulativeInvoiced')" prop="cumulativeInvoiced" label="项目累计开票（含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('lastInvoiceDate')" prop="lastInvoiceDate" label="最后一次发票开票时间" width="160" />
            <el-table-column v-if="visibleColumns.includes('receivedThisYear')" prop="receivedThisYear" label="本年度收款（含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('cumulativeReceived')" prop="cumulativeReceived" label="项目累计收款（含税）" width="140" />
            <el-table-column v-if="visibleColumns.includes('invoicedNotReceived')" prop="invoicedNotReceived" label="已开票未收款额（含税）" width="160" />
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="tabFilteredData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { utils, writeFile, read } from 'xlsx'

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

const projectStatusOptions = [
  { value: '待建', label: '待建' },
  { value: '在建', label: '在建' },
  { value: '停工', label: '停工' },
  { value: '完工', label: '完工' },
  { value: '竣工未送审', label: '竣工未送审' },
  { value: '已送审', label: '已送审' },
  { value: '审定未销项', label: '审定未销项' },
  { value: '业务销项', label: '业务销项' },
  { value: '财务销项', label: '财务销项' }
]

const customerTypes = ['大客户', '一般客户']
const customerNatures = ['政府', '国企', '民企', '外资']
const originalSectors = ['基础设施', '房地产', '环保', '能源']
const regionMarkets = ['华东', '华北', '华南', '西南', '西北']
const implementationModes = ['EPC', '总承包', '专业分包', '劳务分包']
const subcontractModes = ['总分包', '专业分包', '劳务分包']
const cityEnvLevel1 = ['水环境治理', '市政道路', '园林绿化', '垃圾处理']
const cityEnvLevel2 = ['河道整治', '污水处理', '道路新建', '道路改造']
const cityEnvLevel3 = ['黑臭水体治理', '雨污分流', '海绵城市', '智慧水务']
const provinceCities = ['上海市', '江苏省', '浙江省', '安徽省', '山东省']
const cityDistricts = ['黄浦区', '浦东新区', '杭州市', '南京市', '苏州市']
const settlementStatuses = ['未结算', '结算中', '已结算']

const allColumnsFlat = [
  { prop: 'index', label: '序号', width: 60, required: true },
  { prop: 'productionProjectNo', label: '生产项目编号', width: 120, required: true },
  { prop: 'accountingProjectNo', label: '核算项目编号', width: 120, required: true },
  { prop: 'projectName', label: '项目名称', width: 150, required: true },
  { prop: 'ownerUnitName', label: '业主单位名称', width: 140 },
  { prop: 'customerType', label: '客户情况', width: 100 },
  { prop: 'customerNature', label: '客户性质', width: 100 },
  { prop: 'basicUnit', label: '所属基层单位', width: 120 },
  { prop: 'accountingOrg', label: '核算组织', width: 120 },
  { prop: 'originalSector', label: '原所属板块', width: 100 },
  { prop: 'regionMarket', label: '所属区域市场', width: 100 },
  { prop: 'implementationMode', label: '项目实施模式', width: 100 },
  { prop: 'subcontractMode', label: '分包模式', width: 100 },
  { prop: 'cityEnvLevel1', label: '城市环境一级分类', width: 120 },
  { prop: 'cityEnvLevel2', label: '城市环境二级分类', width: 120 },
  { prop: 'cityEnvLevel3', label: '城市环境三级分类', width: 120 },
  { prop: 'provinceCity', label: '所属省/市', width: 100 },
  { prop: 'cityDistrict', label: '所属市/区', width: 100 },
  { prop: 'bidDate', label: '中标时间', width: 100 },
  { prop: 'contractSignDate', label: '合同签订时间', width: 120 },
  { prop: 'contractPriceTax', label: '合同签约价（含税）', width: 140 },
  { prop: 'provisionalSumTax', label: '暂列金（含税）', width: 120 },
  { prop: 'contractPriceNoTax', label: '合同价（不含税）', width: 140 },
  { prop: 'contractTaxRate', label: '总包合同税率', width: 100 },
  { prop: 'startDate', label: '开工时间', width: 100 },
  { prop: 'projectStatus', label: '项目状态', width: 100 },
  { prop: 'currentStatusStartDate', label: '当前状态开始时间', width: 140 },
  { prop: 'completionDate', label: '竣工时间', width: 100 },
  { prop: 'planRevenue2027', label: '2027年计划完成营收（内部）', width: 160 },
  { prop: 'completedRevenue2026', label: '2026年完成总包营收（内部）', width: 160 },
  { prop: 'cumulativeRevenue', label: '开累总包营收（内部）', width: 140 },
  { prop: 'completedOutput2026', label: '2026年完成总包产值（内部）', width: 160 },
  { prop: 'cumulativeOutput', label: '开累总包产值（内部）', width: 140 },
  { prop: 'lastOutput', label: '最后一次总包产值', width: 120 },
  { prop: 'approvalDate', label: '批复时间', width: 100 },
  { prop: 'remainingPlan2026', label: '26年剩余计划', width: 120 },
  { prop: 'contractCompletionRate', label: '开累完成合同百分比', width: 140 },
  { prop: 'carryForwardRevenue2027', label: '结转至2027年及以后营收（内部）', width: 180 },
  { prop: 'carryForwardPlanRevenue2027', label: '结转至2027年及以后计划营收', width: 180 },
  { prop: 'reportedRevenue2025', label: '至2025年上报集团开累营收', width: 160 },
  { prop: 'reportedRevenue2026', label: '2026年上报集团营收', width: 140 },
  { prop: 'cumulativeReportedRevenue', label: '上报集团开累营收', width: 140 },
  { prop: 'internalNotReportedRevenue', label: '已报内部未上报集团营收', width: 160 },
  { prop: 'internalNotReportedOutput', label: '已报内部未上报集团产值', width: 160 },
  { prop: 'reportedOutput2026', label: '2026年上报集团产值', width: 140 },
  { prop: 'cumulativeReportedOutput', label: '上报集团开累产值', width: 140 },
  { prop: 'contractAsset', label: '合同资产', width: 100 },
  { prop: 'settlementStatus', label: '项目结算状态', width: 120 },
  { prop: 'settlementPriceTax', label: '结算审定价（含税）', width: 140 },
  { prop: 'settlementPriceNoTax', label: '结算审定价（不含税）', width: 140 },
  { prop: 'settlementDate', label: '结算完成日期', width: 120 },
  { prop: 'projectManager', label: '项目经理', width: 100 },
  { prop: 'projectLeader', label: '项目负责人', width: 100 },
  { prop: 'cumulativeRevenue2025', label: '至2025年末开累总包营收（内部）', width: 180 },
  { prop: 'cumulativeOutput2025', label: '至2025年末开累总包产值（内部）', width: 180 },
  { prop: 'carryForwardRevenue2026', label: '结转至2026年以后营收（内部）', width: 180 },
  { prop: 'planRevenue2026', label: '2026年计划完成营收（内部）', width: 160 },
  { prop: 'planAdjustment2026', label: '2026年计划调整数', width: 140 },
  { prop: 'adjustedPlanNoTax', label: '调整后计划（不含税）', width: 140 },
  { prop: 'targetProfitMarginNoTax', label: '目标利润率（不含税）', width: 140 },
  { prop: 'targetProfitMarginTax', label: '目标利润率（含税）', width: 140 },
  { prop: 'grossProfitNotReported', label: '已报内部未上报集团毛利', width: 160 },
  { prop: 'targetProfit', label: '项目销项目标利润', width: 140 },
  { prop: 'profitMargin', label: '销项利润率', width: 100 },
  { prop: 'actualProfit', label: '项目销项实际利润', width: 140 },
  { prop: 'currentProfitImpact', label: '销项影响当期利润', width: 140 },
  { prop: 'carryForwardGrossProfit2026', label: '结转至2026年及以后毛利', width: 160 },
  { prop: 'accruedGrossProfit2025', label: '至2025年已计提毛利（内部）', width: 160 },
  { prop: 'realizedProfit2026', label: '2026年内部营收实现利润', width: 160 },
  { prop: 'cumulativeAccruedGrossProfit', label: '开累已计提毛利（内部）', width: 160 },
  { prop: 'planGrossProfit2026', label: '2026年计划完成毛利（内部）', width: 160 },
  { prop: 'carryForwardTargetGrossProfit2027', label: '结转至2027年及以后目标毛利', width: 180 },
  { prop: 'accruedGrossProfitGroup2025', label: '至2025年已计提上报集团营收毛利', width: 180 },
  { prop: 'realizedProfitGroup2026', label: '2026年上报集团营收实现利润', width: 180 },
  { prop: 'cumulativeAccruedGrossProfitGroup', label: '开累已计提上报集团营收毛利', width: 180 },
  { prop: 'remainingPlanGrossProfit2026', label: '26年剩余计划毛利（内部）', width: 160 },
  { prop: 'rdCost2025', label: '至2025年已归集研发费用', width: 160 },
  { prop: 'rdCostJan', label: '1月2026年研发费用', width: 140 },
  { prop: 'cumulativeRdCost', label: '累计归集研发费用', width: 140 },
  { prop: 'bookedCost', label: '已入账成本', width: 100 },
  { prop: 'carriedCost', label: '已结转成本', width: 100 },
  { prop: 'projectInventory', label: '项目存货', width: 100 },
  { prop: 'rdPlusCarriedCost', label: '研发+已结转成本', width: 140 },
  { prop: 'estimatedCost', label: '暂估', width: 80 },
  { prop: 'subcontractComparison', label: '总分包比对', width: 100 },
  { prop: 'taxAmount', label: '税金', width: 80 },
  { prop: 'accruedProfit', label: '预提利润', width: 100 },
  { prop: 'grossMarginInProgress', label: '（过程中）毛利率', width: 120 },
  { prop: 'grossMarginDeviation', label: '毛利率偏差', width: 120 },
  { prop: 'safetyFeeRate', label: '安措费计提比率', width: 120 },
  { prop: 'specialReserveBeginning', label: '专项储备期初提取数', width: 140 },
  { prop: 'specialReserveJan提取', label: '1月提取数', width: 100 },
  { prop: 'cumulativeSafetyFee提取', label: '安全生产费累计提取数', width: 140 },
  { prop: 'specialReserveJan使用', label: '1月使用数', width: 100 },
  { prop: 'cumulativeSpecialReserve使用', label: '专项储备累计使用数', width: 140 },
  { prop: 'specialReserveBalance', label: '专项储备结存数', width: 120 },
  { prop: 'invoicedThisYear', label: '本年度开票（含税）', width: 140 },
  { prop: 'cumulativeInvoiced', label: '项目累计开票（含税）', width: 140 },
  { prop: 'lastInvoiceDate', label: '最后一次发票开票时间', width: 160 },
  { prop: 'receivedThisYear', label: '本年度收款（含税）', width: 140 },
  { prop: 'cumulativeReceived', label: '项目累计收款（含税）', width: 140 },
  { prop: 'invoicedNotReceived', label: '已开票未收款额（含税）', width: 160 }
]

const visibleColumns = ref(allColumnsFlat.map(c => c.prop))
const showColumnDialog = ref(false)
const columnSearch = ref('')
const localVisibleColumns = ref([])
const activeTab = ref('transfer')

const groupedColumns = computed(() => {
  const groups = {
    '基础信息': allColumnsFlat.filter(c => ['index', 'productionProjectNo', 'accountingProjectNo', 'projectName', 'ownerUnitName'].includes(c.prop)),
    '业务信息': allColumnsFlat.filter(c => ['customerType', 'customerNature', 'basicUnit', 'accountingOrg', 'originalSector', 'regionMarket', 'implementationMode', 'subcontractMode'].includes(c.prop)),
    '业务信息-市场部': allColumnsFlat.filter(c => ['cityEnvLevel1', 'cityEnvLevel2', 'cityEnvLevel3', 'provinceCity', 'cityDistrict', 'bidDate', 'contractSignDate', 'contractPriceTax', 'provisionalSumTax', 'contractPriceNoTax', 'contractTaxRate'].includes(c.prop)),
    '业务信息-工程部': allColumnsFlat.filter(c => ['startDate', 'projectStatus', 'currentStatusStartDate', 'completionDate'].includes(c.prop)),
    '营收数据': allColumnsFlat.filter(c => ['planRevenue2027', 'completedRevenue2026', 'cumulativeRevenue', 'completedOutput2026', 'cumulativeOutput', 'lastOutput', 'approvalDate', 'remainingPlan2026', 'contractCompletionRate', 'carryForwardRevenue2027', 'carryForwardPlanRevenue2027', 'reportedRevenue2025', 'reportedRevenue2026', 'cumulativeReportedRevenue', 'internalNotReportedRevenue', 'internalNotReportedOutput', 'reportedOutput2026', 'cumulativeReportedOutput', 'contractAsset'].includes(c.prop)),
    '业务信息-经管部': allColumnsFlat.filter(c => ['settlementStatus', 'settlementPriceTax', 'settlementPriceNoTax', 'settlementDate', 'projectManager', 'projectLeader'].includes(c.prop)),
    '营收数据-工程部': allColumnsFlat.filter(c => ['cumulativeRevenue2025', 'cumulativeOutput2025', 'carryForwardRevenue2026', 'planRevenue2026', 'planAdjustment2026', 'adjustedPlanNoTax'].includes(c.prop)),
    '利润数据-经管部': allColumnsFlat.filter(c => ['targetProfitMarginNoTax', 'targetProfitMarginTax'].includes(c.prop)),
    '利润数据': allColumnsFlat.filter(c => ['grossProfitNotReported', 'targetProfit', 'profitMargin', 'actualProfit', 'currentProfitImpact', 'carryForwardGrossProfit2026', 'accruedGrossProfit2025', 'realizedProfit2026', 'cumulativeAccruedGrossProfit', 'planGrossProfit2026', 'carryForwardTargetGrossProfit2027', 'accruedGrossProfitGroup2025', 'realizedProfitGroup2026', 'cumulativeAccruedGrossProfitGroup', 'remainingPlanGrossProfit2026'].includes(c.prop)),
    '成本数据': allColumnsFlat.filter(c => ['rdCost2025', 'rdCostJan', 'cumulativeRdCost', 'bookedCost', 'carriedCost', 'projectInventory', 'rdPlusCarriedCost', 'estimatedCost', 'subcontractComparison', 'taxAmount', 'accruedProfit', 'grossMarginInProgress', 'grossMarginDeviation'].includes(c.prop)),
    '专项储备': allColumnsFlat.filter(c => ['safetyFeeRate', 'specialReserveBeginning', 'specialReserveJan提取', 'cumulativeSafetyFee提取', 'specialReserveJan使用', 'cumulativeSpecialReserve使用', 'specialReserveBalance'].includes(c.prop)),
    '资金数据': allColumnsFlat.filter(c => ['invoicedThisYear', 'cumulativeInvoiced', 'lastInvoiceDate', 'receivedThisYear', 'cumulativeReceived', 'invoicedNotReceived'].includes(c.prop))
  }
  return Object.entries(groups).map(([group, columns]) => ({ group, columns }))
})

const filterColumns = (columns) => {
  if (!columnSearch.value) return columns
  const search = columnSearch.value.toLowerCase()
  return columns.filter(c => c.label.toLowerCase().includes(search))
}

const handleDialogClose = () => {
  localVisibleColumns.value = [...visibleColumns.value]
}

const confirmColumns = () => {
  visibleColumns.value = [...localVisibleColumns.value]
  showColumnDialog.value = false
}

const transferCount = computed(() => {
  return financeData.value.filter(item => item.projectStatus === '在建').length
})

const newCount = computed(() => {
  return financeData.value.filter(item => item.projectStatus === '待建').length
})

const completedCount = computed(() => {
  return financeData.value.filter(item => ['业务销项', '财务销项'].includes(item.projectStatus)).length
})

// ===== 预警等级判定 =====
// 红色：已竣工（projectStatus === '竣工未送审'），优先级最高
// 蓝色：专项储备结存数为负 或 开累总包营收（内部）为零
// 黄色：开累总包营收（内部）大于零（非红非蓝）
const getWarningLevel = (item) => {
  if (item.projectStatus === '竣工未送审') return 'red'
  const reserve = Number(item.specialReserveBalance) || 0
  const revenue = Number(item.cumulativeRevenue) || 0
  if (reserve < 0 || revenue === 0) return 'blue'
  return 'yellow'
}

const activeWarningFilter = ref(null)
const toggleWarningFilter = (level) => {
  activeWarningFilter.value = activeWarningFilter.value === level ? null : level
}

const blueWarningCount = computed(() => financeData.value.filter(item => getWarningLevel(item) === 'blue').length)
const yellowWarningCount = computed(() => financeData.value.filter(item => getWarningLevel(item) === 'yellow').length)
const redWarningCount = computed(() => financeData.value.filter(item => getWarningLevel(item) === 'red').length)

const tabFilteredData = computed(() => {
  const baseData = financeData.value.filter(item => {
    const matchProductionNo = !searchForm.value.productionProjectNo ||
      item.productionProjectNo === searchForm.value.productionProjectNo
    const matchAccountingNo = !searchForm.value.accountingProjectNo ||
      item.accountingProjectNo === searchForm.value.accountingProjectNo
    const matchProjectName = !searchForm.value.projectName ||
      item.projectName.toLowerCase().includes(searchForm.value.projectName.toLowerCase())
    const matchBasicUnit = searchForm.value.basicUnit.length === 0 ||
      searchForm.value.basicUnit.includes(item.basicUnit)
    const matchAccountingOrg = !searchForm.value.accountingOrg ||
      item.accountingOrg.toLowerCase().includes(searchForm.value.accountingOrg.toLowerCase())
    const matchContractAmount = !searchForm.value.contractAmount ||
      String(item.contractPriceTax).includes(searchForm.value.contractAmount)
    const matchProjectStatus = !searchForm.value.projectStatus ||
      item.projectStatus === searchForm.value.projectStatus
    return matchProductionNo && matchAccountingNo && matchProjectName &&
           matchBasicUnit && matchAccountingOrg && matchContractAmount && matchProjectStatus
  })

  const filteredByTab = (() => {
    switch (activeTab.value) {
      case 'transfer':
        return baseData.filter(item => item.projectStatus === '在建')
      case 'new':
        return baseData.filter(item => item.projectStatus === '待建')
      case 'completed':
        return baseData.filter(item => ['业务销项', '财务销项'].includes(item.projectStatus))
      default:
        return baseData
    }
  })()

  if (activeWarningFilter.value) {
    return filteredByTab.filter(item => getWarningLevel(item) === activeWarningFilter.value)
  }
  return filteredByTab
})

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomDate = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
  return randomDate.toISOString().split('T')[0]
}
const randomNumber = (min, max, decimals = 2) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

const generateMockData = () => {
  const data = []
  const basicUnits = basicUnitOptions.map(o => o.value)
  const statuses = projectStatusOptions.map(o => o.value)

  for (let i = 1; i <= 100; i++) {
    const contractPriceNoTax = randomNumber(1000, 50000)
    const contractTaxRate = randomNumber(9, 13, 0) / 100
    const contractPriceTax = Number((contractPriceNoTax * (1 + contractTaxRate)).toFixed(2))
    const provisionalSumTax = randomNumber(0, contractPriceTax * 0.1)

    data.push({
      productionProjectNo: `SC${String(i).padStart(4, '0')}`,
      accountingProjectNo: `HS${String(i).padStart(4, '0')}`,
      projectName: `项目${['道路改造', '污水治理', '桥梁建设', '河道整治', '绿化工程'][i % 5]}${i}标段`,
      ownerUnitName: `${['上海市政', '江苏城建', '浙江建工', '安徽建设', '山东基建'][i % 5]}有限公司`,
      customerType: randomItem(customerTypes),
      customerNature: randomItem(customerNatures),
      basicUnit: basicUnits[i % basicUnits.length],
      accountingOrg: `${['华东', '华北', '华南'][i % 3]}区域核算中心`,
      originalSector: randomItem(originalSectors),
      regionMarket: randomItem(regionMarkets),
      implementationMode: randomItem(implementationModes),
      subcontractMode: randomItem(subcontractModes),
      cityEnvLevel1: randomItem(cityEnvLevel1),
      cityEnvLevel2: randomItem(cityEnvLevel2),
      cityEnvLevel3: randomItem(cityEnvLevel3),
      provinceCity: randomItem(provinceCities),
      cityDistrict: randomItem(cityDistricts),
      bidDate: randomDate('2024-01-01', '2025-12-31'),
      contractSignDate: randomDate('2024-01-01', '2025-12-31'),
      contractPriceTax,
      provisionalSumTax,
      contractPriceNoTax,
      contractTaxRate: Number(contractTaxRate.toFixed(2)),
      startDate: randomDate('2024-06-01', '2026-05-01'),
      projectStatus: statuses[i % statuses.length],
      currentStatusStartDate: randomDate('2024-06-01', '2026-05-01'),
      completionDate: i % 3 === 0 ? randomDate('2025-01-01', '2026-05-01') : '',
      planRevenue2027: randomNumber(0, 30000),
      completedRevenue2026: randomNumber(0, contractPriceNoTax * 0.8),
      cumulativeRevenue: i % 8 === 0 ? 0 : randomNumber(1, contractPriceNoTax),
      completedOutput2026: randomNumber(0, contractPriceNoTax * 0.7),
      cumulativeOutput: randomNumber(0, contractPriceNoTax),
      lastOutput: randomNumber(0, 5000),
      approvalDate: randomDate('2026-01-01', '2026-05-21'),
      remainingPlan2026: randomNumber(0, 10000),
      contractCompletionRate: randomNumber(0, 100, 1),
      carryForwardRevenue2027: randomNumber(0, 20000),
      carryForwardPlanRevenue2027: randomNumber(0, 15000),
      reportedRevenue2025: randomNumber(0, 20000),
      reportedRevenue2026: randomNumber(0, 15000),
      cumulativeReportedRevenue: randomNumber(0, 35000),
      internalNotReportedRevenue: randomNumber(0, 5000),
      internalNotReportedOutput: randomNumber(0, 5000),
      reportedOutput2026: randomNumber(0, 12000),
      cumulativeReportedOutput: randomNumber(0, 30000),
      contractAsset: randomNumber(0, 8000),
      settlementStatus: randomItem(settlementStatuses),
      settlementPriceTax: i % 2 === 0 ? randomNumber(contractPriceTax * 0.8, contractPriceTax * 1.1) : 0,
      settlementPriceNoTax: i % 2 === 0 ? randomNumber(contractPriceNoTax * 0.8, contractPriceNoTax * 1.1) : 0,
      settlementDate: i % 2 === 0 ? randomDate('2025-06-01', '2026-05-21') : '',
      projectManager: `${['张', '李', '王', '刘', '陈'][i % 5]}经理`,
      projectLeader: `${['赵', '孙', '周', '吴', '郑'][i % 5]}工`,
      cumulativeRevenue2025: randomNumber(0, 25000),
      cumulativeOutput2025: randomNumber(0, 25000),
      carryForwardRevenue2026: randomNumber(0, 18000),
      planRevenue2026: randomNumber(5000, 30000),
      planAdjustment2026: randomNumber(-5000, 5000),
      adjustedPlanNoTax: randomNumber(5000, 30000),
      targetProfitMarginNoTax: randomNumber(5, 15, 1),
      targetProfitMarginTax: randomNumber(4, 13, 1),
      grossProfitNotReported: randomNumber(0, 3000),
      targetProfit: randomNumber(100, 5000),
      profitMargin: randomNumber(3, 20, 1),
      actualProfit: randomNumber(0, 4000),
      currentProfitImpact: randomNumber(-1000, 3000),
      carryForwardGrossProfit2026: randomNumber(0, 2000),
      accruedGrossProfit2025: randomNumber(0, 5000),
      realizedProfit2026: randomNumber(0, 3000),
      cumulativeAccruedGrossProfit: randomNumber(0, 8000),
      planGrossProfit2026: randomNumber(500, 4000),
      carryForwardTargetGrossProfit2027: randomNumber(0, 2500),
      accruedGrossProfitGroup2025: randomNumber(0, 4000),
      realizedProfitGroup2026: randomNumber(0, 2500),
      cumulativeAccruedGrossProfitGroup: randomNumber(0, 6500),
      remainingPlanGrossProfit2026: randomNumber(0, 2000),
      rdCost2025: randomNumber(0, 500),
      rdCostJan: randomNumber(0, 200),
      cumulativeRdCost: randomNumber(0, 800),
      bookedCost: randomNumber(0, contractPriceNoTax * 0.9),
      carriedCost: randomNumber(0, contractPriceNoTax * 0.8),
      projectInventory: randomNumber(0, 3000),
      rdPlusCarriedCost: randomNumber(0, contractPriceNoTax),
      estimatedCost: randomNumber(0, 5000),
      subcontractComparison: randomNumber(-1000, 1000),
      taxAmount: randomNumber(0, 5000),
      accruedProfit: randomNumber(-500, 2000),
      grossMarginInProgress: randomNumber(0, 25, 1),
      grossMarginDeviation: randomNumber(-10, 5, 1),
      safetyFeeRate: randomNumber(1, 3, 1),
      specialReserveBeginning: randomNumber(0, 1000),
      specialReserveJan提取: randomNumber(0, 200),
      cumulativeSafetyFee提取: randomNumber(0, 1500),
      specialReserveJan使用: randomNumber(0, 150),
      cumulativeSpecialReserve使用: randomNumber(0, 1200),
      specialReserveBalance: i % 7 === 0 ? randomNumber(-300, -10) : randomNumber(0, 800),
      invoicedThisYear: randomNumber(0, 15000),
      cumulativeInvoiced: randomNumber(0, contractPriceTax),
      lastInvoiceDate: randomDate('2026-01-01', '2026-05-21'),
      receivedThisYear: randomNumber(0, 12000),
      cumulativeReceived: randomNumber(0, contractPriceTax * 0.9),
      invoicedNotReceived: randomNumber(0, 5000)
    })
  }
  return data
}

const searchForm = ref({
  productionProjectNo: '',
  accountingProjectNo: '',
  projectName: '',
  basicUnit: [],
  accountingOrg: '',
  contractAmount: '',
  projectStatus: ''
})

const tableHeight = ref(Math.max(300, window.innerHeight - 450))

const updateTableHeight = () => {
  tableHeight.value = Math.max(300, window.innerHeight - 450)
}
const financeData = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tabFilteredData.value.slice(start, end)
})
watch(tabFilteredData, () => {
  currentPage.value = 1
})

// ===== 导入与版本留存逻辑 =====
const VERSIONS_KEY = 'financeReport_versions'
const importInputRef = ref(null)
const showVersionDialog = ref(false)
const versions = ref([])
const currentVersionId = ref(null) // 当前生效版本 id（null 表示系统默认数据）

// 列头 -> prop 映射（排除序号列），用于导入解析与模板生成
const labelToProp = {}
allColumnsFlat.forEach(c => {
  if (c.prop !== 'index') labelToProp[c.label] = c.prop
})
const importColumns = allColumnsFlat.filter(c => c.prop !== 'index')

// 当前年月作为周期键，对应「上月25-本月25」区间
const getPeriodKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// 格式化时间
const formatDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// 读取本地版本列表
const loadVersions = () => {
  try {
    const raw = localStorage.getItem(VERSIONS_KEY)
    versions.value = raw ? JSON.parse(raw) : []
  } catch (e) {
    versions.value = []
  }
}

// 持久化版本列表
const persistVersions = () => {
  localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions.value))
}

// 当月留存版本：该周期内导入日期 ≤ 25 号的最后一版
const lockedVersionId = computed(() => {
  const period = getPeriodKey()
  const periodVersions = versions.value
    .filter(v => v.periodKey === period)
    .filter(v => Number(v.importTime.slice(8, 10)) <= 25)
    .sort((a, b) => b.importTime.localeCompare(a.importTime))
  return periodVersions.length ? periodVersions[0].id : null
})

// 当前周期是否已有手动导入
const hasManualImport = () => {
  const period = getPeriodKey()
  return versions.value.some(v => v.periodKey === period)
}

// 留存版本信息（用于横幅展示）
const currentVersionInfo = computed(() => {
  if (!currentVersionId.value) return null
  const v = versions.value.find(item => item.id === currentVersionId.value)
  return v ? { importTime: v.importTime, rowCount: v.rowCount } : null
})

// 保存一个新版本
const saveVersion = (data, fileName) => {
  const now = new Date()
  const version = {
    id: now.getTime(),
    importTime: formatDateTime(now),
    periodKey: getPeriodKey(),
    fileName: fileName || '导入数据.xlsx',
    rowCount: data.length,
    data
  }
  versions.value.push(version)
  persistVersions()
  return version
}

// 触发文件选择
const triggerImport = () => {
  importInputRef.value && importInputRef.value.click()
}

// 解析 Excel 并导入
const handleImport = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result)
      const wb = read(data, { type: 'array' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const rows = utils.sheet_to_json(sheet, { header: 1, defval: '' })
      if (rows.length < 2) {
        ElMessage.warning('文件没有数据行，请按模板填写后再导入')
        resetInput(e)
        return
      }
      const headerRow = rows[0].map(h => String(h).trim())
      const colIndexToProps = headerRow.map(label => labelToProp[label] || null)
      const parsedData = []
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        if (!row || row.every(c => c === '' || c === null || c === undefined)) continue
        const obj = {}
        // 先补全所有列为默认空值
        allColumnsFlat.forEach(c => { obj[c.prop] = '' })
        colIndexToProps.forEach((prop, idx) => {
          if (prop) {
            const val = row[idx]
            obj[prop] = val === null || val === undefined ? '' : val
          }
        })
        // 重建必填字段缺失时的默认值
        obj.index = parsedData.length + 1
        if (!obj.productionProjectNo) obj.productionProjectNo = `SC${String(parsedData.length + 1).padStart(4, '0')}`
        if (!obj.accountingProjectNo) obj.accountingProjectNo = `HS${String(parsedData.length + 1).padStart(4, '0')}`
        if (!obj.projectName) obj.projectName = '未命名项目'
        parsedData.push(obj)
      }
      if (parsedData.length === 0) {
        ElMessage.warning('未解析到有效数据行，请检查文件内容')
        resetInput(e)
        return
      }
      const version = saveVersion(parsedData, file.name)
      financeData.value = parsedData
      currentVersionId.value = version.id
      ElMessage.success(`导入成功，共 ${parsedData.length} 条数据，已留存版本`)
    } catch (err) {
      ElMessage.error('文件解析失败，请确认使用下载的模板填写')
    }
    resetInput(e)
  }
  reader.readAsArrayBuffer(file)
}

const resetInput = (e) => {
  if (e && e.target) e.target.value = ''
}

// 恢复为历史版本
const handleApplyVersion = (row) => {
  financeData.value = (row.data && row.data.length) ? JSON.parse(JSON.stringify(row.data)) : []
  currentVersionId.value = row.id
  ElMessage.success(`已恢复为 ${row.importTime} 的版本`)
}

// 下载导入模板
const handleDownloadTemplate = () => {
  const headers = importColumns.map(c => c.label)
  const sheet = utils.aoa_to_sheet([headers])
  const wb = utils.book_new()
  utils.book_append_sheet(wb, sheet, '业财统计报表')
  writeFile(wb, '业财统计报表导入模板.xlsx')
}

// 初始化：若当前周期已有留存版本，则加载留存版本，停止自动更新（不再生成 mock）
onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
  loadVersions()
  const lockedId = lockedVersionId.value
  if (lockedId) {
    const locked = versions.value.find(v => v.id === lockedId)
    financeData.value = locked && locked.data ? JSON.parse(JSON.stringify(locked.data)) : []
    currentVersionId.value = lockedId
  } else if (hasManualImport()) {
    // 当月有导入但无 25 号前的留存版，取当月最新一版
    const period = getPeriodKey()
    const periodVersions = versions.value
      .filter(v => v.periodKey === period)
      .sort((a, b) => b.importTime.localeCompare(a.importTime))
    if (periodVersions.length) {
      const latest = periodVersions[0]
      financeData.value = latest.data ? JSON.parse(JSON.stringify(latest.data)) : []
      currentVersionId.value = latest.id
    } else {
      financeData.value = generateMockData()
    }
  } else {
    financeData.value = generateMockData()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})

localVisibleColumns.value = [...visibleColumns.value]

const filteredData = computed(() => {
  return financeData.value.filter(item => {
    const matchProductionNo = !searchForm.value.productionProjectNo ||
      item.productionProjectNo === searchForm.value.productionProjectNo
    const matchAccountingNo = !searchForm.value.accountingProjectNo ||
      item.accountingProjectNo === searchForm.value.accountingProjectNo
    const matchProjectName = !searchForm.value.projectName ||
      item.projectName.toLowerCase().includes(searchForm.value.projectName.toLowerCase())
    const matchBasicUnit = searchForm.value.basicUnit.length === 0 ||
      searchForm.value.basicUnit.includes(item.basicUnit)
    const matchAccountingOrg = !searchForm.value.accountingOrg ||
      item.accountingOrg.toLowerCase().includes(searchForm.value.accountingOrg.toLowerCase())
    const matchContractAmount = !searchForm.value.contractAmount ||
      String(item.contractPriceTax).includes(searchForm.value.contractAmount)
    const matchProjectStatus = !searchForm.value.projectStatus ||
      item.projectStatus === searchForm.value.projectStatus
    return matchProductionNo && matchAccountingNo && matchProjectName &&
           matchBasicUnit && matchAccountingOrg && matchContractAmount && matchProjectStatus
  })
})

const handleSearch = () => {}

const handleReset = () => {
  searchForm.value = {
    productionProjectNo: '',
    accountingProjectNo: '',
    projectName: '',
    basicUnit: [],
    accountingOrg: '',
    contractAmount: '',
    projectStatus: ''
  }
}

const resetColumns = () => {
  visibleColumns.value = allColumnsFlat.map(c => c.prop)
  ElMessage.success('已恢复默认字段')
}

const handleExport = () => {
  const exportColumns = allColumnsFlat
  const rows = filteredData.value.map((item, index) => {
    const row = {}
    exportColumns.forEach(col => {
      row[col.label] = col.prop === 'index' ? index + 1 : item[col.prop]
    })
    return row
  })
  const sheet = utils.json_to_sheet(rows, { header: exportColumns.map(c => c.label) })
  const wb = utils.book_new()
  utils.book_append_sheet(wb, sheet, '业财统计报表')
  writeFile(wb, `业财统计报表_${new Date().toISOString().slice(0, 10)}.xlsx`)
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.finance-report {
  padding: 20px;
}

.version-banner {
  margin-bottom: 16px;
}

.version-current {
  margin-left: 8px;
  color: #67c23a;
}

.version-plain {
  color: #c0c4cc;
}

.warning-boxes {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.warning-box {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.warning-label {
  font-size: 12px;
  font-weight: bold;
}

.warning-count {
  font-size: 13px;
  font-weight: bold;
}

.warning-blue {
  background: #ecf5ff;
  color: #409eff;
  border-color: #d9ecff;
}

.warning-blue.active {
  border-color: #409eff;
  background: #d9ecff;
}

.warning-yellow {
  background: #fdf6ec;
  color: #e6a23c;
  border-color: #faecd8;
}

.warning-yellow.active {
  border-color: #e6a23c;
  background: #faecd8;
}

.warning-red {
  background: #fef0f0;
  color: #f56c6c;
  border-color: #fde2e2;
}

.warning-red.active {
  border-color: #f56c6c;
  background: #fde2e2;
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

.table-header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.column-icon {
  margin-right: 4px;
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.finance-table {
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

:deep(.el-dropdown-menu) {
  max-height: 400px;
  overflow-y: auto;
  min-width: 200px;
}

:deep(.el-dropdown-item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-checkbox__input.is-disabled + .el-checkbox__label) {
  color: #999;
}

.column-selector {
  max-height: 500px;
  overflow-y: auto;
}

.column-group {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 12px;
}

.group-title {
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.column-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.tab-container {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.finance-tabs {
  :deep(.el-tabs__nav) {
    margin-bottom: 0;
    background-color: #f5f7fa;
    padding: 8px;
    border-radius: 30px;
  }

  :deep(.el-tabs__item) {
    padding: 8px 24px;
    font-size: 14px;
    background-color: #a8d4e8;
    color: #333;
    border-radius: 20px;
    margin-right: 8px;
    border: none;
  }

  :deep(.el-tabs__item.is-active) {
    background-color: #4a90c2;
    color: #fff;
    font-weight: bold;
  }

  :deep(.el-tabs__item:hover) {
    background-color: #7bc0e3;
    color: #333;
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }
}

.tab-badge {
  margin-left: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}
</style>
