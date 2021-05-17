/*
 * 全局注入
 * @Author: chandre 
 * @Date: 2021-04-17 16:01:11 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-28 23:55:54
 */
import Helper from '@/common/Helper'
import Api from '@/common/Api'
import FormRule from '@/common/FormRule'
import _ from 'underscore'

/**
 * 路径转URL
 * @param {String} path 路径规则
 * @param {Object} params 路径参数
 * @returns 
 */
const URL_PATTERN = new RegExp(['(\\/|\\.):(\\w+)(\\?)?', '(\\*)' ].join('|'), 'g');
function pathToUrl(path, params) {
    return path.replace( URL_PATTERN, (match, prefix, param, optional, greedy) => {
            if (greedy) {
                prefix = '';
                optional = true;
                param = '$';
            }
            return !optional || params[param] ? prefix + params[param] : '';
        }
    );
}

export default function(ctx, inject) {
    // 辅助方法
    inject('helper', Helper);
    // 表单验证规则
    inject('formRule', FormRule);

    function crateApiMethod(CONF) {
        const METHODS = {};

        Object.keys(CONF).forEach(key => {
            const item = CONF[key];

            // 自定请求方法
            if (_.isFunction(item)) {
                return METHODS[key] = item.bind(ctx)
            }
            
            // 子级
            if (_.isObject(item) && !_.has(item, 'method') && !_.has(item, 'url')) {
                return METHODS[key] = crateApiMethod(item)
            }

            METHODS[key] = ( config = {}, routerParams={} ) => {
                return ctx.$axios({
                    ...config,
                    method: item.method.toLocaleUpperCase(),
                    url: pathToUrl(item.url, routerParams),
                })
            }
        });

        return METHODS;
    }

    // API
    inject('api', crateApiMethod(Api));

}