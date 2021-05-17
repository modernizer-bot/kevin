import { Message } from 'element-ui'
import Qs from 'qs'
import _ from 'underscore'

export default function ({ $axios, store, $cookies, ...ctx }) {
    // 是否服务端
    const isServer = process.server;
    // 请求错误消息处理
    const handlerErrorMessage = _.throttle((status, message) => {
        if (status===401) {
            store.commit('RESET_LOGIN_STATE'); // 验证失败，重置登录数据状态
        } else if (status===403) {
            ctx.redirect('/reset'); //重置密码
        }
        Message.error(message);
    }, 300, { leading: false })

    // 转换请求参数格式
    $axios.defaults.paramsSerializer = (params) => {
        return Qs.stringify(params, {
            arrayFormat: 'comma' // 数组格式转字符串 ?a=b,c
        })
    }

    // 请求
    $axios.onRequest(config => {
        return config
    })

    // 响应
    $axios.onResponse(response => {
        if (response.status==200 && response.data && response.data.code=='200' ) {
            return response.data.data;
        } else {
            return Promise.reject({ response })
        }
    })

    // 错误
    $axios.onError( async err => {
        if (isServer || (err.config && err.config.customError)) {
            return Promise.reject(err);
        };
        // 网络错误
        if (!err.response)  return handlerErrorMessage(404, err.message);
        // 服务器响应错误
        const { status, data } = err.response;
        let msg = '请求失败';
        // 权限验证失败
        if (status===401) {
            msg = '登录超时,请重新登录';
        }
        else if (status===412 && data.errors) {
            msg = Object.values(data.errors)[0];
        }
        else {
            msg = data && data.message ? data.message : msg
        }
        handlerErrorMessage(status, msg);

        // 登录验证失败
        return Promise.reject(err)
    })
}