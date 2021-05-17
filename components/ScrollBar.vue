<script>
    import { Scrollbar } from 'element-ui'
    export default {
        functional: true,
        render(h, ctx) {
            const $slots = ctx.slots();
            return (
                <Scrollbar class="ScrollBar">
                    { $slots.default }
                </Scrollbar>
            )
        }
    }
</script>

<style lang="scss">
    .ScrollBar {
        height: 100%;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
</style>