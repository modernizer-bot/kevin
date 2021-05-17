<template>
    <AdminPage title="公司信息管理">
        <template slot="tools">
            <el-button 
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit()"
            >添加公司信息</el-button>
        </template>

        <Table :data="LIST">
            <el-table-column label="ID" prop="id" width="60" fixed="left" align="center" />
            <el-table-column label="公司名称" prop="title" />
            <el-table-column label="联系人" prop="name" width="100" align="center" />
            <el-table-column label="联系电话" prop="phone" width="150" align="center" />
         
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
        <CompanyEdit ref="CompanyEdit" />


    </AdminPage>
</template>


<script>

    import CompanyEdit from './components/CompanyEdit'

    export default {

        watchQuery: true,

        components: { CompanyEdit },

        async asyncData(ctx) {
            // 查询列表
            const result = await ctx.$api.Admin.Company.List();
            // 填充页面数据
            return {
                LIST: result,
            }
        },

        methods: {

            // 添加，修改
            handleEdit(data) {
                this.$refs.CompanyEdit.show(data)
            },

            // 删除
            async handleDelete(row) {
                const data = { id: row.id }
                await this.$confirm('删除后不可恢复，确定删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    return this.$api.Admin.Company.Del({ data })
                }).then(res => {
                    this.$message.success('删除成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
            },

            
        }
    }
</script>
