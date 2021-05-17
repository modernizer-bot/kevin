export default [
    {
        path: '/merchant/commodity', name: '商品管理', icon: 'home', hidden: false,
        children: [
            {
                path: '/merchant/commodity/order', name: '商品订单', hidden: false,
            },
            {
                path: '/merchant/commodity/info', name: '商品信息', hidden: false,
            }
        ]
    },

    {
        path: '/merchant/system', name: '系统管理', icon: 'setting', hidden: false,
        children: [
            {
                path: '/merchant/system/company', name: '公司信息', hidden: false,
            },
            {
                path: '/merchant/system/delivery', name: '送货人员', hidden: false,
            }
        ]
    },
    
]