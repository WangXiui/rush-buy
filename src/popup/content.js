let doc = document;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  // console.log(request, sender, sendResponse);
  // sendResponse('我收到你的消息了：'+JSON.stringify("request"));
  // return true
  if(request.message === 'GET_TOPIC_INFO') {
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