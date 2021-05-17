<script>
    export default {
        functional: true,

        props: {
            width: String,
            align: String
        },

        render(h, ctx) {
            
            ctx.data.attrs = Object.assign({
                'label-width': '120px',
                'label-suffix': '：',
            }, ctx.data.attrs);

            const FormStyle = {
                width: ctx.props.width,
                margin: ctx.props.align =='center' ? '0 auto' : null
            }

            return (
                <el-form 
                    { ...ctx.data }
                    class="Form"  
                    style={ FormStyle }
                    scopedSlots={ ctx.scopedSlots }
                />
            )
        }
    }
</script>


<style lang="scss">
    .Form {
        padding-top: $--space-md;
        @include clearfix();
        &-tips {
            font-size: $--font-size-small;
            color: $--color-text-secondary;
            line-height: 1;
            padding-top: 4px;
            position: absolute;
            top: 100%;
            left: 0;
        }
    }
    .el-form-item.is-error .Form-tips {
        display: none;
    }
    .el-form-item {
        margin-bottom: 24px!important;
    }
</style>