<template>
    <AdminPage title="使用人员管理">
        <template slot="tools">
            <span>
                <el-button icon="el-icon-plus" type="primary" @click="handleEdit()">添加使用人</el-button>
                <!-- 文件选择 -->
                <input type="file" 
                    accept=".xls, .xlsx" 
                    style="display:none"
                    ref="ImportExcel"
                    @change="onFileChange"
                />
                <el-button-group>
                    <el-button icon="el-icon-upload2" @click="handleImport">批量导入</el-button>
                    <el-button icon="el-icon-tickets" @click="downloadFile">下载模板</el-button>
                </el-button-group>
            </span>

            <el-form @submit.native.prevent="handleSearch" inline>
                <el-form-item>
                    <el-input 
                        v-model="searchForm.keyword"
                        placeholder="姓名、电话、地址、部门" 
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
            <el-table-column label="ID" prop="id" width="60" align="center" />
            <el-table-column label="姓名" prop="name" width="100" align="center" />
            <el-table-column label="电话" prop="phone"  width="150" align="center" />
            <el-table-column label="部门" prop="department" width="200" align="center" />
            <el-table-column label="地址" prop="address" />

            <el-table-column label="创建时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="操作" width="150" v-slot="{ row }" align="center">
                <el-link size="small" type="primary" @click="handleEdit(row)">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="danger" @click="handleDelete(row)">删除</el-link>
            </el-table-column>
        </Table>


        <!-- 编辑 -->
        <UserEdit ref="UserEdit" />


    </AdminPage>
</template>


<script>

    import UserEdit from './components/UserEdit'
    import _ from 'underscore'

    export default {

        watchQuery: true,

        components: { UserEdit },

        head: {
            script: [
                { src: 'https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.9/xlsx.core.min.js', async: true, defer: true }
            ],
        },

        async asyncData(ctx) {
            // 请求参数
            const params = {
                ...ctx.query,
                ...ctx.$helper.getPerPage(ctx.query)
            }

            // 查询列表
            const result = await ctx.$api.Admin.User.List({ params });
            
            // 填充页面数据
            return {
                LIST: result.list,
                page: params.page,
                size: params.size,
                total: result.total,
                searchForm: {
                    keyword: _.isEmpty(params.keyword) ? '' : params.keyword
                }
            }
        },

        methods: {

            // 添加，修改
            handleEdit(data) {
                this.$refs.UserEdit.show(data)
            },

            // 重置查询
            resetSearch() {
                this.searchForm.keyword = '';
                this.$router.push({ query: null });
            },

            // 查询
            handleSearch() {
                if (_.isEmpty(this.searchForm.keyword)) return;
                this.$router.push({ query: this.searchForm });
            },

            // 删除
            async handleDelete(row) {
                const data = { id: row.id }
                await this.$confirm('删除后不可恢复，确定删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    return this.$api.Admin.User.Del({ data })
                }).then(res => {
                    this.$message.success('删除成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
            },

            // 下载模板
            downloadFile() {
                window.open('/template/使用人信息模板.xlsx');
            },

            // 导入
            handleImport() {
                let $input = this.$refs.ImportExcel;
                $input.value = '';
                $input.click();
            },

            // 监听导入文件变化
            onFileChange() {
                let file = this.$refs.ImportExcel.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    var result = e.target.result;
                    try {
                        const wb = XLSX.read(result, { type: 'binary' })
                        for(let key in wb.Sheets) {
                            this.handlerSheetData( wb.Sheets[key])
                            break;
                        }
                    } catch(err) {
                        this.$message.error('文件读取失败');
                    }
                }
                reader.readAsBinaryString(file);
            },

            // 处理表格数据
            async handlerSheetData(sheet) {
                const data = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    raw: false,
                });
                
                let LIST = [];
                const KEYS = ['name', 'department', 'address', 'phone'];
                for (let i = 0; i < data.length; i++) {
                    if (i===0) continue;
                    const item = data[i];
                    let tmp = _.object(KEYS, item);
                    tmp = _.mapObject(tmp, (v,k) => (v===undefined) ? '' : v );
                    if (_.isEmpty(tmp.name)) {
                        return this.$message.error(`第${ i+1 }行姓名不能为空`);
                    }
                    LIST.push(tmp)
                }
                const loading = this.$loading();
                await this.$api.Admin.User.Import({ data: LIST }).then(res => {
                    this.$message.success('导入成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
                loading.close();
            }

            
        }
    }
</script>

