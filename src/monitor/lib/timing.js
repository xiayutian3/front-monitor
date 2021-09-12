//页面各指标时间统计 (加载时间)

import tracker from '../utils/tracker'
import onload from '../utils/onload'

export default function timing() {
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

    }, 3000)
  })


}