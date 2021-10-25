// document.addEventListener('click', function (e) {
//   let isCurrect = e.path.length > 3&&e.path[4].innerText&&e.path[4].innerText.indexOf('提交需求') != -1 && e.target.innerText === '确 定' && document.getElementsByClassName('layout-nav') && document.getElementsByClassName('layout-nav')[0].children
//   if (isCurrect) {
//     if (document.getElementsByClassName('user-table') && document.getElementsByClassName('user-table')[0] && document.getElementsByClassName('user-table')[0].getElementsByClassName('el-table__row').length > 0) {
//       var port = chrome.runtime.connect({ name: "custommanage" });//通道名称
//       let loginPerson = document.getElementsByClassName('layout-nav') && document.getElementsByClassName('layout-nav')[0].children ? document.getElementsByClassName('layout-nav')[0].children[0].innerText : ''
//       let partMentName = document.getElementsByClassName('layout-nav') && document.getElementsByClassName('layout-nav')[0].children ? document.getElementsByClassName('layout-nav')[0].children[3].innerText : ''
//       let processName = document.getElementsByClassName('el-input__inner') && document.getElementsByClassName('layout-nav')[0].children ? document.getElementsByClassName('el-input__inner')[0].title : ''
//       let tableElement = document.getElementsByClassName('user-table') ? document.getElementsByClassName('user-table')[0].getElementsByClassName('el-table__row') : []
//       let choseSelect = []
//       for (let value of tableElement) {
//         if (value.innerText.indexOf(partMentName) !== -1) {
//           choseSelect = value
//         }
//       }
//       let developPerson = ''
//       let startTime = ''
//       let endTime = ''
//       if (choseSelect && choseSelect.getElementsByTagName('td')) {
//         developPerson = choseSelect.getElementsByTagName('td')[1].innerText
//         startTime = choseSelect.getElementsByTagName('td')[3].getElementsByTagName('input')[0].title
//         endTime = choseSelect.getElementsByTagName('td')[4].getElementsByTagName('input')[0].title
//       }
//       let item = {
//         "loginPerson": loginPerson,
//         "processName": processName,
//         "developPerson": developPerson,
//         "startTime": startTime,
//         "endTime": endTime
//       }
//       port.postMessage(item);//发送消息
//     } else {
//       alert('未查到该项目预排人员与预排时间，请点开插件或打开定制管理系统手动添加项目!')
//     }
//   }
// });

//监听消息
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === "copy") {
      //收到copy信息，开始获取当前页面id为sb_form_q的值

      const ele = document.getElementsByClassName('s_ipt')[0]
      // const ele = document.getElementsByClassName('user-info-no')[0]
      console.log('ele--chrome', ele);
      if (ele.length > 0) {
        // 如果获取的值不为空则返回数据到popup.js的回调函数
        console.log('ele', ele);
        ele.onclick({target: ele})
        window.dispatchEvent(ele.onclick)

        if (sendResponse) sendResponse(1111);
      } else {
        alert("No data");
      }
    }

  }
);