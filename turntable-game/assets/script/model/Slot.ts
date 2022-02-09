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
        console.log("_onTouchBegin");
        this.onTapStartButton();
    }
    private _onTouchEnd()
    {
        console.log("_onTouchEnd");
    }

    async onTapStartButton()
    {
        this.slotcolums.forEach((line, idx) => {
            this.scheduleOnce(() => {
                //line.begin(this.audio[0], this.audio2[2], this.audio3[idx], animation.animation[2]);
            }, idx * 0.1);
        });        
        let stopPromises = [];
        for (let i = 0; i < this.slotcolums.length; i++) {
            let line = this.slotcolums[i];
            let idxType = roller.lastIdxs[i];
            let type = animation.animation[i];
            let curve: number[] = [];
            curve.push(animation.x1[i]);
            curve.push(animation.y1[i]);
            curve.push(animation.x2[i]);
            curve.push(animation.y2[i]);
            cc.log(animation.repeat[i]);
            stopPromises.push(line.end(i, animation.time[i], idxType, animation.repeat[i], type, curve));

            await Utils.sleep(this.node, 0.2);

        }

        await Promise.all(stopPromises);
    }

}