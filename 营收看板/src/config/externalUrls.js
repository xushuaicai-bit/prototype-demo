/**
 * 外部系统 URL 集中配置
 *
 * 安全说明：
 * - 所有外部 URL 基础地址通过环境变量配置，默认为空（Demo 演示安全模式）
 * - Demo 环境下 openExternal() 会显示提示文字，iframe 显示占位提示
 * - 如需启用真实跳转，在项目根目录创建 .env 文件并设置：
 *     VITE_SMART_WORKSITE_URL=https://szsg-test.stec.net/hj/#/biz/overview/general
 *     VITE_STEC_SAFETY_URL=https://szsg-test.stec.net/#
 */

import { ElMessage } from 'element-plus'

const SMART_WORKSITE = import.meta.env.VITE_SMART_WORKSITE_URL || ''
const STEC_SAFETY = import.meta.env.VITE_STEC_SAFETY_URL || ''

function buildUrl(base, path, query) {
  if (!base) return ''
  let url = `${base}${path}`
  if (query) url += `?${query}`
  return url
}

/** 是否启用外部跳转 */
export const isExternalEnabled = !!(SMART_WORKSITE || STEC_SAFETY)

/** 外部系统 URL */
export const externalUrls = {
  // 市场
  marketProdProject: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/prod-project/index'),
  marketContract: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/general/contract'),
  marketPotential: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/project/potential'),
  marketBid: buildUrl(SMART_WORKSITE, '/micro/market/biz/ent/market/project/bid'),
  // 生产
  productionMilestone: buildUrl(SMART_WORKSITE, '/micro/project/biz/ent/production/schedule/milestone'),
  productionRisk: buildUrl(SMART_WORKSITE, '/micro/project/biz/ent/production/risk/list'),
  productionInspection: buildUrl(SMART_WORKSITE, '/micro/project/biz/ent/production/quality/inspection/list'),
  // 科研技术
  researchProject: (company) => buildUrl(SMART_WORKSITE, '/micro/project/biz/scientific-research/project', company ? `company=${encodeURIComponent(company)}` : ''),
  researchAchievement: (type) => buildUrl(SMART_WORKSITE, '/micro/project/biz/scientific-research/achievement', type ? `type=${encodeURIComponent(type)}` : ''),
  techSchemePlan: (company) => buildUrl(SMART_WORKSITE, '/micro/project/biz/technology/scheme/plan', `company=${encodeURIComponent(company)}`),
  techSchemeSpecial: (company) => buildUrl(SMART_WORKSITE, '/micro/project/biz/technology/scheme/special', `company=${encodeURIComponent(company)}`),
  techProcedure: buildUrl(SMART_WORKSITE, '/micro/project/biz/technology/knowledge/enterprise-procedure'),
  // 经济管理
  economyDashboard: buildUrl(SMART_WORKSITE, '/micro/economic/biz/ent/economy/dashboard'),
  // 供应链
  suppliesFrameContract: buildUrl(SMART_WORKSITE, '/micro/supplies/biz/enterprise/supplies/frame-contract/index'),
  // 安全管理
  safetyBoard: 'http://8.133.16.186:8003/#/micro/auth/user?t=1783932959260',
}

/**
 * 安全地打开外部链接
 * Demo 环境（URL 为空）时弹出提示文字
 */
export function openExternal(url) {
  if (!url) {
    ElMessage.info('跳转至环境项管系统对应模块')
    return
  }
  window.open(url, '_blank')
}
