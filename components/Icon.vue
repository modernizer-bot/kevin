<style lang="scss" scoped>
    .svg_icon {
        display: inline-block;
        line-height: 1;
        vertical-align: -0.15em;
        fill: currentColor;
        width: 1em;
        height: 1em;
        overflow: hidden;
    }
</style>

<script>
    import '@/assets/icons/svg/home.svg';
    import '@/assets/icons/svg/setting.svg';
    
    export default {
        
        functional: true,

        props: {
            size: [Number,String],
            name: String
        },

        render(h, ctx) {
            const { size, name } = ctx.props;
            if (!name) return;
            const iconName = `#icon-${ name }`;
            const fontSize = size ? parseInt(size) + 'px' : null;
            const iconStyle = { fontSize }
            return (
                <svg aria-hidden="true" class="svg_icon" style={ iconStyle }>
                    <use xlinkHref={ iconName } />
                </svg>
            )
        }
    }
</script>