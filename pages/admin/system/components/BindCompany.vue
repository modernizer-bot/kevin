<template>
    <Dialog
        :visible.sync="visible"
        :isReload="true"
        title="关联公司信息"
        width="500px"
    >
        <Form>
            <FormItem label="用户名" col="22">
                <el-input :value="formData.username" disabled />
            </FormItem>

            <FormItem label="公司列表" col="22">
                <el-select v-model="formData.companys"
                    multiple
                    collapse-tags
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in ACCOUNT_COMPANY"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    />
                </el-select>
            </FormItem>

            <FormItem />
            <FormItem>
                <el-button @click="visible=false" size="default" :disabled="isLoading">关闭</el-button>
                <el-button type="primary" size="default" :loading="isLoading"
                    @click="submitForm"
                >确定</el-button>
            </FormItem>
            
        </Form>
    </Dialog>
</template>


<script>
    import _ from 'underscore'
    import { mapState } from 'vuex'

    const FORM_DATA = {
        id: null,
        username: '',
        companys: [],
    }

    export default {

        data() {
            return {
                visible: false,
                formData: FORM_DATA
            }
        },

        computed: {
            ...mapState(['ACCOUNT_COMPANY'])
        },

        methods: {
            // 显示
            show(data) {
                this.formData = { 
                    id: data.id,
                    username: data.username, 
                    companys: data.companys.map(item => item.id)
                };
                this.visible = true
            },

            //提交
            async submitForm() {
                this.isLoading = true;
                const data = _.pick(this.formData, ['id', 'companys'])
                await this.$api.Admin.Account.BindCompany({ data } )
                    .then(res => {
                        this.$message.success('修改成功');
                        this.$nuxt.refresh(); //刷新列表
                        this.visible = false;
                    }).catch(this.throw)

                this.isLoading = false;
            }
        }
    }
</script>

