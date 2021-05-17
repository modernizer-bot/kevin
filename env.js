/*
 * 环境变量
 * @Author: chandre 
 * @Date: 2021-04-26 11:00:34 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 08:46:16
 */

const EnvBase = {
    // 项目名称
    PROJECT_NAME: '中国科学院大学',
    // 版权所属
    COPY_RIGHT: '中国科学院大学',
    // Api 请求地址
    API_BASE_URL: 'http://127.0.0.1:7001',
}

// 开发环境
const EnvDev = Object.assign({}, EnvBase, {
    API_BASE_URL: 'http://127.0.0.1:7001',
})


export default (process.env.NODE_ENV == 'development') ? EnvDev : EnvBase;