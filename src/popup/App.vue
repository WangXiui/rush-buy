<template>
  <div class="popup pa16 box-shadow bg-fff tal flex flex-column"
    :style="[styleObj]">
    <div class="flex-grow">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="抢购时间">
          <el-date-picker
            size="mini"
            v-model="form.deadline"
            value-format="timestamp"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="触发频率">
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
        styleObj: {minWidth: '500px', minHeight: '500px'},
        form: {
          // 抢购时间
          deadline: '',
          // 触发频次
          frequency: 1,
        },
        // 触发频次列表
        frequencyList: [5, 10, 15, 20, 25, 30],
        // 倒计时
        countDown: '',
        // 定时器
        countdownId: '',
        config: {
          format: 'HH:mm:ss'
        }
      }
    },
    created() {
      this.init()
      this.getBtn()
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
      getBtn() {
        // chrome.tabs.query可以通过回调函数获得当前页面的信息tabs
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          console.log('tabs11', tabs);

          let tabId = tabs.length ? tabs[0].id : null;
          // 向当前页面注入 JavaScript 脚本
          chrome.tabs.executeScript(tabId || null, {
            file: 'popup/content.js'
          }, function () {
            // 向目标网页进行通信，向 recommend.js 发送一个消息
            chrome.tabs.sendMessage(tabId, {
              message: 'GET_TOPIC_INFO',
            }, function (response) {
              console.log('response', response);
              // 获取到返回的文章 title 、url、description
              // host.article.title = response.title;
              // host.article.link = response.link;
              // host.article.description = response.description;
            });
          });

          // 发送一个copy消息出去
          /*chrome.tabs.sendMessage(tabs[0].id, { action: "copy" }, function (response) {
            console.log('response11', response);
            // 这里的回调函数接收到了要抓取的值，获取值得操作在下方content-script.js
            // 将值存在background.js的data属性里面。
            var win = chrome.extension.getBackgroundPage();
            win.data=response;
            console.log(response);

            // 监听来自content-script的消息
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
            {
              console.log('收到来自content-script的消息：');
              console.log(request, sender, sendResponse);
              sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
            });
          });*/
        });
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
        // await this.$nextTick()
        // const ele = document.getElementsByClassName('user-info-no')[0]
        // console.log('ele', ele);
        // ele.onclick({target: ele})
        // window.dispatchEvent(ele.onclick)
        // this.$message.success('已结束！')
      },
      startTimer() {
        if (this.countdownId) return;
        const {deadline} = this.form
        this.getBtn()

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