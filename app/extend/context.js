/*
 * @Author: chandre 
 * @Date: 2021-05-01 00:23:46 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-01 01:01:00
 */

const _ = require('lodash');

module.exports = {

    /**
     * 分页参数
     */
    get paginate() {
        const data = {};
        data.page = parseInt(+this.query.page) || 1;
        data.size = parseInt(+this.query.size) || 10;
        data.offset = (data.page - 1) * data.size;
        return data
    }

}