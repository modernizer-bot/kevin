export default [
    {
        path: '/admin/commodity', name: '商品管理', icon: 'home', hidden: false,
        children: [
            {
                path: '/admin/commodity/order', name: '商品订单', hidden: false,
            },
            {
                path: '/admin/commodity/report', name: '统计报表', hidden: false,
            },
            {
                path: '/admin/commodity/info', name: '商品信息', hidden: false,
            },
            {
                path: '/admin/commodity/category', name: '设备类型', hidden: false,
            },
            
        ]
    },

    {
        path: '/admin/system', name: '系统管理', icon: 'setting', hidden: false,
        children: [
            {
                path: '/admin/system/account', name: '账号管理', hidden: false,
            },
            {
                path: '/admin/system/user', name: '使用人员', hidden: false,
            },
            
            {
                path: '/admin/system/company', name: '公司信息', hidden: false,
            },
            {
                path: '/admin/system/delivery', name: '送货人员', hidden: false,
            }
        ]
    },
    
]