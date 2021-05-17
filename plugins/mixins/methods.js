
import _ from 'underscore'

export default {

    /**
     * 操作权限验证
     * @param {String} permission 操作权限
     * @param {Function} callback 验证参过后执行回调
     * @param {*} args 回调方法传递的参数
     */
    operatorAuth(permission, callback, ...args) {
        if(!_.isString(permission) || !_.isFunction(callback)) return;
        const USER_ROLES = this.$store.state.USER_ROLES;
        if (!USER_ROLES.includes(permission)) {
            // return this.$message.error('您无权执行当前操作，请联系系统管理员！')
        }
        return callback(...args);
    },

    /**
     * 页面跳转
     * @param {*} params 路由参数
     */
    jumpPage(params) {
        this.$router.push(params)
    },

    /**
     * 返回上一页
     */
    goBack() {
        window.history.length > 0 ? this.$router.go(-1) : this.$router.push("/")
    },


    // 错误捕获
    throw(err) {
        if (process.env.NODE_ENV == 'development') {
            console.error(err)
        }
    }
}