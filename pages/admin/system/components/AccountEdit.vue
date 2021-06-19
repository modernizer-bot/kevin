<template>
    <Dialog
            :visible.sync="visible"
            :isReload="true"
            :title="editTitle"
            width="550px"
        >
            <Form :model="formData" :rules="$formRule.Admin.Account"
                @submit.native.prevent="submitForm"
                ref="Form"
                label-width="160px"
            >
                <FormItem prop="username" label="账号" col="21">
                    <el-input v-model.trim="formData.username" placeholder="最多30个字符" :disabled="isEdit" />
                </FormItem>

                <!-- <FormItem prop="password" label="密码" col="21" v-if="!isEdit">
                    <el-input v-model.trim="formData.password" placeholder="10~30位，大小写字母+数字+特殊字符" />
                </FormItem> -->

                <FormItem prop="parent_id" label="所属主账号" col="21">
                    <el-select v-model="formData.parent_id" clearable style="width: 100%" popper-class="UserSelect">
                        <el-option
                            v-for="item in parentAccount"
                            :label="item.username"
                            :value="item.id"
                            :key="item.id"
                        >
                            <div class="UserSelect-item">
                                <span class="name">{{ item.username }}</span>
                                <p class="info">联系人：{{ item.name }}</p>
                                <p class="info">公司：{{ item.companys.map(item => item.title).join(",") }}</p>
                            </div>
                        </el-option>
                    </el-select>
                </FormItem>

                <FormItem prop="name" label="联系人" col="21">
                    <el-input v-model.trim="formData.name" placeholder="2~10位" />
                </FormItem>

                <FormItem prop="phone" label="联系电话" col="21">
                    <el-input v-model.trim="formData.phone" placeholder="固定电话或手机号" />
                </FormItem>

                <FormItem prop="address" label="联系地址" col="21">
                    <el-input type="textarea" :max="255" v-model.trim="formData.address" placeholder="最多255个字符" />
                </FormItem>

                <FormItem prop="limit" label="验证码每日限制次数" col="21">
                    <el-input-number 
                        v-model.trim="formData.limit" 
                        :min="1" 
                        :max="10" 
                        controls-position="right"
                        style="width: 100px"
                    />
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
        username: '',
        parent_id: '',
        // password: '',
        name: '',
        phone: '',
        address: '',
        limit: 5
    }

    export default {

        data() {
            return {
                visible: false,
                isEdit: false,
                formData: FORM_DATA,
                parentAccount: [],
            }
        },

        computed: {
            editTitle() {
                return this.formData.id ? '修改账号' : '添加账号'
            },
        },

        methods: {

            // 加载主账号
            async fetchParentAccount() {
                const res = await this.$api.Admin.Account.List({ params: {size: 100, parent_id: 0} });
                if (this.formData.id) {
                    this.parentAccount = res.list.filter(item => {
                        return item.id != this.formData.id
                    })
                } else {
                    this.parentAccount = res.list;
                }
            },

            // 显示
            async show(data) {
                if (data) {
                    this.isEdit = true;
                    this.formData = _.pick(data, ['id', 'username', 'name', 'phone', 'address', 'limit', 'parent_id']);
                    if (this.formData.parent_id===0) {
                        this.formData.parent_id = ''
                    }
                } else {
                    this.isEdit = false;
                    this.formData = _.cloneDeep(FORM_DATA);
                }
                await this.fetchParentAccount();
                this.visible = true
            },

            //提交
            async submitForm() {
                await this.$refs.Form.validate();
                this.isLoading = true;

                let RequestMethod = this.$api.Admin.Account.Add, 
                    msg = '添加成功';

                if (this.isEdit) {
                    RequestMethod = this.$api.Admin.Account.Edit;
                    msg = '修改成功'
                }

                const data = _.pick(this.formData, ['id', 'username', 'password', 'name', 'phone', 'address', 'limit', 'parent_id'])
                if (data.parent_id=='') {
                    data.parent_id = 0
                }
                
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

