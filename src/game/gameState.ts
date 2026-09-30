import { Direction, ItemType, PlayerStats, Tile, SaveSlot, MoveCommand } from '../types/game';
import { ALL_FLOORS, getFloor } from '../data/floors';
import { MONSTERS } from '../data/monsters';
import { ITEMS } from '../data/items';
import { calculateBattle } from './combat';
import { sound } from '../audio/sound';
import {
  Language,
  getDialogueData,
  getPickupNotification,
  getDoorNotification,
  getCombatNotification,
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
    inventory: {},
  };

  // 当前位置与楼层 (经典 50 层魔塔开局直接登入 1 层南侧大门入口，0层为下楼器开启之地下密室)
  public currentFloor: number = 1;
  public playerPos: { x: number; y: number; dir: Direction } = { x: 5, y: 10, dir: 'up' };

  // 楼层缓存（记录修改后的地图）
  public floorCache: Map<number, (Tile | null)[][]> = new Map();
  public exploredFloors: Set<number> = new Set([1]);

  // 祭坛加点购买累计次数
  public shopTimes: number = 0;

  // 模态窗口状态
  public isMonsterManualOpen: boolean = false;
  public isFloorTeleportOpen: boolean = false;
  public isShopOpen: boolean = false;
  public isDialogueOpen: boolean = false;
  public isGameOver: boolean = false;
  public isVictory: boolean = false;
  public isDebugOpen: boolean = false;

  // 对话数据
  public activeDialogue: {
    name: string;
    avatar: string;
    lines: string[];
    currentIndex: number;
    npcId?: string;
  } | null = null;

  // 语言设置 (支持中文 'zh' 与英文 'en'，默认 'zh')
  public language: Language = 'zh';

  public setLanguage(lang: Language) {
    this.language = lang;
    if (this.activeDialogue && this.activeDialogue.npcId) {
      const dlg = getDialogueData(this.activeDialogue.npcId, lang);
      if (dlg) {
        this.activeDialogue.name = dlg.name;
        this.activeDialogue.lines = dlg.lines;
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
      inventory: {},
    };
    this.currentFloor = 1;
    this.playerPos = { x: 5, y: 10, dir: 'up' };
    this.shopTimes = 0;
    this.floorCache.clear();
    this.exploredFloors = new Set([1]);
    this.isGameOver = false;
    this.isVictory = false;

    // 默认加载第 1 层正统迷宫
    const f1 = getFloor(1);
    this.floorCache.set(1, f1.layout);
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
    onFloating?: (txt: string, col: string) => void
  ) {
    const targetDir = getRelativeDirection(this.playerPos.dir, action);
    return this.move(targetDir, onTileChange, onFloating);
  }

  // 综合移动指令处理 (WASD / 方向键)
  public moveByCommand(
    cmd: MoveCommand,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string) => void
  ) {
    let dir: Direction;
    if (cmd === 'up' || cmd === 'forward') dir = 'up';
    else if (cmd === 'down' || cmd === 'backward') dir = 'down';
    else if (cmd === 'left') dir = 'left';
    else dir = 'right';

    return this.move(dir, onTileChange, onFloating);
  }

  // 移动指令处理 (WASD / 方向键)
  public move(dir: Direction, onTileChange?: (x: number, y: number, isDoor: boolean) => void, onFloating?: (txt: string, col: string) => void) {
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
      // 铁门 / 机关门
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

    // 8. NPC 对话
    if (tile.type === 'npc' && tile.npcId) {
      this.triggerNPC(tile.npcId);
      return;
    }
  }

  // 拾取道具逻辑
  private collectItem(
    itemType: ItemType,
    targetX: number,
    targetY: number,
    onTileChange?: (x: number, y: number, isDoor: boolean) => void,
    onFloating?: (txt: string, col: string) => void
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
    onFloating?: (txt: string, col: string) => void
  ) {
    const monster = MONSTERS[monsterId];
    if (!monster) return;

    const calc = calculateBattle(this.playerStats, monster, Boolean(this.playerStats.inventory.cross));

    // 无法破防
    if (!calc.canFight) {
      sound.playError();
      const notif = getCombatNotification('cannot_pierce', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color);
      this.notify();
      return;
    }

    // 生命值不足
    if (this.playerStats.hp <= calc.damage) {
      sound.playError();
      const notif = getCombatNotification('low_hp', { damage: calc.damage }, this.language);
      if (onFloating) onFloating(notif.text, notif.color);
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
    floor.layout[targetY][targetX] = { type: 'floor' };
    if (onTileChange) onTileChange(targetX, targetY, false);

    this.playerPos.x = targetX;
    this.playerPos.y = targetY;

    sound.playAttack();
    if (onFloating) {
      if (calc.damage === 0) {
        const notif = getCombatNotification('win_flawless', { gold: earnedGold }, this.language);
        onFloating(notif.text, notif.color);
      } else {
        const notif = getCombatNotification('win_damage', { damage: calc.damage, gold: earnedGold }, this.language);
        onFloating(notif.text, notif.color);
      }
    }

    // 特殊首领战利与剧情
    if (monsterId === 'skeleton_captain') {
      sound.playVictory();
      const notif = getCombatNotification('boss_skeleton', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color);
    } else if (monsterId === 'vampire') {
      sound.playVictory();
      const notif = getCombatNotification('boss_vampire', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color);
    } else if (monsterId === 'demon_lord') {
      sound.playVictory();
      this.isVictory = true;
      const notif = getCombatNotification('boss_demon', {}, this.language);
      if (onFloating) onFloating(notif.text, notif.color);
    }

    // 判定濒死
    if (this.playerStats.hp <= 0) {
      this.isGameOver = true;
    }

    this.notify();
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
  private triggerNPC(npcId: string) {
    const dlg = getDialogueData(npcId, this.language);
    if (dlg) {
      if (npcId === 'old_man_manual') {
        this.playerStats.inventory.monster_manual = 1;
      }
      this.activeDialogue = {
        name: dlg.name,
        avatar: dlg.avatar,
        lines: dlg.lines,
        currentIndex: 0,
        npcId,
      };
      this.isDialogueOpen = true;
      this.notify();
    }
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
