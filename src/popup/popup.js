import Vue from 'vue'
import App from './App'
import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import util from '../mixin/util'
import {
  DatePicker,
  InputNumber,
  Tag,
  Message,

  Select,
  Option,
  Switch,
  Slider,
  Tabs,
  TabPane,
  RadioButton,
  RadioGroup,
  Dialog,
  Button,
  Loading,
  Icon,
  Form,
  FormItem,
  Input,
  Table,
  TableColumn,
  Popconfirm,
  Popover,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'
import 'atomique-class'
import '../common/reset.scss'
import '../common/common.scss'

Vue.prototype.$axios = axios
Vue.prototype.$fetchJsonp = fetchJsonp
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service

Vue.mixin(util)

Vue.use(Loading.directive)
Vue.use(DatePicker)
Vue.use(InputNumber)
Vue.use(Tag)

Vue.use(Select)
Vue.use(Option)
Vue.use(Switch)
Vue.use(Slider)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Loading)
Vue.use(Icon)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

/* eslint-disable no-new */
new Vue({
  el: '#app',

  render: h => h(App)
})
