import {IAnimation} from "./animation-wrapper";

/**
 * Created by Joker on 2019/11/22.
 */

//dragonbone.ArmutureDisplay包装器
export class DragonBoneAnimation implements IAnimation{
  private readonly _ani:dragonBones.ArmatureDisplay=null;
  private readonly _playTimes:number=0;
  private readonly _name:string="";
  private readonly _timeScale:number=1;
  constructor(ani:dragonBones.ArmatureDisplay,name:string,times:number,timeScale:number=1){
    this._ani=ani;
    this._playTimes=times;
    this._name=name;
    this._timeScale=timeScale;
  }

  async call() {
    return new Promise((resolve)=>{
      if (!this._ani){
        resolve();
        return ;
      }

      let state=this._ani.playAnimation(this._name,this._playTimes);
      if (state){
        state.timeScale=this._timeScale;
      }
      this._ani.once(dragonBones.EventObject.COMPLETE,()=>{
        resolve();
      });
    })
  }
}