# 营收明细表-是否协管项目列改为文字显示

## 需求

将营收明细表中"是否协管项目"列的展示方式从 **el-switch 开关按钮** 改为 **纯文字**（"是"/"否"）。

## 当前实现（需修改）

**文件**: `e:\trae_demo_env\营收看板\src\components\revenue\RevenueDetail.vue`
**位置**: 第 191-202 行

```html
<el-table-column
  label="是否协管项目"
  prop="isCoManaged"
  width="120"
  align="center"
  :header-cell-style="{ backgroundColor: '#95DE64', color: '#fff' }"
  :cell-style="{ backgroundColor: '#F6FFED' }"
>
  <template #default="scope">
    <el-switch :value="scope.row.isCoManaged === '是'" disabled />
  </template>
</el-table-column>
```

## 修改方案

将 `<el-switch>` 替换为直接文本输出，保留绿色背景样式：

```html
<el-table-column
  label="是否协管项目"
  prop="isCoManaged"
  width="100"
  align="center"
  :header-cell-style="{ backgroundColor: '#95DE64', color: '#fff' }"
  :cell-style="{ backgroundColor: '#F6FFED' }"
>
  <template #default="scope">
    {{ scope.row.isCoManaged }}
  </template>
</el-table-column>
```

### 变更点
1. `width` 从 `120` 调整为 `100`（文字比开关窄）
2. `<el-switch :value="scope.row.isCoManaged === '是'" disabled />` → `{{ scope.row.isCoManaged }}`
3. 其他样式保持不变（绿色表头 + 浅绿单元格背景）

## 涉及文件

仅修改一个文件：[RevenueDetail.vue](file:///e:/trae_demo_env/营收看板/src/components/revenue/RevenueDetail.vue) 第 200 行

## 验证

修改后刷新页面，确认"是否协管项目"列显示为纯文字"是"或"否"，无开关控件。
