/*
 * 表单验证规则
 * @Author: chandre 
 * @Date: 2021-04-20 12:46:41 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-16 17:20:55
 */

import Admin from './admin'

export default {
    // 后台
    Admin,

    // 登录
    Login: {
        username: [
            { required: true, message: '请输入用户名' }
        ],
        password: [
            { required: true, message: '请输入登录密码' },
        ],
        code: [
            { required: true, len: 6, message: '请输入6位验证码' },
        ]
    },

    // 重置密码
    ResetPass: {
        username: [
            { required: true, message: '请输入登录账号' }
        ],
        oldPass: [
            { required: true, message: '请输入旧密码' },
        ],
        newPass: [
            { required: true, message: '请输入新密码' },
            { min: 10, max: 30, message: '必须是10~30个字符' },
            { type: 'password', message: '必须包含大小写字母、数字和特殊字符' },
        ]
    },

    // 账号基本资料
    AccountInfo: {
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

    // 商品
    Commodity: {
        company_id: [
            { required: true, message: '请选择供货商' },
        ],
        category_id: [
            { required: true, message: '请选择所属分类' },
        ],
        name: [
            { required: true, message: '请输入商品名称' },
            { max: 100, message: '最多100个字符' },
        ],
        price: [
            { required: true, message: '请输入商品价格' },
        ],
        unit: [
            { required: true, message: '请选择规格' },
        ],
        params: [
            { required: true, message: '请输入商品参数' },
            { max: 1000, message: '最多1000个字符' },
        ],
        link: [
            { required: true, message: '请输入商品链接' },
            { type: 'url', message: '格式不正确' },
            { max: 255, message: '最多255个字符' },
        ]
    },

    // 订单
    Order: {

        category_id: [
            { required: true, message: '请选择设备类型' },
        ],
        
        desc: [
            { required: true, message: '请输入需求描述' },
            { max: 255, message: '最多255个字符' },
        ],

        account_id: [
            { required: true, message: '请填写需求接收方' },
        ],

        check_user_id: [
            { required: true, message: '请填写审批人' },
        ],

        user_id: [
            { required: true, message: '请填写使用人' },
        ],

        use_at: [
            { required: true, message: '请选择使用时间' },
        ],

        company_id: [
            { required: true, message: '请选择供货商' },
        ],

        delivery_id: [
            { required: true, message: '请选择送货人' },
        ],

        agent: [
            { required: true, message: '请输入经办人' },
            { max: 10, message: '最多10个字符' },
        ],

        remark: [
            { max: 255, message: '最多255个字符' },
        ]

    },

    Ticket: {
        code: [
            { required: true, message: '请填写发票代码' },
        ],
        number: [
            { required: true, message: '请填写发票编号' },
        ],
        date: [
            { required: true, message: '请填写开票日期' },
        ]
    }

    
}