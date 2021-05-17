/*
 * 订单
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 15:03:52
 */

module.exports = app => {
    const { STRING, TEXT, TINYINT, DECIMAL, INTEGER, DATE } = app.Sequelize;
  
    const Order = app.model.define('order', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 需求描述
        desc: STRING(255),
        // 分类ID
        category_id: INTEGER,
        // 接收方
        account_id: INTEGER,
        // 审批人
        check_user_id: INTEGER,
        // 审核人
        check: STRING(32),
        // 经办人
        agent: STRING(255),
        // 使用人
        user_id: INTEGER,
        // 公司ID
        company_id: INTEGER,
        // 商品ID
        product_id: INTEGER,
        // 送货人ID
        delivery_id: INTEGER,
        // 发票ID
        ticket_id: INTEGER,
        // 数据
        number: INTEGER,
        // 价格
        price: { type: DECIMAL(10,2).UNSIGNED, defaultValue: 0.00 },
        // 金额
        money: { type: DECIMAL(10,2).UNSIGNED, defaultValue: 0.00 },
        // 备注
        remark: STRING(255),
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 供货时间
        supplied_at: DATE,
        // 使用时间
        use_at: DATE,
        // 下单时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
        // 结算时间
        final_at: DATE
    });

    // 模型关联
    Order.associate = function() {
        const { Company, Category, User, Delivery, Account, Product, Ticket } = app.model;

        Order.belongsTo( Category, { as: 'category', foreignKey: 'category_id' })

        Order.belongsTo( Company, { as: 'company', foreignKey: 'company_id', })

        Order.belongsTo( User, { as: 'check_user', foreignKey: 'check_user_id' })

        Order.belongsTo( User, { as: 'user', foreignKey: 'user_id' })

        Order.belongsTo( Account, { as: 'account', foreignKey: 'account_id' })

        Order.belongsTo( Delivery, { as: 'delivery', foreignKey: 'delivery_id' })

        Order.belongsTo( Product, { as: 'product', foreignKey: 'product_id' })

        Order.belongsTo( Ticket, { as: 'ticket', foreignKey: 'ticket_id' })

    };

    return Order;
};