/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var g_coin_emitter = require("./anim/CoinEmitter")

cc.Class({
    extends: cc.Component,  /////////继承

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        coin_label_: {
            default: null,
            type: cc.Label,
        },
        star_label_ : {
            default: null,
            type: cc.Label,
        },
        turntable_node:{
            default: null,
            type: cc.Button,
        },
        dice_node:{
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.turntable_node.node.on("click", this.onTurntable, this);
        this.dice_node.on("click", this.onDice, this);
        //g_coin_emitter.fire();
    },

    start () {
        cc.log("main start start start=========");
    },

    onTurntable()
    {
        cc.log("onTurntable start start start=========");
    },

    onDice()
    {
        cc.log("onDice start start start=========");
    }

    // update (dt) {},
});
