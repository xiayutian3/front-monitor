let lastEvent

//不停的跟用户进行交互，拿到最后一个值，拿到最后事件触发的元素
['click','touchstart','mousedown','mousemove','keydown','mouseover'].forEach(eventType=>{
  document.addEventListener(eventType,(event)=>{
    lastEvent = event;
  },{
    capture:true, //捕获阶段
    passive:true, //不阻止默认行为
  })
})

export default function(){
  return lastEvent;
}