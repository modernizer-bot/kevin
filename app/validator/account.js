const Validator = require('../../libs/validator');

class AccountValidator extends Validator {

    // 自定义消息
    messages = {
        'required.username': '账号不能为空',
        'max.username': '账号最多32个字符',
        'required.password': '密码不能为空',
        'password.password': '密码必须10~30位，必须包含大小写字母、数字和特殊字符',
        'required.code': '请输入验证码',
        'password.newPass': '密码必须10~30位，必须包含大小写字母、数字和特殊字符',
        'max.name': '姓名最多32个字符',
        'max.phone': '电话号码最多32个字符',
        'max.phone': '地址最多255个字符',
    }
    

    // 登录
    async login() {
        const rules = {
            username: 'required|string',
            code: 'required|string'
        }
        await this.check(this.ctx.request.body, rules)
    }

    // 创建账号
    async add() {
        const rules = {
            username: 'required|string|max:32',
            // password: 'required|password',
            name: 'string|max:32',
            phone: 'string|max:32'
        }
        await this.check(this.ctx.request.body, rules)
    }

    // 管理员更新
    async update() {
        const rules = {
            username: 'required|string',
            // password: 'password',
            name: 'string|max:32',
            phone: 'string|max:32',
            status: 'integer'
        }
        await this.check(this.ctx.request.body, rules)
    }

    // 个人更新
    async updateInfo() {
        const rules = {
            name: 'string|max:32',
            phone: 'string|max:32',
            address: 'string|max:255',
        }
        await this.check(this.ctx.request.body, rules)
    }

    // 重置密码
    async resetPassword() {
        const rules = {
            oldPass: 'required',
            newPass: 'required|password',
        }
        await this.check(this.ctx.request.body, rules)
    }

    // 重置密码
    async resetPass() {
        const rules = {
            username: 'required|string',
            oldPass: 'required',
            newPass: 'required|password',
        }
        await this.check(this.ctx.request.body, rules)
    }
}


module.exports = AccountValidator;