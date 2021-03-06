// import { setWxSystemInfo, WxSystemInfo } from "../../platform/PlatformManager";
// import { PropName } from "../net/base/data/propname";
// import { RespSync } from "../net/base/cmd/respsync";

/**
 * Created by zhouchuang on 16/9/9.
 */
export class ComFunc {
    static unitArr: Array<string> = ["", "K", "M", "B"];
    static constNum: number = 3;
    // static _signResp: RespSync = null;
    // static getRewardSprite(propName:PropName , count: number){
    //     let tex;
    //     if(propName == PropName.money){
    //         if(count <= 30000){
    //             tex = 1;
    //         } else if( count < 100000){
    //             tex = 2
    //         } else {
    //             tex = 3;
    //         }
    //     } else if(propName == PropName.energy) { 
    //         if(count <= 15){
    //            tex = 1;
    //         }else {
    //            tex = 2;
    //         }
    //     }
    //     return `texture/icon/${propName}`+ tex + `.png`
    // }
    static formatNumber(value: number): string {
        if (value < 1 && value > 0) {
            return 1 + "";
        }
        value = Math.floor(value);
        var exp = Math.floor(ComFunc.getExponent(value));
        if (exp < 13) {
            if (exp < 4) {
                return value + "";
            }

            var unitIt = Math.floor(exp / ComFunc.constNum);
            var rem = exp % ComFunc.constNum;
            var numStr = String(value / Math.pow(10, unitIt * ComFunc.constNum)).substr(0, ComFunc.constNum + rem);
            return numStr + ComFunc.getUnit(exp);
        } else {
            var _num = value / Math.pow(10, exp);
            return _num.toFixed(3) + "e" + exp;
        }
    }

    static getUnit(exp: number): string {
        var unitIt = Math.floor(exp / ComFunc.constNum);
        if (exp < 13) {
            return ComFunc.unitArr[unitIt];
        } else {
            var unitIt = Math.floor(exp / ComFunc.constNum);
            return "e" + unitIt * ComFunc.constNum;
        }
    }

    static formatEngNumber(number: any, decimals: number = 2): string {
        var str: string;
        var num: number;
        number = <number><any>number;

        if (number >= 1000000) {
            num = number / 1000000;
            str = (Math.floor(num / 0.001) * 0.001).toFixed(decimals);
            return this.formatEndingZero(str) + "M";
        } else if (number >= 1000) {
            num = number / 1000;
            str = (Math.floor(num / 0.001) * 0.001).toFixed(decimals);
            return this.formatEndingZero(str) + "K";
        } else {
            return number + "";
        }
    }

    static formatEndingZero(c: string): string {
        if (c.indexOf(".") != -1) {
            if (this.endWith(c, "00")) {
                return c.substring(0, c.length - 3);
            } else if (this.endWith(c, "0")) {
                return c.substring(0, c.length - 1);
            }
        }

        return c;
    }

    static endWith(c: string, suffix: string): boolean {
        return (suffix == c.substring(c.length - suffix.length));
    }

    static getExponent(value) {
        var exp = 0;
        while (value >= 10) {
            exp++;
            value /= 10;
        }
        return exp;
    }

    /**
     * ???????????????????????????
     * @param num
     */
    static toThousands(num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    }

    /**
     * ????????????????????????
     * @param str
     * @param is_global  ????????????????????????????????? :boolean
     * @returns {string|void}
     */
    static trim(str: string, is_global?: boolean): string {
        let _result = str.replace(/(^\s*)|(\s*$)/g, "");
        if (is_global) {
            _result = _result.replace(/\s/g, "");
        }
        return _result;
    }

    static htmlDecode(str) {
        let s = "";
        if (str.length === 0) return "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/'/g, "'");
        s = s.replace(/&quot;/g, '"');
        s = s.replace(/<br>/g, "\n");
        return s;
    }

    /**
     * http??????????????????
     * @param n
     * @returns {string|any}
     */
    static enCodeHtml(n): any {
        n = n.replace(/%/g, "%25");
        n = n.replace(/\+/g, "%2B");
        n = n.replace(/\//g, "%2F");
        n = n.replace(/\?/g, "%3F");
        n = n.replace(/\#/g, "%23");
        n = n.replace(/\&/g, "%26");
        n = n.replace(/\=/g, "%3d");
        return n;
    }

    /**
     * http??????????????????
     * @param n
     * @returns {string|any}
     */
    static unCodeHtml(n): any {
        n = n.replace(/%25/g, "%");
        n = n.replace(/%2B/g, "+");
        n = n.replace(/%2F/g, "/");
        n = n.replace(/%3F/g, "?");
        n = n.replace(/%23/g, "#");
        n = n.replace(/%26/g, "&");
        n = n.replace(/%3d/g, "=");
        return n;
    }

    /**
    * ????????????????????????????????????????????????
    * compareVersion('1.11.0', '1.9.9') // => 1 // 1 ?????? 1.11.0 ??? 1.9.9 ??????
    compareVersion('1.11.0', '1.11.0') // => 0 // 0 ?????? 1.11.0 ??? 1.11.0 ??????????????????
    compareVersion('1.11.0', '1.99.0') // => -1 // -1 ?????? 1.11.0 ??? 1.99.0 ??????
    */
    static compareVersion(v1, v2) {
        v1 = v1.split(".");
        v2 = v2.split(".");
        let len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push("0");
        }
        while (v2.length < len) {
            v2.push("0");
        }
        for (let i = 0; i < len; i++) {
            let num1 = parseInt(v1[i]);
            let num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }

    /**
     * ???????????????????????????-????????????????????????????????????????????????iPhone X
     */
    // static checkMobileDevice(): void {
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) return; //H5???
    //     wx.getSystemInfo({
    //         success: function (data) {
    //             setWxSystemInfo(data); //????????????;
    //             cc.log("mobileSystem info:", WxSystemInfo);
    //             // SystemManager.isNotchMobile = data.screenHeight / data.screenWidth > 2;
    //         }
    //     });
    // }

    /**
     * ??????????????????
     * @param phone
     */
    static isPhone(phone: string) {
        if (!phone) {
            return false;
        }
        //?????????????????????????????????????????????????????????,?????????????????????????????????????????????????????????????????????
        // ????????????????????????[1]??????????????????[3,4,5,7,8???9]?????????????????????????????????????????????[0-9]???????????????
        //^1???????????????1
        //[3|4|5|7|8][9] ??????3???4???5???7???8???9??????????????????
        //[0-9]{9} ????????????0-9?????????
        let reg = /^1[3|4|5|7|8|9][0-9]{9}/;
        if (reg.test(phone)) {
            return true; //??????????????????
        }
        return false;
    }

    /**
     * ???????????????????????????idx
     * @param nodeName
     */
    static getNodeIndex(nodeName: string): number {
        let str = nodeName.substr(nodeName.length - 1, 1);
        let regs = /^[0-9]$/;
        if (regs.test(str) == false) return -1;
        let index = parseInt(str);
        return index;
    }

    /**
     * ?????????????????????????????????
     * @param str ?????????
     * @param startNum ????????????
     */
    static strSliceToNumber(str: string, startNum: number): number {
        let s = str.slice(startNum);
        let regs = /^[\d]+$/; //isNaN("11") ??????
        if (regs.test(s) == false) {
            cc.error("sliceToNumber-->> ????????????????????????????????????????????????");
            return 0; //?????????0?????????????????????????????????
        }
        let index = parseInt(s);
        return index;
    }

    /**
     * ?????????min???max????????????
     * @param min 
     * @param max 
     */
    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * ????????????????????????
     * @param cp ????????????[startVec2, midVec2, midVec2, endVec2]
     * @param t 0~1
     */
    static pointOnCubicBezier(cp: { x: number, y: number }[], t: number): { x: number, y: number } {
        let ax, bx, cx;
        let ay, by, cy;
        let tSquared, tCubed;
        let result = cc.v2(0, 0);

        cx = 3.0 * (cp[1].x - cp[0].x);
        bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        ax = cp[3].x - cp[0].x - cx - bx;

        cy = 3.0 * (cp[1].y - cp[0].y);
        by = 3.0 * (cp[2].y - cp[1].y) - cy;
        ay = cp[3].y - cp[0].y - cy - by;

        tSquared = t * t;
        tCubed = tSquared * t;

        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;

        return result;
    }
}
