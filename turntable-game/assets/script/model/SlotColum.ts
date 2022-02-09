/**
 * Created by Joker on 2020/2/22.
 * 老虎机列组件
 */
import ccclass = cc._decorator.ccclass;
import menu = cc._decorator.menu;
import property = cc._decorator.property;
//import {RollerType} from "../../net/base/data/rollertype";
import {Defer} from "../util/Defer";
import {bezierByTime, easeout} from "../util/Ease";
import SlotItem, {
    EMSlotStates,
    LastIdx2SlotItemImageTypes,
    SlotItemImageTypes
} from "./SlotItem";
// import { timingSafeEqual } from "crypto";

export enum EaseTypes {
    linear,
    sineOut,
    elasticOut,
    quadOut,
    backOut,
    circOut,
    expoOut,
    quadInOut,
    cubicOutIn,
    backOutIn,
    customBackOutIn,
    customBackOut,
    bezier
}

export enum EMSlotLineStates {
    kIdle,//空闲
    kRunning,   //达到最大速度
    kEnd,   //减速状态
    kEndAction
}

function backOut(overshot: number) {
    var s = overshot || 1.70158;
    return function (k: number) {
        return --k * k * ((s + 1) * k + s) + 1;
    }
}

@ccclass
@menu("gameModules/老虎机/列")
export class SlotColum extends cc.Component {
    @property([SlotItem])
    slotItems: SlotItem[] = []; //item数组
    @property(cc.Float)
    center: number = 55;

    private _state: EMSlotLineStates = EMSlotLineStates.kIdle;

    private _moveOnce: number = 0;
    private _top: number = 0;
    private _bottom: number = 0;
    private _height: number = 0;
    private _itemheight;

    protected onLoad(): void {
        this._initSlotItems();
    }

    private _initSlotItems() {
        if (this.slotItems.length <= 0) {
            cc.error("老虎机道具初始化错误");
            return;
        }
        let templateNode = this.slotItems[0].node;
        let initTypes = [SlotItemImageTypes.kCoin, SlotItemImageTypes.kDice, SlotItemImageTypes.kEnergy];
        initTypes.forEach((iType, idx) => {
            let item = this.slotItems[idx];
            if (!item) {
                let node = cc.instantiate(templateNode);
                item = node.getComponent<SlotItem>(SlotItem);
                this.slotItems.push(item);
                node.parent = templateNode.parent;
            }
            item.init(iType);
        });

        let items = this.slotItems;
        let centerIdx = items.length / 2;
        for (let i = 0; i < centerIdx; i++) {
            let item = items[i];
            let y = this.center + (centerIdx - i) * (item.node.height + 15);
            item.node.y = y;
            this._itemheight = item.node.height;
            if (i === 0) {
                this._top = Math.floor(y);
            }
        }
        let centerItem = items[centerIdx];
        centerItem.node.y = this.center;
        this._moveOnce = -(centerItem.node.height + 15) / 2;
        for (let i = centerIdx + 1; i < items.length; i++) {
            let item = items[i];
            let y = this.center - (i - centerIdx) * (item.node.height + 15);
            item.node.y = y;
            if (i === items.length - 1) {
                this._bottom = Math.floor(y - item.node.height - 15);
            }
        }
        this._height = this._top - this._bottom;
    }


    private _selectItem: SlotItem = null;
    private _endDur: number = 0;
    private _repeat: number = 0;
    private _endDefer: Defer = null;
    private _controlPs: number[] = [];
    private repeats: number[] = [0, 1, 2];
    private _easeDistance: number = 0;
    private _endDistance: number = 0;
    private _endMoving: number = 0;
    private type: number;
    private type3: number;
    private audioStart: cc.AudioSource = null;
    private audioEnd: cc.AudioSource = null;
    private audioNext: cc.AudioSource = null;
    private lineId: number = null;

    begin(audio1: cc.AudioSource, audio2: cc.AudioSource, audio3: cc.AudioSource, type3: number) {
        this.audioStart = audio1;
        this.audioEnd = audio3;
        this.audioNext = audio2;
        this.type3 = type3;
        this._setState(EMSlotLineStates.kRunning);
    }
    async end(id: number, dur: number, lastIdx: number, repeat: number, type: number, controlP?: number[]) {
        // let item = _.find(this.slotItems, (item) => {
        //     return item.itemType === LastIdx2SlotItemImageTypes(lastIdx);
        // });
        // this.slotItems.forEach(item=>{
        //     item.slotSprite.node.color=new cc.Color(255,255,255,255);
        // })
        // item.slotSprite.node.color=new cc.Color(255,0,0,255);
        //console.log("111111111111", item)
        //this._selectItem = item;
        this._endDur = dur;
        this._repeat = repeat;
        this._controlPs = controlP;
        if (repeat < 0) {
            repeat = 0;
        }

        this._endDistance = -this._height * repeat - this._moveOnce;

        if (type == 0) {
            this._easeDistance = -this._moveOnce;
        } else {
            this._easeDistance = -this._height * repeat - this._moveOnce;
        }

        this._setState(EMSlotLineStates.kEnd);
        let defer = new Defer();
        this._endDefer = defer;
        this.type = type;
        this.lineId = id;
        //this.audio = audio;
        await defer.promise;
    }

    private _playEndAni() {
        let dur = this._endDur;
        let height = this._top - this._bottom;
        //let item = this._selectItem;
        let callback = () => {
            this.audioEnd.play();
        };
        if (this.lineId == 1 && this.type3 != 0) {
            this.audioStart.stop();
            this.audioNext.play();
        }
        if (this.lineId == 2) {
            callback = () => {
                if (this.type != 0) {
                    this.audioNext.stop();
                } else {
                    this.audioStart.stop();
                }
                this.audioEnd.play();
            }
        }
        this.slotItems.forEach((item, idx) => {
            let ease;
            if (this.type == 0) {
                ease = easeout;
            } else {
                ease = bezierByTime(this._controlPs);
            }
            this._endTween(item, dur, ease, height, callback);
        });
    }

    private _endTween(item: SlotItem, dur: number, ease, height: number, callback: Function) {
        cc.log(`开始老虎机停止缓动,ease distance:${this._easeDistance},ease type:${this.type},height:${this._height},move once；${this._moveOnce}`);
        if (this.type == 4) {
            cc.tween(item.node).by(0.96 * dur, {y: this._easeDistance - 25}, {
                    easing: ease,
                    progress: (start: number, end: number, current: number, time: number) => {
                        let dis = (end - start) * time;
                        if (Math.abs(dis) > Math.abs(this._bottom - start)) {
                            current = this._top + (dis - (this._bottom - start)) % height;
                            return current;
                        }
                        return dis + start;
                    }
                }
            ).by(0.04 * dur, {y: 25}, {
                progress: (start: number, end: number, current: number, time: number) => {
                    let dis = (end - start) * time;
                    if (Math.abs(dis) > Math.abs(this._bottom - start)) {
                        current = this._top + (dis - (this._bottom - start)) % height;
                        return current;
                    }
                    return dis + start;
                }
            }).call(() => {
                this._setState(EMSlotLineStates.kIdle);
                this._endDefer && this._endDefer.resolve();
                callback()
            }).start();

        } else {
            cc.tween(item.node).by(dur, {y: this._easeDistance}, {
                    easing: ease,
                    progress: (start: number, end: number, current: number, time: number) => {
                        let dis = (end - start) * time;
                        if (Math.abs(dis) > Math.abs(this._bottom - start)) {
                            current = this._top + (dis - (this._bottom - start)) % height;
                            return current;
                        }
                        return dis + start;
                    }
                }
            ).call(() => {
                this._setState(EMSlotLineStates.kIdle);
                this._endDefer && this._endDefer.resolve();
                callback()
            }).start();
        }
    }

    private _genTargetY(): number {
        let y = this._selectItem.node.y + (this._easeDistance % this._height);
        if (y < this._bottom) {
            return y + this._height;
        }
        return y;
    }
    private  k = 0;
    protected update(dt: number): void {
        let distance: number = 0;
       
       
        switch (this._state) {
            case EMSlotLineStates.kRunning: {
                distance = this._moveOnce;
                break;
            }
            case EMSlotLineStates.kEnd: {
               
                if (Math.abs(this._genTargetY() - this.center) <= 5 && this._endMoving <= (this._endDistance - this._easeDistance)) {
                   
                    this._endMoving = 0;
                    this._setState(EMSlotLineStates.kEndAction);
                    if (distance / (this._top - this._bottom)) {

                    } else {
                        return;
                    }
                }
                distance = this._moveOnce;
                this._endMoving += this._moveOnce;
                break;
            }
            case EMSlotLineStates.kIdle: {
                return;
            }
            case EMSlotLineStates.kEndAction: {
                return;
            }
        }
        this.k+=distance;
        // console.log(this.type3)
        // if(this.type3 == 4){
        //     console.log(this._easeDistance,this._endDistance,this._height,this.k,"111111111");
        // }
        this.slotItems.forEach(item => {
            item.node.y += distance;
            if (item.node.y <= this._bottom) {
                item.node.y += (this._top - this._bottom);
            }
           
    
            if (this._state !== EMSlotLineStates.kIdle) {
                return;
            }
        });
     
    }

    private _setState(newState: EMSlotLineStates) {
        if (this._state === newState) {
            return;
        }
        switch (newState) {
            case EMSlotLineStates.kRunning: {
                this.slotItems.forEach(item => {
                    item.setState(EMSlotStates.kRunning);
                });
                break;
            }
            case EMSlotLineStates.kEnd: {
                this.slotItems.forEach(item => {
                    item.setState(EMSlotStates.kIdle);
                });
                break;
            }
            case EMSlotLineStates.kEndAction: {
                this._playEndAni();
            }
        }
        this._state = newState;
    }
}