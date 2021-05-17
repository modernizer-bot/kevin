<template>
    <AdminPage title="设备类型">
        <template slot="tools">
            <el-button 
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit()"
            >添加设备类型</el-button>
        </template>

        <Table :data="LIST">
            <el-table-column label="ID" prop="id" width="60" fixed="left" align="center" />
            <el-table-column label="类型名称" prop="name" />
         
            <el-table-column label="创建时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="操作" width="120" v-slot="{ row }" align="center">
                <el-link size="small" type="primary" @click="handleEdit(row)">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="danger" @click="handleDelete(row)">删除</el-link>
            </el-table-column>
        </Table>


        <!-- 编辑 -->
        <CategoryEdit ref="CategoryEdit" />


    </AdminPage>
</template>


<script>

    import CategoryEdit from './components/CategoryEdit'

    export default {

        watchQuery: true,

        components: { CategoryEdit },

        async asyncData(ctx) {
            // 查询列表
            const result = await ctx.$api.Admin.Category.List();
            // 填充页面数据
            return {
                LIST: result,
            }
        },

        methods: {

            // 添加，修改
            handleEdit(data) {
                this.$refs.CategoryEdit.show(data)
            },

            // 删除
            async handleDelete(row) {
                const data = { id: row.id }
                await this.$confirm('删除后不可恢复，确定删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    return this.$api.Admin.Category.Del({ data })
                }).then(res => {
                    this.$message.success('删除成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
            },

            
        }
    }
</script>
