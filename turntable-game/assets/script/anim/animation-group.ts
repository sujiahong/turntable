/**
 * Created by Joker on 2019/11/22.
 */
import {AnimationWrapper, IAnimation} from "./animation-wrapper";
import {DragonBoneAnimation} from "./dragonbone-animation";
import {AsyncWrapper} from "./async-wrapper";
import isValid = cc.isValid;
import {CallbackAnimation} from "./callback-animtion";
import {WaitAnimation} from "./wait-animation";
import {CCUiAnimation} from "./cc-ui-animation";

//todo
//支持的动画类型，现在只支持cc.Animation, dragonBones.ArmatureDisplay
let  validAnimationTypes = [cc.Animation, dragonBones.ArmatureDisplay, cc.Tween, cc.Action];

export function isValidAnimation(animation: any): boolean {
  for (let i = 0; i < validAnimationTypes.length; i++) {
    let aType = validAnimationTypes[i];
    if (animation instanceof aType) {
      return true;
    }
  }
  return false;
}
//创建动画包装工厂方法
export class Factory {
  private static _instance: Factory = null;
  public static get instance(): Factory {
    if (!this._instance) {
      this._instance = new Factory();
    }
    return this._instance;
  }

  //返回一个通用接口的动画
  getAnimation(sourceAni: cc.Animation | dragonBones.ArmatureDisplay | cc.Action, name: string, times: number = 1, timeScale: number = 1): IAnimation {
    if (!isValidAnimation(sourceAni)) {
      cc.error("无效的动画类型,",sourceAni);
      return;
    }
    if (sourceAni instanceof dragonBones.ArmatureDisplay) {
      return new DragonBoneAnimation(sourceAni, name, times, timeScale);
    }else if (sourceAni instanceof cc.Animation){
      return new CCUiAnimation(sourceAni,name,times,timeScale);
    }

    cc.error("该动画类型未实现");
    return new CallbackAnimation(()=>{});
  }
}

//动画组包装器，用于不同类型动画的有序播放
export class AnimationGroup {
  //创建一个动画组实例
  static get(): AnimationGroup {
    return new AnimationGroup();
  }

  private _animations: IAnimation[] = []; //动画组所包含的动画
  private _release:boolean=false; //是否已释放,为true时未开始的动画将不再播放

   /**
     * 添加一个同步播放行为
     * @param ani 动画对象
     * @param name 动画名
     * @param times 循环次数
     * @param timeScale
     * @return AnimationGroup
     */
  playAwait(ani: cc.Animation | dragonBones.ArmatureDisplay | cc.Action, name: string, times: number = 1, timeScale: number = 1): AnimationGroup {
    let myAni = Factory.instance.getAnimation(ani, name, times, timeScale);
    this._animations.push(myAni);
    return this;
  }

   /**
     * 添加一个异步播放行为
    * @param ani 动画对象
    * @param name 动画名
    * @param times 循环次数
    * @param timeScale
    * @return AnimationGroup
     */
  play(ani: cc.Animation | dragonBones.ArmatureDisplay | cc.Action, name: string, times: number = 1, timeScale: number = 1): AnimationGroup {
    let myAni = Factory.instance.getAnimation(ani, name, times, timeScale);
    let asyncAni = new AsyncWrapper(myAni);
    this._animations.push(asyncAni);
    return this;
  }

   /**
     * 添加一个等待行为
     * @param duration 单位秒
     * @return AnimationGroup
     */
  wait(duration: number): AnimationGroup {
    this._animations.push(new WaitAnimation(duration));
    return this;
  }

   /**
     * 添加一个回调行为
     * @param  fn 回调函数
     * @return AnimationGroup
     */
  call(fn: () => void) {
    this._animations.push(new CallbackAnimation(fn));
    return this;
  }

   /**
     * 开始执行已添加的动画事件
     * @return AnimationGroup
     */
  async start() {
    if (this._animations.length <= 0) {
      cc.warn("没有动画可播放");
      return this;
    }
    let count = this._animations.length;
    for (let i = 0; i < count; i++) {
      if (this._release){
        this._animations=[];
        break;
      }
      let ani = this._animations.shift();
      await ani.call();
    }
    return this;
  }

   /**
     * 终止执行，剩余队列将被舍弃
     * @return void
     */
  release() {
    this._release=true;
  }
}