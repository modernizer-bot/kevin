<script>
    export default {
        functional: true,

        props: {
            col: {
                type: [Number,String],
                default: 24
            }
        },

        render(h, ctx) {

            const className = `el-col-${ parseInt(ctx.props.col) }`

            return (
                <el-form-item 
                    { ...ctx.data }
                    class={ className }
                    scopedSlots={ ctx.scopedSlots }
                />
            )
        }
    }
</script>
