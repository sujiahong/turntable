import {WindowNavigator} from "../panel/WindowNavigator";
import {StageManager, LayerType} from "./StageManager";
import {WindowData} from "../panel/WindowData";

export class WindowManager {
    private static navigator: WindowNavigator;

    static async initialize(): Promise<boolean> {
        this.navigator = new WindowNavigator(StageManager.getLayer(LayerType.WINDOW));
        return true;
    }

    static async onLogin(): Promise<boolean> {
        return true;
    }

    static async onExit(): Promise<boolean> {
        this.navigator = null;
        return true;
    }

    /**
     * 注册界面
     * @param id 界面id
     * @param prefab 界面的prefab
     * @param modal 界面遮罩的alpha值 小于0表示不需要
     * @param modalClickHide
     */
    static registWindow(id: string, prefab: string, className: string, modal: number = 0.75, modalClickHide: boolean = true, keepalive: boolean = false): void {
        if (!this.navigator) {
            this.navigator = new WindowNavigator(StageManager.getLayer(LayerType.WINDOW));
        }

        WindowManager.navigator.registWindow(id, prefab, className, modal, modalClickHide, keepalive);
    }

    /**
     * 是否存在界面
     * @param windowId 要查找的界面id
     */
    static hasWindow(windowId: string): boolean {
        return this.navigator.hasWindow(windowId);
    }

    /**获取窗口的数据 */
    static getWindowData(windowId: string): WindowData {
        return this.navigator.getWindowData(windowId);
    }

    /**窗口是否处于激活状态 */
    static isActive(windowId: string): boolean {
        return this.navigator.isActive(windowId);
    }

    /**界面是否打开 */
    static isOpen(windowId: string): boolean {
        return this.navigator.isOpen(windowId);
    }

    /**
     * 显示界面
     * @param windowId 界面id
     * @param data 传入的数据
     */
    static async showWindow(windowId: string, data: any = null) {
        return this.navigator.showWindow(windowId, data);
    }

    /**
     * 关闭当前界面
     * @param windowId 界面id
     */
    static hideWindow(windowId: string): void {
        this.navigator.hideWindow(windowId);
    }

    /**关闭所有界面 */
    static hideAllWindow(): void {
        this.navigator.hideAllWindow();
    }

    /** 最上层window*/
    static topWindow(): string {
        if (!this.navigator) {
            return "";
        }
        return this.navigator.currentWindow;
    }
}