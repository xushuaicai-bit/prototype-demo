<template>
  <div class="space-y-4">
    <div class="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl p-4 shadow-sm text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button class="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors">
            返回上一级
          </button>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm">
            <span>公司：</span>
            <select class="bg-white/20 rounded px-2 py-1 text-sm text-white outline-none">
              <option>请选择组织</option>
            </select>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span>区域：</span>
            <div class="flex bg-white/20 rounded overflow-hidden">
              <button class="px-3 py-1 text-sm bg-white/30">全部</button>
              <button class="px-3 py-1 text-sm hover:bg-white/20">市区</button>
            </div>
          </div>
          <button class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">总包岗位统计</h3>
        <div class="grid grid-cols-4 gap-3 mb-3">
          <div class="text-center">
            <div class="text-xl font-bold text-blue-500">237人</div>
            <div class="text-xs text-gray-500 mt-1">项目经理</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-blue-500">439人</div>
            <div class="text-xs text-gray-500 mt-1">生产副经理</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-orange-500">49人</div>
            <div class="text-xs text-gray-500 mt-1">安全总监/安全总监</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-blue-500">169人</div>
            <div class="text-xs text-gray-500 mt-1">技术负</div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-3 mb-3">
          <div class="text-center">
            <div class="text-lg font-bold text-purple-500">246人</div>
            <div class="text-xs text-gray-500 mt-1">施工员</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-green-500">610人</div>
            <div class="text-xs text-gray-500 mt-1">安全员</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-cyan-500">16人</div>
            <div class="text-xs text-gray-500 mt-1">质量员</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-pink-500">169人</div>
            <div class="text-xs text-gray-500 mt-1">劳资员</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 pt-3 border-t">
          <div class="text-center">
            <div class="text-lg font-bold text-blue-500">5944人</div>
            <div class="text-xs text-gray-500 mt-1">工人</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-orange-500">9人</div>
            <div class="text-xs text-gray-500 mt-1">9类人员</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-red-500">116人</div>
            <div class="text-xs text-gray-500 mt-1">特种作业人员</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">分包岗位统计</h3>
        <div class="mb-3">
          <div class="text-xs text-gray-500 mb-2">专业分包</div>
          <div class="grid grid-cols-5 gap-2">
            <div class="text-center">
              <div class="text-base font-bold text-blue-500">232人</div>
              <div class="text-xs text-gray-500">项目经理</div>
            </div>
            <div class="text-center">
              <div class="text-base font-bold text-green-500">256人</div>
              <div class="text-xs text-gray-500">安全员</div>
            </div>
            <div class="text-center">
              <div class="text-base font-bold text-purple-500">32人</div>
              <div class="text-xs text-gray-500">技术员</div>
            </div>
            <div class="text-center">
              <div class="text-base font-bold text-cyan-500">14人</div>
              <div class="text-xs text-gray-500">质量员</div>
            </div>
            <div class="text-center">
              <div class="text-base font-bold text-pink-500">14人</div>
              <div class="text-xs text-gray-500">劳资员</div>
            </div>
          </div>
        </div>
        <div class="pt-3 border-t">
          <div class="text-xs text-gray-500 mb-2">劳务分包</div>
          <div class="grid grid-cols-2 gap-3">
            <div class="text-center">
              <div class="text-base font-bold text-orange-500">327人</div>
              <div class="text-xs text-gray-500">现场负责人</div>
            </div>
            <div class="text-center">
              <div class="text-base font-bold text-yellow-500">315人</div>
              <div class="text-xs text-gray-500">安全员</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">实名制管理异常预警项目数</h3>
        <div class="grid grid-cols-5 gap-2 mb-3">
          <div class="text-center p-2 bg-orange-50 rounded-lg">
            <div class="text-lg font-bold text-orange-500">110个</div>
            <div class="text-xs text-gray-500 mt-1">项目团队人员未到岗</div>
          </div>
          <div class="text-center p-2 bg-orange-50 rounded-lg">
            <div class="text-lg font-bold text-orange-500">1个</div>
            <div class="text-xs text-gray-500 mt-1">用工合同未上传</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <div class="text-lg font-bold text-gray-400">0个</div>
            <div class="text-xs text-gray-500 mt-1">证件已过期</div>
          </div>
          <div class="text-center p-2 bg-orange-50 rounded-lg">
            <div class="text-lg font-bold text-orange-500">51个</div>
            <div class="text-xs text-gray-500 mt-1">即将超龄</div>
          </div>
          <div class="text-center p-2 bg-red-50 rounded-lg">
            <div class="text-lg font-bold text-red-500">59个</div>
            <div class="text-xs text-gray-500 mt-1">黑名单预警</div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-2 pt-3 border-t">
          <div class="text-center p-2 bg-red-50 rounded-lg">
            <div class="text-lg font-bold text-red-500">132个</div>
            <div class="text-xs text-gray-500 mt-1">总包安全员未足额</div>
          </div>
          <div class="text-center p-2 bg-red-50 rounded-lg">
            <div class="text-lg font-bold text-red-500">220个</div>
            <div class="text-xs text-gray-500 mt-1">分包安全员未足额</div>
          </div>
          <div class="text-center p-2 bg-red-50 rounded-lg">
            <div class="text-lg font-bold text-red-500">130个</div>
            <div class="text-xs text-gray-500 mt-1">总包安全员未到岗</div>
          </div>
          <div class="text-center p-2 bg-red-50 rounded-lg">
            <div class="text-lg font-bold text-red-500">139个</div>
            <div class="text-xs text-gray-500 mt-1">分包安全员未到岗</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">特殊工种分析</h3>
          <button class="text-xs text-blue-500 hover:text-blue-600">加</button>
        </div>
        <div class="flex items-center gap-4">
          <div ref="specialWorkChartRef" class="w-40 h-40 flex-shrink-0"></div>
          <div class="flex-1 space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span class="text-gray-600">电焊工</span>
              </div>
              <div class="text-gray-500">712人 <span class="text-gray-400">33.6%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-green-400"></span>
                <span class="text-gray-600">起重信号工</span>
              </div>
              <div class="text-gray-500">279人 <span class="text-gray-400">13.2%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-400"></span>
                <span class="text-gray-600">起重机司机</span>
              </div>
              <div class="text-gray-500">260人 <span class="text-gray-400">12.3%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span class="text-gray-600">电工</span>
              </div>
              <div class="text-gray-500">202人 <span class="text-gray-400">9.5%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-purple-400"></span>
                <span class="text-gray-600">架子工</span>
              </div>
              <div class="text-gray-500">191人 <span class="text-gray-400">9.0%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-pink-400"></span>
                <span class="text-gray-600">油漆工</span>
              </div>
              <div class="text-gray-500">180人 <span class="text-gray-400">8.5%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">分包统计</h3>
        <div class="flex items-center gap-4">
          <div ref="subcontractChartRef" class="w-36 h-36 flex-shrink-0"></div>
          <div class="flex-1 space-y-3 text-sm">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="w-3 h-3 rounded-full bg-blue-400"></span>
                <span class="text-gray-600">专业分包</span>
              </div>
              <div class="text-lg font-bold text-gray-800">481家 <span class="text-sm text-gray-400">52.7%</span></div>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="w-3 h-3 rounded-full bg-green-400"></span>
                <span class="text-gray-600">劳务分包</span>
              </div>
              <div class="text-lg font-bold text-gray-800">431家 <span class="text-sm text-gray-400">47.3%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">总包关键岗位到岗率-项目月排行</h3>
          <div class="flex items-center gap-2">
            <select class="border rounded px-2 py-0.5 text-xs text-gray-600 outline-none">
              <option>2026/05</option>
              <option>2026/06</option>
            </select>
            <div class="flex border rounded overflow-hidden">
              <button class="px-2 py-0.5 text-xs bg-black text-white">黑榜</button>
              <button class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50">红榜</button>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b bg-gray-50">
                <th class="py-2 px-2 text-left font-medium text-gray-600">排名</th>
                <th class="py-2 px-2 text-left font-medium text-gray-600">项目名称</th>
                <th class="py-2 px-2 text-left font-medium text-gray-600">子公司</th>
                <th class="py-2 px-2 text-left font-medium text-gray-600">分公司</th>
                <th class="py-2 px-2 text-center font-medium text-gray-600">关键岗位人数</th>
                <th class="py-2 px-2 text-center font-medium text-gray-600">打考勤人数</th>
                <th class="py-2 px-2 text-center font-medium text-gray-600">打考勤率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in attendanceRankList" :key="index" class="border-b hover:bg-gray-50">
                <td class="py-2 px-2">
                  <span v-if="index < 3" class="w-5 h-5 rounded-full bg-red-500 text-white text-xs inline-flex items-center justify-center">{{ index + 1 }}</span>
                  <span v-else class="text-gray-500">{{ index + 1 }}</span>
                </td>
                <td class="py-2 px-2 text-gray-700 truncate max-w-24" :title="item.name">{{ item.name }}</td>
                <td class="py-2 px-2 text-gray-500">{{ item.subsidiary }}</td>
                <td class="py-2 px-2 text-gray-500">{{ item.branch }}</td>
                <td class="py-2 px-2 text-center text-gray-700">{{ item.total }}</td>
                <td class="py-2 px-2 text-center text-gray-700">{{ item.checked }}</td>
                <td class="py-2 px-2 text-center text-red-500">{{ item.rate }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">劳动力分析</h3>
          <button class="text-xs text-blue-500 hover:text-blue-600">查看特殊工种</button>
        </div>
        <div class="flex gap-3">
          <div ref="laborMapChartRef" class="w-40 h-48 flex-shrink-0"></div>
          <div class="flex-1 space-y-1 text-xs">
            <div v-for="(province, index) in provinceList" :key="index" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-sm"
                  :style="{ backgroundColor: getProvinceColor(index) }"
                ></div>
                <span class="text-gray-600">{{ province.name }}</span>
              </div>
              <div class="text-gray-500">{{ province.count }}人 <span class="text-gray-400">{{ province.rate }}%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">人员用工曲线</h3>
          <div class="flex border rounded overflow-hidden">
            <button class="px-2 py-0.5 text-xs bg-blue-500 text-white">当日</button>
            <button class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50">近周</button>
            <button class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50">按月</button>
          </div>
        </div>
        <div class="flex items-center justify-around mb-2 text-xs">
          <div class="text-center">
            <div class="text-base font-bold text-blue-500">3379人</div>
            <div class="text-gray-500">当日出勤劳务人员：</div>
          </div>
          <div class="text-center">
            <div class="text-base font-bold text-green-500">644人</div>
            <div class="text-gray-500">当日出勤分包管理人员：</div>
          </div>
        </div>
        <div ref="laborCurveChartRef" class="h-40"></div>
        <div class="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-blue-400 rounded-full"></span>
            <span>劳务人员出勤数</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-green-400 rounded-full"></span>
            <span>分包管理人员出勤数</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">岗位配置情况排行</h3>
          <div class="flex border rounded overflow-hidden">
            <button class="px-2 py-0.5 text-xs bg-blue-500 text-white">总岗位</button>
            <button class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50">安保岗位</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b bg-gray-50">
                <th class="py-2 px-2 text-left font-medium text-gray-600">排名</th>
                <th class="py-2 px-2 text-left font-medium text-gray-600">项目名称</th>
                <th class="py-2 px-2 text-left font-medium text-gray-600">子公司</th>
                <th class="py-2 px-2 text-left font-medium text-gray-600">分公司</th>
                <th class="py-2 px-2 text-center font-medium text-gray-600">安全员</th>
                <th class="py-2 px-2 text-center font-medium text-gray-600">设备员</th>
                <th class="py-2 px-2 text-center font-medium text-gray-600">用电负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in postRankList" :key="index" class="border-b hover:bg-gray-50">
                <td class="py-2 px-2 text-gray-500">{{ index + 1 }}</td>
                <td class="py-2 px-2 text-gray-700 truncate max-w-20">{{ item.name }}</td>
                <td class="py-2 px-2 text-gray-500">{{ item.subsidiary }}</td>
                <td class="py-2 px-2 text-gray-500">{{ item.branch }}</td>
                <td class="py-2 px-2 text-center">
                  <span class="text-green-500">● {{ item.safety }}</span>
                </td>
                <td class="py-2 px-2 text-center">
                  <span class="text-green-500">● {{ item.equipment }}</span>
                </td>
                <td class="py-2 px-2 text-center">
                  <span :class="item.electric > 0 ? 'text-green-500' : 'text-red-500'">● {{ item.electric }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">管理人员情况一览</h3>
          <div class="flex text-xs">
            <button class="px-2 py-0.5 text-blue-500 border-b-2 border-blue-500">总关键岗位出勤率</button>
            <button class="px-2 py-0.5 text-gray-500 hover:text-gray-700">分包关键岗位出勤率</button>
          </div>
        </div>
        <div ref="managerChartRef" class="h-36"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">劳务工情况一览</h3>
          <div class="flex gap-1 text-xs">
            <button class="px-1.5 py-0.5 bg-blue-500 text-white rounded">出勤率</button>
            <button class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 rounded">持证率</button>
            <button class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 rounded">讲评率</button>
            <button class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 rounded">拜师率</button>
            <button class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 rounded">师带徒</button>
            <button class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-50 rounded">证件过期</button>
          </div>
        </div>
        <div ref="workerChartRef" class="h-36"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">出勤方式占比</h3>
          <div class="flex border rounded overflow-hidden">
            <button class="px-2 py-0.5 text-xs bg-blue-500 text-white">当日</button>
            <button class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50">近周</button>
            <button class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50">按月</button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div ref="attendanceTypeChartRef" class="w-32 h-32 flex-shrink-0"></div>
          <div class="flex-1 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-green-400"></span>
                <span class="text-gray-600">移动刷</span>
              </div>
              <div class="text-gray-500">517人 <span class="text-gray-400">10.4%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-400"></span>
                <span class="text-gray-600">静态刷</span>
              </div>
              <div class="text-gray-500">4459人 <span class="text-gray-400">89.6%</span></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span class="text-gray-600">电子工牌</span>
              </div>
              <div class="text-gray-500">0人 <span class="text-gray-400">0.0%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">公司实名制评价得分</h3>
          <div class="flex text-xs">
            <button class="px-2 py-0.5 text-blue-500 border-b-2 border-blue-500">子公司</button>
            <button class="px-2 py-0.5 text-gray-500 hover:text-gray-700">分公司</button>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center h-36">
          <div class="relative">
            <div class="text-5xl font-bold text-blue-500">92.5</div>
            <div class="absolute -top-2 -right-6 w-12 h-12">
              <svg viewBox="0 0 100 100" class="w-full h-full text-red-400 opacity-60">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="5,5" />
                <text x="50" y="55" text-anchor="middle" fill="currentColor" font-size="20" font-weight="bold">通过</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { registerChinaMap } from '../../utils/chinaMap'

const specialWorkChartRef = ref(null)
const subcontractChartRef = ref(null)
const laborMapChartRef = ref(null)
const laborCurveChartRef = ref(null)
const managerChartRef = ref(null)
const workerChartRef = ref(null)
const attendanceTypeChartRef = ref(null)

const attendanceRankList = [
  { name: '奉贤污水厂东扩工程', subsidiary: '上海隧道', branch: '广东分公司', total: 17, checked: 1, rate: 0.0 },
  { name: '李塘污水厂2标工程', subsidiary: '上海路桥', branch: '公司建设公司', total: 11, checked: 0, rate: 0.0 },
  { name: '大型自住型商品房1号地五...', subsidiary: '上海能建', branch: '江苏分公司', total: 9, checked: 0, rate: 0.0 },
  { name: '田林路下穿中环线地道拓建...', subsidiary: '上海隧道', branch: '市政分公司', total: 9, checked: 0, rate: 0.0 }
]

const provinceList = [
  { name: '河南省', count: 387, rate: 18.3 },
  { name: '安徽省', count: 346, rate: 16.4 },
  { name: '江苏省', count: 295, rate: 13.9 },
  { name: '江西省', count: 268, rate: 12.7 },
  { name: '湖北省', count: 256, rate: 12.1 },
  { name: '四川省', count: 156, rate: 7.4 },
  { name: '贵州省', count: 95, rate: 4.5 },
  { name: '云南省', count: 75, rate: 3.5 }
]

const postRankList = [
  { name: '深圳地铁13号线', subsidiary: '上海隧道', branch: '广东公司', safety: 0, equipment: 1, electric: 1 },
  { name: '无锡5号线4标土建工程施工', subsidiary: '上海隧道', branch: '江苏分公司', safety: 6, equipment: 1, electric: 1 },
  { name: '白龙港污水处理厂', subsidiary: '城建集团', branch: '建设公司', safety: 3, equipment: 1, electric: 1 },
  { name: '上海市轨道交通23号线一期工...', subsidiary: '市政集团', branch: '地铁公司', safety: 13, equipment: 7, electric: 0 }
]

const getProvinceColor = (index) => {
  const colors = ['#3B82F6', '#60A5FA', '#34D399', '#FBBF24', '#F97316', '#8B5CF6', '#EC4899', '#6B7280']
  return colors[index % colors.length]
}

const initSpecialWorkChart = () => {
  if (!specialWorkChartRef.value) return
  const chart = echarts.init(specialWorkChartRef.value)
  chart.setOption({
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '2119人',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1F2937'
        },
        data: [
          { value: 712, name: '电焊工', itemStyle: { color: '#FBBF24' } },
          { value: 279, name: '起重信号工', itemStyle: { color: '#34D399' } },
          { value: 260, name: '起重机司机', itemStyle: { color: '#60A5FA' } },
          { value: 202, name: '电工', itemStyle: { color: '#22D3EE' } },
          { value: 191, name: '架子工', itemStyle: { color: '#A78BFA' } },
          { value: 180, name: '油漆工', itemStyle: { color: '#F472B6' } },
          { value: 295, name: '其他', itemStyle: { color: '#D1D5DB' } }
        ]
      }
    ]
  })
}

const initSubcontractChart = () => {
  if (!subcontractChartRef.value) return
  const chart = echarts.init(subcontractChartRef.value)
  chart.setOption({
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '912家\n分包单位总数',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#1F2937',
          lineHeight: 20
        },
        data: [
          { value: 481, name: '专业分包', itemStyle: { color: '#60A5FA' } },
          { value: 431, name: '劳务分包', itemStyle: { color: '#34D399' } }
        ]
      }
    ]
  })
}

const initLaborMapChart = () => {
  if (!laborMapChartRef.value) return
  registerChinaMap()
  const chart = echarts.init(laborMapChartRef.value)
  const mapData = [
    { name: '河南省', value: 387 },
    { name: '安徽省', value: 346 },
    { name: '江苏省', value: 295 },
    { name: '江西省', value: 268 },
    { name: '湖北省', value: 256 },
    { name: '四川省', value: 156 },
    { name: '贵州省', value: 95 },
    { name: '云南省', value: 75 },
    { name: '湖南省', value: 120 },
    { name: '山东省', value: 110 },
    { name: '浙江省', value: 85 },
    { name: '福建省', value: 60 }
  ]
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人'
    },
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 400,
      left: 5,
      bottom: 5,
      text: ['高', '低'],
      textSize: 8,
      inRange: {
        color: ['#e0f2fe', '#7dd3fc', '#0284c7', '#1e3a5f']
      },
      itemHeight: 40,
      textGap: 2
    },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1.15,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 8,
            color: '#1F2937'
          },
          itemStyle: {
            areaColor: '#0284c7'
          }
        },
        itemStyle: {
          areaColor: '#f0f0f0',
          borderColor: '#d9d9d9',
          borderWidth: 0.5
        },
        data: mapData
      }
    ]
  })
}

const initLaborCurveChart = () => {
  if (!laborCurveChartRef.value) return
  const chart = echarts.init(laborCurveChartRef.value)
  const dates = ['07/14', '07/15', '07/18', '07/19', '07/20', '07/21', '07/22', '07/25', '07/26', '07/27', '07/28', '07/29', '07/30']
  const laborData = [2500, 2800, 3500, 4000, 3800, 3600, 3200, 3000, 3500, 4200, 3800, 3500, 3379]
  const manageData = [400, 450, 500, 600, 580, 550, 500, 480, 520, 650, 620, 580, 644]

  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        fontSize: 9,
        color: '#999',
        interval: 2
      },
      axisLine: { lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 9,
        color: '#999'
      },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '劳务人员出勤数',
        type: 'line',
        data: laborData,
        smooth: true,
        lineStyle: { color: '#3B82F6', width: 2 },
        itemStyle: { color: '#3B82F6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        }
      },
      {
        name: '分包管理人员出勤数',
        type: 'line',
        data: manageData,
        smooth: true,
        lineStyle: { color: '#10B981', width: 2 },
        itemStyle: { color: '#10B981' }
      }
    ]
  })
}

const initManagerChart = () => {
  if (!managerChartRef.value) return
  const chart = echarts.init(managerChartRef.value)
  const units = ['上海域浦', '市政集团', '上海路桥', '城市环境', '上海能建', '畅凝物资']
  const data = [85, 78, 72, 68, 60, 55]

  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: units,
      axisLabel: {
        fontSize: 9,
        color: '#999',
        rotate: 30
      },
      axisLine: { lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        fontSize: 9,
        color: '#999',
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        type: 'bar',
        data: data,
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#60A5FA' },
            { offset: 1, color: '#3B82F6' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

const initWorkerChart = () => {
  if (!workerChartRef.value) return
  const chart = echarts.init(workerChartRef.value)
  const units = ['上海域浦', '市政集团', '上海路桥', '城市环境', '上海能建', '畅凝物资']
  const data = [92, 88, 82, 75, 70, 65]

  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: units,
      axisLabel: {
        fontSize: 9,
        color: '#999',
        rotate: 30
      },
      axisLine: { lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        fontSize: 9,
        color: '#999',
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        type: 'bar',
        data: data,
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#34D399' },
            { offset: 1, color: '#10B981' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

const initAttendanceTypeChart = () => {
  if (!attendanceTypeChartRef.value) return
  const chart = echarts.init(attendanceTypeChartRef.value)
  chart.setOption({
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '4976',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1F2937'
        },
        data: [
          { value: 517, name: '移动刷', itemStyle: { color: '#34D399' } },
          { value: 4459, name: '静态刷', itemStyle: { color: '#60A5FA' } },
          { value: 0, name: '电子工牌', itemStyle: { color: '#FBBF24' } }
        ]
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => {
    initSpecialWorkChart()
    initSubcontractChart()
    initLaborMapChart()
    initLaborCurveChart()
    initManagerChart()
    initWorkerChart()
    initAttendanceTypeChart()
  })
})
</script>
