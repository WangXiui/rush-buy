/**
 * @name: inject
 * @author: 72079750
 * @date: 2021/11/3 9:39
 * @description：inject
 * @update: 2021/11/3 9:39
 */
const instance = document.getElementsByClassName('el-table')[0] || {}
console.log('instance.data', instance.__vue__);
if(instance) {
  // 方案一
  /*window.dispatchEvent(new CustomEvent("getChromeData", {
    detail: instance.__vue__.data
  }))*/
  // 方案二
  window.postMessage({detailData: instance.__vue__.data }, '*');
}
