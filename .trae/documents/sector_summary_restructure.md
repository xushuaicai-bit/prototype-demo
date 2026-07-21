# 按项目板块汇总表 — 重构数据结构（按三级分类分组）

## 背景

用户反馈当前"按项目板块汇总表"的数据结构不符合预期。当前按 **项目类型** 分组（2025年以前项目/新接/销项），用户要求改为按 **三级分类** 分组，每个三级分类对应 3 个项目类型行 + 1 个小计行。

## 当前结构（按项目类型分组）

```
2025年以前项目组
  ├─ 水务/城镇水务/供水/2025年以前项目
  ├─ 水务/城镇水务/排水/2025年以前项目
  ├─ 水务/城镇水务/雨水/2025年以前项目
  ├─ 水务/水处理/生活污水处理/2025年以前项目
  └─ ... (所有 category1/2/3 组合)
  └─ 小计行: "2025年以前项目 - 小计"
2025年新接项目组
  └─ ... (同上)
  └─ 小计行: "2025年新接项目 - 小计"
2025年销项项目组
  └─ ... (同上)
  └─ 小计行: "2025年销项项目 - 小计"
```

- 3 个小计行（每个项目类型 1 个）
- 一级分类合并 51 处、二级合并 27 处、三级分类无合并（每组仅 1 行）

## 期望结构（按三级分类分组）

```
水务/城镇水务/供水 组
  ├─ 2025年以前项目
  ├─ 2025年新接项目
  ├─ 2025年销项项目
  └─ 小计（3 个项目类型之和）
水务/城镇水务/排水 组
  ├─ 2025年以前项目
  ├─ 2025年新接项目
  ├─ 2025年销项项目
  └─ 小计
水务/城镇水务/雨水 组
  └─ ...
水务/水处理/生活污水处理 组
  └─ ...
水环境治理/... 组
  └─ ...
```

- 每个三级分类 4 行（3 项目类型 + 1 小计）
- 约 41 个三级分类组 → ~164 行数据
- 一级/二级/三级分类各自合并单元格（三级分类跨 4 行合并，包含小计行）
- 小计行 projectType 列显示"小计"

## 文件修改

目标文件：`e:\trae_demo_env\营收看板\src\components\fund\SectorBusinessFinanceSummary.vue`

### 修改 1：重构 `sortedFlatData` computed（L530-L559）

将按 projectType 分组改为按 category1+category2+category3 分组：

```js
const sortedFlatData = computed(() => {
  const result = []
  const sorted = sortFlat(flatTableData.value)

  // 按 category1+category2+category3 分组，保持原始顺序（使用 Map 保留插入顺序）
  const c3Groups = new Map()
  sorted.forEach(item => {
    const key = `${item.category1}|${item.category2}|${item.category3}`
    if (!c3Groups.has(key)) {
      c3Groups.set(key, {
        category1: item.category1,
        category2: item.category2,
        category3: item.category3,
        items: []
      })
    }
    c3Groups.get(key).items.push(item)
  })

  // 遍历每个三级分类组
  c3Groups.forEach(group => {
    // 按 projectType 固定顺序排列（2025年以前→新接→销项）
    projectTypeOptions.forEach(pt => {
      const item = group.items.find(i => i.projectType === pt)
      if (item) result.push(item)
    })

    // 添加小计行（汇总该三级分类下 3 个项目类型）
    const subtotal = {
      category1: group.category1,
      category2: group.category2,
      category3: group.category3,
      projectType: '小计',
      isSubtotal: true
    }
    sumFields.forEach(f => {
      subtotal[f] = group.items.reduce((s, i) => s + (i[f] || 0), 0)
    })
    subtotal.grossProfitRate = subtotal.contractPrice > 0
      ? Number((subtotal.grossProfit / subtotal.contractPrice * 100).toFixed(2))
      : 0
    result.push(subtotal)
  })

  return result
})
```

关键变化：
- 小计行 `category1/category2/category3` 设为组内实际值（非空），以便参与单元格合并
- 小计行 `projectType` 显示"小计"
- 小计行汇总的是该三级分类下 3 个项目类型的数据（非全部项目类型）

### 修改 2：更新 `categorySpans` computed（L563-L612）

移除 `isSubtotal` 跳过逻辑，让小计行参与合并：

```js
const categorySpans = computed(() => {
  const data = sortedFlatData.value
  const spans1 = new Array(data.length).fill(0)
  const spans2 = new Array(data.length).fill(0)
  const spans3 = new Array(data.length).fill(0)

  let i = 0
  while (i < data.length) {
    // 一级分类合并（包含小计行）
    let j = i
    while (j < data.length && data[j].category1 === data[i].category1) j++
    spans1[i] = j - i

    // 二级分类合并（在一级分类组内，包含小计行）
    let k = i
    while (k < j) {
      let m = k
      while (m < j && data[m].category2 === data[k].category2) m++
      spans2[k] = m - k

      // 三级分类合并（在二级分类组内，包含小计行）
      let n = k
      while (n < m) {
        let p = n
        while (p < m && data[p].category3 === data[n].category3) p++
        spans3[n] = p - n
        n = p
      }
      k = m
    }

    i = j
  }

  return { spans1, spans2, spans3 }
})
```

关键变化：
- 移除 `if (data[i].isSubtotal)` 分支
- 移除 `!data[j].isSubtotal` 条件
- 小计行的 category1/category2/category3 与数据行相同，自然参与合并

### 修改 3：更新 `spanMethod` 函数（L614-L628）

移除小计行的跳过逻辑：

```js
const spanMethod = ({ row, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    const span = categorySpans.value.spans1[rowIndex]
    return span > 0 ? [span, 1] : [0, 0]
  }
  if (columnIndex === 1) {
    const span = categorySpans.value.spans2[rowIndex]
    return span > 0 ? [span, 1] : [0, 0]
  }
  if (columnIndex === 2) {
    const span = categorySpans.value.spans3[rowIndex]
    return span > 0 ? [span, 1] : [0, 0]
  }
}
```

关键变化：移除 `if (row.isSubtotal) return`，让小计行的前 3 列也参与合并（显示为隐藏，因为 span=0）。

### 修改 4：更新 `handleExport` 函数（L669-L730）

小计行的 category1/category2/category3 不再清空（保留组内值，便于导出后识别归属）：

```js
const handleExport = () => {
  const flatRows = sortedFlatData.value.map(item => ({
    category1: item.category1,
    category2: item.category2,
    category3: item.category3,
    projectType: item.projectType,
    // ... 其余字段不变
  }))
  // ... 其余导出逻辑不变
}
```

关键变化：移除 `item.isSubtotal ? '' : item.category1` 的三元判断，直接使用 `item.category1`。

### 不需要修改的部分

- `generateRawData`：数据生成逻辑不变（仍然生成 category1×category2×category3×projectType 的笛卡尔积）
- `getSummaries`：仍使用 `filteredData.value` 计算总计（不含小计行），无需修改
- `getRowClassName`：仍返回 `'subtotal-row'`，无需修改
- CSS `.subtotal-row` 样式：无需修改
- 模板 `<el-table>` 配置：无需修改（`:span-method`、`:row-class-name` 等已配置）

## 预期效果

表格渲染效果（示例）：

| 一级分类 | 二级分类 | 三级分类 | 项目类型 | 项目数量 | 合同金额 | ... |
|---------|---------|---------|---------|---------|---------|-----|
| 水务 | 城镇水务 | 供水 | 2025年以前项目 | 5 | 4,578 | ... |
| (合并) | (合并) | (合并) | 2025年新接项目 | 3 | 3,200 | ... |
| (合并) | (合并) | (合并) | 2025年销项项目 | 2 | 2,100 | ... |
| (合并) | (合并) | (合并) | **小计** | **10** | **9,878** | ... |
| (合并) | (合并) | 排水 | 2025年以前项目 | 4 | 3,500 | ... |
| (合并) | (合并) | (合并) | 2025年新接项目 | 2 | 1,800 | ... |
| (合并) | (合并) | (合并) | 2025年销项项目 | 1 | 900 | ... |
| (合并) | (合并) | (合并) | **小计** | **7** | **6,200** | ... |
| (合并) | 水处理 | 生活污水处理 | 2025年以前项目 | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... |
| 水环境治理 | 水源水保护 | 饮用水源保护 | 2025年以前项目 | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... |
| **合计** | | | | **总计** | **总计** | ... |

- 三级分类单元格跨 4 行合并（3 项目类型 + 小计）
- 二级分类跨该二级分类下所有三级分类组（含小计行）合并
- 一级分类跨该一级分类下所有行（含小计行）合并
- 小计行橙色背景加粗
- 底部合计行仍为全局总计

## 验证步骤

1. 启动 dev server（已在 http://localhost:5173/ 运行）
2. 浏览器访问"资金管理 → 项目板块业务财务信息汇总"页面
3. 使用 `browser_evaluate` 验证：
   - `sortedFlatData.length` 应为 ~164（41 组 × 4 行）
   - 小计行数量应 ~41（每个三级分类 1 个）
   - 小计行的 `projectType` 应为"小计"
   - 小计行的 `category1/category2/category3` 应与同组数据行相同
   - 三级分类合并 span 应为 4（3 项目类型 + 小计）
   - 二级分类合并 span 应 > 4
   - 一级分类合并 span 应 > 二级分类 span
4. 检查小计行数据正确性：小计行数值 = 同组 3 个项目类型对应字段之和
5. 检查导出 CSV：小计行应含 category1/category2/category3 值 + "小计" projectType

## 假设与决策

- **假设**：用户筛选 projectType 时，结构仍然按三级分类分组。若某三级分类组只有 1 个项目类型（因筛选），仍显示 1 行数据 + 1 小计行（小计 = 该 1 行）。
- **决策**：保持 `sortable="custom"` 列功能不变。`sortFlat` 对整个数据排序后再分组，组内按 projectType 固定顺序排列（不随排序变化），保证三级分类层级结构稳定。
- **决策**：小计行保留 category1/category2/category3 值（非空），用于参与单元格合并 + 导出时识别归属。
