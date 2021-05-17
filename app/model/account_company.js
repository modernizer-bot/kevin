/*
 * 账号与公司关联
 * @Author: chandre 
 * @Date: 2021-05-08 17:29:54 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 14:25:26
 */


module.exports = app => {
    const { INTEGER } = app.Sequelize;
  
    const AccountCompany = app.model.define('account_company', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        account_id: { type: INTEGER },
        company_id: { type: INTEGER },
    },{
        createdAt: false,
        updatedAt: false
    });

    // 模型关联
    AccountCompany.associate = function() {
        const { Account, Company } = app.model;

        Account.belongsToMany( Company, {
            as: 'companys',
            through: AccountCompany,
            foreignKey: 'account_id',
        })

        Company.belongsToMany( Account, {
            as: 'accounts',
            through: AccountCompany,
            foreignKey: 'company_id',
        })

    };

    
    return AccountCompany;
};