// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import menu = cc._decorator.menu;
import property = cc._decorator.property;
import {CCUtils} from "../util/cocos";
import {ResourceManager} from "../manager/ResourceManager";

const {ccclass} = cc._decorator;
 /**
   * 老虎机单个item
   */
export enum EMSlotStates {
    kInvalid,   //无效
    kIdle,  //空闲
    kSelected,  //被选中
    kRunning    //滚动中
}

export enum SlotItemImageTypes {
    kCoin,
    kDice,
    kEnergy,
    kMoney2,
    kAttack,
    kShield,
}

export function LastIdx2SlotItemImageTypes(idx: number) {
    switch (idx) {
        case 1:
            return SlotItemImageTypes.kCoin;
        case 2:
            return SlotItemImageTypes.kDice;
        case 3:
            return SlotItemImageTypes.kEnergy;
        case 4:
            return SlotItemImageTypes.kMoney2;
        case 5:
            return SlotItemImageTypes.kAttack;
        case 6:
            return SlotItemImageTypes.kShield;
    }
}

@ccclass
@menu("gameModules/老虎机/单个元素")
export default class SlotItem extends cc.Component {
    @property(cc.Sprite)
    slotSprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    defaultSpriteFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    runningSpriteFrames: cc.SpriteFrame[] = [];

    private _state: EMSlotStates = EMSlotStates.kInvalid;
    private _sType: SlotItemImageTypes = -1;

    get itemType(): SlotItemImageTypes {
        return this._sType;
    }

    start() {}

    init(sType: SlotItemImageTypes) {
        this._sType = sType;
        this.setState(EMSlotStates.kIdle);
        console.log("22222222 sType=", sType);
    }

    private _getImageUrlById(id: number) {
        return `texture/icon/slot/${id}.png`;
    }

    private _getRunningUrlById(id: number) {
        return `texture/icon/slot/${id}_running.png`;
    }

    setState(newState: EMSlotStates) {
        if (this._state === newState) {
            return;
        }
        switch (newState) {
            case EMSlotStates.kIdle: {
                let frame = this.defaultSpriteFrames[this._sType];
                if (!frame) {
                    //ResourceManager.setSpriteFrame(this.slotSprite, this._getImageUrlById(this._sType), true, true);
                } else {
                    CCUtils.safeSetSpriteFrame(this.slotSprite, frame);
                }
                break;
            }
            case EMSlotStates.kSelected: {
                let frame = this.defaultSpriteFrames[this._sType];
                if (!frame) {
                    //ResourceManager.setSpriteFrame(this.slotSprite, this._getImageUrlById(this._sType), true, true);
                } else {
                    CCUtils.safeSetSpriteFrame(this.slotSprite, frame);
                }
                this.node.scale = 1;
                break;
            }
            case EMSlotStates.kRunning: {
                let frame = this.runningSpriteFrames[this._sType];
                if (!frame) {
                    //ResourceManager.setSpriteFrame(this.slotSprite, this._getRunningUrlById(this._sType), true, true);
                } else {
                    CCUtils.safeSetSpriteFrame(this.slotSprite, frame);
                }
                break;
            }
        }
        this._state = newState;
    }

    // update (dt) {}
}
