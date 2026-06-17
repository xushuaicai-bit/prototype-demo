# 修复当月偏差项目表表头缺少"月"字

## 原因

| 项目 | 当前值 | 应该是 |
|------|--------|--------|
| `monthOptions` 的 value | `'1月'`, `'2月'`, ... `'12月'` ✅ | — |
| **`deviationMonth` 默认值** | **`ref('8')`** ❌ | `ref('8月')` |
| 列标题拼接 | `` `${deviationMonth}营收偏差` `` → 显示 **"8营收偏差"** ❌ | "8月营收偏差" |

**根因**：`deviationMonth` 默认值设为 `'8'` 而不是 `'8月'`，与 monthOptions 的 value 格式不一致。

## 修复

**文件**: [RevenueDeviation.vue](src/components/revenue/RevenueDeviation.vue) 第746行

```javascript
// 改前
const deviationMonth = ref('8')

// 改后
const deviationMonth = ref('8月')
```

同时检查 `quarterlyMonth`（第748行），确保一致：
- 当前为 `''`（空），无需改（空值时表头会显示"营收偏差"，可接受）

## 验证
页面加载 → 表头应显示 "8月计划营收"、"8月完成营收"、"8月营收完成率"、"8月营收偏差"、"8月营收偏差原因"
