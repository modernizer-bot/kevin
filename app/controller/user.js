/*
 * 分类管理
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-12 18:41:22
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');
const { Op } = require("sequelize");

@Route('/api/user') //路由前缀
@Middleware(Api()) //Api中间件

class UserController extends Controller {

    get UserModel() {
        return this.app.model.User;
    }

    // 导入表格
    @HttpPost('/import')
    @Middleware(Auth('admin.user.import'))
    async import() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        if (!_.isArray(data)) {
            ctx.throw(400, '数据格式错误');
        }
        await this.UserModel.bulkCreate(data);
        return true;
    }

    // 列表
    @HttpGet('/list')
    @Middleware(Auth('admin.user.list'))
    async list() {
        const ctx = this.ctx;
        const { keyword } = ctx.query;
        // 查询条件
        const $where = { status: 1 };
        
        // 模糊查询
        if (keyword) {
            $where[Op.or] = [
                { name: { [Op.like]: `%${ keyword }%` } },
                { address: { [Op.like]: `%${ keyword }%` } },
                { department: { [Op.like]: `%${ keyword }%` } },
                { phone: { [Op.like]: `%${ keyword }%` } }
            ]
        }
        
        const { page, size, offset } = ctx.paginate;
        // 查询列表
        const result = await this.UserModel.findAll({
            where: $where,
            attributes: [ 
                'id', 'name', 'phone', 'address', 'department', 'updated_at', 'created_at'
            ],
            offset,
            limit: size,
        });

        // 统计
        const count = await this.UserModel.count({ where: $where });

        return {
            list: result,
            total: count,
            page,
            size
        }
    }

    // 添加
    @HttpPost('/add')
    @Middleware(Auth('admin.user.add'))
    async add() {
        const ctx = this.ctx;
        await ctx.validator.User.edit();
        const result = await this.UserModel.create(data);
        return result;
    }

    // 修改
    @HttpPost('/update')
    @Middleware(Auth('admin.user.update'))
    async update() {
        const ctx = this.ctx;
        const { id } = ctx.request.body;
        await ctx.validator.User.edit();
        const data = _.pick(ctx.request.body, ['name', 'phone', 'address', 'department']);
        await this.UserModel.update(data, { where: { id } })
        return true;
    }

    // 删除
    @HttpPost('/del')
    @Middleware(Auth('admin.user.del'))
    async del() {
        const ctx = this.ctx;
        const { id } = ctx.request.body;
        await this.UserModel.update({ status: 0 }, { where: { id } })
        return true;
    }

}

module.exports = UserController;
