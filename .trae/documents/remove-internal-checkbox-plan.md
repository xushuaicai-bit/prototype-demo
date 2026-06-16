# 去除 ProductionProgress 内部 checkbox，统一到全局切换

## 摘要

[ProductionProgress.vue](src/components/dashboard/ProductionProgress.vue) 内部有一个「仅查看重点项目」checkbox，与 UnifiedDashboard.vue 右上角的「仅看产运重点项目」功能重复。需要：
1. 删除组件内部的 checkbox + `showKeyProjects` ref + 3个 computed
2. 改为接收外部传入的 `keyProjectMode` prop（由父组件的 `showKeyProjectsOnly` 驱动）
3. 父组件传 prop 时逻辑不变（已实现）

## 当前状态

**ProductionProgress.vue** (119行):
- 第8-9行：内部 checkbox (`v-model="showKeyProjects"`)
- 第88行：`const showKeyProjects = ref(false)`
- 第90-96行：`regularData` computed
- 第98-104行：`keyProjectData` computed
- 第106-108行：`currentData` computed（根据 showKeyProjects 切换）
- 第5行：标题条件渲染 `showKeyProjects ? '重点项目...' : '生产进度情况'`
- 第56行：`v-if="showKeyProjects"` 控制底部两卡片显示

**UnifiedDashboard.vue** 已有:
- `showKeyProjectsOnly` ref（第1119行）
- `displayKeyProjectProgress` computed（第1148行）— 已将 keyProjectOnlyKeyProjectProgress 数据作为 props 传入

## 改动方案

### 文件1: ProductionProgress.vue

#### 删除内容:
1. ~~第7-10行~~ — 整个 checkbox div（含 input + label）
2. ~~第88行~~ — `const showKeyProjects = ref(false)`
3. ~~第90-108行~~ — `regularData`、`keyProjectData`、`currentData` 三个 computed

#### 新增/修改:

**新增 prop**:
```javascript
// 在 defineProps 中追加
keyProjectMode: { type: Boolean, default: false }
```

**替换 currentData 为直接 computed**（基于新 prop）:
```javascript
const currentData = computed(() => {
  if (props.keyProjectMode) {
    return {
      milestoneTitle: props.keyProjectMilestoneTitle || '重点管控里程碑节点',
      milestoneTotal: props.keyProjectMilestoneTotal || props.milestoneTotal,
      completedCount: props.keyProjectCompletedCount || props.completedCount,
      completedTotal: props.keyProjectCompletedTotal || props.completedTotal,
      alerts: props.keyProjectAlerts || props.alerts
    }
  }
  return {
    milestoneTitle: props.milestoneTitle,
    milestoneTotal: props.milestoneTotal,
    completedCount: props.completedCount,
    completedTotal: props.completedTotal,
    alerts: props.alerts
  }
})
```

**模板改动**:
- 第5行: `{{ showKeyProjects ? ... }}` → `{{ keyProjectMode ? ... }}`
- 第56行: `v-if="showKeyProjects"` → `v-if="keyProjectMode"`

### 文件2: UnifiedDashboard.vue

在 ProductionProgress 组件标签上追加 prop:
```html
<ProductionProgress
  :key-project-mode="showKeyProjectsOnly"
  <!-- 其余 props 不变 -->
/>
```

## 验证
1. 默认状态 → 显示"生产进度情况"，无 checkbox，数据为常规值
2. 点击右上角「仅看产运重点项目」→ 标题变"重点项目生产进度情况"，数据切换，底部出现重点项目数/未上报数
3. ProductionProgress 组件内不再有任何 checkbox
