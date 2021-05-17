/*
 * 后台
 * @Author: chandre 
 * @Date: 2021-04-20 14:05:08 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-16 17:20:30
 */

export default {

    // 账号
    Account: {
        username: [
            { required: true, message: '请输入用户名' },
            { max: 32, message: '用户名最多32个字符' },
        ],
        password: [
            { required: true, message: '请输入密码' },
            { min: 10, max: 30, message: '必须是10~30个字符' },
            { type: 'password', message: '必须包含大小写字母、数字和特殊字符' },
        ],
        name: [
            { required: true, message: '请输入联系人' },
            { min: 2, max: 10, message: '必须是2~10个字符' },
        ],
        phone: [
            { required: true, message: '请输入联系电话' },
            { type: 'phone', message: '固定电话或手机号码格式不正确' },
        ],
        address: [
            { type: 'string', max: 255, message: '联系地址最多255个字符' },
        ],
    },

    // 重围密码
    ResetPassword: {
        password: [
            { required: true, message: '请输入密码' },
            { min: 10, max: 30, message: '必须是10~30个字符' },
            { type: 'password', message: '必须包含大小写字母、数字和特殊字符' },
        ]
    },

    // 公司
    Company: {
        title: [
            { required: true, message: '请输入公司名称' },
            { min: 2, max: 30, message: '必须是2~30个字符' },
        ],
        name: [
            { required: true, message: '请输入联系人' },
            { min: 2, max: 10, message: '必须是2~10个字符' },
        ],
        phone: [
            { required: true, message: '请输入联系电话' },
            { type: 'phone', message: '固定电话或手机号码格式不正确' },
        ],
    },

    // 分类
    Category: {
        name: [
            { required: true, message: '请输入类型名称' },
            { min: 2, max: 10, message: '必须是2~10个字符' },
        ],
    },

    // 使用人员
    User: {
        name: [
            { required: true, message: '请输入姓名' },
            { min: 2, max: 10, message: '必须是2~10个字符' },
        ],
        department: [
            { max: 20, message: '最多20个字符' },
        ],
        address: [
            { max: 20, message: '最多20个字符' },
        ],
        phone: [
            { type: 'phone', message: '固定电话或手机号码格式不正确' },
        ]
    },

    // 送货人员
    Delivery: {
        company_id: [
            { required: true, message: '请选择公司' },
        ],
        name: [
            { required: true, message: '请输入联系人' },
            { min: 2, max: 10, message: '必须是2~10个字符' },
        ],
        phone: [
            { required: true, message: '请输入联系电话' },
            { type: 'phone', message: '固定电话或手机号码格式不正确' },
        ],
    }


    
}