<template>
    <AdminPage title="统计报表">

        <template slot="menu">
            <a href="javascript:;" @click="jumpPage('/admin/commodity/report')">办公设备维修耗材开支</a>
            <a href="javascript:;" class="active">办公设备维修耗材</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/report/assets')">新增固定资产</a>
        </template>

        <template slot="tools">
            <el-form inline>
                <el-date-picker
                    type="year"
                    v-model="year"
                    value-format="yyyy"
                    format="yyyy年"
                    :clearable="false"
                    :picker-options="DateTimePickerOptions"
                    placeholder="选择日期"
                    style="width: 120px"
                />
                <el-select v-model="quarter" style="width: 120px">
                    <el-option label="一季度" value='1' />
                    <el-option label="二季度" value='2' />
                    <el-option label="三季度" value='3' />
                    <el-option label="四季度" value='4' />
                </el-select>
                <el-button type="primary" icon="search" @click="changeDate">查询</el-button>
            </el-form>
            <el-button icon="el-icon-download" 
                :disabled="!LIST.length"
                @click="exportData"
            >导出表格</el-button>
        </template>

        <Table :data="LIST"
            :summary-method="getSummaries"
            show-summary
        >
            <el-table-column label="序号" prop="index" align="center" width="60" />
            <!-- <el-table-column label="设备耗材名称" prop="product.name"  align="center" /> -->
            <el-table-column label="采购单位" prop="company.title" align="center" />
            <el-table-column label="联系人" prop="company.name" align="center" width="100" />
            <el-table-column label="联系电话" prop="company.phone" align="center" width="150" />
            <el-table-column label="开支金额（元）" prop="money" align="center" width="150"  />
            <el-table-column label="经办人" prop="agent" align="center" width="100"  />
        </Table>


    </AdminPage>
</template>


<script>

    import _ from 'underscore'
    import FileSaver from 'file-saver';

    export default {
        
        watchQuery: true,

        async asyncData(ctx) {
            let { year, quarter } = ctx.query;

            const myDate = new Date();
            if (!year || _.isEmpty(year)) {
                year = myDate.getFullYear();
            }

            if (!quarter || _.isEmpty(quarter)) {
                let currMonth = myDate.getMonth();
                quarter = Math.floor( ( currMonth % 3 == 0 ? ( currMonth / 3 ) : ( currMonth / 3 + 1 ) ) );
            }

            const result = await ctx.$api.Admin.Report.Quarter({ params: { year, quarter } });

            const LIST = {}
            result.forEach(item => {
                if (!_.has(LIST, item.company_id)) {
                    return LIST[item.company_id]  = item;
                }
                const row = LIST[item.company_id];
                let moeny = Number(row.money) + Number(item.money);
                row.money =  (Math.floor(moeny * 100) / 100).toFixed(2)
            })



            return {
                year: year + '年',
                quarter: String(quarter),
                LIST: Object.values(LIST).map((item, index )=> {
                    item.index = index + 1;
                    return item
                })
            }
        },

        data() {
            return {
                year: '',
                quarter: '',
                total: 0.00,
                LIST: [],
            }
        },

        methods: {
            
            // 统计
            getSummaries({ columns, data }) {
                const sums = []
                columns.forEach((column, index) => {
                    if (index===3) {
                        sums[index] = '合计';
                        return;
                    }
                    if (column.property!='money') {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item.money));
                    if (!values.every(value => isNaN(value))) {
                        const total = values.reduce((prev, curr) => prev + curr, 0) 
                        this.total = sums[index] = (Math.floor(total * 100) / 100).toFixed(2)
                    } else {
                        sums[index] = ''
                    }
                })

                return sums;
            },
            
            // 时间切换
            async changeDate() {
                const { year, quarter } = this;
                this.$router.push({ query: { 
                    year: parseInt(year),
                    quarter 
                }})
            },

            // 导出
            async exportData() {
                const { year, quarter, total } = this;
                const date = `${parseInt(year)}年${quarter}季度`;
                const data = {
                    date,
                    type: 'quarter',
                    data: this.LIST,
                    total
                }
                
                await this.$api.Admin.Report.Export(data).then(fileBuffer => {
                    const buffer = Buffer(fileBuffer.data)
                    var blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    FileSaver.saveAs(blob, `信息中心${ date }办公设备维修耗材联络方式.xlsx`);
                }).catch(this.throw);
            }
        }
    }
</script>
