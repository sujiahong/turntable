/**
 * Created by Joker on 2020/1/16.
 */
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import {Utils} from "../util/Util";
//import {CCEasingTypes} from "../util/cocos";
import menu = cc._decorator.menu;

 /**
   *y坐标位移的缓存数据对象
   */
export class YPathCacheData {
    constructor(public v0: number, public angle: number, public path: number[]) {
    }
}

@ccclass
@menu("gameModules/common/CoinEmitter")
export class CoinEmitter extends cc.Component {
    @property({
        type: cc.Integer,
        tooltip: "重力加速度"
    })
    G: number = 13000;
    @property({
        type: cc.Integer,
        tooltip: "最小初速度",
    })
    v0Min: number = 5000;
    @property({
        type: cc.Integer,
        tooltip: "最大初速度",
    })
    v0Max: number = 5000;
    @property({
        type: cc.Integer,
        tooltip: "最小角度",
    })
    angleMin: number = 15;
    @property({
        type: cc.Integer,
        tooltip: "最大角度",
    })
    angleMax: number = 45;
    @property({
        type: cc.Float,
        tooltip: "最小每帧缩放增加",
    })
    scaleStepMin: number = 0.038;
    @property({
        type: cc.Float,
        tooltip: "最大每帧缩放增加",
    })
    scaleStepMax: number = 0.07;
    @property({
        type: cc.Integer,
        tooltip: "金币数量"
    })
    coinCount: number = 20;
    @property({
        type: cc.Integer,
        tooltip: "x轴每帧最小偏移"
    })
    xMoveStepMin: number = -15;
    @property({
        type: cc.Integer,
        tooltip: "x轴每帧最大偏移"
    })
    xMoveStepMax: number = 15;
    @property(cc.Integer)
    rotationStepMin: number = 2;
    @property(cc.Integer)
    rotationStepMax: number = 5;
    @property({
        type: cc.Integer,
        tooltip: "最小初始x偏移"
    })
    bornOffsetXMin: number = -100;
    @property({
        type: cc.Integer,
        tooltip: "最大初始x偏移"
    })
    bornOffsetXMax: number = 100;
    @property({
        type: cc.Integer,
        tooltip: "最小初始y偏移"
    })
    bornOffsetYMin: number = 0;
    @property({
        type: cc.Integer,
        tooltip: "最大初始y偏移"
    })
    bornOffsetYMax: number = 100;

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    private static _coinPool: cc.NodePool = new cc.NodePool();
    private _cachePaths: YPathCacheData[] = [];
    private _rndPathCount: number = 100;
    private _rndCur: number = 0;

    protected onLoad(): void {
        if (CoinEmitter._coinPool.size() >= 70) {
            return;
        }
        for (let i = 0; i < 70; i++) {
            let node = cc.instantiate(this.prefab);
            node && CoinEmitter._coinPool.put(node);
        }

        // for (let i = 0; i < ; i++) {
        //
        // }
    }

     /**
       *每帧计算一次y坐标位移数据添加至缓存
       */
    protected update(dt: number): void {
        if (this._rndCur >= this._rndPathCount) {
            return;
        }
        let angle = Utils.randomInRange(this.angleMin, this.angleMax) * 0.017453293,
        let v0 = Utils.randomInRange(this.v0Min, this.v0Max);
        let tmPassed = 0, halfH = cc.visibleRect["height"] / 2;
        let curY = 0, yPath = [];
        while (curY > -halfH) {
            tmPassed += 0.016666666666666666;
            let y = v0 * tmPassed * Math.sin(angle) - this.G * tmPassed * tmPassed / 2;
            curY = y;
            yPath.push(y);
        }
        let pathData = new YPathCacheData(v0, angle, yPath);
        this._cachePaths.push(pathData);
        this._rndCur++;
    }

     /**
       * 开始金币动画
       * @param count 发射金币数量
       * @return void
       */
    fire(count: number) {
        // let count = Utils.randomIntInclusive(this.minCount, this.maxCount);
        count = count || this.coinCount;
        for (let i = 0; i < count; i++) {
            let node = CoinEmitter._coinPool.get();
            if (!node) {
                node = cc.instantiate(this.prefab);
            }
            node.parent = this.node;
            this._runCoin(node)
        }
    }

    //重置金币节点
    private _resetNode(node: cc.Node) {
        node.scale = 0;
        node.angle = 0;
        node.setPosition(0, 0);
        node.stopAllActions();
        CoinEmitter._coinPool.put(node);
    }

    //应用金币动画轨迹至节点
    private _runCoin(node: cc.Node) {
        let ani = node.getComponent(cc.Animation);
        ani.play("", Utils.randomInRange(0,35/50));
        let pathData = Utils.randomInArray<YPathCacheData>(this._cachePaths);
        let angle = pathData.angle, v0 = pathData.v0, path = pathData.path;
        node.x = Utils.randomInRange(this.bornOffsetXMin, this.bornOffsetXMax);
        node.y = Utils.randomInRange(this.bornOffsetYMin, this.bornOffsetYMax);
        let xMoveStep = 0;
        if (node.x <= 0) {
            xMoveStep = Utils.randomInRange(this.xMoveStepMin, 0);
        } else {
            xMoveStep = Utils.randomInRange(0, this.xMoveStepMax);
        }

        let rotationStep = Utils.randomInRange(this.rotationStepMin, this.rotationStepMax);
        let scaleStep = Utils.randomInRange(this.scaleStepMin, this.scaleStepMax);
        node.scale = 0.5;

        let updateCount = 0;
        let updateFn = () => {
            let y = path[updateCount];
            updateCount++;
            node.y = y;
            node.x += xMoveStep;
            node.scale += scaleStep;
            node.angle += rotationStep;
            if (updateCount >= path.length) {
                this._resetNode(node);
                this.unschedule(updateFn);
            }
        };
        this.schedule(updateFn, 1 / 60);
    }
}