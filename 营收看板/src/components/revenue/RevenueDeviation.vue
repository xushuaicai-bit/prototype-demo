<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">偏差项目表</h2>
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

    <el-tabs v-model="activeDeviationTab" type="card" class="w-full mb-4">
      <el-tab-pane label="当月偏差项目表" name="monthly"></el-tab-pane>
      <el-tab-pane label="季度偏差表" name="quarterly"></el-tab-pane>
    </el-tabs>

    <!-- 当月偏差项目表 -->
    <template v-if="activeDeviationTab === 'monthly'">
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
          <label class="text-sm text-gray-600 mr-2">产运管控等级：</label>
          <el-select v-model="filters.isKeyProject" placeholder="请选择" class="w-32">
            <el-option label="全部" value="" />
            <el-option label="重点项目" value="重点项目" />
            <el-option label="一般项目" value="一般项目" />
          </el-select>
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">项目状态：</label>
          <el-select v-model="filters.status" placeholder="请选择" class="w-32">
            <el-option label="全部" value="" />
            <el-option v-for="s in projectStatusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">纠偏完成情况：</label>
          <el-select v-model="filters.correctiveStatus" placeholder="请选择" class="w-32">
            <el-option label="全部" value="" />
            <el-option v-for="s in correctiveStatusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">年月：</label>
          <el-select v-model="deviationYear" placeholder="年" class="w-24">
            <el-option v-for="y in yearOptions" :key="y.value" :label="y.label" :value="y.value" />
          </el-select>
          <el-select v-model="deviationMonth" placeholder="月" class="w-20 ml-1">
            <el-option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
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

      <div>
        <el-table
          :data="monthlyPaginatedData"
          border
          :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
          :row-class-name="getRowClassName"
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
            label="产运管控等级"
            prop="isKeyProject"
            width="160"
            align="center"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.isKeyProject === '重点项目'" type="warning" size="small">
                重点项目
              </el-tag>
              <span v-else class="text-gray-400">一般项目</span>
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
            sortable
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
            sortable
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
            sortable
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
            sortable
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
            sortable
          >
            <template #default="scope">
              {{ formatNumber(scope.row.totalAccumulatedRevenue) }}
            </template>
          </el-table-column>

          <el-table-column
            :label="`${deviationMonth}计划营收`"
            prop="monthPlanRevenue"
            width="130"
            align="right"
            sortable
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
            :label="`${deviationMonth}完成营收`"
            prop="monthActualRevenue"
            width="130"
            align="right"
            sortable
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
            :label="`${deviationMonth}营收完成率`"
            prop="completionRate"
            width="140"
            align="center"
            sortable
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
            :label="`${deviationMonth}营收偏差`"
            prop="deviation"
            width="130"
            align="right"
            sortable
          >
            <template #default="scope">
              <span :class="{ 'text-red-600 font-medium': scope.row.deviation < 0 }">
                {{ formatNumber(scope.row.deviation) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            :label="`${deviationMonth}营收偏差原因`"
            prop="deviationReason"
            width="180"
          >
            <template #default="scope">
              <span>{{ scope.row.deviationReason || '' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="计划采取措施及节点"
            prop="correctiveMeasures"
            width="200"
          >
            <template #default="scope">
              <span class="px-1 rounded block truncate">
                {{ scope.row.correctiveMeasures || '' }}
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
              <el-tag
                :type="scope.row.correctiveStatus === '已完成' ? 'success' : scope.row.correctiveStatus === '纠偏中' ? 'warning' : 'info'"
                size="small"
              >
                {{ scope.row.correctiveStatus }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="当月营收负偏差"
            prop="negativeDeviation"
            width="140"
            align="right"
            sortable
          >
            <template #default="scope">
              <span :class="{ 'text-red-600 font-medium': scope.row.negativeDeviation < 0, 'text-green-600': scope.row.negativeDeviation > 0 }">
                {{ scope.row.negativeDeviation > 0 ? '+' : '' }}{{ scope.row.negativeDeviation.toFixed(2) }}
              </span>
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
        <div class="flex justify-end mt-3">
          <el-pagination
            v-model:current-page="monthlyPage"
            v-model:page-size="monthlyPageSize"
            :page-sizes="[10, 20, 50]"
            :total="filteredData.length"
            layout="total, sizes, prev, pager, next"
            background
            small
          />
        </div>
      </div>
    </template>

    <!-- 季度偏差表 -->
    <template v-if="activeDeviationTab === 'quarterly'">
      <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">项目编号：</label>
          <el-input v-model="quarterlyFilters.projectCode" placeholder="请输入" class="w-40" />
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">项目名称：</label>
          <el-input v-model="quarterlyFilters.projectName" placeholder="请输入" class="w-56" />
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">基层单位：</label>
          <el-select v-model="quarterlyFilters.unit" placeholder="请选择" class="w-40">
            <el-option label="全部" value="" />
            <el-option label="生态事业部" value="生态事业部" />
            <el-option label="管网事业部" value="管网事业部" />
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
          <label class="text-sm text-gray-600 mr-2">产运管控等级：</label>
          <el-select v-model="quarterlyFilters.isKeyProject" placeholder="请选择" class="w-32">
            <el-option label="全部" value="" />
            <el-option label="重点项目" value="重点项目" />
            <el-option label="一般项目" value="一般项目" />
          </el-select>
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">年季：</label>
          <el-select v-model="quarterlyYear" placeholder="年" class="w-24">
            <el-option v-for="y in yearOptions" :key="y.value" :label="y.label" :value="y.value" />
          </el-select>
          <el-select v-model="quarterlyQuarter" placeholder="季" class="w-20 ml-1">
            <el-option label="Q1" value="Q1" />
            <el-option label="Q2" value="Q2" />
            <el-option label="Q3" value="Q3" />
            <el-option label="Q4" value="Q4" />
          </el-select>
        </div>
      </div>

      <div>
        <el-table
          :data="quarterlyPaginatedData"
          border
          :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
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
            width="130"
            :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
          />

          <el-table-column
            label="项目名称"
            prop="projectName"
            fixed="left"
            width="200"
            :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
          />

          <el-table-column
            label="基层单位"
            prop="unit"
            width="140"
          />

          <el-table-column
            label="产运管控等级"
            prop="isKeyProject"
            width="160"
            align="center"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.isKeyProject === '重点项目'" type="warning" size="small">
                重点项目
              </el-tag>
              <span v-else class="text-gray-400">一般项目</span>
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
            label="偏差触发类型"
            prop="deviationTriggerType"
            width="130"
            align="center"
          >
            <template #default="scope">
              <el-tag type="danger" size="small">
                {{ scope.row.deviationTriggerType }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="合同价(不含税)"
            prop="contractAmount"
            width="140"
            align="right"
            sortable
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
            sortable
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
            sortable
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
            sortable
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
            sortable
          >
            <template #default="scope">
              {{ formatNumber(scope.row.totalAccumulatedRevenue) }}
            </template>
          </el-table-column>

          <el-table-column
            label="本季度原批复计划"
            prop="quarterOriginalPlan"
            width="150"
            align="right"
            sortable
          >
            <template #default="scope">
              <span
                class="cursor-pointer hover:bg-blue-100 px-1 rounded"
                @dblclick="startEdit(scope.row, 'quarterOriginalPlan')"
              >
                <el-input
                  v-if="editingCell === `${scope.row.id}-quarterOriginalPlan`"
                  v-model="editValue"
                  @blur="finishEdit(scope.row, 'quarterOriginalPlan')"
                  @keyup.enter="finishEdit(scope.row, 'quarterOriginalPlan')"
                  class="w-full"
                />
                <span v-else>{{ formatNumber(scope.row.quarterOriginalPlan) }}</span>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="本季度修订后计划"
            prop="quarterRevisedPlan"
            width="150"
            align="right"
            sortable
          >
            <template #default="scope">
              <span
                class="cursor-pointer hover:bg-blue-100 px-1 rounded"
                @dblclick="startEdit(scope.row, 'quarterRevisedPlan')"
              >
                <el-input
                  v-if="editingCell === `${scope.row.id}-quarterRevisedPlan`"
                  v-model="editValue"
                  @blur="finishEdit(scope.row, 'quarterRevisedPlan')"
                  @keyup.enter="finishEdit(scope.row, 'quarterRevisedPlan')"
                  class="w-full"
                />
                <span v-else>{{ formatNumber(scope.row.quarterRevisedPlan) }}</span>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="本年/本季计划下调额"
            prop="planReductionAmount"
            width="160"
            align="right"
            sortable
          >
            <template #default="scope">
              <span :class="{ 'text-red-600 font-medium': scope.row.planReductionAmount > 0 }">
                {{ formatNumber(scope.row.planReductionAmount) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="营收偏差原因"
            prop="deviationReason"
            width="180"
          >
            <template #default="scope">
              <span>{{ scope.row.deviationReason || '' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="计划采取措施及节点"
            prop="correctiveMeasures"
            width="200"
          >
            <template #default="scope">
              <span class="px-1 rounded block truncate">
                {{ scope.row.correctiveMeasures || '' }}
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
              <el-tag
                :type="scope.row.correctiveStatus === '已完成' ? 'success' : scope.row.correctiveStatus === '纠偏中' ? 'warning' : 'info'"
                size="small"
              >
                {{ scope.row.correctiveStatus }}
              </el-tag>
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
        <div class="flex justify-end mt-3">
          <el-pagination
            v-model:current-page="quarterlyPage"
            v-model:page-size="quarterlyPageSize"
            :page-sizes="[10, 20, 50]"
            :total="quarterlyFilteredData.length"
            layout="total, sizes, prev, pager, next"
            background
            small
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { utils, writeFile } from 'xlsx'

// 分页状态
const monthlyPage = ref(1)
const monthlyPageSize = ref(10)
const quarterlyPage = ref(1)
const quarterlyPageSize = ref(10)

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

const yearOptions = [
  { value: '2026', label: '2026年' },
  { value: '2025', label: '2025年' },
  { value: '2024', label: '2024年' }
]

const deviationYear = ref('2026')
const deviationMonth = ref('8月')
const quarterlyYear = ref('2026')
const quarterlyQuarter = ref('')
const activeDeviationTab = ref('monthly')

const projectStatusOptions = ['待建', '在建', '停工', '完工', '竣工未送审', '已送审', '审定未销项', '业务销项', '财务销项']
const correctiveStatusOptions = ['未开始', '纠偏中', '已完成']

const filters = ref({
  projectCode: '',
  projectName: '',
  unit: '',
  isKeyProject: '',
  status: '',
  correctiveStatus: ''
})

const quarterlyFilters = ref({
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
    isKeyProject: '重点项目',
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
    isKeyProject: '一般项目',
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
    isKeyProject: '重点项目',
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
    isKeyProject: '一般项目',
    status: '竣工未送审',
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
    isKeyProject: '重点项目',
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
    isKeyProject: '一般项目',
    status: '财务销项',
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
    remark: '项目已销项'
  },
  {
    id: 7,
    projectCode: 'XM-2024-007',
    projectName: '松江区水环境治理项目',
    unit: '环境建设分公司',
    isKeyProject: '重点项目',
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
    isKeyProject: '一般项目',
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
  },
  {
    id: 9,
    projectCode: 'XM-2024-009',
    projectName: '管网检测及修复工程',
    unit: '管网事业部',
    isKeyProject: '重点项目',
    status: '停工',
    contractAmount: 15000,
    carryForwardRevenue: 6000,
    annualPlanRevenue: 9000,
    annualAccumulatedRevenue: 6500,
    totalAccumulatedRevenue: 8000,
    monthPlanRevenue: 900,
    monthActualRevenue: 720,
    deviationReason: '检测设备维修延误',
    correctiveMeasures: '紧急调配备用设备',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 10,
    projectCode: 'XM-2024-010',
    projectName: '生态湿地修复工程',
    unit: '生态事业部',
    isKeyProject: '重点项目',
    status: '在建',
    contractAmount: 18000,
    carryForwardRevenue: 8000,
    annualPlanRevenue: 11000,
    annualAccumulatedRevenue: 7500,
    totalAccumulatedRevenue: 9500,
    monthPlanRevenue: 1100,
    monthActualRevenue: 880,
    deviationReason: '雨季施工影响',
    correctiveMeasures: '增加施工人员和设备',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 11,
    projectCode: 'XM-2024-011',
    projectName: '区域管网改造项目',
    unit: '区域事业部',
    isKeyProject: '一般项目',
    status: '在建',
    contractAmount: 9200,
    carryForwardRevenue: 4000,
    annualPlanRevenue: 6000,
    annualAccumulatedRevenue: 4200,
    totalAccumulatedRevenue: 5200,
    monthPlanRevenue: 620,
    monthActualRevenue: 480,
    deviationReason: '地下管线复杂',
    correctiveMeasures: '聘请专业探测团队',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 12,
    projectCode: 'XM-2024-012',
    projectName: '市政道路排水工程',
    unit: '市政事业部',
    isKeyProject: '一般项目',
    status: '已送审',
    contractAmount: 11000,
    carryForwardRevenue: 5000,
    annualPlanRevenue: 7000,
    annualAccumulatedRevenue: 4800,
    totalAccumulatedRevenue: 6200,
    monthPlanRevenue: 720,
    monthActualRevenue: 560,
    deviationReason: '交通管制影响',
    correctiveMeasures: '申请夜间施工许可',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 13,
    projectCode: 'XM-2024-013',
    projectName: '环保设施升级改造',
    unit: '环境建设',
    isKeyProject: '重点项目',
    status: '在建',
    contractAmount: 13500,
    carryForwardRevenue: 5500,
    annualPlanRevenue: 8500,
    annualAccumulatedRevenue: 5800,
    totalAccumulatedRevenue: 7200,
    monthPlanRevenue: 850,
    monthActualRevenue: 680,
    deviationReason: '设备采购周期长',
    correctiveMeasures: '提前预订设备',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 14,
    projectCode: 'XM-2024-014',
    projectName: '管道防腐工程',
    unit: '管道工程',
    isKeyProject: '一般项目',
    status: '审定未销项',
    contractAmount: 8500,
    carryForwardRevenue: 3500,
    annualPlanRevenue: 5500,
    annualAccumulatedRevenue: 3800,
    totalAccumulatedRevenue: 4800,
    monthPlanRevenue: 580,
    monthActualRevenue: 420,
    deviationReason: '材料质量不达标返工',
    correctiveMeasures: '更换供应商',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 15,
    projectCode: 'XM-2024-015',
    projectName: '管道安全检测项目',
    unit: '管道分公司',
    isKeyProject: '一般项目',
    status: '在建',
    contractAmount: 6500,
    carryForwardRevenue: 2800,
    annualPlanRevenue: 4200,
    annualAccumulatedRevenue: 3000,
    totalAccumulatedRevenue: 3800,
    monthPlanRevenue: 450,
    monthActualRevenue: 380,
    deviationReason: '检测人员短缺',
    correctiveMeasures: '招聘临时检测人员',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 16,
    projectCode: 'XM-2024-016',
    projectName: '运营设备维护项目',
    unit: '运营养护',
    isKeyProject: '重点项目',
    status: '业务销项',
    contractAmount: 7200,
    carryForwardRevenue: 3000,
    annualPlanRevenue: 4800,
    annualAccumulatedRevenue: 3200,
    totalAccumulatedRevenue: 4200,
    monthPlanRevenue: 520,
    monthActualRevenue: 420,
    deviationReason: '设备老化维修频次高',
    correctiveMeasures: '申请设备更新预算',
    correctiveStatus: '已完成',
    remark: ''
  },
  {
    id: 17,
    projectCode: 'XM-2024-017',
    projectName: '二次供水改造工程',
    unit: '二次养护',
    isKeyProject: '重点项目',
    status: '在建',
    contractAmount: 9800,
    carryForwardRevenue: 4200,
    annualPlanRevenue: 6200,
    annualAccumulatedRevenue: 4300,
    totalAccumulatedRevenue: 5600,
    monthPlanRevenue: 650,
    monthActualRevenue: 520,
    deviationReason: '小区协调困难',
    correctiveMeasures: '加强与物业沟通',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 18,
    projectCode: 'XM-2024-018',
    projectName: '区域管网新建工程',
    unit: '区域事业部',
    isKeyProject: '重点项目',
    status: '待建',
    contractAmount: 16500,
    carryForwardRevenue: 7000,
    annualPlanRevenue: 10000,
    annualAccumulatedRevenue: 7200,
    totalAccumulatedRevenue: 9000,
    monthPlanRevenue: 1000,
    monthActualRevenue: 780,
    deviationReason: '地质条件复杂',
    correctiveMeasures: '调整施工方案',
    correctiveStatus: '纠偏中',
    remark: ''
  }
]

const quarterlyRawData = [
  {
    id: 101,
    projectCode: 'XM-2024-Q001',
    projectName: '浦东新区污水处理厂扩建工程',
    unit: '生态事业部',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '进度滞后',
    contractAmount: 12500,
    carryForwardRevenue: 5000,
    annualPlanRevenue: 8000,
    annualAccumulatedRevenue: 4500,
    totalAccumulatedRevenue: 6500,
    quarterOriginalPlan: 2400,
    quarterRevisedPlan: 2100,
    deviationReason: '雨季施工影响进度',
    correctiveMeasures: '增加夜间施工班组，调整施工工序',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 102,
    projectCode: 'XM-2024-Q002',
    projectName: '黄浦区老旧管网改造二期项目',
    unit: '管网事业部',
    isKeyProject: '一般项目',
    status: '在建',
    deviationTriggerType: '成本超支',
    contractAmount: 9200,
    carryForwardRevenue: 3800,
    annualPlanRevenue: 5600,
    annualAccumulatedRevenue: 3200,
    totalAccumulatedRevenue: 4500,
    quarterOriginalPlan: 1680,
    quarterRevisedPlan: 1450,
    deviationReason: '原材料价格上涨导致成本增加',
    correctiveMeasures: '优化采购渠道，寻求替代材料',
    correctiveStatus: '纠偏中',
    remark: '已提交调价申请'
  },
  {
    id: 103,
    projectCode: 'XM-2024-Q003',
    projectName: '徐汇区雨水泵站升级改造工程',
    unit: '市政事业部',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '外部因素',
    contractAmount: 6800,
    carryForwardRevenue: 2500,
    annualPlanRevenue: 5200,
    annualAccumulatedRevenue: 3800,
    totalAccumulatedRevenue: 5200,
    quarterOriginalPlan: 1560,
    quarterRevisedPlan: 1300,
    deviationReason: '周边居民投诉导致停工整改',
    correctiveMeasures: '加强沟通协调，优化施工时间',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 104,
    projectCode: 'XM-2024-Q004',
    projectName: '长宁区智慧水务平台建设项目',
    unit: '环境建设',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '资源不足',
    contractAmount: 18500,
    carryForwardRevenue: 7000,
    annualPlanRevenue: 11500,
    annualAccumulatedRevenue: 6800,
    totalAccumulatedRevenue: 8500,
    quarterOriginalPlan: 3400,
    quarterRevisedPlan: 2900,
    deviationReason: '技术人员配置不足',
    correctiveMeasures: '引进外部技术团队支持',
    correctiveStatus: '未开始',
    remark: '急需技术人才'
  },
  {
    id: 105,
    projectCode: 'XM-2024-Q005',
    projectName: '闵行区供水管网扩容工程',
    unit: '管道工程',
    isKeyProject: '一般项目',
    status: '在建',
    deviationTriggerType: '进度滞后',
    contractAmount: 10500,
    carryForwardRevenue: 4200,
    annualPlanRevenue: 7800,
    annualAccumulatedRevenue: 4600,
    totalAccumulatedRevenue: 6200,
    quarterOriginalPlan: 2340,
    quarterRevisedPlan: 2000,
    deviationReason: '地下管线复杂导致工期延长',
    correctiveMeasures: '采用非开挖技术减少开挖量',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 106,
    projectCode: 'XM-2024-Q006',
    projectName: '松江区河道综合治理工程',
    unit: '生态事业部',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '质量缺陷',
    contractAmount: 14200,
    carryForwardRevenue: 5800,
    annualPlanRevenue: 9200,
    annualAccumulatedRevenue: 5200,
    totalAccumulatedRevenue: 7800,
    quarterOriginalPlan: 2760,
    quarterRevisedPlan: 2400,
    deviationReason: '部分工程质量不达标需返工',
    correctiveMeasures: '加强质量管控，落实三检制度',
    correctiveStatus: '纠偏中',
    remark: '已制定整改方案'
  },
  {
    id: 107,
    projectCode: 'XM-2024-Q007',
    projectName: '嘉定区污水处理设施升级项目',
    unit: '区域事业部',
    isKeyProject: '一般项目',
    status: '完工',
    deviationTriggerType: '进度滞后',
    contractAmount: 8900,
    carryForwardRevenue: 3600,
    annualPlanRevenue: 6500,
    annualAccumulatedRevenue: 6500,
    totalAccumulatedRevenue: 6500,
    quarterOriginalPlan: 1950,
    quarterRevisedPlan: 1950,
    deviationReason: '',
    correctiveMeasures: '',
    correctiveStatus: '已完成',
    remark: '项目已完工验收'
  },
  {
    id: 108,
    projectCode: 'XM-2024-Q008',
    projectName: '青浦区农村饮水安全工程',
    unit: '市政事业部',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '外部因素',
    contractAmount: 7600,
    carryForwardRevenue: 3000,
    annualPlanRevenue: 5400,
    annualAccumulatedRevenue: 2800,
    totalAccumulatedRevenue: 4000,
    quarterOriginalPlan: 1620,
    quarterRevisedPlan: 1350,
    deviationReason: '征地拆迁进度滞后',
    correctiveMeasures: '协调地方政府加快拆迁进度',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 109,
    projectCode: 'XM-2024-Q009',
    projectName: '奉贤区工业废水处理项目',
    unit: '环境建设',
    isKeyProject: '一般项目',
    status: '在建',
    deviationTriggerType: '成本超支',
    contractAmount: 11800,
    carryForwardRevenue: 4800,
    annualPlanRevenue: 8200,
    annualAccumulatedRevenue: 4800,
    totalAccumulatedRevenue: 6800,
    quarterOriginalPlan: 2460,
    quarterRevisedPlan: 2100,
    deviationReason: '特殊处理工艺成本超预期',
    correctiveMeasures: '优化工艺流程，降低运行成本',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 110,
    projectCode: 'XM-2024-Q010',
    projectName: '金山区供水安全保障工程',
    unit: '管道分公司',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '资源不足',
    contractAmount: 9500,
    carryForwardRevenue: 3800,
    annualPlanRevenue: 6800,
    annualAccumulatedRevenue: 4000,
    totalAccumulatedRevenue: 5600,
    quarterOriginalPlan: 2040,
    quarterRevisedPlan: 1750,
    deviationReason: '关键设备到货延迟',
    correctiveMeasures: '联系厂家加急生产发货',
    correctiveStatus: '未开始',
    remark: '设备预计下月到货'
  },
  {
    id: 111,
    projectCode: 'XM-2024-Q011',
    projectName: '崇明岛生态修复示范项目',
    unit: '生态事业部',
    isKeyProject: '重点项目',
    status: '在建',
    deviationTriggerType: '进度滞后',
    contractAmount: 16800,
    carryForwardRevenue: 6500,
    annualPlanRevenue: 10200,
    annualAccumulatedRevenue: 5800,
    totalAccumulatedRevenue: 8200,
    quarterOriginalPlan: 3060,
    quarterRevisedPlan: 2600,
    deviationReason: '生态保护要求高导致施工受限',
    correctiveMeasures: '调整施工方案，采用生态友好型技术',
    correctiveStatus: '纠偏中',
    remark: ''
  },
  {
    id: 112,
    projectCode: 'XM-2024-Q012',
    projectName: '杨浦区老旧小区供水改造工程',
    unit: '二次养护',
    isKeyProject: '一般项目',
    status: '竣工未送审',
    deviationTriggerType: '外部因素',
    contractAmount: 5800,
    carryForwardRevenue: 2200,
    annualPlanRevenue: 5800,
    annualAccumulatedRevenue: 5400,
    totalAccumulatedRevenue: 5400,
    quarterOriginalPlan: 1400,
    quarterRevisedPlan: 1200,
    deviationReason: '小区居民配合度低影响施工',
    correctiveMeasures: '加强与社区居委会的沟通协调',
    correctiveStatus: '纠偏中',
    remark: ''
  }
]

const calculateDerivedFields = (data) => {
  return data.map(item => {
    const deviation = item.monthActualRevenue - item.monthPlanRevenue
    const completionRate = item.monthPlanRevenue > 0
      ? (item.monthActualRevenue / item.monthPlanRevenue) * 100
      : 0
    const negativeDeviation = deviation

    return {
      ...item,
      deviation,
      completionRate,
      negativeDeviation
    }
  })
}

const calculateQuarterlyDerivedFields = (data) => {
  return data.map(item => ({
    ...item,
    planReductionAmount: item.quarterOriginalPlan - item.quarterRevisedPlan
  }))
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
  if (filters.value.status) {
    data = data.filter(item => item.status === filters.value.status)
  }
  if (filters.value.correctiveStatus) {
    data = data.filter(item => item.correctiveStatus === filters.value.correctiveStatus)
  }

  return data
})

// 当月偏差表分页数据
const monthlyPaginatedData = computed(() => {
  const start = (monthlyPage.value - 1) * monthlyPageSize.value
  const end = start + monthlyPageSize.value
  return filteredData.value.slice(start, end)
})

const quarterlyFilteredData = computed(() => {
  let data = calculateQuarterlyDerivedFields(quarterlyRawData)

  if (quarterlyFilters.value.projectCode) {
    data = data.filter(item => item.projectCode.includes(quarterlyFilters.value.projectCode))
  }
  if (quarterlyFilters.value.projectName) {
    data = data.filter(item => item.projectName.includes(quarterlyFilters.value.projectName))
  }
  if (quarterlyFilters.value.unit) {
    data = data.filter(item => item.unit === quarterlyFilters.value.unit)
  }
  if (quarterlyFilters.value.isKeyProject) {
    data = data.filter(item => item.isKeyProject === quarterlyFilters.value.isKeyProject)
  }

  return data
})

// 季度偏差表分页数据
const quarterlyPaginatedData = computed(() => {
  const start = (quarterlyPage.value - 1) * quarterlyPageSize.value
  const end = start + quarterlyPageSize.value
  return quarterlyFilteredData.value.slice(start, end)
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusType = (status) => {
  const types = {
    '待建': 'info',
    '在建': 'warning',
    '停工': 'danger',
    '完工': 'success',
    '竣工未送审': '',
    '已送审': 'primary',
    '审定未销项': 'warning',
    '业务销项': 'success',
    '财务销项': 'success'
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
  if (field === 'monthPlanRevenue' || field === 'monthActualRevenue' ||
      field === 'quarterOriginalPlan' || field === 'quarterRevisedPlan') {
    row[field] = parseFloat(editValue.value) || 0
  } else {
    row[field] = editValue.value
  }
  editingCell.value = ''
}

const getSummaries = (param) => {
  const { columns, data } = param
  if (!columns || !data || data.length === 0) {
    return columns ? columns.map(() => '') : []
  }

  // 需要求和的数值字段（其余文本字段显示 '-'）
  const numericProps = [
    'contractAmount', 'carryForwardRevenue', 'annualPlanRevenue',
    'annualAccumulatedRevenue', 'totalAccumulatedRevenue',
    'monthPlanRevenue', 'monthActualRevenue',
    'deviation', 'negativeDeviation'
  ]

  // 需要求平均值的百分比字段
  const avgProps = ['completionRate']

  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }

    const prop = column.prop || column.property
    if (!prop) {
      sums[index] = '-'
      return
    }

    // 百分比字段求平均值
    if (avgProps.includes(prop)) {
      const values = data.map(item => {
        const val = item[prop]
        if (val === undefined || val === null || val === '') return 0
        const num = parseFloat(val)
        return isNaN(num) ? 0 : num
      })
      const total = values.reduce((prev, curr) => prev + curr, 0)
      const avg = data.length > 0 ? total / data.length : 0
      sums[index] = avg.toFixed(2) + '%'
      return
    }

    // 数值字段求和
    if (!numericProps.includes(prop)) {
      sums[index] = '-'
      return
    }

    const values = data.map(item => {
      const val = item[prop]
      if (val === undefined || val === null || val === '') return 0
      const num = parseFloat(val)
      return isNaN(num) ? 0 : num
    })

    const total = values.reduce((prev, curr) => prev + curr, 0)
    sums[index] = total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  })
  return sums
}

const handleSearch = () => {
  // 搜索：filteredData computed 已自动响应 filters/selectedMonth 变化
}

const handleReset = () => {
  filters.value = {
    projectCode: '',
    projectName: '',
    unit: '',
    isKeyProject: '',
    status: '',
    correctiveStatus: ''
  }
  deviationMonth.value = ''
}

const exportExcel = () => {
  if (activeDeviationTab.value === 'monthly') {
    const monthLabel = deviationMonth.value
    const exportData = filteredData.value.map((item, index) => ({
      '序号': index + 1,
      '项目编号': item.projectCode,
      '项目名称': item.projectName,
      '基层单位': item.unit,
      '产运管控等级': item.isKeyProject,
      '项目状态': item.status,
      '合同价(不含税)': Number((item.contractAmount / 10000).toFixed(2)),
      '结转至当年及以后营收': Number((item.carryForwardRevenue / 10000).toFixed(2)),
      '本年计划营收': Number((item.annualPlanRevenue / 10000).toFixed(2)),
      '本年累计营收': Number((item.annualAccumulatedRevenue / 10000).toFixed(2)),
      '开工累计营收': Number((item.totalAccumulatedRevenue / 10000).toFixed(2)),
      [monthLabel + '计划营收']: Number((item.monthPlanRevenue / 10000).toFixed(2)),
      [monthLabel + '完成营收']: Number((item.monthActualRevenue / 10000).toFixed(2)),
      [monthLabel + '营收完成率']: item.completionRate.toFixed(2) + '%',
      [monthLabel + '营收偏差']: Number((item.deviation / 10000).toFixed(2)),
      [monthLabel + '营收偏差原因']: item.deviationReason || '',
      '计划采取措施及节点': item.correctiveMeasures || '',
      '纠偏完成情况': item.correctiveStatus,
      '备注': item.remark || ''
    }))

    const ws = utils.json_to_sheet(exportData)
    ws['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 20 }, { wch: 10 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 24 }, { wch: 14 }, { wch: 16 }]
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, '当月偏差项目表')
    writeFile(wb, `当月偏差项目表_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } else {
    const qData = calculateQuarterlyDerivedFields(quarterlyRawData)
    const exportData = qData.map((item, index) => ({
      '序号': index + 1,
      '项目编号': item.projectCode,
      '项目名称': item.projectName,
      '基层单位': item.unit,
      '产运管控等级': item.isKeyProject,
      '项目状态': item.status,
      '偏差触发类型': item.deviationTriggerType,
      '合同价（不含税）': Number((item.contractAmount / 10000).toFixed(2)),
      '结转至当年及以后营收': Number((item.carryForwardRevenue / 10000).toFixed(2)),
      '本年计划营收': Number((item.annualPlanRevenue / 10000).toFixed(2)),
      '本年累计营收': Number((item.annualAccumulatedRevenue / 10000).toFixed(2)),
      '开工累计营收': Number((item.totalAccumulatedRevenue / 10000).toFixed(2)),
      '本季度原批复计划': Number((item.quarterOriginalPlan / 10000).toFixed(2)),
      '本季度修订后计划': Number((item.quarterRevisedPlan / 10000).toFixed(2)),
      '本年/本季计划下调额': Number((item.planReductionAmount / 10000).toFixed(2)),
      '营收偏差原因': item.deviationReason || '',
      '计划采取措施及节点': item.correctiveMeasures || '',
      '纠偏完成情况': item.correctiveStatus,
      '备注': item.remark || ''
    }))

    const ws = utils.json_to_sheet(exportData)
    ws['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 28 }, { wch: 14 }, { wch: 20 }, { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 24 }, { wch: 14 }, { wch: 14 }]
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, '季度偏差表')
    writeFile(wb, `季度偏差表_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }
}
</script>

<style scoped>
.deviation-row {
  background-color: #FFF2F0;
}

/* 合计行样式 */
:deep(.el-table__footer-wrapper) {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
:deep(.el-table__footer) {
  background-color: #f9fafb !important;
}
:deep(.el-table__footer-wrapper td) {
  background-color: #f9fafb !important;
  font-weight: bold !important;
  color: #374151 !important;
}
:deep(.el-table__footer-wrapper th) {
  background-color: #f9fafb !important;
}
</style>
