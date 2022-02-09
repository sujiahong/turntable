/**
 * Created by Joker on 2020/3/5.
 * 发布相关配置项
 */

export const SERVER_WS_DICT: Dict<string> = {
    Prod: "wss://moneydd-agent.hortorgames.com/",
    Test: "wss://animalworld-agent-test.hortorgames.com/",
};

export const SERVER_HTTP_DICT: Dict<string> = {
    Prod: "https://moneydd.hortorgames.com/",
    Test: "https://animalworld-test.hortorgames.com/",
};

export const CDN_ROOT_DICT: Dict<string> = {
    Remote: "https://moneydd-resource.hortorgames.com/resource/",
    TestRemote: "https://animalworld-test-resource.hortorgames.com/resource/",
};

export enum EMServerType {
    Prod = "Prod",
    Test = "Test",
}

export enum EMEnvType {
    Prod = "Prod",
    Test = "Test",
}

export enum EMCDNType {
    Remote = "Remote",
    TestRemote = "TestRemote",
    Local = "Local",
}