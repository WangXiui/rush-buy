let doc = document;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  if(request.message === 'GET_TOPIC_INFO') {  // 脚本注入
    sendResponse({
      content: '脚本注入成功。',
    });
  } else if (request.message === 'RELOAD_WEB_PAGE') { // 页面重载
    sendResponse({
      content: '执行重载。',
    });
    window.location.reload()
  } else if (request.message === 'START_RUSH_BUY') {  // 开始抢购
    console.log('获取 title', request);
    editInputValue()
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
function editInputValue() {
  const input = doc.getElementsByClassName('search-input')
  console.log('自动填充抢够数量', input);
  if (input.length > 0) {
    input[0].value = '22222'
    console.log('input[0].value', input[0].value);
    // alert('input')
    clickBtn()

    clearInterval(timerInput)
    timerInput = null
    return
  }
  if (timerInput) return;
  timerInput = setInterval(editInputValue, 500)
}

let timerClick
/**
 * 触发按钮点击时事件
 */
function clickBtn() {
  const ele = doc.getElementsByClassName('avatar')
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
  timerClick = setInterval(clickBtn, 500)
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
