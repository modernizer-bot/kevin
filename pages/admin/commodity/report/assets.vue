<template>
    <AdminPage title="统计报表">

        <template slot="menu">
            <a href="javascript:;" @click="jumpPage('/admin/commodity/report')">办公设备维修耗材开支</a>
            <a href="javascript:;" @click="jumpPage('/admin/commodity/report/quarter')">办公设备维修耗材</a>
            <a href="javascript:;" class="active">新增固定资产</a>
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
            <el-table-column label="采购日期" prop="use_at" align="center" width="120" />
            <el-table-column label="货物名称" prop="product.name"  align="center" min-width="200" />
            <el-table-column label="规格" prop="product.unit" align="center" width="60" />
            <el-table-column label="数量" prop="number" align="center" width="60" />
            <el-table-column label="单价" prop="price" align="center" width="100" />
            <el-table-column label="金额" prop="money" align="center" width="120" />
            <el-table-column label="经办人" prop="agent" align="center" width="80"  />
            <el-table-column label="责任人" prop="user.name" align="center" width="80" />
            <el-table-column label="处室" prop="user.department" align="center" width="120" />
            <el-table-column label="地址" prop="user.address" align="center" width="200" />
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

            const result = await ctx.$api.Admin.Report.Assets({ params: { year, quarter } })

            return {
                year: year + '年',
                quarter: String(quarter),
                LIST: result.map((item, index) => {
                    item.use_at = ctx.$helper.formatDate(item.use_at, 'Y-m-d');
                    item.index = index+1;
                    return item;
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
                    if (index===5) {
                        sums[index] = '合计';
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
                    type: 'assets',
                    data: this.LIST,
                    total
                }
                
                await this.$api.Admin.Report.Export(data).then(fileBuffer => {
                    const buffer = Buffer(fileBuffer.data)
                    var blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    FileSaver.saveAs(blob, `${ date }新增固定资产登记信息.xlsx`);
                }).catch(this.throw);
            }
        }
    }
</script>
