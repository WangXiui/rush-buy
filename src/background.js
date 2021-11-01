window.rushObj = {}

chrome.webNavigation.onCommitted.addListener(({tabId, frameId}) => {
  const {rushObj} = window
  if (
    // 1.tabId相等；2.frameId === 0为当前页；3.倒计时已经结束
    tabId === rushObj.tabId &&
    frameId === 0 &&
    true === rushObj.isTimeUp
  ) {
    const views = chrome.extension.getViews({ type: 'popup' });
    console.log('views', views); // popup 的 Window 对象
    // popup 处于激活状态才执行，因为我们已经指定获取 popup Window，若它未激活，则 length = 0
    if (views.length > 0) {
      console.log('rushObj.instance', rushObj.instance);
      // 注入脚本，开始抢购
      rushObj.instance.injectScript()
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'GET_SETTING_VALUE') {
    console.log('收到来自content-script：获取form的消息：', request);
    sendResponse({ form: window.rushObj.form });
  }
});