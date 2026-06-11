# 重点项目生产进度交互优化计划

## 需求分析

优化"重点项目生产进度情况"模块的交互方式：
1. 在"生产进度情况"模块添加"仅查看重点项目"勾选选项
2. 勾选时显示"重点项目生产进度情况"内容
3. 取消勾选时显示"生产进度情况"内容
4. 模块显示顺序：生产进度（含勾选）→ 证件办理 → 巡检情况
5. 第三排布局，三个模块均分

## 当前状态

- ProductionProgress.vue：生产进度情况
- KeyProjectProgress.vue：重点项目生产进度情况
- 两个组件独立存在

## 实施步骤

### 1. 更新 ProductionProgress.vue
- 文件：`src/components/dashboard/ProductionProgress.vue`
- 添加"仅查看重点项目"勾选框
- 添加v-model绑定，控制显示状态
- 条件渲染：根据勾选状态显示对应内容

### 2. 更新 Dashboard.vue 布局
- 文件：`src/views/Dashboard.vue`
- 第三排：生产进度（含勾选）| 证件办理 | 巡检情况
- 三个模块均分（各占4列）

### 3. 数据传递
- 传递KeyProjectProgress的props给ProductionProgress组件
- 通过showKeyProjects状态控制显示

## 组件结构调整

### ProductionProgress.vue 新结构

```vue
<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">
        {{ showKeyProjects ? '重点项目生产进度情况' : '生产进度情况' }}
      </h3>
      <div class="flex items-center">
        <input type="checkbox" v-model="showKeyProjects" />
        <span class="text-sm text-gray-600 ml-1">仅查看重点项目</span>
      </div>
    </div>
    
    <!-- 根据勾选状态显示不同内容 -->
    <div v-if="!showKeyProjects">
      <!-- 生产进度情况内容 -->
    </div>
    <div v-else>
      <!-- 重点项目生产进度情况内容 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showKeyProjects = ref(false)
</script>
```

## 布局调整

```html
<div class="grid grid-cols-12 gap-3">
  <!-- 第二排 -->
  <div class="col-span-4">管理提示及时性</div>
  <div class="col-span-4">风险预警及时性</div>
  <div class="col-span-4">生产风险情况</div>
  
  <!-- 第三排 -->
  <div class="col-span-4">生产进度（含勾选开关）</div>
  <div class="col-span-4">证件办理</div>
  <div class="col-span-4">巡检情况</div>
</div>
```
