<script>
    import _ from 'underscore'

    export default {
        functional: true,
        render(h, ctx) {
            
            const $parent = ctx.parent;
            const handlerChange = _.throttle((value)=> {
                const { internalPageSize, internalCurrentPage } = $parent.$refs.PageNav;
                const query = Object.assign({}, $parent.$route.query, {
                    page: internalCurrentPage,
                    size: internalPageSize
                })
                // 更新当前路由参数
                $parent.$router.push({ query })
            }, 100, { leading: false })

            // 属性
            const props = {
                layout: "total, sizes, prev, pager, next",
                pageSizes: [10,15,20,25,30,50],
                background: true,
                ...ctx.data.attrs,
            }

            // 事件回调
            const evnets = {
                'size-change': handlerChange,
                'current-change': handlerChange
            }

            return (
                <el-pagination
                    props = { props }
                    on={ evnets }
                    ref="PageNav"
                />
            )
        }
    }
</script>