/*
 * 全局变量
 * @Author: chandre 
 * @Date: 2021-04-19 19:08:05 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-05-15 13:16:52
 */
export default () => {
    return {
        // 是否加载中
        isLoading: false,
        // 日期时间面板配置，不超过当前时间
        DateTimePickerOptions: {
            disabledDate: time => {
                return time.getTime() > Date.now();
            }
        },
        // 日期时间面板配置，不超过当前时间, 带快捷选项
        DateTimePickerOptionsQuick: {
            disabledDate: time => {
                return time.getTime() > Date.now();
            },
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
        }
    }
}