const Validator = require('../../libs/validator');

class UserValidator extends Validator {

    // 自定义消息
    messages = {
        'required.name': '请填写姓名',
        'between.name': '姓名必须是2~10位',
        'department': '部门最多20个字符',
        'address': '地址最多20个字符',
        'phone': '固定电话或手机号格式不正确',
    }
    
    async edit() {
        await this.check(this.ctx.request.body, {
            name: 'required|between:2,10',
            department: 'max:20',
            address: 'max:20',
            phone: 'phone',
        })
    }
}


module.exports = UserValidator;