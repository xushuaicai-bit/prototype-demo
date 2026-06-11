# 环形图加大 + 生产风险文字放大

## 一、改动1：ManagementTimelines.vue 环形图加大

**文件**: `src/components/dashboard/ManagementTimelines.vue`

两个环形图容器当前都是 `min-h-[90px]`，统一增大到 **`min-h-[120px]`**：

| 位置 | 行号 | 当前 | 目标 |
|------|------|------|------|
| 登记环形图 | 第19行 | `min-h-[90px]` | **`min-h-[120px]`** |
| 筹划环形图 | 第54行 | `min-h-[90px]` | **`min-h-[120px]`** |

## 二、改动2：ProductionRiskSituation.vue 文字放大

**文件**: `src/components/dashboard/ProductionRiskSituation.vue`

### I级风险框（第37-47行）
| 元素 | 当前 | 目标 |
|------|------|------|
| I级名称 | `text-xs` (12px) | **`text-sm`** (14px) |
| 数量 | `text-sm` (14px) | **`text-base`** (16px) |
| 完成数 | `text-xs` (12px) | **`text-sm`** (14px) |

### II/III级框（第53-63行）
| 元素 | 当前 | 目标 |
|------|------|------|
| II/III名称 | `text-xs` (12px) | **`text-sm`** (14px) |
| 数量 | `text-sm` (14px) | **`text-base`** (16px) |
| 完成数 | `text-xs` (12px) | **`text-sm`** (14px) |
