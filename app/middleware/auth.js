/*
 * @Author: chandre 
 * @Date: 2021-04-29 22:57:30 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 09:58:09
 */

const Auth = permission => {
    return async (ctx, next) => {
        
        // 当前用户是否登录
        await ctx.service.auth.isLogin();
        // 验证操作权限
        const AccountInfo = ctx.service.auth.info;
        if (AccountInfo.type!=='admin' && /^admin/.test(permission)) {
            ctx.throw(404, '您无权访问')
        }


        return await next()
    }
}

module.exports = Auth;