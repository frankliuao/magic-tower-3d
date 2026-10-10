import { Direction, ItemType, PlayerStats, Tile, SaveSlot, MoveCommand } from '../types/game';
import { ALL_FLOORS, getFloor } from '../data/floors';
import { MONSTERS } from '../data/monsters';
import { ITEMS } from '../data/items';
import { findIronDoorRule, getIronDoorRulesForFloor } from '../data/ironDoors';
import { calculateBattle } from './combat';
import { sound } from '../audio/sound';
import {
  Language,
  getDialogueData,
  getPickupNotification,
  getDoorNotification,
  getCombatNotification,
  TRADER_FLOOR_OFFERS,
} from '../i18n';

export type GameListener = () => void;

/**
 * 根据角色当前朝向 (facing) 和相对动作 (前/后/左/右) 计算世界网格中的绝对方向
 * 以角色前方为标准：
 * - 前 (forward): 面朝方向
 * - 后 (backward): 角色后方 (反方向)
 * - 左 (left): 角色身体左侧 (逆时针 90°)
 * - 右 (right): 角色身体右侧 (顺时针 90°)
 */
export function getRelativeDirection(
  facing: Direction,
  action: 'forward' | 'backward' | 'left' | 'right'
): Direction {
  const DIRS: Direction[] = ['up', 'right', 'down', 'left'];
  const currentIndex = DIRS.indexOf(facing);
  if (currentIndex === -1) return 'down';

  let offset = 0;
  switch (action) {
    case 'forward':
      offset = 0;
      break;
    case 'right':
      offset = 1;
      break;
    case 'backward':
      offset = 2;
      break;
    case 'left':
      offset = 3;
      break;
  }
  return DIRS[(currentIndex + offset) % 4];
}

/**
 * 根据摄像机当前的方位角 (Yaw)，将屏幕视口方向 (W:上, S:下, A:左, D:右)
 * 自适应转换为真实地牢网格中对应的绝对方向，保证玩家按 W 永远向屏幕上方走
 */
export function getCameraAdaptedDirection(
  cmd: 'up' | 'down' | 'left' | 'right',
  yawRad: number
): Direction {
  let y = yawRad % (Math.PI * 2);
  if (y > Math.PI) y -= Math.PI * 2;
  if (y < -Math.PI) y += Math.PI * 2;

  // 将连续弧度映射到 4 个主要象限 (0: 0°, 1: 90°, 2: 180°, 3: 270°)
  let sector = Math.round(y / (Math.PI / 2));
  sector = ((sector % 4) + 4) % 4;

  const DIR_CLOCKWISE: Direction[] = ['up', 'right', 'down', 'left'];
  const baseIndex = DIR_CLOCKWISE.indexOf(cmd);
  if (baseIndex === -1) return cmd;

  // 当相机顺时针旋转 sector * 90° 时，屏幕前方向对应世界地图逆时针旋转
  const adaptedIndex = (baseIndex - sector + 4) % 4;
  return DIR_CLOCKWISE[adaptedIndex];
}

export class GameState {
  // 玩家基础状态
  public playerStats: PlayerStats = {
    hp: 1000,
    maxHp: 1000,
    atk: 10,
    def: 10,
    gold: 0,
    exp: 0,
    yellowKeys: 1,
    blueKeys: 0,
    redKeys: 0,
    weapon: null,
    shield: null,
    inventory: {
      monster_manual: 1,
      compass: 1,
    },
  };

  // 当前位置与楼层 (游戏开局从 0F 仙灵密境启程，接受仙女指引与新手教学)
  public currentFloor: number = 0;
  public playerPos: { x: number; y: number; dir: Direction } = { x: 5, y: 9, dir: 'up' };

  // 楼层缓存（记录修改后的地图）
  public floorCache: Map<number, (Tile | null)[][]> = new Map();
  public exploredFloors: Set<number> = new Set([0]);

  // 祭坛加点购买累计次数
  public shopTimes: number = 0;

  // 模态窗口状态
  public isMonsterManualOpen: boolean = false;
  public isFloorTeleportOpen: boolean = false;
  public isShopOpen: boolean = false;
  public isExpShopOpen: boolean = false;
  public isDialogueOpen: boolean = false;
  public isGameOver: boolean = false;
  public isVictory: boolean = false;
  public isDebugOpen: boolean = false;

  // 商人与老人交易与赠礼状态记录
  public tradersBought: Record<string, boolean> = {};
  public elderGiftsGiven: Record<string, boolean> = {};

  // 对话数据
  public activeDialogue: {
    name: string;
    avatar: string;
    lines: string[];
    currentIndex: number;
    npcId?: string;
    targetPos?: { x: number; y: number };
    trade?: {
      tradeId: string;
      costGold: number;
      title: string;
      isBought: boolean;
    };
  } | null = null;

  // 语言设置 (支持中文 'zh' 与英文 'en'，默认 'zh')
  public language: Language = 'zh';

  // 浮动通知回调 (用于向 UI 推送悬浮提示文本，支持指定停留时长)
  public onFloatingText?: (text: string, color: string, duration?: number) => void;

  public addNotification(text: string, color: string = '#ffffff', duration?: number) {
    if (this.onFloatingText) {
      this.onFloatingText(text, color, duration);
    }
  }

  public setLanguage(lang: Language) {
    this.language = lang;
    if (this.activeDialogue && this.activeDialogue.npcId) {
      const tradeId = (this.activeDialogue.npcId === 'trader' || this.activeDialogue.npcId === 'merchant')
        ? `trader_${this.currentFloor}f`
        : undefined;
      const isBought = tradeId ? !!this.tradersBought[tradeId] : false;
      const hasGift = (this.activeDialogue.npcId === 'elder' || (this.activeDialogue.npcId === 'thief' && this.currentFloor === 29))
        ? !!this.elderGiftsGiven[`${this.activeDialogue.npcId}_${this.currentFloor}f`]
        : false;

      const dlg = getDialogueData(this.activeDialogue.npcId, lang, this.currentFloor, isBought, hasGift);
      if (dlg) {
        this.activeDialogue.name = dlg.name;
        if (isBought && this.activeDialogue.trade?.isBought && tradeId && TRADER_FLOOR_OFFERS[this.currentFloor]) {
          this.activeDialogue.lines = [...TRADER_FLOOR_OFFERS[this.currentFloor].linesAfter[lang]];
        } else {
          this.activeDialogue.lines = [...dlg.lines];
        }
        if (dlg.trade) {
          this.activeDialogue.trade = dlg.trade;
        }
      }
    }
    this.notify();
  }

  // 战斗模态数据
  public activeBattle: {
    monsterId: string;
    monsterName: string;
    monsterHp: number;
    monsterMaxHp: number;
    heroStartHp: number;
    heroEndHp: number;
    damage: number;
    gold: number;
    exp: number;
  } | null = null;

  // 监听器 (通知 React UI 重新渲染)
  private listeners: Set<GameListener> = new Set();

  constructor() {
    this.initGame();
  }

  // 初始化游戏 (严格对齐经典 50 层魔塔初值与起始楼层)
  public initGame() {
    this.playerStats = {
      hp: 1000,
      maxHp: 1000,
      atk: 10,
      def: 10,
      gold: 0,
      exp: 0,
      yellowKeys: 1,
      blueKeys: 0,
      redKeys: 0,
      weapon: null,
      shield: null,
      inventory: {
        monster_manual: 1,
        compass: 1,
      },
    };
    this.currentFloor = 0;
    this.playerPos = { x: 5, y: 9, dir: 'up' };
    this.shopTimes = 0;
    this.floorCache.clear();
    this.exploredFloors = new Set([0]);
    this.isGameOver = false;
    this.isVictory = false;
    this.isShopOpen = false;
    this.isExpShopOpen = false;
    this.tradersBought = {};
    this.elderGiftsGiven = {};

    // 默认加载第 0 层仙灵密境
    const f0 = getFloor(0);
    this.floorCache.set(0, f0.layout);
    this.notify();
  }

  // 订阅更新
  public subscribe(fn: GameListener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public notify() {
    this.listeners.forEach((fn) => fn());
  }

  // 获取当前楼层数据
  public getCurrentFloorData() {
    let layout = this.floorCache.get(this.currentFloor);
    if (!layout) {
      const f = getFloor(this.currentFloor);
      layout = f.layout;
      this.floorCache.set(this.currentFloor, layout);
    }
    const template = getFloor(this.currentFloor);
    return {
      ...template,
      layout,
    };
  }

  // 相对移动指令 (以角色当前面朝方向为基准: 前/后/左/右)
  public moveRelative(
    action: 'forward' | 'backward' | 'left' | 'right',
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ) {
    const targetDir = getRelativeDirection(this.playerPos.dir, action);
    return this.move(targetDir, onTileChange, onFloating);
  }

  // 综合移动指令处理 (WASD / 方向键)
  public moveByCommand(
    cmd: MoveCommand,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ) {
    let dir: Direction;
    if (cmd === 'up' || cmd === 'forward') dir = 'up';
    else if (cmd === 'down' || cmd === 'backward') dir = 'down';
    else if (cmd === 'left') dir = 'left';
    else dir = 'right';

    return this.move(dir, onTileChange, onFloating);
  }

  // 移动指令处理 (WASD / 方向键)
  public move(
    dir: Direction,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ) {
    if (this.isDialogueOpen || this.isShopOpen || this.isMonsterManualOpen || this.isFloorTeleportOpen || this.isGameOver || this.isVictory) {
      return;
    }

    this.playerPos.dir = dir;
    let targetX = this.playerPos.x;
    let targetY = this.playerPos.y;

    if (dir === 'up') targetY -= 1;
    if (dir === 'down') targetY += 1;
    if (dir === 'left') targetX -= 1;
    if (dir === 'right') targetX += 1;

    // 边界碰撞
    if (targetX < 0 || targetX > 10 || targetY < 0 || targetY > 10) {
      sound.playError();
      this.notify();
      return;
    }

    const floor = this.getCurrentFloorData();
    const tile = floor.layout[targetY][targetX];

    // 1. 空地面
    if (!tile || tile.type === 'floor') {
      this.playerPos.x = targetX;
      this.playerPos.y = targetY;
      sound.playStep();
      this.notify();
      return;
    }

    // 2. 实体墙与暗墙
    if (tile.type === 'wall') {
      sound.playError();
      this.notify();
      return;
    }

    // 熔岩地形交互 (13F / 26F 熔岩之海)
    if (tile.type === 'lava') {
      if (this.playerStats.inventory.snow_crystal) {
        // 拥有【冰冻雪花】：神圣寒气将熔岩瞬间凝结为坚固冰霜石板！
        floor.layout[targetY][targetX] = { type: 'floor' };
        if (onTileChange) onTileChange(targetX, targetY, false);
        sound.playVictory();
        this.playerPos.x = targetX;
        this.playerPos.y = targetY;
        const msg = this.language === 'zh'
          ? '【冰冻雪花】寒气涌动！沸腾熔岩被凝结为寒冰坦途！'
          : '[Frost Snowflake] The blazing lava is frozen into solid ice!';
        if (onFloating) onFloating(msg, '#38bdf8');
      } else {
        // 无冰冻雪花：阻挡并给出清晰的剧情解密指引与音效警告
        sound.playError();
        const msg = this.language === 'zh'
          ? '炽热熔岩阻挡！需击败35层魔龙取得【冰冻雪花】方可通行！'
          : 'Blazing lava blocks the way! You need the [Frost Snowflake] from the 35F Dragon to pass!';
        if (onFloating) onFloating(msg, '#f87171');
      }
      this.notify();
      return;
    }
    if (tile.type === 'fake_wall') {
      // 暗墙撞击粉碎
      floor.layout[targetY][targetX] = { type: 'floor' };
      if (onTileChange) onTileChange(targetX, targetY, false);
      sound.playDoor();
      this.playerPos.x = targetX;
      this.playerPos.y = targetY;
      if (onFloating) onFloating('发现密道！', '#38bdf8');
      this.notify();
      return;
    }

    // 3. 门交互
    if (tile.type === 'door_yellow') {
      if (this.playerStats.yellowKeys > 0) {
        this.playerStats.yellowKeys--;
        floor.layout[targetY][targetX] = { type: 'floor' };
        if (onTileChange) onTileChange(targetX, targetY, true);
        sound.playDoor();
        this.playerPos.x = targetX;
        this.playerPos.y = targetY;
        const notif = getDoorNotification('yellow', true, this.language);
        if (onFloating) onFloating(notif.text, notif.color);
      } else {
        sound.playError();
        const notif = getDoorNotification('yellow', false, this.language);
        if (onFloating) onFloating(notif.text, notif.color);
      }
      this.notify();
      return;
    }

    if (tile.type === 'door_blue') {
      if (this.playerStats.blueKeys > 0) {
        this.playerStats.blueKeys--;
        floor.layout[targetY][targetX] = { type: 'floor' };
        if (onTileChange) onTileChange(targetX, targetY, true);
        sound.playDoor();
        this.playerPos.x = targetX;
        this.playerPos.y = targetY;
        const notif = getDoorNotification('blue', true, this.language);
        if (onFloating) onFloating(notif.text, notif.color);
      } else {
        sound.playError();
        const notif = getDoorNotification('blue', false, this.language);
        if (onFloating) onFloating(notif.text, notif.color);
      }
      this.notify();
      return;
    }

    if (tile.type === 'door_red') {
      if (this.playerStats.redKeys > 0) {
        this.playerStats.redKeys--;
        floor.layout[targetY][targetX] = { type: 'floor' };
        if (onTileChange) onTileChange(targetX, targetY, true);
        sound.playDoor();
        this.playerPos.x = targetX;
        this.playerPos.y = targetY;
        const notif = getDoorNotification('red', true, this.language);
        if (onFloating) onFloating(notif.text, notif.color);
      } else {
        sound.playError();
        const notif = getDoorNotification('red', false, this.language);
        if (onFloating) onFloating(notif.text, notif.color);
      }
      this.notify();
      return;
    }

    if (tile.type === 'door_iron') {
      const check = this.checkGuardedIronDoor(targetX, targetY);
      if (!check.canOpen) {
        sound.playError();
        if (onFloating && check.reason) {
          onFloating(check.reason, '#ef4444');
        }
        this.notify();
        return;
      }

      // 铁门 / 机关门开启
      sound.playDoor();
      floor.layout[targetY][targetX] = { type: 'floor' };
      if (onTileChange) onTileChange(targetX, targetY, true);
      this.playerPos.x = targetX;
      this.playerPos.y = targetY;
      const notif = getDoorNotification('iron', true, this.language);
      if (onFloating) onFloating(notif.text, notif.color);
      this.notify();
      return;
    }

    // 4. 拾取道具
    if (tile.type === 'item' && tile.itemType) {
      this.collectItem(tile.itemType, targetX, targetY, onTileChange, onFloating);
      return;
    }

    // 5. 挑战怪物
    if (tile.type === 'monster' && tile.monsterId) {
      this.fightMonster(tile.monsterId, targetX, targetY, onTileChange, onFloating);
      return;
    }

    // 6. 楼梯跳转 (上楼 / 下楼)
    if (tile.type === 'stairs_up') {
      this.changeFloor(this.currentFloor + 1, 'up');
      return;
    }
    if (tile.type === 'stairs_down') {
      this.changeFloor(this.currentFloor - 1, 'down');
      return;
    }

    // 7. 祈祷祭坛（商店）
    if (tile.type === 'shop') {
      sound.playShop();
      this.isShopOpen = true;
      this.notify();
      return;
    }

    // 8. NPC 对话与经验老人
    if (tile.type === 'npc' && tile.npcId) {
      if (tile.npcId === 'elder_exp') {
        sound.playShop();
        this.isExpShopOpen = true;
        this.notify();
        return;
      }
      this.triggerNPC(tile.npcId, targetX, targetY);
      return;
    }
  }

  // 拾取道具逻辑
  private collectItem(
    itemType: ItemType,
    targetX: number,
    targetY: number,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ) {
    const floor = this.getCurrentFloorData();
    floor.layout[targetY][targetX] = { type: 'floor' };
    if (onTileChange) onTileChange(targetX, targetY, false);

    this.playerPos.x = targetX;
    this.playerPos.y = targetY;

    // 钥匙
    if (itemType === 'key_yellow') {
      this.playerStats.yellowKeys++;
      sound.playItem();
    } else if (itemType === 'key_blue') {
      this.playerStats.blueKeys++;
      sound.playItem();
    } else if (itemType === 'key_red') {
      this.playerStats.redKeys++;
      sound.playItem();
    }
    // 药水
    else if (itemType === 'potion_red') {
      this.playerStats.hp += 200;
      sound.playPotion();
    } else if (itemType === 'potion_blue') {
      this.playerStats.hp += 500;
      sound.playPotion();
    } else if (itemType === 'holy_water') {
      this.playerStats.hp *= 2;
      sound.playPotion();
    }
    // 宝石
    else if (itemType === 'gem_red') {
      this.playerStats.atk += 3;
      sound.playGem();
    } else if (itemType === 'gem_blue') {
      this.playerStats.def += 3;
      sound.playGem();
    }
    // 装备武器
    else if (itemType === 'sword_iron') {
      this.playerStats.atk += 10;
      this.playerStats.weapon = '铁剑';
      sound.playVictory();
    } else if (itemType === 'sword_silver') {
      this.playerStats.atk += 20;
      this.playerStats.weapon = '银剑';
      sound.playVictory();
    } else if (itemType === 'sword_knight') {
      this.playerStats.atk += 40;
      this.playerStats.weapon = '骑士剑';
      sound.playVictory();
    } else if (itemType === 'sword_holy') {
      this.playerStats.atk += 100;
      this.playerStats.weapon = '圣光之剑';
      sound.playVictory();
    } else if (itemType === 'sword_sacred') {
      this.playerStats.atk += 150;
      this.playerStats.weapon = '神圣神剑';
      sound.playVictory();
    } else if (itemType === 'sword_dragon') {
      this.playerStats.atk += 100;
      this.playerStats.weapon = '屠龙之刃';
      sound.playVictory();
    }
    // 装备盾牌
    else if (itemType === 'shield_iron') {
      this.playerStats.def += 10;
      this.playerStats.shield = '铁盾';
      sound.playVictory();
    } else if (itemType === 'shield_silver') {
      this.playerStats.def += 20;
      this.playerStats.shield = '银盾';
      sound.playVictory();
    } else if (itemType === 'shield_knight') {
      this.playerStats.def += 40;
      this.playerStats.shield = '骑士盾';
      sound.playVictory();
    } else if (itemType === 'shield_holy') {
      this.playerStats.def += 100;
      this.playerStats.shield = '圣光之盾';
      sound.playVictory();
    } else if (itemType === 'shield_sacred') {
      this.playerStats.def += 150;
      this.playerStats.shield = '神圣神盾';
      sound.playVictory();
    }
    // 神器与消耗道具
    else if (itemType === 'key_gold') {
      this.playerStats.yellowKeys += 1;
      this.playerStats.blueKeys += 1;
      this.playerStats.redKeys += 1;
      sound.playVictory();
    } else if (itemType === 'cross') {
      this.playerStats.inventory.cross = 1;
      sound.playVictory();
    } else if (itemType === 'monster_manual') {
      this.playerStats.inventory.monster_manual = 1;
      sound.playItem();
    } else if (itemType === 'compass') {
      this.playerStats.inventory.compass = 1;
      sound.playItem();
    } else if (itemType === 'lucky_coin') {
      this.playerStats.inventory.lucky_coin = 1;
      sound.playVictory();
    } else if (itemType === 'snow_crystal') {
      this.playerStats.inventory.snow_crystal = 1;
      sound.playVictory();
    } else if (itemType === 'notepad') {
      this.playerStats.inventory.notepad = 1;
      sound.playItem();
    } else if (itemType === 'pickaxe') {
      this.playerStats.inventory.pickaxe = (this.playerStats.inventory.pickaxe || 0) + 1;
      sound.playItem();
    } else if (itemType === 'bomb') {
      this.playerStats.inventory.bomb = (this.playerStats.inventory.bomb || 0) + 1;
      sound.playItem();
    } else if (itemType === 'earthquake') {
      this.playerStats.inventory.earthquake = (this.playerStats.inventory.earthquake || 0) + 1;
      sound.playVictory();
    } else if (itemType === 'down_fly') {
      this.playerStats.inventory.down_fly = (this.playerStats.inventory.down_fly || 0) + 1;
      sound.playItem();
    } else if (itemType === 'up_fly') {
      this.playerStats.inventory.up_fly = (this.playerStats.inventory.up_fly || 0) + 1;
      sound.playItem();
    } else if (itemType === 'center_fly') {
      this.playerStats.inventory.center_fly = (this.playerStats.inventory.center_fly || 0) + 1;
      sound.playItem();
    }

    const notif = getPickupNotification(itemType, this.language);
    if (onFloating && notif.text) {
      onFloating(notif.text, notif.color);
    }
    this.notify();
  }

  // 战斗挑战怪物
  private fightMonster(
    monsterId: string,
    targetX: number,
    targetY: number,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ) {
    const monster = MONSTERS[monsterId];
    if (!monster) return;

    // 49F 假魔王十字魔法结界保护：必须先消灭上(5,2)、下(5,4)、左(4,3)、右(6,3)四名魔法警卫破除封印
    if (this.currentFloor === 49 && monsterId === 'false_sorcerer') {
      const crossGuards = [
        { x: 5, y: 2 }, // 上
        { x: 5, y: 4 }, // 下
        { x: 4, y: 3 }, // 左
        { x: 6, y: 3 }, // 右
      ];
      const floor = this.getCurrentFloorData();
      const hasAliveCrossGuard = crossGuards.some((g) => this.isGuardAlive(floor.layout, g.x, g.y));
      if (hasAliveCrossGuard) {
        sound.playError();
        const text = this.language === 'zh'
          ? '🛡️ 假魔王受到十字魔法阵庇护，结界未除无法破防！请先消灭上、下、左、右四方向魔法警卫！'
          : '🛡️ The False Sorcerer is protected by the cross magic barrier! Defeat the four magic guards around him first!';
        if (onFloating) onFloating(text, '#f43f5e', 4000);
        this.notify();
        return;
      }
    }

    const calc = calculateBattle(this.playerStats, monster, Boolean(this.playerStats.inventory.cross));

    // 无法破防
    if (!calc.canFight) {
      sound.playError();
      const notif = getCombatNotification('cannot_pierce', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color, 3200);
      this.notify();
      return;
    }

    // 生命值不足
    if (this.playerStats.hp <= calc.damage) {
      sound.playError();
      const notif = getCombatNotification('low_hp', { damage: calc.damage }, this.language);
      if (onFloating) onFloating(notif.text, notif.color, 3200);
      this.notify();
      return;
    }

    // 结算扣血与奖赏 (持有幸运金币时收益翻倍)
    const goldMultiplier = this.playerStats.inventory.lucky_coin ? 2 : 1;
    const earnedGold = monster.gold * goldMultiplier;

    this.playerStats.hp -= calc.damage;
    this.playerStats.gold += earnedGold;
    this.playerStats.exp += monster.exp;

    // 清除怪物
    const floor = this.getCurrentFloorData();
    if (this.currentFloor === 15 && monsterId === 'giant_squid') {
      // 15F 深渊大乌贼横跨 3 格走廊 (x=4, 5, 6)，击溃后全廊消散畅通
      for (const sx of [4, 5, 6]) {
        floor.layout[4][sx] = { type: 'floor' };
        if (onTileChange) onTileChange(sx, 4, false);
      }
    } else {
      floor.layout[targetY][targetX] = { type: 'floor' };
      if (onTileChange) onTileChange(targetX, targetY, false);
    }

    this.playerPos.x = targetX;
    this.playerPos.y = targetY;

    sound.playAttack();
    if (onFloating) {
      if (calc.damage === 0) {
        const notif = getCombatNotification('win_flawless', { gold: earnedGold }, this.language);
        onFloating(notif.text, notif.color, 2600);
      } else {
        const notif = getCombatNotification('win_damage', { damage: calc.damage, gold: earnedGold }, this.language);
        onFloating(notif.text, notif.color, 2600);
      }
    }

    // 特殊首领战利与剧情 (充裕停留时长 4.5s ~ 5s，确保玩家静心阅览)
    let bossHandledDoor = false;
    if (monsterId === 'giant_squid') {
      sound.playVictory();
      const notif = {
        text: this.language === 'zh' ? '深渊巨怪大乌贼已被消灭！走廊畅通！' : 'Giant Squid defeated! The hallway is clear!',
        color: '#38bdf8',
      };
      if (onFloating) onFloating(notif.text, notif.color, 4500);
    } else if (monsterId === 'skeleton_captain') {
      sound.playVictory();
      const notif = getCombatNotification('boss_skeleton', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color, 4500);
    } else if (monsterId === 'vampire') {
      sound.playVictory();
      bossHandledDoor = true;
      const notif = getCombatNotification('boss_vampire', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color, 4500);
    } else if (monsterId === 'dragon') {
      sound.playVictory();
      bossHandledDoor = true;
      this.playerStats.inventory.snow_crystal = 1;
      const text = this.language === 'zh'
        ? '🐉 远古魔龙已被诛灭！获得传说秘宝【冰冻雪花】！可前往13层与26层冻结炽热熔岩！'
        : '🐉 Ancient Dragon defeated! Obtained legendary [Frost Snowflake]! Lava on 13F & 26F can now be frozen!';
      if (onFloating) onFloating(text, '#38bdf8', 5000);
    } else if (monsterId === 'archmage') {
      sound.playVictory();
      bossHandledDoor = true;
      this.playerStats.redKeys += 4;
      const text = this.language === 'zh'
        ? '🔮 红衣大法师被消灭！获得红钥匙 x4！通往 26 层的铁门开启！'
        : '🔮 Archmage defeated! Obtained 4 Red Keys! The iron gate to 26F opens!';
      if (onFloating) onFloating(text, '#f43f5e', 4500);
    } else if (monsterId === 'false_sorcerer') {
      sound.playVictory();
      bossHandledDoor = true;
      this.playerStats.redKeys += 1;
      const text = this.language === 'zh'
        ? '👑 假魔王被消灭！获得红钥匙 x1！通往 50F 魔塔之巅的圣门开启！'
        : '👑 False Sorcerer defeated! Obtained 1 Red Key! The gate to 50F opens!';
      if (onFloating) onFloating(text, '#be123c', 4500);
    } else if (monsterId === 'demon_lord') {
      sound.playVictory();
      this.isVictory = true;
      const notif = getCombatNotification('boss_demon', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color, 5000);
    }

    // 击败怪物后检查联动开启机关铁门 (吸血鬼等首领通报已自带开门剧情，无需冗余派发第二张提示框)
    this.checkPostBattleGuardedDoors(targetX, targetY, onTileChange, onFloating, bossHandledDoor);

    // 判定濒死
    if (this.playerStats.hp <= 0) {
      this.isGameOver = true;
    }

    this.notify();
  }

  /** 指定守卫是否仍存活 */
  private isGuardAlive(layout: (Tile | null)[][], x: number, y: number): boolean {
    const tile = layout[y]?.[x];
    return Boolean(tile && tile.type === 'monster');
  }

  // 检查机关铁门是否受到守卫封锁（全塔统一规则表）
  public checkGuardedIronDoor(targetX: number, targetY: number): { canOpen: boolean; reason?: string } {
    const rule = findIronDoorRule(this.currentFloor, targetX, targetY);
    if (!rule) {
      // 未登记的铁门一律不可开启，避免“白嫖”通行
      return {
        canOpen: false,
        reason: this.language === 'zh'
          ? '这扇机关铁门无法开启！'
          : 'This iron gate cannot be opened!',
      };
    }

    const floor = this.getCurrentFloorData();
    const anyAlive = rule.guards.some((g) => this.isGuardAlive(floor.layout, g.x, g.y));
    if (anyAlive) {
      return {
        canOpen: false,
        reason: this.language === 'zh' ? rule.reasonZh : rule.reasonEn,
      };
    }

    return { canOpen: true };
  }

  // 击败怪物后：扫描本层全部铁门规则，守卫清空则自动开启
  private checkPostBattleGuardedDoors(
    _targetX: number,
    _targetY: number,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void,
    suppressDoorFloating?: boolean
  ) {
    const floor = this.getCurrentFloorData();
    const rules = getIronDoorRulesForFloor(this.currentFloor);
    const openedMessages = new Set<string>();

    for (const rule of rules) {
      if (floor.layout[rule.doorY]?.[rule.doorX]?.type !== 'door_iron') continue;
      const anyAlive = rule.guards.some((g) => this.isGuardAlive(floor.layout, g.x, g.y));
      if (anyAlive) continue;

      floor.layout[rule.doorY][rule.doorX] = { type: 'floor' };
      if (onTileChange) onTileChange(rule.doorX, rule.doorY, true);

      const msg = this.language === 'zh' ? rule.openZh : rule.openEn;
      openedMessages.add(msg);
    }

    if (openedMessages.size > 0) {
      sound.playDoor();
      if (onFloating && !suppressDoorFloating) {
        for (const msg of openedMessages) {
          onFloating(msg, '#fbbf24', 4200);
        }
      }
    }
  }

  // 跨楼层切换
  public changeFloor(targetFloor: number, fromDir: 'up' | 'down') {
    if (targetFloor < 0 || targetFloor > 50) return;

    this.currentFloor = targetFloor;
    this.exploredFloors.add(targetFloor);

    const fData = this.getCurrentFloorData();
    // 确定出生在新楼层哪个楼梯口
    if (fromDir === 'up') {
      this.playerPos.x = fData.downStairsPos.x;
      this.playerPos.y = fData.downStairsPos.y;
    } else {
      this.playerPos.x = fData.upStairsPos.x;
      this.playerPos.y = fData.upStairsPos.y;
    }

    sound.playStairs();
    this.notify();
  }

  // 触发 NPC 剧情对话
  public triggerNPC(npcId: string, targetX?: number, targetY?: number) {
    if (npcId === 'old_man_manual') {
      this.playerStats.inventory.monster_manual = 1;
    }

    const hadGiftAlready = (npcId === 'elder' || (npcId === 'thief' && this.currentFloor === 29))
      ? !!this.elderGiftsGiven[`${npcId}_${this.currentFloor}f`]
      : false;

    // 1F 智慧老人赠送新手黄钥匙 x1
    if (npcId === 'elder' && this.currentFloor === 1 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_1f'] = true;
      this.playerStats.yellowKeys += 1;
      sound.playItem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送黄钥匙 x1' : 'Wise Sage gifted Yellow Key x1',
        '#eab308'
      );
    }

    // 2F 地牢智慧老人被救报恩赠送 300 金币 (资助勇士初期在神坛加点与购买物资)
    if (npcId === 'elder' && this.currentFloor === 2 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_2f'] = true;
      this.playerStats.gold += 300;
      sound.playShop();
      this.addNotification(
        this.language === 'zh' ? '智慧老人获救答谢赠送 300 金币！' : 'Rescued Wise Sage gifted 300 Gold!',
        '#f59e0b'
      );
    }

    // 4F 智慧老人赠送初级红药水 (生命+200，维持勇士初期血线)
    if (npcId === 'elder' && this.currentFloor === 4 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_4f'] = true;
      this.playerStats.hp += 200;
      sound.playPotion();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送初级红药水 (生命+200)' : 'Wise Sage gifted Red Potion (HP +200)',
        '#ef4444'
      );
    }

    // 7F 智慧老人赠送蓝宝石 x1 (提升 3 点防御力，实践战斗临界点教学)
    if (npcId === 'elder' && this.currentFloor === 7 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_7f'] = true;
      this.playerStats.def += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送蓝宝石 x1 (防御力+3)' : 'Wise Sage gifted Blue Gem x1 (DEF +3)',
        '#38bdf8'
      );
    }

    // 9F 智慧老人赠送红宝石 x1 (提升 3 点攻击力，指点右侧暗道铁盾)
    if (npcId === 'elder' && this.currentFloor === 9 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_9f'] = true;
      this.playerStats.atk += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送红宝石 x1 (攻击力+3)' : 'Wise Sage gifted Red Gem x1 (ATK +3)',
        '#f43f5e'
      );
    }

    // 12F 智慧老人资助 300 金币与蓝宝石 x1 (资助勇士强化自身与向商人购买特惠红钥匙)
    if (npcId === 'elder' && this.currentFloor === 12 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_12f'] = true;
      this.playerStats.gold += 300;
      this.playerStats.def += 3;
      sound.playShop();
      this.addNotification(
        this.language === 'zh'
          ? '智慧老人资助 300 金币与蓝宝石 x1 (防御力+3)！'
          : 'Wise Sage sponsored 300 Gold & Blue Gem x1 (DEF +3)!',
        '#f59e0b'
      );
    }

    // 15F 智慧老人赠送高级蓝药水 (生命+500，助阵迎战大乌贼)
    if (npcId === 'elder' && this.currentFloor === 15 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_15f'] = true;
      this.playerStats.hp += 500;
      sound.playPotion();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送高级蓝药水 (生命+500)' : 'Wise Sage gifted Blue Potion (HP +500)',
        '#3b82f6'
      );
    }

    // 16F 智慧老人赠送红宝石 x1 (攻击力+3，红钥匙密令提示)
    if (npcId === 'elder' && this.currentFloor === 16 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_16f'] = true;
      this.playerStats.atk += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送红宝石 x1 (攻击力+3)' : 'Wise Sage gifted Red Gem x1 (ATK +3)',
        '#f43f5e'
      );
    }

    // 18F 智慧老人赠送红宝石 x1 (攻击力+3，助勇士斩开石头人护甲)
    if (npcId === 'elder' && this.currentFloor === 18 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_18f'] = true;
      this.playerStats.atk += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送红宝石 x1 (攻击力+3)' : 'Wise Sage gifted Red Gem x1 (ATK +3)',
        '#f43f5e'
      );
    }

    // 21F 智慧老人赠送高级蓝药水 (生命+500，踏入熔岩要塞)
    if (npcId === 'elder' && this.currentFloor === 21 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_21f'] = true;
      this.playerStats.hp += 500;
      sound.playPotion();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送高级蓝药水 (生命+500)' : 'Wise Sage gifted Blue Potion (HP +500)',
        '#3b82f6'
      );
    }

    // 24F 智慧老人赠送蓝宝石 x1 (防御力+3，25层决战红衣法师前护甲加固)
    if (npcId === 'elder' && this.currentFloor === 24 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_24f'] = true;
      this.playerStats.def += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送蓝宝石 x1 (防御力+3)' : 'Wise Sage gifted Blue Gem x1 (DEF +3)',
        '#38bdf8'
      );
    }

    // 29F 小偷勘探暗道报恩赠送黄色钥匙 x2
    if (npcId === 'thief' && this.currentFloor === 29 && !hadGiftAlready) {
      this.elderGiftsGiven['thief_29f'] = true;
      this.playerStats.yellowKeys += 2;
      sound.playItem();
      this.addNotification(
        this.language === 'zh' ? '小偷赠送黄色钥匙 x2' : 'Thief gifted Yellow Keys x2',
        '#eab308'
      );
    }

    // 31F 智慧老人赠送蓝宝石 x1 (防御力+3，防备双手剑士)
    if (npcId === 'elder' && this.currentFloor === 31 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_31f'] = true;
      this.playerStats.def += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送蓝宝石 x1 (防御力+3)' : 'Wise Sage gifted Blue Gem x1 (DEF +3)',
        '#38bdf8'
      );
    }

    // 33F 智慧老人赠送红宝石 x1 (攻击力+3，指点骑士剑暗室)
    if (npcId === 'elder' && this.currentFloor === 33 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_33f'] = true;
      this.playerStats.atk += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送红宝石 x1 (攻击力+3)' : 'Wise Sage gifted Red Gem x1 (ATK +3)',
        '#f43f5e'
      );
    }

    // 36F 智慧老人赠送高级蓝药水 (生命+500，封印迷宫恢复元气)
    if (npcId === 'elder' && this.currentFloor === 36 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_36f'] = true;
      this.playerStats.hp += 500;
      sound.playPotion();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送高级蓝药水 (生命+500)' : 'Wise Sage gifted Blue Potion (HP +500)',
        '#3b82f6'
      );
    }

    // 37F 智慧老人赠送蓝宝石 x1 (防御力+3，抵御坚不可摧宝库守卫)
    if (npcId === 'elder' && this.currentFloor === 37 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_37f'] = true;
      this.playerStats.def += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送蓝宝石 x1 (防御力+3)' : 'Wise Sage gifted Blue Gem x1 (DEF +3)',
        '#38bdf8'
      );
    }

    // 38F 智慧老人赠送高级蓝药水 (生命+500，骑士盾看守挑战)
    if (npcId === 'elder' && this.currentFloor === 38 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_38f'] = true;
      this.playerStats.hp += 500;
      sound.playPotion();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送高级蓝药水 (生命+500)' : 'Wise Sage gifted Blue Potion (HP +500)',
        '#3b82f6'
      );
    }

    // 39F 智慧老人赠送蓝色钥匙 x1 (助勇士开启3点钟飞行密宝)
    if (npcId === 'elder' && this.currentFloor === 39 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_39f'] = true;
      this.playerStats.blueKeys += 1;
      sound.playItem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送蓝色钥匙 x1' : 'Wise Sage gifted Blue Key x1',
        '#3b82f6'
      );
    }

    // 41F 智慧老人赠送红宝石 x1 (攻击力+3，四区天界神圣洗礼)
    if (npcId === 'elder' && this.currentFloor === 41 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_41f'] = true;
      this.playerStats.atk += 3;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送红宝石 x1 (攻击力+3)' : 'Wise Sage gifted Red Gem x1 (ATK +3)',
        '#f43f5e'
      );
    }

    // 45F 智慧老人赠送高级蓝药水 (生命+500，天界回音与向上飞行器)
    if (npcId === 'elder' && this.currentFloor === 45 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_45f'] = true;
      this.playerStats.hp += 500;
      sound.playPotion();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送高级蓝药水 (生命+500)' : 'Wise Sage gifted Blue Potion (HP +500)',
        '#3b82f6'
      );
    }

    // 46F 智慧老人资助 500 金币 (终极神坛前毕生积蓄)
    if (npcId === 'elder' && this.currentFloor === 46 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_46f'] = true;
      this.playerStats.gold += 500;
      sound.playShop();
      this.addNotification(
        this.language === 'zh' ? '智慧老人资助 500 金币！' : 'Wise Sage sponsored 500 Gold!',
        '#f59e0b'
      );
    }

    // 47F 智慧老人赠送红宝石 x2 (攻击力+6，圣光之剑前序洗礼)
    if (npcId === 'elder' && this.currentFloor === 47 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_47f'] = true;
      this.playerStats.atk += 6;
      sound.playGem();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送红宝石 x2 (攻击力+6)' : 'Wise Sage gifted Red Gems x2 (ATK +6)',
        '#f43f5e'
      );
    }

    // 48F 智慧老人赠送神圣圣水 (生命+1000，神圣神剑宝库佑护)
    if (npcId === 'elder' && this.currentFloor === 48 && !hadGiftAlready) {
      this.elderGiftsGiven['elder_48f'] = true;
      this.playerStats.hp += 1000;
      sound.playVictory();
      this.addNotification(
        this.language === 'zh' ? '智慧老人赠送神圣圣水 (生命+1000)' : 'Wise Sage gifted Holy Water (HP +1000)',
        '#38bdf8'
      );
    }

    const tradeId = (npcId === 'trader' || npcId === 'merchant') ? `trader_${this.currentFloor}f` : undefined;
    const isBought = tradeId ? !!this.tradersBought[tradeId] : false;

    const dlg = getDialogueData(npcId, this.language, this.currentFloor, isBought, hadGiftAlready);
    if (dlg) {
      this.activeDialogue = {
        name: dlg.name,
        avatar: dlg.avatar,
        lines: [...dlg.lines],
        currentIndex: 0,
        npcId,
        targetPos: targetX !== undefined && targetY !== undefined ? { x: targetX, y: targetY } : undefined,
        trade: dlg.trade,
      };
      this.isDialogueOpen = true;
      this.notify();
    }
  }

  // 执行商人道具购买
  public buyTraderItem(tradeId: string): boolean {
    const offer = TRADER_FLOOR_OFFERS[this.currentFloor];
    if (!offer || offer.tradeId !== tradeId) return false;

    if (this.playerStats.gold < offer.costGold) {
      sound.playError();
      const missText =
        this.language === 'zh'
          ? `金币不足！需要 ${offer.costGold} 金币，当前拥有 ${this.playerStats.gold} 金币`
          : `Not enough gold! Requires ${offer.costGold} Gold, currently have ${this.playerStats.gold}`;
      this.addNotification(missText, '#f87171');
      return false;
    }

    this.playerStats.gold -= offer.costGold;
    if (offer.itemType === 'key_blue') {
      this.playerStats.blueKeys += offer.count;
    } else if (offer.itemType === 'key_yellow') {
      this.playerStats.yellowKeys += offer.count;
    } else if (offer.itemType === 'key_red') {
      this.playerStats.redKeys += offer.count;
    }

    this.tradersBought[tradeId] = true;
    sound.playItem();

    const notifText =
      this.language === 'zh'
        ? `获得 ${offer.title.zh}，消耗 ${offer.costGold} 金币`
        : `Obtained ${offer.title.en}, spent ${offer.costGold} Gold`;
    this.addNotification(notifText, '#38bdf8');

    // 立即刷新当前对话窗口，展示商人答谢台词与独家重要情报
    if (this.activeDialogue) {
      this.activeDialogue.lines = [...offer.linesAfter[this.language]];
      this.activeDialogue.currentIndex = 0;
      if (this.activeDialogue.trade) {
        this.activeDialogue.trade.isBought = true;
      }
    }

    this.notify();
    return true;
  }

  // 关闭 / 完成 NPC 剧情对话（触发后续剧情：如仙女指引完毕后隐去）
  public closeDialogue(onTileChange?: (x: number, y: number, isDoor: boolean) => void) {
    if (this.activeDialogue) {
      const { npcId, targetPos } = this.activeDialogue;
      // 仙女交谈完毕后消失
      if (npcId === 'fairy') {
        const floor = this.getCurrentFloorData();
        const fx = targetPos ? targetPos.x : 5;
        const fy = targetPos ? targetPos.y : 2;
        if (floor.layout[fy]?.[fx]?.type === 'npc') {
          floor.layout[fy][fx] = { type: 'floor' };
          if (onTileChange) {
            onTileChange(fx, fy, false);
          }
        }
      }
      this.activeDialogue = null;
    }
    this.isDialogueOpen = false;
    this.notify();
  }

  // 祭坛加点购买计算
  public getShopCost(): number {
    // 价格公式：20 + 10 * n * (n - 1)
    const n = this.shopTimes;
    return 20 + 10 * n * (n - 1);
  }

  // 祭坛加点属性收益（根据楼层分区提升）
  public getShopGain() {
    if (this.currentFloor <= 10) {
      return { hp: 800, atk: 4, def: 4 };
    } else if (this.currentFloor <= 20) {
      return { hp: 4000, atk: 20, def: 20 };
    } else if (this.currentFloor <= 40) {
      return { hp: 10000, atk: 40, def: 40 };
    } else {
      return { hp: 20000, atk: 80, def: 80 };
    }
  }

  // 执行祭坛加点
  public buyShopUpgrade(type: 'hp' | 'atk' | 'def'): boolean {
    const cost = this.getShopCost();
    if (this.playerStats.gold < cost) {
      sound.playError();
      return false;
    }

    this.playerStats.gold -= cost;
    const gain = this.getShopGain();

    if (type === 'hp') this.playerStats.hp += gain.hp;
    if (type === 'atk') this.playerStats.atk += gain.atk;
    if (type === 'def') this.playerStats.def += gain.def;

    this.shopTimes++;
    sound.playShop();
    this.notify();
    return true;
  }

  // 经验老人加点配置（按楼层大区梯度递进）
  public getExpUpgradeGain() {
    if (this.currentFloor <= 10) {
      return {
        costAtk: 30, atk: 5,
        costDef: 30, def: 5,
        costHp: 100, hp: 1000,
        costLevel: 100, levelGain: { hp: 1000, atk: 7, def: 7 },
      };
    } else if (this.currentFloor <= 20) {
      return {
        costAtk: 90, atk: 17,
        costDef: 90, def: 17,
        costHp: 270, hp: 3500,
        costLevel: 280, levelGain: { hp: 3500, atk: 22, def: 22 },
      };
    } else if (this.currentFloor <= 40) {
      return {
        costAtk: 270, atk: 55,
        costDef: 270, def: 55,
        costHp: 800, hp: 12000,
        costLevel: 850, levelGain: { hp: 12000, atk: 70, def: 70 },
      };
    } else {
      return {
        costAtk: 800, atk: 160,
        costDef: 800, def: 160,
        costHp: 2400, hp: 35000,
        costLevel: 2500, levelGain: { hp: 35000, atk: 200, def: 200 },
      };
    }
  }

  // 执行经验修行加点
  public buyExpUpgrade(type: 'hp' | 'atk' | 'def' | 'level'): boolean {
    const gain = this.getExpUpgradeGain();
    let cost = 0;
    if (type === 'hp') cost = gain.costHp;
    if (type === 'atk') cost = gain.costAtk;
    if (type === 'def') cost = gain.costDef;
    if (type === 'level') cost = gain.costLevel;

    if (this.playerStats.exp < cost) {
      sound.playError();
      return false;
    }

    this.playerStats.exp -= cost;

    if (type === 'hp') this.playerStats.hp += gain.hp;
    if (type === 'atk') this.playerStats.atk += gain.atk;
    if (type === 'def') this.playerStats.def += gain.def;
    if (type === 'level') {
      this.playerStats.hp += gain.levelGain.hp;
      this.playerStats.atk += gain.levelGain.atk;
      this.playerStats.def += gain.levelGain.def;
    }

    sound.playShop();
    this.notify();
    return true;
  }

  // 存档与读档系统
  public saveGame(slotId: number = 1): boolean {
    try {
      const floorStates: { [floorNum: number]: (Tile | null)[][] } = {};
      this.floorCache.forEach((layout, fNum) => {
        floorStates[fNum] = layout;
      });

      const slot: SaveSlot = {
        slotId,
        timestamp: new Date().toLocaleString(),
        floor: this.currentFloor,
        stats: JSON.parse(JSON.stringify(this.playerStats)),
        playerPos: { ...this.playerPos },
        floorStates,
        shopTimes: this.shopTimes,
        tradersBought: { ...this.tradersBought },
        elderGiftsGiven: { ...this.elderGiftsGiven },
      };

      localStorage.setItem(`mota3d_save_${slotId}`, JSON.stringify(slot));
      sound.playVictory();
      this.notify();
      return true;
    } catch (e) {
      console.error('Save failed', e);
      return false;
    }
  }

  public loadGame(slotId: number = 1): boolean {
    try {
      const data = localStorage.getItem(`mota3d_save_${slotId}`);
      if (!data) return false;
      const slot: SaveSlot = JSON.parse(data);

      this.playerStats = slot.stats;
      this.currentFloor = slot.floor;
      this.playerPos = slot.playerPos;
      this.shopTimes = slot.shopTimes || 0;
      this.tradersBought = slot.tradersBought ? { ...slot.tradersBought } : {};
      this.elderGiftsGiven = slot.elderGiftsGiven ? { ...slot.elderGiftsGiven } : {};

      this.floorCache.clear();
      for (const fNum in slot.floorStates) {
        this.floorCache.set(Number(fNum), slot.floorStates[fNum]);
      }
      this.exploredFloors.add(this.currentFloor);

      sound.playStairs();
      this.notify();
      return true;
    } catch (e) {
      console.error('Load failed', e);
      return false;
    }
  }
}
