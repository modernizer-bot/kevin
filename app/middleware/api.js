/*
 * @Author: chandre 
 * @Date: 2021-04-29 22:57:30 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 09:54:57
 */

const Api = options => {
    return async (ctx, next) => {
        await next()
        .then(res => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: 'success',
                data: res
            };
        }).catch(err => {
            ctx.status = parseInt(+err.status) || 400;
            ctx.body = {
                code: err.status,
                message: err.message,
                errors: err.errors
            };
        });
    }
}

module.exports = Api;