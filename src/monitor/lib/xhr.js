import tracker from '../utils/tracker'

//监控请求

//增强请求，拦截请求
export default function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest
  //重写 open方法
  let oldOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url,async) {
    if(!url.match(/logstores/) && !url.match(/sockjs-node/) ){ //如果是监听url是请求阿里云上报地址的会，和webpack心跳检测的一些东西，就不添加日志
      this.logData = {
        method,
        url,
        async
      }
    }
   
    return oldOpen.apply(this, arguments)
  }

  //重写 send方法  (请求时间监控)
  let oldSend = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.send = function (body) {
    if(this.logData){
      let startTime = Date.now() //在发送之前记录一下开始时间
      let handler = (type) => (event)=>{
        // console.log('type: ', type);
        let duration = Date.now() - startTime
        let status = this.status;
        let statusText = this.statusText //200  500 
        tracker.send({
          kind:'stability', //监控指标的大类
          type:'xhr', //小类型 这是一个错误
          eventType: type, // load  error abort
          pathname:this.logData.url,//请求路径
          status:status+'-'+statusText, //请求状态
          duration, //持续时间
          response:this.response?JSON.stringify(this.response):'', //响应内容
          params:body || ''  //请求参数

        })
      }
      this.addEventListener('load',handler('load'),false);
      this.addEventListener('error',handler('error'),false);
      this.addEventListener('abort',handler('abort'),false);
    }
    return oldSend.apply(this, arguments)
  }
}