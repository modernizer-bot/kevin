<template>
    <Dialog
            :visible.sync="visible"
            :isReload="true"
            title="填写结算信息"
            width="1000px"
        >
            <Form :model="formData" :rules="$formRule.Ticket"
                @submit.native.prevent="submitForm"
                ref="Form"
                label-width="110px"
            >
                <FormItem label="供货商" col="24">
                    {{ ORDER_LIST.length && ORDER_LIST[0].company.title }}
                </FormItem>

                <FormItem prop="code" label="发票代码" col="8">
                    <el-input v-model.trim="formData.code" />
                </FormItem>

                <FormItem prop="number" label="发票编号" col="8">
                    <el-input v-model.trim="formData.number" />
                </FormItem>

                <FormItem prop="date" label="开票日期" col="8">
                    <el-date-picker
                        v-model="formData.date"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="DateTimePickerOptions"
                    />
                </FormItem>

                <Table 
                    :data="ORDER_LIST" 
                    :summary-method="getSummaries"
                    show-summary
                    border
                >
                
                    <el-table-column label="序号" type='index' align="center" width="80" />

                    <el-table-column label="设备类型" prop="category.name" width="100" align="center" />

                    <el-table-column label="商品名称" prop="product.name"/>

                    <el-table-column label="规格" prop="product.unit" width="60" align="center"/>

                    <el-table-column label="数量" prop="number" width="60" align="center" />

                    <el-table-column label="单价(元)" prop="price" width="100" align="center" />

                    <el-table-column label="金额(元)" prop="money" width="100" align="center" />
                </Table>

                <FormItem />
                <FormItem style="text-align: center" label-width="0">
                    <el-button @click="visible=false" size="default" :disabled="isLoading">取消</el-button>
                    <el-button native-type="submit" type="primary" size="default" :loading="isLoading">确定</el-button>
                </FormItem>
                
            </Form>
        </Dialog>
</template>


<script>
    import _ from 'underscore'
    import { mapState } from 'vuex'

    const FORM_DATA = {
        // 公司ID
        company_id: null,
        // 订单ID
        order_id: [],
        // 发票代码
        code: '',
        // 发票编号
        number: '',
        // 开票日期
        date: '',
        // 开票金额
        money: 0.00
    }

    export default {

        data() {
            return {
                visible: false,
                isEdit: false,
                formData: FORM_DATA,
                ORDER_LIST: [],
                PRODUCT_LIST: [],
                DELIVERY_LIST: [],
            }
        },

        filters: {
            toMoney(value) {
                return (Math.floor(value * 100) / 100).toFixed(2)
            }
        },

        computed: {
            ...mapState(['CATEGORY', 'ACCOUNT_COMPANY']),
            editTitle() {
                return this.formData.id ? '修改需求' : '发布需求'
            }
        },

        methods: {

            // 显示
            show(data) {
                this.formData = _.cloneDeep(FORM_DATA);
                this.formData.company_id = data[0].company_id;
                this.formData.order_id = data.map(item => item.id );
                this.ORDER_LIST = _.cloneDeep(data)
                this.visible = true
            },

             // 计算总价
            getSummaries({ columns, data }) {
                const sums = []
                columns.forEach((column, index) => {
                    if (index===0) {
                        sums[index] = '总金额';
                        return;
                    }
                    if (column.property!='money') {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item.money));
                    if (!values.every(value => isNaN(value))) {
                        this.formData.money = sums[index] = values.reduce((prev, curr) => {
                            return  (prev * 1000 + curr * 1000 ) / 1000
                        }, 0).toFixed(2)
                    } else {
                        sums[index] = ''
                    }
                })

                return sums;
            },

            //提交
            async submitForm() {
                await this.$refs.Form.validate();
               
                await this.$confirm('信息提交后不可修改，确定提交？', '提示', {
                    type: 'warning',
                    confirmButtonText: '提交',
                }).then(res => {
                    return this.submitData()
                }).catch(this.throw);
                
            },

            // 提交数据
            async submitData() {
                this.isLoading = true;
                await this.$api.Order.Final({ data: this.formData } )
                    .then(res => {
                        this.visible = false;
                        this.$message.success('提交成功');
                        this.$nuxt.refresh(); //刷新列表
                    }).catch(this.throw)

                this.isLoading = false;
            }
        }
    }
</script>

