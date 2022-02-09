/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */
import { EffectType } from "../anim/Effect";

export interface IView {
    id: string;//窗口id
    data: any;//窗口需要的数据
    effectType: EffectType;//界面入场动画类型
    effectEnter: any;//入场动画
    effectExit: any;//出场动画
    show(id:string, data?: any): void;//显示
    hide(): void;//隐藏
}