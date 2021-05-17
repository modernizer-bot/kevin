/*
 * 全局混入
 * @Author: chandre 
 * @Date: 2021-04-15 01:23:35 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-09 08:59:43
 */

import Vue from 'vue'
import components from "./components"
import data from "./data"
import methods from "./methods"

Vue.mixin({
    // 自定义通用组件
    components,
    // 变量
    data,
    // 方法
    methods,
    // 过渡动画
    transition: 'slide-fade'
    
})
