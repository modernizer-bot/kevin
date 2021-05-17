<template>
    <Dialog
        :visible.sync="visible"
        :isReload="true"
        :title="editTitle"
        width="680px"
    >
        <Form :model="formData" :rules="$formRule.Commodity"
            @submit.native.prevent="submitForm"
            ref="Form"
        >

            <FormItem prop="company_id" label="供货商" col="11">
                <el-select v-model="formData.company_id" style="width: 100%">
                    <el-option
                        v-for="item in ACCOUNT_COMPANY"
                        :key="item.id"
                        :value="item.id"
                        :label="item.title"
                    />
                </el-select>
            </FormItem>

            <FormItem prop="category_id" label="设备类型" col="11">
                <el-select v-model="formData.category_id" style="width: 100%">
                    <el-option
                        v-for="item in CATEGORY"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    />
                </el-select>
            </FormItem>

            <FormItem  prop="name" label="商品名称" col="22">
                <el-input v-model.trim="formData.name" placeholder="最多100个字符" />
            </FormItem>

            <FormItem prop="price" label="单价" col="11">
                <el-input-number v-model="formData.price" controls-position="right"
                    :precision="2"
                    :min="0"
                    :max="999999"
                    style="width: 100%"
                />
            </FormItem>

            <FormItem prop="unit" label="规格" col="11">
                <el-select v-model="formData.unit" style="width: 100%" filterable>
                    <el-option
                        v-for="(item, i) in UNIT"
                        :key="i"
                        :value="item"
                        :label="item"
                    />
                </el-select>
            </FormItem>

            <FormItem prop="params" label="参数" col="22">
                <el-input type="textarea" :max="1000" :rows="5" v-model="formData.params" placeholder="最多1000个字符" />
            </FormItem>

            <FormItem prop="link" label="卖场链接" col="22">
                <el-input :max="1000" v-model="formData.link" placeholder="http://" />
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
        company_id: null,
        name: '',
        category_id: null,
        unit: '',
        price: 0.00,
        params: '',
        link: '',
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
            ...mapState(['CATEGORY', 'ACCOUNT_COMPANY', 'UNIT']),
            editTitle() {
                return this.formData.id ? '修改商品信息' : '添加商品信息'
            }
        },

        methods: {

            // 显示
            show(data) {
                if (data) {
                    this.isEdit = true;
                    this.formData = _.pick(data, [
                        'id', 'company_id', 'category_id', 'name', 'params', 'unit', 'price', 'link'
                    ]);
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

                let RequestMethod = this.$api.Product.Add, 
                    msg = '添加成功';

                if (this.isEdit) {
                    RequestMethod = this.$api.Product.Edit;
                    msg = '修改成功'
                }

                const data = _.pick(this.formData, [
                    'id', 'company_id', 'category_id', 'name', 'params', 'unit', 'price', 'link'
                ])
                
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

