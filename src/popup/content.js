let doc = document;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  // console.log(request, sender, sendResponse);
  // sendResponse('我收到你的消息了：'+JSON.stringify("request"));
  // return true
  if(request.message === 'GET_TOPIC_INFO') {
    console.log('获取 title', request);
    // editInputValue()
    // clickBtn()
    // 获取 title
    let title = document.getElementsByTagName('title')[0].textContent;
    let descriptionEl = doc.querySelectorAll('meta[name=description]')[0];
    // 获取 描述
    let description = descriptionEl ? descriptionEl.getAttribute('content') : title;
    // 发送数据
    sendResponse({
      title: title.trim(),
      link: location.href,
      description: description.trim()
    });
  } else if (request.message === 'SIGN_RELOAD') {
    console.log('request, sender', request, sender);
  }
});

function editInputValue() {
  const input = doc.getElementsByClassName('search-input')
  console.log('input', input);
  input[0].value = '22222'
}

/**
 * 触发按钮点击时事件
 */
function clickBtn() {
  const ele = doc.getElementsByClassName('app-link')
  console.log('ele', ele);

  // 方案一（成功）
  // ele[0].click()

  // 方案二（成功）
  const e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  ele[0].dispatchEvent(e);
}
