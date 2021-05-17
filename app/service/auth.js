/*
 * @Author: chandre 
 * @Date: 2021-05-08 21:05:01 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 18:01:19
 */
const { Service } = require('egg');
const _ = require('lodash')

const ACCOUNT_INFO = Symbol('Application/Account_info')

class AuthService extends Service {

     /**
     * 获取当前用户账号信息
     * @returns {Object}
     */
      get info() {
        if (!this[ACCOUNT_INFO]) {
            const token = this.getToken();
            const data = this.app.jwt.decode(token);
            this[ACCOUNT_INFO] = _.pick(data, [ 'id', 'username', 'type', 'companys' ])
        }
        return this[ACCOUNT_INFO]
    }

    /**
     * 获取Token
     */
    getToken() {
        const token = this.ctx.cookies.get('token', { signed: false });
        return token;
    }

    /**
     * 是否登录
     */
    async isLogin() {
        const token = this.getToken(),
            jwt = this.app.jwt,
            ctx = this.ctx;
        if (!token) ctx.throw(401, '未登录');
        try {
            jwt.verify(token);
        } catch(err) {
            ctx.throw(401, '登录超时，请重新登录')
        }
    }

   
}

module.exports = AuthService