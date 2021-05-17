<template>
    <Dialog
            :visible.sync="visible"
            :isReload="true"
            :title="editTitle"
            width="500px"
        >
            <Form :model="formData" :rules="$formRule.Admin.Company"
                @submit.native.prevent="submitForm"
                ref="Form"
            >
                <FormItem prop="title" label="公司名称" col="22">
                    <el-input v-model.trim="formData.title" placeholder="最多30个字符" />
                </FormItem>

                <FormItem prop="name" label="联系人" col="22">
                    <el-input v-model.trim="formData.name" placeholder="2~10位" />
                </FormItem>

                <FormItem prop="phone" label="联系电话" col="22">
                    <el-input v-model.trim="formData.phone" placeholder="固定电话或手机号" />
                </FormItem>

                <FormItem />
                <FormItem>
                    <el-button @click="visible=false" size="default" :disabled="isLoading">关闭</el-button>
                    <el-button native-type="submit" type="primary" size="default" :loading="isLoading">确定</el-button>
                </FormItem>
                
            </Form>
        </Dialog>
</template>


<script>
    import _ from 'underscore'
    import { mapState } from 'vuex'

    const FORM_DATA = {
        title: '',
        name: '',
        phone: '',
    }

    export default {

        data() {
            return {
                visible: false,
                isEdit: false,
                formData: FORM_DATA
            }
        },

        computed: {
            editTitle() {
                return this.formData.id ? '修改公司信息' : '添加公司信息'
            }
        },

        methods: {

            // 显示
            show(data) {
                if (data) {
                    this.isEdit = true;
                    this.formData = _.pick(data, ['id', 'title', 'name', 'phone']);
                } else {
                    this.isEdit = false;
                    this.formData = _.cloneDeep(FORM_DATA);
                }
                this.visible = true
            },

            //提交
            async submitForm() {
                await this.$refs.Form.validate();
                this.isLoading = true;

                let RequestMethod = this.$api.Admin.Company.Add, 
                    msg = '添加成功';

                if (this.isEdit) {
                    RequestMethod = this.$api.Admin.Company.Edit;
                    msg = '修改成功'
                }

                const data = _.pick(this.formData, ['id', 'title', 'name', 'phone'])
                
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

