/*
 * Element-ui 主题打包
 * 请使用 node 11.15.0 
 * @Author: chandre 
 * @Date: 2021-04-14 14:31:53 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-15 14:04:59
 */
var elementTheme = require('element-theme')
elementTheme.run({
    config: './scss/element-ui/var.scss',
    out: './theme',
    minimize: true
})