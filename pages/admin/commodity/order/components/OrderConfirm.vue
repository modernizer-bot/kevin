<template>
    <Dialog
            :visible.sync="visible"
            :isReload="true"
            title="确认收货"
            width="500px"
        >
            <Form :model="formData" :rules="$formRule.Order"
                @submit.native.prevent="submitForm"
                ref="Form"
            >
                <FormItem label="商品名称" col="22">
                    {{ formData.product.name }}
                </FormItem>

                <FormItem label="设备类型" col="22">
                    {{ formData.category.name }}
                </FormItem>

                <FormItem label="商品参数" col="22">
                    {{ formData.product.params }}
                </FormItem>

                <FormItem label="数量" col="22">
                    {{ formData.number }}
                </FormItem>

                <FormItem prop="user_id" label="使用人" col="22">
                    <el-select 
                        v-model.trim="formData.user_id" 
                        placeholder="姓名、电话、地址、部门"
                        style="width: 100%"
                        filterable
                        remote
                        :remote-method="searchUser"
                        popper-class="UserSelect"
                    >
                        <el-option 
                            v-for="item in USER_LIST"
                            :key="item.id"
                            :value="item.id"
                            :label="`${item.name} ${item.department}`"
                        >
                            <div class="UserSelect-item">
                                <span class="name">{{ item.name }}</span>
                                <p class="info">部门：{{ item.department }}</p>
                                <p class="info">地址：{{ item.address }}</p>
                            </div>
                        </el-option>
                    </el-select>
                </FormItem>

                <FormItem prop="use_at" label="使用时间" col="22">
                    <el-date-picker
                        v-model="formData.use_at"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="DateTimePickerOptions"
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
        // 需求描述
        desc: '',
        // 数量
        number: 1,
        // 使用人
        user_id: null,
        // 使用时间
        user_at: '',
        // 商品信息
        product: {
            name: '',
            params: ''
        },
        category: {
            name: ''
        },
    }

    export default {

        data() {
            return {
                visible: false,
                formData: FORM_DATA,
                USER_LIST: []
            }
        },


        methods: {

            // 显示
            show(data) {
                this.formData = Object.assign({}, FORM_DATA, _.pick(data, [
                    'id', 
                    'number',
                    'product',
                    'category',
                ]))
                this.isEdit = true;
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

                let data = _.pick(this.formData, ['id', 'user_id', 'use_at']);
                data.status = 3;

                await this.$confirm('确认收货后不可修改，确定提交？', '提示', {
                    type: 'warning',
                    confirmButtonText: '提交',
                }).then(res => {
                    return this.submitData(data)
                }).catch(this.throw);
                
            },

            async submitData(data) {
                this.isLoading = true;
                await this.$api.Admin.Order.Put({ data } )
                    .then(res => {
                        this.visible = false;
                        this.$message.success('确认收货已完成');
                        this.$nuxt.refresh(); //刷新列表
                    }).catch(this.throw)
                this.isLoading = false;
            }
        }
    }
</script>
