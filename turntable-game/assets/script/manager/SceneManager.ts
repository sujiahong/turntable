import { SceneType } from "./SceneType";

export class SceneManager {
    /**
     * 预加载场景
     * @param sceneType 
     */
    static async preloadScene(sceneType: SceneType) {
        return new Promise((resolve, reject) => {
            cc.director.preloadScene(sceneType, () => { }, (err: Error, asset: cc.SceneAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    /**
     * 加载并切换到场景--无动画
     * @param sceneType 
     */
    static async loadScene(sceneType: SceneType) {
        return new Promise<boolean>((resolve) => {
            cc.director.loadScene(sceneType, () => {
                resolve(true);
            });

        })
    }

    /**
     * 切换到某个场景--有动画效果的
     * @param nextScene 
     */
    static async switchScene(nextScene: SceneType) {
        await this.preloadScene(nextScene);
        await this.loadScene(nextScene);

    }
}