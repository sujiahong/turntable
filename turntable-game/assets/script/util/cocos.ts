/**
 * Created by Joker on 2020/1/3.
 */

import {ResourceManager} from "../manager/ResourceManager";

export enum CCEasingTypes {
    constant,
    linear,
    quadIn,
    quadOut,
    quadInOut,
    cubicIn,
    cubicOut,
    cubicInOut,
    quartIn,
    quartOut,
    quartInOut,
    quintIn,
    quintOut,
    quintInOut,
    sineIn,
    sineOut,
    sineInOut,
    expoIn,
    expoOut,
    expoInOut,
    circIn,
    circOut,
    circInOut,
    elasticIn,
    elasticOut,
    elasticInOut,
    backIn,
    backOut,
    backInOut,
    bounceIn,
    bounceOut,
    bounceInOut,
    smooth,
    fade,
    quadOutIn,
    cubicOutIn,
    quartOutIn,
    quintOutIn,
    sineOutIn,
    expoOutIn,
    circOutIn,
    backOutIn,
    bounceOutIn
}

export class CCUtils {
    static safeSetSpriteFrame(sprite:cc.Sprite,frame:cc.SpriteFrame){
        if (!sprite||!sprite.node){
            cc.warn("无效的精灵");
            return;
        }
        sprite.spriteFrame=frame;
        // let texture=frame.getTexture();
        // let rec=frame.getRect();
        // sprite.node.width=rec.width;
        // sprite.node.height=rec.height;
    }

    static async loadDisplayPrefab(filename:string){
        return ResourceManager.loadPrefab(`prefab/displays/${filename}`);
    }

    public static setDbSlot(db:dragonBones.ArmatureDisplay, slotKey:string, node:cc.Node){
        if(!slotKey){return;}
        const slot = db.armature().getSlot(slotKey);
        if(!slot){
            console.warn(`DBAttach 找不到对应的 slot: ${slotKey}, aramatureName: ${db.armature().name}`);
            return;
        }

        slot.setAttachNode(node, db);
    }

    public static transpos(src: cc.Node, dst: cc.Node, x: number, y: number) {
        let p = src.convertToWorldSpaceAR(cc.v2(x, y));
        p = dst.convertToNodeSpaceAR(p);
        return p
    }

    //todo,临时处理按住不松手时吞掉点击事件问题
    static clearTouch(){
        cc["eventManager"]["_currentTouch"] = null;
    }
}