# 营收明细表数据补全计划

## 问题分析

**文件**: `e:\trae_demo_env\营收看板\src\components\revenue\RevenueDetail.vue`

当前 rawData 有 **35 条记录**，但每条记录都 **缺少以下 5 个字段**，导致表格对应列显示为空：

| 缺失字段 | 表头列名 | 说明 |
|---------|---------|------|
| `annualPlanRevenue` | 当年计划营收 | 数字，单位元 |
| `annualEstimatedRevenue` | 当年预计完成营收 | 数字，单位元 |
| `planAdjustmentRate` | 计划较上期调整(%) | 百分比数字 |
| `monthActualRevenue` | 当月完成营收 | 数字，单位元 |
| `startAccumulatedRevenue` | 开工累计营收 | 数字，单位元 |

## 修改方案

**操作**: 替换整个 `rawData` 数组（第 397-1553 行），为每条记录补全所有 21 个界面显示字段所需的值。

### 字段生成规则（基于已有字段的合理推算）

对已有字段的利用：
- `contractAmount` → 推算 annualPlanRevenue
- `annualAccumulatedRevenue` → 推算 annualEstimatedRevenue, startAccumulatedRevenue
- `status` + `progress` → 调整各字段合理性
- `startTime` → 判断项目新老程度
- `month1-month12` → 取当月值作为 monthActualRevenue

### 各字段取值逻辑

1. **annualPlanRevenue（当年计划营收）**
   - 在建项目：`Math.round(contractAmount * 0.45 ~ 0.65)`
   - 完工/待结算：接近 annualAccumulatedRevenue（略高或相等）
   - 已结算：= annualAccumulatedRevenue

2. **annualEstimatedRevenue（当年预计完成营收）**
   - 在建：`Math.round(annualAccumulatedRevenue * 1.15 ~ 1.35)`
   - 完工：`= annualAccumulatedRevenue`
   - 待结算：`annualAccumulatedRevenue × 1.02~1.05`

3. **planAdjustmentRate（计划较上期调整%）**
   - 范围 `-5.0 ~ +8.0`，大部分 `-2.0 ~ +5.0`
   - 完工/已结算：`0`
   - 新增立项项目：偏正值较多（新项目上调）

4. **monthActualRevenue（当月完成营收）**
   - 当前月份为 6 月，取 `month6` 的值或按比例估算
   - 对于 month6=0 的记录：`Math.round(annualAccumulatedRevenue / 6)`

5. **startAccumulatedRevenue（开工累计营收）**
   - 必须 >= annualAccumulatedRevenue
   - 2022 年开工老项目：`annualAccumulatedRevenue × 1.8 ~ 2.5`
   - 2023 年开工：`× 1.4 ~ 1.8`
   - 2024 年开工新项目：`× 1.0 ~ 1.2`

### 数据一致性约束

- `startAccumulatedRevenue >= annualAccumulatedRevenue` （开工累计 >= 当年累计）
- `remainingContractAmount = contractAmount - startAccumulatedRevenue` （剩余 ≈ 合同 - 累计）
- `annualEstimatedRevenue >= annualAccumulatedRevenue` （预计 >= 已完成）
- `progress` 与 `startAccumulatedRevenue / contractAmount` 大致匹配

## 涉及修改

仅修改一个文件的 rawData 数组区域：`RevenueDetail.vue` 第 397-1553 行

## 验证

修改后检查表格每列均有合理数值显示，无 undefined/空值。
