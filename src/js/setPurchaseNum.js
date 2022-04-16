/**
 * @name: setPurchaseNum
 * @author: 72079750
 * @date: 2021/11/5 9:47
 * @description：setPurchaseNum
 * @update: 2021/11/5 9:47
 */
const cartDetail = document.querySelector('.cart-detail') || {}
const input = document.querySelector('.buy-info .el-input__inner')
const loadingVar = document.querySelector('#app>div').__vue__.loading

console.log(`准备设置抢购数量：先看下window.form：`, window.form);

setTimeout(() => {

  cartDetail.__vue__.pageData = Object.assign(
    {},
    cartDetail.__vue__.pageData,
    {
      purchasenum: window.form.count,

      // 控制最大和最小值都等于采购量
      purchaseNum: window.form.count,
      procurement: window.form.count,
      inputnumbermin: window.form.count,
      inputnumbermax: window.form.count,
    }
  )

  // 第二个自组件就是采购量输入框
  // cartDetail.__vue__.$children[1].value = window.form.count
  // cartDetail.__vue__.$children[1].currentValue = window.form.count
  // cartDetail.__vue__.$children[1].displayValue = window.form.count


  const input = document.querySelector('.buy-info .el-input__inner')

  const ev = new Event('change', { bubbles: true});
  ev.simulated = true;
  input.value = `${window.form.count}`;
  input.max = `${window.form.count}`;
  input.min = `${window.form.count}`;
  input.dispatchEvent(ev);
  window.dispatchEvent(new CustomEvent("setComplete", {
      detail: {setComplete: true}
    }
  ))

}, 500)

