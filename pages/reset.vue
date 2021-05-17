<template>
    <div class="Login">
        <div class="Login-bgcolor" />
        <div class="Login-Wrapper">
            <div class="Login-Body">
                <div class="Login-Menu">
                    <a href="javascript:;" class="active">重置密码</a>
                </div>

                <!-- 登录 -->
                <el-form class="Login-Form" size="medium"
                    ref="LoginForm"
                    :model="formData"
                    :rules="$formRule.ResetPass"
                    @submit.native.prevent="submitReset"
                >
                    <el-form-item prop="username">
                        <el-input v-model="formData.username" 
                            prefix-icon="el-icon-user" 
                            placeholder="用户名" 
                        />
                    </el-form-item>

                    <el-form-item prop="oldPass">
                        <el-input v-model="formData.oldPass" showPassword 
                            prefix-icon="el-icon-key" 
                            placeholder="旧密码"
                        />
                    </el-form-item>

                    <el-form-item prop="newPass">
                        <el-input v-model="formData.newPass" showPassword 
                            prefix-icon="el-icon-key" 
                            placeholder="10~30位新密码"
                        />
                    </el-form-item>

                    <el-form-item class="Login-Form-btn">
                        <el-button class="el-col-24" size="medium" type="primary" 
                            native-type="submit" :loading="isLoading"
                        >登录</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'underscore'
    
    export default {
        
        layout: 'empty',

        data() {
            return {
                // 登录表单
                formData: {
                    username: '',
                    oldPass: '',
                    newPass: '',
                }
            }
        },


        methods: {

            // 重置密码
            async submitReset() {
                try {
                    await this.$refs.LoginForm.validate();
                    this.isLoading = true;
                    const data = _.cloneDeep(this.formData);
                    await this.$api.Reset({ data }).then(res => {
                        this.$message.success('重置成功');
                        this.$router.push('/login');
                    }).catch(this.throw)
                    this.isLoading = false;
                } catch(err) { }
            },
        }
    }
</script>
