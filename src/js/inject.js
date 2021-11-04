/**
 * @name: inject
 * @author: 72079750
 * @date: 2021/11/3 9:39
 * @description：inject
 * @update: 2021/11/3 9:39
 */
const tableInstance = document.getElementsByClassName('el-table')[0] || {}
const cartDetail = document.getElementsByClassName('cart-detail')[0] || {}
console.log('instance.data', tableInstance.__vue__);
if(tableInstance) {
  // 方案一
  /*window.dispatchEvent(new CustomEvent("getChromeData", {
    detail: instance.__vue__.data
  }))*/
  // 方案二
  window.postMessage({detailData: tableInstance.__vue__.data }, '*');
}
if(cartDetail) {
  cartDetail.__vue__.purchasenum = 222
}
