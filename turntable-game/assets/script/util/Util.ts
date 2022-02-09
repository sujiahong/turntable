import {ResourceManager} from "../manager/ResourceManager";
import {platform, WxSystemInfo} from "../../platform/PlatformManager";
import TipManager from "../manager/TipManager";
import {TimerManager} from "../manager/TimerManager";
import {GameConfig} from "../config/GameConfig";
import {Logger} from "./Log";
//import {ComFunc} from "./ComFunc";

/**
 * Created by zhouchuang on 16/9/7.
 */
export class Utils {
    //返回图片路径
    static getCommonImg(name: string): string {
        return `texture/common/${name}`;
    }
    /**
     * 获得头像标准大小和格式
     * @param url 头像地址
     * @param size 头像大小
     * @param gender 头像性别
     */
    static getStandardHeadUrl(url: string, size: number = 64, gender: number = 0): string {
        let defaultHead: string = getCommonImg("default_avatar" + gender);
        if (!url) {
            cc.log("");
            return defaultHead;
        }

        if (size == 1 || size == 2) {
            cc.log("setRemoteAvatar,size err");
            size = 64;
        }

        let resUrl = url;
        let _index = url.indexOf("_png");
        if (_index != -1) {
        } else if (resUrl == "/0" || resUrl == "") {
            resUrl = defaultHead;
        } else {
            let originalUrl = url;
            let checkStr = url.substr(0, 5);
            if (checkStr == "https") {
                originalUrl = url;
            } else if (checkStr == "http:") {
                originalUrl = originalUrl.replace(/http/, "https");
            }

            resUrl = originalUrl.replace(/\/0$/, "/" + size);
            if (originalUrl.indexOf("/132") != -1) {
                resUrl = originalUrl.replace(/\/132$/, "/" + size);
            }
        }

        return resUrl;
    }

    static safeCall(fn: () => void) {
        if (fn && typeof fn === "function") {
            fn();
        }
    }

    /**
     * 处理字符串--使用...填补
     * @param str 原始字符串
     * @param len 字符长度
     */
    static formatString(str: string, len: number = 14): string {
        if (!str) {
            return "";
        }

        let currentlen = 0;
        let currentStr = '';
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                currentlen += 2;
            } else {
                currentlen++;
            }

            if (currentlen > len) {
                return currentStr + '...';
            } else {
                currentStr += str.charAt(i)
            }
        }

        return currentStr;
    }

    static swap(a, b): number[] {
        let temp = a ^ b;
        return [temp ^ a, temp ^ b];
    }

    // Returns a random integer between min (included) and max (excluded)
    static randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        //ComFunc
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Returns a random integer between min (included) and max (included)
    static randomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomInRange(start: number, end: number): number {
        let differ = end - start;
        let random = Math.random();
        return (start + differ * random);

    }

    static randomInArray<T>(items: any[]): T {
        return items[this.randomInt(0, items.length)];
    }

    static minMax(value: number, min: number, max: number) {
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        return value;
    }

    // static changeSpriteFrame(node: cc.Node, spriteFtame: cc.SpriteFrame): void {
    //   const rect: cc.Rect = spriteFtame.getRect();
    //   node.width = rect.width;
    //   node.height = rect.height;
    //   node.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = spriteFtame;
    // }

    static getSeedRnd(seed: number): seedrandom {
        return new Math["seedrandom"](seed);
    }

    static seedRandomIntInclusive(rnd: seedrandom, min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(rnd.quick() * (max - min + 1)) + min;
    }

    static async sleep(target: any, dur: number) {
        return new Promise((resolve, reject) => {
            TimerManager.registerTimeout(dur, () => {
                resolve();
            });
        })
    }

    static async loadIslandPrefab(id: number) {
        return ResourceManager.loadPrefab(`prefab/displays/island/island_${id + 1}`);
    }

    /**
     * 获取适配top和bottom
     */
    // static getAdaptationTopAndBottom(withMenu: boolean = false): { top: number, bottom: number } {
    //     let top: number = 0;
    //     let bottom: number = 0;
    //     if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    //         let wxPlatform = platform;
    //         let systemInfo = WxSystemInfo;
    //         let notchMobileData = wxPlatform.common.isNotchMobile();
    //         if (systemInfo.SDKVersion != "2.2.4" && systemInfo.SDKVersion != "2.9.4" && wx.getMenuButtonBoundingClientRect && withMenu) {
    //             let rect = wx.getMenuButtonBoundingClientRect();
    //             top = ~~(rect.top * cc.view.getVisibleSize().height / systemInfo.windowHeight - 20);
    //         } else {
    //             top = notchMobileData.result ? 50 : 0;
    //         }
    //         bottom = notchMobileData.result ? 20 : 0;
    //     }

    //     return {top, bottom};
    // }

    static showNotice(msg: string, okCallBack: Function = null, okThisObj: any = null) {
        TipManager.showAlert(msg, okCallBack, okThisObj);
    }

    static showTip(msg: string) {
        TipManager.showTip(msg);
    }

    static solveString(str: string, len: number, strAppend: string = "..."): string {
        if (!str) {
            return "";
        }
        // if (!CC_EDITOR &&_.isEmpty(strAppend)){
        //     strAppend="";
        // }
        strAppend = strAppend || "";
        let currentlen = 0;
        let currentStr = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                currentlen += 2;
            } else {
                currentlen++;
            }
            if (currentlen > len) {
                return currentStr + strAppend;
            } else {
                currentStr += str.charAt(i);
            }
        }
        return currentStr;
    };

    static arrToDict<T>(arr: Array<T>, key?: string) {
        let result = {};
        if (arr) {
            for (let i = 0; i < arr.length; ++i) {
                const value = arr[i];
                let k = key ? value[key] : value;
                result[k] = value;
            }
        }
        return result;
    }

    /**
     *
     * @param title 标题
     * @param content 描述内容
     * @param showCancel 是否显示取消按钮
     * @param cancelText 取消文案
     * @param cancelColor 取消文字的颜色
     * @param confirmText 确认按钮文字
     * @param confirmColor 确认文字的颜色
     * @param success 成功的回调
     * @param fail
     * @param complete
     */
    // static showModal(title: string, content: string, showCancel?: boolean, cancelText?: string, cancelColor?: string, confirmText?: string, confirmColor?: string,
    //                  success?: (res?:any) => void,
    //                  fail?: () => void,
    //                  complete?: () => void
    // ) {
    //     platform.common.showModal(title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor, success, fail, complete);
    // }


    /**
     * 保存Storage
     * 过期时间为当前时间+timelong（毫秒）
     * @param {*} key
     * @param {*} value
     * @param {*} timelong （毫秒）
     */
    // static setStorageSync(key: string, value: any, timelong: number = -1) {
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }
    //     try {
    //         let timeout = 0;
    //         if (timelong > 0) {
    //             timeout = TimerManager.getCurrentTime() + timelong;
    //         }
    //         wx.setStorageSync(`${GameConfig.ENV}_${key}`, {value, timeout});
    //     } catch (e) {
    //         Logger.warn("setStorageSync err", e, key, value);
    //     }
    // }

    /**
     * 读取Storage
     * @param {string} key
     */
    // static getStorageSync(key: string): any {
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return undefined;
    //     }
    //     try {
    //         let data: any = wx.getStorageSync(`${GameConfig.ENV}_${key}`);
    //         if (data && (!data.timeout || TimerManager.getCurrentTime() < data.timeout)) {
    //             return data.value;
    //         }
    //         return undefined;
    //     } catch (e) {
    //         Logger.warn("getStorageSync err", e, key);
    //         return undefined;
    //     }
    // }

    static showLoading(title:string,mask:boolean){
        wx.showLoading({title:title,mask:mask});
    }

    static hideLoading(){
        wx.hideLoading({});
    }
}
