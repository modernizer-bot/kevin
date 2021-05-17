<template>
    <transition :name="transitionName">
        <EmptyStatus 
            v-show="isShow"
            :message="errorMsg"
            :type="errorType"
        />
    </transition>
</template>

<script>
    import EmptyStatus from '@/components/EmptyStatus'

    export default {

        components: {
            EmptyStatus
        },

        props:[
            'error'
        ],

        layout(ctx) {
            if (ctx.route.path.startsWith('/admin')) {
                return 'admin'
            }
        },

        data() {
            return {
                isShow: false
            }
        },
        
        computed: {
            // 过渡动画
            transitionName() {
                if (this.$route.path.startsWith('/admin')) {
                    return 'slide-fade'
                }
                return ''
            },
            // 错误类型
            errorType() {
                if (this.error.statusCode==404) return '404';
                return '500'
            },

            // 错误描述
            errorMsg() {
                if (this.error.statusCode == 404) {
                    return '您访问的页面不存在'
                } else {
                    return '服务器内部错误'
                }
            }
        },

        beforeMount() {
            setTimeout(() => this.isShow = true, 300)
        }
    }
</script>