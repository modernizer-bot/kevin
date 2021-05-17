/*
 * 分类
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 21:13:02
 */


module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE } = app.Sequelize;
  
    const Company = app.model.define('company', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 公司名称
        title: STRING(255),
        // 联系人姓名
        name: STRING(32),
        // 联系电话
        phone: STRING(32),
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 创建时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
    });

  
    return Company;
};