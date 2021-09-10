import tracker from '../utils/tracker'
import onload from '../utils/onload'
//白屏监控（for循环从1开始，分横竖9个点，一共18个点）

export default function blankScreen() {
  let wrapperElemnts = ['html', 'body', '#content','.content'] //空白元素包裹，都表示白屏
  let emptyPoints = 0
  function getSelector(element){ //获取选择器
    if(element.id){
      return '#'+element.id
    }else if(element.className){ // a b c -> .a.b.c
      return '.'+element.className.split(' ').filter(item => !!item).join('.')
    }else{
      return element.nodeName.toLowerCase()
    }
  }
  function isWrapper(element) {
    let selector = getSelector(element)
    if(wrapperElemnts.indexOf(selector) != -1){
      emptyPoints++
    }
  }

  onload(function(){

    for (var i = 1; i <=9;i++) {
      let xElement = document.elementsFromPoint(
        window.innerWidth * i / 10, window.innerHeight / 2
      )
      let yElement = document.elementsFromPoint(
        window.innerWidth / 2, window.innerHeight * i / 10
      )
      isWrapper(xElement[0]);
      isWrapper(yElement[0]);
    } 
  
    //一共18个点，白点数大于16的话，那就认为是白屏
    if(emptyPoints >= 6){
      //中间点
      let centerElement = document.elementsFromPoint(
        window.innerWidth / 2, window.innerHeight / 2
      )
      tracker.send({
        kind: 'stability', //监控指标的大类
        type: 'blank', //白屏
        emptyPoints, //空白点数
        screen:window.screen.width + 'X' + window.screen.height, //屏幕分辨率
        viewPoint:window.innerWidth+'X'+window.innerHeight, //视口大小
        selector:getSelector(centerElement[0])  //选择器
      })
    }
  })


}