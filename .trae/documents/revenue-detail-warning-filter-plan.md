# 营收明细表 — 预警等级筛选器补全计划

## 一、需求概述

营收明细表的预警等级筛选器缺少"正常"选项，且选项顺序需调整为：**红色预警、黄色预警、橙色预警、正常**

## 二、当前状态分析

### 文件: [RevenueDetail.vue](src/components/revenue/RevenueDetail.vue)

| 位置 | 当前状态 | 问题 |
|------|---------|------|
| **筛选器 L86-91** | `el-option`: 全部 / 黄色预警(yellow) / 橙色预警(orange) / 红色预警(red) | 缺少"正常"选项，顺序为黄→橙→红 |
| **表格列 L361-370** | 已支持4种显示: 红色预警(el-tag danger) / 橙色预警(el-tag warning) / 黄色预警(自定义) / 正常(text-gray) | 显示逻辑正确，无需改 |
| **数据计算 L1775-1786** | 只产生红/橙/黄三种，无预警时warningLevel为空字符串'' | 数据层正确 |

## 三、具体改动

### 改动: 预警等级筛选器增加"正常" + 调整顺序 (L86-91)

将：
```html
<el-option label="全部" value="" />
<el-option label="黄色预警" value="yellow" />
<el-option label="橙色预警" value="orange" />
<el-option label="红色预警" value="red" />
```

改为：
```html
<el-option label="全部" value="" />
<el-option label="红色预警" value="red" />
<el-option label="黄色预警" value="yellow" />
<el-option label="橙色预警" value="orange" />
<el-option label="正常" value="normal" />
```

### 同步修改过滤逻辑 (L1846-1850)

在过滤条件中增加 `normal` 的判断：

将：
```javascript
if (filters.value.warningLevel === 'yellow') return item.warningLevel === '黄色预警'
if (filters.value.warningLevel === 'orange') return item.warningLevel === '橙色预警'
if (filters.value.warningLevel === 'red') return item.warningLevel === '红色预警'
```

改为：
```javascript
if (filters.value.warningLevel === 'red') return item.warningLevel === '红色预警'
if (filters.value.warningLevel === 'yellow') return item.warningLevel === '黄色预警'
if (filters.value.warningLevel === 'orange') return item.warningLevel === '橙色预警'
if (filters.value.warningLevel === 'normal') return !item.warningLevel || item.warningLevel === ''
```

## 四、验证步骤

- [ ] 营收报表 → 营收明细表 → 预警等级下拉框显示：全部/红色预警/黄色预警/橙色预警/正常
- [ ] 选择"正常"后只显示无预警的项目
