/*
 * @Author: chandre 
 * @Date: 2021-05-08 21:05:01 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-18 10:47:17
 */
const SMSClient = require('@alicloud/sms-sdk');
const { Service } = require('egg');
const _ = require('lodash')

const SMS =  new SMSClient({
    accessKeyId: 'LTAI5tGaZTjwAyVuoduP9uHj', // 访问密钥编号
    secretAccessKey: 'RSSPrIRntxnD8yyo9i4v0GiRMtw5JD', // 密钥
});


// 签名模板
const sign = {
    // 登录验证码
    REG_CODE: {
        SignName: '调货需求', // 签名
        TemplateCode: 'SMS_216828578', // 模板
    },
    // 调货通知
    ORDER_NOTICE: {
        SignName: '调货需求', // 签名
        TemplateCode: 'SMS_216844355', // 模板
    }
};

class CodeService extends Service {

    /**
     * 短信验证码
     * @param {String|Number} phone 手机号
     */
    async sendCode(phone) {
        const { ctx, app } = this;
        if (!phone || _.isEmpty(phone)) ctx.throw(400, '手机号码不能为空');
        const signCode = sign.REG_CODE;
        const codeRandom = Math.random().toFixed(6).slice(-6);
        const params = {
            ...signCode,
            PhoneNumbers: phone,
            TemplateParam: JSON.stringify({ code: codeRandom.toString() }),
        };

        const result = await this._sendSms(params);
        if (!result) ctx.throw(400, '验证码发送失败！');
        await app.cache.set(`sms:${phone}`, { phone, code: codeRandom, }, 300 );

        return true;
    }

    /**
     * 短信通知
     * @param {Array<string>} data 数据
     * @param {phone} data.phone 手机号
     * @param {phone} data.type 类型
     * @param {content} data.content 描述
     * @param {number} data.number 数量
     * 
     */
     async sendNotice(data) {
        const { ctx } = this;
        if (!_.isArray(data) || _.isEmpty(data)) ctx.throw(400, '短信数据格式不正确');
        const signCode = sign.ORDER_NOTICE;
        let PhoneNumberJson = [],
            TemplateParamJson = [],
            SignNameJson = new Array(data.length).fill(signCode.SignName);
        
        data.forEach(item => {
            PhoneNumberJson.push(item.phone);
            TemplateParamJson.push(_.pick(item, ['type', 'content', 'number']));
        })

        const params = {
            TemplateCode: signCode.TemplateCode,
            PhoneNumberJson: JSON.stringify(PhoneNumberJson),
            SignNameJson: JSON.stringify(SignNameJson),
            TemplateParamJson: JSON.stringify(TemplateParamJson),
        };

        const result = await this._sendBatchSMS(params);
        if (!result) ctx.throw(400, '验证码发送失败！');
        return true;
    }

    
    /**
     * 发送单条短信
     * @param {*} params 参数信息
     */
    async _sendSms(params) {
        try {
            const result = await SMS.sendSMS(params);
            if (result.Code === 'OK') return true;
            return false;
        } catch(err) {
            return false;
        }
    }

    /**
     * 发送多条短信
     * @param {*} params 参数信息
     */
     async _sendBatchSMS(params) {
        try {
            const result = await SMS.sendBatchSMS(params);
            if (result.Code === 'OK') return true;
            return false;
        } catch(err) {
            return false;
        }
    }

    // 验证短信
    async checkCode(phone, code) {
        const { ctx, app } = this;
        const result = await app.cache.get(`sms:${phone}`);
        if (!result || result.code != code) return false;
        ctx.runInBackground(async () => {
            await app.cache.del(`sms:${phone}`)
        })
        return true;
    }
}

module.exports = CodeService