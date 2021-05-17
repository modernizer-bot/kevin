/*
 * @Author: chandre 
 * @Date: 2021-04-15 22:54:45 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-16 15:42:59
 */
import Menu from '@/common/Menu'

export default {

    state() {
        return {
            // 字典
            DICT: null,
            // 用户基本信息
            USER_INFO: null,
            // 菜单配置
            MENU: [],
            // 是否为管理员
            IS_ADMIN: false,
            // 商品规格
            UNIT: [
                '个', '套', '米', '台', '盒', '箱', '件', '支', '节',
                '根', '块', '片', '粒', '张'
            ],
            // 账号下的公司列表
            ACCOUNT_COMPANY: [],
            // 商品分类
            CATEGORY: [],
        }
    },

    getters: {
   
    },

    mutations: {

        // 设置当前用户基本信息
        SET_LOGIN_STATE(state, data) {
            state.USER_INFO = data;
            state.IS_ADMIN = data.type==='admin';
            state.MENU = (state.IS_ADMIN) ? Menu.admin : Menu.merchant
        },

        // 设置登录状态
        SET_LOGIN_STATUS(state, token) {
            let exp = new Date();
            exp.setHours( exp.getHours() + 12 );
            const cookieOptions = { 
                path: '/',
                expires: exp
            }
            // 保存 token
            this.$cookies.set('token', token, cookieOptions);
            // 跳转页面
            this.$router.replace( state.IS_ADMIN ? "/admin/commodity/order" : '/merchant/commodity/order')
        },

        // 重置登录数据状态
        RESET_LOGIN_STATE(state) {
            state.USER_INFO = null;
            this.ACCOUNT_COMPANY = [];
            this.CATEGORY = [];
            this.$cookies.remove('token');
            this.$router.replace("/login")
        },

        // 当前账号下的公司列表
        SET_ACCOUNT_COMPANY(state, data) {
            state.ACCOUNT_COMPANY = data;
        },

        // 商品分类
        SET_CATEGORY(state, data) {
            state.CATEGORY = data;
        }

    },

    actions: {
        
        // 服务端初始化，默认请求
        async init(ctx) {
            try {
                // 已登录, 获取登录用户资料
                const JWT_TOKEN = this.$cookies.get('token');
                !!JWT_TOKEN && await ctx.dispatch('GET_USER_INFO');
            } catch(err) {
                // 权限验证失败，清空原有token, 并返回登录页
                this.$cookies.removeAll();
                // 如果当前访问页面是用户中心、后台页面，跳转登录页
                const currentPath = ctx.route.path;
                if (/^(\/admin|\/user_center)/.test(currentPath)) {
                    return app.redirect('/login')
                }
            }
        },

        // 用户登录
        async LOGIN(ctx, data) {
            return this.$api.Login({ data }).then(res => {
                this.commit('SET_LOGIN_STATE', res.info);
                this.commit('SET_LOGIN_STATUS', res.token)
                return res;
            })
        },

        // 退出登录
        async LOGOUT(ctx) {
            this.commit('RESET_LOGIN_STATE');
            this.commit('SET_USER_MENU', []); //清空后台菜单
            return res;
        },

        // 登录状态获取用户基本信息
        async GET_USER_INFO(ctx) {
            return this.$api.UserInfo().then(res => {
                this.commit('SET_LOGIN_STATE', res);
                return res;
            })
        },

        // 公司列表
        GET_ACCOUNT_COMPANY(ctx) {
            return this.$api.CompanyAll().then(res => {
                ctx.commit('SET_ACCOUNT_COMPANY', res);
                return res;
            })
        },

        // 商品分类
        GET_CATEGORY(ctx) {
            return this.$api.CategoryAll().then(res => {
                ctx.commit('SET_CATEGORY', res);
                return res;
            })
        },
        
    }

}