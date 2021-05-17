<script>

    export default {
        functional: true,

        props: {
            // 分页
            total: Number,
            page: Number,
            size: Number,
            // 列表序号
            hasIndex: Boolean
        },

        render(h, ctx) {

            // 序号计算
            function getIndex(index) {
                const page = ctx.props.page || 1,
                    size = ctx.props.size || 0;
                return ( page - 1 ) * size + index + 1;
            }

            // 表格
            function renderTable () {
                ctx.data.attrs = Object.assign({
                    size: 'default',
                    border: true,
                }, ctx.data.attrs);
                return (
                    <el-table {...ctx.data }>
                        <EmptyStatus message="暂无数据" slot="empty" />
                        {
                            ctx.props.hasIndex && (
                                <el-table-column 
                                    label="序号" 
                                    type="index" 
                                    width="70"
                                    index={ getIndex }
                                />
                            )
                        }
                        { ctx.scopedSlots.default() }
                    </el-table>
                )
            }

            // 导航
            function renderPageNav() {
                return (
                    <PageNav 
                        total={ ctx.props.total } 
                        currentPage={ ctx.props.page } 
                        pageSize={ ctx.props.size }
                    />
                )
            }

            return [
                renderTable(),
                ctx.props.page !=undefined ? renderPageNav() : null
            ]
        }
    }
</script>

<style lang="scss">
    .el-table {
        &__header th, &__footer-wrapper tbody td {
            background-color: $--background-color-lighter;
            padding: $--space-base 0;
            // &.is-leaf {
            //     border-bottom: 0;
            // }
        }

        &-emptyStatus {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            line-height: 1;
            margin: $--space-lg * 2 0;
            img {
                width: 160px;
                height: 136px;
            }
            span {
                color: $--color-text-secondary;
                margin-top: $--space-md;
            }
        }
    }

    .el-table + .el-pagination {
        margin-top: $--space-md;
    }

    .el-table .el-form-item {
        margin-bottom: 0!important;
    }
</style>