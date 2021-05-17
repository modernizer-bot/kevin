<template>
    <div class="Admin-Aside">

        <!-- 一级菜单 -->
        <div class="Admin-Aside-Menu">
            <template v-for="(menu, i) in MENU">
                <el-tooltip effect="dark" placement="right" 
                    :key="i"
                    v-if="!menu.hidden"
                    :content="menu.name"
                    :open-delay="300"
                    :enterable="false"
                >
                    <nuxt-link class="Admin-Aside-Menu_item" :to="menu.path">
                        <Icon :name="menu.icon" size="20" />
                    </nuxt-link>
                </el-tooltip>
            </template>
        </div>

        <!-- 子级菜单 -->
        <div class="Admin-Aside-SubMenu" v-show="SUB_MENU.length">
            <h3 class="Admin-Aside-SubMenu_title">{{ MENU_TITLE }}</h3>
            <!-- 菜单列表 -->
            <el-menu
                :default-active="CURRENT_ACTIVE"
                :router="true"
            >
                <template v-for="(menu, i) in SUB_MENU">

                    <el-submenu :index="String(menu.id)" :key="i" v-if="menu.children && !menu.hidden">
                        <span slot="title">{{ menu.name }}</span>
                        <template v-for="(sub, k) in menu.children">
                            <el-menu-item v-if="!sub.hidden"
                                :key="k" 
                                :index="sub.path"
                                :route="{ path: sub.path }"
                            >
                                {{ sub.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>

                    <el-menu-item v-else-if="!menu.hidden"
                        :key="i"
                        :index="menu.path" 
                    >{{ menu.name }}</el-menu-item>
                </template>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import _ from 'underscore'
    import { Scrollbar } from 'element-ui'
    import { mapState } from 'vuex'

    export default {
        
        components: {
            Scrollbar
        },

        data(){
            return {
                // 当前菜单名称
                MENU_TITLE: '',
                // 二级菜单
                SUB_MENU: [],
                // 当前菜单
                CURRENT_ACTIVE: this.$route.path
            }
        },

        computed: {

            ...mapState(['MENU']),

            // 主菜单
            MAIN_MENU() {
                return this.MENU
                    // 过滤出主菜单
                    .filter(item => item.pid == 0 && !item.hidden) 
                    // 排序
                    .sort((a,b) => b.sort - a.sort );
            },

            // 菜单树型数据
            MENU_TREE() {
                const USER_MENU = {};
                this.USER_MENU.forEach(item => {
                    if (item.hidden) return;
                    USER_MENU[item.id] = { ...item };
                });
                for (const k in USER_MENU) {
                    const item = USER_MENU[k];
                    if ( item.hidden || item.pid===0 ) continue;
                     const parent = USER_MENU[item.pid];
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(item);
                }

                return USER_MENU;
            },
            
        },

        watch: {
            $route: {
                immediate: true,
                handler: 'getCurrentMenu'
            }
        },

        methods: {

            // 获取当前菜单
            async getCurrentMenu(to) {
                this.$set(this, 'SUB_MENU', []);
                await this.$nextTick();
                for (const menu of this.MENU) {
                    const regexp = new RegExp(menu.path);
                    if (regexp.test(to.path)) {
                        // 获取主菜单名称
                        this.MENU_TITLE = menu.name;
                        // 子菜单
                        this.SUB_MENU = menu.children
                        // 设置当前菜单选中
                        this.getCurrentActive(to);
                        break;
                    }
                }
            },

            // 计算当前高亮子菜单
            getCurrentActive(to) {
                for (const k in this.SUB_MENU) {
                    const item = this.SUB_MENU[k];
                    if (item.path) {
                        const regexp = new RegExp(item.path);
                        if (regexp.test(to.path)) {
                            this.CURRENT_ACTIVE = item.path;
                            break;
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .Admin-Aside {
        user-select: none;
        &-Menu {
            width: 64px;
            display: flex;
            flex: 1;
            flex-direction: column;
            border-right: 1px solid $--border-color-lighter;

            &_item {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 64px;
                color: $--color-text-regular;
                transition: .3s;
                cursor: pointer;
                &:hover {
                    color: $--color-text-primary;
                    background-color: $--background-color-base;
                }
                &.is-active {
                    color: $--color-white;
                    background-color: $--color-primary;
                }
                span {
                    margin-left: $--space-base;
                }
            }
        }

        &-SubMenu {
            width: 140px;
            border-right: 1px solid $--border-color-lighter;
            overflow: hidden;

            &_title {
                display: flex;
                align-items: center;
                height: 64px;
                color: $--color-primary;
                padding: 0 $--space-md;
                font-size: $--font-size-extra-large;
                font-weight: normal;
            }
        }
    }
</style>

<style lang="scss">
    .Admin-Aside-SubMenu {
        .el-menu {
            border-right: 0;
            background-color: transparent;
            &-item {
                height: 40px;
                line-height: 40px;
                padding: 0 $--space-md!important;
                color: $--color-text-regular;
                &:hover, &:focus {
                    color: $--color-text-primary;
                    background-color: transparent;
                }
                &.is-active {
                    color: $--color-text-primary;
                    background-color: $--background-color-base;
                }
            }
        }
        
        .el-submenu {
            &__title {
                height: 40px;
                line-height: 40px;
                padding-left: $--space-md!important;
                font-weight: bold;
                &:hover {
                    background-color: $--background-color-base;
                }
            }

            .el-menu-item {
                padding-left: 2em!important;
            }
        }
    }

    .Admin-Aside-ScrollBar {
        height: 100%;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
       
    }
</style>