/**单例工厂 */
export class SingletonFactory {
    static instances: Map<Function, Object> = new Map();

    /**
     * 创建单例
     * @param type 单例class
     */
    static createSingleton<T>(type: new () => T): T {
        let ins: any = this.instances.get(type);
        if (!ins) {
            ins = new type();
            this.instances.set(type, ins);
        }

        return ins;
    }

    /**
     * 移除单例
     * @param type 
     */
    static removeSingleton(type: any): void {
        let ins: any = this.instances.get(type);
        if (ins) {
            this.instances.delete(ins);
        }
    }
}