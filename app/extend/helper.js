/*
 * 辅助方法
 * @Author: chandre 
 * @Date: 2021-03-31 20:00:57 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-08 17:43:00
 */
const bcrypt = require('bcrypt');

module.exports = {
    
    /**
     * 是否为邮箱地址
     * @param {string} value 邮箱地址
     * @returns {boolean} 
     */
    isEmail(value) {
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        return reg.test(value);
    },

    /**
     * 是否为手机号码
     * @param {string} value 手机号码
     * @returns {boolean} 
     */
    isMobile(value) {
        let reg = /^1[3456789]\d{9}$/;
        return reg.test(value);
    },

    /**
     * 获取分页参数
     * @param {number} currentPage 当前页数
     * @param {number} pageSize 每页条目个数
     * @returns {object}
     */
    getPerPage(currentPage, pageSize) {
        currentPage = parseInt(+currentPage) || 1;
        pageSize = parseInt(+pageSize) || 10;
        return {
            currentPage,
            pageSize,
            offset: (currentPage - 1) * pageSize
        }
    },

    /**
     * 生成密码hash
     * @param {string} password 明文密码字符串
     * @param {number} saltRounds hash杂凑次数
     * @return {string} 加密后的60位hash值
     */
    getHash(password, saltRounds=6) {
        return bcrypt.hashSync(password, saltRounds);
    },

    /**
     * 验证密码hash
     * @param {string} password 明文密码字符串
     * @param {string} hash 加密后的60位hash值
     * @return {boolean} true=正确， false=不正确
     */
    checkHash(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}