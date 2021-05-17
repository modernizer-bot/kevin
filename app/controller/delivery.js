/*
 * 分类管理
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 01:45:30
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');
const { Op } = require("sequelize");

@Route('/api/delivery') //路由前缀
@Middleware(Api()) //Api中间件

class DeliveryController extends Controller {

    get DeliveryModel() {
        return this.app.model.Delivery;
    }

    get CompanyModel() {
        return this.app.model.Company;
    }

    // 列表
    @HttpGet('/list')
    @Middleware(Auth('delivery.list'))
    async list() {
        const ctx = this.ctx;
        const { keyword, company_id } = ctx.query;
        // 查询条件
        const $where = { 
            status: 1,
        };

        // 企业账号只可以查询绑定公司的信息
        const AccountInfo = ctx.service.auth.info;
        if (AccountInfo.type=='company') {
            $where.company_id = AccountInfo.companys;
            if(company_id && AccountInfo.companys.includes(Number(company_id))) {
                $where.company_id = company_id;
            }
        } else if (company_id) {
            $where.company_id = company_id;
        }

        // 模糊查询
        if (keyword) {
            $where[Op.or] = [
                { name: { [Op.like]: `%${ keyword }%` } },
                { phone: { [Op.like]: `%${ keyword }%` } }
            ]
        }
        
        // 查询列表
        const result = await this.DeliveryModel.findAll({
            where: $where,
            attributes: [ 
                'id', 'company_id', 'name', 'phone', 'updated_at', 'created_at'
            ],
            // 查询绑定的公司信息
            include: {
                as: 'company',
                model: this.CompanyModel,
                attributes: ['id', 'title']
            },
            order: [['created_at', 'DESC']],
        });

        return result
    }

    // 添加
    @HttpPost('/add')
    @Middleware(Auth('delivery.add'))
    async add() {
        const ctx = this.ctx;
        await ctx.validator.Delivery.edit();
        const data = _.pick(ctx.request.body, ['name', 'phone', 'company_id']);
        const result = await this.DeliveryModel.create(data);
        return result;
    }

    // 修改
    @HttpPost('/update')
    @Middleware(Auth('delivery.update'))
    async update() {
        const ctx = this.ctx;
        await ctx.validator.Delivery.edit();
        const { id } = ctx.request.body;
        const data = _.pick(ctx.request.body, ['name', 'phone', 'company_id']);
        await this.DeliveryModel.update(data, { where: { id } })
        return true;
    }

    // 删除
    @HttpPost('/del')
    @Middleware(Auth('delivery.del'))
    async del() {
        const ctx = this.ctx;
        const { id } = ctx.request.body;
        await this.DeliveryModel.update({ status: 0 }, { where: { id } })
        return true;
    }

}

module.exports = DeliveryController;
