import { Direction, ItemType, PlayerStats, Tile, SaveSlot, MoveCommand } from '../types/game';
import { ALL_FLOORS, getFloor, FLOOR_23_PUZZLE_TILES } from '../data/floors';
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

  // 23F 暗墙解谜与 0F 封印状态
  public isFloor23PuzzleSolved: boolean = false;
  public floor23VisitedTiles: Set<string> = new Set();

  // 39F 时钟解谜与中心对称飞行器状态
  public floor39Clock3Opened: boolean = false;
  public floor39Clock12Opened: boolean = false;
  public isFloor39PuzzleSolved: boolean = false;

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
    if (this.activeDialogue) {
      if (this.activeDialogue.npcId === 'item_center_fly') {
        this.activeDialogue.name = lang === 'zh' ? '秘宝【时空飞行器】' : 'Relic [Chrono Flyer]';
        this.activeDialogue.lines =
          lang === 'zh'
            ? [
                '你获得了稀世秘宝【时空飞行器】！\n\n此宝物蕴含超越维度的时空法则，使用后可将你瞬间传送至当前楼层的任意通畅地面。\n\n【特别注意】：此飞行器为【一次性消耗品】，使用后能量耗尽即损毁！请在左侧边栏深思熟虑后点击开启跃迁。',
              ]
            : [
                'You obtained the rare relic [Chrono Flyer]!\n\nImbued with transcendental spacetime magic, it teleports you to any open floor tile on the current level.\n\n[NOTICE]: This flyer is a ONE-TIME CONSUMABLE and will be destroyed upon use. Click the button in the left sidebar when ready.',
              ];
      } else if (this.activeDialogue.npcId === 'item_up_fly') {
        this.activeDialogue.name = lang === 'zh' ? '秘宝【向上飞行器】' : 'Relic [Up Flyer]';
        this.activeDialogue.lines =
          lang === 'zh'
            ? [
                '你获得了稀世秘宝【向上飞行器】！\n\n魔塔中隐藏着【44F 圣盾密室】，常规楼梯无法到达，必须在 43 层使用此飞行器方可突破结界直达 44 层获取至尊【神圣之盾】！\n\n【特别提示】：此道具为【一次性消耗品】，已在左侧栏就绪，请深思熟虑后点击使用。',
              ]
            : [
                'You obtained the rare relic [Up Flyer]!\n\nThe tower conceals the hidden [44F Holy Shield Vault]! You must use this flyer on Floor 43 to breach the spatial barrier and claim the legendary [Sacred Shield]!\n\n[NOTICE]: This flyer is a ONE-TIME CONSUMABLE. Click the button in the left sidebar when ready.',
              ];
      } else if (this.activeDialogue.npcId) {
        const tradeId = (this.activeDialogue.npcId === 'trader' || this.activeDialogue.npcId === 'merchant')
          ? `trader_${this.currentFloor}f`
          : undefined;
        const isBought = tradeId ? !!this.tradersBought[tradeId] : false;
        const hasGift = (this.activeDialogue.npcId === 'elder' || (this.activeDialogue.npcId === 'thief' && this.currentFloor === 29))
          ? !!this.elderGiftsGiven[`${this.activeDialogue.npcId}_${this.currentFloor}f`]
          : false;
        const hasShovel = Boolean(this.playerStats.inventory.thief_shovel);

        const dlg = getDialogueData(this.activeDialogue.npcId, lang, this.currentFloor, isBought, hasGift, hasShovel);
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
    this.isFloor23PuzzleSolved = false;
    this.floor23VisitedTiles.clear();
    this.floor39Clock3Opened = false;
    this.floor39Clock12Opened = false;
    this.isFloor39PuzzleSolved = false;

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
    onTileChange?: (x: number, y: number, isDoor: boolean, newTile?: Tile) => void,
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
    onTileChange?: (x: number, y: number, isDoor: boolean, newTile?: Tile) => void,
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
      this.checkFloor23PuzzleProgress(onFloating);
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
      // 29F 小偷暗道：必须先将小偷的铲子交还小偷完成开凿才能通过
      if (this.currentFloor === 29 && targetX === 5 && targetY === 2 && !this.elderGiftsGiven['thief_29f']) {
        sound.playError();
        if (onFloating) {
          const msg = this.playerStats.inventory.thief_shovel
            ? (this.language === 'zh'
                ? '暗道被坚硬巨石封堵，先将找到的铲子交给旁边的小偷吧！'
                : 'The tunnel is blocked by bedrock. Hand the shovel to the thief nearby!')
            : (this.language === 'zh'
                ? '前方的暗道被坚硬巨石封堵，先去询问旁边的小偷吧！'
                : 'The secret tunnel is blocked by bedrock. Inquire with the thief first!');
          onFloating(msg, '#ef4444');
        }
        this.notify();
        return;
      }

      // 暗墙撞击粉碎：墙体瓦解消失，但勇士原地未移动（需下一次前行才踏入）
      const hiddenItem = tile.itemType;
      const hiddenMonster = tile.monsterId;
      const newTile: Tile = hiddenItem
        ? { type: 'item', itemType: hiddenItem }
        : hiddenMonster
        ? { type: 'monster', monsterId: hiddenMonster }
        : { type: 'floor' };
      floor.layout[targetY][targetX] = newTile;

      if (onTileChange) onTileChange(targetX, targetY, false, newTile);
      sound.playDoor();

      // 勇士原地未移动，仅转向目标方向 (this.playerPos.dir 已在之前设置)

      if (hiddenItem) {
        const itemMsg = this.language === 'zh'
          ? (hiddenItem === 'thief_shovel'
              ? '暗墙粉碎！在暗道深处发现了小偷遗落的铁铲！'
              : '暗墙粉碎！发现了隐藏的宝物！')
          : (hiddenItem === 'thief_shovel'
              ? 'Secret wall shattered! The thief\'s lost shovel appeared in the deep passage!'
              : 'Secret wall shattered! A hidden treasure appeared!');
        if (onFloating) onFloating(itemMsg, '#fbbf24', 3500);
      } else if (hiddenMonster) {
        const monsterObj = MONSTERS[hiddenMonster];
        const monsterName = this.language === 'zh' ? monsterObj?.name : (monsterObj?.nameEn || monsterObj?.name);
        const monMsg = this.language === 'zh'
          ? `暗墙粉碎！深处潜伏的【${monsterName}】现身了！`
          : `Secret wall shattered! A hidden [${monsterName}] appeared!`;
        if (onFloating) onFloating(monMsg, '#f87171', 3000);
      } else {
        const secretMsg = this.language === 'zh' ? '发现密道！' : 'Secret path revealed!';
        if (onFloating) onFloating(secretMsg, '#38bdf8');
      }

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

        // 39F 时钟九宫格谜题判断
        if (this.currentFloor === 39) {
          this.checkFloor39ClockPuzzle(targetX, targetY, onTileChange, onFloating);
        }
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
    // 经典魔塔规则：44F 为隐藏楼层，43F 与 45F 之间的常规楼梯直接互通跳过 44F
    if (tile.type === 'stairs_up') {
      const nextFloor = this.currentFloor === 43 ? 45 : this.currentFloor + 1;
      this.changeFloor(nextFloor, 'up');
      return;
    }
    if (tile.type === 'stairs_down') {
      const prevFloor = this.currentFloor === 45 ? 43 : this.currentFloor - 1;
      this.changeFloor(prevFloor, 'down');
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

  // 检查 23F 踏足暗道点阵拼字进度
  public checkFloor23PuzzleProgress(
    onFloating?: (txt: string, col: string, duration?: number) => void,
    checkX?: number,
    checkY?: number
  ) {
    if (this.currentFloor !== 23) return;
    const curX = checkX !== undefined ? checkX : this.playerPos.x;
    const curY = checkY !== undefined ? checkY : this.playerPos.y;

    const isPuzzleTile = FLOOR_23_PUZZLE_TILES.some(
      (p) => p.x === curX && p.y === curY
    );
    if (!isPuzzleTile) return;

    this.floor23VisitedTiles.add(`${curX},${curY}`);
    if (!this.isFloor23PuzzleSolved) {
      const allSolved = FLOOR_23_PUZZLE_TILES.every((p) =>
        this.floor23VisitedTiles.has(`${p.x},${p.y}`)
      );
      if (allSolved) {
        this.isFloor23PuzzleSolved = true;
        sound.playVictory();
        const msg =
          this.language === 'zh'
            ? '你勘破暗道走出了【0F】印记！0层神秘金币大门的封印已解开！'
            : 'You revealed the [0F] crest! The seal on Floor 0\'s Gold Gate is broken!';
        this.addNotification(msg, '#fbbf24', 5000);
        if (onFloating) onFloating(msg, '#fbbf24', 5000);
      }
    }
  }

  // 检查 39F 时钟九宫格谜题进度
  public checkFloor39ClockPuzzle(
    x: number,
    y: number,
    onTileChange?: (x: number, y: number, isDoor: boolean, newTile?: Tile) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ) {
    if (this.currentFloor !== 39 || this.isFloor39PuzzleSolved) return;

    // 开启 3 点钟方向黄门 (5, 3)
    if (x === 5 && y === 3) {
      this.floor39Clock3Opened = true;
      if (!this.floor39Clock12Opened) {
        const msg =
          this.language === 'zh'
            ? '【3点钟】之门开启！时钟时针就位，时空阵法开始律动……'
            : '[3 o\'clock] gate opened! The hour hand aligns, chronomancy stirs...';
        if (onFloating) onFloating(msg, '#38bdf8', 3000);
      }
    }

    // 开启 12 点钟方向黄门 (3, 1)
    if (x === 3 && y === 1) {
      this.floor39Clock12Opened = true;
      if (!this.floor39Clock3Opened) {
        const msg =
          this.language === 'zh'
            ? '【12点钟】之门开启！分针高悬指向天顶，时空阵法开始律动……'
            : '[12 o\'clock] gate opened! The minute hand points upward, chronomancy stirs...';
        if (onFloating) onFloating(msg, '#38bdf8', 3000);
      }
    }

    // 两扇关键门均已开启 -> 触发解谜成功！在 (3, 3) 瓦解铁笼，显现时空飞行器
    if (this.floor39Clock3Opened && this.floor39Clock12Opened && !this.isFloor39PuzzleSolved) {
      this.isFloor39PuzzleSolved = true;
      sound.playVictory();
      const floor = this.getCurrentFloorData();
      const centerTile: Tile = { type: 'item', itemType: 'center_fly' };
      floor.layout[3][3] = centerTile;
      if (onTileChange) {
        onTileChange(3, 3, true, centerTile);
      }
      const winMsg =
        this.language === 'zh'
          ? '时针与分针指向 3:00 整！铁笼轰然解体，神圣秘宝【时空飞行器】现身！'
          : 'Clock hands lock at 3:00! The iron cage shatters, revealing the sacred [Chrono Flyer]!';
      this.addNotification(winMsg, '#facc15', 5000);
      if (onFloating) onFloating(winMsg, '#facc15', 5000);
    }
  }

  // 使用时空飞行器：瞬移至当前楼层的任意通畅地面
  public useFreeFly(
    destX: number,
    destY: number,
    onTileChange?: (x: number, y: number, isDoor: boolean, newTile?: Tile) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ): boolean {
    if (!this.playerStats.inventory.center_fly || this.playerStats.inventory.center_fly <= 0) {
      sound.playError();
      const msg = this.language === 'zh' ? '背包中没有时空飞行器！' : 'No Chrono Flyer in inventory!';
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    const curX = this.playerPos.x;
    const curY = this.playerPos.y;

    if (destX < 0 || destX > 10 || destY < 0 || destY > 10) {
      sound.playError();
      const msg = this.language === 'zh' ? '目标点超出地图范围！' : 'Destination out of bounds!';
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    if (destX === curX && destY === curY) {
      sound.playError();
      const msg = this.language === 'zh' ? '勇士已在当前位置！' : 'Already at current position!';
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    const floor = this.getCurrentFloorData();
    const destTile = floor.layout[destY]?.[destX];

    // 无法跳跃进入实心墙体、暗墙或熔岩
    if (
      !destTile ||
      destTile.type === 'wall' ||
      destTile.type === 'fake_wall' ||
      destTile.type === 'lava'
    ) {
      sound.playError();
      const msg = this.language === 'zh' ? '目标点为障碍物，无法安全着陆！' : 'Destination is blocked by obstacles!';
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    // 无法跳跃进入未开启的门
    if (destTile.type.startsWith('door_')) {
      sound.playError();
      const msg = this.language === 'zh' ? '目标点为封闭大门，无法直接穿越！' : 'Destination is a closed gate!';
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    // 无法跳跃进入怪物格
    if (destTile.type === 'monster') {
      sound.playError();
      const msg = this.language === 'zh' ? '目标点盘踞着凶恶怪物，无法安全着陆！' : 'Destination is occupied by a monster!';
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    // 一次性消耗品：消耗 1 次飞行器
    this.playerStats.inventory.center_fly--;
    if (this.playerStats.inventory.center_fly <= 0) {
      delete this.playerStats.inventory.center_fly;
    }

    // 瞬移位置
    this.playerPos.x = destX;
    this.playerPos.y = destY;
    sound.playVictory();

    const succMsg =
      this.language === 'zh'
        ? `时空跃迁成功！已瞬移至目标位置 (${destX}, ${destY})！（飞行器已消耗）`
        : `Chrono teleport success! Teleported to (${destX}, ${destY})! (Flyer consumed)`;
    if (onFloating) onFloating(succMsg, '#c084fc', 3500);

    // 如果目标点有道具，自动拾取
    if (destTile.type === 'item' && destTile.itemType) {
      this.collectItem(destTile.itemType, destX, destY, onTileChange, onFloating);
    }

    // 如果目标点是上下楼梯
    if (destTile.type === 'stairs_up') {
      const nextFloor = this.currentFloor === 43 ? 45 : this.currentFloor + 1;
      this.changeFloor(nextFloor, 'up');
    } else if (destTile.type === 'stairs_down') {
      const prevFloor = this.currentFloor === 45 ? 43 : this.currentFloor - 1;
      this.changeFloor(prevFloor, 'down');
    }

    this.notify();
    return true;
  }

  // 兼容调用：中心对称跃迁（封装自由传送）
  public useCenterFly(
    onTileChange?: (x: number, y: number, isDoor: boolean, newTile?: Tile) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ): boolean {
    const destX = 10 - this.playerPos.x;
    const destY = 10 - this.playerPos.y;
    return this.useFreeFly(destX, destY, onTileChange, onFloating);
  }

  /**
   * 使用【向上飞行器】：
   * 使勇士瞬间垂直上升一层。
   * 经典魔塔核心规则：
   * 1. 43F 使用可突破空间结界，升入隐藏的【44F 圣盾密室】（获取顶级防具神圣盾）
   * 2. 49F 受到假魔王魔法结界阻隔，无法飞跃至 50F
   * 3. 50F 已经是塔顶，无法向上飞行
   * 4. 消耗 1 个 up_fly
   */
  public useUpFly(
    onTileChange?: (x: number, y: number, isDoor: boolean, newTile?: Tile) => void,
    onFloating?: (txt: string, col: string, duration?: number) => void
  ): boolean {
    if (!this.playerStats.inventory.up_fly || this.playerStats.inventory.up_fly <= 0) {
      const msg = this.language === 'zh' ? '背包中没有向上飞行器！' : 'No Up Flyer in inventory!';
      this.addNotification(msg, '#ef4444');
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    if (this.currentFloor >= 50) {
      const msg =
        this.language === 'zh'
          ? '当前已是最高层（50F 魔塔之巅），无法向上飞行！'
          : 'Already on the highest floor (50F), cannot fly up!';
      this.addNotification(msg, '#ef4444');
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    if (this.currentFloor === 49) {
      const msg =
        this.language === 'zh'
          ? '49层魔能结界剧烈波动，向上飞行器无法突破决战封印！'
          : 'Floor 49 magic barrier disrupts vertical flight!';
      this.addNotification(msg, '#ef4444');
      if (onFloating) onFloating(msg, '#ef4444');
      return false;
    }

    const targetFloor = this.currentFloor + 1;
    this.playerStats.inventory.up_fly -= 1;
    this.changeFloor(targetFloor, 'up');

    sound.playVictory();
    const successMsg =
      this.language === 'zh'
        ? targetFloor === 44
          ? '成功突破空间结界，升入隐藏的【44F 圣盾密室】！（消耗向上飞行器）'
          : `向上跃迁成功！已升至 ${targetFloor} 层！（消耗向上飞行器）`
        : targetFloor === 44
        ? 'Breached spatial seal, ascended to hidden [44F Holy Shield Vault]! (Flyer consumed)'
        : `Ascended successfully to Floor ${targetFloor}! (Flyer consumed)`;
    this.addNotification(successMsg, '#a78bfa');
    if (onFloating) onFloating(successMsg, '#a78bfa', 4000);

    this.notify();
    return true;
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
      this.playerStats.shield = '神圣之盾';
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
      sound.playVictory();

      // 拾取向上飞行器时弹出专属说明对话框，说明是一次性的及经典魔塔用途（单弹窗总结）
      this.activeDialogue = {
        name: this.language === 'zh' ? '秘宝【向上飞行器】' : 'Relic [Up Flyer]',
        avatar: '🚀',
        lines:
          this.language === 'zh'
            ? [
                '你获得了稀世秘宝【向上飞行器】！\n\n魔塔中隐藏着【44F 圣盾密室】，常规楼梯无法到达，必须在 43 层使用此飞行器方可突破结界直达 44 层获取至尊【神圣之盾】！\n\n【特别提示】：此道具为【一次性消耗品】，已在左侧栏就绪，请深思熟虑后点击使用。',
              ]
            : [
                'You obtained the rare relic [Up Flyer]!\n\nThe tower conceals the hidden [44F Holy Shield Vault]! You must use this flyer on Floor 43 to breach the spatial barrier and claim the legendary [Sacred Shield]!\n\n[NOTICE]: This flyer is a ONE-TIME CONSUMABLE. Click the button in the left sidebar when ready.',
              ],
        currentIndex: 0,
        npcId: 'item_up_fly',
      };
      this.isDialogueOpen = true;
    } else if (itemType === 'center_fly') {
      this.playerStats.inventory.center_fly = (this.playerStats.inventory.center_fly || 0) + 1;
      sound.playVictory();

      // 拾取时空飞行器时弹出专属说明对话框，说明是一次性的
      this.activeDialogue = {
        name: this.language === 'zh' ? '秘宝【时空飞行器】' : 'Relic [Chrono Flyer]',
        avatar: '🪽',
        lines:
          this.language === 'zh'
            ? [
                '你获得了稀世秘宝【时空飞行器】！\n\n此宝物蕴含超越维度的时空法则，使用后可将你瞬间传送至当前楼层的任意通畅地面。\n\n【特别注意】：此飞行器为【一次性消耗品】，使用后能量耗尽即损毁！请在左侧边栏深思熟虑后点击开启跃迁。',
              ]
            : [
                'You obtained the rare relic [Chrono Flyer]!\n\nImbued with transcendental spacetime magic, it teleports you to any open floor tile on the current level.\n\n[NOTICE]: This flyer is a ONE-TIME CONSUMABLE and will be destroyed upon use. Click the button in the left sidebar when ready.',
              ],
        currentIndex: 0,
        npcId: 'item_center_fly',
      };
      this.isDialogueOpen = true;
    } else if (itemType === 'thief_shovel') {
      this.playerStats.inventory.thief_shovel = 1;
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
    // 0F 仙灵密境：神秘金币大门（需勘破 23F 暗号印记）
    if (this.currentFloor === 0 && targetX === 5 && targetY === 4) {
      if (!this.isFloor23PuzzleSolved) {
        return {
          canOpen: false,
          reason: this.language === 'zh'
            ? '门被神秘力量锁住了，到23层去找找线索吧'
            : 'The gate is locked by a mysterious power. Seek clues on Floor 23.',
        };
      }
      return { canOpen: true };
    }

    // 39F 时钟密室宝物铁笼：必须先解开时钟谜题
    if (this.currentFloor === 39 && targetX === 3 && targetY === 3) {
      if (!this.isFloor39PuzzleSolved) {
        return {
          canOpen: false,
          reason: this.language === 'zh'
            ? '有一个宝物锁在这里，但不知道怎么打开'
            : 'A treasure is locked here, but I don\'t know how to open it.',
        };
      }
      return { canOpen: true };
    }

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

    // 无守卫怪物的特殊铁门（若未在上方的特殊逻辑中放行）不可直接开启
    if (!rule.guards || rule.guards.length === 0) {
      return {
        canOpen: false,
        reason: this.language === 'zh' ? rule.reasonZh : rule.reasonEn,
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
      // 必须有守卫怪物的铁门才由击败守卫触发自动开启；
      // 特殊机关门（guards 为空，如 0F 仙灵金币门、39F 时钟解谜铁笼）绝不可在此由击败普通怪物误触发开启！
      if (!rule.guards || rule.guards.length === 0) continue;
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

    // 29F 小偷勘探暗道报恩赠送黄色钥匙 x2（需先找回小偷的铲子）
    if (npcId === 'thief' && this.currentFloor === 29) {
      if (!hadGiftAlready) {
        if (!this.playerStats.inventory.thief_shovel) {
          // 未持有小偷的铲子：卡在寻找铲子提示，不赠予钥匙，不挖开暗道
          const dlg = getDialogueData(npcId, this.language, this.currentFloor, false, false, false);
          if (dlg) {
            this.activeDialogue = {
              name: dlg.name,
              avatar: dlg.avatar,
              lines: [...dlg.lines],
              currentIndex: 0,
              npcId,
              targetPos: targetX !== undefined && targetY !== undefined ? { x: targetX, y: targetY } : undefined,
            };
            this.isDialogueOpen = true;
          }
          this.notify();
          return;
        } else {
          // 持有小偷的铲子：交付铲子，挖通 (5, 2) 暗道，赠送黄钥匙 x2
          this.elderGiftsGiven['thief_29f'] = true;
          this.playerStats.yellowKeys += 2;
          delete this.playerStats.inventory.thief_shovel;
          sound.playVictory();

          const f29 = this.getCurrentFloorData();
          if (f29.layout[2]?.[5]) {
            f29.layout[2][5] = { type: 'floor' };
          }

          const dlg = getDialogueData(npcId, this.language, this.currentFloor, false, false, true);
          if (dlg) {
            this.activeDialogue = {
              name: dlg.name,
              avatar: dlg.avatar,
              lines: [...dlg.lines],
              currentIndex: 0,
              npcId,
              targetPos: targetX !== undefined && targetY !== undefined ? { x: targetX, y: targetY } : undefined,
            };
            this.isDialogueOpen = true;
          }
          this.addNotification(
            this.language === 'zh'
              ? '小偷找回了铁铲并挖通暗道，赠送黄色钥匙 x2！'
              : 'The thief recovered the shovel, excavated the tunnel, and gifted Yellow Keys x2!',
            '#eab308'
          );
          this.notify();
          return;
        }
      } else {
        const dlg = getDialogueData(npcId, this.language, this.currentFloor, false, true);
        if (dlg) {
          this.activeDialogue = {
            name: dlg.name,
            avatar: dlg.avatar,
            lines: [...dlg.lines],
            currentIndex: 0,
            npcId,
            targetPos: targetX !== undefined && targetY !== undefined ? { x: targetX, y: targetY } : undefined,
          };
          this.isDialogueOpen = true;
        }
        this.notify();
        return;
      }
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
        this.language === 'zh' ? '智慧老人赠送蓝钥匙 x1' : 'Wise Sage gifted Blue Key x1',
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
      // 29F 小偷交接铲子后凿通暗道：同步移除 3D 场景中的暗墙
      if (npcId === 'thief' && this.currentFloor === 29 && this.elderGiftsGiven['thief_29f']) {
        const floor = this.getCurrentFloorData();
        if (floor.layout[2]?.[5]?.type === 'fake_wall' || floor.layout[2]?.[5]?.type === 'wall') {
          floor.layout[2][5] = { type: 'floor' };
        }
        if (onTileChange) {
          onTileChange(5, 2, false);
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

      const currentFloorData = this.getCurrentFloorData();
      const slot: SaveSlot = {
        slotId,
        timestamp: new Date().toLocaleString(),
        floor: this.currentFloor,
        floorName: currentFloorData?.name,
        stats: JSON.parse(JSON.stringify(this.playerStats)),
        playerPos: { ...this.playerPos },
        floorStates,
        shopTimes: this.shopTimes,
        tradersBought: { ...this.tradersBought },
        elderGiftsGiven: { ...this.elderGiftsGiven },
        isFloor23PuzzleSolved: this.isFloor23PuzzleSolved,
        floor23VisitedTiles: Array.from(this.floor23VisitedTiles),
        floor39Clock3Opened: this.floor39Clock3Opened,
        floor39Clock12Opened: this.floor39Clock12Opened,
        isFloor39PuzzleSolved: this.isFloor39PuzzleSolved,
        exploredFloors: Array.from(this.exploredFloors),
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
      this.isFloor23PuzzleSolved = Boolean(slot.isFloor23PuzzleSolved);
      this.floor23VisitedTiles = new Set(slot.floor23VisitedTiles || []);
      this.floor39Clock3Opened = Boolean(slot.floor39Clock3Opened);
      this.floor39Clock12Opened = Boolean(slot.floor39Clock12Opened);
      this.isFloor39PuzzleSolved = Boolean(slot.isFloor39PuzzleSolved);

      this.floorCache.clear();
      for (const fNum in slot.floorStates) {
        this.floorCache.set(Number(fNum), slot.floorStates[fNum]);
      }

      // 针对旧版本存档的平滑热迁移：若 0F 已存在缓存且 (7, 7) 仍为空地面，补全英雄赞助榜 (honor_monument)
      const floor0 = this.floorCache.get(0);
      if (floor0 && floor0[7] && floor0[7][7] && floor0[7][7].type === 'floor') {
        const isPlayerOnTile = this.currentFloor === 0 && this.playerPos.x === 7 && this.playerPos.y === 7;
        if (!isPlayerOnTile) {
          floor0[7][7] = { type: 'npc', npcId: 'honor_monument' };
        }
      }
      if (slot.exploredFloors && Array.isArray(slot.exploredFloors)) {
        this.exploredFloors = new Set(slot.exploredFloors);
      } else {
        this.exploredFloors.add(this.currentFloor);
      }

      this.isGameOver = false;
      this.isVictory = false;
      this.isDialogueOpen = false;
      this.isShopOpen = false;
      this.isMonsterManualOpen = false;
      this.isFloorTeleportOpen = false;

      sound.playStairs();
      this.notify();
      return true;
    } catch (e) {
      console.error('Load failed', e);
      return false;
    }
  }

  // 查询指定槽位存档信息（只读预览，不影响当前游戏数据）
  public getSaveSlot(slotId: number): SaveSlot | null {
    try {
      const data = localStorage.getItem(`mota3d_save_${slotId}`);
      if (!data) return null;
      return JSON.parse(data) as SaveSlot;
    } catch {
      return null;
    }
  }

  // 获取所有槽位信息列表（默认 1~6 号槽位）
  public getAllSaveSlots(maxSlots: number = 6): (SaveSlot | null)[] {
    const list: (SaveSlot | null)[] = [];
    for (let i = 1; i <= maxSlots; i++) {
      list.push(this.getSaveSlot(i));
    }
    return list;
  }

  // 删除指定槽位的存档
  public deleteSaveSlot(slotId: number): boolean {
    try {
      localStorage.removeItem(`mota3d_save_${slotId}`);
      this.notify();
      return true;
    } catch {
      return false;
    }
  }
}
