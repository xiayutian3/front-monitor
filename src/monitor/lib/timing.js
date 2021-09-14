//页面各指标时间统计 (加载时间)

import tracker from '../utils/tracker'
import onload from '../utils/onload'
import getLastEvent from '../utils/getLastEvent'

export default function timing() {
  //  性能指标获取
  let FMP,LCP ,FID; 
  //增加一个性能条目的观察者
  new PerformanceObserver((entryList,observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0]; //startTime 是2000 以后，因为我们设置了settimeout是2000以后才动态设置这个内容
    observer.disconnect()//不再观察了
  }).observe({entryTypes:['element']}) //观察页面中的有意义的元素

  new PerformanceObserver((entryList,observer) => {
    let perfEntries = entryList.getEntries();
    LCP = perfEntries[0];
    observer.disconnect()//不再观察了
  }).observe({entryTypes:['largest-contentful-paint']}) //观察页面中的最大内容绘制

  //用户第一次输入延迟时间(FID)（有可能有，有可能无，用户输入就有，不输入就没有）
  new PerformanceObserver((entryList,observer) => {
    let lastEvent = getLastEvent() //最后一个交互事件
    let firstInput = entryList.getEntries()[0];
    console.log('FID: ', firstInput);
    if(firstInput){
      //processingStart 开始处理的事件，  startTime开始点击的时间  差值就是处理的延迟时间
      let inputDelay = firstInput.processingStart - firstInput.startTime
      let duration = firstInput.duration //处理的耗时
      if(inputDelay>0 || duration>0){
        tracker.send({
          kind: 'experience', //用户体验指标
          type: 'firstInputDelay', //首次输入延时
          inputDelay, //延时的时间
          duration, //处理的时间
          startTime:firstInput.startTime, //开始的时间
          selector:lastEvent?getLastEvent(lastEvent.path||lastEvent.target):'' //发生事件的元素
        })
      }
    }

    // FID = perfEntries[0];
    observer.disconnect()//不再观察了
  }).observe({type:'first-input',buffered:true}) //用户的第一次交互，点击页面，点击链接跳转，输入内容等

  onload(function () {
    setTimeout(function () { //为了更加准确，所以加3s延时
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd
      } = performance.timing

      tracker.send({
        kind: 'experience', //用户体验指标
        type: 'timing', //统计每个阶段的时间
        connectTime: connectEnd - connectStart, //连接时间
        ttfbTime: responseStart - requestStart,//首字节达到时间
        responseTime: responseEnd - responseStart,//相应的读取时间
        parseDOMTime: loadEventStart - domLoading,//DOM解析的时间
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,//dom解析完毕时间
        timeToInteractive: domInteractive - fetchStart,//首次可交互时间
        loadTime: loadEventStart - fetchStart//完整的加载时间
      })

      //开始发送性能指标数据
      let FP = performance.getEntriesByName('first-paint')[0]; //第一个像素的绘制
      let FCP = performance.getEntriesByName('first-contentful-paint')[0]; //第一个dom元素的绘制

      console.log('FP',FP)
      console.log('FCP',FCP)
      console.log('FMP',FMP)
      console.log('LCP',LCP)

    }, 3000)
  })


}