/*
 * 使用人员
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 17:33:11
 */


module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;
  
    const User = app.model.define('user', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 姓名
        name: STRING(32),
        // 电话
        phone: STRING(32),
        // 地址
        address: STRING(32),
        // 部门
        department: STRING(255),
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 创建时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
    });

  
    return User;
};