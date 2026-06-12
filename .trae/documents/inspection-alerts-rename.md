# 巡查情况：预警标签改名 + 特建→待建

## 改动1: InspectionStatus.vue — 三色预警标签

**文件**: `src/components/dashboard/InspectionStatus.vue` 第25-34行

当前3个卡片全部显示"红色预警"（红色背景），改为：

| 序号 | 标签文字 | 背景色 | 数值颜色 |
|------|---------|--------|---------|
| 1 | 开单红色预警 | `bg-red-50` | `text-red-600` |
| 2 | 开单橙色预警 | `bg-orange-50` | `text-orange-600` |
| 3 | 开单黄色预警 | `bg-yellow-50` | `text-yellow-600` |

数据源仍使用 `redAlerts` 数组（不改props），仅改模板中的颜色和文字。

## 改动2: mockData.js — 特建→待建

**文件**: `src/data/mockData.js` 第2行
- `'特建'` → **`'待建'`**
