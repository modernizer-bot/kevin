/*
 * API 配置
 * @Author: chandre 
 * @Date: 2021-04-17 16:04:09 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-16 13:57:46
 */

import Admin from './admin.js';
import Uploader from './uploader.js';

export default {
    
    Admin,

    // 登录
    Login: { method: 'post', url: '/login' },
    // 设置密码
    Reset: { method: 'post', url: '/reset_password' },
    // 发送验证码
    SendCode: { method: 'post', url: '/send_code' },
    // 获取用户基本信息
    UserInfo: { method: 'get', url: '/account/info' },
    // 修改个人资料
    UserUpdate: { method: 'post', url: '/account/update_info' },
    // 重置密码
    ResetPass: { method: 'post', url: '/account/reset_password' },
    // 账号下的公司列表
    CompanyAll: { method: 'get', url: '/company/all' },
    // 设备分类
    CategoryAll: { method: 'get', url: '/category/all' },
    

    // 商品信息
    Product: {
        // 导入
        Import: { method: 'post', url: '/product/import' },
        // 列表
        List: { method: 'get', url: '/product/list' },
        // 添加
        Add: { method: 'post', url: '/product/add' },
        // 修改
        Edit: { method: 'post', url: '/product/update' },
        // 删除
        Del: { method: 'post', url: '/product/del' },
    },

    // 商品需求订单
    Order: {
        // 查询列表
        List: { method: 'get', url: '/order/company_list' },
        // 更新商品
        Product: { method: 'post', url: '/order/update_product' },
        // 更新结算信息
        Final: { method: 'post', url: '/order/update_final' },
    },
}