/**
 * @name: setPurchaseNum
 * @author: 72079750
 * @date: 2021/11/5 9:47
 * @description：setPurchaseNum
 * @update: 2021/11/5 9:47
 */
const cartDetail = document.querySelector('.cart-detail') || {}

console.log('window.form', window.form);

const input = document.querySelector('.buy-info .el-input__inner')

const ev = new Event('change', { bubbles: true});
ev.simulated = true;
input.value = `${window.form.count}`;
input.dispatchEvent(ev);

