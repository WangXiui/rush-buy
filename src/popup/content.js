let doc = document;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  if(request.message === 'GET_TOPIC_INFO') {  // 脚本注入
    sendResponse({
      content: '脚本注入成功。',
    });
  } else if (request.message === 'GET_SHELVE_TIME') { // 获取上架商品详情
    injectJs(sendResponse)
    return true
  }  else if (request.message === 'RELOAD_WEB_PAGE') { // 页面重载
    sendResponse({
      content: '执行重载。',
    });
    window.location.reload()
  } else if (request.message === 'START_RUSH_BUY') {  // 开始抢购
    // console.log('获取 title', request);
    // 获取设定值
    chrome.runtime.sendMessage({ message: 'GET_SETTING_VALUE'},(response) => {
      if (!response) return false;
      // console.log('response', response);
      const {form} = response
      editInputValue(form || {})
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
});
let timerInput
/**
 * 自动填充抢够数量
 */
function editInputValue(form) {
  const input = doc.querySelector('.buy-info .el-input__inner')
  console.log('自动填充抢够数量', input);
  if (input) {
    input.value = form.count || '1'
    console.log('input.value', input.value);
    // alert('input')
    clickBtn(form)
    clearInterval(timerInput)
    timerInput = null
    return
  }
  if (timerInput) return;
  timerInput = setInterval(editInputValue, (1000 / form.frequency) || 100)
}
let timerClick
/**
 * 触发按钮点击时事件
 */
function clickBtn(form) {
  const ele = doc.getElementsByClassName('product-purchase-btn')
  console.log('触发按钮点击时事件', ele);
  if (ele.length > 0) {
    // alert('ele')
    // 方案一（成功）
    // ele[0].click()
    // 方案二（成功）
    const e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    ele[0].dispatchEvent(e);
    sendRushSuccess(ele)
    clearInterval(timerClick)
    timerClick = null
    return
  }
  if (timerClick) return;
  timerClick = setInterval(clickBtn, (1000 / form.frequency) || 100)
}
let timerConfirm
/**
 * 确认库存
 */
function confirm(form) {
  const ele = doc.getElementsByClassName('product-confirm-btn')
  console.log('确认库存', ele);
  if (ele.length) {
    // alert('ele')
    // 方案一（成功）
    // ele[0].click()
    // 方案二（成功）
    const e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    ele[0].dispatchEvent(e);
    sendRushSuccess(ele)
    clearInterval(timerConfirm)
    timerConfirm = null
    return
  }
  if (timerConfirm) return;
  timerConfirm = setInterval(clickBtn, (1000 / form.frequency) || 100)
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
function injectJs(sendResponse) {
  let scriptTag = document.createElement('script');
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  scriptTag.src = chrome.extension.getURL('js/inject.js');
  scriptTag.onload = function() {
    this.parentNode.removeChild(this);
  };
  // 放在页面不好看，执行完后移除掉
  (document.head || document.documentElement).appendChild(scriptTag);
  let res = ''
  // 方案一
  /*window.addEventListener("getChromeData", (event) => {
  // window.addEventListener("message", (event) => {
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
  }, false);*/
  // 方案二
  window.onmessage = (event) => {
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
  }
}
