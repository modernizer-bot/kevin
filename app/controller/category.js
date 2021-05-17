/*
 * 分类管理
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 17:29:25
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');
const { Op } = require("sequelize");

@Route('/api/category') //路由前缀
@Middleware(Api()) //Api中间件
class CategoryController extends Controller {

    get CategoryModel() {
        return this.app.model.Category;
    }

    // 分类是否存在
    async hasName(name, id) {
        const $where = { name };
        // 排除id
        if (id) {
            $where.id = {
                [Op.not]: id
            }
        }
        return this.CategoryModel.count({ where: $where })
    }
    
    // 列表
    @HttpGet('/all')
    @Middleware(Auth('category.all'))
    async index() {
        return await this.app.cache.get('category', async () => {
            return await this.setCache();
        });
    }

    // 列表
    @HttpGet('/list')
    @Middleware(Auth('admin.category.list'))
    async list() {
        return this.CategoryModel.findAll({
            where: { status: 1 }
        })
    }

    // 添加
    @HttpPost('/add')
    @Middleware(Auth('admin.category.add'))
    async add() {
        const ctx = this.ctx;
        await ctx.validator.Category.add();
        const data = {
            name: ctx.request.body.name,
            status: 1,
        }
        const has = await this.hasName(data.name);
        if (has) ctx.throw(400, '分类已存在');
        const result = await this.CategoryModel.create(data);
        // 更新缓存
        ctx.runInBackground(async () => {
            await this.setCache();
        });
        return result;
    }

    // 修改
    @HttpPost('/update')
    @Middleware(Auth('admin.category.update'))
    async update() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        await ctx.validator.Category.update();
        const has = await this.hasName(data.name, data.id);
        if (has) ctx.throw(400, '分类已存在');
        const result = this.CategoryModel.update(_.pick(data, ['name', 'status']), {
            where: {
                id: data.id
            }
        })

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
        await this.CategoryModel.update({
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
        const result = await this.CategoryModel.findAll({
            where: { status: 1 },
            attributes: ['id', 'name']
        });
        const data = await this.app.cache.set('category', result, 0);
        return data;
    }
}

module.exports = CategoryController;
