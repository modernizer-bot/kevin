/*
 * async-validator 自定义数据类型
 * @Author: chandre 
 * @Date: 2021-04-21 12:04:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 11:25:32
 */

import AsyncValidator from 'async-validator'


AsyncValidator.register('mobile', (rule, value, callback) => {
    if (!/^1[3456789]\d{9}$/.test(value) ) {
        callback(new Error('手机号格式错误'))
    } else {
        callback();
    }
})


AsyncValidator.register('phone', (rule, value, callback) => {
    let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;  
    let isMob = /^1[3456789]\d{9}$/;
    if ( isPhone.test(value) || isMob.test(value) ) {
        callback();
    } else {
        callback(new Error('固定电话或手机号格式错误'))
    }
})


// 密码
AsyncValidator.register('password', function(rule, value, callback) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{10,30}$/.test(value) ) {
        callback(new Error('10-30位，必须包含大小写字母、数字和特殊字符'))
    } else {
        callback();
    }
})

// 18位真实身份证号格式验证
const IDVerify = function(ID) {
    ID = ID.toString();
    if (ID.length < 18) return false;
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    Vi = ['1','0','X','9','8','7','6','5','4','3','2']
    let val = Wi.reduce(function(w,a,i){
        return w + a * parseInt(ID.charAt(i))
    }, 0);
    return Vi[val % 11] === ID.charAt(17).toString().toLocaleUpperCase()
}
AsyncValidator.register('idcard', function(rule, value, callback) {
    if ((rule.required || value.trim()!='') && !IDVerify(value)) {
        callback(new Error('身份证号码错误'))
    } else {
        callback();
    }
})