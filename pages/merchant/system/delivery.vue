<template>
    <AdminPage title="送货人员管理">
        <template slot="tools">
            <el-button 
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit()"
            >添加送货人</el-button>
            <el-select v-model.trim="company_id" 
                style="width: 200px"
                @change="onChangeFilter"
            >
                <el-option value="" label="所有公司" />
                <el-option
                    v-for="item in ACCOUNT_COMPANY"
                    :key="item.id"
                    :value="String(item.id)"
                    :label="item.title"
                />
            </el-select>
        </template>

        <Table :data="LIST">
            <el-table-column label="ID" prop="id" width="60" fixed="left" align="center" />
            <el-table-column label="姓名" prop="name" width="150" align="center" />
            <el-table-column label="联系电话" prop="phone" width="150" align="center" />
            <el-table-column label="所属公司" prop="company.title" />
         
            <el-table-column label="创建时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="更新时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.updated_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="操作" width="120" v-slot="{ row }" align="center">
                <el-link size="small" type="primary" @click="handleEdit(row)">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="danger" @click="handleDelete(row)">删除</el-link>
            </el-table-column>
        </Table>


        <!-- 编辑 -->
        <DeliveryEdit ref="DeliveryEdit" />


    </AdminPage>
</template>


<script>

    import _ from 'underscore'
    import DeliveryEdit from './components/DeliveryEdit'
    import { mapState } from 'vuex'

    export default {

        watchQuery: true,

        components: { DeliveryEdit },

        async asyncData(ctx) {
            // 查询列表
            const result = await ctx.$api.Admin.Delivery.List({
                params: ctx.query
            });
            // 填充页面数据
            return {
                LIST: result,
                company_id: ctx.query.company_id || ''
            }
        },

        async fetch(ctx) {
            // 加载公司列表
            if (!ctx.store.state.ACCOUNT_COMPANY.length) {
                await ctx.store.dispatch('GET_ACCOUNT_COMPANY');
            }
        },

        data() {
            return {
                company_id: '',
            }
        },

        computed: {
            ...mapState(['ACCOUNT_COMPANY'])
        },

        methods: {

            // 添加，修改
            handleEdit(data) {
                this.$refs.DeliveryEdit.show(data)
            },

            // 公告筛选
            onChangeFilter(value) {
                let query = !value ? null : { company_id: value };
                this.$router.push({ query })
            },

            // 删除
            async handleDelete(row) {
                const data = { id: row.id }
                await this.$confirm('删除后不可恢复，确定删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    return this.$api.Admin.Delivery.Del({ data })
                }).then(res => {
                    this.$message.success('删除成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
            },

            
        }
    }
</script>
