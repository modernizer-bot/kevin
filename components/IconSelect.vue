<script>
    import Icon from './Icon'

    const icons = [
        'home', 'setting', 'member', 'company', 'site',
        'calendar', 'article', 'news', 'map', 'comment',
        'chart', 'email', 'edit', 'folder', 'cloud'
    ]

    export default {
        functional: true,
        render(h, ctx) {
            const Icons = icons.map(item => {
                return (
                    <el-option value={ item }>
                        <Icon name={item} size="20" />
                    </el-option>
                )
            })

            return (
                <el-select { ...ctx.data } popper-class="IconSelect">
                    { Icons }
                </el-select>
            )
        },
    }
</script>

<style lang="scss">
    .IconSelect {
        .el-select-dropdown__list {
            display: flex;
            flex-wrap: wrap;
            padding: 6px;
            min-width: 300px;
        }
        .el-select-dropdown__item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20%;
            height: 48px;
            padding: 0;
        }
    }
</style>