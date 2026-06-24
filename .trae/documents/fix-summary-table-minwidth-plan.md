# 修复营收汇总表后面几列不显示的问题

## 根因分析

[RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue) 施工类总营收 tab 的 el-table 和底部固定合计行的 `min-width` 均为 **2500px**，这是添加"当月计划营收"和"当月完成营收"两个列组（共 8 列）之前的值。

### 列宽计算

| 列组 | 列数 | 各列宽度 | 小计 |
|------|------|---------|------|
| 基层单位 | 1 | 200 | 200 |
| 营收指标 | 1 | 120 | 120 |
| 指标完成率 | 1 | 140 | 140 |
| 结转至当年及以后营收 | 3 | 130+130+160 | 420 |
| **当月计划营收（新增）** | **4** | **130+130+120+160** | **540** |
| **当月完成营收（新增）** | **4** | **130+130+120+160** | **540** |
| 本年度计划营收 | 4 | 130+130+120+160 | 540 |
| 本年度累计完成营收 | 4 | 130+130+120+160 | 540 |
| 上报营收及剩余合同存量 | 3 | 140+140+140 | 420 |
| **总计** | **25** | - | **~3430** |

旧 min-width 2500px < 实际需要 ~3430px → 后面几列被截断。

## 修改方案

仅修改 [RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue) 两处 min-width：

### 修改 1：el-table 的 style（L92）

```html
<!-- 改前 -->
style="min-width: 2500px;"

<!-- 改后 -->
style="min-width: 3500px;"
```

### 修改 2：底部固定合计行 table（L383）

```html
<!-- 改前 -->
<table style="width: 100%; min-width: 2500px; table-layout: fixed; border-collapse: collapse;">

<!-- 改后 -->
<table style="width: 100%; min-width: 3500px; table-layout: fixed; border-collapse: collapse;">
```

## 验证

刷新页面，施工类总营收表格应能横向滚动显示全部 25 列（含新增的 8 列），最后三列（上报营收、新接合同额、剩余合同存量）正常可见。
