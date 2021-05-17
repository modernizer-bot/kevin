/*
 * 报表
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 23:02:17
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');
const { Op, where, col, fn } = require("sequelize");

const path = require('path')
const fs = require('fs')
const ejsexcel = require('ejsexcel')
const tplPath = path.resolve(__dirname, '../public/template');


@Route('/api/report') //路由前缀
@Middleware(Api()) //Api中间件

class ReportController extends Controller {
    get OrderModel() { return this.app.model.Order }
    get AccountModel() { return this.app.model.Account }
    get ProductModel() { return this.app.model.Product }
    get UserModel() { return this.app.model.User }
    get DeliveryModel() { return this.app.model.Delivery }
    get CategoryModel() { return this.app.model.Category }
    get CompanyModel() { return this.app.model.Company }
    get TicketModel() { return this.app.model.Ticket }


    // 月
    @HttpGet('/month')
    @Middleware(Auth('admin.report.month'))
    async month() {
        const { ctx, OrderModel, ProductModel } = this;
        const { date } = ctx.query;
        const $where = where(
            fn('DATE_FORMAT', col('use_at'), '%Y%m'),
            "=",
            fn('DATE_FORMAT', new Date(date), '%Y%m'),
        )

        const result = OrderModel.findAll({
            attributes: [
                'id', 'remark', 'price', 'money', 'number', 'use_at', 'agent'
            ],
            where: {
                [Op.and]: $where,
                status: {
                    [Op.between]: [3, 4],
                }
            },
            include: [
                // 商品信息
                {
                    as: 'product', model: ProductModel, attributes: ['name', 'unit']
                },
                // 使用人
                {
                    as: 'user', model: this.UserModel, attributes: ['name', 'address', 'department']
                },
            ],
            order: [['use_at', 'ASC']],
        })
        return result

    }

    // 季度
    @HttpGet('/quarter')
    @Middleware(Auth('admin.report.quarter'))
    async quarter() {
        const { ctx, OrderModel, ProductModel } = this;
        const { year, quarter } = ctx.query;
        const date = new Date(`${year}-${ quarter * 3 }`);
        const $where = {
            [Op.and]: [
                // 年度
                where( fn('DATE_FORMAT', col('use_at'), '%Y'), "=", fn('DATE_FORMAT', date, '%Y') ),
                // 季度
                where( fn('QUARTER', col('use_at') ), "=", fn('QUARTER', date ) ),
            ],
        }

        const result = OrderModel.findAll({
            attributes: [
                'company_id',
                'agent',
                'money',
            ],
            where: {
                ...$where,
                status: {
                    [Op.between]: [3, 4],
                }
            },
            include: [
                // 供货商
                {
                    as: 'company', model: this.CompanyModel, attributes: ['title', 'name', 'phone']
                },
                // 商品信息
                {
                    as: 'product', model: ProductModel, attributes: ['name', 'unit']
                },
            ],
            order: [['use_at', 'ASC']],
        })
        return result
    }

    // 固定资产
    @HttpGet('/assets')
    @Middleware(Auth('admin.report.assets'))
    async assets() {
        const { ctx, OrderModel, ProductModel } = this;
        const { year, quarter } = ctx.query;
        const date = new Date(`${year}-${ quarter * 3 }`);
        const $where = {
            [Op.and]: [
                // 年度
                where( fn('DATE_FORMAT', col('use_at'), '%Y'), "=", fn('DATE_FORMAT', date, '%Y') ),
                // 季度
                where( fn('QUARTER', col('use_at') ), "=", fn('QUARTER', date ) ),
            ],
        }

        const result = OrderModel.findAll({
            attributes: [
                'money', 'use_at', 'agent', 'number', 'price'
            ],
            where: {
                ...$where,
                price: {
                    [Op.gte]: 1000
                },
                status: {
                    [Op.between]: [3, 4],
                }
            },
            include: [
                // 商品信息
                {
                    as: 'product', model: ProductModel, attributes: ['name', 'unit']
                },
                // 使用人
                {
                    as: 'user', model: this.UserModel, attributes: ['name', 'address', 'department']
                },
            ],
            order: [['use_at', 'ASC']],
        })
        return result

    }
    

}


module.exports = ReportController