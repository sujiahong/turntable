/**
 * Created by Joker on 2020/2/18.
 * 提示气泡
 */
import {ViewBase} from "./ViewBase";
import {AnimationGroup} from "../anim/animation-group";
import {EffectType} from "../anim/Effect";
import ccclass = cc._decorator.ccclass;
import menu = cc._decorator.menu;
import property = cc._decorator.property;
import {Utils} from "../util/Util";

@ccclass
@menu("gameModules/common/TipWindow")
export class TipWindow extends ViewBase {
    @property(cc.Label)
    msgLabel: cc.Label = null;
    @property(cc.Animation)
    inOutAnimation: cc.Animation = null;

    show(id: string, data?: string): void {
        this.effectType=EffectType.none;
        super.show(id, data);

        this.msgLabel.string=Utils.solveString(data,40,"...");
        AnimationGroup.get().playAwait(this.inOutAnimation,"tip_in_out").call(()=>{
            this.hide();
        }).start();
    }
}