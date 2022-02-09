import {ResourceManager} from "./ResourceManager";
import {Utils} from "../util/Util";
import {CCUtils} from "../util/cocos";

export enum LayerType {
    GAME,
    WINDOW,
    TIP,
    EFFECT,
    TOP
}

export class StageManager {
    private static stageNode: cc.Node;
    private static layerMap: Map<string, cc.Node> = new Map();

    public static stageWidth: number = 0;//屏幕的宽
    public static stageHeight: number = 0;//屏幕的高
    public static stageOffHeight: number = 0;//屏幕与标准1334的差值

    /**初始化根节点 */
    static async initialize(): Promise<boolean> {
        try {
            cc.log("init stage manager");
            //创建根节点
            this.stageNode = new cc.Node();
            this.stageNode.name = 'stageManager';
            this.stageNode.addComponent(cc.Component);
            cc.game.addPersistRootNode(this.stageNode);

            //屏幕的宽高
            const {width, height} = cc.view.getVisibleSize();
            this.stageWidth = width;
            this.stageHeight = height;
            this.stageOffHeight = height - 1334;

            this.initLayer();
            await this._loadModal();
            return true;
        } catch (e) {
            cc.error(e);
            return false;
        }
    }

    static async onExit(): Promise<boolean> {
        if (this.stageNode) {
            cc.game.removePersistRootNode(this.stageNode);
        }
        this.stageNode && this.stageNode.destroy();
        this.stageNode = null;
        this.layerMap = new Map<string, cc.Node>();
        return true;
    }

    static async onLogin(isReLogin: boolean): Promise<boolean> {
        return true;
    }

    /**初始化不同的层级 */
    private static initLayer(): void {
        if (!this.stageNode) return;

        for (let i = 0; i <= LayerType.TOP; i++) {
            const layer = new cc.Node();
            // console.log(`this.stageWidth = ${this.stageWidth}  this.stageHeight = ${this.stageHeight}`);
            layer.setContentSize(cc.size(this.stageWidth, this.stageHeight));
            layer.setPosition(this.stageWidth >> 1, this.stageHeight >> 1);
            layer.name = LayerType[i];
            layer.parent = this.stageNode;
            // console.log(`layer.name = ${LayerType[i]} x = ${layer.x} y = ${layer.y}   anchorX = ${layer.anchorX} anchorY = ${layer.anchorY}`);
            this.layerMap.set(LayerType[i], layer);
        }
    }

    /**获取想要的层级 */
    static getLayer(type: LayerType): cc.Node {
        const node: cc.Node = this.layerMap.get(LayerType[type]);
        return node;
    }

    /**
     * 添加节点到某个layer层
     * @param parentType 父节点类型
     * @param childNode 想要添加的节点
     */
    static addNode(parentType: LayerType, childNode: cc.Node): void {
        const parentNode = this.getLayer(parentType);
        childNode.parent = parentNode;
    }

    /**遮罩层-------------------------------------->>>>>>>>>> */
    private static _modalNode: cc.Node = null;

    static async _loadModal() {
        try {
            let modalPrefab = await ResourceManager.loadPrefab("prefab/common/modalNodePrefab");
            this._modalNode = cc.instantiate(modalPrefab);
        } catch (e) {
            cc.error(e);
        }
    }

    static hideModal() {
        if (!this._modalNode) {
            return;
        }
        this._modalNode.removeFromParent(false);
        CCUtils.clearTouch();
    }

    static refreshModalNode(targetNode: cc.Node, tapCb?: () => void) {
        if (!this._modalNode) {
            cc.warn("遮罩层暂未初始化");
            return;
        }

        let showModal = false;
        for (let i = LayerType.TIP; i >= 0; i--) {
            let layer = this.layerMap.get(LayerType[i]);
            if (!layer || layer.childrenCount <= 0) {
                continue;
            }
            let cIdx = layer.children.indexOf(targetNode);
            if (cIdx < 0) {
                continue;
            }

            this._modalNode.parent = layer;
            let idx = cIdx;
            let children = layer.children;
            children = _.without(children, this._modalNode);
            idx = Utils.minMax(idx, 0, children.length - 1);
            let left = children.slice(0, idx);
            let right = children.slice(idx, children.length);
            left.push(this._modalNode, ...right);
            left.forEach((v, idx) => {
                v.setSiblingIndex(idx);
            });
            tapCb && this._modalNode.once(cc.Node.EventType.TOUCH_END, tapCb, targetNode);
            showModal = true;

            // this._modalNode.opacity = 0;
            // const tw = cc.tween(this._modalNode);
            // tw.to(0.2, { opacity: 200 })
            //     .start();
        }
        !showModal && this.hideModal();
    }

    /**
     * 在指定layer上查找指定的脚本类型
     * @param lType LayerType
     * @param classType 脚本类型
     * @return 脚本对象
     */
    static findNode<T>(lType: LayerType, classType: { prototype: cc.Component }): T {
        let layer = this.getLayer(lType);
        if (!layer) {
            return;
        }
        let children = layer.children;
        let find = null;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            find = child.getComponent(classType);
            if (find) {
                break;
            }
        }
        return find as T;
    }
}