/*
 * 账号
 * @Author: chandre 
 * @Date: 2021-05-08 17:27:10 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-16 21:03:38
 */

const { Service } = require('egg');
const _ = require('lodash')
const { Op, fn, col, where } = require("sequelize");

class AccountService extends Service {

    get AccountModel() {
        return this.app.model.Account
    }

    get LogModel() {
        return this.app.model.AccountLog
    }

    get CompanyModel() {
        return this.app.model.Company
    }

    // 验证码
    get CodeService() { 
        return this.service.code
    }

    // 登录日志
    get LogService() { 
        return this.service.log.Account 
    }

    /**
     * 账号登录
     * @param {String} username 账号
     * @param {String} password 密码
     * @param {String} code 验证码
     */
    async login(username, password, code) {
        const ctx = this.ctx;
        const result = await this.AccountModel.findOne({
            attributes: ['id','type', 'username', 'password', 'name', 'phone', 'address'],
            where: {
                username,
                status: 1,
            },
            include: [
                // 查询关联的企业
                {
                    model: this.CompanyModel,
                    as: 'companys',
                    through: { attributes: [] },
                    attributes: ['id']
                },
                
            ],
        });
        if (!result) ctx.throw(400, '账号不存在');
        if (!result.phone || _.isEmpty(result.phone)) ctx.throw(400, '手机号码不存在，请与管理员联系');
        // 验证密码
        const isCheck = ctx.helper.checkHash(password, result.password);
        if (!isCheck) {
            ctx.throw(400, '密码不正确')
        }

        // 验证验证码
        // 测试账号跳过后台验证
        if (result.phone!='18510255608') {
            const codeCheck = await this.CodeService.checkCode(result.phone, code);
            if (!codeCheck) ctx.throw(400, '验证码不正确');
        }

        // 企业账号登录控制
        if (result.type==='company') {
            // 控制用户每天登录次数 
            const loginCount = await this.LogModel.count({
                where: {
                    type: 1,
                    account_id: result.id,
                    created_at: where( fn('DATE_FORMAT', col('created_at'), '%Y%m%d'), "=", fn('DATE_FORMAT', new Date(), '%Y%m%d') ),
                }
            });

            loginCount >= 10 && ctx.throw(400, '今天登录次数已达到上限');
            
            // 控制30天必须修改密码
            const changePass = await this.LogModel.count({
                where: {
                    type: 2,
                    account_id: result.id,
                    created_at: {
                        [Op.lt]: new Date(),
                        [Op.gt]: new Date( new Date() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            });

            !changePass && ctx.throw(403, '请重置密码后再登录');
        }

        const data = _.omit(result.toJSON(), ['password', 'logs']);

        const TokenData = {
            id: data.id,
            username: data.username,
            type: data.type,
        }
        
        // 企业账号保存绑定的企业信息
        if (data.type==='company') {
            TokenData.companys = data.companys.map(item => item.id);
        }
        
        // 生成Token
        let token = this.app.jwt.sign(TokenData, {
            // 过期时间, 12小时
            expiresIn: '12h'
        });

        // 记录登录IP
        ctx.runInBackground(async () => {
            await result.update({ last_ip: ctx.ip });
        });
        
        // 记录登录日志
        ctx.runInBackground(async () => {
            await this.LogService(1, result.id);
        });
        
        return {
            token,
            info: data
        };
    }

    /**
     * 发送验证码
     * @param {String} username 账号
     */
    async sendCode(username) {
        const result = await this.AccountModel.findOne({
            attributes: ['id','username','phone'],
            where: {
                username,
                status: 1,
            }
        });
        if (!result) this.ctx.throw(400, '账号不存在');
        await this.CodeService.sendCode(result.phone);
        return true;
    }

    /**
     * 查询账号是否存在
     * @param {String} username 
     */
    async hasAccount(username) {
        return await this.AccountModel.findOne({
            where: { username },
            attributes: [ 'id', ]
        })
    }

    /**
     * 添加企业账号
     * @param {Object} data 
     * @param {String} data.username 账号
     * @param {String} data.password 密码
     * @param {String} data.name 姓名
     * @param {String} data.phone 电话
     * @param {String} data.address 地址
     * @param {String} data.type 类型， admin=管理员账号，company=公司账号
     */
    async add(data) {
        const ctx = this.ctx;
        const hasAccount = await this.hasAccount(data.username);
        if (hasAccount) ctx.throw(400, '账号已存在');
        data.password = ctx.helper.getHash(data.password);
        data.type = 'company';
        data.status = 1;
        const result = await this.AccountModel.create(data);
        return _.pick(result.toJSON(), ['id', 'username', 'name', 'phone', 'address', 'status'])
    }


    /**
     * 绑定公司信息
     * @param {Number} accountId 账号id
     * @param {Array<Number>} companys 公司ID
     */
    async bindCompanys(accountId, companys = []) {
        const { ctx } = this;
        // 查询公司
        const companyData = await this.CompanyModel.findAll({ 
            where: { id: companys }
        });

        const account = await this.AccountModel.findByPk(accountId);
        const t = await ctx.model.transaction();
        try {
            await account.setCompanys(companyData, { transaction: t });
            await t.commit();
            return true;
        } catch(err) {
            await t.rollback();
            ctx.throw(400, '操作失败');
        }
    }


    /**
     * 账号列表查询
     * @param {Object} $where 查询条件
     */
    async list() {
        const { page, size, offset } = this.ctx.paginate;
        // 查询条件
        const $where = { type: 'company' };

        const { keyword } = this.ctx.query;
        // 模糊查询
        if (keyword) {
            $where[Op.or] = [
                { username: { [Op.like]: `%${ keyword }%` } },
                { name: { [Op.like]: `%${ keyword }%` } },
                { phone: { [Op.like]: `%${ keyword }%` } }
            ]
        }

        // 查询列表
        const result = await this.AccountModel.findAll({
            where: $where,
            attributes: [ 
                'id', 'username', 'name', 'phone', 'address', 'last_ip', 
                'type', 'status', 'updated_at', 'created_at'
            ],
            // 查询绑定的公司信息
            include: {
                model: this.CompanyModel,
                as: 'companys',
                through: { attributes: [] },
                attributes: ['id', 'title']
            },
            order: [['created_at', 'DESC']],
            offset,
            limit: size,
        });

        // 统计
        const count = await this.AccountModel.count({ where: $where });

        return {
            list: result,
            total: count,
            page,
            size
        }
    }

    /**
     * 获取当前登录账号信息
     */
    async getInfo() {
        return this.AccountModel.findOne({
            where: { id: this.service.auth.info.id },
            attributes: [ 'id', 'username', 'name', 'phone', 'address', 'last_ip', 'updated_at', 'type' ]
        })
    }

    /**
     * 当前登录账号，更新基本资料
     * @param {String} username 账号
     * @param {Object} data 
     * @param {String} data.password 密码
     * @param {String} data.name 姓名
     * @param {String} data.phone 电话
     * @param {Number} data.status 状态
     */
    async updateInfo(username, data) {
        const ctx = this.ctx
        const result = await this.AccountModel.findOne({
            where: {  username  }
        });

        ['name', 'phone', 'address', 'status', 'password'].forEach(key => {
            if (_.has(data, key)) {
                if (key=='password' && !_.isEmpty(data.password)) {
                    result[key] = ctx.helper.getHash(data.password);
                    return;
                } 
                result[key] = data[key];
            }
        });

        await result.save();

        return true;
    }

    /**
     * 当前登录账号，重置密码
     * @param {*} oldPass 
     * @param {*} newPass 
     */
    async updatePassword(username, oldPass, newPass) {
        const ctx = this.ctx
        const result = await this.AccountModel.findOne({
            where: {  username  }
        })
        // 验证旧密码
        const isCheck = ctx.helper.checkHash(oldPass, result.password);
        if (!isCheck) ctx.throw(400, '旧密码不正确');
        await result.update({
            password: ctx.helper.getHash(newPass)
        });

        // 记录更新密码,时间
        ctx.runInBackground(async () => {
            await this.LogService(2, result.id);
        });

        return true;
    }


}


module.exports = AccountService;