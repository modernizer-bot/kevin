<script>

    export default {

        props: {
            isReload: Boolean,
            title: String,
        },

        data() {
            return {
                isRender: !this.isReload
            }
        },

        async mounted() {
            if (this.isReload) {
                setTimeout(this.hanlderRender)
            }
        },

        methods: {
            // 处理重新渲染内容
            hanlderRender() {
                const $dialog = this.$refs.ElDialog;
                $dialog.$on('open', () => this.isRender = true );
                $dialog.$on('closed', () => this.isRender = false );
            }
        },

        render() {
            
            // 设置默认参数
            const props = Object.assign({
                'width': '640px',
                'modal-append-to-body': false,
                'close-on-press-escape': false,
                'close-on-click-modal': false,
                'append-to-body': true,
            }, this.$attrs);

            return (
                <client-only>
                    <el-dialog
                        props = { props }
                        on = { this.$listeners }
                        ref = 'ElDialog'
                        title={ this.title }
                    >
                        { this.$slots.title && (<template slot="title"> { this.$slots.title }</template>) }
                        { (this.isRender && this.$slots.default )  && this.$slots.default }
                        { this.$slots.footer && (<template slot="footer"> { this.$slots.footer }</template>) }
                    </el-dialog>
                </client-only>
            );
        }
    }
</script>