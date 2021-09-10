export default function(callback) { //等document加载完成，才调用白屏监控
  if(document.readyState === 'complete') {
    callback()
  }else{
    window.addEventListener('load', callback,false);
  }
}