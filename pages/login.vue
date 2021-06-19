<template>
    <div class="Login">
        <div class="Login-bgcolor" />
        <div class="Login-Wrapper">
            <div class="Login-Body">
                <div class="Login-Menu">
                    <a href="javascript:;" class="active">登录</a>
                </div>

                <!-- 登录 -->
                <el-form class="Login-Form" size="medium"
                    ref="LoginForm"
                    :model="formData"
                    :rules="$formRule.Login"
                    @submit.native.prevent="submitLogin"
                >
                    <el-form-item prop="username">
                        <el-input v-model="formData.username" 
                            prefix-icon="el-icon-user" 
                            placeholder="用户名" 
                        />
                    </el-form-item>

                    <!-- <el-form-item prop="password">
                        <el-input v-model="formData.password" showPassword 
                            prefix-icon="el-icon-key" 
                            placeholder="密码"
                        />
                    </el-form-item> -->

                    <el-form-item prop="code" class="Login-Form-vcode">
                        <el-input v-model="formData.code"
                            prefix-icon="el-icon-c-scale-to-original" 
                            placeholder="6位验证码"
                        >
                            <el-button slot="append" @click="sendCode" :disabled="isSendCode">
                                <template v-if="isSendCode">{{ time }}s</template>
                                <template v-else>发送验证码</template>
                            </el-button>
                        </el-input>

                    </el-form-item>

                    <el-form-item class="Login-Form-btn">
                        <el-button class="el-col-24" size="default" type="primary" 
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
                isSendCode: false,
                time: 60,
                // 登录表单
                formData: {
                    username: '',
                    // password: '',
                    code: '',
                }
            }
        },

        methods: {
            // 提交登录
            async submitLogin() {
                try {
                    await this.$refs.LoginForm.validate();
                    this.isLoading = true;
                    const data = _.cloneDeep(this.formData);
                    await this.$store.dispatch("LOGIN", data).then(res => {
                        this.$message.success('登录成功')
                    }).catch(this.throw)
                    this.isLoading = false;
                } catch(err) {}
            },

            // 发送验证码
            sendCode() {
                if (_.isEmpty(this.formData.username)) {
                    return this.$message.error('请输入用户名');
                }
                this.$api.SendCode({ 
                    data: { 
                        username: this.formData.username 
                    }
                }).then(res => {
                    this.isSendCode = true;
                    this.__timer();
                    this.$message.success('验证码发送成功')
                }).catch(this.throw)
            },

            // 倒计时
            __timer() {
                setTimeout(async () => {
                    this.time--;
                    if (this.time===0) {
                        this.isSendCode = false;
                        await this.$nextTick();
                        this.time = 60
                    } else {
                        this.__timer()
                    }
                }, 1000)
            }
        }
    }
</script>
