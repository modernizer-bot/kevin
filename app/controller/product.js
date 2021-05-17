/*
 * 分类管理
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 14:02:19
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');
const { Op } = require("sequelize");

@Route('/api/product') //路由前缀
@Middleware(Api()) //Api中间件

class ProductController extends Controller {

    get ProductModel() {
        return this.app.model.Product;
    }

    get CompanyModel() {
        return this.app.model.Company;
    }

    get CategoryModel() {
        return this.app.model.Category;
    }

    // 导入表格
    @HttpPost('/import')
    @Middleware(Auth('product.import'))
    async import() {
        const ctx = this.ctx;
        const data = ctx.request.body;
        if (!_.isArray(data)) {
            ctx.throw(400, '数据格式错误');
        }
        await this.ProductModel.bulkCreate(data);
        return true;
    }

    // 列表
    @HttpGet('/list')
    @Middleware(Auth('product.list'))
    async list() {
        const ctx = this.ctx;
        const { name, company_id, category_id } = ctx.query;
        // 查询条件
        const $where = { status: 1 };

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

        // 按分类ID查询
        if (category_id) {
            $where.category_id = category_id;
        }
        
        // 模糊查询
        if (name) {
            $where[Op.or] = [
                { name: { [Op.like]: `%${ name }%` } },
                { params: { [Op.like]: `%${ name }%` } }
            ]
        }
        
        const { page, size, offset } = ctx.paginate;

        // 查询列表
        const result = await this.ProductModel.findAll({
            where: $where,
            attributes: [ 
                'id', 'company_id', 'category_id', 'name', 'params', 'unit', 'price', 'link',
                'updated_at', 'created_at'
            ],
            // 查询绑定的公司信息
            include: [
                {
                    as: 'category',
                    model: this.CategoryModel,
                    attributes: ['id', 'name']
                },
                {
                    as: 'company',
                    model: this.CompanyModel,
                    attributes: ['id', 'title']
                }
            ],
            order: [['id', 'DESC']],
            offset,
            limit: size,
        });
        
        // 统计
        const count = await this.ProductModel.count({ where: $where });

        return {
            list: result,
            total: count,
            page,
            size
        }
    }

    // 添加
    @HttpPost('/add')
    @Middleware(Auth('product.add'))
    async add() {
        const ctx = this.ctx;
        await ctx.validator.Product.edit();
        const data = _.pick(ctx.request.body, [
            'id', 'name', 'params', 'unit', 'price', 'link', 'company_id', 'category_id'
        ]);
        const result = await this.ProductModel.create(data);
        return result;
    }

    // 修改
    @HttpPost('/update')
    @Middleware(Auth('product.update'))
    async update() {
        const ctx = this.ctx;
        await ctx.validator.Product.edit();
        const { id } = ctx.request.body;
        const data = _.pick(ctx.request.body, [
            'id', 'name', 'params', 'unit', 'price', 'link', 'company_id', 'category_id'
        ]);
        await this.ProductModel.update(data, { where: { id } })
        return true;
    }

    // 删除
    @HttpPost('/del')
    @Middleware(Auth('product.del'))
    async del() {
        const ctx = this.ctx;
        const { id } = ctx.request.body;
        await this.ProductModel.update({ status: 0 }, { where: { id } })
        return true;
    }

}

module.exports = ProductController;
