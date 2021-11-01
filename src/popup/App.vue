<template>
  <div class="popup ma16 shadow-primary bgc-FFF tal flex flex-column"
    :style="[styleObj]">
    <div class="flex-grow pa16">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="抢购时间" prop="deadline">
          <!--<el-time-select
              class="w-10/10"
              size="mini"
              v-model="form.deadline"
              :picker-options="{start: '08:00',step: '01:00',end: '18:00'}"
              placeholder="请选择时间">
          </el-time-select>-->
          <el-time-picker
            class="w-10/10"
            size="mini"
            v-model="form.deadline"
            value-format="timestamp"
            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
            placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="抢购数量" prop="count">
          <el-input-number class="w-10/10" v-model="form.count" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="触发频率" prop="frequency">
          <div class="flex">
            <span>每秒</span>
            <el-input-number class="input-suffix_percentage tal flex-grow ml8" data-unit="次" v-model="form.frequency" :controls="false" :min="1" :max="20" :step="1" :precision="0" placeholder="0~20"></el-input-number>
          </div>
        </el-form-item>
      </el-form>
      <div class="tac">
        <el-button class="w-10/10" type="primary" round @click="handleSetting">开始倒计时</el-button>
      </div>
      <!--倒计时-->
      <div class="tac flex justify-center items-center mt16" v-if="countDown">
        <div v-for="(item, index) in countDown.split(':')" :key="index">
          <span class="mx4 align-middle" v-if="index > 0">:</span>
          <el-tag class="f20 align-middle py2 px4 inline-block h-auto" >{{item}}</el-tag>
        </div>
      </div>
      <!--抢购成功-->
      <el-alert class="mt16" title="抢购成功！" type="success" show-icon v-if="isSuccess"></el-alert>
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
        frequency: 10,
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
      win: {},
      tabId: '',
      // 抢购成功
      isSuccess: false
    }
  },
  computed: {
    /**
     * 完整时间戳
     * @returns {number}
     */
    deadlineComplete() {
      let {deadline} = this.form
      // deadline = new Date(`${new Date().toLocaleDateString()} ${deadline}`).getTime()
      return deadline
    }
  },
  created() {
    this.init()
  },
  activated() {
    console.log(111);
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
      const now = new Date().getTime()
      if (this.deadlineComplete >= now) {
        this.startTimer()
        return
      }
      this.stopTimer()
    },
    /**
     * 设置
     * @returns {Promise<boolean>}
     */
    async handleSetting() {
      const valid = await this.$refs.form.validate().catch(err => console.log(err))
      if (!valid) return false
      this.getCurrentTabId()
      this.storeConst({
        // 存储表单
        form: this.form,
        // 当前组件实例
        instance: this,
      })
      // 开启倒计时
      this.startTimer()
    },
    /**
     * 获取当前页面的tabId
     */
    getCurrentTabId() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs)=> {
        this.tabId = tabs.length ? tabs[0].id : null;
        this.storeConst({
          // 存储tabId
          tabId: this.tabId,
        })
      })
    },
    /**
     * 开始倒计时
     */
    startTimer() {
      if (this.countdownId) return;
      // 开启倒计时
      this.countdownId = window.setInterval(() => {
        console.log('开始倒计时:deadline', this.deadlineComplete);
        // 定时器任务
        if (this.deadlineComplete > Date.now()) {
          this.countDown = formatCountdown(this.deadlineComplete, this.config)
          // onChange(deadline - Date.now());
        }
        this.init()
      }, 1000 / this.form.frequency);
    },
    /**
     * 停止倒计时
     */
    stopTimer() {
      if (this.countdownId) {
        clearInterval(this.countdownId);
        this.countDown = '';
        this.countdownId = undefined;
        const {deadline} = this.form
        if (deadline < Date.now()) {
          // 停止任务
          this.onFinish();
        }
      }
    },
    /**
     * 定时结束任务
     * @returns {Promise<void>}
     */
    async onFinish() {
      this.storeConst({
        // 保存时间结束标志
        isTimeUp: true,
      })
      // 刷新页面
      // this.reloadWebPage()
      // 监听抢购是否成功
      this.listenRushSuccess()
    },
    /**
     * 刷新web页面
     * (测试用。实际使用时会自动刷新页面，无需调用此函数。)
     */
    reloadWebPage() {
      const tabId = this.tabId
      // 先注入脚本，然后刷新页面
      chrome.tabs.executeScript(tabId || null, {
        file: './popup/content.js',
        // runAt: 'document_start',
      },  (_) => {
        let e = chrome.runtime.lastError;
        if (e !== undefined) {
          console.log(tabId, _, e);
        }

        chrome.tabs.sendMessage(tabId, {
          message: 'RELOAD_WEB_PAGE',
        }, (response) => {
          if (!response) return false;
          console.log('response', response);
        });
      });
    },
    /**
     * 注入脚本
     */
    injectScript() {
      console.log('注入脚本');
      const tabId = this.tabId
      // 向当前页面注入 JavaScript 脚本
      chrome.tabs.executeScript(tabId || null, {
        file: './popup/content.js',
        // runAt: 'document_start',
      },  (_) => {
        let e = chrome.runtime.lastError;
        if (e !== undefined) {
          console.log(tabId, _, e);
        }
        // 向目标网页进行通信，向 content.js 发送一个消息
        chrome.tabs.sendMessage(tabId, {
          message: 'GET_TOPIC_INFO',
          data: this.form
        }, (response) => {
          if (!window.chrome.runtime.lastError) {
            console.log('response', response);
            if (!response) return false;
            this.rushing()
          } else {
            console.log('window.chrome.runtime.lastError', window.chrome.runtime.lastError);
          }
        });
      });
    },
    /**
     * 开始抢购
     */
    rushing() {
      const _this = this
      const tabId = this.tabId
      chrome.tabs.sendMessage(tabId, {
        message: 'START_RUSH_BUY',
        data: _this.form
      }, (response) => {
        if (!response) return false;
        console.log('response', response);
      });
    },
    /**
     * 监听来自content-script的成功消息
     */
    listenRushSuccess() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === 'RUSH_SUCCESS') {
          console.log('收到来自content-script的消息：', request);
          const {isSuccess} = request
          this.isSuccess = isSuccess
          sendResponse('我是后台，我已收到你的消息。');
          this.showNotification()
        }
      });
    },
    /**
     * 展示成功通知
     */
    showNotification () {
      const NOTIFICATION_ID = "NOTIFICATION_ID";
      chrome.notifications.clear(NOTIFICATION_ID, (cleared) => {
        chrome.notifications.create(NOTIFICATION_ID, {
          type: "basic",
          priority: 2,
          title: "抢购成功提醒",
          message: "恭喜！您已抢购成功！",
          iconUrl: "../icons/icon128.png"
        });
      });
    },
    /**
     * 将值存在background.js的rushObj里面
     * @param obj
     */
    storeConst(obj){
      const bgWin = chrome.extension.getBackgroundPage();
      Object.assign(bgWin.rushObj, obj)
    },
  },
}
</script>
<style scoped lang="scss">
.popup {
  .w-10\/10 {
    width: 100%;
  }
}
</style>
