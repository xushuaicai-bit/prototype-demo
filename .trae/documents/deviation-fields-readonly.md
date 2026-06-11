# 偏差项目表字段改为只读回显

## 概述
将偏差项目表中3个字段从可编辑状态改为直接回显（只读）：
1. 8月营收偏差原因（`deviationReason`）
2. 计划采取措施及节点（`correctiveMeasures`）
3. 纠偏完成情况（`correctiveStatus`）

## 修改文件
`e:\trae_demo_env\营收看板\src\components\revenue\RevenueDeviation.vue`

## 具体变更

### 当月偏差项目表（3处）

1. **`deviationReason` 列**（第297-318行）：移除双击编辑交互和 `el-textarea`，改为纯文本回显
2. **`correctiveMeasures` 列**（第320-341行）：移除双击编辑交互和 `el-textarea`，改为纯文本回显
3. **`correctiveStatus` 列**（第343-361行）：移除 `el-select` 下拉选择，改为 `el-tag` 标签回显

### 季度偏差表（3处，同样改法）

1. **`deviationReason` 列**（第643-663行）：移除双击编辑交互和 `el-textarea`，改为纯文本回显
2. **`correctiveMeasures` 列**（第665-686行）：移除双击编辑交互和 `el-textarea`，改为纯文本回显
3. **`correctiveStatus` 列**（第688-706行）：移除 `el-select` 下拉选择，改为 `el-tag` 标签回显

### 纠偏完成情况 tag 样式映射
- 未开始 → type="info"
- 纠偏中 → type="warning"
- 已完成 → type="success"

## 验证
- 打开偏差项目表，确认3个字段为只读文本/标签，不可编辑
- 季度偏差表同样确认
