# 生产看板模块调整与修复计划

## 需求分析

### 1. 问题修复
- **风险预警及时性模块缺失**：当前Dashboard中缺少该模块，需要恢复显示

### 2. 布局调整
- **第一排**：仅显示5个项目统计模块（待建、在建、停工、完工、当年竣工）
- **第二排**：管理提示及时性 | 风险预警及时性 | 生产风险模块（3列）
- **其他模块**：位置保持不变

## 目标布局

```
第一排：项目统计卡片（5个）- 待建、在建、停工、完工、当年竣工
第二排：管理提示及时性（4列）| 风险预警及时性（4列）| 生产风险情况（4列）
第三排：生产进度（4列）| 重点项目进度（4列）| 巡检情况（4列）
第四排：证件办理（12列）
```

## 实施步骤

### 1. 创建 RiskTimelinessDisplay.vue 组件
- 文件：`src/components/dashboard/RiskTimelinessDisplay.vue`
- 封装风险预警及时性模块的展示逻辑
- 显示8个数据项：当年一二级风险、当前进入风险、当年完成风险等

### 2. 更新 Dashboard.vue 布局
- 文件：`src/views/Dashboard.vue`
- **第一排（col-span-12）**：5个统计卡片（各占2.4列，col-span-5）
- **第二排（col-span-12）**：
  - col-span-4：管理提示及时性
  - col-span-4：风险预警及时性
  - col-span-4：生产风险情况
- **第三排**：生产进度、重点项目进度、巡检情况（各4列）
- **第四排**：证件办理（12列）

### 3. 组件引用更新
- 导入并使用新的RiskTimelinessDisplay组件
- 确保所有props正确传递

## Mock数据结构

```javascript
export const riskAlertTimeliness = [
  { title: '当年一、二级风险数量', value: '2个' },
  { title: '当前进入风险数量', value: '2个' },
  { title: '当年完成风险数量', value: '2个' },
  { title: '当年剩余风险数量', value: '2个' },
  { title: '未来两周进入风险数量', value: '2个' },
  { title: 'I级未来两周进入风险数量', value: '2个' },
  { title: 'II级未来两周进入风险数量', value: '2个' },
  { title: 'III级未来两周进入风险数量', value: '2个' }
]
```

## 风险预警及时性组件设计

```vue
<template>
  <div class="bg-white rounded-xl p-3 shadow-sm h-full">
    <div class="flex items-center mb-3">
      <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
      <h3 class="text-sm font-semibold text-gray-800">风险预警及时性</h3>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="item in timelinessData" class="...">
        <span>{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
```
