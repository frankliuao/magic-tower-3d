// src/types/game.ts

export type Direction = 'up' | 'down' | 'left' | 'right';

export type MoveCommand = 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';

export type SpecialAbility =
  | 'FIRST_STRIKE'  // 先攻
  | 'DOUBLE_STRIKE' // 2连击
  | 'TRIPLE_STRIKE' // 3连击
  | 'MAGIC_ATTACK'  // 魔攻 (无视防御)
  | 'VAMPIRE_10'    // 吸血 10%
  | 'VAMPIRE_20'    // 吸血 20%
  | 'POISON'        // 中毒
  | 'DEFENSE_BREAK' // 破甲
  | 'NONE';

export interface Monster {
  id: string;
  name: string;
  nameEn: string;
  hp: number;
  atk: number;
  def: number;
  gold: number;
  exp: number;
  special?: SpecialAbility[];
  color: string;
  modelType: 'slime' | 'bat' | 'skeleton' | 'mage' | 'guard' | 'knight' | 'boss';
  description?: string;
}

export type ItemType =
  | 'key_yellow'
  | 'key_blue'
  | 'key_red'
  | 'potion_red'     // +200 HP
  | 'potion_blue'    // +500 HP
  | 'gem_red'        // +3 ATK
  | 'gem_blue'       // +3 DEF
  | 'sword_iron'     // +10 ATK
  | 'sword_silver'   // +20 ATK
  | 'sword_knight'   // +40 ATK
  | 'sword_holy'     // +100 ATK
  | 'sword_sacred'   // +150 ATK
  | 'shield_iron'    // +10 DEF
  | 'shield_silver'  // +20 DEF
  | 'shield_knight'  // +40 DEF
  | 'shield_holy'    // +100 DEF
  | 'shield_sacred'  // +150 DEF
  | 'monster_manual' // 怪物手册
  | 'compass'        // 楼层跳跃罗盘
  | 'cross'          // 十字架 (大幅增伤/吸血豁免)
  | 'pickaxe'        // 破墙十字镐
  | 'bomb'           // 炸弹
  | 'earthquake'     // 地震卷轴
  | 'lucky_coin'      // 幸运金币 (击杀怪物金钱翻倍)
  | 'holy_water'     // 圣水 (生命值翻倍)
  | 'key_gold'       // 金钥匙
  | 'notepad'        // 记事本
  | 'snow_crystal'   // 雪花 (冰封火海)
  | 'down_fly'       // 向下飞行器
  | 'up_fly'         // 向上飞行器
  | 'center_fly'     // 中心对称飞行器
  | 'sword_dragon';  // 屠龙剑

export interface ItemDef {
  id: ItemType;
  name: string;
  nameEn: string;
  description: string;
  category: 'key' | 'potion' | 'gem' | 'equipment' | 'special';
  value?: number;
  color: string;
}

export type TileType =
  | 'floor'
  | 'wall'
  | 'fake_wall'
  | 'lava'
  | 'stairs_up'
  | 'stairs_down'
  | 'door_yellow'
  | 'door_blue'
  | 'door_red'
  | 'door_iron'
  | 'monster'
  | 'item'
  | 'shop'
  | 'npc';

export interface Tile {
  type: TileType;
  monsterId?: string;
  itemType?: ItemType;
  npcId?: string;
  customData?: any;
}

export interface FloorData {
  floorNumber: number; // 0 to 50
  name: string;
  layout: (Tile | null)[][]; // 11x11 grid: layout[y][x]
  upStairsPos: { x: number; y: number };
  downStairsPos: { x: number; y: number };
  theme: 'castle' | 'dungeon' | 'magma' | 'dark' | 'celestial';
  initialEvents?: { [key: string]: boolean };
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  gold: number;
  exp: number;
  yellowKeys: number;
  blueKeys: number;
  redKeys: number;
  weapon: string | null;
  shield: string | null;
  inventory: { [key in ItemType]?: number };
}

export interface BattleCalculation {
  canFight: boolean;
  damage: number;
  turns: number;
  damagePerTurn: number;
  heroDamagePerTurn: number;
  nextCritAtk?: number; // 降低一击伤害需要的攻击力
  reducedDamageAtCrit?: number;
  specialNotes: string[];
}

export interface NPCMessage {
  id: string;
  name: string;
  avatar: string;
  dialogue: string[];
  onFinishReward?: {
    item?: ItemType;
    gold?: number;
    exp?: number;
    message?: string;
  };
}

export interface SaveSlot {
  slotId: number;
  timestamp: string;
  floor: number;
  stats: PlayerStats;
  playerPos: { x: number; y: number; dir: Direction };
  floorStates: { [floorNum: number]: (Tile | null)[][] };
  shopTimes: number;
}
