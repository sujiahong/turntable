import {Utils} from "../util/Util";

export class ResourceManager {
    /**资源缓存 */
    static assetCached: Map<string, cc.Asset> = new Map();

    /**
     * 需要预加载的一些资源
     */
    static preloadRes(): void {
        const preloads: string[] = ['texture/common/default_avatar0', 'texture/common/default_avatar1'];
        this.loadResArray(preloads, cc.SpriteFrame);
    }

    /**
     * 获取缓存的数据信息
     * @param path 想要获取的地址
     */
    static getAssetCached<T extends cc.Asset>(path: string): T {
        const asset = this.assetCached.get(path) as T;
        return asset;
    }

    /**
     * 设置想要缓存的数据
     * @param path 资源名字
     * @param asset 资源数据
     */
    static setAssetCached(path: string, asset: cc.Asset): void {
        const assetCache = this.assetCached.get(path);
        if (assetCache && assetCache !== asset) {
            cc.warn('缓存的资源被覆盖 -> name = ', path);
        }

        this.assetCached.set(path, asset);
    }

    /**
     * 动态加载远程图片（不在resouse目录下的，例如头像等）
     * @param sprite
     * @param url
     * @param default_spr
     */
    static async loadOnlineImage(sprite: cc.Sprite, url: string, default_spr?: cc.SpriteFrame): Promise<boolean> {
        return new Promise((resolve) => {
            cc.loader.load({url: url, type: 'image'}, (err: Error, texture: cc.Texture2D) => {
                if (err || !sprite || !sprite.node) {
                    sprite.spriteFrame = default_spr;
                    resolve(false);
                } else {
                    sprite.spriteFrame = new cc.SpriteFrame(texture, cc.rect(0, 0, texture.width, texture.height));
                    resolve(true);
                }
            });
        })
    }

    /**
     * 加载prefab
     * @param path 地址
     */
    static loadPrefab(path: string): Promise<cc.Prefab> {
        const prefab: cc.Prefab = this.assetCached.get(path) as cc.Prefab;
        if (prefab) return Promise.resolve(prefab);

        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
                if (err) {
                    if (CC_DEBUG) {
                        console.error(`加载Prefab失败：${path}`);
                    }
                    reject(err.message || err);
                } else {
                    this.setAssetCached(path, prefab);
                    resolve(prefab);
                }
            });
        });
    }

    /**
     * 批量加载资源
     * @param urls Array of URLs of the target resource
     * @param type Only asset of type will be loaded if this argument is supplied.
     * @param cache 是否缓存
     */
    static loadResArray<T extends cc.Asset>(urls: string[], type: new () => T, cache: boolean = true) {
        if (urls.length == 0) {
            return Promise.reject('图片数据组为空!');
        }

        return new Promise((resolve, reject) => {
            cc.loader.loadResArray(urls, type as any, (err: Error, assets: cc.Asset[]) => {
                if (err) {
                    if (CC_DEBUG) {
                        console.error(`加载Resource组失败：`, urls);
                    }
                    reject(err);
                } else {
                    if (cache) {
                        for (let value of assets) {
                            const url = urls.find(url => {
                                return url.indexOf(value.name) != -1;
                            })
                            if (url) {
                                this.setAssetCached(url, value);
                            }
                        }
                    }
                    resolve(assets);
                }
            })
        })

    }

    /**
     * 加载资源
     * @param path 资源地址
     * @param type 资源类型
     * @param cache 是否缓存
     */
    static loadRes<T extends cc.Asset>(path: string, type: new () => T, cache: boolean = false): Promise<T> {
        if (!path) {
            return Promise.reject('图片资源地址为空字符串');
        }

        const assetCache = this.assetCached.get(path) as T;
        if (cache && assetCache) {
            return Promise.resolve(assetCache);
        }

        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, type as any, (err: Error, res: any) => {
                if (err) {
                    if (CC_DEBUG) {
                        console.error(`加载Resource失败：${path}`);
                    }
                    reject(err);
                } else {
                    if (cache) {
                        this.setAssetCached(path, res);
                    }
                    resolve(res);
                }
            })
        })
    }

    /**
     * 修改图片
     * @param sprite 图片的节点
     * @param path 想要修改的图片url
     * @param cache 是否缓存该图片
     * @param isSpriteSize 节点大小是否和图片一样
     */
    static setSpriteFrame(spriteNode: cc.Sprite | cc.Node, path: string, cache: boolean = false, isSpriteSize: boolean = false, size: cc.Vec2 = null, callback: Function = null): void {
        let sprite: cc.Sprite = null;
        if (spriteNode instanceof cc.Sprite) {
            sprite = spriteNode;
        } else {
            sprite = spriteNode.getComponent(cc.Sprite);
        }
        if (!sprite) {
            cc.error('设置的图片节点有问题-->> 找不到当前图片节点');
            return;
        }

        if (!path) {
            cc.warn('设置节点的时候没有图片地址-->>> 默认清理掉资源啦！');
            sprite.spriteFrame = null;
            sprite['__resName'] = '';
            sprite['__resFrame'] = null;
            return;
        }

        if (sprite['__resName'] === path && sprite['__resFrame'] === sprite.spriteFrame) return;

        sprite['__resName'] = path;
        const spriteFrame: cc.SpriteFrame = this.getAssetCached(path);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
            sprite['__resFrame'] = spriteFrame;
            return;
        }

        this.loadRes(path, cc.SpriteFrame, cache).then(spriteFrame => {
            if (!sprite.node) return;
            if (sprite['__resName'] != path) return;

            sprite.spriteFrame = spriteFrame;
            sprite['__resFrame'] = spriteFrame;
            if (isSpriteSize) {
                const rect: cc.Rect = spriteFrame.getRect();
                sprite.node.width = rect.width;
                sprite.node.height = rect.height;
                sprite.spriteFrame = spriteFrame;
            }
            if (size) {
                sprite.node.width = size.x;
                sprite.node.height = size.y;
            }
            if (callback) {
                callback();
            }
        }).catch(err => {
            cc.error(`资源加载失败-->> path = ${path}  reason = `, err);
        });
    }

    /**
     * 设置头像节点
     * @param sprite 节点
     * @param url 头像地址
     * @param size 用户头像（有0、46、64、96、132数值可选，0代表640*640正方形头像）
     * @param gender 用户性别
     */
    static setRemoteAvatar(spriteNode: cc.Sprite | cc.Node, url: string, size: number = 64, gender: number = 0): void {
        let sprite: cc.Sprite = null;
        if (spriteNode instanceof cc.Sprite) {
            sprite = spriteNode;
        } else {
            sprite = spriteNode.getComponent(cc.Sprite);
        }
        if (!sprite) {
            cc.error('设置的图片节点有问题-->> 找不到当前图片节点');
            return;
        }

        let defaultHead: string = Utils.getCommonImg("default_avatar" + gender);
        const resUrl: string = Utils.getStandardHeadUrl(url, size, gender);
        if (resUrl.indexOf('default_avatar') == -1) {
            cc.loader.load({url:resUrl,type:"image"},(err,tex:cc.Texture2D)=>{
                if (err){
                    cc.error(err);
                    return;
                }
                sprite && sprite.node && (sprite.spriteFrame=new cc.SpriteFrame(tex,cc.rect(0, 0, tex.width, tex.height)));
            });
            // this.loadOnlineImage(sprite, resUrl, sprite.spriteFrame).then(success => {
            //     if (!success) {
            //         this.setSpriteFrame(sprite, defaultHead, true);
            //     }
            // }).catch(e => {
            //     cc.error(e);
            // });
        } else {
            this.setSpriteFrame(sprite, defaultHead, true);
        }
    }

    static async loadDragonBone(filename: string, armatureName: string):Promise<dragonBones.ArmatureDisplay> {
        try {
            let dbaUrl = `animations/${filename}_ske`;
            let dbaaUrl = `animations/${filename}_tex`;
            let dbaAsset = await this.loadRes(dbaUrl, dragonBones.DragonBonesAsset);
            let dbaaAsset = await this.loadRes(dbaaUrl, dragonBones.DragonBonesAtlasAsset);
            let node = new cc.Node();
            let display = node.addComponent(dragonBones.ArmatureDisplay);
            display.dragonAsset = dbaAsset;
            display.dragonAtlasAsset = dbaaAsset;
            display.armatureName = armatureName;
            return display;

        } catch (e) {
            cc.log(e);
            Utils.showTip(e.message);
            return;
        }

    }
}