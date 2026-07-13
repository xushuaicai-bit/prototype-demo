import * as echarts from 'echarts'
import chinaMapData from 'china-map-echarts'

let registered = false

export function registerChinaMap() {
  if (registered) return
  const chinaGeoJson = chinaMapData.map_root || chinaMapData.map_100000
  echarts.registerMap('china', chinaGeoJson)
  registered = true
}

export { chinaMapData }
