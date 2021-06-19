/*
 * Elemenu-ui 2.x
 * @Author: chandre 
 * @Date: 2021-04-14 22:41:36 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-06-16 11:12:10
 */
import Vue from 'vue'

Vue.prototype.$ELEMENT = { size: 'medium', zIndex: 3000 };

import {

    // 菜单
    Menu,
    MenuItem,
    Submenu,

    // 表格
    Table,
    TableColumn,
    Pagination,
   
    // 表单
    Button,
    ButtonGroup,
    Form,
    FormItem,
    Input,
    InputNumber,
    Select,
    Option,
    Switch,
    DatePicker,

    // 弹出
    Dialog,
    Tooltip,
    Popover,

    // 消息、提示
    Loading,
    Message,
    MessageBox,
    // Notification,

    // 展示
    Avatar,
    Divider,
    Link,
    Tag,

} from 'element-ui'

// 表格
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

// 菜单
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);

// 表单
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select)
Vue.use(Option)
Vue.use(Switch)
Vue.use(DatePicker)

// 弹出
Vue.use(Dialog);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Tag);

// 消息、提示
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

// 展示
Vue.use(Avatar);
Vue.use(Divider)
Vue.use(Link)
