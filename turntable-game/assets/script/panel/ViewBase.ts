import {IView} from "./IView";
import {WindowManager} from "../manager/WindowManager";
import {Effect, EffectType} from "../anim/Effect";

export class ViewBase extends cc.Component implements IView {
    id: string;//窗口id
    data: any;//窗口需要的数据
    effectType: EffectType = EffectType.default;//界面弹出动画类型
    effectEnter: cc.Tween | cc.Animation;//是否需要动画效果打开
    effectExit: cc.Tween;

    private _initedNode: boolean = false;//节点初始化完成
    private _initedData: boolean = false;//数据初始化完成
    private _closeCb:()=>void=null;
    onLoad(): void {
        this.onInit();
    }

    start(): void {
        this._initedNode = true;
        this.checkOpenView();
    }

    show(id: string, data?: any): void {
        this.id = id;
        this.data = data;
        this._initedData = true;
        //todo::强制布局的效率
        let widget = this.node.getComponent<cc.Widget>(cc.Widget);
        widget && widget.updateAlignment();
        switch (this.effectType) {
            case EffectType.none:
                break;
            case EffectType.default:
                Effect.scaleEffect(this.node);
                break;
            case EffectType.custom:
                if (this.effectEnter instanceof cc.Tween) {
                    this.effectEnter.start();
                } else if (this.effectEnter instanceof cc.Animation) {
                    this.effectEnter.play();
                }
                break;
        }

        this.checkOpenView();
    }

    hide(): void {
        if (this.effectExit) {
            this.effectExit.call(() => {
                WindowManager.hideWindow(this.id);
            }).start();
            return;
        }

        WindowManager.hideWindow(this.id);
        this._closeCb && this._closeCb();
    }

    onClose(cb:()=>void){
        this._closeCb=cb;
    }

    private checkOpenView(): void {
        if (this._initedNode && this._initedData) {
            this.onOpen();
        }
    }


    /**子类继承--节点初始化完成，可以处理监听事件 */
    protected onInit(): void {
    }

    /**子类继承--节点初始化完成并且数据已获取到 */
    protected onOpen(): void {
    }
}