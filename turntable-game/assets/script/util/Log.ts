/*
 * @Copyright: 
 * @file name: File name
 * @Data: Do not edit
 * @LastEditor: 
 * @LastData: 
 * @Describe: 
 */

export class Logger {
    static debug(msg?: string, ...args: any[])
    {
        console.log(msg, ...args);
    }

    static info(msg?: string, ...args: any[])
    {
        console.log(msg, ...args);
    }

    static warn(msg?: string, ...args: any[])
    {
        console.warn(msg, ...args);
    }

    static error(msg?: string, ...args: any[])
    {
        console.error(msg, ...args);
    }
}