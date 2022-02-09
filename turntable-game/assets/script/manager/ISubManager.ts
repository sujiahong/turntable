/**
 * Created by Joker on 2020/3/5.
 */
export interface ISubManager {
    initialize(): Promise<boolean>;
    onLogin(isReLogin: boolean): Promise<boolean>;//登录 0登录 1重登录
    onExit(): Promise<boolean>;//退出
}