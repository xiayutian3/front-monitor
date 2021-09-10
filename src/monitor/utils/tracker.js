let userAgent = require('user-agent')
let host = 'cn-beijing.log.aliyuncs.com'
let project = 'xxmonitor'
let logStore = 'monitor-store'
//获取额外的数据
function getExtraData() {
  return {
    title: document.title, //标题
    url:location.href, //地址
    timestamp:Date.now(), //时间戳
    userAgent: userAgent.parse(navigator.userAgent),//浏览器的信息
    //用户id token 等。。。
  }
}

// 如果用gif图片上传，图片速度快，没有跨域问题，不占用http请求
class SendTracker{
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logStore}/tracker`  //上报的路径
    this.xhr = new XMLHttpRequest;
  }
  send(data ={}) {
    let extraData = getExtraData()
    let log = {
      ...extraData,
      ...data
    }
    //对象的值 不能是数字 。阿里云的要求
    for(let key in log){
      if(typeof log[key] === 'number'){
        log[key] = log[key]+''
      }
    }
    console.log('log: ', log);
    // let body = JSON.stringify(log)
    //阿里云格式要求
    let body = JSON.stringify({
      __log__:[log]
    })
    
    this.xhr.open('POST', this.url,true) //第三个参数是否是异步
    this.xhr.setRequestHeader('Content-Type', 'application/json')
    this.xhr.setRequestHeader('x-log-apiversion','0.6.0')
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length)
    this.xhr.onload = function(){
      // console.log(this.xhr.response)
    }
    this.xhr.onerror = function(error){
      // console.log('error: ', error);
    }
    this.xhr.send(body)
  }
}
export default new SendTracker(); 