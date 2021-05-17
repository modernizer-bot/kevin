/*
 * 用户中间件
 * @Author: chandre 
 * @Date: 2021-04-17 16:10:58 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 21:55:05
 */
export default async function BaseMiddleware(ctx) {
    // 当前路由
    const StoreState = ctx.store.state;
    const currentPath = ctx.route.path;
    
    const isLoginPage = /^(\/login|\/reset)/.test(currentPath);
    if (isLoginPage) return;

    // Cookies
    const JWT_TOKEN = ctx.$cookies.get('token');
    
    // 未登录
    if (!JWT_TOKEN) {
        return ctx.redirect('/login')
    }

    // 刷新页面获取用户基本信息
    if (!StoreState.USER_INFO) {
        try {
            await ctx.store.dispatch('GET_USER_INFO');
        } 
        // TOKEN 验证失败，返回登录页
        catch(err) {
            ctx.$cookies.removeAll();
            return ctx.redirect('/login')
        }
    }

    // 管理员
    const isAdminPage = /^\/admin/.test(ctx.route.path);
    // 商家
    const isMerchantPage = /^\/merchant/.test(ctx.route.path);

    if (StoreState.IS_ADMIN && !isAdminPage ) {
        return ctx.redirect('/admin/commodity/order');
    } 
    // 非管理员访问后台
    else if(!StoreState.IS_ADMIN && !isMerchantPage) {
        return ctx.redirect('/merchant/commodity/order');
    }
    

}
