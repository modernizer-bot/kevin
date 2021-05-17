/*
 * 分类管理
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 01:13:26
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const { Op } = require("sequelize");
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');

@Route('/api/company') //路由前缀
@Middleware(Api()) //Api中间件
class CompanyController extends Controller {

    get CompanyModel() {
        return this.app.model.Company;
    }

    // 分类是否存在
    async hasTitle(title, id) {
        const $where = { title };
        // 排除id
        if (id) {
            $where.id = {
                [Op.not]: id
            }
        }

        return this.CompanyModel.count({ where: $where })
    }
    
    // 列表
    @HttpGet('/all')
    @Middleware(Auth('company.all'))
    async index() {
        const data = await this.app.cache.get('company', async () => {
            return await this.setCache();
        });
        const AccountInfo = this.ctx.service.auth.info;
        if (AccountInfo.type==='admin') {
            return data
        } else {
            return data.filter(item => {
                return AccountInfo.companys.includes(item.id)
            })
        }
    }

    // 列表
    @HttpGet('/list')
    @Middleware(Auth('company.list'))
    async list() {
        const $where = { status: 1 };
        const AccountInfo = this.ctx.service.auth.info;
        if (AccountInfo.type=='company') {
            $where.id = AccountInfo.companys
        }
        return this.CompanyModel.findAll({ where: $where });
    }

    // 添加
    @HttpPost('/add')
    @Middleware(Auth('admin.company.add'))
    async add() {
        const ctx = this.ctx;
        await ctx.validator.Company.add();
        const { title, name, phone } = ctx.request.body;
        const data = {
            title,
            name,
            phone,
            status: 1,
        }
        const has = await this.hasTitle(title);
        if (has) ctx.throw(400, '公司名称已存在');
        const result = await this.CompanyModel.create(data);
        // 更新缓存
        ctx.runInBackground(async () => {
            await this.setCache();
        });
        return result;
    }

    // 修改
    @HttpPost('/update')
    @Middleware(Auth('admin.company.update'))
    async update() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        await ctx.validator.Company.update();
        const has = await this.hasTitle(data.title, data.id);
        if (has) ctx.throw(400, '公司名称已存在');
        await this.CompanyModel.update(_.pick(data, ['title', 'name', 'phone', 'status']), {
            where: {
                id: data.id
            }
        });

        // 更新缓存
        ctx.runInBackground(async () => {
            await this.setCache();
        });

        return true;
    }

    // 删除
    @HttpPost('/del')
    @Middleware(Auth('admin.category.del'))
    async del() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        await this.CompanyModel.update({
            status: 0
        }, {
            where: { id: data.id }
        })

        // 更新缓存
        ctx.runInBackground(async () => {
            await this.setCache();
        });

        return true;
    }

    // 更新缓存
    async setCache() {
        const result = await this.CompanyModel.findAll({
            where: { status: 1 },
            attributes: ['id', 'title', 'name', 'phone']
        });
        const store = this.app.cache;
        const data = await store.set('company', result, 0);
        return data;
    }
}

module.exports = CompanyController;
