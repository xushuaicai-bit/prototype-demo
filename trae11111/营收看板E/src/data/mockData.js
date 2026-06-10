export const projectStats = [
  { title: '特建', value: '78', unit: '个' },
  { title: '在建', value: '397', unit: '个' },
  { title: '停工', value: '579', unit: '个' },
  { title: '完工', value: '1458', unit: '个' },
  { title: '当年竣工', value: '22', unit: '个' }
]

export const managementTimelinessData = {
  title: '管理提示及时性',
  redAlert: 21,
  orangeAlert: 12,
  yellowAlert: 22,
  subItems: [
    { name: '应登记', value: 508 },
    { name: '待登记', value: 300 },
    { name: '应筹划', value: 508 },
    { name: '待筹划', value: 300 },
    { name: '红色预警', value: 4 },
    { name: '橙色预警', value: 22 },
    { name: '黄色预警', value: 71 },
    { name: '基本信息完成率', value: '72%' },
    { name: '项目筹划完成率', value: '45%' }
  ]
}

export const riskAlertTimeliness = [
  { title: '当年一、二级风险数量', value: '2个' },
  { title: '当前进入风险数量', value: '2个' },
  { title: '当年完成风险数量', value: '2个' },
  { title: '当年剩余风险数量', value: '2个' },
  { title: '未来两周进入风险数量（按等级+总量）', value: '2个' },
  { title: 'I级未来两周进入风险数量', value: '2个' },
  { title: 'II级未来两周进入风险数量', value: '2个' },
  { title: 'III级未来两周进入风险数量', value: '2个' }
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
    title: '材料集采完成率',
    value1: '72.5',
    value2: '85',
    unit: '%',
    subtitle1: '股份：',
    subtitle2: '环境：',
    color: 'blue'
  },
  {
    title: '合同签订及时率',
    value: '72.5',
    unit: '%',
    detail1: '已签订：96',
    detail2: '待鉴定：32',
    color: 'purple'
  },
  {
    title: 'A级承包商占比',
    value: '25.0',
    unit: '%',
    detail1: 'A级：5',
    detail2: '非A级：15',
    color: 'green'
  }
]

export const supplyChainTimelinessData = {
  title: '下游供应商合同签订及时性',
  totalOrders: '4622',
  signedOrders: '1222',
  totalSigned: '3500',
  yellowAlert: 17,
  orangeAlert: 2,
  redAlert: 2,
  subItems: [
    { name: '专业分包合同签订及时性', yellow: 10, orange: 0, red: 10 },
    { name: '劳务分包合同签订及时性', yellow: 0, orange: 0, red: 10 },
    { name: '周转材料/设备租赁合同签订及时性', yellow: 0, orange: 0, red: 10 },
    { name: '材料/设备采购合同签订及时性', yellow: 0, orange: 0, red: 10 }
  ],
  subCircles: [
    { title: '管网事业部', percentage: 95, total: 55, signed: 55, color: 'blue' },
    { title: '生态事业部', percentage: 92, total: 55, signed: 55, color: 'green' },
    { title: '区域事业部', percentage: 90, total: 55, signed: 55, color: 'purple' },
    { title: '市政事业部', percentage: 93, total: 55, signed: 55, color: 'cyan' },
    { title: '环境建设', percentage: 91, total: 55, signed: 55, color: 'orange' },
    { title: '管道工程', percentage: 94, total: 55, signed: 55, color: 'pink' },
    { title: '管道分公司', percentage: 96, total: 55, signed: 55, color: 'red' },
    { title: '运营养护', percentage: 89, total: 55, signed: 55, color: 'gray' },
    { title: '二次养护', percentage: 95, total: 55, signed: 55, color: 'yellow' }
  ]
}

export const supplyContractChartData = {
  title: '供应商合同签订情况',
  subTitle: '城乡水务局应签合同共56个，已签合同共30个，黄色预警共10个，橙色预警共3个，红色预警共13个',
  categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
  series: [
    { name: '已签订', data: [180, 160, 150, 170, 165, 175, 185, 155, 168], color: '#3b82f6' },
    { name: '黄色预警', data: [60, 80, 90, 70, 75, 65, 55, 85, 72], color: '#eab308' },
    { name: '橙色预警', data: [20, 30, 40, 25, 28, 22, 18, 35, 26], color: '#f97316' },
    { name: '红色预警', data: [15, 20, 25, 18, 16, 19, 14, 22, 17], color: '#ef4444' }
  ]
}

export const supplierStatChart1Data = {
  title: '供应商统计',
  subTitle: 'A级承包商统计',
  categories: ['专业分包', '劳务分包', '周转材料', '材料/设备采购'],
  series: [
    { name: 'A级承包商数量', data: [150, 120, 80, 90], color: '#3b82f6' },
    { name: '正在执行合同数', data: [300, 280, 200, 220], color: '#93c5fd' },
    { name: '正在执行合同额', data: [250, 230, 180, 200], color: '#dbeafe' }
  ]
}

export const supplierStatChart2Data = {
  title: '供应商统计',
  subTitle: '合同Top10供应商',
  categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  series: [
    { name: '正在执行合同数', data: [50, 45, 40, 38, 35, 30, 28, 25, 22, 20], color: '#93c5fd' },
    { name: '正在执行合同额', data: [45, 42, 38, 35, 32, 28, 26, 23, 20, 18], color: '#dbeafe' }
  ],
  topLine: [50, 48, 45, 42, 38, 35, 32, 28, 25, 22]
}

export const materialProcurementData = {
  title: '材料集采推广情况',
  categories: ['股份集采项目', '环境集采项目', '股份/环境集采项目'],
  series: [
    { name: '采购合同签订数量', data: [150, 120, 80], color: '#3b82f6' },
    { name: '项目合同执行数量', data: [130, 100, 70], color: '#93c5fd' },
    { name: '集采完成率', data: [100, 95, 85], color: '#10b981' }
  ]
}