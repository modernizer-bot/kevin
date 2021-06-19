<template>
    <Dialog
        :visible.sync="visible"
        :isReload="true"
        :title="editTitle"
        width="1200px"
    >
        <div style="margin-bottom: 10px; font-size: 14px; color: #FE6464">
            注意事项：采购人下单时填写需求描述时标注数量和单位，如“2个512G固态硬盘”
        </div>
        <el-form 
            :model="data"
            @submit.native.prevent="submitForm"
            ref="Form"
        >
            <Table :data="data.formData">
                <el-table-column label="序号" type="index" width="50" align="center" fixed="left" />

                <el-table-column label="设备类型" v-slot="{ row, $index }" width="120" align="center">
                    <el-form-item :prop="`formData.${$index}.category_id`" :rules='$formRule.Order.category_id'>
                        <el-select v-model="row.category_id" style="width: 100%">
                            <el-option
                                v-for="item in CATEGORY"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name"
                            />
                        </el-select>
                    </el-form-item>
                </el-table-column>

                <el-table-column label="需求描述" v-slot="{ row, $index }" align="center">
                    <el-form-item :prop="`formData.${$index}.desc`" :rules='$formRule.Order.desc'>
                        <el-input 
                            v-model="row.desc" 
                            placeholder="最多255个字符"
                        />
                    </el-form-item>
                </el-table-column>

                <el-table-column label="数量" v-slot="{ row, $index }" width="120" align="center">
                    <el-form-item :prop="`formData.${$index}.number`" :rules='$formRule.Order.number'>
                        <el-input-number v-model="row.number"
                            controls-position="right"
                            :min="1"
                            :max="99999"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-table-column>

                <el-table-column label="审批人" v-slot="{ row, $index }" width="120" align="center">
                    <el-form-item :prop="`formData.${$index}.check`" :rules='$formRule.Order.check'>
                        <el-input v-model="row.check" />
                    </el-form-item>
                </el-table-column>

                <el-table-column label="经办人" v-slot="{ row, $index }" width="120" align="center">
                    <el-form-item :prop="`formData.${$index}.agent`" :rules='$formRule.Order.agent'>
                        <el-input  v-model="row.agent" />
                    </el-form-item>
                </el-table-column>

                <el-table-column label="备注" v-slot="{ row, $index }" width="200" align="center">
                    <el-form-item :prop="`formData.${$index}.remark`" :rules='$formRule.Order.remark'>
                        <el-input 
                            v-model="row.remark" 
                            placeholder="最多255个字符"
                        />
                    </el-form-item>
                </el-table-column>

                <el-table-column align="center" width="60" fixed="right" v-if="!isEdit">
                    <template #header>
                        <el-link  type="primary" @click="addRow" >添加</el-link>
                    </template>
                    <template  #default="{ $index }">
                        <el-link type="danger" @click="delRow($index)"  v-show="data.formData.length > 1" >删除</el-link>
                    </template>
                </el-table-column>
            </Table>

            <div style="text-align:center; margin-top: 40px">
                <el-button @click="visible=false" size="default" :disabled="isLoading">关闭</el-button>
                <el-button native-type="submit" type="primary" size="default" :loading="isLoading">确定</el-button>
            </div>
            
        </el-form>
    </Dialog>
</template>


<script>
    import _ from 'underscore'
    import { mapState } from 'vuex'

    const FORM_DATA = {
        // 设备类型
        category_id: null,
        // 需求描述
        desc: '',
        // 数量
        number: 1,
        // 审批人
        check: '王国友',
        // 接收账号
        account_id: null,
        // 经办人
        agent: '徐凯',
        // 备注
        remark: '',
    }

    export default {

        data() {
            return {
                visible: false,
                isEdit: false,
                data: {
                    formData: []
                },
                ACCOUNT_LIST: [],
                USER_LIST: []
            }
        },

        computed: {
            ...mapState(['CATEGORY']),
            editTitle() {
                return this.isEdit ? '修改需求' : '添加需求'
            }
        },

        methods: {


            // 添加行
            addRow() {
                const row = _.cloneDeep(FORM_DATA)
                // row.agent = this.$store.state.USER_INFO.name;
                const USER_INFO = this.$store.state.USER_INFO;
                row.account_id = USER_INFO.parent_id || USER_INFO.id;
                this.data.formData.push(row)
            },

            // 删除行
            delRow(index) {
                this.$confirm('确定删除当前行', '提示', {
                    type: 'warning',
                    confirmButtonText: '删除',
                }).then(res => {
                    this.data.formData.splice(index, 1);
                }).catch(this.throw);
            },

            // 显示
            show(data) {
                if (data) {
                    this.isEdit = true;
                    this.ACCOUNT_LIST = [];
                    this.data.formData = data.map(item => {
                        this.ACCOUNT_LIST.push(item.account);
                        return _.pick(item, ['id', 'desc', 'account_id','category_id', 'check', 'number', 'remark', 'agent'])
                    });
                } else {
                    this.isEdit = false;
                    const row = _.cloneDeep(FORM_DATA)
                    const USER_INFO = this.$store.state.USER_INFO;
                    row.account_id = USER_INFO.parent_id || USER_INFO.id;
                    // row.agent = this.$store.state.USER_INFO.name;
                    this.data.formData = [row];
                }
                this.visible = true
            },

            // 搜索审批人
            searchUser(keyword) {
                this.$api.Admin.User.List({ params: { keyword, size: 15 } }).then(res => {
                    this.USER_LIST = res.list;
                }).catch(this.throw)
            },

            //提交
            async submitForm() {
                await this.$refs.Form.validate();
                this.isLoading = true;


                let data = this.data.formData.map(item => {
                    return _.pick(item, ['id', 'desc', 'category_id', 'account_id', 'check', 'number', 'remark', 'agent'])
                });

                let RequestMethod = this.$api.Admin.Order.Add, 
                    msg = '添加成功';

                if (this.isEdit) {
                    RequestMethod = this.$api.Admin.Order.Put;
                    msg = '修改成功'
                    data = data[0];
                }

                console.log(data);


                await RequestMethod({ data } )
                    .then(res => {
                        this.visible = false;
                        this.$message.success(msg);
                        this.$nuxt.refresh(); //刷新列表
                    }).catch(this.throw)

                this.isLoading = false;
            }
        }
    }
</script>
