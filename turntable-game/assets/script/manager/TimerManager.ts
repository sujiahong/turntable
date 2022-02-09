import {Logger} from "../util/Log";
import {Utils} from "../util/Util";
//import {WXStorageKeys} from "../constant/WXStorages";
import {TimeUtil} from "../util/TimeUtil";

export class TimerManager {
    private static clockMap: Object = {};
    private static lastTime: number = Date.now();
    public static running: boolean = false; //是否正在运行
    private static _runningTime: number = 0;
    private static _timeouts: TimeoutTask[] = [];
    private static _lastGetEnergyTime: number = 0;
    private static _loginTime:number=0;

    // static updateGetEnergyTime() {
    //     Utils.setStorageSync(WXStorageKeys.kLastGetEnergyTime,this.getCurrentTime());
    //     this._lastGetEnergyTime = this.getCurrentTime();
    // }

    static async initialize(): Promise<boolean> {
        let scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(TimerManager);
        // let tm=Utils.getStorageSync(WXStorageKeys.kLastGetEnergyTime);
        // if(tm){
        //     this._lastGetEnergyTime=parseInt(tm);
        // }else {
        //     this._lastGetEnergyTime=0;
        // }

        return true;
    }

    static async onLogin(isReLogin: boolean): Promise<boolean> {
        let scheduler = cc.director.getScheduler();
        scheduler.scheduleUpdate(this, 1, false);
        this._timeouts = [];
        this._runningTime = 0;
        return true;
    }

    static async onExit(): Promise<boolean> {
        let scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(this);
        scheduler.unscheduleUpdate(this);
        this._timeouts = [];
        this._runningTime = 0;
        this._loginTime=0;
        return true;
    }

    private static _deltaTime: number = 0;

    static syncTime(syncTime: number, force: boolean = false) {
        cc.log("[TimeManager] setSyncTime:", syncTime);
        if (syncTime > 0) {
            let timeDelta = syncTime - Date.now();
            if (Math.abs(timeDelta) > 500) {
                this._deltaTime = timeDelta;
            }
            if (force || !this._deltaTime) {
                this._deltaTime = timeDelta;
            }
        }
        if (this._loginTime === 0) {
            this._loginTime = this.getCurrentTime();
        }
    }

    public static getCurrentTime(): number {
        return Date.now() + this._deltaTime;
    }

    public static getUnixTime() {
        return Math.floor(this.getCurrentTime() / 1000);
    }

    static get runningTime(): number {
        return this._runningTime;
    }

    static isGetEnergyPassDay(): boolean {
        let lastTime=0;
        if (this._lastGetEnergyTime){
            lastTime=this._lastGetEnergyTime;
        }else {
            lastTime=this._loginTime;
        }
        let now = this.getCurrentTime();
        if (TimeUtil.dayOfYear(now) !== TimeUtil.dayOfYear(lastTime)) {
            return true;
        }
        return false;
    }

    static update(dt) {
        this._runningTime += dt;
        let newList = [];
        let toCall = [];
        let currentTime = this.getCurrentTime();
        this._timeouts.forEach(timeout => {
            if (currentTime - timeout.startTime < timeout.duration * 1000) {
                newList.push(timeout);
            } else {
                toCall.push(timeout);
            }
        });
        this._timeouts = newList;
        this._tryCall(toCall);
    }

    private static _tryCall(list: TimeoutTask[]) {
        list.forEach(timeout => {
            try {
                Utils.safeCall(timeout.callback);
            } catch (e) {
                Logger.error(e);
            }
        })
    }

    static registerTimeout(duration: number, cb: () => void) {
        this._timeouts.push(new TimeoutTask(duration, this.getCurrentTime(), cb));
    }
}

class TimeoutTask {
    constructor(duration, startTime: number, cb: () => void) {
        this.duration = duration;
        this.startTime = startTime;
        this.callback = cb;
    }

    duration: number = 0;
    startTime: number = 0;
    callback: () => void = null;
}
