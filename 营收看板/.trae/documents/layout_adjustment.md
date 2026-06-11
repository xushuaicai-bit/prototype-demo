# 生产看板布局调整计划

## 需求分析

调整看板布局结构：
1. **管理提示及时性** 移到第二排
2. 与**生产风险情况**并列显示
3. **生产风险情况**模块内部调整为上下分布：
   - 上部分：风险开工令预警
   - 下部分：生产风险情况（按等级）

## 当前布局

```
第一排：项目统计卡片（5个）
第二排：管理提示及时性 | 风险预警及时性 + 风险开工令预警 + 生产风险情况（按等级）
第三排：生产进度 + 重点项目进度 + 证件办理 + 巡检情况
```

## 目标布局

```
第一排：项目统计卡片（5个）
第二排：管理提示及时性 | 生产风险情况
                         ├ 风险开工令预警
                         └ 生产风险情况（按等级）
第三排：生产进度 + 重点项目进度 + 证件办理 + 巡检情况
```

## 实施步骤

### 1. 更新 ProductionRiskSituation.vue 组件
- 文件：`src/components/dashboard/ProductionRiskSituation.vue`
- **修改布局**：从三列改为上下两部分的布局
  - 上部分：风险开工令预警（横向排列的红橙黄预警）
  - 下部分：生产风险情况（按等级）- I/II/III级风险统计
- 保留年月选择器
- 调整各部分的尺寸和样式

### 2. 更新 Dashboard.vue
- 文件：`src/views/Dashboard.vue`
- 调整grid布局
- 第一排：col-span-5 项目统计 + col-span-7 管理提示及时性
- 第二排：col-span-12 生产风险情况（整合后占整行）
- 后续排：生产进度、重点项目进度、证件办理、巡检情况

## 组件结构调整

### ProductionRiskSituation.vue 新结构

```vue
<div class="bg-white rounded-xl p-4 shadow-sm">
  <!-- 顶部：标题 + 时间选择器 -->
  <div class="flex items-center justify-between mb-4">
    <h3>生产风险情况</h3>
    <el-date-picker ... />
  </div>
  
  <!-- 风险开工令预警（横向排列） -->
  <div class="mb-3 p-3 bg-gray-50 rounded-lg">
    <div class="flex items-center justify-around">
      <!-- 红橙黄预警圆点 -->
    </div>
  </div>
  
  <!-- 生产风险情况（按等级） -->
  <div class="p-3">
    <!-- I/II/III级风险统计 -->
  </div>
</div>
```

## 布局Grid设置

```html
<div class="grid grid-cols-12 gap-3">
  <!-- 第一排 -->
  <div class="col-span-5">项目统计（5个卡片）</div>
  <div class="col-span-7">管理提示及时性</div>
  
  <!-- 第二排 -->
  <div class="col-span-12">生产风险情况</div>
  
  <!-- 第三排 -->
  <div class="col-span-3">生产进度</div>
  <div class="col-span-3">重点项目进度</div>
  <div class="col-span-3">证件办理</div>
  <div class="col-span-3">巡检情况</div>
</div>
```
