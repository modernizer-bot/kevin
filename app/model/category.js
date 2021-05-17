/*
 * 分类
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 17:33:37
 */


module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;
  
    const Category = app.model.define('category', {
        // 账号ID
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 分类名称
        name: STRING(32),
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 创建时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
    });
  
    return Category;
};