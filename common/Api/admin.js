/*
 * 后台
 * @Author: chandre 
 * @Date: 2021-04-19 17:55:41 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-16 16:18:18
 */
export default {
    
    // 用户管理
    Account: {
        // 列表
        List: { method: 'get', url: '/account/list' },
        // 添加
        Add: { method: 'post', url: '/account/add' },
        // 修改
        Edit: { method: 'post', url: '/account/update' },
        // 绑定公司信息
        BindCompany: { method: 'post', url: '/account/bind_company' }
    },

    // 公司
    Company: {
        // 列表
        List: { method: 'get', url: '/company/list' },
        // 添加
        Add: { method: 'post', url: '/company/add' },
        // 修改
        Edit: { method: 'post', url: '/company/update' },
        // 删除
        Del: { method: 'post', url: '/company/del' },
    },

    // 设备分类
    Category: {
        // 列表
        List: { method: 'get', url: '/category/list' },
        // 添加
        Add: { method: 'post', url: '/category/add' },
        // 修改
        Edit: { method: 'post', url: '/category/update' },
        // 删除
        Del: { method: 'post', url: '/category/del' },
    },

    // 使用人员
    User: {
        // 导入
        Import: { method: 'post', url: '/user/import' },
        // 列表
        List: { method: 'get', url: '/user/list' },
        // 添加
        Add: { method: 'post', url: '/user/add' },
        // 修改
        Edit: { method: 'post', url: '/user/update' },
        // 删除
        Del: { method: 'post', url: '/user/del' },
    },

    // 商品需求订单
    Order: {
        // 查询列表
        List: { method: 'get', url: '/order/list' },
        // 添加需求
        Add: { method: 'post', url: '/order/add' },
        // 修改需求
        Put: { method: 'post', url: '/order/update' },
        // 删除需求
        Del: { method: 'post', url: '/order/del' },
        // 日志
        Logs: { method: 'get', url: '/order/logs' },
        // 发送通知
        SendNotice: { method: 'post', url: '/order/send_notice' }
    },

    // 送货人员
    Delivery: {
        // 列表
        List: { method: 'get', url: '/delivery/list' },
        // 添加
        Add: { method: 'post', url: '/delivery/add' },
        // 修改
        Edit: { method: 'post', url: '/delivery/update' },
        // 删除
        Del: { method: 'post', url: '/delivery/del' },
    },


    // 报表
    Report: {
        
        // 公设备维修耗材开支
        Month: {
            method: 'get', url: '/report/month',
        },
        // 办公设备维修耗材
        Quarter: {
            method: 'get', url: '/report/quarter',
        },
        // 新增固定资产
        Assets: {
            method: 'get', url: '/report/assets',
        },
        // 导出
        Export: function(data) {
            return this.$axios.post('/report/export', data)
        }
    }

    
   
}