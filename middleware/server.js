/*
 * 服务端中间件
 * @Author: chandre 
 * @Date: 2021-04-24 14:33:03 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-24 15:22:41
 */
export default async function ServerMiddleware(req, res, next) {
    console.info('req', req.originalUrl)
    next();
}