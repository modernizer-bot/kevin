<template>
    <AdminPage title="商品订单">
        <template slot="menu">
            <a href="javascript:;" class="active">订单需求</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/order/delivery')">待收货</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/order/balance')">待结算</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/order/success')">已结算</a>
        </template>

        <template slot="tools">
            <span>
                <el-button icon="el-icon-plus" type="primary" @click="handlerOrderDemand()">发布需求</el-button>
                <el-button icon="el-icon-chat-dot-square" 
                    type="primary"
                    plain
                    @click="handlerSendNotice"
                    :disabled="!selected_list.length"
                >发送短信通知</el-button>
            </span>
            <el-date-picker
                v-model="searchForm.created_at"
                type="daterange"
                align="right"
                range-separator="-"
                value-format="yyyy-MM-dd"
                start-placeholder="下单开始日期"
                end-placeholder="下单结束日期"
                :picker-options="DateTimePickerOptionsQuick"
                style="width: 300px"
                @change="onChangeFilter"
            />
        </template>

        <Table :data="LIST"
            :total="total"
            :size="size"
            :page="page"
            @selection-change="e => selected_list = e"
        >
            <el-table-column type="selection" align="center"  fixed="left" />

            <el-table-column type="index" align="center" label="序号" width="55"  fixed="left" />

            <el-table-column label="设备类型" prop="category.name" width="80" align="center"  fixed="left" />

            <el-table-column label="需求描述" prop="desc" min-width="100"  fixed="left" />

            <el-table-column label="数量" prop="number"  width="60" align="center"/>
            
            <el-table-column label="需求接收方" v-slot="{ row }" width="100" align="center">
                {{ row.account.name }}
            </el-table-column>

            <el-table-column label="审批人" v-slot="{ row }" width="100" align="center">
                {{ row.check }}
            </el-table-column>

            <el-table-column label="经办人" v-slot="{ row }" width="100" align="center">
                {{ row.agent }}
            </el-table-column>

            <el-table-column label="下单时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="备注" prop="remark" min-width="100"/>

            <el-table-column label="操作" width="160" v-slot="{ row }" align="center" fixed="right">
                <el-link size="small" type="primary" @click="handlerOrderDemand([row])">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="danger" @click="handleDelete(row)">删除</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="info" @click="handleLogs(row)">日志</el-link>
            </el-table-column>
            
        </Table>

        <!-- 发布需求 -->
        <OrderDemand ref="OrderDemand" />
        <!-- 日志 -->
        <OrderLog ref="OrderLog" />

    </AdminPage>
</template>

<script>
    import _ from 'underscore'
    import OrderDemand from './components/OrderDemand'
    import OrderLog from './components/OrderLog'

    const SEARCH_FORM = {
        created_at: [],
    }

    export default {
        watchQuery: true,
        
        components: {
            OrderDemand, OrderLog
        },

        async asyncData(ctx) {

            // 请求参数
            const params = {
                ...ctx.query,
                ...ctx.$helper.getPerPage(ctx.query)
            }

            // 查询列表
            const result = await ctx.$api.Admin.Order.List({ params });

            let searchForm = Object.assign({}, SEARCH_FORM, _.pick(params, ['created_at']))
            
            // 填充页面数据
            return {
                LIST: result.list,
                page: params.page,
                size: params.size,
                total: result.total,
                searchForm,
                selected_list: [],
            }
        },

        async fetch(ctx) {
            const ReqArr = [];
            // 加载公司列表
            if (!ctx.store.state.ACCOUNT_COMPANY.length) {
                ReqArr.push( ctx.store.dispatch('GET_ACCOUNT_COMPANY') )
            }
            // 加载分类
            if (!ctx.store.state.CATEGORY.length) {
                ReqArr.push( ctx.store.dispatch('GET_CATEGORY') )
            }
            await Promise.all(ReqArr);
        },

        methods: {
            
            onChangeFilter(val) {
                this.$router.push({ query: {
                    created_at: val
                }});
            },
            // 添加需求
            handlerOrderDemand(data) {
                this.$refs.OrderDemand.show(data);
            },

            // 删除
            async handleDelete(row) {
                const data = { id: row.id }
                await this.$confirm('删除后不可恢复，确定删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    return this.$api.Admin.Order.Del({ data })
                }).then(res => {
                    this.$message.success('删除成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
            },

            // 日志
            async handleLogs(row) {
                const params = { order_id: row.id };
                this.$api.Admin.Order.Logs({ params }).then(res => {
                    this.$refs.OrderLog.show(res)
                }).catch(this.throw)
            },

            // 发送短信通知
            async handlerSendNotice() {
                let data = {};
                this.selected_list.forEach(item => {
                    const phone = item.account.phone
                    if (!data[phone]) {
                        data[phone] = {
                            phone: phone,
                            type: [],
                            content: [], 
                            number: 0, 
                        }
                    }
                    let group = data[phone];
                    group.number = Number(group.number) + Number(item.number);
                    group.type.push(item.category.name);
                    group.content.push(item.desc);
                })

                if (_.isEmpty(data)) return;
                data = Object.values(data).map(item => {
                    item.type = item.type.join("、")
                    item.content = item.content.join("、")
                    item.number = item.number
                    return item;
                })

                await this.$confirm('确定要发送短信通知给需求接收方？', '提示', {
                     type: 'warning',
                    confirmButtonText: '发送',
                }).then(() => {
                    return this.$api.Admin.Order.SendNotice({ data })
                }).then(res => {
                    this.$message.success("短信通知发送成功")
                }).catch(this.throw)
            }

            
        }
    }
</script>