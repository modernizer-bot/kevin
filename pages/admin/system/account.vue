<template>
    <AdminPage title="账号管理">
        <template slot="tools">
            <el-button 
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit()"
            >添加账号</el-button>

            <el-form @submit.native.prevent="handleSearch" inline>
                <el-form-item>
                    <el-input 
                        v-model="keyword"
                        placeholder="用户名，姓名，电话" 
                        style="width: 200px"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" native-type="submit">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
            
        </template>

        <Table :data="LIST"
            :total="total"
            :size="size"
            :page="page"
        >
            <el-table-column label="ID" prop="id" width="60" fixed="left" align="center" />
            <el-table-column label="用户名" prop="username" width="120" align="center" fixed="left"/>
            <el-table-column label="联系人" prop="name" width="100" align="center" />
            <el-table-column label="联系电话" prop="phone" align="center" width="120" />
            <el-table-column label="联系地址" prop="address" align="center" width="200" />
            <el-table-column label="关联公司" v-slot="{ row }" min-width="200" align="center">
                <template v-for="(item, i) in row.companys">
                    <p :key="i">{{ item.title }}</p>
                </template>
            </el-table-column>

            <el-table-column label="开启状态" v-slot="{ row }" width="100" align="center">
                <el-switch :value="row.status" :active-value="1" :inactive-value="0" 
                    @click.native="handleChangeStatus(row)"
                />
            </el-table-column>

            <el-table-column label="创建时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="操作" width="220" v-slot="{ row }" align="center"  fixed="right">
                <el-link size="small" type="primary" @click="handleEdit(row)">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="primary" @click="handleBindCompany(row)">关联公司</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="danger" @click="handleResetPassword(row)">重置密码</el-link>
            </el-table-column>
        </Table>


        <!-- 编辑 -->
        <AccountEdit ref="AccountEdit" />
        <ResetPassword ref="ResetPassword" />
        <BindCompany ref="BindCompany" />


    </AdminPage>
</template>


<script>
    import _ from 'underscore'
    import AccountEdit from './components/AccountEdit'
    import ResetPassword from './components/ResetPassword'
    import BindCompany from './components/BindCompany'

    export default {

        watchQuery: true,

        components: { AccountEdit, ResetPassword, BindCompany },

        async asyncData(ctx) {
            // 请求参数
            const params = {
                ...ctx.query,
                ...ctx.$helper.getPerPage(ctx.query)
            }
            // 查询列表
            const result = await ctx.$api.Admin.Account.List({ params });
            
            // 填充页面数据
            return {
                LIST: result.list,
                page: params.page,
                size: params.size,
                total: result.total,
                keyword: params.keyword || ''
            }
        },

        async fetch(ctx) {
            // 加载公司列表
            if (!ctx.store.state.ACCOUNT_COMPANY.length) {
                await ctx.store.dispatch('GET_ACCOUNT_COMPANY');
            }
        },

        methods: {

            // 重置查询
            resetSearch() {
                this.keyword = '';
                this.$router.push({ query: null });
            },

            // 查询
            handleSearch() {
                if (_.isEmpty(this.keyword)) return;
                this.$router.push({ query: { keyword: this.keyword } });
            },

            // 添加，修改
            handleEdit(data) {
                this.$refs.AccountEdit.show(data)
            },

            // 重置密码
            handleResetPassword(data) {
                this.$refs.ResetPassword.show(data)
            },

            // 修改状态
            async handleChangeStatus(row) {
                const data = {
                    username: row.username,
                    status: !!row.status ? 0 : 1
                }
                await this.$api.Admin.Account.Edit({ data }).then(res => {
                    row.status = data.status;
                }).catch(this.throw)
            },

            // 绑定公司
            handleBindCompany(data) {
                this.$refs.BindCompany.show(data)
            }
            
        }
    }
</script>

