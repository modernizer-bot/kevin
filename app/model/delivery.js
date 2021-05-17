/*
 * 送货人信息表
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 21:39:49
 */

module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;
  
    const Delivery = app.model.define('delivery', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 公司ID
        company_id: INTEGER,
        // 姓名
        name: STRING(32),
        // 电话
        phone: STRING(32),
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 创建时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
    });

    // 模型关联
    Delivery.associate = function() {
        const { Company } = app.model;
        Delivery.belongsTo( Company, {
            as: 'company',
            foreignKey: 'company_id',
        })
    };

    return Delivery;
};