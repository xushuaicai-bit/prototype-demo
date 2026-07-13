<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <div
        v-for="stat in topStats"
        :key="stat.label"
        class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-2">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', stat.iconBg]">
            <span class="text-white text-lg">{{ stat.icon }}</span>
          </div>
          <span v-if="stat.trend" :class="['text-xs', stat.trendUp ? 'text-green-500' : 'text-orange-500']">
            {{ stat.trend }}
          </span>
        </div>
        <div class="text-2xl font-bold text-gray-800">{{ stat.value }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex-1 space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-800">实名制</h3>
              <button class="text-xs text-blue-500 hover:text-blue-600">进入专版</button>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">登记进场人数</div>
                  <div class="text-lg font-bold text-gray-800">18347人</div>
                  <div class="text-xs text-red-500">今日9↓</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">今日计划人数</div>
                  <div class="text-lg font-bold text-gray-800">7175人</div>
                  <div class="text-xs text-green-500">今日9↑</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">今日进出场人数</div>
                  <div class="text-lg font-bold text-gray-800">3026人</div>
                  <div class="text-xs text-gray-400">今日</div>
                </div>
              </div>
              <div class="border-t pt-3">
                <div class="grid grid-cols-3 gap-2 text-center mb-3">
                  <div>
                    <div class="text-xs text-gray-500">现场工人总核定安全质量人数</div>
                    <div class="text-base font-bold text-orange-500">2080人</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">总包安全员项目数</div>
                    <div class="text-base font-bold text-orange-500">159个</div>
                    <div class="text-xs text-gray-400">101人</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">分包安全员项目数</div>
                    <div class="text-base font-bold text-orange-500">152个</div>
                    <div class="text-xs text-gray-400">97人</div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center mb-3">
                  <div>
                    <div class="text-xs text-gray-500">总包安全员未到项目数</div>
                    <div class="text-base font-bold text-red-500">132个</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">总核定安全员未到项目数</div>
                    <div class="text-base font-bold text-red-500">147个</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">分包安全员未到项目数</div>
                    <div class="text-base font-bold text-red-500">221个</div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-red-50 rounded-lg p-2 text-center">
                    <div class="text-base font-bold text-red-500">149个</div>
                    <div class="text-xs text-gray-500">分包安全员未到项目明细</div>
                  </div>
                  <div class="bg-orange-50 rounded-lg p-2 text-center">
                    <div class="text-base font-bold text-orange-500">51个</div>
                    <div class="text-xs text-gray-500">人员提供超期预警</div>
                  </div>
                  <div class="bg-orange-50 rounded-lg p-2 text-center">
                    <div class="text-base font-bold text-orange-500">30个</div>
                    <div class="text-xs text-gray-500">证书超期过期预警</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-800">隐患排查</h3>
              <button class="text-xs text-blue-500 hover:text-blue-600">进入专版</button>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">隐患排查单数</div>
                  <div class="text-lg font-bold text-gray-800">8957个</div>
                  <div class="text-xs text-green-500">今日94↑</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">整改率</div>
                  <div class="text-lg font-bold text-green-500">94.9%</div>
                  <div class="text-xs text-gray-400">重大隐患数</div>
                </div>
              </div>
              <div class="border-t pt-3">
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="text-center">
                    <div class="text-xs text-gray-500">未开单项目</div>
                    <div class="text-base font-bold text-orange-500">29个</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-500">存在隐患升级项目</div>
                    <div class="text-base font-bold text-orange-500">30个</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="text-center">
                    <div class="text-xs text-gray-500">视频隐患项目</div>
                    <div class="text-base font-bold text-red-500">38个</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-500">AI监控隐患项目</div>
                    <div class="text-base font-bold text-red-500">4个</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="bg-red-50 rounded-lg p-2 text-center">
                    <div class="text-base font-bold text-red-500">6个</div>
                    <div class="text-xs text-gray-500">存在未整改重大隐患项目</div>
                  </div>
                  <div class="bg-red-50 rounded-lg p-2 text-center">
                    <div class="text-base font-bold text-red-500">0个</div>
                    <div class="text-xs text-gray-500">整改不合格项目</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-800">视频监控</h3>
              <button class="text-xs text-blue-500 hover:text-blue-600">进入专版</button>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">已安装监控数</div>
                  <div class="text-lg font-bold text-gray-800">708台</div>
                  <div class="text-xs text-gray-400">当前在线</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2">
                  <div class="text-xs text-gray-500">AI点位</div>
                  <div class="text-lg font-bold text-gray-800">16个</div>
                  <div class="text-xs text-gray-400">在线率</div>
                </div>
              </div>
              <div class="border-t pt-3">
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="text-center">
                    <div class="text-xs text-gray-500">视频隐患项目</div>
                    <div class="text-base font-bold text-red-500">38个</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-500">AI监控隐患项目</div>
                    <div class="text-base font-bold text-red-500">4个</div>
                  </div>
                </div>
                <div class="bg-orange-50 rounded-lg p-2 text-center">
                  <div class="text-base font-bold text-orange-500">76个</div>
                  <div class="text-xs text-gray-500">监控未安装项目</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <button class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg">重大安全风险项目(4)</button>
            <button class="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded-lg">项目现场AI抓拍</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(project, index) in riskProjects"
              :key="index"
              class="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-800 line-clamp-2">{{ project.name }}</div>
                </div>
                <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded whitespace-nowrap">
                  {{ project.status }}
                </span>
              </div>
              <div class="text-xs text-gray-500 space-y-1 mb-2">
                <div>建设单位：{{ project.owner }}</div>
                <div>施工单位：{{ project.constructor }}</div>
                <div>产值合同金额：{{ project.amount }}</div>
                <div>风险等级：<span :class="project.riskLevelClass">{{ project.riskLevel }}</span></div>
              </div>
              <div class="border-t pt-2 text-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-gray-500">风险内容</span>
                  <span class="text-gray-400">风险控制计划</span>
                </div>
                <div class="text-gray-600 mb-2 line-clamp-2">{{ project.riskContent }}</div>
                <div class="flex items-center justify-between text-gray-400">
                  <span>计划开始：{{ project.planStart }}</span>
                  <span>计划结束：{{ project.planEnd }}</span>
                </div>
              </div>
              <div class="border-t pt-2 mt-2">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span class="text-xs font-medium text-gray-700">风险级别</span>
                </div>
                <div class="flex flex-wrap gap-1 mb-2">
                  <span v-for="tag in project.riskTags" :key="tag" class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                    {{ tag }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span class="text-gray-500">风险监控情况</span>
                  </div>
                  <span :class="project.monitorClass">{{ project.monitorStatus }}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-400">监理单位</span>
                  <span class="text-xs text-blue-500">{{ project.supervisor }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">分包单位</span>
                  <span class="text-xs text-gray-500">{{ project.subcontractor }}</span>
                </div>
              </div>
              <div class="border-t pt-2 mt-2 flex items-center justify-between text-xs">
                <span class="text-gray-500">已上传日报</span>
                <div class="flex items-center gap-3">
                  <span class="text-blue-500">{{ project.days }}天</span>
                  <span class="text-gray-400">07月12日</span>
                  <span class="text-gray-400">07月13日</span>
                  <span class="text-gray-400">07月14日</span>
                </div>
                <span class="text-gray-400">{{ project.lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-64 flex-shrink-0">
        <div class="bg-white rounded-xl p-4 shadow-sm sticky top-4">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="font-semibold text-gray-800">预警项</h3>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b">
              <div>
                <div class="text-2xl font-bold text-orange-500">163个</div>
                <div class="text-xs text-gray-500">重置隐患项目</div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-400">0个</div>
                <div class="text-xs text-gray-500">隐患整改不及时项目预警</div>
              </div>
            </div>
            <div class="flex items-center justify-between pb-3 border-b">
              <div>
                <div class="text-2xl font-bold text-orange-500">11个</div>
                <div class="text-xs text-gray-500">重大事故隐患预警项目</div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-orange-500">157个</div>
                <div class="text-xs text-gray-500">上级单位检查预警</div>
              </div>
            </div>
            <div class="pt-2">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-2xl font-bold text-orange-500">231个</div>
                  <div class="text-xs text-gray-500">安全投入预警项目</div>
                </div>
                <div class="text-right text-xs text-gray-400">
                  <div>总包、分包关键岗位不到位检测</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const topStats = [
  { label: '生产项目', value: '5828个', icon: '📋', iconBg: 'bg-blue-500', trend: '', trendUp: true },
  { label: '安全的管项目', value: '232个', icon: '🛡️', iconBg: 'bg-green-500', trend: '', trendUp: true },
  { label: '开通实名制项目', value: '216个', icon: '👤', iconBg: 'bg-purple-500', trend: '', trendUp: true },
  { label: '未及时登记实名制项目', value: '10个', icon: '⚠️', iconBg: 'bg-orange-500', trend: '', trendUp: false },
  { label: '开通视频监控项目', value: '156个', icon: '📹', iconBg: 'bg-cyan-500', trend: '', trendUp: true },
  { label: '开通AI监控项目', value: '8个', icon: '🤖', iconBg: 'bg-indigo-500', trend: '', trendUp: true },
  { label: '近一周开展隐患排查项目', value: '165个', icon: '🔍', iconBg: 'bg-teal-500', trend: '', trendUp: true },
  { label: '重大安全风险项目', value: '4个', icon: '🚨', iconBg: 'bg-red-500', trend: '', trendUp: false }
]

const riskProjects = [
  {
    name: '青砂-沙/杨行连通改造工程KG1.6标',
    status: '施工中',
    owner: '市北建设公司',
    constructor: '龙道建设公司',
    amount: '4,235.76万元',
    riskLevel: '深基坑开挖',
    riskLevelClass: 'text-red-500',
    riskContent: '基坑开挖深度约19m（明挖近桥段），距离外环高速44m，距高压电线95m，距离居民区200m',
    planStart: '2026-05-31',
    planEnd: '2026-09-30',
    riskTags: ['基坑坍塌', '起重吊装', '周边环境', '子项'],
    monitorStatus: '未报',
    monitorClass: 'text-orange-500',
    supervisor: '建科-建设监理',
    subcontractor: '土建-河南城建/生产保障',
    days: '106',
    lastUpdate: '2026-07-13 08:54:01'
  },
  {
    name: '临港住宅322号地块（征地地上综合开发利用）三期工程总承包工程',
    status: '施工中',
    owner: '上海港城/机电二部',
    constructor: '上海路桥/总承包一部',
    amount: '158,429.8万元',
    riskLevel: '承台、箱梁底模拆除',
    riskLevelClass: 'text-red-500',
    riskContent: '现场七灶港站主体结构东西两侧立壁施工、影响较重，土壤结构稳定性差',
    planStart: '2026-05-11',
    planEnd: '2026-12-31',
    riskTags: ['基坑坍塌', '起重吊装', '高支模', '子项'],
    monitorStatus: '未报',
    monitorClass: 'text-orange-500',
    supervisor: '上海三凯建设管理',
    subcontractor: '土建-江苏南通三建',
    days: '63',
    lastUpdate: '2026-07-11 07:56:35'
  },
  {
    name: '上海市轨道交通12号线延伸段工程土建1标（澜溪路-闵松~刘五公路区间西）',
    status: '施工中',
    owner: '上海地铁/轨交二公司',
    constructor: '上海隧管/机施分公司',
    amount: '62,868.82万元',
    riskLevel: '风险新增内容',
    riskLevelClass: 'text-red-500',
    riskContent: '地基处理段穿越老港5号河改建箱涵，北侧明挖区间距离箱涵25m，南侧明挖20m',
    planStart: '2026-07-06',
    planEnd: '2026-08-06',
    riskTags: ['基坑坍塌', '高支模', '起重吊装', '子项'],
    monitorStatus: '未报',
    monitorClass: 'text-orange-500',
    supervisor: '上海建科-工程监理',
    subcontractor: '隧道-江苏建总集团',
    days: '7',
    lastUpdate: '2026-07-08 13:37:07'
  }
]
</script>
