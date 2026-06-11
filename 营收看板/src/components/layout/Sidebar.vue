<template>
  <aside class="w-56 bg-white shadow-md flex flex-col">
    <nav class="flex-1 py-4 overflow-y-auto">
      <div v-if="menuItems.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
        该模块暂无功能
      </div>
      
      <div v-for="menu in menuItems" :key="menu.name" class="relative">
        <button 
          :class="[
            'w-full flex items-center px-4 py-3 text-sm transition-all',
            activeMenu === menu.name || activeSubMenu === menu.name
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
          ]"
          @click="toggleSubMenu(menu)"
        >
          <component :is="menu.icon" class="w-5 h-5 mr-3" />
          {{ menu.name }}
          <svg v-if="menu.children" class="w-4 h-4 ml-auto transition-transform" :class="{ 'rotate-90': expandedMenus.includes(menu.name) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div v-if="menu.children && expandedMenus.includes(menu.name)" class="bg-gray-50">
          <button 
            v-for="child in menu.children" 
            :key="child.name"
            :class="[
              'w-full flex items-center px-4 py-2 text-sm transition-all pl-12',
              activeSubMenu === child.name 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            ]"
            @click="selectSubMenu(child)"
          >
            {{ child.name }}
          </button>
        </div>
      </div>
    </nav>
    
    <div class="border-t p-4 space-y-3">
      <button class="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        待办
      </button>
      <button class="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        配置
      </button>
      <button class="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        帮助
      </button>
    </div>
    
    <div class="h-12 flex items-center justify-center border-t bg-gray-50">
      <button class="p-2 hover:bg-gray-100 rounded">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, h, defineProps, watch } from 'vue'

const props = defineProps({
  currentNav: {
    type: String,
    default: '市场管理'
  }
})

const emit = defineEmits(['menu-change'])

const activeMenu = ref('')
const activeSubMenu = ref('')
const expandedMenus = ref([])

const menuMap = {
  '管理总览': [],
  '市场管理': [
    { 
      name: '市场管理看板', 
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
      ]),
      key: 'market-dashboard'
    },
    { 
      name: '市场报表', 
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]),
      key: 'market-report',
      children: [
        { name: '项目跟踪数据表', key: 'project-tracking' },
        { name: '重点跟踪项目清单', key: 'key-project-list' },
        { name: '城市环境投标情况汇总', key: 'bid-summary' },
        { name: '中标项目清单', key: 'winning-bid' },
        { name: '在投项目清单', key: 'in-bid' },
        { name: '市场跟踪管理', key: 'market-tracking' },
        { name: '项目投标管理（系统已有）', key: 'bid-project' }
      ]
    }
  ],
  '产运管理': [
    { 
      name: '产运看板', 
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z' })
      ]),
      key: 'unified-dashboard'
    },
    { 
      name: '营收报表', 
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]),
      key: 'revenue-report',
      children: [
        { name: '营收汇总表', key: 'revenue-summary' },
        { name: '营收明细表', key: 'revenue-detail' },
        { name: '偏差项目表', key: 'revenue-deviation' }
      ]
    },
    { 
      name: '供应链报表', 
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]),
      key: 'supply-chain-report',
      children: [
        { name: '供应商合同签订报表', key: 'supplier-contract' },
        { name: '项目采购合同（系统已有）', key: 'supplier-detail' }
      ]
    },
    {
      name: '供应链管理',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
      ]),
      key: 'supply-chain-mgmt',
      children: [
        { name: '承包商/供应商库', key: 'supplier-library' },
        { name: '承包商/供应商选用', key: 'supplier-selection' },
        { name: '承包商/供应商合同', key: 'supplier-contract-mgmt' },
        { name: '集采对账单', key: 'centralized-reconciliation' }
      ]
    },
    {
      name: '计量统计管理',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
      ]),
      key: 'measurement-stat-mgmt',
      children: [
        { name: '产值营收管理', key: 'output-revenue-mgmt' },
        { name: '承包商/供应商计量', key: 'supplier-measurement' }
      ]
    },
    {
      name: '生产管理',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' })
      ]),
      key: 'production-mgmt',
      children: [
        { name: '生产开项', key: 'production-item' },
        { name: '参建单位', key: 'construction-unit' },
        { name: '计量单位', key: 'measurement-unit' },
        { name: '进度管理', key: 'progress-mgmt' },
        { name: '风险管理', key: 'risk-mgmt' },
        { name: '险情管理', key: 'danger-mgmt' },
        { name: '质量管理', key: 'quality-mgmt' },
        { name: '设备管理', key: 'equipment-mgmt' },
        { name: '材料管理', key: 'material-mgmt' }
      ]
    },
    {
      name: '技术管理',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' })
      ]),
      key: 'tech-mgmt',
      children: [
        { name: '方案计划管理', key: 'plan-mgmt' },
        { name: '技术方案管理', key: 'tech-solution-mgmt' },
        { name: '资料库', key: 'document-library' },
        { name: '图章管理', key: 'seal-mgmt' }
      ]
    },
    {
      name: '物资管理',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
      ]),
      key: 'material-mgmt',
      children: [
        { name: '材料计划管理', key: 'material-plan-mgmt' },
        { name: '材料领用供应', key: 'material-requisition' },
        { name: '材料库存管理', key: 'material-inventory' },
        { name: '材料对账管理', key: 'material-reconciliation' },
        { name: '材料统计报表', key: 'material-statistics' }
      ]
    }
  ],
  '经济管理': [
    {
      name: '经济管理看板',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
      ]),
      key: 'economy-dashboard'
    }
  ],
  '安全管理': [],
  '资金管理': [
    {
      name: '业财统计报表',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]),
      key: 'finance-report'
    },
    {
      name: '按项目状态分类汇总表',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 10h16M4 14h16M4 18h16' })
      ]),
      key: 'project-status-summary'
    },
    {
      name: '按分公司分类报表',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
      ]),
      key: 'branch-report'
    }
  ],
  '技术科研管理': [
    {
      name: '技术科研看板',
      icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' })
      ]),
      key: 'tech-research-dashboard'
    }
  ]
}

const menuItems = computed(() => menuMap[props.currentNav] || [])

watch(() => props.currentNav, (newNav) => {
  activeMenu.value = ''
  activeSubMenu.value = ''
  expandedMenus.value = []
  
  const menus = menuMap[newNav] || []
  if (menus.length > 0) {
    const firstMenu = menus[0]
    activeMenu.value = firstMenu.name
    if (!firstMenu.children) {
      emit('menu-change', { menu: firstMenu.name, subMenu: '', key: firstMenu.key })
    } else {
      expandedMenus.value = [firstMenu.name]
      emit('menu-change', { menu: firstMenu.name, subMenu: '', key: firstMenu.key })
    }
  }
}, { immediate: true })

const toggleSubMenu = (menu) => {
  if (menu.children) {
    const index = expandedMenus.value.indexOf(menu.name)
    if (index > -1) {
      expandedMenus.value.splice(index, 1)
    } else {
      expandedMenus.value.push(menu.name)
    }
    activeMenu.value = menu.name
    emit('menu-change', { menu: menu.name, subMenu: '', key: menu.key })
  } else {
    activeMenu.value = menu.name
    activeSubMenu.value = ''
    emit('menu-change', { menu: menu.name, subMenu: '', key: menu.key })
  }
}

const selectSubMenu = (child) => {
  activeSubMenu.value = child.name
  const parentMenu = expandedMenus.value.length > 0
    ? expandedMenus.value[expandedMenus.value.length - 1]
    : activeMenu.value
  emit('menu-change', { menu: parentMenu, subMenu: child.key, key: child.key })
}
</script>
