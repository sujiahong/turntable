import {IAnimation} from "./animation-wrapper";
import {Utils} from "../util/Util";

/**
 * Created by Joker on 2019/11/22.
 */
//等待行为的包装器
export class WaitAnimation implements IAnimation{
  private readonly _time:number=0;
  constructor(waitTime){
    this._time=waitTime;
  }

  async call() {
    return new Promise(async (resolve)=>{
      await Utils.sleep(this,this._time);
      resolve();
    })
  }
}