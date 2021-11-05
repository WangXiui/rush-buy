/**
 * @name: setPurchaseNum
 * @author: 72079750
 * @date: 2021/11/5 9:47
 * @description：setPurchaseNum
 * @update: 2021/11/5 9:47
 */
const cartDetail = document.getElementsByClassName('cart-detail')[0] || {}
console.log('cartDetail---1', cartDetail.__vue__.$el.__vue__.purchasenum);
console.log('_isMounted', cartDetail.__vue__.$el.__vue__._isMounted);

// console.log('window.form', window.form);

if (cartDetail.__vue__.$el.__vue__._isMounted) {
  cartDetail.__vue__.$el.__vue__.purchasenum = 32
  console.log('cartDetail---2', cartDetail.__vue__.$el.__vue__.purchasenum);
}

/*window.onload = function () {
  if (cartDetail.__vue__.$el.__vue__._isMounted) {
    cartDetail.__vue__.$el.__vue__.purchasenum = 32
    console.log('cartDetail---2', cartDetail.__vue__.$el.__vue__.purchasenum);
  }
}*/


window.addEventListener("message", (event) => {

  console.log('event---', event, event.data);
  const {messageType, form} = event.data

  if (cartDetail.__vue__.$el.__vue__._isMounted) {
    document.getElementsByClassName('cart-detail')[0].__vue__.$el.__vue__.purchasenum = 32
    console.log('cartDetail----333', cartDetail.__vue__.$el.__vue__.purchasenum);
  }

  if(
    messageType === 'SET_PURCHASE_NUM'  // 确认是设置采购量
    && form // 确认传参已拿到
    && cartDetail // 确认指定页面元素已经获取到
  ) {
    // 修改采购量的变量值
    cartDetail.__vue__.$el.__vue__.purchasenum = form.count
    console.log('cartDetail----444', cartDetail.__vue__.$el.__vue__.purchasenum);
  }

 }, false);

