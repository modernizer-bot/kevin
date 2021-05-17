const Validator = require('../../libs/validator');

class ProductValidator extends Validator {

    // 自定义消息
    messages = {
        'required.name': '商品名称不能为空',
        'max.name': '商品名称最多100个字符',
        'required.unit': '未选择商品规格',
        'required.price': '请填写商品价格',
        'max.params': '商品参数最多1000个字符',
        'max.link': '商品链接最多255个字符',
        'required.category_id': '未选择分类',
        'required.company_id': '未选择公司',
    }
    
    async product() {
        await this.check(this.ctx.request.body, {
            name: 'required|max:100',
            unit: 'required',
            price: 'required',
            params: 'required|max:1000',
            link: 'required|max:255',
            company_id: 'required|integer',
            category_id: 'required|integer',
        })
    }
}


module.exports = ProductValidator;