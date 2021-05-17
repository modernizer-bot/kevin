/*
 * @Author: chandre 
 * @Date: 2021-05-08 21:05:01 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 19:07:59
 */
const { Service } = require('egg');
const _ = require('lodash')

class LogService extends Service {
    
    // 账号登录日志
    async Account(type=1, account_id) {
        const Model = this.app.model.AccountLog;
        await Model.create({ account_id, type })
    }

    // 订单日志
    async Order(orderId, desc) {
        const AccountInfo = this.service.auth.info;
        const Model = this.app.model.OrderLog;
        let ids = _.isArray(orderId) ? orderId : [orderId];
        const data = ids.map(order_id => {
            return {
                account_id: AccountInfo.id,
                order_id,
                desc
            }
        })
        return await Model.bulkCreate(data)
    }
}

module.exports = LogService