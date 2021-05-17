<template>
    <div class="Admin" v-if="USER_INFO">
        <!-- 头栏 -->
        <Header />
        <div class="Admin-Container">
            <!-- 边栏菜单 -->
            <Aside />
            <div class="Admin-Main">
                <!-- 页面 -->
                <div class="Admin-Body">
                    <client-only>
                        <nuxt />
                    </client-only>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'underscore'
    import Aside from '@/components/Admin/Aside';
    import Header from '@/components/Admin/Header';
    import { mapState } from 'vuex'

    export default {
        components: {
            Aside,
            Header
        },

        data() {
            return {
                // 菜单是否折叠
                isCollapse: false
            }
        },

        computed: {
            ...mapState(['USER_INFO'])
        },

    }
</script>

<style lang="scss">
    @import '../scss/admin/app.scss';
</style>