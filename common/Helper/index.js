/*
 * 辅助方法
 * @Author: chandre 
 * @Date: 2021-04-17 16:02:47 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 11:45:55
 */
import formatDate from './FormatDate.js'
import randomString from './RandomString.js'
import _ from "underscore"
import cloneDeep from './CloneDeep.js'

export default {
    // 日期时间格式化
    formatDate,
    // 随机密码
    randomString,
    // 深度复制
    cloneDeep,

    /**
     * 计算请求分页参数
     * @param {object} route 当前页面路由
     * @return { size: 10, page: 1 } size = 长度, page = 页码
     */
    getPerPage(query) {
        const params = Object.assign({ page: 1, size: 10 }, query )
        let page = parseInt(+params.page) || 1,
            size = parseInt(+params.size) || 10;
        page = page;
        return { page, size }
    },

    /**
     * byte转unit
     * @param {Number} size 文件大小
     * @returns {String}
     */
    byteToUnit: (size) => {
        let units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
        let unit;
        while ((unit = units.shift()) && size > 1024) {
            size = size / 1024;
        }
        return (unit === 'B' ? size : size.toFixed(2)) + unit;
    },


    /**
     * 列表转树形数据结构
     * @param {*} data 
     * @param {*} parentId 
     * @param {*} parentKey 
     */
    toTree(data=[], parentId=0, parentKey='pid') {
        let tmpObj  = {};
        data.forEach(item => {
            tmpObj[item.id] = _.cloneDeep(item);
        });

        Object.values(tmpObj).forEach(item => {
            const parent = tmpObj[item[parentKey]];
            if (!parent) return;
            if (!_.has(parent, 'children')) {
                parent.children = [];
            }
            parent.children.push(item);
        })

        return Object.values(tmpObj).filter(item => item[parentKey] == parentId )

    },


    /**
     * 递归树型数据转列表
     * @param {Array} data 数据源
     * @param {String} key 子节点key
     */
    treeToList(data=[], key='children') {
        let tmp = [];
        data.forEach(item => {
            let data = _.omit(item, [key]);
            tmp.push(data);
            if (item[key] && item[key].length) {
                tmp = tmp.concat(this.treeToList(item[key]));
            }
        })
        return tmp;
    },

    /**
     * 获取节点，在列表中的路径
     * @param {Array} data 数据源
     * @param {Number} parentId 上级节点id
     * @param {String} key 上级节点key
     * @returns {Array} 
     */
    getNodeTreePath(data =[], parentId, key="pid" ) {
        const tmpObj = {};
        data.forEach(item => tmpObj[item.id] = { ...item });
        let current = tmpObj[parentId];
        let arr = [];
        while(current) {
            arr = [current].concat(arr);
            current = tmpObj[current[key]];
        }
        return arr;
    },

}