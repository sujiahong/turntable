import {IAnimation} from "./animation-wrapper";
import {Utils} from "../util/Util";

/**
 * Created by Joker on 2019/11/22.
 */

//动画封装中的回调行为
export class CallbackAnimation implements IAnimation{
  private readonly _cb:()=>void=null;
  constructor(cb){
    this._cb=cb;
  }

  async call() {
    return new Promise((resolve)=>{
      Utils.safeCall(this._cb);
      resolve();
    })
  }
}