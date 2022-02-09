import {WindowData, WindowState} from "./WindowData";
import {ResourceManager} from "../manager/ResourceManager";
import {IView} from "./IView";
import {StageManager} from "../manager/StageManager";
import {WindowManager} from "../manager/WindowManager";
import {Logger} from "../util/Log";
import {EventManager} from "../manager/EventManager";

export enum EMWindowEvents {
    kHide = "kHide",
    allHide = "allHide",
    addFirstWindow = 'addWindow',
}

export class WindowNavigator {
    private windowMap: Map<string, WindowData> = new Map();
    private windowContainer: cc.Node;
    private activeWindows: Array<string> = [];
    private windowSequence: string[] = [];

    constructor(rootNode: cc.Node) {
        this.windowContainer = rootNode;
    }

    /**
     * 注册界面
     * @param id 界面id
     * @param prefab 界面的prefab
     * @param modal 界面遮罩的alpha值 小于0表示不需要
     * @param modalClickHide
     */
    registWindow(id: string, prefab: string, className: string, modal: number, modalClickHide: boolean = true, keepalive: boolean = false): void {
        let windowData: WindowData = this.windowMap.get(id);
        if (!windowData) {
            windowData = new WindowData(id, prefab, className, modal, modalClickHide, keepalive);
            this.windowMap.set(id, windowData);
            
            
        }
    }

    /**
     * 是否存在界面
     * @param windowId 要查找的界面id
     */
    hasWindow(windowId: string): boolean {
        return this.windowMap.has(windowId);
    }

    /**获取窗口的数据 */
    getWindowData(windowId: string): WindowData {
        return this.windowMap.get(windowId);
    }

    /**获取当前窗口id */
    get currentWindow(): string {
        const len: number = this.activeWindows.length;
        if (len > 0) {
            return this.activeWindows[len - 1];
        }

        return '';
    }

    private async _setCurrentWindow(windowId: string) {
        if (windowId && !this.windowMap.has(windowId)) {
            console.warn(`WindowNavigator中未找到对应的windowId = ${windowId}`);
            return
        }

        if (!this.isActive(windowId)) {
            return this.openCurrentWindow(windowId);
        }
    }

    /**
     * 打开当前界面
     * @param windowId 要打开的界面id
     */
    private async openCurrentWindow(windowId: string): Promise<cc.Node> {
        const windowData = this.windowMap.get(windowId);
        // windowData.isOpened = false;

        this.activeWindows.push(windowId);
        await this.changeWindowState(windowId, WindowState.LOADING);
        //窗口节点已存在
        if (windowData.currentNode) {
            Logger.debug("窗口节点已缓存，直接使用");
            windowData.currentNode.parent = this.windowContainer;
            const classT: IView = windowData.getComponentView();
            if (classT) {
                classT.show(windowData.id, windowData.data);
            }
            this.changeWindowState(windowId, WindowState.OPEN);
            this._refreshModal();
            return;
        }
        //加载远程prefab
        Logger.debug("开始加载窗口资源,id:", windowId);
        return new Promise<cc.Node>((resolve, reject) => {
            ResourceManager.loadPrefab(windowData.prefabUrl).then(prefab => {
                Logger.debug("窗口资源加载成功,id:", windowId);
                // windowData.isOpened = true;
                const currentWindow: cc.Node = cc.instantiate(prefab);
                currentWindow.parent = this.windowContainer;
                // console.log(`currentWindow -->> x = ${currentWindow.x}  y = ${currentWindow.y}`);
                windowData.currentNode = currentWindow;
                const classT: IView = windowData.getComponentView();
                if (classT) {
                    classT.show(windowData.id, windowData.data);
                } else {
                    Logger.warn("未找到窗口脚本,id:", windowId);
                }
                this.changeWindowState(windowId, WindowState.OPEN);
                this._refreshModal();
                resolve(currentWindow);

            }).catch(error => {
                Logger.warn('加载prefab失败 -> ', error);
                this.hideWindow(windowId);
            });
        });
    }

    /**
     * 修改window的状态
     * @param windowId 界面id
     * @param state 最新的状态
     */
    private async changeWindowState(windowId: string, state: WindowState) {
        const windowData: WindowData = this.windowMap.get(windowId);
        if (windowData && windowData.state != state) {
            windowData.state = state;
            // this.checkWindowModal();
            this.onStateChanged(windowId, state);
        }
    }

    /**
     * 界面的状态改变
     * @param windowId
     * @param state 当前状态
     */
    protected onStateChanged(windowId: string, state: WindowState): void {
        Logger.info(`WindowState changed id : ${windowId} , state : ${WindowState[state]}`);
        // if (windowId === WindowType.steal || windowId === WindowType.attack) {
        //     CloudLoading.ins.setStatus(state);
        // }
    }

    /**窗口是否处于激活状态 */
    isActive(windowId: string): boolean {
        const windowData: WindowData = this.windowMap.get(windowId);
        if (windowData) {
            return windowData.isActive;
        }

        return false;
    }

    /**界面是否打开 */
    isOpen(windowId: string): boolean {
        const windowData = this.windowMap.get(windowId);
        if (windowData) {
            return windowData.isOpen;
        }

        return false;
    }

    /**
     * 显示界面
     * @param windowId 界面id
     * @param data 传入的数据
     */
    async showWindow(windowId: string, data: any = null) {
        const windowData = this.windowMap.get(windowId);
        if (!windowData) {
            cc.warn("未注册的窗口id,id:", windowId);
        }
        windowData.data = data;
        if(this.activeWindows.length == 0){
            EventManager.ins.emit(EMWindowEvents.addFirstWindow);
        }
        return this._setCurrentWindow(windowId);
    }

    /**
     * 关闭当前界面
     * @param windowId 界面id
     */
    hideWindow(windowId: string): void {
        const windowData = this.windowMap.get(windowId);
        if (windowData) {
           
            
            this.changeWindowState(windowId, WindowState.CLOSE);
            if (this.activeWindows.indexOf(windowId) >= 0) {
                this.activeWindows.splice(this.activeWindows.indexOf(windowId), 1);
                this._refreshModal();
            }
            this.activeWindows = _.without(this.activeWindows, windowId);
            if(this.activeWindows.length === 0){
                EventManager.ins.emit(EMWindowEvents.allHide);
            }
            if (windowData.currentNode) {
                windowData.currentNode.emit(EMWindowEvents.kHide);
                if (windowData.keepAlive) {
                    windowData.currentNode.removeFromParent(false);
                } else {
                    windowData.currentNode.destroy();
                    windowData.currentNode = null;
                }

            }
            //
            // this._refreshModal();
        }
    }

    private _refreshModal() {
        if (this.activeWindows.length <= 0) {
            StageManager.hideModal();
            return;
        }
        let findWindowData: WindowData = null;
        for (let i = this.activeWindows.length - 1; i >= 0; i--) {
            let id = this.activeWindows[i];
            let data = this.windowMap.get(id);
            if (data.modal <= 0 || !data.currentNode) {
                continue;
            }
            findWindowData = data;
            break;
        }
        if (!findWindowData) {
            StageManager.hideModal();
        } else if (findWindowData.modalClickHide) {
            StageManager.refreshModalNode(findWindowData.currentNode, () => {
                let view = findWindowData.getComponentView();
                view ? view.hide() : WindowManager.hideWindow(findWindowData.id);
            });
        } else {
            StageManager.refreshModalNode(findWindowData.currentNode);
        }
    }

    /**关闭所有界面 */
    hideAllWindow(): void {
        for (let i: number = this.activeWindows.length - 1; i >= 0; i--) {
            this.hideWindow(this.activeWindows[i]);
        }
        this.windowSequence = [];
    }
}