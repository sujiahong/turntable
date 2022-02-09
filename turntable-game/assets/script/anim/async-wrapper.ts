/**
 * Created by Joker on 2019/11/22.
 */
import {IAnimation} from "./animation-wrapper";

//异步包装器
export class AsyncWrapper {
  private _ani:IAnimation=null;
  constructor(ani:IAnimation) {
    this._ani=ani;
  }

  async call(){
    if (!this._ani){
      return;
    }
    this._ani.call();
  }
}