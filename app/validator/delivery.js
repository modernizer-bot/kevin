const Validator = require('../../libs/validator');

class CompanyValidator extends Validator {

    // 自定义消息
    messages = {
        'required.company_id': '未选择所属公司',
        'required.name': '姓名不能为空',
        'max.name': '姓名最多10个字符',
        'required.phone': '联系电话不能为空',
    }
    
    async edit() {
        await this.check(this.ctx.request.body, {
            company_id: 'required|integer',
            name: 'required|max:10',
            phone: 'required',
        })
    }
}


module.exports = CompanyValidator;