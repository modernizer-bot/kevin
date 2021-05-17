/*
 * @Author: chandre 
 * @Date: 2021-04-29 22:57:30 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 14:02:14
 */

const Logs = describe => {
    return async (ctx, next) => {


        const logsData = {
            describe,
            path: ctx.originalUrl,
            method: ctx.req.method,
            ip: ctx.ip,
            type: 'INFO',
            query: JSON.stringify(ctx.query),
            params: JSON.stringify(ctx.params),
            body: JSON.stringify(ctx.request.body),
            errors: null,
        }

        try {
            const res = await next();
            ctx.runInBackground(async () => {
                logsData.time = Date.now() - ctx.starttime;
            })
            return Promise.resolve(res)
        } catch(err) {
            ctx.runInBackground(async () => {
                logsData.type = 'ERROR';
                logsData.time =  Date.now() - ctx.starttime;
                logsData.errors = JSON.stringify(err);
            })
            
            return Promise.reject(err)
        }
        
    }
}

module.exports = Logs;