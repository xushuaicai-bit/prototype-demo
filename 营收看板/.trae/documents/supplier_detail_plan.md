# 供应链报表新增供应商详情表计划

## 需求分析

在供应链报表下新增"供应商详情表"，包含以下字段：

| 字段名         | 说明              |
| ----------- | --------------- |
| 序号          | 行号              |
| 供应商名称       | 供应商名称           |
| 项目名称        | 项目名称            |
| 基层单位        | 基层单位            |
| 分包合同名称      | 合同名称            |
| 合同分类        | 合同类型            |
| 合同金额（不含税）   | 金额数值（元）         |
| 合同开始时间      | 开始日期            |
| 合同计划/实际结束时间 | 结束日期            |
| 合同状态        | 待建、在建、待结算、结算已完成 |

## 修改文件

1. `src/components/supply-chain/SupplierDetailReport.vue` - 新建供应商详情表组件
2. `src/components/layout/Sidebar.vue` - 添加子菜单
3. `src/App.vue` - 添加路由逻辑

## 实施步骤

### 步骤1：创建供应商详情表组件

创建 `src/components/supply-chain/SupplierDetailReport.vue`，包含：

* 表格展示上述10个字段

* 模拟数据（覆盖所有合同状态）

* 筛选功能（供应商名称、项目名称、合同状态）

### 步骤2：修改侧边栏菜单

在"供应链报表"下添加"供应商详情表"子菜单：

```javascript
{ 
  name: '供应链报表', 
  icon: ...,
  children: [
    { name: '供应商合同签订报表', key: 'supplier-contract' },
    { name: '供应商详情表', key: 'supplier-detail' }  // 新增
  ]
}
```

### 步骤3：修改App.vue

添加供应商详情表的路由逻辑：

```javascript
} else if (menu === '供应链报表' && subMenu === 'supplier-detail') {
    currentView.value = 'supplier-detail-report'
    ...
}
```

### 步骤4：添加视图组件

创建或更新视图组件，引入供应商详情表组件

## 数据结构设计

```javascript
{
  supplierName: '供应商名称',
  projectName: '项目名称',
  unit: '基层单位',
  contractName: '分包合同名称',
  category: '合同分类',
  amount: 1000000,
  startTime: '2026-01-01',
  endTime: '2026-12-31',
  status: '在建'  // 待建、在建、待结算、结算已完成
}
```

## 合同状态选项

* 待建

* 在建

* 待结算

* 结算已完成

## 预期效果

1. 点击侧边栏"供应链报表" -> "供应商详情表"显示新报表
2. 表格显示所有字段，包含模拟数据
3. 支持供应商名称、项目名称、合同状态筛选
4. 保持与现有报表一致的蓝色主题样式

