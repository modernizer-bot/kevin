<template>
    <AdminPage title="统计报表">

        <template slot="menu">
            <a href="javascript:;" class="active">办公设备维修耗材开支</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/report/quarter')">办公设备维修耗材</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/report/assets')">新增固定资产</a>
        </template>

        <template slot="tools">
            <el-date-picker
                type="month"
                v-model="date"
                value-format="yyyy-MM"
                format="yyyy年MM月"
                :clearable="false"
                :picker-options="DateTimePickerOptions"
                @change="changeDate"
                placeholder="选择日期"
            />
            <el-button icon="el-icon-download" 
                :disabled="!LIST.length"
                @click="exportData"
            >导出表格</el-button>
        </template>

        <Table :data="LIST" :summary-method="getSummaries" show-summary>
            <el-table-column label="序号" prop="index" align="center" width="60" />
            <el-table-column label="开支日期" width="120" prop="use_at"  align="center" />
            <el-table-column label="开支项目（物品）名称" prop="product.name"  align="center" min-width="200" />
            <el-table-column label="规格" prop="product.unit" align="center" width="60" />
            <el-table-column label="数量" prop="number" align="center" width="60" />
            <el-table-column label="单价（元）" prop="price" align="center" width="100" />
            <el-table-column label="金额（元）" prop="money" align="center" width="100" />
            <el-table-column label="经办人" prop="agent" align="center" width="80"  />
            <el-table-column label="工作用途" prop="use" align="center" width="150" />
            <el-table-column label="备注" prop="remark" align="center" width="150" />
        </Table>


    </AdminPage>
</template>


<script>

    import _ from 'underscore'
    import FileSaver from 'file-saver';

    export default {
        
        watchQuery: true,

        async asyncData(ctx) {
            let { date } = ctx.query;
            if (!date || _.isEmpty(date)) {
                date = ctx.$helper.formatDate(new Date(), 'Y-m');
            }

            const result = await ctx.$api.Admin.Report.Month({ params: { date } })

            return {
                date,
                LIST: result.map((item, index) => {
                    item.use_at = ctx.$helper.formatDate(item.use_at, 'Y/m/d');
                    item.use = `${ item.user.name }（${ item.user.department }）` 
                    item.index = index+1;
                    return item;
                })
            }
        },

        data() {
            return {
                date: '',
                LIST: [],
            }
        },

        methods: {

            getSummaries({ columns, data }) {
                const sums = []
                columns.forEach((column, index) => {
                    if (index===5) {
                        sums[index] = '总价';
                        return;
                    }
                    if (column.property!='money') {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item.money));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            return  (prev * 1000 + curr * 1000 ) / 1000
                        }, 0).toFixed(2)
                    } else {
                        sums[index] = ''
                    }
                })

                return sums;
            },
            
            // 时间切换
            async changeDate(date) {
                this.$router.push({ query: { date }})
            },

            // 导出
            async exportData() {
                const date = this.$helper.formatDate(this.date, 'Y年m月');
                const data = {
                    date,
                    type: 'month',
                    data: this.LIST
                }
                
                await this.$api.Admin.Report.Export(data).then(fileBuffer => {
                    const buffer = Buffer(fileBuffer.data)
                    var blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    FileSaver.saveAs(blob, `信息中心${ date }办公设备维修耗材开支表.xlsx`);
                }).catch(this.throw);
            }
        }
    }
</script>
