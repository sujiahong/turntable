import {CallbackAnimation} from "./callback-animtion";
import {WaitAnimation} from "./wait-animation";
import {Factory, isValidAnimation} from "./animation-group";

/**
 * Created by Joker on 2019/11/22.
 */

export interface IAnimation {
  call();
}

//单个动画封装，用于将不同类型动画转化为统一的接口
export class AnimationWrapper {
   /**
     * 实例化
     * @param 动画对象
     * @return 包装器对象
     */
  static pack(ani:  cc.Animation | dragonBones.ArmatureDisplay | cc.Action): AnimationWrapper {
    return new AnimationWrapper(ani);
  }

  private _targetAni:cc.Animation | dragonBones.ArmatureDisplay | cc.Action=null; //目标动画
  constructor(target: cc.Animation | dragonBones.ArmatureDisplay| cc.Action) {
    this._targetAni = target;
  }

  private _animations: IAnimation[] = []; //动画播放控制流

   /**
     * 添加一个播放事件
     * @param name 动画名称
     * @param times 循环次数
     * @param timeScale 循环次数
     * @return AnimationWrapper
     */
  play(name:string,times:number,timeScale:number=1) {
    if (!isValidAnimation(this._targetAni)){
      cc.error("无效的动画，无法使用包装器");
      return;
    }
   let action= Factory.instance.getAnimation(this._targetAni,name,times,timeScale);

    this._animations.push(action);
    return this;
  }

   /**
     * 添加一个函数调用事件
     * @param fn 回调
     * @return AnimationWrapper
     */
  call(fn:()=>void){
    this._animations.push(new CallbackAnimation(fn));
    return this;
  }

   /**
     * 添加一个等待事件
     * @param time 时间，单位秒
     * @return AnimationWrapper
     */
  wait(time:number){
    this._animations.push(new WaitAnimation(time));
    return this;
  }


   /**
     * 开始执行动画事件队列
     * @return AnimationWrapper
     */
  async start(){
    try {
      if (this._animations.length<=0){
        return this;
      }
      let count=this._animations.length;
      for (let i=0;i<count;i++){
        let ani=this._animations.shift();
        cc.log("play animation,idx:",i);
        await ani.call();
        cc.log("play animation end,idx:",i);
      }
      return this;
    }catch (e) {
      cc.error(e);
    }
  }
}