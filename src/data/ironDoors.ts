// src/data/ironDoors.ts
// 机关铁门：不需要钥匙，必须击败指定守卫后自动开启。

export interface IronDoorGuard {
  x: number;
  y: number;
}

export interface IronDoorRule {
  floor: number;
  doorX: number;
  doorY: number;
  /** 必须全部清除后此门才开启的守卫坐标 */
  guards: IronDoorGuard[];
  reasonZh: string;
  reasonEn: string;
  openZh: string;
  openEn: string;
}

/**
 * 全塔机关铁门开启条件（经典魔塔：打败指定怪物后自动打开）。
 * 每一扇 door_iron 都必须出现在此表中。
 */
export const IRON_DOOR_RULES: IronDoorRule[] = [
  // 2F：击败两名中级卫兵后，六扇牢房铁门全部开启
  ...[
    [4, 4],
    [8, 4],
    [4, 7],
    [8, 7],
    [4, 10],
    [8, 10],
  ].map(([doorX, doorY]) => ({
    floor: 2,
    doorX,
    doorY,
    guards: [
      { x: 5, y: 1 },
      { x: 7, y: 1 },
    ],
    reasonZh: '必须消灭两名中级卫兵才能开启牢房铁门！',
    reasonEn: 'Defeat both Medium Guards to open the prison gates!',
    openZh: '中级卫兵已除，牢房铁门全部开启！',
    openEn: 'Medium Guards fallen — all prison gates open!',
  })),

  // 8F：初级卫兵守护红钥匙密室
  {
    floor: 8,
    doorX: 9,
    doorY: 3,
    guards: [
      { x: 8, y: 4 },
      { x: 10, y: 4 },
    ],
    reasonZh: '必须消灭门两侧的初级卫兵才能开启！',
    reasonEn: 'Defeat the Junior Guards on both sides first!',
    openZh: '初级卫兵已除，铁门开启！',
    openEn: 'Junior Guards defeated, the iron gate opens!',
  },

  // 10F：骷髅队长两侧铁栅栏
  {
    floor: 10,
    doorX: 3,
    doorY: 3,
    guards: [{ x: 5, y: 3 }],
    reasonZh: '必须击败中央的骷髅队长才能开启！',
    reasonEn: 'Defeat the Skeleton Captain first!',
    openZh: '骷髅队长败亡，两侧铁门开启！',
    openEn: 'Captain defeated, both gates open!',
  },
  {
    floor: 10,
    doorX: 7,
    doorY: 3,
    guards: [{ x: 5, y: 3 }],
    reasonZh: '必须击败中央的骷髅队长才能开启！',
    reasonEn: 'Defeat the Skeleton Captain first!',
    openZh: '骷髅队长败亡，两侧铁门开启！',
    openEn: 'Captain defeated, both gates open!',
  },

  // 11F：高级法师守护银盾密室
  {
    floor: 11,
    doorX: 1,
    doorY: 3,
    guards: [
      { x: 0, y: 4 },
      { x: 2, y: 4 },
    ],
    reasonZh: '必须消灭门两侧的高级法师才能开启！',
    reasonEn: 'Defeat the Senior Mages on both sides first!',
    openZh: '高级法师已除，铁门开启！',
    openEn: 'Senior Mages defeated, the iron gate opens!',
  },

  // 15F：击败大乌贼后通往上楼光圈
  {
    floor: 15,
    doorX: 5,
    doorY: 2,
    guards: [{ x: 5, y: 4 }],
    reasonZh: '必须击败大乌贼才能开启！',
    reasonEn: 'Defeat the Giant Squid first!',
    openZh: '大乌贼败亡，铁门轰然开启！',
    openEn: 'Giant Squid fallen, the iron gate opens!',
  },

  // 17F：四扇铁门分别由两侧守卫看守
  {
    floor: 17,
    doorX: 1,
    doorY: 3,
    guards: [
      { x: 0, y: 4 },
      { x: 2, y: 4 },
    ],
    reasonZh: '必须消灭门两侧的初级卫兵才能开启！',
    reasonEn: 'Defeat the Junior Guards on both sides first!',
    openZh: '初级卫兵已除，铁门开启！',
    openEn: 'Junior Guards defeated, the iron gate opens!',
  },
  {
    floor: 17,
    doorX: 9,
    doorY: 3,
    guards: [
      { x: 8, y: 4 },
      { x: 10, y: 4 },
    ],
    reasonZh: '必须消灭门两侧的兽人武士才能开启！',
    reasonEn: 'Defeat the Orc Knights on both sides first!',
    openZh: '兽人武士已除，铁门开启！',
    openEn: 'Orc Knights defeated, the iron gate opens!',
  },
  {
    floor: 17,
    doorX: 1,
    doorY: 6,
    guards: [
      { x: 0, y: 7 },
      { x: 2, y: 7 },
    ],
    reasonZh: '必须消灭门两侧的初级卫兵才能开启！',
    reasonEn: 'Defeat the Junior Guards on both sides first!',
    openZh: '初级卫兵已除，铁门开启！',
    openEn: 'Junior Guards defeated, the iron gate opens!',
  },
  {
    floor: 17,
    doorX: 9,
    doorY: 6,
    guards: [
      { x: 8, y: 7 },
      { x: 10, y: 7 },
    ],
    reasonZh: '必须消灭门两侧的兽人才能开启！',
    reasonEn: 'Defeat the Orcs on both sides first!',
    openZh: '兽人已除，铁门开启！',
    openEn: 'Orcs defeated, the iron gate opens!',
  },

  // 20F：击败吸血鬼后通往上楼光圈
  {
    floor: 20,
    doorX: 5,
    doorY: 2,
    guards: [{ x: 5, y: 5 }],
    reasonZh: '必须击败吸血鬼才能开启！',
    reasonEn: 'Defeat the Vampire first!',
    openZh: '吸血鬼败亡，铁门轰然开启！',
    openEn: 'Vampire fallen, the iron gate opens!',
  },

  // 30F：击败全部 6 只史莱姆后开启
  {
    floor: 30,
    doorX: 5,
    doorY: 3,
    guards: [
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
    ],
    reasonZh: '必须消灭通道上的全部史莱姆才能开启！',
    reasonEn: 'Defeat all the slimes in the corridor first!',
    openZh: '史莱姆尽灭，通天铁门开启！',
    openEn: 'All slimes cleared — the skyward gate opens!',
  },

  // 32F：中级卫兵守护商店区
  {
    floor: 32,
    doorX: 1,
    doorY: 8,
    guards: [
      { x: 0, y: 9 },
      { x: 2, y: 9 },
    ],
    reasonZh: '必须消灭门两侧的中级卫兵才能开启！',
    reasonEn: 'Defeat the Medium Guards on both sides first!',
    openZh: '中级卫兵已除，铁门开启！',
    openEn: 'Medium Guards defeated, the iron gate opens!',
  },

  // 35F：击败魔龙后通往上楼光圈
  {
    floor: 35,
    doorX: 5,
    doorY: 2,
    guards: [{ x: 5, y: 5 }],
    reasonZh: '必须击败魔龙才能开启！',
    reasonEn: 'Defeat the Ancient Dragon first!',
    openZh: '魔龙败亡，铁门轰然开启！',
    openEn: 'Dragon fallen, the iron gate opens!',
  },

  // 38F：中级卫兵守护骑士盾密室
  {
    floor: 38,
    doorX: 1,
    doorY: 8,
    guards: [
      { x: 0, y: 9 },
      { x: 2, y: 9 },
    ],
    reasonZh: '必须消灭门两侧的中级卫兵才能开启！',
    reasonEn: 'Defeat the Medium Guards on both sides first!',
    openZh: '中级卫兵已除，铁门开启！',
    openEn: 'Medium Guards defeated, the iron gate opens!',
  },

  // 44F：高级卫兵守护神圣神盾
  {
    floor: 44,
    doorX: 5,
    doorY: 7,
    guards: [
      { x: 4, y: 8 },
      { x: 6, y: 8 },
    ],
    reasonZh: '必须消灭门两侧的高级卫兵才能开启！',
    reasonEn: 'Defeat the Senior Guards on both sides first!',
    openZh: '高级卫兵已除，铁门开启！',
    openEn: 'Senior Guards defeated, the iron gate opens!',
  },

  // 45F：黑暗骑士 / 魔法警卫守护飞行器区
  {
    floor: 45,
    doorX: 3,
    doorY: 9,
    guards: [
      { x: 4, y: 8 },
      { x: 4, y: 10 },
    ],
    reasonZh: '必须消灭门两侧的黑暗骑士才能开启！',
    reasonEn: 'Defeat the Dark Knights on both sides first!',
    openZh: '黑暗骑士已灭，铁门开启！',
    openEn: 'Dark Knights fallen, the iron gate opens!',
  },
  {
    floor: 45,
    doorX: 6,
    doorY: 9,
    guards: [
      { x: 7, y: 8 },
      { x: 7, y: 10 },
    ],
    reasonZh: '必须消灭门两侧的魔法警卫才能开启！',
    reasonEn: 'Defeat the Magic Guards on both sides first!',
    openZh: '魔法警卫已除，铁门开启！',
    openEn: 'Magic Guards defeated, the iron gate opens!',
  },

  // 48F：魔法警卫守护神圣神剑密室
  {
    floor: 48,
    doorX: 7,
    doorY: 7,
    guards: [
      { x: 6, y: 4 },
      { x: 8, y: 4 },
    ],
    reasonZh: '必须消灭守护神剑的魔法警卫才能开启！',
    reasonEn: 'Defeat the Magic Guards protecting the sacred sword!',
    openZh: '魔法警卫已除，神剑密室开启！',
    openEn: 'Magic Guards defeated — the sacred vault opens!',
  },

  // 49F：两道王座铁门
  {
    floor: 49,
    doorX: 5,
    doorY: 8,
    guards: [
      { x: 4, y: 9 },
      { x: 6, y: 9 },
    ],
    reasonZh: '必须消灭门两侧守护的巫师才能开启！',
    reasonEn: 'Defeat the guarding wizards on both sides first!',
    openZh: '两侧巫师已除，铁门轰然开启！',
    openEn: 'Guards defeated, the iron gate opens!',
  },
  {
    floor: 49,
    doorX: 5,
    doorY: 6,
    guards: [
      { x: 4, y: 7 },
      { x: 6, y: 7 },
    ],
    reasonZh: '必须消灭门两侧守护的黑暗骑士才能开启！',
    reasonEn: 'Defeat the guarding dark knights on both sides first!',
    openZh: '黑暗骑士已灭，王座大门开启！',
    openEn: 'Dark knights fallen, throne gate opens!',
  },
];

export function getIronDoorRulesForFloor(floor: number): IronDoorRule[] {
  return IRON_DOOR_RULES.filter((r) => r.floor === floor);
}

export function findIronDoorRule(
  floor: number,
  doorX: number,
  doorY: number
): IronDoorRule | undefined {
  return IRON_DOOR_RULES.find(
    (r) => r.floor === floor && r.doorX === doorX && r.doorY === doorY
  );
}
