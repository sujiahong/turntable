export class SlotAnimation {
  /**
   * 序号
   */
  id: number;

  /**
   * 子动画
   */
  animation: Array<number>;

  /**
   * 列启动间隔时间
   */
  interval: number;

  /**
   * 重复圈数
   */
  repeat: Array<number>;

  /**
   * 动画持续时间
   */
  time: Array<number>;

  /**
   * x1
   */
  x1: Array<number>;

  /**
   * y1
   */
  y1: Array<number>;

  /**
   * x2
   */
  x2: Array<number>;

  /**
   * y2
   */
  y2: Array<number>;

  static list: SlotAnimation[] = [];

  static map = new Map<number, SlotAnimation>();

  static getById(value: number): SlotAnimation {
    return SlotAnimation.map.get(value);
  }

  static decode(list: Array<{}>) {
    SlotAnimation.list.length = 0;
    for (let i in list) {
      const item = new SlotAnimation();
      Object.assign(item, list[i]);
      SlotAnimation.list.push(item);
      SlotAnimation.map.set(item.id, item);
    }
  }
}

export class SlotAudio {
  /**
   * 序号
   */
  id: number;

  /**
   * 音频类型
   */
  audioType: Array<number>;

  static list: SlotAudio[] = [];

  static map = new Map<number, SlotAudio>();

  static getById(value: number): SlotAudio {
    return SlotAudio.map.get(value);
  }

  static decode(list: Array<{}>) {
    SlotAudio.list.length = 0;
    for (let i in list) {
      const item = new SlotAudio();
      Object.assign(item, list[i]);
      SlotAudio.list.push(item);
      SlotAudio.map.set(item.id, item);
    }
  }
}

export class Building {
  /**
   * 序号
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 第一个位置升级花费
   */
  pointMoney1: Array<number>;

  /**
   * 第一个位置升级花费
   */
  pointMoney2: Array<number>;

  /**
   * 第一个位置升级花费
   */
  pointMoney3: Array<number>;

  /**
   * 第一个位置升级花费
   */
  pointMoney4: Array<number>;

  /**
   * 第一个位置升级花费
   */
  pointMoney5: Array<number>;

  /**
   * 过岛奖励物品
   */
  rewardType: Array<string>;

  /**
   * 过岛奖励数值
   */
  rewardValue: Array<number>;

  /**
   * 轮盘金币系数（千分之）
   */
  rollerBet: Array<number>;

  /**
   * 开岛时间
   */
  startAt: string;

  static list: Building[] = [];

  static map = new Map<number, Building>();

  static getById(value: number): Building {
    return Building.map.get(value);
  }

  static decode(list: Array<{}>) {
    Building.list.length = 0;
    for (let i in list) {
      const item = new Building();
      Object.assign(item, list[i]);
      Building.list.push(item);
      Building.map.set(item.id, item);
    }
  }
}

export class Cardbag {
  /**
   * 序号
   */
  id: number;

  /**
   * 开卡数量
   */
  cardNum: number;

  static list: Cardbag[] = [];

  static map = new Map<number, Cardbag>();

  static getById(value: number): Cardbag {
    return Cardbag.map.get(value);
  }

  static decode(list: Array<{}>) {
    Cardbag.list.length = 0;
    for (let i in list) {
      const item = new Cardbag();
      Object.assign(item, list[i]);
      Cardbag.list.push(item);
      Cardbag.map.set(item.id, item);
    }
  }
}

export class Config {
  /**
   * 体力上限
   */
  energyLimit: number;

  /**
   * 初始体力
   */
  energyInit: number;

  /**
   * 恢复1次体力用时（秒）
   */
  energyRecovery: number;

  /**
   * 恢复1次体力数值
   */
  energyRecoveryCount: number;

  /**
   * 护盾上限
   */
  shieldLimit: number;

  /**
   * 每日捐赠体力上限
   */
  donateEnergyLimit: number;

  /**
   * 好友上限
   */
  friendLimit: number;

  /**
   * 开宝箱碎片消耗
   */
  openBoxCost: number;

  /**
   * 定向分享
   */
  directShareReward: number;

  /**
   * 每日定向分享次数
   */
  directShareNum: number;

  /**
   * 领取能量次数上限
   */
  getenergyLimit: number;

  static config: Config;

    static decode(obj: any) {
    Config.config = new Config();
    for(let k in obj) {
      Config.config[k] = obj[k];
    }
  }
}

export class RewardSign {
  /**
   * 序号
   */
  id: number;

  /**
   * 奖励
   */
  reward: Array<string>;

  /**
   * 奖励数量
   */
  rewardValue: Array<number>;

  static list: RewardSign[] = [];

  static map = new Map<number, RewardSign>();

  static getById(value: number): RewardSign {
    return RewardSign.map.get(value);
  }

  static decode(list: Array<{}>) {
    RewardSign.list.length = 0;
    for (let i in list) {
      const item = new RewardSign();
      Object.assign(item, list[i]);
      RewardSign.list.push(item);
      RewardSign.map.set(item.id, item);
    }
  }
}

export class ProcessRewards {
  /**
   * 序号
   */
  id: number;

  /**
   * 奖励类型
   */
  rewardType: Array<string>;

  /**
   * 奖励数量
   */
  rewardValue: Array<number>;

  static list: ProcessRewards[] = [];

  static map = new Map<number, ProcessRewards>();

  static getById(value: number): ProcessRewards {
    return ProcessRewards.map.get(value);
  }

  static decode(list: Array<{}>) {
    ProcessRewards.list.length = 0;
    for (let i in list) {
      const item = new ProcessRewards();
      Object.assign(item, list[i]);
      ProcessRewards.list.push(item);
      ProcessRewards.map.set(item.id, item);
    }
  }
}

export class NewTasks {
  /**
   * 序号
   */
  id: number;

  /**
   * 任务类型
   */
  taskType: number;

  /**
   * 任务数量
   */
  amount: number;

  /**
   * 奖励类型
   */
  rewardType: Array<string>;

  /**
   * 奖励值
   */
  rewardValue: Array<number>;

  static list: NewTasks[] = [];

  static map = new Map<number, NewTasks>();

  static getById(value: number): NewTasks {
    return NewTasks.map.get(value);
  }

  static decode(list: Array<{}>) {
    NewTasks.list.length = 0;
    for (let i in list) {
      const item = new NewTasks();
      Object.assign(item, list[i]);
      NewTasks.list.push(item);
      NewTasks.map.set(item.id, item);
    }
  }
}

export class Template {
  /**
   * 序号
   */
  id: number;

  /**
   * 类型
   */
  tp: string;

  /**
   * 正式服模板id
   */
  release: string;

  /**
   * 测试服模板id
   */
  develop: string;

  static list: Template[] = [];

  static map = new Map<number, Template>();

  static getById(value: number): Template {
    return Template.map.get(value);
  }

  static decode(list: Array<{}>) {
    Template.list.length = 0;
    for (let i in list) {
      const item = new Template();
      Object.assign(item, list[i]);
      Template.list.push(item);
      Template.map.set(item.id, item);
    }
  }
}

export function decodeConfig(tables) {
  for (const k in tables) {
    if (k === 'slotAnimation') SlotAnimation.decode(tables[k]);
    if (k === 'slotAudio') SlotAudio.decode(tables[k]);
    if (k === 'building') Building.decode(tables[k]);
    if (k === 'cardbag') Cardbag.decode(tables[k]);
    if (k === 'config') Config.decode(tables[k]);
    if (k === 'rewardSign') RewardSign.decode(tables[k]);
    if (k === 'processRewards') ProcessRewards.decode(tables[k]);
    if (k === 'newTasks') NewTasks.decode(tables[k]);
    if (k === 'template') Template.decode(tables[k]);
  }
}
export const configList = ['slotAnimation','slotAudio','building','cardbag','config','rewardSign','processRewards','newTasks','template'];

