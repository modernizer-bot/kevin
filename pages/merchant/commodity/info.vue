<template>
    <AdminPage title="商品信息">

        <el-form slot="filter" @submit.native.prevent="handleSearch" inline>
            <el-form-item label="关键字">
                <el-input v-model="searchForm.name" placeholder="商品名称、参数" style="width: 180px" />
            </el-form-item>

            <el-form-item label="类型">
                <el-select v-model="searchForm.category_id" style="width: 100px">
                    <el-option value="" label="全部" />
                    <el-option
                        v-for="item in CATEGORY"
                        :key="item.id"
                        :value="String(item.id)"
                        :label="item.name"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="供货商">
                <el-select v-model="searchForm.company_id" style="width: 190px">
                    <el-option value="" label="全部" />
                    <el-option
                        v-for="item in ACCOUNT_COMPANY"
                        :key="item.id"
                        :value="String(item.id)"
                        :label="item.title"
                    />
                </el-select>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit">查询</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>

        </el-form>

        <template slot="tools">
            <el-button 
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit()"
            >添加商品</el-button>

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
        </template>

        <Table :data="LIST"
            :total="total"
            :size="size"
            :page="page"
        >
            <el-table-column label="ID" prop="id" width="60" fixed="left" align="center" />
            <el-table-column label="设备类型" prop="category.name" width="100" align="center" />
            <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
            <el-table-column label="参数" prop="params" show-overflow-tooltip />
            <el-table-column label="规格" prop="unit" width="60" align="center" />
            <el-table-column label="单价" prop="price" width="100" align="center" />
            <el-table-column label="供货商名称" prop="company.title" width="150" show-overflow-tooltip />
         
            <el-table-column label="创建时间" prop="createTime" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>

            <el-table-column label="操作" width="220" v-slot="{ row }" align="center">
                <el-link size="small" type="info" :href="row.link" target="_blank">卖场链接</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="primary" @click="handleEdit(row)">修改</el-link>
                <el-divider direction="vertical"/>
                <el-link size="small" type="danger" @click="handleDelete(row)">删除</el-link>
            </el-table-column>
        </Table>


        <!-- 编辑 -->
        <CommodityEdit ref="CommodityEdit" />


    </AdminPage>
</template>


<script>

    import _ from 'underscore'
    import { mapState } from 'vuex'
    import CommodityEdit from './components/CommodityEdit'

    const SEARCH_FORM = {
        name: '',
        category_id: '',
        company_id: ''
    }

    export default {

        watchQuery: true,

        components: { CommodityEdit },

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
            const result = await ctx.$api.Product.List({ params });

            let searchForm = _.pick(params, Object.keys(SEARCH_FORM));
            searchForm = Object.assign({}, SEARCH_FORM, searchForm);

            // 填充页面数据
            return {
                searchForm,
                LIST: result.list,
                page: params.page,
                size: params.size,
                total: result.total,
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
            ...mapState(['CATEGORY', 'ACCOUNT_COMPANY', 'UNIT'])
        },

        methods: {

            resetSearch() {
                this.$router.push({ query: null })
            },

            handleSearch() {
                let query = {};
                Object.keys(SEARCH_FORM).forEach(k => {
                    let v = this.searchForm[k]
                    if (!_.isEmpty(v)) {
                        query[k] = v
                    }
                })
                this.$router.push({ query })
            },

            // 添加，修改
            handleEdit(data) {
                this.$refs.CommodityEdit.show(data)
            },

            // 删除
            async handleDelete(row) {
                const data = { id: row.id }
                await this.$confirm('删除后不可恢复，确定删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    return this.$api.Product.Del({ data })
                }).then(res => {
                    this.$message.success('删除成功');
                    this.$nuxt.refresh(); //刷新列表
                }).catch(this.throw);
            },

            // 下载模板
            downloadFile() {
                window.open('/template/商品信息模板.xlsx');
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

            // 查询设备类型ID
            _findCategoryId(name) {
                return _.find(this.CATEGORY, { name });
            },

            // 查询供货商ID
            _findCompanyId(title) {
                return _.find(this.ACCOUNT_COMPANY, { title });
            },

            // 转换数据
            _transformData(data) {
                const KEYS = ['category_id', 'name', 'params', 'unit', 'price', 'company_id', 'link'];
                let LIST = [];
                return new Promise((resolve,reject) => {
                    for (let i = 0; i < data.length; i++) {
                        if (i===0) continue;
                        const item = data[i];
                        let tmp = _.object(KEYS, item);
                        for (const k in tmp) {
                            let v = tmp[k];
                            
                            if (_.isString(v)) {
                                v = v.trim();
                            }

                            if (!v) {
                                return reject(new Error(`第 ${ i+1 } 行未填写完整`));
                            }

                            // 获取类型ID
                            if (k=='category_id') {
                                let cat = this._findCategoryId(v);
                                if (!cat) {
                                    return reject(new Error(`第 ${ i+1 } 行设备类型填写不正确`));
                                }
                                tmp[k] = cat.id;
                            }

                            // 获取供货商ID
                            if (k=='company_id') {
                                let comp = this._findCompanyId(v);
                                if (!comp) {
                                    return reject(new Error(`第 ${ i+1 } 行供货商填写不正确`));
                                }
                                tmp[k] = comp.id;
                            }

                            // 判断价格
                            if (k=='price' && isNaN(Number(v))) {
                                return reject(new Error(`第 ${ i+1 } 行单价填写不正确`));
                            }

                        }
                        LIST.push(tmp)
                    }
                    resolve(LIST)
                })
            },

            // 处理表格数据
            async handlerSheetData(sheet) {
                const data = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    raw: false,
                });
                
                await this._transformData(data).then(async res => {

                    const loading = this.$loading();
                    await this.$api.Product.Import({ data: res }).then(res => {
                        this.$message.success('导入成功');
                        this.$nuxt.refresh(); //刷新列表
                    }).catch(this.throw);
                    loading.close();

                }).catch(err => {
                    this.$message.error(err.message);
                })
                
            }

            
        }
    }
</script>
