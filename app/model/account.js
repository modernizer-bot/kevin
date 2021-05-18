/*
 * 账号管理
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-18 12:33:18
 */


module.exports = app => {
    const { STRING, TINYINT, INTEGER, DATE, ENUM } = app.Sequelize;
  
    const Account = app.model.define('account', {
        // 账号ID
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        // 账号类型
        type: ENUM('admin', 'company'),
        // 账号
        username: STRING(32),
        // 密码
        password: STRING(32),
        // 姓名
        name: STRING(32),
        // 电话
        phone: STRING(32),
        // 地址
        address: STRING(32),
        // 登录次数限制
        limit: INTEGER,
        // 最后登录ip
        last_ip: STRING(128),
        // 状态
        status: { type: TINYINT, defaultValue: 1 },
        // 创建时间
        created_at: DATE,
        // 最后更新时间
        updated_at: DATE,
    });

    // 模型关联
    Account.associate = function() {
        const { AccountLog } = app.model;

        Account.hasMany(AccountLog, {
            as: 'logs',
            foreignKey: 'account_id',
            constraints: false,
        })
        
        Account.hasMany(AccountLog, {
            as: 'last_change_pass',
            foreignKey: 'account_id',
            constraints: false,
        })
    };

    return Account;
};