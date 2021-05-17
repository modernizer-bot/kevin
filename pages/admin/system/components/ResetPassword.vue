<template>
    <Dialog
            :visible.sync="visible"
            :isReload="true"
            title="重置密码"
            width="500px"
        >
            <Form :model="formData" :rules="$formRule.Admin.ResetPassword"
                @submit.native.prevent="submitForm"
                ref="Form"
            >
                <FormItem prop="password" label="新密码" col="22">
                    <el-input v-model.trim="formData.password" placeholder="密码" />
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
        id: null,
        password: '',
    }

    export default {

        data() {
            return {
                visible: false,
                formData: FORM_DATA
            }
        },


        methods: {

            // 显示
            show(data) {
                this.formData = { 
                    username: data.username, 
                    password: '' 
                };
                this.visible = true
            },

            //提交
            async submitForm() {
                await this.$refs.Form.validate();
                this.isLoading = true;

                const data = _.pick(this.formData, ['username', 'password'])
                
                await this.$api.Admin.Account.Edit({ data } )
                    .then(res => {
                        this.visible = false;
                        this.$message.success('重置成功');
                    }).catch(this.throw)

                this.isLoading = false;
            }
        }
    }
</script>

