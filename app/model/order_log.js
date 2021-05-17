/*
 * 送货人信息表
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 17:58:26
 */

module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;
  
    const OrderLog = app.model.define('order_log', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        account_id: INTEGER,
        order_id: INTEGER,
        desc: STRING(255),
        created_at: DATE,
    }, {
        updatedAt: false
    });


    // 模型关联
    OrderLog.associate = function() {
        const { Account, Order } = app.model;

        OrderLog.belongsTo( Account, {
            as: 'account',
            foreignKey: 'account_id',
        })

        OrderLog.belongsTo( Order, {
            as: 'order',
            foreignKey: 'order_id',
        })
    };

    return OrderLog;
};