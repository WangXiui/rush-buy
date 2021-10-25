console.log(111);
window.data = null;
// chrome.tabs.query(
//   { active: true, currentWindow: true },
//   function (tabs) {
//     var port = chrome.tabs.connect(//建立通道
//       tabs[0].id,
//       { name: "custommanage" }//通道名称
//     );
//   });
// chrome.runtime.onConnect.addListener((port) => {
//   console.assert(port.name == "custommanage");
//   port.onMessage.addListener((res) => {
//     console.log(res)
//   });
// });