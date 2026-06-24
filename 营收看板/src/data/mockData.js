export const projectStats = [
  { title: '待建', value: '78', unit: '个' },
  { title: '在建', value: '397', unit: '个' },
  { title: '停工', value: '579', unit: '个' },
  { title: '完工', value: '1458', unit: '个' },
  { title: '当年竣工', value: '22', unit: '个' }
]

const departments = [
  { name: '管网事业部', count: 24 },
  { name: '生态事业部', count: 18 },
  { name: '区域事业部', count: 22 },
  { name: '市政事业部', count: 16 },
  { name: '环境建设', count: 15 },
  { name: '管道工程', count: 19 },
  { name: '管道分公司', count: 21 },
  { name: '运营养护', count: 17 },
  { name: '二次养护', count: 20 }
]

export const totalProjectCount = departments.reduce((sum, item) => sum + (item.count || 0), 0)

export const categoryTabs = [
  { name: '全部', count: totalProjectCount, isAll: true },
  ...departments
]

export const departmentData = departments

export const managementTimelinessData = {
  title: '管理提示及时性',
  registrationAlerts: {
    red: 21,
    orange: 12,
    yellow: 22
  },
  planningAlerts: {
    red: 15,
    orange: 8,
    yellow: 18
  },
  subItems: [
    { name: '待登记', value: 300 },
    { name: '已登记', value: 208 },
    { name: '应登记', value: 508 },
    { name: '应筹划', value: 508 },
    { name: '待筹划', value: 300 },
    { name: '项目筹划完成率', value: '41%' },
    { name: '基本信息完成率', value: '41%' }
  ]
}

export const riskAlertTimeliness = [
  { title: '当年一、二级风险数量', value: '10个' },
  { title: '当前进入风险数量', value: '2个' },
  { title: '当年完成风险数量', value: '8个' },
  { title: '当年剩余风险数量', value: '20个' },
  { title: '未来两周进入风险数量（按等级+总量）', value: '9个' },
  { title: 'I级未来两周进入风险数量', value: '2个' },
  { title: 'II级未来两周进入风险数量', value: '4个' },
  { title: 'III级未来两周进入风险数量', value: '3个' }
]

export const riskByLevel = [
  { level: 'I级风险', count: 2, completed: 0 },
  { level: 'II级风险', count: 6, completed: 1 },
  { level: 'III级风险', count: 8, completed: 2 }
]

export const windRiskAlert = {
  title: '风险开工令预警',
  redAlert: 2,
  orangeAlert: 12,
  yellowAlert: 17
}

export const productionProgress = {
  milestone: {
    title: '里程碑节点',
    total: 145
  },
  completed: {
    count: 35,
    total: 145
  },
  alerts: {
    red: 2,
    orange: 12,
    yellow: 17
  }
}

export const keyProjectProgress = {
  milestone: {
    title: '重点管控里程碑节点',
    total: 145
  },
  completed: {
    count: 35,
    total: 145
  },
  alerts: {
    red: 2,
    orange: 12,
    yellow: 17
  },
  keyProjectCount: 21,
  unreportedCount: 3
}

export const certificateData = [
  {
    name: '施工许可证',
    total: 10,
    completed: 8,
    remaining: 2,
    percentage: 80
  },
  {
    name: '占路许可证',
    total: 10,
    completed: 8,
    remaining: 2,
    percentage: 80
  },
  {
    name: '渣土清运证',
    total: 10,
    completed: 8,
    remaining: 2,
    percentage: 80
  },
  {
    name: '掘路证',
    total: 10,
    completed: 8,
    remaining: 2,
    percentage: 80
  }
]

export const inspectionData = {
  totalCount: 32,
  completedCount: 22,
  pendingCount: 10,
  redAlerts: [10, 10, 10]
}

export const supplyChainStatCards = [
  {
    title: '供应商合同签订情况',
    value: '35',
    unit: '个',
    icon: 'trending-up',
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-500',
    drillable: true
  }
]

export const supplyChainTimelinessData = {
  title: '供应商合同签订及时性',
  totalOrders: 120,
  signedOrders: 98,
  totalSigned: 110,
  yellowAlert: 8,
  orangeAlert: 5,
  redAlert: 3,
  subItems: [
    { name: '专业分包', yellow: 3, orange: 2, red: 1 },
    { name: '劳务分包', yellow: 2, orange: 1, red: 1 },
    { name: '周转材料/设备租赁', yellow: 2, orange: 1, red: 0 },
    { name: '材料/设备采购', yellow: 1, orange: 1, red: 1 }
  ],
  subCircles: [
    { percentage: 85, signed: 42, pending: 7, total: 49 },
    { percentage: 82, signed: 38, pending: 8, total: 46 },
    { percentage: 92, signed: 23, pending: 2, total: 25 },
    { percentage: 88, signed: 37, pending: 5, total: 42 }
  ]
}

export const supplyContractChartData = {
  title: '供应商合同签订',
  subTitle: '按基层单位统计',
  categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
  series: [
    {
      name: '未签',
      data: [4, 4, 4, 4, 2, 3, 3, 3, 3],
      color: '#9ca3af'
    },
    {
      name: '红色预警',
      data: [1, 1, 1, 1, 0, 1, 1, 0, 1],
      color: '#ef4444'
    },
    {
      name: '橙色预警',
      data: [1, 1, 2, 1, 1, 1, 1, 2, 1],
      color: '#f97316'
    },
    {
      name: '黄色预警',
      data: [1, 1, 1, 1, 1, 1, 1, 1, 0],
      color: '#eab308'
    }
  ],
  warningData: {
    '专业分包': { shouldSign: 45, signed: 42, red: 1, orange: 1, yellow: 1 },
    '劳务分包': { shouldSign: 38, signed: 35, red: 1, orange: 1, yellow: 1 },
    '材料/设备采购': { shouldSign: 52, signed: 48, red: 1, orange: 2, yellow: 1 },
    '周转材料/设备租赁': { shouldSign: 30, signed: 27, red: 0, orange: 1, yellow: 2 },
    '全部': { shouldSign: 165, signed: 152, red: 3, orange: 5, yellow: 5 }
  }
}

export const supplierStatChart1Data = {
  title: '合格供应商',
  subTitle: '合格供应商统计',
  categories: ['专业分包', '劳务分包', '周转材料', '材料/设备采购'],
  levels: {
    A: {
      supplierCount: 150,
      countByCategory: [45, 38, 32, 35],
      contractCount: [8, 7, 5, 6],
      contractAmount: [25000, 23000, 18000, 20000],
      color: '#3b82f6'
    },
    B: {
      supplierCount: 120,
      countByCategory: [36, 30, 26, 28],
      contractCount: [6, 5, 4, 5],
      contractAmount: [20000, 18000, 14000, 13000],
      color: '#10b981'
    },
    C: {
      supplierCount: 80,
      countByCategory: [24, 20, 18, 18],
      contractCount: [4, 3, 2, 3],
      contractAmount: [14000, 12000, 10000, 8000],
      color: '#f59e0b'
    }
  },
  series: [
    { name: '供应商数量', data: [150, 120, 80, 90], color: '#3b82f6' },
    { name: '履约中合同数', data: [300, 280, 200, 220], color: '#93c5fd' },
    { name: '履约中合同额(万元)', data: [25000, 23000, 18000, 20000], color: '#dbeafe' }
  ]
}

export const supplierStatChart2Data = {
  title: '合同额Top10供应商',
  subTitle: '按合同额排名',
  categories: ['北京华建工程有限公司', '上海水务建设集团', '杭州城建集团', '成都建工集团', '广州管道工程公司', '南京水务工程公司', '深圳环保科技有限公司', '武汉市政工程公司', '天津管道工程公司', '重庆水务集团'],
  series: [
    {
      name: '履约中合同数',
      data: [50, 45, 40, 38, 35, 30, 28, 25, 22, 20],
      color: '#93c5fd'
    },
    {
      name: '履约中合同额',
      data: [45, 42, 38, 35, 32, 28, 26, 23, 20, 18],
      color: '#dbeafe'
    }
  ],
  topLine: [50, 48, 45, 42, 38, 35, 32, 28, 25, 22]
}

export const materialProcurementData = {
  title: '材料集采合同情况',
  categories: ['股份集采项目', '环境集采项目'],
  series: [
    {
      name: '采购合同签订数量',
      data: [150, 120],
      color: '#3b82f6'
    },
    {
      name: '项目合同执行数量',
      data: [130, 100],
      color: '#93c5fd'
    },
    {
      name: '集采完成率',
      data: [100, 95],
      color: '#10b981'
    }
  ]
}

export const techDashboardData = {
  approvalByCompany: {
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: '完成数', data: [45, 38, 42, 35, 32, 40, 38, 35, 40] },
      { name: '未完成数', data: [5, 8, 6, 10, 8, 5, 7, 10, 6] }
    ],
    summary: { total: 320, avgRate: '85%' }
  },
  approvalByBusiness: {
    categories: ['水务', '水环境治理', '水利', '固废处理', '土壤修复', '城市更新', '市政路桥', '其他'],
    series: [
      { name: '完成数', data: [52, 45, 38, 28, 22, 30, 48, 25] },
      { name: '未完成数', data: [8, 10, 12, 8, 6, 10, 12, 8] }
    ],
    summary: { total: 280, avgRate: '82%' }
  },
  schemeByCompany: {
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: '退回数', data: [8, 12, 10, 15, 12, 8, 10, 14, 10] },
      { name: '通过数', data: [42, 38, 40, 35, 32, 38, 36, 32, 38] }
    ],
    summary: { total: 95, avgRate: '12%' }
  },
  schemeByBusiness: {
    categories: ['水务', '水环境治理', '水利', '固废处理', '土壤修复', '城市更新', '市政路桥', '其他'],
    series: [
      { name: '退回数', data: [12, 15, 10, 8, 6, 10, 14, 8] },
      { name: '通过数', data: [48, 42, 38, 28, 22, 30, 45, 25] }
    ],
    summary: { total: 88, avgRate: '10%' }
  },
  disclosureByCompany: {
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: '已交底', data: [38, 32, 35, 28, 25, 32, 30, 28, 32] },
      { name: '未交底', data: [12, 15, 12, 18, 15, 12, 15, 18, 12] }
    ],
    summary: { total: 280, avgCount: '3.2' }
  },
  disclosureByBusiness: {
    categories: ['水务', '水环境治理', '水利', '固废处理', '土壤修复', '城市更新', '市政路桥', '其他'],
    series: [
      { name: '已交底', data: [45, 38, 32, 22, 18, 25, 40, 20] },
      { name: '未交底', data: [15, 18, 15, 12, 10, 15, 18, 12] }
    ],
    summary: { total: 245, avgCount: '2.8' }
  },
  knowledgeBase: {
    totalUpload: 1250,
    totalDownload: 5680,
    downloadUsers: 380,
    categories: ['规范标准', '施工方案', '技术交底', '图纸会审', '质量控制', '安全措施'],
    uploadData: [120, 180, 150, 90, 110, 85],
    downloadData: [580, 820, 650, 420, 510, 380]
  }
}

// 按年份的完工/当年竣工数据（仅对这两个指标生效）
export const completedByYear = {
  default: { completed: '1458', currentYear: '22' },
  '2026': { completed: '320', currentYear: '22' },
  '2025': { completed: '280', currentYear: '18' }
}

// 仅看产运重点项目时的数据（约为全量的40%）
export const keyProjectOnlyStats = [
  { title: '待建', value: '31', unit: '个' },
  { title: '在建', value: '159', unit: '个' },
  { title: '停工', value: '232', unit: '个' },
  { title: '完工', value: '583', unit: '个' },
  { title: '当年竣工', value: '9', unit: '个' }
]

export const keyProjectOnlyManagementTimeliness = {
  title: '管理提示及时性',
  registrationAlerts: { red: 8, orange: 5, yellow: 9 },
  planningAlerts: { red: 6, orange: 3, yellow: 7 },
  subItems: [
    { name: '待登记', value: 120 },
    { name: '已登记', value: 83 },
    { name: '应登记', value: 203 },
    { name: '应筹划', value: 203 },
    { name: '待筹划', value: 120 },
    { name: '项目筹划完成率', value: '41%' },
    { name: '基本信息完成率', value: '69%' }
  ]
}

export const keyProjectOnlyRiskAlertTimeliness = [
  { title: '当年一、二级风险数量', value: '4个' },
  { title: '当前进入风险数量', value: '1个' },
  { title: '当年完成风险数量', value: '3个' },
  { title: '当年剩余风险数量', value: '8个' },
  { title: '未来两周进入风险数量（按等级+总量）', value: '4个' },
  { title: 'I级未来两周进入风险数量', value: '1个' },
  { title: 'II级未来两周进入风险数量', value: '2个' },
  { title: 'III级未来两周进入风险数量', value: '1个' }
]

export const keyProjectOnlyRiskByLevel = [
  { level: 'I级风险', count: 1, completed: 0 },
  { level: 'II级风险', count: 2, completed: 0 },
  { level: 'III级风险', count: 3, completed: 1 }
]

export const keyProjectOnlyKeyProjectProgress = {
  milestone: { title: '重点管控里程碑节点', total: 58 },
  completed: { count: 14, total: 58 },
  alerts: { red: 1, orange: 5, yellow: 7 },
  keyProjectCount: 8,
  unreportedCount: 1
}

export const researchDashboardData = {
  projects: {
    byCompany: [
      { name: '管网事业部', count: 15 },
      { name: '生态事业部', count: 12 },
      { name: '区域事业部', count: 18 },
      { name: '市政事业部', count: 10 },
      { name: '环境建设', count: 8 },
      { name: '管道工程', count: 14 },
      { name: '管道分公司', count: 11 },
      { name: '运营养护', count: 9 },
      { name: '二次养护', count: 7 }
    ]
  },
  achievements: {
    byType: [
      { name: '论文', count: 45, color: '#3b82f6' },
      { name: '专利', count: 32, color: '#10b981' },
      { name: '工法', count: 18, color: '#f59e0b' },
      { name: '标准', count: 12, color: '#8b5cf6' },
      { name: '奖项', count: 8, color: '#ec4899' },
      { name: '其他', count: 15, color: '#06b6d4' }
    ],
    byCompany: [
      { name: '管网事业部', total: 25 },
      { name: '生态事业部', total: 18 },
      { name: '区域事业部', total: 22 },
      { name: '市政事业部', total: 15 },
      { name: '环境建设', total: 12 },
      { name: '管道工程', total: 20 }
    ]
  },
  expenses: {
    quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
    quarterlyData: {
      Q1: { target: 500, actual: 450, deviation: -50, completion: 90 },
      Q2: { target: 600, actual: 520, deviation: -80, completion: 87 },
      Q3: { target: 550, actual: 480, deviation: -70, completion: 87 },
      Q4: { target: 650, actual: 0, deviation: -650, completion: 0 }
    }
  }
}
