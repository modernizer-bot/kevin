<template>
    <Dialog
            :visible.sync="visible"
            :isReload="true"
            title="处理商品订单需求"
            width="1100px"
        >
            <Form :model="formData" :rules="$formRule.Order"
                @submit.native.prevent="submitForm"
                ref="Form"
            >
                <FormItem prop="company_id" label="供货商" col="11">
                    <el-select 
                        v-model="formData.company_id" 
                        style="width: 100%"
                        @change="onCompanyChange"
                    >
                        <el-option
                            v-for="item in ACCOUNT_COMPANY"
                            :key="item.id"
                            :value="item.id"
                            :label="item.title"
                        />
                    </el-select>
                </FormItem>

                <FormItem prop="delivery_id" label="送货人" col="11">
                    <el-select v-model="formData.delivery_id" style="width: 100%">
                        <el-option
                            v-for="item in DELIVERY_LIST"
                            :key="item.id"
                            :value="item.id"
                            :label="`${item.name} ${item.phone}`"
                        />
                    </el-select>
                </FormItem>

                <Table :data="ORDER_LIST" border>
                
                    <el-table-column label="序号" type='index' align="center" width="55" />

                    <el-table-column label="设备类型" width="80" prop="category.name" align="center" />

                    <el-table-column label="需求描述" width="200" prop="desc" />

                    <el-table-column label="商品名称" v-slot="{ row, $index }">
                        <el-select 
                            v-model.trim="row.product_id" 
                            placeholder="请输入搜索关键词"
                            style="width: 100%"
                            filterable
                            remote
                            :remote-method="e => searchProduct(e, row, $index)"
                            popper-class="UserSelect"
                            :disabled="!formData.company_id"
                            @change="onChangeProduct($event, row, $index )"
                            size="small"
                        >
                            <el-option 
                                v-for="item in (PRODUCT_LIST[$index] || [])"
                                :key="item.id"
                                :value="item.id"
                                :label="`${item.name}`"
                            >
                                <div class="UserSelect-item">
                                    <span class="name">{{ item.name }}</span>
                                    <p class="info">价格：{{ item.price }}</p>
                                    <p class="info">参数：{{ item.params }}</p>
                                </div>
                            </el-option>
                        </el-select>
                    </el-table-column>

                    <el-table-column label="规格" width="60" align="center" prop="product.unit" />

                    <el-table-column label="数量" width="120" align="center" prop="number" v-slot="{row}">
                        <el-input-number
                            v-model="row.number"
                            controls-position="right"
                            :min="1"
                            :max="99999"
                            style="width: 100%"
                            size="small"
                        />
                    </el-table-column>

                    <el-table-column label="价格(元)" width="90" align="center" v-slot="{ row }">
                        {{ row.product ? row.product.price : '0.00' }}
                    </el-table-column>

                    <el-table-column label="金额(元)" width="100" v-slot="{ row }"  align="center" >
                        <span v-if="row.product">
                            {{ (row.number * row.product.price) | toMoney }}
                        </span>
                        <span v-else>0.00</span>
                    </el-table-column>

                    <el-table-column align="center" width="60" fixed="right" v-slot="{ row, $index }">
                        <el-link  type="primary" @click="addRow(row, $index)" v-if="row.id">补充</el-link>
                        <el-link type="danger" @click="delRow($index)" v-show="!row.id" >删除</el-link>
                    </el-table-column>
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
        // 送货人
        delivery_id: null
    }

    export default {
        

        data() {
            return {
                visible: false,
                isEdit: false,
                formData: FORM_DATA,
                ORDER_LIST: [],
                DELIVERY_LIST: [],
                PRODUCT_LIST: [],
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

            addRow(row, index) {
                const data  = _.pick(row, [
                    'category_id', 'check', 'desc', 'agent', 'account_id', 'number', 'created_at', 'category'
                ])
                data.product_id = null;
                data.price = '0.00';
                data.money = '0.00';
                this.ORDER_LIST.push(data);
                this.PRODUCT_LIST.push([]);
            },

            delRow(index) {
                this.ORDER_LIST.splice(index, 1);
                this.PRODUCT_LIST.splice(index, 1);
            },

            // 显示
            show(data) {
                this.PRODUCT_LIST = [];
                this.DELIVERY_LIST = [];
                this.formData = _.cloneDeep(FORM_DATA);
                this.ORDER_LIST = _.cloneDeep(data)
                this.visible = true
            },

            // 监听供货商变化，加载送货人
            async onCompanyChange(value) {
                this.formData.delivery_id = null;
                this.DELIVERY_LIST = [];
                await this.$nextTick();
                this.fetchDelivery(value);
            },
            
            // 加载送货人数据
            fetchDelivery(company_id) {
                this.$api.Admin.Delivery.List({
                    params: { company_id }
                }).then(res => {
                    this.DELIVERY_LIST = res;
                }).catch(this.throw)
            },

            // 搜索商品
            searchProduct(keyword, row, $index ) {
                const { company_id } = this.formData;
                this.$api.Product.List({ 
                    params: { name: keyword, company_id, category_id: row.category_id }
                }).then(res => {
                    const arr = this.PRODUCT_LIST.slice();
                    arr[$index] = res.list;
                    this.PRODUCT_LIST = arr;
                }).catch(this.throw)
            },

            // 监听商品选择
            onChangeProduct(id, row, $index) {
                for (const item of this.PRODUCT_LIST[$index]) {
                    if (item.id===id) {
                        row.product = item;
                        return;
                    }
                }
            },

            //提交
            async submitForm() {
                await this.$refs.Form.validate();
                const { company_id, delivery_id } = this.formData;
                const data = [];
                // 处理数据
                for (const item of this.ORDER_LIST) {
                    if (!item.product_id) {
                        return this.$message.error('信息未来填写完整！')
                    }
                    const tmp = _.pick(item, [
                        'id', 'delivery_id', 'product_id', 'number', 'remark', 'desc',
                        'check', 'created_at', 'agent', 'account_id', 'category_id'
                    ])
                    tmp.price = item.product.price;
                    tmp.company_id = company_id;
                    tmp.delivery_id = delivery_id;
                    data.push(tmp);
                }

                await this.$confirm('确定添加当前订单需求的商品信息？', '提示', {
                    type: 'warning',
                    confirmButtonText: '提交',
                }).then(res => {
                    return this.submitData(data)
                }).catch(this.throw);
                
            },

            // 提交数据
            async submitData(data) {
                this.isLoading = true;
                await this.$api.Order.Product({ data } )
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

