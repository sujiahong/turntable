import {TimerManager} from "../manager/TimerManager";

export class TimeUtil {
    static readonly kSecondsOfMinute = 60;
    static readonly kSecondsOfHour = 60 * 60;
    static readonly kSecondsOfDay = 24 * 60 * 60;

    static readonly kOnlineDuration = TimeUtil.kSecondsOfMinute * 3;

    /**
     * 计数单位：天，小时，分钟
     超过24小时显示为XX天XX时（例如：12天23时）
     小于24小时显示为XX时XX分（例如：22时52分）
     小于1小时显示为XX分XX秒（例如：53分25秒）
     * @param sec
     * @returns {any}
     */
    static formatTimeCN(sec: number): string {
        if (sec < 0) {
            return "";
        }
        let str: string = "";
        let day = Math.floor(sec / 3600 / 24);
        let hour = Math.floor(sec / 3600);
        let minute = Math.floor(sec / 60);
        let second = sec;
        if (day > 0) {
            sec = sec % (24 * 3600);
            hour = Math.floor(sec / 3600);

            str += day + "天";
            str += hour >= 10 ? hour + "时" : "0" + hour + "时";
        } else if (hour > 0) {
            minute = Math.floor((sec % 3600) / 60);
            str += hour >= 10 ? hour + "时" : "0" + hour + "时";
            str += minute >= 10 ? minute + "分" : "0" + minute + "分";
        } else {
            if (minute > 0) {
                str += minute >= 10 ? minute + "分" : "0" + minute + "分";
                second = Math.floor((sec % 3600) % 60);
                str += second >= 10 ? second + "秒" : "0" + second + "秒";
            } else {
                str += "00分";
                str += second >= 10 ? second + "秒" : "0" + second + "秒";
            }
        }

        return str;
    }

    static dayOfYear(sec: number) {
        let today = new Date(sec);
        let first = new Date(today.getFullYear(), 0, 1);
        return  Math.round(((today.getTime() - first.getTime()) / 1000 / 60 / 60 / 24) + .5);
    }

    /**
     * 格式化时间---时间类型：99：99：99
     * @param sec 秒数
     * @param showHour
     */
    static formatTime(sec: number, showHour?: any) {
        let day = Math.floor(sec / 3600 / 24);
        if (day > 0) {
            return day + "天";
        }

        let hour = Math.floor(sec / 3600);
        let second = Math.floor(sec % 3600);
        let minute = Math.floor(second / 60);
        second = second % 60;
        let hourToMinute = hour * 60;
        minute = showHour ? minute : (hourToMinute + minute);
        if (showHour && sec < 0) {
            return "00:00:00"
        }
        if (sec < 0) {
            return "0";
        }

        let str = "";
        if (showHour) {
            if (showHour != "auto" || hour != 0) {
                if (hour >= 10) {
                    str = hour.toString();
                } else {
                    str = "0" + hour;
                }
                str = str + ":";
            }
        }

        if (minute >= 10) {
            str = str + minute;
        } else {
            str = str + "0" + minute;
        }

        if (second >= 10) {
            str = str + ":" + second;
        } else {
            str = str + ":0" + second;
        }
        return str;
    }

    static format(dt: Date, fmt: string): string {
        const o = {
            "M+": dt.getMonth() + 1, //月份
            "d+": dt.getDate(), //日
            "h+": dt.getHours(), //小时
            "m+": dt.getMinutes(), //分
            "s+": dt.getSeconds(), //秒
            "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
            "S": dt.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    static getDateBeforeDesc(dt: Date): string {
        let now = TimerManager.getCurrentTime();
        let dif = (now - dt.getTime()) / 1000;
        if (dif < 60) {
            return "刚刚";
        }
        if (dif < 3600) {
            return Math.ceil(dif / 60) + "分钟前"
        }
        if (dif < 3600 * 24) {
            return Math.ceil(dif / 3600) + "小时前"
        }
        return this.format(dt, "yyyy-MM-dd hh:mm:ss");
    }


    /**
     * 显示距离上次的时间
     * @param sec 秒数
     * @returns {string}
     */
    static showElapseTime(sec: number): string {
        if (sec <= this.kOnlineDuration) {
            return '在线';
        }

        let _str = "刚刚";
        let _diffSecond = sec;
        let _diffMinute = Math.floor(_diffSecond / 60);
        let _diffHour = Math.floor(_diffSecond / 60 / 60);
        let _diffDay = Math.floor(_diffSecond / 60 / 60 / 24);
        if (_diffDay < 1) {
            if (_diffHour < 1) {
                if (_diffMinute > 0) {
                    _str = _diffMinute + "分钟前";
                }
            } else {
                _str = _diffHour + "小时前";
            }
        } else {
            _diffDay = _diffDay > 30 ? 30 : _diffDay;
            _str = _diffDay + "天前";
        }

        return _str;
    }

    static showElapseTimeMess(sec: number): string {
        if (sec <= this.kOnlineDuration) {
            return '刚刚';
        }

        let _str = "刚刚";
        let _diffSecond = sec;
        let _diffMinute = Math.floor(_diffSecond / 60);
        let _diffHour = Math.floor(_diffSecond / 60 / 60);
        let _diffDay = Math.floor(_diffSecond / 60 / 60 / 24);
        if (_diffDay < 1) {
            if (_diffHour < 1) {
                if (_diffMinute > 0) {
                    _str = _diffMinute + "分钟前";
                }
            } else {
                _str = _diffHour + "小时前";
            }
        } else {
            _diffDay = _diffDay > 30 ? 30 : _diffDay;
            _str = _diffDay + "天前";
        }

        return _str;
    }

    static getUnixTime(): number {
        return TimerManager.getUnixTime();
    }

    /**
     *获取时间戳到现在的时间差，单位：秒
     * @param unix 时间戳
     * @returns  时间差
     */
    static secondFrom(time: number): number {
        return this.getUnixTime() - time;
    }

    /**
     * 转换时间字符串到unixtime
     * @param str 2019-10-30 12:00:00
     * @return unix time
     */
    static convertStr2UnixTime(str: string): number {
        let date = new Date(str);
        return Math.floor(date.getTime() / 1000);
    }
}
