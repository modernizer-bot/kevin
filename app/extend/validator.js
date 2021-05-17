/*
 * 验证规则
 * @Author: chandre 
 * @Date: 2021-04-30 22:05:31 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 11:23:14
 */

const Validator = require('../../libs/validator');

// 身份证验证
function IDVerify(ID) {
    ID = ID.toString();
    if (ID.length < 18) return false;
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    Vi = ['1','0','X','9','8','7','6','5','4','3','2']
    let val = Wi.reduce(function(w,a,i){
        return w + a * parseInt(ID.charAt(i))
    }, 0);
    return Vi[val % 11] === ID.charAt(17).toString().toLocaleUpperCase()
}

module.exports = {
    // 手机号码
    mobile: function(value, requirement, attribute, callback) {
        callback(/^1[3456789]\d{9}$/.test(value))
    },
    // 固话，手机号
    phone: function(value, requirement, attribute, callback) {
        let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;  
        let isMob = /^1[3456789]\d{9}$/;
        callback(isPhone.test(value) || isMob.test(value))
    },
    // UUID
    uuid: function(value, requirement, attribute, callback) {
        callback(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value))
    },
    // 18位身份证号
    idcard: function(value, requirement, attribute, callback) {
        callback(IDVerify(value))
    },
    // 密码
    password: function(value, requirement, attribute, callback) {
        callback(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{10,30}$/.test(value))
    }
};


