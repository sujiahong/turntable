/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */
import { SingletonFactory } from "../util/SingletonFactory";
import { ISubManager } from "./ISubManager";

/**事件管理类 */
export class EventManager implements ISubManager {
    private _eventTarget: cc.EventTarget = null;

    static get ins(): EventManager {
        return SingletonFactory.createSingleton(EventManager);
    }

    async onLogin(isReLogin: boolean): Promise<boolean> {
        this._eventTarget = new cc.EventTarget();
        return true;
    }

    async onExit(): Promise<boolean> {
        this._eventTarget = null;
        return true;
    }

    async initialize(): Promise<boolean> {
        return true;
    }

    on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T {
        return this._eventTarget.on(type, callback, target, useCapture);
    }

    off(type: string, callback?: Function, target?: any): void {
        this._eventTarget && this._eventTarget.off(type, callback, target);
    }

    targetOff(target: any): void {
        this._eventTarget && this._eventTarget.targetOff(target);
    }

    once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        this._eventTarget.once(type, callback);
    }

    emit(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        if (this._eventTarget) {
            this._eventTarget.emit(type, arg1, arg2, arg3, arg4, arg5);
        }
    }

    dispatchEvent(event: cc.Event): void {
        this._eventTarget.dispatchEvent(event);
    }
}