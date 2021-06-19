<template>
    <AdminPage title="商品订单">
        <template slot="menu">
            <a href="javascript:;" class="active">订单需求</a>
            <a href="javascript:;" @click="jumpPage('/merchant/commodity/order/delivery')">待收货</a>
            <a href="javascript:;" @click="jumpPage('/merchant/commodity/order/balance')">待结算</a>
            <a href="javascript:;" @click="jumpPage('/merchant/commodity/order/success')">已结算</a>
        </template>

        <template slot="tools">
            <el-button icon="el-icon-plus" type="primary" @click="handlerOrderDemand()">添加需求</el-button>
            <el-button  
                :disabled="!selected_list.length"
                type="primary"
                @click="handlerOrderCommodity(selected_list)"
                icon="el-icon-document-copy"
            >批量处理商品订单</el-button>
        </template>

        <Table :data="LIST"
            :total="total"
            :size="size"
            :page="page"
            @selection-change="e => selected_list = e"
        >

            <el-table-column type="selection" align="center"  fixed="left" />

            <el-table-column label="设备类型" prop="category.name"  width="80" align="center"  fixed="left" />

            <el-table-column label="需求描述" prop="desc"  fixed="left" />

            <el-table-column label="数量" prop="number" width="60" align="center"/>

            <el-table-column label="创建时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="操作" width="120" v-slot="{ row }" align="center" fixed="right">
                <el-link size="small" type="primary" @click="handlerOrderDemand([row])">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="primary" @click="handlerOrderCommodity([row])">处理</el-link>
            </el-table-column>
            
        </Table>

        <!-- 填写需求商品 -->
        <OrderCommodity ref="OrderCommodity" />
        <OrderDemand ref="OrderDemand" />

    </AdminPage>
</template>

<script>
    import OrderDemand from './components/OrderDemand'
    import OrderCommodity from './components/OrderCommodity'

    export default {
        watchQuery: true,
        
        components: {
            OrderCommodity,
            OrderDemand
        },

        async asyncData(ctx) {

            // 请求参数
            const params = {
                ...ctx.query,
                ...ctx.$helper.getPerPage(ctx.query)
            }

            // 查询列表
            const result = await ctx.$api.Order.List({ params });
            
            // 填充页面数据
            return {
                LIST: result.list,
                page: params.page,
                size: params.size,
                total: result.total,
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

            // 监听多选
            handleSelectionChange(data) {
            },

            // 处理需求商品
            handlerOrderCommodity(data) {
                this.$refs.OrderCommodity.show(data)
            },

            // 添加需求
            handlerOrderDemand(data) {
                this.$refs.OrderDemand.show(data);
            },
            
        }
    }
</script>