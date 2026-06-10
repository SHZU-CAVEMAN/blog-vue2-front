const DISTANCE = 100
const DURATION = 500
const map = new WeakMap()
const ob = new IntersectionObserver((entries)=>{
    for (const entry of entries){
        if(entry.isIntersecting){
            // 播放动画 
            const animation = map.get(entry.target)
            animation && animation.play()
            ob.unobserve(entry.target) 
        }
    }

})
function isBelowViewport(el){
    const rect = el.getBoundingClientRect()
    return rect.top > window.innerHeight
}
export default{
    inserted(el){
        // 首屏元素不做入场动画，避免推迟 LCP；只对首屏以下元素执行动画。
        if (!isBelowViewport(el)){
            return 
        }
        // 两个入参：关键帧（一个数组），动画配置对象
        const animation = el.animate(
            [
                {
                    transform:`translateY(${DISTANCE}px)`,
                    opacity:0.5
                },
                {
                    transform:`translateY(0)`,
                    opacity:1
                },
            ],
            {
                duration:DURATION,
                easing: 'ease-out',
                fill: 'forwards',
            }
            
        )
        animation.pause();
        map.set(el,animation)
        ob.observe(el)
    },
    unbind(el){
        ob.unobserve(el)
    }

}