/*
 * @Author: chandre 
 * @Date: 2021-04-30 00:48:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-01 01:33:18
 */
const path = require('path');
const { BaseContextClass } = require('egg')
const Validator = require('validatorjs');

// 验证类
class BaseValidatorClass extends BaseContextClass {
    

    /**
     * 自定义错误消息
     */
    messages = {}

    /**
     * 验证
     * @param {Object} data 待验证数据
     * @param {Object} rules 验证规则
     * @param {Object} [customErrorMessages] 自定义错误消息, 可选
     * @returns {Promise}
     */
    check(data, rules, customErrorMessages) {
        return new Promise((resolve, reject) => {
            const validator = new Validator(data, rules, customErrorMessages || this.messages);
            validator.checkAsync(resolve, () => {
                let errors = validator.errors.all();
                Object.keys(errors).forEach(k => errors[k] = errors[k][0] );

                try {
                    this.ctx.throw(412, 'Validation Failed', {
                        code: 'invalid_param',
                        errors
                    });
                } catch(err) {
                    reject(err);
                }
            });
        })
    }
}

const ValidatorLoader = function(app) {
    // 加载验证扩展，自定义验证规则
    const rules = {};
    app.loader.loadExtend('validator', rules);
    for (const key in rules) {
        if (typeof rules[key]!=='function') return;
        Validator.registerAsync(key, rules[key].bind(Validator));
    }

    
    // 加载验证类
    const filePaths = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/validator'));
    app.loader.loadToContext(filePaths, 'validator', {
        call: true,
        fieldClass: 'validatorClasses',
        caseStyle: 'upper'
    })
};


// 静态方法
BaseValidatorClass.loader = ValidatorLoader;
Object.assign(BaseValidatorClass, Validator);

module.exports = BaseValidatorClass;
