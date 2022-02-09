
/**
 * viewBase动画效果
 */
export class Effect {
    static scaleEffect(node: cc.Node): void {
        node.scaleX = 0.4;
        node.scaleY = 0.4;
        cc.tween(node)
            .to(0.36, { scale: 1 }, { easing: 'backOut' })
            .start();
    }

    static riseOrDownEffect(flag: boolean = true, node: cc.Node, start: cc.Vec2, end: cc.Vec2, callBackFunc: Function = null): void {
        if (!flag) {
            let temp: cc.Vec2 = start;
            start = end;
            end = temp;
        }
        cc.tween(node)
            .to(1, { y: end }, { easing: 'backOut' })
            .call(callBackFunc)
            .start();
    }

    static sideRight(node:cc.Node){
        cc.tween(node)
        .to(0.36, { x: -375 }, { easing: 'backOut' })
        .start();
    }
    static sideLeft(node:cc.Node,func: Function){
        cc.tween(node)
        .to(0.36, { x: -1125 }, { easing: 'backOut' })
        .call(func)
        .start();
    }
}  


/**
 * window的弹出的动画类型
 */
export enum EffectType {
    none = 'none',//没有动画
    default = 'default',//默认动画
    custom = 'custom',//自定义动画
}