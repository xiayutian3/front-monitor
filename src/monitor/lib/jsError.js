export const injectJsError = ()=>{
  //监听全局未捕获的错误
  window.addEventListener('error',function(event){//错误事件对象
    console.log('event: ', event);
    //数据上报格式
    let log = {
      kind:'stability', //监控指标的大类
      type: 'error', //小类型 这是一个错误
      errorType:'jsError', //js执行错误
      url:'', //访问那个路径 报错了
      message:event.message, //报错信息
      
    }

  })

}