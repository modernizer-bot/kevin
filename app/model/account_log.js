/*
 * 送货人信息表
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 20:52:48
 */

module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;
  
    const AccountLog = app.model.define('account_log', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        account_id: INTEGER,
        type: TINYINT,
        created_at: DATE,
    }, {
        updatedAt: false
    });


    // 模型关联
    AccountLog.associate = function() {
        const { Account, Order } = app.model;

        AccountLog.belongsTo( Account, {
            as: 'account',
            foreignKey: 'account_id',
        })

        AccountLog.belongsTo( Order, {
            as: 'order',
            foreignKey: 'order_id',
        })

    };

    return AccountLog;
};