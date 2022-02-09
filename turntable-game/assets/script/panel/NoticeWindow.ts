/**
 * Created by Joker on 2020/2/18.
 * 带确认按钮的提示信息面板
 */
import {ViewBase} from "./ViewBase";
import ccclass = cc._decorator.ccclass;
import menu = cc._decorator.menu;
import property = cc._decorator.property;

@ccclass
@menu("gameModules/common/NoticeWindow")
export class NoticeWindow extends ViewBase {
    @property(cc.Label)
    noticeLabel: cc.Label = null;
    data: {
        tips: string,
        okCallBack: Function,
        okThisObj: Object
    } = null;

    show(id: string, data?: {
        tips: string,
        okCallBack: Function,
        okThisObj: Object
    }): void {
        super.show(id, data);
        this.noticeLabel.string = data.tips;
    }

    onTapSure() {
        this.node.destroy();
        this.data.okCallBack && this.data.okCallBack.apply(this.data.okThisObj);
    }
}