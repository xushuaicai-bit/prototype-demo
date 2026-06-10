# 图表自适应优化计划

## 一、需求概述

对 `RevenueDashboard.vue` 中两个图表进行自适应修复：

1. **营收月度统计**: 横轴/图例重叠、纵轴文字被截断
2. **当年累计完成营收情况**: 横轴/图例重叠、纵轴文字被截断（含斜排标签）
3. **当年累计完成营收情况**: 底部统计文字从模块最底部移到标题下方

## 二、当前状态分析

### 图表1：营收月度统计（L582-L620）

| 属性          | 当前值                | 问题                 |
| ----------- | ------------------ | ------------------ |
| 容器高度        | `h-64`(256px)      | 偏小                 |
| grid.left   | `'3%'`             | 纵轴名称"万元"可能被吞       |
| grid.right  | `'8%'`             | 右侧Y轴"%"可能不够        |
| grid.bottom | `'15%'`            | 4项图例+横轴标签空间不足，图例串行 |
| grid.top    | `'10%'`            | —                  |
| legend      | `bottom: 0`, 4个图例项 | 与横轴重叠              |
| yAxis       | 左"万元"+右"%"双轴       | 名称文字被截断            |

### 图表2：当年累计完成营收情况（L628-L688）

| 属性                     | 当前值                | 问题              |
| ---------------------- | ------------------ | --------------- |
| 容器高度                   | `h-72`(288px)      | 偏小              |
| grid.left              | `'3%'`             | "累计营收(万元)"长名称被吞 |
| grid.right             | `'4%'`             | "项目数量"被吞        |
| grid.bottom            | `'18%'`            | 斜排40°+图例仍重叠     |
| xAxis.axisLabel.rotate | `40`               | 斜排后需要更多底部空间     |
| legend                 | `bottom: 0`, 2个图例项 | 与斜排横轴重叠         |

### 文字位置（L314-L326）

当前结构：

```
<div> 标题 </div>
<div ref="sectorChartRef"> 图表 </div>
<div> 统计文字(在底部) </div>   ← 需要移到标题下方
```

目标结构：

```
<div> 标题 </div>
<div> 统计文字(紧贴标题下方) </div>
<div ref="sectorChartRef"> 图表 </div>
```

## 三、具体改动清单

### 改动1: 营收月度统计图表自适应

**文件**: [RevenueDashboard.vue](src/views/RevenueDashboard.vue)

**1a. 增加容器高度**

* L311: `class="h-64"` → **`class="h-80"`**（256px→320px）

**1b. 调整grid边距**（L608）

```javascript
// 当前
grid: { left: '3%', right: '8%', bottom: '15%', top: '10%', containLabel: true }
// 改为
grid: { left: '8%', right: '12%', bottom: '18%', top: '8%', containLabel: true }
```

* left 3%→8%：给左侧Y轴名称"万元"留足空间

* right 8%→12%：给右侧Y轴"%"留足空间

* bottom 15%→18%：4项图例不与横轴重叠

**1c. 优化legend**（L607）

```javascript
// 当前
legend: { data: [...], bottom: 0 }
// 改为
legend: { data: [...], bottom: 2, itemWidth: 14, itemHeight: 10, textStyle: { fontSize: 11 }, icon: 'roundRect' }
```

缩小图例尺寸避免溢出。

***

### 改动2: 当年累计完成营收情况图表自适应

**2a. 调整grid边距**（L670）

```javascript
// 当前
grid: { left: '3%', right: '4%', bottom: '18%', top: '10%', containLabel: true }
// 改为
grid: { left: '10%', right: '10%', bottom: '24%', top: '5%', containLabel: true }
```

* left 3%→10%："累计营收(万元)"较长名称不被截断

* right 4%→10%：右侧"项目数量"不被截断

* bottom 18%→24%：斜排40°的8个类别名+图例需要更多底部空间

**2b. 优化xAxis斜排标签**（L674-678）

```javascript
// 当前
axisLabel: { interval: 0, rotate: 40, fontSize: 11 }
// 改为
axisLabel: {
  interval: 0,
  rotate: 35,
  fontSize: 10,
  margin: 10
}
```

减小旋转角度和字号，增加margin避免贴边。

**2c. 优化legend**（L669）

```javascript
// 当前
legend: { data: ['累计营收', '项目数量'], bottom: 0 }
// 改为
legend: { data: ['累计营收', '项目数量'], bottom: 2, itemWidth: 14, itemHeight: 10, textStyle: { fontSize: 11 } }
```

***

### 改动3: 统计文字位置移动

**位置**: [RevenueDashboard.vue#L314-L326](src/views/RevenueDashboard.vue#L314-L326)

将统计文字div从图表下方移到标题和图表之间：

```html
<!-- 原来 -->
<div class="bg-white rounded-xl p-4 shadow-sm">
  <h3>当年累计完成营收情况</h3>
  <div ref="sectorChartRef" ...></div>
  <div class="mt-2 text-center...">共 XX 个项目...</div>  <!-- 在底部 -->
</div>

<!-- 改为 -->
<div class="bg-white rounded-xl p-4 shadow-sm">
  <h3 class="text-sm font-semibold text-gray-800 mb-1">当年累计完成营收情况</h3>
  <div class="text-center text-xs text-gray-500 mb-2">    <!-- 移到标题下 -->
    共 <span class="font-bold text-gray-700">{{ totalProjects }}</span> 个项目，
    累计营收 <span class="font-bold text-blue-600">{{ totalRevenue.toLocaleString() }}</span> 万元
  </div>
  <div ref="sectorChartRef" ...></div>                        <!-- 图表紧跟其后 -->
</div>
```

## 四、假设与决策

1. 仅修改 ECharts 的 grid/legend/axisLabel 配置参数，不改变数据或交互逻辑
2. 文字行样式从 `text-sm mt-2` 改为 `text-xs mb-2`（更紧凑，紧贴标题）
3. 不引入新的依赖或组件

## 五、验证步骤

开发服务器已在 <http://localhost:5173/> 运行，刷新后验证：

* [ ] 营收月度统计：4项图例不与横轴重叠、左右Y轴名称完整显示

* [ ] 当年累计完成营收情况：8个斜排标签完整显示不重叠、图例清晰、双Y轴名称可见

* [ ] 统计文字行出现在标题正下方、图表上方

