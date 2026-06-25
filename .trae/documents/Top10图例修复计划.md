# 合同额Top10供应商图例修复

## 摘要
L281 的 `data: seriesData.filter(s => s.name !== '履约中合同数')` 是为"合格供应商"图表隐藏"履约中合同数"图例而添加的，但它也影响了Top10图表，导致Top10中柱子(履约中合同数)的图例被错误隐藏。

## 改动
文件：`e:\trae_demo_env\营收看板\src\components\dashboard\SupplierStatChart.vue`

L281：
```js
// 改前（对所有模式都过滤）
data: seriesData.filter(s => s.name !== '履约中合同数').map(s => s.name)

// 改后（仅在合格供应商模式下过滤）
data: isTop10Chart.value ? seriesData.map(s => s.name) : seriesData.filter(s => s.name !== '履约中合同数').map(s => s.name)
```

## 验证
1. 打开Top10供应商图表，确认图例显示2项：履约中合同数(柱)、履约中合同额(线)
2. 切换到合格供应商图表，确认图例仍不显示"履约中合同数"
