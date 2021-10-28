<template>
  <div class="popup ma16 shadow-primary bg-fff tal flex flex-column"
    :style="[styleObj]">
    <div class="flex-grow pa16">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="抢购时间" prop="deadline">
          <el-date-picker
            size="mini"
            v-model="form.deadline"
            value-format="timestamp"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抢购数量" prop="count">
          <el-input-number v-model="form.count" :min="0" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="触发频率" prop="frequency">
          <span>每秒</span>
          <el-input-number class="input-suffix_percentage tal" data-unit="次" v-model="form.frequency" :controls="false" :min="1" :max="20" :step="1" :precision="0" placeholder="0~20"></el-input-number>
        </el-form-item>
      </el-form>

      <div class="tac">
        <el-button type="primary" round @click="startTimer">开始倒计时</el-button>
      </div>

      <!--倒计时-->
      <div class="tac flex justify-center items-center mt16" v-if="countDown">
        <div v-for="(item, index) in countDown.split(':')" :key="index">
          <span class="mx4 align-middle" v-if="index > 0">:</span>
          <el-tag class="f20 align-middle" >{{item}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatCountdown} from '../utils'
export default {
  name: "App",
  data() {
    return {
      styleObj: {width: '400px'},
      form: {
        // 抢购时间
        deadline: '',
        // 抢购数量
        count: 0,
        // 触发频次
        frequency: 1,
      },
      // 倒计时
      countDown: '',
      // 定时器
      countdownId: '',
      config: {
        format: 'HH:mm:ss'
      },
      rules: {
        deadline: [{ required: true, trigger: "blur", message: "请选择抢购时间。" }],
        count: [{ required: true, trigger: "blur", message: "请输入抢购数量。" }],
        frequency: [{ required: true, trigger: "blur", message: "请输入触发频次。" }],
      },
      win: {}
    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      const {deadline} = this.form
      const now = new Date().getTime()
      if (deadline >= now) {
        this.startTimer()
        return
      }
      this.stopTimer()
    },
    /**
     * 开始抢购
     */
    rushing() {
      // chrome.tabs.query可以通过回调函数获得当前页面的信息tabs
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('tabs11', tabs);
        let tabId = tabs.length ? tabs[0].id : null;

        // 向当前页面注入 JavaScript 脚本
        chrome.tabs.executeScript(tabId || null, {
          file: './popup/content.js'
        }, function (_) {
          let e = chrome.runtime.lastError;
          if (e !== undefined) {
            console.log(tabId, _, e);
          }

          // 向目标网页进行通信，向 content.js 发送一个消息
          chrome.tabs.sendMessage(tabId, {
            message: 'GET_TOPIC_INFO',
            data: this.form
          }, function (response) {
            if (!window.chrome.runtime.lastError) {
              console.log('response', response);
              if (!response) return false;
              // 获取到返回的文章 title 、url、description
              // host.article.title = response.title;
              // host.article.link = response.link;
              // host.article.description = response.description;
            } else {
              console.log('window.chrome.runtime.lastError', window.chrome.runtime.lastError);
            }
          });
        });
      });
    },
    async handleSetting() {
      const valid = await this.$refs.form.validate().catch(err => console.log(err))
      if (!valid) return false
      // 将值存在background.js的data属性里面。
      this.win = chrome.extension.getBackgroundPage();
      this.win.conditionObj = this.form;
    },
    paste() {
      var win = chrome.extension.getBackgroundPage();
      if (win.data) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          console.log(tabs);
          chrome.tabs.sendMessage(tabs[0].id, { action: "paste", data: win.data }, function (response) {
            console.log(response);
          });
        });
      }
    },
    async onFinish() {
      this.rushing()
    },
    startTimer() {
      if (this.countdownId) return;
      const {deadline} = this.form
      // 保存设置
      this.handleSetting()

      // 开启倒计时
      this.countdownId = window.setInterval(() => {
        if (deadline > Date.now()) {
          this.countDown = formatCountdown(deadline, this.config)
          // onChange(deadline - Date.now());
        }
        this.init()
      }, 1000 / this.form.frequency);
    },
    stopTimer() {
      if (this.countdownId) {
        clearInterval(this.countdownId);
        this.countdownId = undefined;

        const {deadline} = this.form
        if (deadline < Date.now()) {
          this.onFinish();
        }
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "./popup.scss";
.popup {
  &-opt {
  }
}
</style>
