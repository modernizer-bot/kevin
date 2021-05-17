const Validator = require('../../libs/validator');

class CategoryValidator extends Validator {

    // 自定义消息
    messages = {
        'required.name': '分类名称不能为空',
        'max.name': '分类名称最多20个字符',
    }
    
    async add() {
        await this.check(this.ctx.request.body, {
            name: 'required|max:20'
        })
    }

    async update() {
        await this.check(this.ctx.request.body, {
            name: 'required|max:20',
            id: 'required|integer'
        })
    }
}


module.exports = CategoryValidator;