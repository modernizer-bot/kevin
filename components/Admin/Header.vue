<template>
    <div class="Admin-Header">

        <div class="Admin-Header-Wrapper">
        </div>

        <div class="Admin-Header-Wrapper">
            <a href="javascript:;" class="Admin-Header-Item" @click="handleFullScreen">
                <Icon :name=" isFullScreen ? 'fullscreen-exit' : 'fullscreen'" size="18" />
            </a>

            <!-- 登录用户菜单 -->
            <el-popover class="Admin-Header-Item"
                :class="{ 'is-active': isActiveUserCard }"
                :visible-arrow="true"
                popper-class="Admin-Header-UserCard_popper"
                @show="toggleUserCard('show')"
                @after-leave="toggleUserCard('hide')"
            >
                <!-- 用户基本信息 -->
                <a href="javascript:;"
                    class="Admin-Header-User"
                    :class="{ 'is-active': isActiveUserCard }"
                    slot="reference" 
                >
                    <el-avatar icon="el-icon-user-solid" :size="30" />
                    <span class="username">{{ USER_INFO.name }}</span>
                    <i class="el-icon-caret-bottom"></i>
                </a>
                <div class="Admin-Header-UserCard">
                    <a href="javascript:;" class="Admin-Header-UserCard_item" @click="clickProfile">
                        <i class="el-icon-edit"></i>
                        <span>修改个人资料</span>
                    </a>
                    <a href="javascript:;" class="Admin-Header-UserCard_item" @click="clickResetPass">
                        <i class="el-icon-key"></i>
                        <span>修改密码</span>
                    </a>
                    <div class="Admin-Header-UserCard_divider" />
                    <a href="javascript:;" class="Admin-Header-UserCard_item" @click="clickLogout">
                        <i class="el-icon-switch-button"></i>
                        <span>退出登录</span>
                    </a>
                </div>
            </el-popover>

        </div>

        <!-- 修改密码 -->
        <Dialog title="修改密码" :isReload="true" :visible.sync="visiblePass" width="450px">
            <Form :model="passwordForm" 
                @submit.native.prevent="submitResetPass"
                :rules="$formRule.ResetPass"
                ref="PassForm"
            >
                <FormItem label="旧密码" col="20" prop="oldPass">
                    <el-input show-password v-model="passwordForm.oldPass" />
                </FormItem>

                <FormItem label="新密码" col="20" prop="newPass">
                    <el-input show-password v-model="passwordForm.newPass" />
                </FormItem>

                <FormItem />
                <FormItem>
                    <el-button size="default" @click="visiblePass=false" :disabled="isLoading">关闭</el-button>
                    <el-button size="default" type="primary" native-type="submit" :loading="isLoading">确定</el-button>
                </FormItem>
            </Form>
        </Dialog>

        <!-- 修改个人资料 -->
        <Dialog title="修改个人资料" :isReload="true" :visible.sync="visibleProfile" width="450px">
            <Form :model="profileForm" 
                @submit.native.prevent="submitProfile"
                :rules="$formRule.AccountInfo"
                ref="ProfileForm"
            >

                <FormItem label="用户名" col="20">
                    <el-input :value="USER_INFO.username" disabled />
                </FormItem>

                <FormItem label="姓名" col="20" prop="name">
                    <el-input v-model="profileForm.name" />
                </FormItem>

                <FormItem label="联系电话" col="20" prop="phone">
                    <el-input v-model="profileForm.phone" placeholder="手机号或固定电话" />
                </FormItem>

                <FormItem label="联系地址" col="20" prop="address">
                    <el-input v-model="profileForm.address" />
                </FormItem>

                <FormItem />
                <FormItem>
                    <el-button size="default" @click="visibleProfile=false" :disabled="isLoading">关闭</el-button>
                    <el-button size="default" type="primary" native-type="submit" :loading="isLoading">确定</el-button>
                </FormItem>
            </Form>
        </Dialog>


            
    </div>
</template>

<script>
    import '@/assets/icons/svg/fullscreen.svg';
    import '@/assets/icons/svg/fullscreen-exit.svg';

    import _ from 'underscore'
    import { mapState } from 'vuex';

    // 重置密码
    const PASS_FORM = {
        oldPass: '',
        newPass: '',
    }

    // 个人资料
    const PROFILE_FORM = {
        id: null,
        name: '',
        phone: '',
        address: '',
    }

    
    export default {

        data() {
            return {
                visiblePass: false,
                visibleProfile: false,
                isFullScreen: false,
                isActiveUserCard: false,
                passwordForm: PASS_FORM,
                profileForm: PROFILE_FORM
            }
        },

        computed: {
            ...mapState(['USER_INFO', 'DICT'])
        },

        methods: {

            // 打开修改密码
            clickResetPass() {
                this.passwordForm = _.cloneDeep(PASS_FORM);
                this.visiblePass = true;
            },

            // 打开个人资料
            clickProfile() {
                this.profileForm = _.pick(this.USER_INFO, [
                    'id', 'name', 'phone', 'address'
                ]);
                this.visibleProfile = true;
            },

            // 监听头像上传成功
            onChangeAvatar(res) {
                this.profileForm.userAvatar = { id: res.id }
            },

            // 提交修改密码
            async submitResetPass() {
                await this.$refs.PassForm.validate();
                this.isLoading = true;
                const data = _.cloneDeep(this.passwordForm);
                await this.$api.ResetPass({ data }).then(res => {
                    this.$message.success('密码修改成功');
                    this.visiblePass = false
                }).catch(this.throw)
                this.isLoading = false;
            },

            // 提交个人资料
            async submitProfile() {
                this.isLoading = true
                const data = _.cloneDeep(this.profileForm);
                await this.$api.UserUpdate({ data }).then(res => {
                    this.visibleProfile = false;
                    this.$message.success('修改成功');
                    this.$store.dispatch('GET_USER_INFO'); //更新用户资料
                }).catch(this.throw);
                this.isLoading = false;
            },

            // 退出登录
            async clickLogout() {
                await this.$store.dispatch('LOGOUT').then(res => {
                    this.$message.success('退出成功')
                }).catch(this.throw)
            },

            // 全屏
            handleFullScreen() {
                const $elem = document.body || document.documentElement;
                this.$fullscreen.toggle($elem, {
                    callback: (value) => {
                        this.isFullScreen = value;
                    }
                })
            },
            
            // 当前用户信息
            toggleUserCard(event) {
                if (event==='show') {
                    this.isActiveUserCard = true;
                } else {
                    this.isActiveUserCard = false;
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .Admin-Header {
        display: flex;
        justify-content: space-between;
        &-Wrapper {
            display: flex;
        }
        &-Item {
            display: flex;
            align-items: center;
            padding: 0 $--space-base;
            transition: .3s;
            color: $--color-text-regular;
            &:hover, &.is-active {
                color: $--color-text-primary;
                background-color: $--background-color-base;
            }
            
        }

        &-User {
            display: flex;
            align-items: center;
            height: $--admin-header-height;
            transition: .3s;
            .username {
                margin-left: 1em;
            }
            [class^="el-icon"] {
                font-size: 14px;
                margin-left: 0.5em;
                opacity: 0.5;
                transition: transform .3s;
            }
            &:hover, &.is-active  {
                color: $--color-text-primary;
            }
            &.is-active {
                [class^="el-icon"] {
                    transform: rotate(180deg);
                }
            }
        }

        &-UserCard {
            [class^="el-icon"] {
                font-size: 16px;
                margin-right: 1em;
            }
            &_item {
                display: flex;
                align-items: center;
                padding: $--space-sm $--space-base;
                height: 24px;
                transition: .3s;
                color: $--color-text-regular;
                &:hover {
                    color: $--color-text-primary;
                    background-color: $--background-color-base;
                }
            }
            &_divider {
                margin: $--space-sm 0;
                border-top: 1px solid $--border-color-lighter;
            }
        }
    }
</style>

<style lang="scss">
    .Admin-Header-UserCard_popper {
        padding: $--space-sm 0;
    }
</style>