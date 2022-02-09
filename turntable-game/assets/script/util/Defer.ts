/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */
/**
 * Created by Joker on 2020/1/5.
 */
export class Defer {
    public resolve: (value?) => void;
    public reject: (value?) => void;
    public promise: Promise<any>;
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}