# 供应链报表为空问题修复计划

## 问题分析

### 根本原因
`Sidebar.vue` 中的 `selectSubMenu` 函数硬编码了 `menu: '营收报表'`，导致供应链报表子菜单点击时发送的事件不匹配 `App.vue` 中的路由逻辑。

**错误的事件发送**：
```javascript
emit('menu-change', { menu: '营收报表', subMenu: child.key })
```

**App.vue 期望的检查**：
```javascript
} else if (menu === '供应链报表' && subMenu) {
    currentView.value = 'supply-chain-report'
    ...
}
```

由于发送的是 `'营收报表'` 而不是 `'供应链报表'`，条件永远不满足，导致供应链报表视图无法显示。

## 修复方案

修改 `Sidebar.vue` 的 `selectSubMenu` 函数，使其根据当前展开的父菜单发送正确的 `menu` 参数。

## 修复步骤

### 步骤1：修改 Sidebar.vue 的 selectSubMenu 函数
- 将硬编码的 `menu: '营收报表'` 改为动态获取当前展开的父菜单名称
- 利用 `expandedMenus.value` 中存储的展开菜单列表
- 当用户点击子菜单时，从 `expandedMenus` 获取当前展开的父菜单名称

### 修复后的代码逻辑
```javascript
const selectSubMenu = (child) => {
  activeSubMenu.value = child.name
  // 获取当前展开的父菜单名称（expandedMenus中的最后一个）
  const parentMenu = expandedMenus.value.length > 0
    ? expandedMenus.value[expandedMenus.value.length - 1]
    : activeMenu.value
  emit('menu-change', { menu: parentMenu, subMenu: child.key })
}
```

## 预期结果
修复后，点击"供应链报表" -> "供应商合同签订报表"将：
1. 发送正确的事件 `{ menu: '供应链报表', subMenu: 'supplier-contract' }`
2. App.vue 条件匹配
3. currentView 设置为 'supply-chain-report'
4. 正确渲染 SupplierContractReport 组件