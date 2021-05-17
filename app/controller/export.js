/*
 * 报表
 * @Author: chandre 
 * @Date: 2021-05-08 22:58:12 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-14 17:13:24
 */
const { Controller } = require('egg');
const _ = require('lodash')
const { Route, HttpPost, Middleware } = require('egg-decorator-router');
const Api = require('../middleware/api');
const path = require('path')
const fs = require('fs')
const ejsexcel = require('ejsexcel')
const tplPath = path.resolve(__dirname, '../public/template');

@Route('/api/report')
@Middleware(Api())
class ExportController extends Controller {
   
    // 导出
    @HttpPost('/export')
    async export() {
        const { ctx } = this;
        const { date, data, type, total } = ctx.request.body;
        if (!date || _.isEmpty(date)) ctx.throw(400, '未设置表头日期字段');
        if (!type || _.isEmpty(type)) ctx.throw(400, '未设置导出模板类型');
        if (!data || _.isEmpty(data)) ctx.throw(400, '未设置导出数据');

        const files = {
            'month': 'month.xlsx',
            'quarter': 'quarter.xlsx',
            'assets': 'assets.xlsx'
        }
        let templateFileBuffer = null;
        try {
            templateFileBuffer = fs.readFileSync(path.resolve(tplPath,  files[type] ))
        } catch(err) {
            ctx.throw(400, `模板文件不存在`)
        }

        try {
            const fileBuffer = await ejsexcel.renderExcel(templateFileBuffer, { date, list: data, total });
            return fileBuffer
        } catch(err) {
            ctx.throw(400, `模板数据处理失败`)
        }
    }

}


module.exports = ExportController