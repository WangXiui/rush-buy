import Vue from 'vue'
import App from './App'
import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import {
  TimeSelect,
  TimePicker,
  InputNumber,
  Tag,
  Alert,
  Message,
  Button,
  Loading,
  Icon,
  Form,
  FormItem,
  Input,
} from 'element-ui'
import 'atomique-class'
import '../common/reset.scss'
import '../common/common.scss'

Vue.prototype.$axios = axios
Vue.prototype.$fetchJsonp = fetchJsonp
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service

Vue.use(Loading.directive)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(InputNumber)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Button)
Vue.use(Loading)
Vue.use(Icon)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
