let doc = document;
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'GET_TOPIC_INFO') {  // 脚本注入
    sendResponse({
      content: '脚本注入成功。',
    });
  } else if (request.message === 'GET_SHELVE_TIME') { // 获取上架商品详情
    await injectJs(sendResponse)
    return true
  } else if (request.message === 'RELOAD_WEB_PAGE') { // 页面重载
    sendResponse({
      content: '执行重载。',
    });
    window.location.reload()
  } else if (request.message === 'START_RUSH_BUY') {  // 开始抢购
    // console.log('获取 title', request);
    // 获取设定值
    chrome.runtime.sendMessage({ message: 'GET_SETTING_VALUE' }, async (response) => {
      if (!response) return false;
      console.log('response--GET_SETTING_VALUE', response);
      const { form } = response
      await editInputValue(form || {})
    });
    // 获取 title
    let title = document.getElementsByTagName('title')[0].textContent;
    let descriptionEl = doc.querySelectorAll('meta[name=description]')[0];
    // 获取 描述
    let description = descriptionEl ? descriptionEl.getAttribute('content') : title;
    // 发送数据
    sendResponse({
      title: title.trim(),
      link: location.href,
      description: description.trim(),
      isSuccess: true,
    });
  }
  return true
});
let timerInput

/**
 * 自动填充抢够数量
 */
async function editInputValue(form) {
  const ele = doc.querySelector('.product-purchase-btn')
  const input = doc.querySelector('.buy-info .el-input__inner')
  // 加号➕
  // const increase = doc.querySelector('.el-input-number__increase')
  console.log('自动填充抢够数量', input, input.value);
  /**
   * 条件：1.采购量输入框；2.立即购买按钮。
   *  注：都渲染了才开始"输入和抢购"，否则无效。（因为：输入框出来了，但是购买按钮可能没出来，loading也没结束。
   *   这个时候如果填充采购量，等购买按钮出来，loading消失，采购量值会被重置，等于白输了。）
   */
  if (input && ele) {
    console.log('自动填充抢够数量--');
    await setPurchaseNum(form)
    // alert('input')
    // 触发按钮点击时事件,延迟点击等待采购量设置完成
    // setTimeout(() => {
    //   clickBtn(form)
    // }, 1000)

    clearInterval(timerInput)
    timerInput = null
    return
  }
  if (timerInput) return;
  timerInput = setInterval(() => editInputValue(form), (1000 / form.frequency) || 100)
}

let timerClick

/**
 * 触发按钮点击时事件
 */
function clickBtn(form) {
  const ele = doc.querySelector('.product-purchase-btn')
  const input = document.querySelector('.buy-info .el-input__inner')
  console.log('准备点击购买按钮---，先看看购买按钮是否渲染：', ele, '看看form值：', form);
  console.log(
    '准备点击购买按钮---输入的抢购数量是：',input.value,
    '输入的值input.value和form.count是否相等：', Number(input.value || 0) === form.count
  );
  /**
   * 条件：1.购买按钮已经渲染；2.抢购数量已填充完。
   * 注：增加了条件判断：采购量==填充值，才确认采购。
   */
  if (ele && Number(input.value || 0) === form.count) {
    // alert('ele')
    // 方案一（成功）
    // ele[0].click()
    // 方案二（成功）
    const e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    ele.dispatchEvent(e);

    // 确认库存
    confirmCount(form)

    clearInterval(timerClick)
    timerClick = null
    return
  }
  if (timerClick) return;
  timerClick = setInterval(() => clickBtn(form), 100)
  // timerClick = setInterval(clickBtn, (1000 / form.frequency) || 100)
}

let timerConfirm

/**
 * 确认库存
 */
function confirmCount(form) {
  // 取消按钮（测试用）
  const affirmBtn = doc.querySelector('.el-message-box__btns button:first-child')
  // 确认按钮
  // const affirmBtn = doc.querySelector('.btn-affirm')
  console.log('确认库存', affirmBtn, form);
  if (affirmBtn) {
    // alert('ele')
    // 方案一（成功）
    // ele[0].click()
    // 方案二（成功）
    const event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    affirmBtn.dispatchEvent(event);

    sendRushSuccess(affirmBtn)

    clearInterval(timerConfirm)
    timerConfirm = null
    return
  }
  if (timerConfirm) return;
  timerConfirm = setInterval(() => confirmCount(form), 100)
  // timerConfirm = setInterval(confirmCount, (1000 / form.frequency) || 100)
}

/**
 * 通知插件抢购成功
 * @param ele
 */
function sendRushSuccess(ele) {
  chrome.runtime.sendMessage({
    message: 'RUSH_SUCCESS',
    isSuccess: true,
  }, (response) => {
    if (!response) return false;
    console.log('response', response);
  })
}

/**
 * 向页面注入脚本
 * @param sendResponse
 */
async function injectJs(sendResponse) {
  let scriptTag = document.createElement('script');
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  scriptTag.src = chrome.extension.getURL('js/inject.js');
  scriptTag.onload = function () {
    this.parentNode.removeChild(this);
  };
  // 放在页面不好看，执行完后移除掉
  (document.head || document.documentElement).appendChild(scriptTag);
  let res = ''
  // 方案一
  window.addEventListener("getChromeData", (event) => {
    // window.addEventListener("message", (event) => {
    console.log('event', event);
    if (event.detail) {
      res = event.detail
      sendResponse({
        data: res
      })
      return
    }
    sendResponse({
      data: []
    })
  }, false);
  // 方案二
  /*window.onmessage = (event) => {
   console.log('event', event);
   if(event.data.detailData) {
   res = event.data.detailData
   sendResponse({
   data: res
   })
   return
   }
   sendResponse({
   data: []
   })
   }*/
}

/**
 * 设置采购量
 */
async function setPurchaseNum(form) {
  await setPurchaseNumCode(form)
  let scriptTag = document.createElement('script');
  scriptTag.src = chrome.extension.getURL('js/setPurchaseNum.js');
  (document.body || document.documentElement).appendChild(scriptTag);
  window.form = form
  window.postMessage({
    messageType: 'SET_PURCHASE_NUM',
    form
  }, '*');
  window.addEventListener("setComplete", (event) => {
    console.log(`准备设置抢购数量：设置完成啦---打印event看看：`, event);
    if (event.detail.setComplete) {
      // 此时去点击购买按钮
      clickBtn(form)
    }
  }, false);
  // 放在页面不好看，执行完后移除掉
  scriptTag.onload = function () {
    this.parentNode.removeChild(this);
  };
}

/**
 * 注入js代码片段，传递form表单到页面内
 * @param form
 */
async function setPurchaseNumCode(form) {
  console.log(`准备设置抢购数量：第一步==设置前要先把windows.form注入到页面里`);
  let script = document.createElement('script');
  script.textContent = `window.form = ${JSON.stringify(form)}`;
  (document.body || document.documentElement).appendChild(script);
  script.onload = function () {
    this.parentNode.removeChild(this);
  };
}
