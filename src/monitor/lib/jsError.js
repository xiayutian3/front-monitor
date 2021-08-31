import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'

export const injectJsError = ()=>{
  //监听全局未捕获的错误
  window.addEventListener('error',function(event){//错误事件对象
    console.log('event: ', event);

    let lastEvent = getLastEvent() //最后一个交互事件
    console.log('lastEvent: ', lastEvent);
    
    //数据上报格式
    let log = {
      kind:'stability', //监控指标的大类
      type: 'error', //小类型 这是一个错误
      errorType:'jsError', //js执行错误
      url:'', //访问那个路径 报错了
      message:event.message, //报错信息
      filename:event.filename, //那个文件报错了
      position:`${event.lineno}:${event.colno}`,//哪一行哪一列
      stack: getLines(event.error.stack), //获取错误堆栈信息
      // body div#container div.content input
      selector: lastEvent?getSelector(lastEvent.path):''//代表最后一个操作的元素
      
    }
    console.log('log',log)

  })

  function getLines(stack){
    return stack.split('\n').slice(1).map(item=>item.replace(/^\s+at\s+/g,'')).join("^")
  }

}