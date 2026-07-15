# 修复"项目板块业务财务信息汇总"表前4列固定列表头不显示

## 问题根因

通过浏览器 DOM 检查发现两个问题：

### 问题1：固定列表头白底白字（不可见）
- 前4列使用 `fixed="left"`，Element Plus 给这些列的 `th` 添加了 `el-table-fixed-column--left` 类
- Element Plus 内部为该类设置了 `background-color: #fff`（白色背景），覆盖了我们的 CSS `:deep(.el-table th) { background-color: #4a6fa5; }`
- 但 `color: #fff`（白色文字）仍然生效 → **白底白字 = 完全不可见**
- 非固定列表头正常显示蓝底白字（`rgb(74, 111, 165)` = `#4a6fa5`）

### 问题2：表格容器 overflow:hidden 阻止水平滚动
- `.table-container` 设置了 `overflow: hidden`，宽度仅 254px
- 导致 el-table 的 body-wrapper 的 `overflow-x` 也变成 `hidden`
- 表格内容 3320px 宽，但无法水平滚动

### 参考实现
RevenueDeviation.vue 有6个 `fixed="left"` 列且正常工作，关键区别：
- 使用 `:header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"` **内联样式**（优先级高于 Element Plus 内部 CSS）
- 不设置 `overflow: hidden` 在表格容器上

## 修复方案

### 文件：`e:\trae_demo_env\营收看板\src\components\fund\SectorBusinessFinanceSummary.vue`

#### 1. 在 el-table 上添加 header-cell-style 内联样式
在 el-table 标签上添加：
```html
:header-cell-style="{ backgroundColor: '#4a6fa5', color: '#fff', fontWeight: 'bold', fontSize: '12px' }"
```
内联样式优先级最高，能覆盖 Element Plus 对 `.el-table-fixed-column--left` 设置的白色背景。

#### 2. 修改 .table-container CSS
将 `overflow: hidden` 改为 `overflow: visible`，让 Element Plus 自行管理滚动：
```css
.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: visible;
}
```

#### 3. 删除不再需要的 CSS 规则
删除 `:deep(.el-table th)` 规则（header-cell-style 内联样式已替代它），保留 td 和 footer 的样式。

### 文件：`e:\trae_demo_env\营收看板\src\components\fund\OutputProjectSummary.vue`

同样应用修复1和修复2，保持一致性。

## 验证步骤

1. 确认开发服务器运行中（http://localhost:5173/）
2. 导航到 资金管理 → 项目板块业务财务信息汇总
3. 验证前4列表头（城市环境一级分类、城市环境二级分类、城市环境三级分类、项目类型）以蓝底白字显示
4. 验证表格可水平滚动，滚动时前4列固定在左侧
5. 对"销项项目汇总"做同样验证
