// src/data/floors.ts
import { FloorData, Tile, TileType, ItemType } from '../types/game';

// 快捷生成瓦片辅助函数
export const T = {
  floor: (): Tile => ({ type: 'floor' }),
  wall: (): Tile => ({ type: 'wall' }),
  fakeWall: (): Tile => ({ type: 'fake_wall' }),
  lava: (): Tile => ({ type: 'lava' }),
  up: (): Tile => ({ type: 'stairs_up' }),
  down: (): Tile => ({ type: 'stairs_down' }),
  doorY: (): Tile => ({ type: 'door_yellow' }),
  doorB: (): Tile => ({ type: 'door_blue' }),
  doorR: (): Tile => ({ type: 'door_red' }),
  doorI: (): Tile => ({ type: 'door_iron' }),
  shop: (): Tile => ({ type: 'shop' }),
  mon: (id: string): Tile => ({ type: 'monster', monsterId: id }),
  item: (id: ItemType): Tile => ({ type: 'item', itemType: id }),
  npc: (id: string): Tile => ({ type: 'npc', npcId: id }),
};

// ----------------------------------------------------
// 0层：经典隐藏地下室 (幸运金币秘宝殿堂，由下楼器进入)
// ----------------------------------------------------
function getFloor0(): FloorData {
  const g: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.item('gem_red'), T.item('key_yellow'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.item('key_blue'), T.item('gem_blue'), T.wall()],
    [T.wall(), T.item('potion_red'), T.floor(), T.wall(), T.floor(), T.npc('fairy'), T.floor(), T.wall(), T.floor(), T.item('potion_blue'), T.wall()],
    [T.wall(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall()],
    [T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall()],
    [T.wall(), T.floor(), T.doorY(), T.floor(), T.doorB(), T.item('lucky_coin'), T.doorB(), T.floor(), T.doorY(), T.floor(), T.wall()],
    [T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall()],
    [T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall()],
    [T.wall(), T.item('key_yellow'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.item('key_yellow'), T.wall()],
    [T.wall(), T.item('potion_red'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.item('potion_red'), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
  ];

  return {
    floorNumber: 0,
    name: '0F 秘境·地下室 (幸运金币)',
    layout: g,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor1(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.mon('green_slime'), T.mon('red_slime'), T.mon('green_slime'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.item('potion_red'), T.floor(), T.floor(), T.doorY(), T.floor(), T.wall(), T.item('gem_red'), T.item('key_yellow'), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.mon('skeleton'), T.floor(), T.wall(), T.floor(), T.wall(), T.item('gem_blue'), T.item('key_yellow'), T.floor(), T.wall(), T.floor()],
    [T.wall(), T.doorY(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.doorY(), T.mon('small_bat'), T.mon('junior_mage'), T.mon('small_bat'), T.wall(), T.floor()],
    [T.floor(), T.mon('skeleton_soldier'), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.wall(), T.doorY(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.item('potion_red'), T.floor(), T.item('key_yellow'), T.wall(), T.item('key_yellow'), T.floor(), T.npc('elder'), T.wall(), T.floor(), T.mon('small_bat'), T.floor()],
    [T.item('potion_red'), T.item('compass'), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('green_slime'), T.item('potion_blue'), T.mon('green_slime')],
  ];

  return {
    floorNumber: 1,
    name: '1F 初入魔塔 (入口大殿)',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'castle',
  };
}

function getFloor2(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.doorB(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.mon('mid_guard'), T.floor(), T.mon('mid_guard'), T.floor(), T.wall(), T.wall()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.npc('elder')],
    [T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.doorI(), T.floor(), T.floor(), T.floor(), T.doorI(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.wall(), T.item('gem_blue'), T.item('gem_blue'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.npc('trader')],
    [T.floor(), T.wall(), T.item('gem_red'), T.item('gem_red'), T.doorI(), T.floor(), T.floor(), T.floor(), T.doorI(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.wall(), T.item('potion_blue'), T.item('potion_blue'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.npc('elder')],
    [T.up(), T.wall(), T.item('potion_blue'), T.floor(), T.doorI(), T.floor(), T.floor(), T.floor(), T.doorI(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 2,
    name: '2F 幽暗地牢 (解救小偷)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'castle',
  };
}

function getFloor3(): FloorData {
  const layout: Tile[][] = [
    [T.item('key_yellow'), T.item('gem_blue'), T.wall(), T.item('key_yellow'), T.item('potion_blue'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.floor(), T.item('potion_red')],
    [T.floor(), T.item('potion_red'), T.wall(), T.item('potion_blue'), T.item('key_yellow'), T.item('potion_blue'), T.wall(), T.floor(), T.doorY(), T.mon('small_bat'), T.floor()],
    [T.mon('junior_mage'), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_blue'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.npc('elder')],
    [T.floor(), T.floor(), T.mon('small_bat'), T.floor(), T.floor(), T.floor(), T.mon('green_slime'), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.mon('skeleton'), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.item('potion_red')],
    [T.floor(), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.doorY(), T.mon('junior_mage'), T.item('key_yellow')],
    [T.item('potion_red'), T.item('gem_red'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.mon('red_slime'), T.wall(), T.floor(), T.floor()],
    [T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.doorY(), T.floor(), T.up()],
  ];

  return {
    floorNumber: 3,
    name: '3F 初遇魔王 (被困牢房)',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'castle',
  };
}

function getFloor4(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.item('key_blue'), T.floor(), T.wall(), T.shop(), T.shop(), T.shop(), T.wall(), T.floor(), T.npc('elder'), T.floor()],
    [T.item('potion_red'), T.floor(), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.item('potion_blue')],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('skeleton_soldier'), T.floor()],
    [T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.floor(), T.mon('junior_mage'), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('skeleton'), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.mon('red_slime'), T.floor(), T.mon('green_slime'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.mon('small_bat'), T.floor(), T.wall(), T.floor(), T.mon('junior_mage'), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.mon('green_slime'), T.floor(), T.item('key_yellow'), T.wall(), T.item('gem_red'), T.floor(), T.item('potion_red'), T.wall(), T.floor()],
    [T.up(), T.wall(), T.item('key_yellow'), T.mon('green_slime'), T.item('key_yellow'), T.wall(), T.floor(), T.mon('green_slime'), T.floor(), T.wall(), T.down()],
  ];

  return {
    floorNumber: 4,
    name: '4F 贪婪神坛 (初始金币商店)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'castle',
  };
}

function getFloor5(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.wall(), T.floor(), T.mon('red_slime'), T.doorY(), T.floor(), T.wall(), T.floor(), T.floor(), T.doorY(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.mon('green_slime'), T.mon('green_slime'), T.wall(), T.mon('red_slime')],
    [T.floor(), T.doorY(), T.mon('small_bat'), T.floor(), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor()],
    [T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.mon('small_bat'), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor()],
    [T.item('key_yellow'), T.floor(), T.mon('junior_mage'), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.item('key_yellow'), T.floor(), T.floor(), T.mon('small_bat'), T.wall(), T.floor(), T.mon('green_slime'), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.mon('skeleton_soldier'), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('red_slime')],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('green_slime'), T.wall(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.item('gem_blue'), T.item('key_yellow'), T.item('potion_red'), T.item('notepad'), T.wall(), T.floor(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.fakeWall(), T.floor(), T.item('sword_iron')],
  ];

  return {
    floorNumber: 5,
    name: '5F 守备重地 (神兵铁剑)',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'castle',
  };
}

function getFloor6(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor(), T.mon('junior_mage'), T.floor(), T.item('key_yellow'), T.mon('green_slime'), T.floor()],
    [T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.mon('red_slime'), T.wall(), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.mon('skeleton'), T.floor()],
    [T.floor(), T.doorY(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.wall(), T.npc('trader'), T.floor(), T.floor(), T.mon('small_bat')],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.floor(), T.mon('red_slime'), T.mon('junior_mage'), T.floor(), T.item('key_yellow'), T.floor(), T.mon('skeleton'), T.mon('skeleton_soldier'), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.mon('junior_mage'), T.floor(), T.floor(), T.npc('elder'), T.wall(), T.floor(), T.doorY(), T.doorY(), T.floor(), T.doorY(), T.floor()],
    [T.floor(), T.mon('small_bat'), T.floor(), T.item('gem_blue'), T.wall(), T.floor(), T.wall(), T.wall(), T.mon('red_slime'), T.wall(), T.mon('red_slime')],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.mon('green_slime'), T.floor(), T.floor(), T.mon('skeleton'), T.floor(), T.wall(), T.item('potion_red'), T.item('potion_red'), T.wall(), T.up()],
  ];

  return {
    floorNumber: 6,
    name: '6F 卫戍哨所 (回廊通道)',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'castle',
  };
}

function getFloor7(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.wall(), T.item('gem_red'), T.wall(), T.npc('trader'), T.floor(), T.npc('elder'), T.wall(), T.item('key_yellow'), T.wall(), T.mon('green_slime')],
    [T.floor(), T.wall(), T.item('potion_red'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.mon('green_slime')],
    [T.floor(), T.wall(), T.mon('small_bat'), T.wall(), T.mon('red_slime'), T.wall(), T.mon('skeleton_soldier'), T.wall(), T.item('potion_red'), T.wall(), T.mon('red_slime')],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorB(), T.wall(), T.doorY(), T.wall(), T.mon('skeleton'), T.wall(), T.doorY()],
    [T.floor(), T.mon('skeleton_soldier'), T.floor(), T.mon('junior_mage'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.mon('skeleton_soldier'), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.mon('small_bat'), T.wall(), T.mon('red_slime'), T.wall(), T.item('potion_blue'), T.wall(), T.floor()],
    [T.mon('green_slime'), T.wall(), T.mon('green_slime'), T.wall(), T.item('key_yellow'), T.wall(), T.mon('junior_mage'), T.wall(), T.item('key_yellow'), T.wall(), T.floor()],
    [T.floor(), T.mon('red_slime'), T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.item('potion_blue'), T.wall(), T.item('key_yellow'), T.wall(), T.down()],
  ];

  return {
    floorNumber: 7,
    name: '7F 矿晶宝库 (红蓝宝石)',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'castle',
  };
}

function getFloor8(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.doorY(), T.doorY(), T.floor(), T.up(), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.item('key_yellow')],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.mon('green_slime'), T.wall(), T.floor(), T.item('key_red'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.item('potion_blue'), T.floor(), T.item('potion_red')],
    [T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow'), T.floor(), T.floor(), T.wall(), T.wall(), T.doorI(), T.wall()],
    [T.item('potion_red'), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('junior_mage'), T.wall(), T.mon('junior_guard'), T.floor(), T.mon('junior_guard')],
    [T.floor(), T.mon('red_slime'), T.mon('green_slime'), T.mon('red_slime'), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.mon('small_bat'), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.floor(), T.floor(), T.floor(), T.mon('small_bat'), T.floor(), T.mon('skeleton'), T.floor(), T.mon('junior_mage'), T.floor(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.mon('green_slime'), T.floor(), T.wall(), T.item('gem_red'), T.item('key_yellow'), T.wall(), T.item('key_blue'), T.item('potion_red'), T.wall(), T.floor(), T.mon('skeleton')],
    [T.floor(), T.mon('small_bat'), T.doorB(), T.item('key_yellow'), T.item('gem_blue'), T.wall(), T.item('key_yellow'), T.floor(), T.doorY(), T.mon('skeleton_soldier'), T.floor()],
  ];

  return {
    floorNumber: 8,
    name: '8F 坚石隘口 (红钥匙密室)',
    layout,
    upStairsPos: { x: 5, y: 0 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'castle',
  };
}

function getFloor9(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.mon('skeleton'), T.doorY(), T.floor(), T.down(), T.floor(), T.doorY(), T.mon('green_slime'), T.floor(), T.item('potion_red')],
    [T.floor(), T.item('key_yellow'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('green_slime'), T.floor()],
    [T.mon('skeleton_soldier'), T.wall(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.item('key_yellow'), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.item('key_yellow'), T.doorY(), T.doorY(), T.floor(), T.npc('elder')],
    [T.item('gem_blue'), T.floor(), T.mon('small_bat'), T.doorY(), T.floor(), T.item('gem_red'), T.floor(), T.wall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('red_slime'), T.wall(), T.floor(), T.floor(), T.mon('skeleton_soldier')],
    [T.item('key_yellow'), T.floor(), T.doorY(), T.mon('skeleton_soldier'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.item('shield_iron'), T.wall(), T.floor()],
    [T.mon('skeleton_soldier'), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.mon('junior_mage')],
    [T.floor(), T.item('potion_red'), T.wall(), T.floor(), T.mon('skeleton'), T.wall(), T.mon('small_bat'), T.wall(), T.floor(), T.mon('skeleton'), T.floor()],
    [T.up(), T.floor(), T.doorB(), T.floor(), T.floor(), T.doorY(), T.floor(), T.doorY(), T.mon('junior_mage'), T.floor(), T.item('potion_red')],
  ];

  return {
    floorNumber: 9,
    name: '9F 暗道迷阵 (神盾铁盾)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 5, y: 0 },
    theme: 'castle',
  };
}

function getFloor10(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.mon('skeleton'), T.mon('skeleton'), T.mon('skeleton'), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.mon('skeleton'), T.mon('skeleton'), T.mon('skeleton')],
    [T.floor(), T.mon('skeleton_soldier'), T.floor(), T.doorI(), T.floor(), T.mon('skeleton_captain'), T.floor(), T.doorI(), T.floor(), T.mon('skeleton_soldier'), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.mon('skeleton'), T.item('gem_blue'), T.mon('skeleton'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('skeleton'), T.item('gem_red'), T.mon('skeleton')],
    [T.floor(), T.mon('skeleton_soldier'), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.mon('skeleton_soldier'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.doorY(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.doorY(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.down(), T.wall(), T.floor(), T.mon('junior_mage'), T.floor(), T.floor(), T.floor(), T.mon('junior_mage'), T.floor(), T.wall(), T.item('potion_blue')],
  ];

  return {
    floorNumber: 10,
    name: '10F 骷髅要塞 (决战骷髅队长)',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'castle',
  };
}

function getFloor11(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.wall(), T.item('gem_red'), T.floor(), T.doorY(), T.floor(), T.wall(), T.item('potion_red'), T.item('key_yellow')],
    [T.floor(), T.item('shield_silver'), T.floor(), T.wall(), T.floor(), T.mon('small_bat'), T.wall(), T.mon('orc'), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.doorY(), T.wall(), T.wall(), T.floor(), T.doorY(), T.floor(), T.floor()],
    [T.wall(), T.doorI(), T.wall(), T.wall(), T.floor(), T.mon('big_bat'), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('big_slime')],
    [T.mon('senior_mage'), T.floor(), T.mon('senior_mage'), T.wall(), T.mon('orc'), T.floor(), T.doorY(), T.mon('senior_mage'), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.item('potion_red'), T.wall(), T.floor()],
    [T.item('potion_blue'), T.floor(), T.floor(), T.mon('big_bat'), T.floor(), T.floor(), T.doorY(), T.mon('big_slime'), T.floor(), T.wall(), T.floor()],
    [T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('big_bat')],
    [T.floor(), T.mon('big_bat'), T.floor(), T.mon('big_slime'), T.doorY(), T.floor(), T.npc('elder'), T.floor(), T.floor(), T.mon('small_bat'), T.floor()],
    [T.item('key_yellow'), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall(), T.floor()],
    [T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.down(), T.wall(), T.item('potion_blue'), T.mon('big_bat'), T.wall(), T.up()],
  ];

  return {
    floorNumber: 11,
    name: '11F 银辉殿堂 (神兵银盾)',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor12(): FloorData {
  const layout: Tile[][] = [
    [T.npc('trader'), T.fakeWall(), T.floor(), T.wall(), T.item('key_yellow'), T.item('gem_red'), T.item('key_yellow'), T.wall(), T.floor(), T.fakeWall(), T.npc('elder')],
    [T.wall(), T.wall(), T.mon('big_bat'), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.mon('senior_mage'), T.floor(), T.mon('senior_mage'), T.wall(), T.floor(), T.mon('orc'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.mon('senior_mage'), T.floor(), T.doorY(), T.floor(), T.mon('orc'), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.mon('big_bat')],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.mon('senior_mage'), T.doorY(), T.floor(), T.item('gem_blue'), T.floor()],
    [T.item('key_yellow'), T.item('key_yellow'), T.floor(), T.wall(), T.floor(), T.item('potion_blue'), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.mon('big_slime')],
    [T.item('key_yellow'), T.item('key_blue'), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.doorY()],
    [T.floor(), T.floor(), T.mon('orc'), T.wall(), T.shop(), T.shop(), T.shop(), T.wall(), T.mon('big_slime'), T.floor(), T.mon('orc')],
    [T.wall(), T.wall(), T.doorY(), T.wall(), T.item('potion_red'), T.floor(), T.item('potion_red'), T.wall(), T.wall(), T.floor(), T.wall()],
    [T.up(), T.floor(), T.floor(), T.mon('small_bat'), T.floor(), T.floor(), T.floor(), T.mon('small_bat'), T.floor(), T.floor(), T.down()],
  ];

  return {
    floorNumber: 12,
    name: '12F 中级神坛 (中级能力商店)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor13(): FloorData {
  const layout: Tile[][] = [
    [T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.wall(), T.lava(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.item('sword_sacred'), T.wall(), T.wall(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.lava(), T.wall(), T.wall(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.lava(), T.wall(), T.lava(), T.wall(), T.lava(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava()],
    [T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up()],
  ];

  return {
    floorNumber: 13,
    name: '13F 骑士长廊',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor14(): FloorData {
  const layout: Tile[][] = [
    [T.mon('orc_knight'), T.floor(), T.mon('orc_knight'), T.wall(), T.item('gem_blue'), T.item('key_yellow'), T.item('potion_red'), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow')],
    [T.floor(), T.mon('orc_knight'), T.floor(), T.wall(), T.mon('big_slime'), T.wall(), T.mon('orc_knight'), T.wall(), T.floor(), T.floor(), T.item('key_yellow')],
    [T.fakeWall(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.wall(), T.doorB(), T.wall(), T.wall(), T.doorB(), T.wall(), T.doorY(), T.wall(), T.floor(), T.mon('orc_knight'), T.floor()],
    [T.item('potion_red'), T.floor(), T.floor(), T.mon('big_bat'), T.floor(), T.mon('golem'), T.floor(), T.mon('big_bat'), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.mon('big_slime'), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.item('potion_red'), T.floor(), T.mon('orc')],
    [T.doorY(), T.wall(), T.doorY(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.mon('orc'), T.floor(), T.doorY(), T.floor(), T.mon('big_slime'), T.floor(), T.mon('big_slime'), T.floor()],
    [T.mon('senior_mage'), T.wall(), T.mon('senior_mage'), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.item('key_blue'), T.wall(), T.floor(), T.doorY(), T.floor(), T.up(), T.floor(), T.wall(), T.floor(), T.floor(), T.down()],
  ];

  return {
    floorNumber: 14,
    name: '14F 暗室秘门 (隐藏红钥匙)',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor15(): FloorData {
  const layout: Tile[][] = [
    [T.item('gem_blue'), T.mon('orc_knight'), T.floor(), T.doorY(), T.floor(), T.up(), T.floor(), T.fakeWall(), T.npc('elder'), T.floor(), T.floor()],
    [T.mon('orc'), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.mon('big_slime')],
    [T.floor(), T.floor(), T.mon('big_slime'), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('big_bat'), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.floor(), T.mon('giant_squid'), T.floor(), T.wall(), T.floor(), T.mon('big_bat'), T.floor()],
    [T.floor(), T.wall(), T.item('key_blue'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.doorY(), T.wall(), T.mon('senior_mage')],
    [T.mon('big_slime'), T.wall(), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.item('potion_blue')],
    [T.floor(), T.doorY(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall()],
    [T.mon('big_bat'), T.wall(), T.mon('big_bat'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('small_bat'), T.floor()],
    [T.floor(), T.mon('senior_mage'), T.floor(), T.wall(), T.floor(), T.down(), T.floor(), T.doorY(), T.mon('small_bat'), T.floor(), T.npc('trader')],
  ];

  return {
    floorNumber: 15,
    name: '15F 深渊魔窟 (大乌贼与十字镐)',
    layout,
    upStairsPos: { x: 5, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor16(): FloorData {
  const layout: Tile[][] = [
    [T.item('key_yellow'), T.mon('big_bat'), T.floor(), T.wall(), T.floor(), T.down(), T.floor(), T.wall(), T.floor(), T.floor(), T.mon('big_bat')],
    [T.item('key_yellow'), T.mon('senior_mage'), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.doorY(), T.mon('big_slime'), T.floor(), T.floor()],
    [T.item('key_yellow'), T.mon('big_bat'), T.floor(), T.wall(), T.mon('orc'), T.floor(), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.item('potion_red')],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.item('gem_red'), T.item('key_yellow'), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('orc'), T.floor()],
    [T.item('potion_red'), T.floor(), T.mon('golem'), T.doorY(), T.floor(), T.mon('orc_knight'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.item('gem_blue'), T.item('key_yellow'), T.floor(), T.wall(), T.floor(), T.floor(), T.item('key_yellow'), T.wall(), T.mon('big_bat'), T.floor(), T.item('key_blue')],
    [T.wall(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.floor(), T.mon('big_slime'), T.floor(), T.wall(), T.mon('big_bat'), T.floor(), T.mon('big_bat'), T.wall(), T.floor(), T.mon('senior_mage'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.doorY(), T.floor(), T.wall(), T.wall()],
    [T.npc('elder'), T.floor(), T.floor(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.mon('ghost'), T.fakeWall(), T.item('holy_water')],
  ];

  return {
    floorNumber: 16,
    name: '16F 幽冥哨卡',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 5, y: 0 },
    theme: 'dungeon',
  };
}

function getFloor17(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.item('gem_red'), T.floor(), T.item('gem_blue')],
    [T.floor(), T.item('sword_silver'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.item('potion_blue'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.mon('orc_knight'), T.wall(), T.mon('big_bat'), T.wall(), T.item('key_yellow'), T.floor(), T.item('key_yellow')],
    [T.wall(), T.doorI(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.doorI(), T.wall()],
    [T.mon('junior_guard'), T.floor(), T.mon('junior_guard'), T.wall(), T.doorY(), T.wall(), T.doorB(), T.wall(), T.mon('orc_knight'), T.floor(), T.mon('orc_knight')],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.doorI(), T.wall(), T.wall(), T.mon('orc'), T.wall(), T.mon('big_slime'), T.wall(), T.wall(), T.doorI(), T.wall()],
    [T.mon('junior_guard'), T.floor(), T.mon('junior_guard'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('orc'), T.floor(), T.mon('orc')],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.mon('senior_mage'), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.doorY(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.item('potion_red'), T.floor(), T.floor(), T.mon('big_bat'), T.floor(), T.down(), T.floor(), T.mon('big_bat'), T.floor(), T.floor(), T.item('potion_red')],
  ];

  return {
    floorNumber: 17,
    name: '17F 神兵圣地 (神兵银剑)',
    layout,
    upStairsPos: { x: 5, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor18(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.floor(), T.doorB(), T.floor(), T.down(), T.floor(), T.doorY(), T.mon('senior_mage'), T.floor(), T.item('key_yellow')],
    [T.floor(), T.floor(), T.npc('elder'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('big_slime'), T.item('key_yellow')],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.wall(), T.floor(), T.floor(), T.item('key_blue')],
    [T.floor(), T.item('potion_red'), T.floor(), T.doorY(), T.mon('orc_knight'), T.floor(), T.mon('orc_knight'), T.doorY(), T.mon('orc'), T.floor(), T.item('key_yellow')],
    [T.mon('golem'), T.floor(), T.mon('golem'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('big_bat'), T.item('key_yellow')],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.mon('orc'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('golem'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.doorY()],
    [T.mon('senior_mage'), T.floor(), T.wall(), T.mon('big_bat'), T.mon('big_bat'), T.wall(), T.mon('big_slime'), T.mon('big_slime'), T.wall(), T.floor(), T.mon('senior_mage')],
    [T.floor(), T.item('key_yellow'), T.wall(), T.mon('big_bat'), T.mon('big_bat'), T.wall(), T.mon('big_slime'), T.mon('big_slime'), T.wall(), T.item('key_yellow'), T.floor()],
    [T.item('potion_red'), T.item('gem_red'), T.wall(), T.floor(), T.item('key_yellow'), T.wall(), T.item('key_yellow'), T.floor(), T.wall(), T.item('gem_blue'), T.item('potion_red')],
  ];

  return {
    floorNumber: 18,
    name: '18F 黑暗回廊',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 5, y: 0 },
    theme: 'dungeon',
  };
}

function getFloor19(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.mon('senior_mage'), T.floor(), T.item('key_blue'), T.wall(), T.item('key_yellow'), T.item('gem_red')],
    [T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.mon('big_bat'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.mon('orc_knight'), T.wall(), T.fakeWall(), T.wall(), T.mon('orc_knight'), T.wall(), T.doorY(), T.wall()],
    [T.mon('small_bat'), T.floor(), T.wall(), T.floor(), T.floor(), T.fakeWall(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.wall(), T.floor(), T.item('key_yellow'), T.wall(), T.mon('big_slime'), T.mon('big_slime')],
    [T.doorY(), T.wall(), T.wall(), T.floor(), T.mon('golem'), T.floor(), T.mon('golem'), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.mon('big_bat'), T.floor(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.floor(), T.mon('big_slime'), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('orc_knight'), T.floor(), T.floor(), T.mon('orc')],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('orc_knight'), T.wall(), T.wall(), T.item('potion_red'), T.item('key_yellow'), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.doorY(), T.item('key_yellow'), T.floor(), T.item('key_yellow'), T.wall(), T.wall(), T.wall(), T.mon('big_bat')],
    [T.mon('big_slime'), T.floor(), T.mon('big_bat'), T.wall(), T.floor(), T.up(), T.floor(), T.doorY(), T.floor(), T.mon('small_bat'), T.floor()],
  ];

  return {
    floorNumber: 19,
    name: '19F 圣光遗迹 (神圣十字架)',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'dungeon',
  };
}

function getFloor20(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.item('gem_red'), T.item('gem_blue'), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.item('potion_red'), T.item('potion_blue')],
    [T.item('key_yellow'), T.floor(), T.wall(), T.floor(), T.mon('big_bat'), T.mon('big_bat'), T.mon('big_bat'), T.floor(), T.wall(), T.floor(), T.item('key_yellow')],
    [T.wall(), T.doorB(), T.wall(), T.floor(), T.mon('big_bat'), T.floor(), T.mon('big_bat'), T.floor(), T.wall(), T.doorB(), T.wall()],
    [T.mon('small_bat'), T.floor(), T.wall(), T.floor(), T.mon('big_bat'), T.mon('big_bat'), T.mon('big_bat'), T.floor(), T.wall(), T.floor(), T.mon('small_bat')],
    [T.floor(), T.mon('small_bat'), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('small_bat'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.mon('golem'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('golem'), T.floor()],
    [T.item('potion_red'), T.floor(), T.floor(), T.mon('senior_mage'), T.floor(), T.down(), T.floor(), T.mon('senior_mage'), T.floor(), T.floor(), T.item('potion_red')],
  ];

  return {
    floorNumber: 20,
    name: '20F 幽冥王座 (决战吸血鬼)',
    layout,
    upStairsPos: { x: 5, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'dungeon',
  };
}

function getFloor21(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.npc('elder'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 21,
    name: '21F 熔岩之门',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 5, y: 0 },
    theme: 'magma',
  };
}

function getFloor22(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.down(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
  ];

  return {
    floorNumber: 22,
    name: '22F 炽热走廊',
    layout,
    upStairsPos: { x: 5, y: 5 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'magma',
  };
}

function getFloor23(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall()],
    [T.fakeWall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.down(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.wall(), T.fakeWall(), T.fakeWall(), T.wall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.fakeWall(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.fakeWall(), T.wall()],
    [T.wall(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall()],
    [T.up(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
  ];

  return {
    floorNumber: 23,
    name: '23F 熔岩裂隙',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 5, y: 5 },
    theme: 'magma',
  };
}

function getFloor24(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.npc('elder'), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 24,
    name: '24F 烈焰熔炉',
    layout,
    upStairsPos: { x: 1, y: 9 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'magma',
  };
}

function getFloor25(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.mon('archmage'), T.floor(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.down(), T.floor(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.up(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 25,
    name: '25F 禁忌秘殿 (决战大法师)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 1, y: 9 },
    theme: 'magma',
  };
}

function getFloor26(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.lava(), T.lava(), T.npc('princess'), T.lava(), T.lava(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.lava(), T.lava(), T.lava(), T.lava(), T.lava(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.lava(), T.doorR(), T.lava(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 26,
    name: '26F 冰封火海 (寒冰雪花)',
    layout,
    upStairsPos: { x: 1, y: 9 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'magma',
  };
}

function getFloor27(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.npc('elder'), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.down(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up()],
  ];

  return {
    floorNumber: 27,
    name: '27F 烈火深渊',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 1, y: 9 },
    theme: 'magma',
  };
}

function getFloor28(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.npc('trader'), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.up(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.down()],
  ];

  return {
    floorNumber: 28,
    name: '28F 熔岩要塞',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'magma',
  };
}

function getFloor29(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.npc('elder'), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.down(), T.floor(), T.wall(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.floor(), T.npc('trader')],
  ];

  return {
    floorNumber: 29,
    name: '29F 骑士之路',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'magma',
  };
}

function getFloor30(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.floor(), T.mon('big_slime'), T.mon('red_slime'), T.mon('green_slime'), T.floor(), T.mon('green_slime'), T.mon('red_slime'), T.mon('big_slime'), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
  ];

  return {
    floorNumber: 30,
    name: '30F 通天之阶',
    layout,
    upStairsPos: { x: 5, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'magma',
  };
}

function getFloor31(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.down(), T.wall(), T.floor(), T.floor(), T.item('potion_red'), T.npc('elder')],
    [T.mon('dual_swordsman'), T.floor(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.mon('warrior'), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.mon('warrior'), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.doorY(), T.wall(), T.mon('ghost_soldier'), T.mon('ghost_soldier')],
    [T.floor(), T.floor(), T.doorY(), T.item('key_blue'), T.wall(), T.floor(), T.wall(), T.item('gem_red'), T.wall(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.mon('ghost_soldier'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('ghost_soldier'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.floor(), T.wall(), T.item('gem_blue'), T.wall(), T.mon('orc_knight'), T.wall(), T.item('potion_blue'), T.doorY(), T.floor(), T.floor()],
    [T.mon('ghost_soldier'), T.mon('ghost_soldier'), T.wall(), T.doorY(), T.wall(), T.mon('orc_knight'), T.wall(), T.wall(), T.wall(), T.mon('ghost'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.mon('knight'), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.floor(), T.mon('ghost')],
    [T.npc('trader'), T.item('potion_red'), T.floor(), T.floor(), T.wall(), T.up(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 31,
    name: '31F 黑暗走廊',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 5, y: 0 },
    theme: 'dark',
  };
}

function getFloor32(): FloorData {
  const layout: Tile[][] = [
    [T.item('gem_blue'), T.floor(), T.doorB(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up()],
    [T.floor(), T.item('gem_red'), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.mon('warrior'), T.floor(), T.mon('ghost'), T.floor(), T.wall(), T.floor(), T.wall(), T.mon('ghost_soldier'), T.wall(), T.item('key_yellow'), T.item('potion_blue')],
    [T.floor(), T.item('key_yellow'), T.floor(), T.mon('ghost'), T.wall(), T.floor(), T.wall(), T.floor(), T.doorY(), T.floor(), T.item('key_yellow')],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.mon('knight'), T.wall(), T.item('key_yellow'), T.item('key_blue')],
    [T.floor(), T.floor(), T.floor(), T.item('key_blue'), T.wall(), T.floor(), T.wall(), T.floor(), T.doorY(), T.floor(), T.item('key_yellow')],
    [T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.mon('mid_guard'), T.floor(), T.mon('mid_guard'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.shop(), T.shop(), T.shop()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.down(), T.floor(), T.wall(), T.mon('ghost_soldier'), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 32,
    name: '32F 高级神坛 (高级能力商店)',
    layout,
    upStairsPos: { x: 10, y: 0 },
    downStairsPos: { x: 4, y: 10 },
    theme: 'dark',
  };
}

function getFloor33(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.doorY(), T.mon('orc_knight'), T.floor(), T.mon('ghost'), T.doorY(), T.floor(), T.floor(), T.floor(), T.down()],
    [T.floor(), T.floor(), T.wall(), T.floor(), T.item('potion_red'), T.floor(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall()],
    [T.doorB(), T.wall(), T.wall(), T.npc('elder'), T.floor(), T.item('key_yellow'), T.wall(), T.floor(), T.floor(), T.floor(), T.item('potion_blue')],
    [T.floor(), T.item('potion_red'), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall()],
    [T.mon('ghost'), T.floor(), T.wall(), T.floor(), T.floor(), T.mon('orc_knight'), T.floor(), T.wall(), T.mon('ghost_soldier'), T.floor(), T.mon('ghost_soldier')],
    [T.floor(), T.floor(), T.wall(), T.mon('dual_swordsman'), T.wall(), T.wall(), T.doorY(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.mon('ghost'), T.doorY(), T.floor(), T.floor(), T.mon('ghost_soldier'), T.floor(), T.wall(), T.mon('warrior'), T.floor(), T.mon('warrior')],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.fakeWall(), T.wall()],
    [T.floor(), T.floor(), T.mon('orc_knight'), T.wall(), T.floor(), T.mon('warrior'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.mon('dual_swordsman'), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.mon('ghost'), T.fakeWall(), T.floor(), T.item('sword_knight'), T.floor()],
    [T.item('key_yellow'), T.mon('warrior'), T.floor(), T.doorB(), T.floor(), T.doorY(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 33,
    name: '33F 幽暗剑冢 (神兵骑士剑)',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 10, y: 0 },
    theme: 'dark',
  };
}

function getFloor34(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.item('potion_red'), T.wall(), T.floor(), T.item('key_yellow'), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('gem_blue')],
    [T.floor(), T.floor(), T.floor(), T.doorY(), T.mon('ghost'), T.floor(), T.mon('knight'), T.doorY(), T.floor(), T.item('key_yellow'), T.item('potion_red')],
    [T.floor(), T.mon('ghost'), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.doorY(), T.wall(), T.wall(), T.mon('green_slime'), T.wall(), T.mon('dual_swordsman'), T.wall(), T.mon('big_slime'), T.wall(), T.mon('warrior')],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY()],
    [T.wall(), T.doorY(), T.wall(), T.wall(), T.mon('ghost_soldier'), T.wall(), T.mon('red_slime'), T.wall(), T.mon('knight'), T.wall(), T.mon('small_bat')],
    [T.floor(), T.floor(), T.mon('ghost_soldier'), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.mon('dual_swordsman'), T.wall(), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.doorY(), T.mon('warrior'), T.floor(), T.item('potion_red')],
    [T.item('potion_blue'), T.mon('warrior'), T.floor(), T.wall(), T.floor(), T.up(), T.floor(), T.wall(), T.floor(), T.item('key_yellow'), T.item('gem_red')],
  ];

  return {
    floorNumber: 34,
    name: '34F 八卦阵列',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'dark',
  };
}

function getFloor35(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up()],
    [T.fakeWall(), T.fakeWall(), T.fakeWall(), T.fakeWall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.floor(), T.mon('dragon'), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.fakeWall(), T.fakeWall(), T.fakeWall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.down(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall()],
  ];

  return {
    floorNumber: 35,
    name: '35F 龙之巢穴 (决战远古魔龙)',
    layout,
    upStairsPos: { x: 10, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'dark',
  };
}

function getFloor36(): FloorData {
  const layout: Tile[][] = [
    [T.npc('elder'), T.floor(), T.mon('warrior'), T.floor(), T.floor(), T.floor(), T.mon('orc_knight'), T.floor(), T.mon('knight'), T.floor(), T.down()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.mon('ghost'), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('ghost')],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.mon('knight'), T.wall(), T.wall(), T.wall(), T.floor(), T.mon('ghost_soldier'), T.floor(), T.wall(), T.wall(), T.wall(), T.mon('dual_swordsman')],
    [T.floor(), T.doorY(), T.floor(), T.floor(), T.mon('ghost'), T.floor(), T.mon('ghost'), T.floor(), T.floor(), T.doorY(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.mon('knight'), T.floor(), T.wall(), T.wall(), T.wall(), T.mon('knight')],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.mon('dual_swordsman'), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.item('potion_blue'), T.floor(), T.mon('warrior'), T.floor(), T.item('key_yellow'), T.floor(), T.mon('orc_knight'), T.floor(), T.mon('dual_swordsman'), T.floor(), T.up()],
  ];

  return {
    floorNumber: 36,
    name: '36F 封印迷宫',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 10, y: 0 },
    theme: 'dark',
  };
}

function getFloor37(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('warrior'), T.floor(), T.item('potion_blue')],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.doorB(), T.wall(), T.wall(), T.item('potion_red'), T.item('potion_red'), T.wall(), T.item('potion_red'), T.item('potion_red'), T.wall(), T.wall(), T.mon('knight')],
    [T.floor(), T.wall(), T.item('potion_red'), T.item('potion_red'), T.item('key_yellow'), T.wall(), T.item('potion_red'), T.item('potion_red'), T.item('potion_red'), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('bomb'), T.wall(), T.item('key_red'), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor()],
    [T.item('potion_red'), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('dual_swordsman')],
    [T.floor(), T.wall(), T.item('gem_blue'), T.item('gem_red'), T.item('potion_blue'), T.wall(), T.item('gem_red'), T.item('gem_red'), T.item('gem_red'), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.item('gem_blue'), T.item('gem_blue'), T.item('gem_blue'), T.wall(), T.floor()],
    [T.mon('warrior'), T.wall(), T.wall(), T.item('key_blue'), T.item('key_blue'), T.wall(), T.item('potion_blue'), T.item('key_yellow'), T.wall(), T.wall(), T.mon('knight')],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.npc('elder'), T.floor(), T.mon('ghost_soldier'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('ghost_soldier'), T.floor(), T.down()],
  ];

  return {
    floorNumber: 37,
    name: '37F 坚不可摧',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'dark',
  };
}

function getFloor38(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.doorR(), T.mon('ghost'), T.floor(), T.floor(), T.floor(), T.mon('ghost'), T.doorY(), T.floor(), T.up()],
    [T.floor(), T.floor(), T.wall(), T.npc('elder'), T.item('key_yellow'), T.npc('trader'), T.floor(), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.mon('ghost_soldier'), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.floor(), T.mon('warrior'), T.mon('warrior'), T.floor(), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.doorB(), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.doorB(), T.doorB(), T.wall(), T.mon('ghost_soldier'), T.wall(), T.item('key_yellow'), T.wall(), T.mon('ghost_soldier')],
    [T.floor(), T.item('shield_knight'), T.floor(), T.wall(), T.wall(), T.wall(), T.mon('dual_swordsman'), T.wall(), T.floor(), T.mon('knight'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.item('gem_blue'), T.item('potion_red'), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.wall(), T.doorI(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.item('key_yellow'), T.floor(), T.mon('ghost_soldier')],
    [T.mon('mid_guard'), T.floor(), T.mon('mid_guard'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.mon('knight'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.doorY(), T.mon('dual_swordsman'), T.floor(), T.mon('orc_knight'), T.doorY(), T.mon('warrior'), T.floor(), T.item('potion_blue')],
  ];

  return {
    floorNumber: 38,
    name: '38F 骑士迷阵 (神兵骑士盾)',
    layout,
    upStairsPos: { x: 10, y: 0 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'dark',
  };
}

function getFloor39(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.down()],
    [T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.wall(), T.npc('trader'), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.item('key_yellow')],
    [T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.mon('warrior')],
    [T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.doorY(), T.floor(), T.wall(), T.mon('ghost'), T.wall(), T.item('gem_red')],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.mon('ghost_soldier')],
    [T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall()],
    [T.floor(), T.floor(), T.mon('ghost_soldier'), T.wall(), T.mon('dual_swordsman'), T.item('gem_blue'), T.mon('knight'), T.wall(), T.floor(), T.mon('knight'), T.floor()],
    [T.wall(), T.mon('ghost_soldier'), T.floor(), T.doorY(), T.floor(), T.wall(), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor()],
    [T.npc('elder'), T.floor(), T.item('key_yellow'), T.wall(), T.floor(), T.mon('ghost'), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.up()],
  ];

  return {
    floorNumber: 39,
    name: '39F 命运之门',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 10, y: 0 },
    theme: 'dark',
  };
}

function getFloor40(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('knight_captain'), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.mon('dual_swordsman'), T.mon('dual_swordsman'), T.mon('dual_swordsman'), T.floor(), T.floor(), T.floor(), T.mon('knight'), T.mon('knight'), T.mon('knight'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.mon('ghost_soldier'), T.mon('ghost_soldier'), T.mon('ghost_soldier'), T.floor(), T.mon('warrior'), T.mon('warrior'), T.mon('warrior'), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorR(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.item('gem_blue'), T.item('key_yellow'), T.floor(), T.wall(), T.mon('ghost'), T.floor(), T.mon('ghost'), T.wall(), T.item('potion_red'), T.mon('dual_swordsman'), T.floor()],
    [T.item('potion_blue'), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('warrior'), T.floor(), T.floor()],
    [T.item('gem_red'), T.floor(), T.mon('knight'), T.doorB(), T.floor(), T.floor(), T.floor(), T.doorY(), T.floor(), T.floor(), T.down()],
  ];

  return {
    floorNumber: 40,
    name: '40F 冥界军团 (决战骑士队长)',
    layout,
    upStairsPos: { x: 5, y: 0 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'dark',
  };
}

function getFloor41(): FloorData {
  const layout: Tile[][] = [
    [T.item('potion_red'), T.wall(), T.floor(), T.item('key_blue'), T.wall(), T.down(), T.wall(), T.item('key_blue'), T.floor(), T.wall(), T.item('potion_red')],
    [T.doorY(), T.mon('senior_wizard'), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.fakeWall(), T.doorY()],
    [T.doorY(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.doorY()],
    [T.doorY(), T.wall(), T.doorY(), T.wall(), T.mon('magic_guard'), T.floor(), T.mon('magic_guard'), T.wall(), T.doorY(), T.wall(), T.doorY()],
    [T.floor(), T.floor(), T.mon('junior_wizard'), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.mon('junior_wizard'), T.floor(), T.floor()],
    [T.mon('red_bat'), T.floor(), T.floor(), T.floor(), T.doorB(), T.npc('elder'), T.doorB(), T.floor(), T.floor(), T.floor(), T.mon('red_bat')],
    [T.floor(), T.mon('red_bat'), T.floor(), T.mon('slime_king'), T.wall(), T.doorY(), T.wall(), T.mon('slime_king'), T.floor(), T.mon('red_bat'), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.doorY(), T.wall(), T.wall(), T.doorY()],
    [T.doorY(), T.wall(), T.item('potion_red'), T.floor(), T.wall(), T.doorY(), T.wall(), T.floor(), T.item('potion_red'), T.wall(), T.doorY()],
    [T.doorY(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.doorY()],
    [T.item('potion_blue'), T.wall(), T.item('key_yellow'), T.item('gem_red'), T.wall(), T.up(), T.wall(), T.item('gem_blue'), T.item('key_yellow'), T.wall(), T.item('potion_blue')],
  ];

  return {
    floorNumber: 41,
    name: '41F 圣殿回廊',
    layout,
    upStairsPos: { x: 5, y: 10 },
    downStairsPos: { x: 5, y: 0 },
    theme: 'celestial',
  };
}

function getFloor42(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.item('key_red'), T.wall(), T.item('key_yellow'), T.item('key_blue'), T.item('key_yellow')],
    [T.floor(), T.floor(), T.mon('slime_king'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow')],
    [T.wall(), T.wall(), T.doorY(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall()],
    [T.npc('elder'), T.floor(), T.floor(), T.wall(), T.wall(), T.mon('dark_knight'), T.wall(), T.wall(), T.mon('junior_wizard'), T.floor(), T.mon('senior_wizard')],
    [T.floor(), T.floor(), T.mon('slime_king'), T.doorY(), T.floor(), T.floor(), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor()],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.floor(), T.mon('junior_wizard')],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall()],
    [T.wall(), T.wall(), T.mon('red_bat'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.mon('magic_guard'), T.floor(), T.mon('magic_guard')],
    [T.item('potion_blue'), T.item('key_yellow'), T.item('key_yellow'), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall()],
    [T.mon('red_bat'), T.wall(), T.wall(), T.wall(), T.floor(), T.mon('knight_captain'), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_yellow'), T.item('key_yellow')],
    [T.item('key_yellow'), T.item('key_yellow'), T.item('gem_blue'), T.wall(), T.floor(), T.down(), T.floor(), T.wall(), T.item('key_yellow'), T.item('key_blue'), T.item('key_yellow')],
  ];

  return {
    floorNumber: 42,
    name: '42F 天空之阶',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 5, y: 10 },
    theme: 'celestial',
  };
}

function getFloor43(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.doorY(), T.floor(), T.mon('slime_king'), T.floor(), T.doorY(), T.doorY(), T.mon('magic_guard'), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.doorY(), T.floor(), T.wall(), T.mon('dark_knight'), T.wall(), T.mon('dark_knight'), T.floor(), T.wall(), T.floor()],
    [T.doorB(), T.wall(), T.wall(), T.mon('senior_wizard'), T.wall(), T.floor(), T.mon('dark_knight'), T.wall(), T.item('shield_holy'), T.wall(), T.floor()],
    [T.floor(), T.mon('slime_king'), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.doorY(), T.wall(), T.wall(), T.item('potion_blue'), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.mon('slime_king'), T.floor(), T.floor(), T.wall(), T.mon('junior_wizard'), T.floor(), T.item('potion_red')],
    [T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.item('key_yellow'), T.floor()],
    [T.floor(), T.mon('red_bat'), T.wall(), T.item('potion_blue'), T.floor(), T.mon('dark_knight'), T.floor(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.floor(), T.wall(), T.item('potion_blue'), T.wall(), T.wall(), T.floor(), T.doorY(), T.floor(), T.mon('red_bat'), T.floor()],
    [T.up(), T.floor(), T.wall(), T.item('potion_blue'), T.floor(), T.doorB(), T.floor(), T.wall(), T.floor(), T.floor(), T.item('key_blue')],
  ];

  return {
    floorNumber: 43,
    name: '43F 圣殿守卫 (神兵圣盾)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'celestial',
  };
}

function getFloor44(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.item('potion_red'), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.wall(), T.wall(), T.item('potion_red'), T.item('shield_sacred'), T.item('potion_red'), T.wall(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.item('potion_red'), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.doorI(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.mon('senior_guard'), T.floor(), T.mon('senior_guard'), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 44,
    name: '44F 神秘星空 (神圣神盾)',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'celestial',
  };
}

function getFloor45(): FloorData {
  const layout: Tile[][] = [
    [T.down(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.up()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.item('gem_red'), T.item('gem_red'), T.floor(), T.wall(), T.mon('junior_wizard'), T.floor(), T.mon('senior_wizard'), T.wall(), T.npc('trader'), T.floor(), T.floor()],
    [T.doorB(), T.wall(), T.mon('dark_knight'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor(), T.mon('slime_king')],
    [T.item('gem_blue'), T.item('gem_blue'), T.floor(), T.wall(), T.mon('senior_wizard'), T.floor(), T.mon('junior_wizard'), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.doorB(), T.wall(), T.mon('dark_knight'), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.npc('elder'), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.doorY(), T.floor(), T.floor(), T.mon('red_bat'), T.floor(), T.floor(), T.floor(), T.item('key_yellow')],
    [T.wall(), T.doorR(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('senior_wizard'), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.mon('dark_knight'), T.floor(), T.wall(), T.mon('magic_guard'), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.item('up_fly'), T.floor(), T.doorI(), T.floor(), T.floor(), T.doorI(), T.floor(), T.doorY(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.mon('dark_knight'), T.floor(), T.wall(), T.mon('magic_guard'), T.wall(), T.floor(), T.item('potion_blue')],
  ];

  return {
    floorNumber: 45,
    name: '45F 天界回音',
    layout,
    upStairsPos: { x: 10, y: 0 },
    downStairsPos: { x: 0, y: 0 },
    theme: 'celestial',
  };
}

function getFloor46(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.mon('senior_wizard'), T.doorY(), T.floor(), T.shop(), T.shop(), T.shop(), T.floor(), T.doorB(), T.floor(), T.down()],
    [T.item('potion_red'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.item('gem_red'), T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.mon('junior_wizard'), T.doorY(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.mon('red_bat'), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.mon('warrior'), T.floor(), T.mon('dual_swordsman'), T.floor(), T.mon('knight'), T.wall(), T.item('potion_red'), T.floor(), T.doorY(), T.mon('slime_king'), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.mon('senior_wizard'), T.wall(), T.floor(), T.floor()],
    [T.mon('orc'), T.wall(), T.item('key_gold'), T.wall(), T.mon('slime_king'), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.mon('junior_wizard'), T.floor(), T.wall(), T.floor(), T.npc('elder'), T.wall(), T.mon('junior_wizard'), T.floor()],
    [T.mon('big_bat'), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.mon('skeleton'), T.floor(), T.mon('red_slime'), T.floor(), T.doorB(), T.floor(), T.floor(), T.doorY(), T.floor(), T.up()],
  ];

  return {
    floorNumber: 46,
    name: '46F 终极神坛 (神级能力商店)',
    layout,
    upStairsPos: { x: 10, y: 10 },
    downStairsPos: { x: 10, y: 0 },
    theme: 'celestial',
  };
}

function getFloor47(): FloorData {
  const layout: Tile[][] = [
    [T.up(), T.floor(), T.doorB(), T.floor(), T.floor(), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.item('key_yellow')],
    [T.floor(), T.floor(), T.wall(), T.floor(), T.npc('trader'), T.floor(), T.wall(), T.mon('senior_wizard'), T.wall(), T.wall(), T.item('gem_blue')],
    [T.floor(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor(), T.mon('slime_king'), T.floor(), T.item('key_yellow')],
    [T.floor(), T.wall(), T.floor(), T.doorY(), T.mon('senior_wizard'), T.floor(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.wall(), T.mon('red_bat'), T.wall(), T.floor(), T.mon('junior_wizard'), T.wall(), T.floor(), T.mon('junior_wizard'), T.floor(), T.floor()],
    [T.floor(), T.doorY(), T.floor(), T.wall(), T.floor(), T.floor(), T.wall(), T.item('key_yellow'), T.floor(), T.floor(), T.mon('red_bat')],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.item('key_blue'), T.item('key_yellow'), T.wall(), T.wall(), T.wall(), T.wall(), T.doorY()],
    [T.floor(), T.wall(), T.floor(), T.doorB(), T.item('gem_red'), T.item('gem_blue'), T.wall(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.mon('senior_wizard'), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.mon('slime_king'), T.wall(), T.wall(), T.wall()],
    [T.floor(), T.floor(), T.wall(), T.item('potion_red'), T.floor(), T.item('gem_red'), T.wall(), T.npc('elder'), T.wall(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.doorY(), T.floor(), T.mon('junior_wizard'), T.floor(), T.doorY(), T.floor(), T.floor(), T.floor(), T.down()],
  ];

  return {
    floorNumber: 47,
    name: '47F 圣堂之光 (神兵圣光剑)',
    layout,
    upStairsPos: { x: 0, y: 0 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'celestial',
  };
}

function getFloor48(): FloorData {
  const layout: Tile[][] = [
    [T.floor(), T.item('potion_blue'), T.floor(), T.wall(), T.floor(), T.floor(), T.item('potion_red'), T.item('potion_red'), T.item('potion_red'), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.npc('elder'), T.wall(), T.doorB(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.doorB()],
    [T.floor(), T.mon('senior_wizard'), T.floor(), T.wall(), T.floor(), T.wall(), T.mon('magic_guard'), T.wall(), T.mon('magic_guard'), T.wall(), T.floor()],
    [T.wall(), T.doorB(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.floor(), T.mon('slime_king'), T.floor(), T.floor(), T.wall(), T.mon('magic_guard'), T.wall(), T.mon('magic_guard'), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.floor()],
    [T.mon('red_bat'), T.wall(), T.floor(), T.mon('junior_wizard'), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.mon('junior_wizard'), T.floor()],
    [T.floor(), T.wall(), T.item('gem_red'), T.floor(), T.item('potion_red'), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.floor()],
    [T.mon('junior_wizard'), T.wall(), T.wall(), T.doorY(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.mon('dark_knight'), T.floor(), T.wall(), T.floor(), T.item('sword_holy'), T.floor(), T.wall(), T.floor()],
    [T.up(), T.wall(), T.item('gem_blue'), T.floor(), T.item('potion_blue'), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.down()],
  ];

  return {
    floorNumber: 48,
    name: '48F 圣神宝藏 (神圣神剑)',
    layout,
    upStairsPos: { x: 0, y: 10 },
    downStairsPos: { x: 10, y: 10 },
    theme: 'celestial',
  };
}

function getFloor49(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall()],
    [T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.up(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.wall(), T.floor(), T.wall(), T.mon('dark_knight'), T.floor(), T.mon('dark_knight'), T.wall(), T.floor(), T.wall(), T.floor()],
    [T.floor(), T.floor(), T.floor(), T.wall(), T.wall(), T.doorI(), T.wall(), T.wall(), T.floor(), T.floor(), T.floor()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.mon('senior_wizard'), T.floor(), T.mon('senior_wizard'), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.down(), T.floor(), T.doorR(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor()],
  ];

  return {
    floorNumber: 49,
    name: '49F 假面王座 (决战假魔王)',
    layout,
    upStairsPos: { x: 5, y: 5 },
    downStairsPos: { x: 0, y: 10 },
    theme: 'celestial',
  };
}

function getFloor50(): FloorData {
  const layout: Tile[][] = [
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.mon('demon_lord'), T.floor(), T.floor(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.wall(), T.floor(), T.floor(), T.floor(), T.wall(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.floor(), T.floor(), T.floor(), T.down(), T.floor(), T.floor(), T.floor(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
    [T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall(), T.wall()],
  ];

  return {
    floorNumber: 50,
    name: '50F 魔塔之巅 (决战真魔王杰诺)',
    layout,
    upStairsPos: { x: 5, y: 8 },
    downStairsPos: { x: 5, y: 8 },
    theme: 'celestial',
  };
}

export const ALL_FLOORS: Record<number, () => FloorData> = {
  0: getFloor0,
  1: getFloor1,
  2: getFloor2,
  3: getFloor3,
  4: getFloor4,
  5: getFloor5,
  6: getFloor6,
  7: getFloor7,
  8: getFloor8,
  9: getFloor9,
  10: getFloor10,
  11: getFloor11,
  12: getFloor12,
  13: getFloor13,
  14: getFloor14,
  15: getFloor15,
  16: getFloor16,
  17: getFloor17,
  18: getFloor18,
  19: getFloor19,
  20: getFloor20,
  21: getFloor21,
  22: getFloor22,
  23: getFloor23,
  24: getFloor24,
  25: getFloor25,
  26: getFloor26,
  27: getFloor27,
  28: getFloor28,
  29: getFloor29,
  30: getFloor30,
  31: getFloor31,
  32: getFloor32,
  33: getFloor33,
  34: getFloor34,
  35: getFloor35,
  36: getFloor36,
  37: getFloor37,
  38: getFloor38,
  39: getFloor39,
  40: getFloor40,
  41: getFloor41,
  42: getFloor42,
  43: getFloor43,
  44: getFloor44,
  45: getFloor45,
  46: getFloor46,
  47: getFloor47,
  48: getFloor48,
  49: getFloor49,
  50: getFloor50,
};

export function getFloor(floorNum: number): FloorData {
  if (ALL_FLOORS[floorNum]) {
    return ALL_FLOORS[floorNum]();
  }
  return ALL_FLOORS[1]();
}
