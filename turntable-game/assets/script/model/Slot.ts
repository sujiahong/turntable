/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */
/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */


import ccclass = cc._decorator.ccclass;
import menu = cc._decorator.menu;
import property = cc._decorator.property;
import { SlotColum } from "./SlotColum";
import { Utils } from "../util/Util";
//import {timer_mgr} from "../manager/TimerManager";

@ccclass
@menu("gameModules/老虎机/老虎机")
export class Slot extends cc.Component{
    @property([SlotColum])
    slotcolums: SlotColum[] = [];
    @property(cc.Node)
    startNode: cc.Node = null;

    start()
    {
        console.log(" start start!!");
        // timer_mgr.initialize();
        // timer_mgr.onLogin();
    }

    protected onEnable(): void
    {
        this.startNode.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin(), this);
        this.startNode.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.startNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    protected onDisable(): void
    {
        this.startNode.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.startNode.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.startNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    private _onTouchBegin()
    {
        console.log("_onTouchBegin   1111111");
        
    }
    private _onTouchEnd()
    {
        console.log("_onTouchEnd");
        this.onTapStartButton();
    }

    async onTapStartButton()
    {
        this.slotcolums.forEach((line, idx) => {
            this.scheduleOnce(() => {
                console.log("22222222 start line idx=", idx, " time_now=", Date.now());
                line.begin();
                // this.scheduleOnce(()=>{
                //     line.end(idx);
                // }, 0.1);
            }, idx * 0.1);
        });        
        // let stopPromises = [];
        // for (let i = 0; i < this.slotcolums.length; i++) {
        //     let line = this.slotcolums[i];
        //     //let idxType = roller.lastIdxs[i];
        //     //let type = animation.animation[i];
        //     // let curve: number[] = [];
        //     // curve.push(animation.x1[i]);
        //     // curve.push(animation.y1[i]);
        //     // curve.push(animation.x2[i]);
        //     // curve.push(animation.y2[i]);
        //     // cc.log(animation.repeat[i]);
        //     stopPromises.push(line.end(i));
        //     //await Utils.sleep(this.node, 0.2);
        // }

        this.scheduleOnce(()=>{
            for (let i = 0; i < this.slotcolums.length; i++) {
                let line = this.slotcolums[i];
                line.end(i, 0, Utils.randomIntInclusive(1, 3));
            }
        }, 0.3);

        // await Promise.all(stopPromises).then((values)=>{
        //     console.log("22222222 values", values);
        // });
    }

}