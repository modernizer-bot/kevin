/*
 * 账号管理
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:26 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-18 13:24:14
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');

@Route('/api') //路由前缀
@Middleware(Api()) //Api中间件
class AccountController extends Controller {

    get AccountService() {
        return this.service.account
    }

    get AuthService() {
        return this.service.auth
    }

    // 发送验证码
    @HttpPost('/send_code')
    async sendCode() {
        const ctx = this.ctx;
        const { username } = ctx.request.body;
        if (!username || _.isEmpty(username)) {
            ctx.throw(400, '账号不能为空')
        }
        return await this.AccountService.sendCode(username);
    }

    // 登录
    @HttpPost("/login")
    async index() {
        const ctx = this.ctx;
        await ctx.validator.Account.login();
        const { username, password, code } = ctx.request.body;
        return await this.AccountService.login(username, password, code);
    }
s
    // 重置账号密码
    @HttpPost("/reset_password")
    async resetPass() {
        const ctx = this.ctx;
        await ctx.validator.Account.resetPass();
        const data = ctx.request.body;
        return this.AccountService.updatePassword( data.username, data.oldPass, data.newPass );
    }


    // 获取账号列表
    @HttpGet('/account/list')
    @Middleware(Auth('admin.account.list'))
    async list() {
        const ctx = this.ctx;
        const query = _.omit(ctx.query, ['page', 'size']);
        return await this.AccountService.list(query);
    }

    // 创建账号
    @HttpPost("/account/add")
    @Middleware(Auth('admin.account.add'))
    async add() {
        const ctx = this.ctx;
        await ctx.validator.Account.add();
        const data = ctx.request.body;
        return await this.AccountService.add(data);
    }

    // 管理员修改账号信息
    @HttpPost("/account/update")
    @Middleware(Auth('admin.account.update'))
    async update() {
        const ctx = this.ctx;
        await ctx.validator.Account.update();
        const data = ctx.request.body;
        return await this.AccountService.updateInfo(data.username, data );
    }

    // 修改当前登录账号信息
    @HttpPost("/account/update_info")
    @Middleware(Auth('account.update'))
    async updateInfo() {
        const ctx = this.ctx;
        await ctx.validator.Account.updateInfo();
        const data = _.pick(ctx.request.body, ['name', 'phone', 'address']);
        return await this.AccountService.updateInfo(this.AuthService.info.username, data);
     }

    // 获取当前登录账号信息
    @HttpGet("/account/info")
    @Middleware(Auth('account.info'))
    async info() {
        const ctx = this.ctx;
        return this.AccountService.getInfo();
    }

    // 重置账号密码
    @HttpPost("/account/reset_password")
    @Middleware(Auth('account.password'))
    async resetPassword() {
        const ctx = this.ctx;
        await ctx.validator.Account.resetPassword();
        const data = ctx.request.body;
        return this.AccountService.updatePassword( this.AuthService.info.username, data.oldPass, data.newPass );
    }

    // 绑定公司
    @HttpPost("/account/bind_company")
    @Middleware(Auth('admin.account.company'))
    async bindCompany() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        return this.AccountService.bindCompanys( data.id, data.companys || [] );
    }


}

module.exports = AccountController;