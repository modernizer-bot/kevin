const Validator = require('../../libs/validator');

class CompanyValidator extends Validator {

    // 自定义消息
    messages = {
        'required.title': '公司名称不能为空',
        'max.title': '公司名称最多20个字符',
        'required.name': '联系人不能为空',
        'max.name': '联系人最多10个字符',
        'required.phone': '联系电话不能为空',
    }
    
    async add() {
        await this.check(this.ctx.request.body, {
            title: 'required|max:20',
            name: 'required|max:10',
            phone: 'required',
        })
    }

    async update() {
        await this.check(this.ctx.request.body, {
            name: 'required|max:20',
            id: 'required|integer'
        })
    }
}


module.exports = CompanyValidator;