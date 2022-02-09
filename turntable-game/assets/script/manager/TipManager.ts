import { StageManager, LayerType } from "./StageManager";
//import { HashMap } from "../../game/util/HashMap";
import { ResourceManager } from "./ResourceManager";
import {TipWindow} from "../panel/TipWindow";
import {NoticeWindow} from "../panel/NoticeWindow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipManager extends cc.Component {
    //static tipHash: HashMap = new HashMap();

    /**
     * 显示提示飘字
     * @param tips 提示文字
     */
    static showTip(tips: string) {
        ResourceManager.loadPrefab("prefab/common/tipWindowPrefab").then(prefab => {
            const tip: cc.Node = cc.instantiate(prefab);
            const tipNode: cc.Node = StageManager.getLayer(LayerType.TIP);
            tip.parent = tipNode;
            const tipCom: TipWindow = tip.getComponent<TipWindow>(TipWindow);
            tipCom.show('tip', tips);
        })
    }

    /**
     * 显示弹窗提示
     * @param tips 提示文字
     * @param okCallBack 确定之后的回调
     * @param okThisObj 确定函数的this
     */
    static showAlert(tips: string, okCallBack: Function = null, okThisObj: any = null): void {
        const alertParam: AlertParam = {
            tips: tips,
            okCallBack: okCallBack,
            okThisObj: okThisObj
        };

        ResourceManager.loadPrefab("prefab/common/noticeWindowPrefab").then(prefab => {
            const alert: cc.Node = cc.instantiate(prefab);
            const tipNode: cc.Node = StageManager.getLayer(LayerType.TIP);
            alert.parent = tipNode;
            const tipCom: NoticeWindow = alert.getComponent<NoticeWindow>(NoticeWindow);
            tipCom.show('alert', alertParam);
        })
    }
}

/**alter的弹窗参数 */
export type AlertParam = {
    tips: string,
    okCallBack: Function,
    okThisObj: any
}
