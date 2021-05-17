/*
 * 商品信息
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 23:55:41
 */

module.exports = app => {
    const { STRING, TEXT, TINYINT, DECIMAL, INTEGER, DATE } = app.Sequelize;
  
    const Product = app.model.define('product', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 分类ID
        category_id: INTEGER,
        // 公司ID
        company_id: INTEGER,
        // 商品名称
        name: STRING,
        // 参数
        params: TEXT,
        // 单位
        unit: STRING(10),
        // 价格
        price: { type: DECIMAL(10,2).UNSIGNED, defaultValue: 0.00 },
        // 链接
        link: STRING,
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 创建时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
    });

    // 模型关联
    Product.associate = function() {
        const { Company, Category } = app.model;

        Product.belongsTo( Category, {
            as: 'category',
            foreignKey: 'category_id',
        })

        Product.belongsTo( Company, {
            as: 'company',
            foreignKey: 'company_id',
        })
    };

    return Product;
};