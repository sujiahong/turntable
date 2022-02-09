import {IView} from "./IView";

export enum WindowState {
    CLOSE = -1,
    LOADING,
    OPEN,
    ERROR
}

export class WindowData {
    //初始值
    public id: string = '';//窗口id
    public className: string;//组件的类名字
    public prefabUrl: string;//窗口的prefab
    public modal: number = 0.75;//背景遮罩层
    public modalClickHide: boolean = false;//点击遮罩是否关闭
    public keepAlive: boolean = false; //移除时是否销毁当前Node

    //动态修改值
    public data: any;//窗口数据
    // public parent: cc.Node;//父节点
    public currentNode: cc.Node;//当前的节点
    public state: WindowState;//窗口的状态
    // public isOpened: boolean = false;//是否打开

    /**
     * 创建数据的初始化
     * @param id 窗口id
     * @param prefab 窗口的prefab
     * @param className 对应的组件类名
     * @param modal 遮罩的alpha
     * @param keepalive 移除时是否销毁节点
     * @param modalClickHide 是否点击遮罩关闭窗口
     */
    constructor(id: string, prefab: string, className: string, modal: number, modalClickHide: boolean = true, keepalive: boolean = false) {
        this.id = id;
        this.prefabUrl = prefab;
        this.className = className;
        this.modal = modal;
        this.modalClickHide = modalClickHide;
        this.keepAlive = keepalive;
        this.state = WindowState.CLOSE;
    }

    /**界面是否已打开 */
    get isOpen(): boolean {
        return this.state == WindowState.OPEN;
    }

    /**界面是否处于激活状态 */
    get isActive(): boolean {
        return this.state > WindowState.CLOSE;
    }

    /**
     * 获取组件上的脚本文件
     */
    getComponentView(): IView {
        if (!this.currentNode) return null;

        const classT: IView = this.currentNode.getComponent(this.className);
        return classT;
    }
}