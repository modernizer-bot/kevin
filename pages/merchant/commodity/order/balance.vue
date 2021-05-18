<template>
    <AdminPage title="商品订单">
        <template slot="menu">
            <a href="javascript:;" @click="jumpPage('/merchant/commodity/order')">订单需求</a>
            <a href="javascript:;" @click="jumpPage('/merchant/commodity/order/delivery')">待收货</a>
            <a href="javascript:;" class="active">待结算</a>
            <a href="javascript:;" @click="jumpPage('/merchant/commodity/order/success')">已结算</a>
        </template>

        <el-form inline slot="filter"  @submit.native.prevent="handleSearch">
            <el-form-item label="供货商">
                <el-select v-model="searchForm.company_id" 
                    style="width: 200px"
                >
                    <el-option value="" label="全部" />
                    <el-option
                        v-for="item in ACCOUNT_COMPANY"
                        :key="item.id"
                        :value="String(item.id)"
                        :label="item.title"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="设备类型">
                <el-select v-model="searchForm.category_id" 
                    style="width: 100px"
                >
                    <el-option value="" label="全部" />
                    <el-option
                        v-for="item in CATEGORY"
                        :key="item.id"
                        :value="String(item.id)"
                        :label="item.name"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="供货日期">
                <el-date-picker
                    v-model="searchForm.supplied_at"
                    type="daterange"
                    align="right"
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="DateTimePickerOptionsQuick"
                    style="width: 240px"
                />
            </el-form-item>

             <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit">查询</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>

        </el-form>

        <template slot="tools">
            <el-button  
                :disabled="!selected_list.length"
                type="primary"
                @click="handlerOrderFinal(selected_list)"
                icon="el-icon-money"
            >批量填写结算信息</el-button>
        </template>


        <Table :data="LIST"
            :total="total"
            :size="size"
            :page="page"
            :summary-method="getSummaries"
            show-summary
            @selection-change="e => selected_list = e"
            border
        >
            <el-table-column type="expand" v-slot="{ row }" width="50"  fixed="left">
                <ul class="table-expand">
                    <el-divider content-position="left">订单需求信息</el-divider>
                    <li><label>订单需求</label>{{row.desc}}</li>
                    <li><label>下单时间</label>{{ $helper.formatDate(row.created_at, 'Y年m月d日 H:i') }}</li>
                    <el-divider content-position="left">商品详情</el-divider>
                    <li><label>供货商</label>{{row.company.title}}</li>
                    <li><label>商品名称</label>{{row.product.name}}</li>
                    <li><label>设备类型</label>{{row.category.name}}</li>
                    <li><label>参数</label>{{row.product.params}}</li>
                    <li><label>规格</label>{{row.product.unit}}</li>
                    <li><label>数量</label>{{row.number}}</li>
                    <li><label>单价</label>{{row.price}}元</li>
                    <li><label>金额</label>{{row.money}}元</li>
                    <li><label>卖场链接</label>
                        <el-link :href="row.product.link" :underline="false" target="_blank">点击查看卖场商品信息</el-link>
                    </li>
                    <el-divider content-position="left">送货信息</el-divider>
                    <li><label>送货人</label>{{ row.delivery.name }}</li>
                    <li><label>送货人电话</label>{{ row.delivery.phone }}</li>
                    <li><label>供货时间</label>{{ $helper.formatDate(row.supplied_at, 'Y年m月d日 H:i') }}</li>
                    <li><label>收货日期</label>{{ $helper.formatDate(row.use_at, 'Y年m月d日') }}</li>
                </ul>
            </el-table-column>

            <el-table-column type="selection" align="center"  fixed="left" />

            <el-table-column label="设备类型" prop="category.name"  width="80" align="center"  fixed="left" />

            <el-table-column label="商品名称" prop="product.name" min-width="200"  fixed="left" />

            <el-table-column label="规格" prop="product.unit" width="60" align="center"/>

            <el-table-column label="数量" prop="number" width="60" align="center" />

            <el-table-column label="单价(元)" prop="price" width="100" align="center" />

            <el-table-column label="金额(元)" prop="money" width="100" align="center" />
            
            <el-table-column label="供货商" prop="company.title" width="150" align="center" />

            <el-table-column label="送货人" prop="delivery.name" width="80" align="center" />

            <el-table-column label="下单时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="供货时间" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.supplied_at, 'Y-m-d H:i') }}
            </el-table-column>
            
        </Table>

        <!-- 结算 -->
        <OrderFinal ref="OrderFinal" />

    </AdminPage>
</template>

<script>

    import _ from 'underscore'
    import { mapState } from 'vuex'
    import OrderFinal from './components/OrderFinal'

    const SEARCH_FORM = {
        company_id: '',
        category_id: '',
        supplied_at: []
    }

    export default {
        
        watchQuery: true,

        components: {
            OrderFinal
        },

        async asyncData(ctx) {
            
            // 请求参数
            const params = {
                ...ctx.query,
                ...ctx.$helper.getPerPage(ctx.query),
                status: 3
            }

            // 查询列表
            const result = await ctx.$api.Order.List({ params });

            let searchForm = Object.assign({}, SEARCH_FORM, _.pick(params, [
                'company_id', 'category_id', 'supplied_at'
            ]))
            
            // 填充页面数据
            return {
                LIST: result.list,
                page: params.page,
                size: params.size,
                total: result.total,
                searchForm,
                selected_list: []
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

        data() {
            return {
                searchForm: _.cloneDeep(SEARCH_FORM)
            }
        },

        computed: {
            ...mapState(['ACCOUNT_COMPANY', 'CATEGORY'])
        },
      
        methods: {

            // 计算总价
            getSummaries({ columns, data }) {
                const sums = []
                columns.forEach((column, index) => {
                    if (index===0) {
                        sums[index] = '总价';
                        return;
                    }
                    if (column.property!='money') {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item.money));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            return  (prev * 1000 + curr * 1000 ) / 1000
                        }, 0).toFixed(2)
                    } else {
                        sums[index] = ''
                    }
                })

                return sums;
            },

            // 重置查询
            resetSearch() {
                this.searchForm = _.cloneDeep(SEARCH_FORM);
                this.$router.push({ query: null });
            },

            // 查询
            handleSearch() {
                
                const query = {};
                for (const k in this.searchForm) {
                    const v = this.searchForm[k];
                    if (!_.isEmpty(v)) {
                        query[k] = v;
                    }
                }
                this.$router.push({ query });
            },

            // 批量结算
            handlerOrderFinal(data) {
                // 验证供货商是否相同
                let Company = [];
                for (const item of data) {
                    if (!Company.includes(item.company_id)) {
                        Company.push(item.company_id)
                    }
                }

                if (Company.length > 1) {
                    return this.$message.error('供货商必须相同')
                }

                this.$refs.OrderFinal.show(data)
            },

        }
    }
</script>