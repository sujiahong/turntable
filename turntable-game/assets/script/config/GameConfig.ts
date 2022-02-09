import {SERVER_WS_DICT, SERVER_HTTP_DICT, EMServerType, EMEnvType, CDN_ROOT_DICT, EMCDNType} from "./defines";

const Version: string = "0.0.7.0";
const env: EMEnvType = EMEnvType.Prod;
const serverType: EMServerType = EMServerType.Prod;
const CDNType: EMCDNType = EMCDNType.Remote;

// 外部环境相关的配置定义
export class GameConfig {
     /**
       * 是否为正式环境
       */
    static readonly IS_PROD: boolean = env == EMEnvType.Prod;
    static readonly SERVER_ROOT_WS: string = SERVER_WS_DICT[GameConfig.IS_PROD ? EMServerType.Prod : serverType];
    static readonly SERVER_ROOT_HTTP: string = SERVER_HTTP_DICT[GameConfig.IS_PROD ? EMServerType.Prod : serverType];
    static readonly REMOTE_ROOT: string = CDN_ROOT_DICT[GameConfig.IS_PROD ? EMCDNType.Remote : CDNType];

    /**
     * 游戏版本号
     */
    static readonly VERSION = Version;

    static readonly GAME_ID = GameConfig.IS_PROD ? "moneydd" : "idiomWarLand";
    /**
     * 用户id，只在 debug 环境下使用，正式环境会从sdk获取id
     */
    static readonly TEST_USER_ID = `t329`;

    static readonly ENV: EMEnvType = env;
    static readonly CLIENT = GameConfig.IS_PROD ? "prod" : "debug";
    public static SDK_SERVER: string = GameConfig.IS_PROD ? 'https://wxmini.hortor.net' : 'https://wxmini-test.hortor.net';

    /**
     * 积分墙 key 值
     */
    static readonly WALL_KEY = GameConfig.IS_PROD ? "vGAqL6qVDsz8jct7" : "ROscT31Rr9ry9WhX";
    static readonly IN_FACE_AD_ID = "RogZDpGZ1r";

    /**
     * TGA Key 值
     */
    static readonly TGA_KEY = GameConfig.IS_PROD ? "8d40dbb255984734a95b1ada4742db91" : "7432973bfa9c4734ac57a1dcbf210ed1";

    /**
     * TGA 地址
     */
    static readonly TGA_ADDRESS = GameConfig.IS_PROD ? "https://tga-dz.hortorgames.com" : "http://tga.hortorgames.com:9080";

    static wxShowUserBtn:boolean=true;
}