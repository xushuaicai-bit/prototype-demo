# 供应链报表新增超期天数筛选项计划

## 需求分析

在供应商合同签订报表中新增"超期天数"筛选项，包含三个区间选项：
- 超期21~44天
- 超期45~60天
- 超期60天及以上

需要与列表中的超期天数字段（overdueDays）联动，实现实时筛选。

## 修改文件

- `src/components/supply-chain/SupplierContractReport.vue`

## 实施步骤

### 步骤1：新增超期天数筛选器
在模板的筛选区域新增一个 el-select 组件：
```html
<div class="flex items-center">
  <label class="text-sm text-gray-600 mr-2">超期天数：</label>
  <el-select
    v-model="selectedOverdue"
    placeholder="请选择超期天数"
    class="w-64"
    clearable
  >
    <el-option
      v-for="option in allOverdueOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</div>
```

### 步骤2：添加响应式变量
在 script 部分添加：
```javascript
const selectedOverdue = ref('')

const allOverdueOptions = [
  { label: '超期21~44天', value: '21-44' },
  { label: '超期45~60天', value: '45-60' },
  { label: '超期60天及以上', value: '60+' }
]
```

### 步骤3：添加筛选逻辑
修改 `tableData` computed 属性，新增超期天数筛选条件：
```javascript
const tableData = computed(() => {
  const result = []
  filteredData.value.forEach(project => {
    project.contracts.forEach(contract => {
      if (selectedCategory.value && contract.category !== selectedCategory.value) return
      // 新增超期天数筛选
      if (selectedOverdue.value) {
        const days = contract.overdueDays
        if (selectedOverdue.value === '21-44' && (days < 21 || days > 44)) return
        if (selectedOverdue.value === '45-60' && (days < 45 || days > 60)) return
        if (selectedOverdue.value === '60+' && days < 60) return
      }
      result.push({
        ...contract,
        projectCode: project.projectCode,
        projectName: project.projectName,
        unit: project.unit,
        status: project.status
      })
    })
  })
  return result
})
```

## 预期效果

1. 筛选器区域显示5个筛选条件（项目名称、基层单位、项目状态、合同分类、超期天数）
2. 选择"超期21~44天"时，只显示 overdueDays 在 21~44 之间的行
3. 选择"超期45~60天"时，只显示 overdueDays 在 45~60 之间的行
4. 选择"超期60天及以上"时，只显示 overdueDays >= 60 的行
5. 清空选项时显示所有数据
6. 筛选器之间可以联动，例如可以同时筛选"在建"项目且"超期21~44天"