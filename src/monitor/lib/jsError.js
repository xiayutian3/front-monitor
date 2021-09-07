import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import tracker from '../utils/tracker'

export const injectJsError = ()=>{
  //监听全局未捕获的错误（js error 错误）
  window.addEventListener('error',function(event){//错误事件对象
    console.log('event123: ', event);

    let lastEvent = getLastEvent() //最后一个交互事件
    // console.log('lastEvent: ', lastEvent);
    let log 

    //说明是js link 加载错误
    if(event.target && (event.target.src || event.target.link)){
      log = {
        kind:'stability', //监控指标的大类
        type: 'error', //小类型 这是一个错误
        errorType:'resourceError', //js css 资源加载错误
        filename:event.target.src || event.target.href, //那个文件报错了
        tagName:event.target.tagName,// script  link 标签
        stack: getLines(event.error.stack), //获取错误堆栈信息
        // body div#container div.content input
        selector: lastEvent?getSelector(lastEvent.path):''//代表最后一个操作的元素
        
      }

    }else{
      //普通js错误

    //数据上报格式
      log = {
        kind:'stability', //监控指标的大类
        type: 'error', //小类型 这是一个错误
        errorType:'jsError', //js执行错误
        // url:'', //访问那个路径 报错了
        message:event.message, //报错信息
        filename:event.filename, //那个文件报错了
        position:`${event.lineno}:${event.colno}`,//哪一行哪一列
        stack: getLines(event.error.stack), //获取错误堆栈信息
        // body div#container div.content input
        selector: lastEvent?getSelector(lastEvent.path):''//代表最后一个操作的元素
        
      }
    }
    


    // 上报服务器
    tracker.send(log)
    // console.log('log',log)

  },true)


  //捕获promise抛出的异常
  window.addEventListener('unhandledrejection',function(event){
    console.log('promise event: ', event);
    let lastEvent = getLastEvent() //最后一个交互事件
    let message
    let filename
    let line 
    let column
    let stack = ''
    let reason = event.reason
    if(typeof reason === 'string'){ //普通 reject 抛异常
      message = reason
    }else if(typeof reason=== 'object'){ //说明错误是一个对象
      // console.log('reason: ', reason);
      // at http://localhost:8080/:25:30
      if(reason.stack){
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        // console.log('matchResult: ', matchResult);
        filename = matchResult[1]
        line = matchResult[2]
        column = matchResult[3]
      }
      message = reason.message
      //获取错误栈信息
      stack = getLines(reason.stack)
      // console.log('stack: ', stack);
    }


      //数据上报格式
      let log = {
        kind:'stability', //监控指标的大类
        type: 'error', //小类型 这是一个错误
        errorType:'promiseError', //js执行错误
        // url:'', //访问那个路径 报错了
        message, //报错信息
        filename, //那个文件报错了
        position:`${line}:${column}`,//哪一行哪一列
        stack, //获取错误堆栈信息
        // body div#container div.content input
        selector: lastEvent?getSelector(lastEvent.path):''//代表最后一个操作的元素
        
      }
  
      // 上报服务器
      tracker.send(log)
      // console.log('log',log)

  },true)

  //获取行数
  function getLines(stack){
    return stack.split('\n').slice(1).map(item=>item.replace(/^\s+at\s+/g,'')).join("^")
  }

}