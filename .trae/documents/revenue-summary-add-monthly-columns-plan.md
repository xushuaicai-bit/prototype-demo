# 营收汇总表施工类总营收 tab 新增"当月计划营收"和"当月完成营收"列组

## 需求（基于截图）

在 **"结转至当年及以后营收合计"** 列之后，新增两个多级表头列组：

### 列组 1：当月计划营收

| 子列        | prop                      | width |
| --------- | ------------------------- | ----- |
| 结转在建项目    | `monthlyPlanConstruction` | 130   |
| 完工待结算项目   | `monthlyPlanCompleted`    | 130   |
| 新接项目      | `monthlyPlanNew`          | 120   |
| 当月计划营收-合计 | `monthlyPlanTotal`        | 160   |

### 列组 2：当月完成营收

| 子列        | prop                        | width |
| --------- | --------------------------- | ----- |
| 结转在建项目    | `monthlyActualConstruction` | 130   |
| 完工待结算项目   | `monthlyActualCompleted`    | 130   |
| 新接项目      | `monthlyActualNew`          | 120   |
| 当月完成营收-合计 | `monthlyActualTotal`        | 160   |

## 当前结构（需修改位置）

当前施工类表格列顺序：

1. 基层单位 → 营收目标 → 指标完成率
2. **结转至当年及以后营收**（3子列）
3. ~~本年度计划营收~~（4子列）
4. 本年度累计完成营收（4子列）
5. 上报营收及剩余合同存量（3子列）

修改后顺序：在第 2 组之后、第 3 组之前插入新列组。

## 涉及文件

仅 [RevenueSummary.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueSummary.vue)，共 5 处修改：

### 修改 1：模板 - 新增 el-table-column（L172-173 之后）

在 `</el-table-column>`（结转至当年及以后营收组的闭合标签，L173）与 `<el-table-column label="本年度计划营收">`（L175）之间插入：

```html
<!-- 当月计划营收 -->
<el-table-column label="当月计划营收">
  <el-table-column label="结转在建项目" prop="monthlyPlanConstruction" width="130" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyPlanConstruction) }}</template>
  </el-table-column>
  <el-table-column label="完工待结算项目" prop="monthlyPlanCompleted" width="130" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyPlanCompleted) }}</template>
  </el-table-column>
  <el-table-column label="新接项目" prop="monthlyPlanNew" width="120" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyPlanNew) }}</template>
  </el-table-column>
  <el-table-column label="当月计划营收-合计" prop="monthlyPlanTotal" width="160" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyPlanTotal) }}</template>
  </el-table-column>
</el-table-column>

<!-- 当月完成营收 -->
<el-table-column label="当月完成营收">
  <el-table-column label="结转在建项目" prop="monthlyActualConstruction" width="130" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyActualConstruction) }}</template>
  </el-table-column>
  <el-table-column label="完工待结算项目" prop="monthlyActualCompleted" width="130" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyActualCompleted) }}</template>
  </el-table-column>
  <el-table-column label="新接项目" prop="monthlyActualNew" width="120" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyActualNew) }}</template>
  </el-table-column>
  <el-table-column label="当月完成营收-合计" prop="monthlyActualTotal" width="160" align="right">
    <template #default="scope">{{ formatNumber(scope.row.monthlyActualTotal) }}</template>
  </el-table-column>
</el-table-column>
```

### 修改 2：rawData 补充字段（L562 起，8 条记录）

每条记录增加 8 个字段（值按合理比例生成，单位万元）：

```javascript
// 示例（第1条记录 管网事业部）：
monthlyPlanConstruction: 500,       // 当月计划-结转在建
monthlyPlanCompleted: 250,          // 当月计划-完工待结算
monthlyPlanNew: 420,                // 当月计划-新接
// monthlyPlanTotal 由计算得出 = 1170

monthlyActualConstruction: 480,     // 当月完成-结转在建
monthlyActualCompleted: 230,        // 当月完成-完工待结算
monthlyActualNew: 400,              // 当月完成-新接
// monthlyActualTotal 由计算得出 = 1110
```

其余 7 条记录类似，数值根据各事业部规模按比例递减。

### 修改 3：calculateDerivedFields 计算合计（L778-L798）

在现有计算逻辑后追加：

```javascript
result.monthlyPlanTotal = item.monthlyPlanConstruction + item.monthlyPlanCompleted + item.monthlyPlanNew
result.monthlyActualTotal = item.monthlyActualConstruction + item.monthlyActualCompleted + item.monthlyActualNew
```

### 修改 4：calculateTotalsForFiltered 合计行（L806-L852）

初始化对象中增加 8 个字段初始值为 0，forEach 中追加求和：

```javascript
totals.monthlyPlanConstruction += item.monthlyPlanConstruction
totals.monthlyPlanCompleted += item.monthlyPlanCompleted
totals.monthlyPlanNew += item.monthlyPlanNew
totals.monthlyPlanTotal += item.monthlyPlanTotal
totals.monthlyActualConstruction += item.monthlyActualConstruction
totals.monthlyActualCompleted += item.monthlyActualCompleted
totals.monthlyActualNew += item.monthlyActualNew
totals.monthlyActualTotal += item.monthlyActualTotal
```

### 修改 5：固定底部合计行（L299-L318）

在 `carryForwardTotal` 单元格（L307）与 `planConstruction` 单元格（L308）之间插入 8 个新的 `<td>` 单元格：

```html
<td>...formatNumber(constructionTotals.monthlyPlanConstruction)</td>
<td>...formatNumber(constructionTotals.monthlyPlanCompleted)</td>
<td>...formatNumber(constructionTotals.monthlyPlanNew)</td>
<td>...formatNumber(constructionTotals.monthlyPlanTotal)</td>
<td>...formatNumber(constructionTotals.monthlyActualConstruction)</td>
<td>...formatNumber(constructionTotals.monthlyActualCompleted)</td>
<td>...formatNumber(constructionTotals.monthlyActualNew)</td>
<td>...formatNumber(constructionTotals.monthlyActualTotal)</td>
```

## 验证

1. 施工类总营收 tab 表头正确显示两个新列组及其子列
2. 表格数据行有值显示
3. 底部固定合计行包含新列的合计值
4. 基层单位筛选功能正常
5. 无诊断错误

