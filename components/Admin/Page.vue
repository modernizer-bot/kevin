<script>
    export default {
        functional: true,
        props: {
            title: String
        },

        render(h, ctx) {
            const props = ctx.props;
            const slots = ctx.slots();

            function renderDefaultSlot() {

                if (!slots.menu && !slots.tools && !slots.filter && !slots.default && !slots.footer ) {
                    return null;
                }

                return (
                    <div class="Admin-Page-Wrapper">
                        { slots.menu && <div class="Admin-Page-Menu">{ slots.menu }</div> }
                        { slots.filter && <div class="Admin-Page-Filter">{ slots.filter }</div> }
                        { slots.tools && <div class="Admin-Page-Tools">{ slots.tools }</div> }
                        <div class="Admin-Page-Body">
                            { slots.default }
                        </div>
                        { slots.footer && <div class="Admin-Page-Footer">{ slots.footer }</div> }
                    </div>
                )
            }

            return (
                <div class="Admin-Page">
                    { props.title && <h2 class="Admin-Page_title">{ props.title }</h2> }
                    { slots.before && <div class="Admin-Page_before">{ slots.before }</div> }
                    { renderDefaultSlot() }
                    { slots.after && <div class="Admin-Page_after">{ slots.after }</div> }
                </div>
            )
        }
    }
</script>

<style lang="scss">
    .Admin-Page {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 100%;

        &_title {
            flex-shrink: 0;
            font-size: $--font-size-large;
            color: $--color-text-primary;
            margin-top: $--space-sm;
            margin-bottom: $--space-lg;
        }

        &_before {
            margin-bottom: $--space-md;
        }

        &_after {
            margin-top: $--space-md;
        }

        &-Wrapper {
            flex: 1;
            background-color: $--color-white;
            padding: 0 $--space-lg $--space-md;
        }

        &-Menu, &-Tools, &-Filter, &-Body, &-Footer {
            margin-top: $--space-md;
        }

        // 菜单
        &-Menu {
            display: flex;
            border-bottom: 1px solid $--border-color-lighter;
            user-select: none;
            & > * {
                display: flex;
                align-items: center;
                font-size: $--font-size-medium;
                border-bottom: 2px solid transparent;
                margin-bottom: -1px;
                padding: $--space-sm 0 $--space-md;
                color: $--color-text-regular;
                transition: .3s;
                &:hover, &.is-active {
                    color: $--color-text-primary;
                }
                &.active {
                    border-bottom-color: $--color-primary;
                }
                & + * {
                    margin-left: $--space-lg * 1.5;
                }
            }
        }

        // &-Filter + &-Body {
        //     margin-top: 0;
        // }

        // 工具条
        &-Tools, &-Footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &-Filter + &-Tools {
            margin-top: 0;
        }

        &-Tools {
            align-items: flex-start;
            .el-form-item {
                margin-bottom: 0!important;
            }
        }

        &-Footer {
            
        }
    }
</style>
