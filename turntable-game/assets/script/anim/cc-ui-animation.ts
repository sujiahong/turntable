import {IAnimation} from "./animation-wrapper";
import {Utils} from "../util/Util";

//cc.Animation包装器
export class CCUiAnimation implements IAnimation {
    private readonly _aniClip: cc.AnimationClip = null;
    private readonly _ani: cc.Animation = null;
    private readonly _playTimes: number = 0;
    private readonly _name: string = "";
    private readonly _timeScale: number = 1;

    constructor(ani: cc.Animation, name: string, times: number, timeScale: number = 1) {
        let clips = ani.getClips();
        if (name === "") {
            this._aniClip = ani.defaultClip;
        } else {
            for (let i = 0; i < clips.length; i++) {
                let clip = clips[i];
                if (clip.name === name) {
                    this._aniClip = clip;
                    break;
                }
            }
        }
        if (!this._aniClip) {
            cc.error("无效的UI动画名");
            return;
        }
        this._ani = ani;
        this._playTimes = times;
        this._name = name;
        this._timeScale = timeScale;
    }

    async call() {
        let state = this._ani.play(this._name, 0);
        let speed = this._timeScale;
        if (this._timeScale < 0) {
            state.wrapMode = cc.WrapMode.Reverse;
            speed *= -1;
        }else {
            state.wrapMode = cc.WrapMode.Normal;
            speed *= 1;
        }

        if (this._playTimes===-1){
            state.wrapMode=cc.WrapMode.PingPong;
        }
        else if (this._playTimes===0){
            state.wrapMode=cc.WrapMode.Loop;
        }

        state.speed = speed;
        return Utils.sleep(this,this._aniClip.duration/(speed||1));
    }
}