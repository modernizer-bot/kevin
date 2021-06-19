/*
 * 订单
 * @Author: chandre 
 * @Date: 2021-05-12 14:45:29 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-06-19 22:20:07
 */


const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpGet, Middleware, HttpPost } = require('egg-decorator-router');
const Api = require('../middleware/api');
const Auth = require('../middleware/auth');
const { Op } = require("sequelize");

@Route('/api/order') //路由前缀
@Middleware(Api()) //Api中间件
class OrderController extends Controller {
    
    get OrderModel() { return this.app.model.Order }
    get AccountModel() { return this.app.model.Account }
    get ProductModel() { return this.app.model.Product }
    get UserModel() { return this.app.model.User }
    get DeliveryModel() { return this.app.model.Delivery }
    get CategoryModel() { return this.app.model.Category }
    get CompanyModel() { return this.app.model.Company }
    get TicketModel() { return this.app.model.Ticket }
    get LogModel() { return this.app.model.OrderLog }

    get LogService() { return this.service.log.Order }
    get CodeService() { return this.service.code }

    // 订单日志
    @HttpGet('/logs')
    @Middleware(Auth('admin.order.logs'))
    async logs() {
        const { order_id } = this.ctx.query;
        return await this.LogModel.findAll({
            where: {
                order_id,
            },
            include: [
                {
                    as: 'account', model: this.AccountModel, attributes: ['id', 'username', 'name']
                },
            ]
        })
    }

    // 添加商品需求订单
    @HttpPost('/add')
    @Middleware(Auth('order.add'))
    async add() {
        const { ctx } = this;
        const reqData = ctx.request.body;
        if (!_.isArray(reqData) || _.isEmpty(reqData) ) {
            ctx.throw(412, '数据格式不正确')
        }
        const data = reqData.map(item => {
            return _.pick(item, [
                'desc', 'account_id', 'category_id', 'user_id', 'number', 'remark', 'agent', 'check'
            ]);
        });

        const result =  await this.OrderModel.bulkCreate(data);

        ctx.runInBackground(async () => {
            const ids = result.map(item => item.id);
            await this.LogService(ids, '发布需求')
        })
        
        return result;
    }

    // 修改商品需求订单
    @HttpPost('/update')
    @Middleware(Auth('order.update'))
    async update() {
        const ctx = this.ctx;
        
        const id = ctx.request.body.id;
        const data = _.pick(ctx.request.body, [
            'desc', 'account_id', 'category_id', 'user_id', 'number', 'remark', 'check', 'agent', 'status', 'use_at'
        ]);

        const t = await ctx.model.transaction();
        try {
            const result =  await this.OrderModel.update(data, {
                where: { id },
                transaction: t
            });
            await t.commit();
            ctx.runInBackground(async () => {
                let desc = '更新需求'
                if (data.status === 3) {
                    desc = '确认收货，添加使用人'
                }
                await this.LogService(id, desc)
            });
            return true;
        } catch(err) {
            await t.roolback();
            ctx.throw(400, '操作失败');
        }
    }

    // 商品需求列表
    @HttpGet('/list')
    @Middleware(Auth('admin.order.list'))
    async list() {
        const ctx = this.ctx;

        // 查询条件
        const $where = {
            status: ctx.query.status || 1,
        };

        let { category_id, company_id, supplied_at, final_at, created_at } = ctx.query;
        company_id && ($where['company_id'] = company_id);
        category_id && ($where['category_id'] = category_id);

        // 需求发布时间
        if (!_.isEmpty(created_at)) {
            created_at = created_at.split(",");
            if (created_at.length===2) {
                $where.created_at = {
                    [Op.between] : [new Date(`${created_at[0]} 00:00:00`), new Date(`${created_at[1]} 23:59:59`)]
                }
            }
        }

        // 供货时间筛选
        if (!_.isEmpty(supplied_at)) {
            supplied_at = supplied_at.split(",");
            if (supplied_at.length===2) {
                $where.supplied_at = {
                    [Op.between] : [new Date(`${supplied_at[0]} 00:00:00`), new Date(`${supplied_at[1]} 23:59:59`)]
                }
            }
        }

        // 结算时间筛选
        if (!_.isEmpty(final_at)) {
            final_at = final_at.split(",");
            if (final_at.length===2) {
                $where.final_at = {
                    [Op.between] : [new Date(`${final_at[0]} 00:00:00`), new Date(`${final_at[1]} 23:59:59`)]
                }
            }
        }

        // 排序
        const sort = [];
        switch (Number($where.status)) {
            case 2:
            case 3:
                sort.push(['supplied_at', 'ASC'])
            break;
            case 4:
                sort.push(['final_at', 'ASC'])
            break;
            default: 
                sort.push(['created_at', 'ASC']);
        }

        // 查询列表
        const { page, size, offset } = ctx.paginate;
        const result = await this.OrderModel.findAll({
            where: $where,
            include: [
                // 分类
                {
                    as: 'category', model: this.CategoryModel, attributes: ['id', 'name']
                },
                // 供货商
                {
                    as: 'company', model: this.CompanyModel, attributes: ['id', 'title', 'name']
                },
                // 使用人
                {
                    as: 'user', model: this.UserModel, attributes: ['id', 'name', 'address', 'phone', 'department']
                },
                // 接收方
                {
                    as: 'account', model: this.AccountModel, attributes: ['id', 'username', 'phone', 'name']
                },
                // 送货人
                {
                    as: 'delivery', model: this.DeliveryModel, attributes: ['id', 'name', 'phone']
                },
                // 商品信息
                {
                    as: 'product', model: this.ProductModel, attributes: ['id', 'name', 'params', 'unit', 'link']
                },
                // 发票信息
                {
                    as: 'ticket', model: this.TicketModel, attributes: ['id', 'code', 'number', 'date' ]
                }
            ],
            order: sort,
            offset,
            limit: size,
        });

        // 统计
        const count = await this.OrderModel.count({ where: $where });

        return {
            list: result,
            total: count,
            page,
            size
        }
    }

    // 发送调货需求短信
    @HttpPost('/send_notice')
    @Middleware(Auth('admin.order.send_notice'))
    async sendNotice() {
        const { ctx } = this;
        const data = ctx.request.body;
        if (!_.isArray(data) || _.isEmpty(data)) ctx.throw(400, '数据格式错误');
        await this.CodeService.sendNotice(data).then(res => {
            ctx.logger.info(`发送调货需求短信成功：${ JSON.stringify(data) }`);
        }).catch(err => {
            console.log(err)
            ctx.logger.error(`发送调货需求短信失败：${ JSON.stringify(data) }`);
        })
        return true;
    }

    // 删除商品需求
    @HttpPost('/del')
    @Middleware(Auth('admin.order.del'))
    async del() {
        const ctx = this.ctx;
        const { id } = ctx.request.body;
        await this.OrderModel.update({ status: 0 }, { where: { id } })
        ctx.runInBackground(async () => {
            await this.LogService(id, '删除订单需求')
        });
        return true;
    }


    // 供货商列表
    @HttpGet('/company_list')
    @Middleware(Auth('order.list'))
    async company_list() {
        const ctx = this.ctx;

        // 查询条件
        const $where = {
            status: ctx.query.status || 1
        };

        let { category_id, company_id, supplied_at, final_at } = ctx.query;

        // 企业账号只可以查询绑定公司的信息
        const AccountInfo = ctx.service.auth.info;
        $where.account_id = AccountInfo.parent_id || AccountInfo.id;
        
        if ($where.status > 1) {
            // 只查询当前账号绑定的公司
            $where['company_id'] = company_id || AccountInfo.companys;
            category_id && ($where['category_id'] = category_id);
        }

        // 供货时间筛选
        if (!_.isEmpty(supplied_at)) {
            supplied_at = supplied_at.split(",");
            if (supplied_at.length===2) {
                $where.supplied_at = {
                    [Op.between] : [new Date(`${supplied_at[0]} 00:00:00`), new Date(`${supplied_at[1]} 23:59:59`)]
                }
            }
        }

        // 结算时间筛选
        if (!_.isEmpty(final_at)) {
            final_at = final_at.split(",");
            if (final_at.length===2) {
                $where.final_at = {
                    [Op.between] : [new Date(`${final_at[0]} 00:00:00`), new Date(`${final_at[1]} 23:59:59`)]
                }
            }
        }

        // 排序
        const sort = [];
        switch (Number($where.status)) {
            case 2:
            case 3:
                sort.push(['supplied_at', 'ASC'])
            break;
            case 4:
                sort.push(['final_at', 'ASC'])
            break;
            default: 
                sort.push(['created_at', 'ASC']);
        }

        // 查询列表
        const { page, size, offset } = ctx.paginate;
        const result = await this.OrderModel.findAll({
            where: $where,
            attributes: [
                'id', 'desc', 'category_id', 'account_id', 'company_id', 'delivery_id', 'product_id', 'ticket_id',
                'price', 'money', 'number', 'supplied_at', 'updated_at', 'created_at', 'final_at', 'use_at', 'check', 'agent'
            ],
            include: [
                // 分类
                {
                    as: 'category', model: this.CategoryModel, attributes: ['id', 'name']
                },
                // 供货商
                {
                    as: 'company', model: this.CompanyModel, attributes: ['id', 'title', 'name']
                },
                // 送货人
                {
                    as: 'delivery', model: this.DeliveryModel, attributes: ['id', 'name', 'phone']
                },
                // 商品信息
                {
                    as: 'product', model: this.ProductModel, attributes: ['id', 'name', 'price', 'params', 'unit', 'link']
                },
                // 发票信息
                {
                    as: 'ticket', model: this.TicketModel, attributes: ['id', 'code', 'number', 'date' ]
                }
            ],
            order: sort,
            offset,
            limit: size,
        });

        // 统计
        const count = await this.OrderModel.count({ where: $where });

        return {
            list: result,
            total: count,
            page,
            size
        }
    }

    // 商品订单更新商品信息
    @HttpPost('/update_product')
    @Middleware(Auth('order.update.product'))
    async updateProduct() {
        const { ctx } = this;
        let data = ctx.request.body;
        if (!_.isArray(data)) {
            ctx.throw(400, '提交的数据格式不正确')
        }
        
        const updateData = [];
        const createData = [];

        data.forEach(item => {
            item.money = Number(item.price) * Number(item.number);
            item.supplied_at = new Date();
            item.status = 2;
            if (item.id) {
                updateData.push(item)
            } else {
                createData.push(item)
            }
        })

        const t = await ctx.model.transaction();

        try {
            let res_update = null;
            
            // 更新数据
            if (updateData.length) {
                res_update = await this.OrderModel.bulkCreate(updateData,{
                    transaction: t,
                    updateOnDuplicate: [
                        'price', 'money', 'supplied_at', 'status', 'company_id', 'delivery_id', 'product_id', 'number'
                    ]
                });
            }

            // 补充数据
            let res_create = null;
            if (createData.length) {
                res_create = await this.OrderModel.bulkCreate(createData, { transaction: t });
            }
            
            await t.commit();
            
            // 保存日志
            ctx.runInBackground(async () => {
                let ids = [];
                if (res_update) {
                    ids = updateData.map(item => item.id );
                    await this.LogService(ids, '供货商更新商品信息')
                }
                if (res_create) {
                    ids = res_create.map(item => item.id );
                    await this.LogService(ids, '供货商补充需求商品信息')
                }
            });
            
            return true;
        } catch(err) {
            await t.roolback();
            ctx.throw(400, '操作失败');
        }
    }

    // 商品订单更新结算信息
    @HttpPost('/update_final')
    @Middleware(Auth('order.update.final'))
    async updateFinal() {
        const { ctx, TicketModel, OrderModel } = this;
        const data = ctx.request.body;
        const t = await ctx.model.transaction();
        try {
            // 创建发票信息
            const result = await TicketModel.create(_.pick(data, [
                'company_id', 'code', 'number', 'date', 'money'
            ]), { transaction: t });

            // 更新订单数据
            await OrderModel.update({
                status: 4, 
                ticket_id: result.id, //发票ID
                final_at: new Date(), //发票信息填写时间
            }, {
                transaction: t,
                where: {
                    id: data.order_id
                }
            })
            
            await t.commit();
            ctx.runInBackground(async () => {
                await this.LogService(data.order_id, '供货商添加结算信息')
            });

            return true;
        } catch(err) {
            await t.roolback();
            ctx.throw(400, '操作失败');
        }
    }
}

module.exports = OrderController;