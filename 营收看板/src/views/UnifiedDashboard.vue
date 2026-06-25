<template>
  <div class="space-y-4">
    <!-- 统一筛选栏 -->
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in filterTabs"
          :key="item.name"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedFilter === item.name
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="handleFilterChange(item.name)"
        >
          {{ item.name }}
          <span v-if="item.count > 0" class="ml-1 opacity-75">({{ item.count }})</span>
        </button>
      </div>
    </div>

    <!-- 分组一：营收管理看板 -->
    <div>
      <div class="flex items-center gap-2 px-4 pb-3 pt-1">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">营收管理看板</h2>
      </div>
      <div class="space-y-4">
        <!-- ========== 模块一：施工类营收情况 + 模块二：总体营收情况（并排 4:1） ========== -->
        <div class="grid grid-cols-12 gap-4 items-stretch">
        <!-- 模块一：施工类营收情况 (占3/4) -->
        <div class="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <h2 class="text-base font-semibold text-white">施工类营收情况</h2>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <!-- 施工类6个KPI卡片 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              <div
                v-for="card in constructionStatCards"
                :key="card.title"
                :class="[
                  'bg-white rounded-xl p-4 shadow-sm transition-all cursor-pointer border',
                  card.drillable ? 'hover:shadow-lg hover:border-blue-200 border-transparent' : ''
                ]"
                @click="card.drillable && handleDrill()"
              >
                <div class="flex justify-between items-start">
                  <span :class="['text-sm', card.drillable ? 'text-blue-600' : 'text-gray-600']">{{ card.title }}</span>
                  <div class="flex items-center">
                    <div :class="['w-10 h-10 rounded-full flex items-center justify-center', card.bgClass]">
                      <svg :class="['w-5 h-5', card.iconClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="card.icon === 'trending-up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        <path v-else-if="card.icon === 'target'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path v-else-if="card.icon === 'bar-chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        <path v-else-if="card.icon === 'check-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        <path v-else-if="card.icon === 'file-text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <path v-else-if="card.icon === 'calendar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        <path v-else-if="card.icon === 'dollar-sign'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div v-if="card.drillable" class="drill-indicator ml-1 relative group">
                      <svg class="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div :class="['mt-2 text-xl font-bold', card.drillable ? 'text-blue-600' : 'text-gray-800']">{{ card.value }}<span class="text-xs font-normal text-gray-500 ml-1">{{ card.unit }}</span></div>
              </div>
            </div>
            <!-- 施工类三个小模块列表 -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-stretch">
              <div class="bg-gray-50 rounded-xl p-4 flex flex-col">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">施工类当年计划营收</h3>
                <ul class="space-y-1">
                  <li
                    v-for="item in planRevenue"
                    :key="item.name"
                    class="flex justify-between items-center text-sm cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                    @click="handleDetailDrill(item.name)"
                  >
                    <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #1890ff;"></span>{{ item.name }}</span>
                    <div class="flex items-center">
                      <span class="text-gray-600 mr-2">{{ item.value }}</span>
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 flex flex-col">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">施工类当年累计营收</h3>
                <ul class="space-y-1">
                  <li
                    v-for="item in actualRevenue"
                    :key="item.name"
                    class="flex justify-between items-center text-sm cursor-pointer hover:bg-purple-50 p-2 rounded transition-colors"
                    @click="handleDetailDrill(item.name)"
                  >
                    <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #722ed1;"></span>{{ item.name }}</span>
                    <div class="flex items-center">
                      <span class="text-gray-600 mr-2">{{ item.value }}</span>
                      <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 flex flex-col">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">下月计划</h3>
                <ul class="space-y-1">
                  <li
                    v-for="item in nextMonthPlan"
                    :key="item.name"
                    class="flex justify-between items-center text-sm cursor-pointer hover:bg-green-50 p-2 rounded transition-colors"
                    @click="handleDetailDrill(item.name)"
                  >
                    <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #52c41a;"></span>{{ item.name }}</span>
                    <div class="flex items-center">
                      <span class="text-gray-600 mr-2">{{ item.value }}</span>
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== 模块二：总体营收情况 (占1/4) ========== -->
        <div class="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3">
            <h2 class="text-base font-semibold text-white">总体营收情况</h2>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <!-- 总体营收KPI卡片 -->
            <div class="grid grid-cols-1 gap-4 mb-4">
              <div
                v-for="card in overallStatCards"
                :key="card.title"
                :class="[
                  'bg-white rounded-xl p-4 shadow-sm transition-all cursor-pointer border',
                  card.drillable ? 'hover:shadow-lg hover:border-cyan-200 border-transparent' : ''
                ]"
                @click="card.drillable && handleDrill()"
              >
                <div class="flex justify-between items-start">
                  <span :class="['text-sm', card.drillable ? 'text-blue-600' : 'text-gray-600']">{{ card.title }}</span>
                  <div class="flex items-center">
                    <div :class="['w-10 h-10 rounded-full flex items-center justify-center', card.bgClass]">
                      <svg :class="['w-5 h-5', card.iconClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div v-if="card.drillable" class="drill-indicator ml-1 relative group">
                      <svg class="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div :class="['mt-2 flex items-center gap-3', card.drillable ? 'text-blue-600' : 'text-gray-800']">
                  <span class="text-xl font-bold">{{ card.value }}<span class="text-xs font-normal text-gray-500 ml-1">{{ card.unit }}</span></span>
                  <!-- 当年累计营收：小圆环进度条 -->
                  <div v-if="card.title === '当年累计营收'"
                       :title="'指标完成率: ' + overallCompletionRate + '%'"
                       class="relative w-14 h-14 flex-shrink-0 cursor-help">
                    <svg class="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" stroke-width="3"/>
                      <circle cx="18" cy="18" r="15" fill="none"
                              :stroke="overallCompletionRate >= 100 ? '#22c55e' : overallCompletionRate >= 50 ? '#eab308' : '#ef4444'"
                              stroke-width="3"
                              stroke-dasharray="94.25"
                              :stroke-dashoffset="94.25 * (1 - Math.min(overallCompletionRate, 100) / 100)"
                              stroke-linecap="round"/>
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none"
                          :class="overallCompletionRate >= 100 ? 'text-green-600' : overallCompletionRate >= 50 ? 'text-yellow-600' : 'text-red-600'">
                      {{ overallCompletionRate }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 总体营收小模块列表 -->
        <div class="grid grid-cols-1 gap-4 flex-1">
          <div class="bg-gray-50 rounded-xl p-4 flex flex-col">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">当年累计营收</h3>
                <ul class="space-y-1">
                  <li
                    v-for="item in yearTotalRevenue"
                    :key="item.name"
                    class="flex justify-between items-center text-sm cursor-pointer hover:bg-cyan-50 p-2 rounded transition-colors"
                    @click="handleSummaryDrill(item.name)"
                  >
                    <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #13c2c2;"></span>{{ item.name }}</span>
                    <div class="flex items-center">
                      <span class="text-gray-600 mr-2">{{ item.value }}</span>
                      <svg class="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div><!-- 并排容器结束 -->

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <!-- 营收计划上报及时性 + 月度偏差（合并模块） -->
          <div class="bg-white rounded-xl p-4 shadow-sm space-y-4 flex flex-col">
            <!-- 上半部分：营收计划上报及时性 -->
            <div>
              <h3 class="text-base font-semibold text-gray-800 mb-4">营收计划上报及时性</h3>
              <!-- 红橙黄预警一行（仅保留橙色、黄色） -->
              <div class="flex items-center justify-center gap-4 mb-4">
                <div
                  class="flex items-center gap-1.5 cursor-pointer hover:bg-orange-50 px-2.5 py-1 rounded-full transition-colors"
                  @click="handleWarningDrill('orange')"
                >
                  <span class="w-2.5 h-2.5 rounded-full" style="background: #fa8c16;"></span>
                  <span class="text-xs text-gray-600">橙色预警</span>
                  <span class="text-sm font-bold" style="color: #fa8c16;">{{ timelinessSingle.orangeAlert }}</span>
                </div>
                <div
                  class="flex items-center gap-1.5 cursor-pointer hover:bg-yellow-50 px-2.5 py-1 rounded-full transition-colors"
                  @click="handleWarningDrill('yellow')"
                >
                  <span class="w-2.5 h-2.5 rounded-full" style="background: #faad14;"></span>
                  <span class="text-xs text-gray-600">黄色预警</span>
                  <span class="text-sm font-bold" style="color: #faad14;">{{ timelinessSingle.yellowAlert }}</span>
                </div>
              </div>
              <!-- 单圆环 + 已上报/待上报 -->
              <div class="flex items-center justify-center gap-5">
                <!-- 圆环 -->
                <div :title="'完成率：' + timelinessSingle.percentage + '%'" class="relative w-24 h-24 cursor-pointer hover:opacity-90 flex-shrink-0">
                  <svg class="w-24 h-24" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#e5e7eb" stroke-width="10" fill="none" />
                    <circle
                      cx="50" cy="50" r="42"
                      stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"
                      :stroke-dasharray="timelinessSingle.percentage * 2.64 + ' 264'"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-lg font-bold text-gray-800">{{ timelinessSingle.totalShouldReport }}</span>
                    <span class="text-[10px] text-gray-500 leading-tight">应上报</span>
                  </div>
                </div>
                <!-- 圆环外：已上报 / 待上报 -->
                <div class="text-sm space-y-2">
                  <div class="text-gray-700">
                    <span class="text-blue-600 font-medium">&#9679;</span> 已上报
                    <span class="ml-1.5 font-medium text-blue-600">{{ timelinessSingle.submitted }}</span>
                  </div>
                  <div class="text-gray-500">
                    <span class="text-gray-400 font-medium">&#9711;</span> 待上报
                    <span class="ml-1.5 font-medium text-gray-600">{{ timelinessSingle.pending }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 下半部分：X月营收偏差情况 -->
            <div class="pt-4 border-t border-gray-100">
              <!-- 标题栏 + 年月双选择器 -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-semibold text-gray-800 flex items-center">
                  <span class="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                  {{ selectedYear }}年{{ selectedMonth }}月营收偏差情况
                </h3>
                <div class="flex items-center gap-2">
                  <!-- 年份选择器 -->
                  <select
                    v-model="selectedYear"
                    class="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                  </select>
                  <!-- 月份选择器 -->
                  <select
                    v-model="selectedMonth"
                    class="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
              </div>

              <!-- 内容区：基层单位列表（双列网格紧凑布局） -->
              <div>
                <!-- 偏差项目总数汇总 -->
                <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-100 text-xs text-gray-500">
                  <span>偏差项目总数: <b class="text-blue-600">{{ totalDeviationCount }}</b> 个</span>
                  <span>涉及基层单位: <b class="text-gray-700">{{ unitDeviationData.length }}</b> 家</span>
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div
                    v-for="(unit, idx) in unitDeviationData"
                    :key="idx"
                    class="group flex items-center justify-between py-1.5 px-2.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    @click="handleDeviationDrill(unit.name)"
                  >
                    <!-- 左侧：颜色圆点 + 单位名称 -->
                    <div class="flex items-center flex-1 min-w-0">
                      <span class="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" :style="{ backgroundColor: unit.color }"></span>
                      <span class="text-xs text-gray-700 truncate">{{ unit.name }}</span>
                    </div>

                    <!-- 右侧：重点/一般项目标签 + 偏差额 -->
                    <div class="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      <!-- 重点项目 -->
                      <span class="text-[11px] px-1 py-px rounded bg-orange-50 text-orange-600 font-medium whitespace-nowrap">
                        重点{{ unit.keyProjectCount }}
                      </span>
                      <!-- 一般项目 -->
                      <span class="text-[11px] px-1 py-px rounded bg-gray-100 text-gray-500 font-medium whitespace-nowrap">
                        一般{{ unit.generalProjectCount }}
                      </span>
                      <!-- 总偏差额 -->
                      <span
                        class="text-xs font-bold min-w-[70px] text-right whitespace-nowrap"
                        :class="unit.totalAmount >= 0 ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ formatAmount(unit.totalAmount) }}万
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 营收月度统计 -->
          <div class="bg-white rounded-xl p-4 shadow-sm flex flex-col">
            <h3 class="text-sm font-semibold text-gray-800 mb-3">营收月度统计</h3>
            <div ref="revenueChartRef" class="h-80 flex-1"></div>
          </div>

          <!-- 当年累计完成营收情况 -->
          <div class="bg-white rounded-xl p-4 shadow-sm flex flex-col">
        <!-- 标题栏 + Tab切换 -->
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-sm font-semibold text-gray-800">当年累计完成营收情况</h3>
          <div class="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              :class="['px-3 py-1 text-xs rounded-md transition-all', sectorViewMode === 'business' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-500']"
              @click="switchSectorView('business')"
            >业务类型</button>
            <button
              :class="['px-3 py-1 text-xs rounded-md transition-all', sectorViewMode === 'region' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-500']"
              @click="switchSectorView('region')"
            >区域</button>
          </div>
        </div>
            <div class="text-left text-xs text-gray-500 mb-2 flex-shrink-0">
        共 <span class="font-bold text-gray-700">{{ totalProjects }}</span> 个项目，
        累计营收 <span class="font-bold text-blue-600">{{ totalRevenue.toLocaleString() }}</span> 万元
      </div>
            <div
              ref="sectorChartRef"
              class="h-72 flex-1 cursor-pointer"
              @click="handleSectorChartClick"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分组二：供应链管理看板 -->
    <div>
      <div class="flex items-center gap-2 px-4 pb-3 pt-1">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">供应链管理看板</h2>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div class="lg:col-span-2 flex flex-col">
            <SupplyChainTimeliness
              :title="scTimelinessData.title"
              :total-orders="scTimelinessData.totalOrders"
              :signed-orders="scTimelinessData.signedOrders"
              :total-signed="scTimelinessData.totalSigned"
              :yellow-alert="scTimelinessData.yellowAlert"
              :orange-alert="scTimelinessData.orangeAlert"
              :red-alert="scTimelinessData.redAlert"
              :sub-items="scTimelinessData.subItems"
              :sub-circles="scTimelinessData.subCircles"
              :current-unit="selectedFilter"
              @drill-down="handleScDrillDown"
            />
          </div>
          <div class="lg:col-span-1 flex flex-col">
            <SupplyContractChart
              :title="contractChartData.title"
              :sub-title="contractChartData.subTitle"
              :categories="contractChartData.categories"
              :series="contractChartData.series"
              :warning-data="contractChartData.warningData"
              :current-unit="selectedFilter"
              @drill-down="handleScDrillDown"
              @category-change="handleScCategoryChange"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div class="lg:col-span-2 flex flex-col">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <SupplierStatChart
                  :title="supplierStat1Data.title"
                  :sub-title="supplierStat1Data.subTitle"
                  :categories="supplierStat1Data.categories"
                  :series="supplierStat1Data.series"
                  :levels="supplierStat1Data.levels"
                  :current-unit="selectedFilter"
                  @drill-down="handleScSupplierStatDrill"
                />
                <SupplierStatChart
                  :title="supplierStat2Data.title"
                  :sub-title="supplierStat2Data.subTitle"
                  :categories="supplierStat2Data.categories"
                  :series="supplierStat2Data.series"
                  :top-line="supplierStat2Data.topLine"
                  @drill-down="handleScSupplierStatDrill"
                />
              </div>
            </div>
          <div class="lg:col-span-1 flex flex-col">
            <MaterialProcurementChart
              :title="procurementData.title"
              :summary="procurementData.summary"
              :groups="procurementData.groups"
              :rent-summary="procurementData.rentSummary"
              :rent-groups="procurementData.rentGroups"
              :current-unit="selectedFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 分组三：生产看板 -->
    <div>
      <div class="flex items-center justify-between px-4 pb-3 pt-1">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">生产看板</h2>
        </div>
        <div class="flex items-center gap-3">
          <!-- 年份选择器 -->
          <div class="flex items-center space-x-1">
            <span class="text-xs text-gray-500">年份:</span>
            <select v-model="productionYear" class="border rounded px-1.5 py-0.5 text-xs">
              <option value="">全部</option>
              <option value="2026">2026年</option>
              <option value="2025">2025年</option>
            </select>
          </div>
          <!-- 仅看产运重点项目 -->
          <div class="flex items-center space-x-1 px-2 py-0.5 rounded border cursor-pointer hover:bg-gray-50 select-none"
               :class="showKeyProjectsOnly ? 'bg-blue-50 border-blue-300' : 'border-gray-200'"
               @click="showKeyProjectsOnly = !showKeyProjectsOnly">
            <input type="checkbox" :checked="showKeyProjectsOnly" class="w-3 h-3 rounded cursor-pointer" @click.stop />
            <span class="text-xs whitespace-nowrap" :class="showKeyProjectsOnly ? 'text-blue-700 font-medium' : 'text-gray-600'">
              仅看产运重点项目
            </span>
          </div>
          <!-- 项目总数 -->
          <div class="text-right cursor-pointer" @click="handleProjectTotalClick">
            <div class="text-lg font-bold text-blue-600 hover:text-yellow-600 transition-colors">{{ totalProjectCount }}</div>
            <div class="text-xs text-gray-500">项目总数</div>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-12 gap-3 items-stretch">
          <div class="col-span-12 grid grid-cols-5 gap-3">
            <ProjectStatCard
              v-for="stat in displayProjectStats" 
              :key="stat.title"
              :title="stat.title"
              :value="stat.value"
              :unit="stat.unit"
              :drillable="true"
              :link="'https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/prod-project/index'"
            />
          </div>
          
          <div class="col-span-4 cursor-pointer" @click="handleManagementTimelinessClick">
            <ManagementTimeliness
              :title="displayManagementTimeliness.title"
              :registration-alerts="displayManagementTimeliness.registrationAlerts"
              :planning-alerts="displayManagementTimeliness.planningAlerts"
              :sub-items="displayManagementTimeliness.subItems"
            />
          </div>
          
          <div class="col-span-4 cursor-pointer" @click="handleRiskTimelinessClick">
            <RiskTimelinessDisplay :timeliness-data="displayRiskAlertTimeliness" :risk-by-level="displayRiskByLevel" />
          </div>
          
          <div class="col-span-4 cursor-pointer" @click="handleProductionRiskClick">
            <ProductionRiskSituation
              :risk-data="displayRiskByLevel"
              :alerts="windRiskAlert"
            />
          </div>
          
          <div class="col-span-4 cursor-pointer" @click="handleProductionProgressClick">
            <ProductionProgress
              :key-project-mode="showKeyProjectsOnly"
              :milestone-title="productionProgress.milestone.title"
              :milestone-total="productionProgress.milestone.total"
              :completed-count="productionProgress.completed.count"
              :completed-total="productionProgress.completed.total"
              :alerts="productionProgress.alerts"
              :key-project-count="displayKeyProjectProgress.keyProjectCount"
              :unreported-count="displayKeyProjectProgress.unreportedCount"
              :key-project-milestone-title="displayKeyProjectProgress.milestone.title"
              :key-project-milestone-total="displayKeyProjectProgress.milestone.total"
              :key-project-completed-count="displayKeyProjectProgress.completed.count"
              :key-project-completed-total="displayKeyProjectProgress.completed.total"
              :key-project-alerts="displayKeyProjectProgress.alerts"
            />
          </div>
          
          <div class="col-span-4 flex flex-col">
            <CertificateProgress :certificate-data="certificateData" />
          </div>

          <div class="col-span-4 cursor-pointer flex flex-col" @click="handleInspectionClick">
            <InspectionStatus 
              :total-count="inspectionData.totalCount"
              :completed-count="inspectionData.completedCount"
              :pending-count="inspectionData.pendingCount"
              :red-alerts="inspectionData.redAlerts"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
// 营收看板数据
import { departmentData, totalProjectCount } from '../data/mockData.js'
// 供应链子组件
import SupplyChainTimeliness from '../components/dashboard/SupplyChainTimeliness.vue'
import SupplyContractChart from '../components/dashboard/SupplyContractChart.vue'
import SupplierStatChart from '../components/dashboard/SupplierStatChart.vue'
import MaterialProcurementChart from '../components/dashboard/MaterialProcurementChart.vue'
import {
  supplyChainTimelinessData,
  supplyContractChartData,
  supplierStatChart1Data,
  supplierStatChart2Data,
  materialProcurementData
} from '../data/mockData.js'
// 生产看板子组件
import ProjectStatCard from '../components/dashboard/ProjectStatCard.vue'
import ManagementTimeliness from '../components/dashboard/ManagementTimeliness.vue'
import RiskTimelinessDisplay from '../components/dashboard/RiskTimelinessDisplay.vue'
import ProductionRiskSituation from '../components/dashboard/ProductionRiskSituation.vue'
import ProductionProgress from '../components/dashboard/ProductionProgress.vue'
import CertificateProgress from '../components/dashboard/CertificateProgress.vue'
import InspectionStatus from '../components/dashboard/InspectionStatus.vue'
import {
  projectStats,
  categoryTabs,
  managementTimelinessData,
  riskAlertTimeliness,
  riskByLevel,
  windRiskAlert,
  productionProgress,
  keyProjectProgress,
  certificateData,
  inspectionData,
  completedByYear,
  keyProjectOnlyStats,
  keyProjectOnlyManagementTimeliness,
  keyProjectOnlyRiskAlertTimeliness,
  keyProjectOnlyRiskByLevel,
  keyProjectOnlyKeyProjectProgress
} from '../data/mockData.js'

const emit = defineEmits(['navigate', 'drill-down', 'menu-change'])

// 统一状态
const selectedFilter = ref('全部')
const filterTabs = ref([
  { name: '全部', count: 172 },
  { name: '管网事业部', count: 24 },
  { name: '生态事业部', count: 18 },
  { name: '区域事业部', count: 22 },
  { name: '市政事业部', count: 16 },
  { name: '环境建设', count: 15 },
  { name: '管道工程', count: 19 },
  { name: '管道分公司', count: 21 },
  { name: '运营养护', count: 17 },
  { name: '二次养护', count: 20 }
])

// ============ 营收看板的全部 script 逻辑 ============
const statCards = ref([
  { title: '当年计划营收', value: '122,180', unit: '万元', icon: 'trending-up', bgClass: 'bg-blue-50', iconClass: 'text-blue-500', drillable: true },
  { title: '当月完成营收', value: '8,754', unit: '万元', icon: 'target', bgClass: 'bg-green-50', iconClass: 'text-green-500', drillable: true },
  { title: '当年累计营收', value: '58,420', unit: '万元', icon: 'bar-chart', bgClass: 'bg-purple-50', iconClass: 'text-purple-500', drillable: true },
  { title: '当年预计完成营收', value: '98,600', unit: '万元', icon: 'check-circle', bgClass: 'bg-cyan-50', iconClass: 'text-cyan-500', drillable: true },
  { title: '截止当月剩余合同存量', value: '45,230', unit: '万元', icon: 'file-text', bgClass: 'bg-orange-50', iconClass: 'text-orange-500', drillable: true },
  { title: '下月计划', value: '9,800', unit: '万元', icon: 'calendar', bgClass: 'bg-pink-50', iconClass: 'text-pink-500', drillable: true },
  { title: '当年累计营收', value: '60,000', unit: '万元', icon: 'dollar-sign', bgClass: 'bg-gray-50', iconClass: 'text-gray-500', drillable: true }
])

// 施工类营收情况模块卡片（前6个）
const constructionStatCards = computed(() => statCards.value.slice(0, 6))
// 总体营收情况模块卡片（最后1个）
const overallStatCards = computed(() => statCards.value.slice(6))

const handleFilterChange = (name) => {
  selectedFilter.value = name
  sessionStorage.setItem('revenueFilter', name)
}

const handleDrill = () => {
  emit('navigate', { 
    view: 'revenue', 
    report: 'revenue-summary', 
    filter: selectedFilter.value 
  })
}

const handleDetailDrill = (statisticType) => {
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-detail',
    filter: {
      unit: selectedFilter.value,
      statisticType: statisticType
    }
  })
}

const handleSummaryDrill = (tabType) => {
  const tabMap = {
    '施工类': 'construction',
    '产品类': 'product',
    '其他类': 'other'
  }
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-summary',
    filter: {
      unit: selectedFilter.value,
      tab: tabMap[tabType] || 'construction'
    }
  })
}

const handleDeviationDrill = (unit) => {
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-deviation',
    filter: { unit: unit }
  })
}

const handleTimelinessDrill = (type) => {
  if (type === 'pending') {
    emit('navigate', {
      view: 'image-view',
      report: '',
      filter: {}
    })
  } else {
    emit('navigate', {
      view: 'revenue',
      report: 'revenue-detail',
      filter: { hasPlanRevenue: true }
    })
  }
}

const handleWarningDrill = (level) => {
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-detail',
    filter: { warningLevel: level }
  })
}

const viewMode = ref('business')

// 累计完成营收情况图表 Tab状态
const sectorViewMode = ref('business')  // 'business' | 'region'

// 区域维度数据（从业务类型图表tooltip中的区域分布提取）
const regionData = ref([
  { name: '上海', projectCount: 25, revenue: 45000 },
  { name: '长三角总部', projectCount: 24, revenue: 38000 },
  { name: '中原总部', projectCount: 16, revenue: 22000 },
  { name: '大湾区总部', projectCount: 18, revenue: 28000 },
  { name: '境外区域', projectCount: 3, revenue: 8500 },
  { name: '其他城市区域', projectCount: 10, revenue: 7000 }
])

// 切换累计营收图表视图
const switchSectorView = (mode) => {
  sectorViewMode.value = mode
  initSectorChart()
}

const sectorData = ref([
  { name: '投资', projectCount: 5, revenue: 25000 },
  { name: '房产', projectCount: 3, revenue: 18000 },
  { name: '产品销售', projectCount: 12, revenue: 8500 },
  { name: '总承包', projectCount: 18, revenue: 45000 },
  { name: '数字', projectCount: 8, revenue: 12000 },
  { name: '设计', projectCount: 6, revenue: 6000 },
  { name: '管线', projectCount: 20, revenue: 38000 },
  { name: '城市运营', projectCount: 4, revenue: 15000 }
])

const businessData = ref([
  { name: '水务', projectCount: 15, revenue: 32000 },
  { name: '水环境治理', projectCount: 12, revenue: 28000 },
  { name: '水利', projectCount: 8, revenue: 18000 },
  { name: '固废处理与处置', projectCount: 5, revenue: 12000 },
  { name: '土壤修复', projectCount: 3, revenue: 8000 },
  { name: '城市更新', projectCount: 6, revenue: 15000 },
  { name: '市政路桥房建', projectCount: 10, revenue: 22000 },
  { name: '其他', projectCount: 4, revenue: 8500 }
])

const totalProjects = computed(() => {
  return businessData.value.reduce((sum, item) => sum + item.projectCount, 0)
})

const totalRevenue = computed(() => {
  return businessData.value.reduce((sum, item) => sum + item.revenue, 0)
})

const handleSectorDrill = (name) => {
  const filterKey = viewMode.value === 'sector' ? 'sector' : 'businessType'
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-detail',
    filter: { [filterKey]: name }
  })
}

const handleSectorChartClick = (params) => {
  if (params && params.name) {
    handleSectorDrill(params.name)
  }
}

const handleTimelinessChartClick = () => {
  emit('navigate', {
    view: 'revenue',
    report: 'revenue-detail',
    filter: { statusNotIn: ['业务销项', '财务销项'] }
  })
}

const getCurrentDeviationMonth = () => {
  const now = new Date()
  const day = now.getDate()
  const currentMonth = now.getMonth() + 1

  if (day < 5) {
    return currentMonth === 1 ? 11 : currentMonth - 2
  }
  return currentMonth === 1 ? 12 : currentMonth - 1
}

const currentDeviationMonth = ref(getCurrentDeviationMonth())

// 月度偏差 - 年月双选择器
const yearOptions = ref([
  new Date().getFullYear() - 2,
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
  new Date().getFullYear() + 1,
  new Date().getFullYear() + 2
])

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(currentDeviationMonth.value)
const monthOptions = ref([
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' }
])

// 多基层单位偏差数据（与顶部筛选栏一致，共9家）
const allUnitDeviationData = [
  { name: '管网事业部', color: '#4ade80', deviationCount: 7, keyProjectCount: 6, generalProjectCount: 1, totalAmount: -1777, keyProjectAmount: -1500, generalProjectAmount: -277 },
  { name: '生态事业部', color: '#3b82f6', deviationCount: 5, keyProjectCount: 4, generalProjectCount: 1, totalAmount: -1200, keyProjectAmount: -1000, generalProjectAmount: -200 },
  { name: '区域事业部', color: '#38bdf8', deviationCount: 9, keyProjectCount: 7, generalProjectCount: 2, totalAmount: -2100, keyProjectAmount: -1800, generalProjectAmount: -300 },
  { name: '市政事业部', color: '#60a5fa', deviationCount: 4, keyProjectCount: 3, generalProjectCount: 1, totalAmount: -900, keyProjectAmount: -750, generalProjectAmount: -150 },
  { name: '环境建设', color: '#a78bfa', deviationCount: 6, keyProjectCount: 4, generalProjectCount: 2, totalAmount: -1350, keyProjectAmount: -1100, generalProjectAmount: -250 },
  { name: '管道工程', color: '#f59e0b', deviationCount: 8, keyProjectCount: 6, generalProjectCount: 2, totalAmount: -1900, keyProjectAmount: -1600, generalProjectAmount: -300 },
  { name: '管道分公司', color: '#ef4444', deviationCount: 5, keyProjectCount: 3, generalProjectCount: 2, totalAmount: -1100, keyProjectAmount: -850, generalProjectAmount: -250 },
  { name: '运营养护', color: '#10b981', deviationCount: 6, keyProjectCount: 5, generalProjectCount: 1, totalAmount: -1500, keyProjectAmount: -1300, generalProjectAmount: -200 },
  { name: '二次养护', color: '#8b5cf6', deviationCount: 7, keyProjectCount: 5, generalProjectCount: 2, totalAmount: -1650, keyProjectAmount: -1400, generalProjectAmount: -250 }
]

// 根据筛选栏过滤偏差数据
const unitDeviationData = computed(() => {
  if (selectedFilter.value === '全部') return allUnitDeviationData
  return allUnitDeviationData.filter(item => item.name === selectedFilter.value)
})

// 计算偏差项目总数（用于环形图）
const totalDeviationCount = computed(() => {
  return unitDeviationData.value.reduce((sum, item) => sum + item.deviationCount, 0)
})

// 格式化金额（添加千分位逗号）
const formatAmount = (amount) => {
  const absAmount = Math.abs(amount)
  return absAmount.toLocaleString('zh-CN')
}

// 计算环形图各段偏移量
const getCircleOffset = (index) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    const ratio = unitDeviationData.value[i].deviationCount / totalDeviationCount.value
    offset += ratio * 251.2
  }
  return offset
}

const planRevenue = ref([
  { name: '当年新接项目', value: '6,000万元' },
  { name: '年初结转实施项目', value: '6,000万元' },
  { name: '年初结转待结项目', value: '6,000万元' }
])

const actualRevenue = ref([
  { name: '当年新接项目', value: '6,000万元' },
  { name: '年初结转实施项目', value: '6,000万元' },
  { name: '年初结转待结项目', value: '6,000万元' }
])

const nextMonthPlan = ref([
  { name: '当年新接项目', value: '6,000万元' },
  { name: '年初结转实施项目', value: '6,000万元' },
  { name: '年初结转待结项目', value: '6,000万元' }
])

const yearTotalRevenue = ref([
  { name: '施工类', value: '3,000万元', target: 4000, actual: 3000 },
  { name: '产品类', value: '2,000万元', target: 2500, actual: 2000 },
  { name: '其他类', value: '1,000万元', target: 1500, actual: 1000 }
])

// 总体指标完成率（基于yearTotalRevenue的target和actual计算）
const overallCompletionRate = computed(() => {
  const totalActual = yearTotalRevenue.value.reduce((s, i) => s + (i.actual || 0), 0)
  const totalTarget = yearTotalRevenue.value.reduce((s, i) => s + (i.target || 0), 0)
  if (totalTarget <= 0) return '0.0'
  return ((totalActual / totalTarget) * 100).toFixed(1)
})

// 营收计划上报及时性 - 单项数据
const timelinessSingle = ref({
  redAlert: 3,
  orangeAlert: 12,
  yellowAlert: 22,
  totalShouldReport: 2160,
  submitted: 457,
  pending: 32,
  percentage: 85
})

const timelinessChartRef = ref(null)
const revenueChartRef = ref(null)
const sectorChartRef = ref(null)

const initCharts = () => {
  if (revenueChartRef.value) {
    const revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const name = params[0].name
          let result = `<div style="font-weight:bold;margin-bottom:8px;">${name}</div>`
          let total = 0
          params.forEach(param => {
            if (param.seriesName !== '当月计划完成率') {
              total += param.value || 0
              result += `<div>${param.marker}${param.seriesName}: ${param.value}万元</div>`
            }
          })
          result += `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #eee;font-weight:bold;">合计: ${total.toLocaleString()}万元</div>`
          // 添加完成率
          const rateParam = params.find(p => p.seriesName === '当月计划完成率')
          if (rateParam) {
            result += `<div style="color:#fa8c16;">${rateParam.marker}${rateParam.seriesName}: ${rateParam.value}%</div>`
          }
          return result
        }
      },
      legend: { data: ['年初结转实施项目', '年初结转待结项目', '当年新签项目', '当月计划完成率'], bottom: 2, itemWidth: 14, itemHeight: 10, textStyle: { fontSize: 11 }, icon: 'roundRect' },
      grid: { left: '8%', right: '12%', bottom: '22%', top: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
        axisLabel: { interval: 0, rotate: 30, fontSize: 11, margin: 12 }
      },
      yAxis: [
        { type: 'value', name: '万元', nameTextStyle: { fontSize: 12, padding: [0, 0, 0, 8] } },
        { type: 'value', name: '%', min: 0, max: 100, position: 'right', nameTextStyle: { fontSize: 12, padding: [0, 8, 0, 0] } }
      ],
      series: [
        { name: '年初结转实施项目', type: 'bar', data: [2500, 3000, 3500, 4000, 4200, 4500], itemStyle: { color: '#1890ff' } },
        { name: '年初结转待结项目', type: 'bar', data: [2000, 2000, 2500, 3000, 3200, 3400], itemStyle: { color: '#722ed1' } },
        { name: '当年新签项目', type: 'bar', data: [1500, 2000, 2500, 3000, 3200, 3400], itemStyle: { color: '#13c2c2' } },
        { name: '当月计划完成率', type: 'line', yAxisIndex: 1, data: [88, 95, 90, 96, 93, 98], itemStyle: { color: '#fa8c16' }, symbol: 'circle', symbolSize: 6 }
      ]
    })

    revenueChart.off('click')
    revenueChart.on('click', (params) => {
      if (params && params.name) {
        const [year, month] = params.name.split('-')
        emit('navigate', {
          view: 'revenue',
          report: 'revenue-detail',
          filter: { detailYear: year, detailMonth: parseInt(month) }
        })
      }
    })
  }

  initSectorChart()

  window.addEventListener('resize', handleResize)
}

const initSectorChart = () => {
  if (sectorChartRef.value) {
    const chart = echarts.init(sectorChartRef.value)
    // 根据Tab选择数据源：业务类型 or 区域
    const data = sectorViewMode.value === 'region' ? regionData.value : businessData.value

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
        formatter: (params) => {
          const name = params[0].name
          let result = `<div style="font-weight:bold;margin-bottom:6px;">${name}</div>`
          params.forEach(param => {
            result += `<div>${param.marker}${param.seriesName}: ${param.value}`
            if (param.seriesName === '累计营收') result += '万元'
            else if (param.seriesName === '项目数量') result += '个'
            result += '</div>'
          })
          return result
        }
      },
      legend: { data: ['累计营收', '项目数量'], bottom: 2, itemWidth: 14, itemHeight: 10, textStyle: { fontSize: 11 } },
      grid: { left: '10%', right: '10%', bottom: '24%', top: '14%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: {
          interval: 0,
          rotate: 35,
          fontSize: 10,
          margin: 10
        }
      },
      yAxis: [
        { type: 'value', name: '项目数量', position: 'left' },
        { type: 'value', name: '累计营收(万元)', position: 'right' }
      ],
      series: [
        {
          name: '累计营收',
          type: 'line',
          yAxisIndex: 1,
          data: data.map(item => item.revenue),
          smooth: false,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 2.5,
            color: '#1890ff'
          },
          itemStyle: {
            color: '#1890ff',
            borderColor: '#fff',
            borderWidth: 2
          }
        },
        { name: '项目数量', type: 'bar', yAxisIndex: 0, data: data.map(item => item.projectCount), itemStyle: { color: '#722ed1' }, barMaxWidth: 30 }
      ]
    })

    chart.off('click')
    chart.on('click', (params) => {
      if (params.name) {
        handleSectorDrill(params.name)
      }
    })
  }
}

const handleResize = () => {
  const charts = document.querySelectorAll('[_echarts_instance_]')
  charts.forEach(chart => {
    const instance = echarts.getInstanceByDom(chart)
    instance?.resize()
  })
}

// ============ 供应链看板的全部 script 逻辑 ============
const scTimelinessData = computed(() => {
  if (selectedFilter.value === '全部') {
    return supplyChainTimelinessData
  }
  return {
    ...supplyChainTimelinessData,
    totalOrders: Math.floor(supplyChainTimelinessData.totalOrders / 9),
    signedOrders: Math.floor(supplyChainTimelinessData.signedOrders / 9),
    totalSigned: Math.floor(supplyChainTimelinessData.totalSigned / 9),
    yellowAlert: Math.floor(supplyChainTimelinessData.yellowAlert / 3),
    orangeAlert: Math.floor(supplyChainTimelinessData.orangeAlert / 3),
    redAlert: Math.floor(supplyChainTimelinessData.redAlert / 3),
    subItems: supplyChainTimelinessData.subItems.map(item => ({
      ...item,
      yellow: Math.floor(item.yellow / 3),
      orange: Math.floor(item.orange / 3) || 0,
      red: Math.floor(item.red / 3) || 0
    })),
    subCircles: supplyChainTimelinessData.subCircles.map(circle => ({
      ...circle,
      signed: Math.floor(circle.signed / 9),
      pending: Math.floor(circle.pending / 9),
      total: Math.floor(circle.total / 9)
    }))
  }
})

const contractChartData = supplyContractChartData
const supplierStat1Data = supplierStatChart1Data
const supplierStat2Data = supplierStatChart2Data
const procurementData = materialProcurementData

const handleScDrillDown = (filter) => {
  emit('navigate', { 
    view: 'supply-chain', 
    report: 'supplier-contract', 
    filter: { ...filter, unit: selectedFilter.value } 
  })
}

const handleScCategoryChange = (category) => {
  console.log('Category changed to:', category)
}

const handleScSupplierStatDrill = (drillData) => {
  if (drillData.type === 'a-level') {
    const filter = { supplierLevel: 'A', unit: selectedFilter.value }
    if (drillData.contractCategory && drillData.contractCategory !== '全部') {
      filter.category = drillData.contractCategory
    }
    emit('navigate', { 
      view: 'supply-chain', 
      report: 'supplier-detail', 
      filter 
    })
  } else if (drillData.type === 'contract-count') {
    emit('navigate', { 
      view: 'supply-chain', 
      report: 'supplier-contract', 
      filter: { 
        contractStatus: '正常履约', 
        category: drillData.category,
        unit: selectedFilter.value 
      } 
    })
  } else if (drillData.type === 'top10-supplier') {
    const filter = { supplierName: drillData.supplierName, unit: selectedFilter.value }
    if (drillData.contractCategory && drillData.contractCategory !== '全部') {
      filter.category = drillData.contractCategory
    }
    emit('navigate', { 
      view: 'supply-chain', 
      report: 'supplier-detail', 
      filter 
    })
  }
}

// ============ 生产看板的全部 script 逻辑 ============
const activeCategory = ref(categoryTabs[0].name)

// 年份筛选（仅对完工、当年竣工生效）
const productionYear = ref('')

// 仅看产运重点项目切换
const showKeyProjectsOnly = ref(false)

// 项目统计数据：年份筛选仅影响完工(索引3)和当年竣工(索引4)
const displayProjectStats = computed(() => {
  const baseStats = showKeyProjectsOnly.value ? keyProjectOnlyStats : projectStats
  const yearData = productionYear.value ? completedByYear[productionYear.value] : completedByYear.default
  return baseStats.map((item, idx) => {
    if (idx === 3) return { ...item, value: yearData.completed }
    if (idx === 4) return { ...item, value: yearData.currentYear }
    return item
  })
})

// 管理提示及时性（仅受重点项目影响）
const displayManagementTimeliness = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyManagementTimeliness : managementTimelinessData
)

// 风险预警及时性（仅受重点项目影响）
const displayRiskAlertTimeliness = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyRiskAlertTimeliness : riskAlertTimeliness
)

// 风险等级分布（仅受重点项目影响）
const displayRiskByLevel = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyRiskByLevel : riskByLevel
)

// 重点项目生产进度（仅受重点项目影响）
const displayKeyProjectProgress = computed(() =>
  showKeyProjectsOnly.value ? keyProjectOnlyKeyProjectProgress : keyProjectProgress
)

const handleCategoryChange = (name) => {
  activeCategory.value = name
}

const handleProjectTotalClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/prod-project/index', '_blank')
}

const handleManagementTimelinessClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/schedule/milestone', '_blank')
}

const handleRiskTimelinessClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/risk/list', '_blank')
}

const handleProductionRiskClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/risk/list', '_blank')
}

const handleProductionProgressClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/schedule/milestone', '_blank')
}

const handleInspectionClick = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/project/biz/ent/production/quality/inspection/list', '_blank')
}

onMounted(() => {
  setTimeout(() => {
    initCharts()
  }, 100)
})
</script>
