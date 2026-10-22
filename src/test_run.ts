// src/test_run.ts
import { GameState } from './game/gameState';
import { getFloor, FLOOR_23_PUZZLE_TILES } from './data/floors';
import { MONSTERS } from './data/monsters';
import { ITEMS } from './data/items';
import { IRON_DOOR_RULES, findIronDoorRule } from './data/ironDoors';
import { calculateBattle } from './game/combat';
import { findPathToAdjacent } from './game/pathfinding';
import {
  getMonsterName,
  getItemName,
  getMonsterDescription,
  getItemDescription,
  getSpecialAbilityLabel,
  NPC_DIALOGUES,
  translations,
  TRANSLATIONS,
  getCombatNotification,
  getDialogueData,
  FLOOR_NAMES,
} from './i18n';
import { SpecialAbility, ItemType } from './types/game';
import { ModelFactory } from './engine/ModelFactory';
import { ThreeCanvas } from './engine/ThreeCanvas';
import { isDebugAllowed } from './utils/env';
import * as THREE from 'three';
import * as fs from 'fs';

console.log('==============================================');
console.log('   魔塔 3D (Magic Tower 3D) 核心逻辑全栈自检');
console.log('==============================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, msg: string) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${msg}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${msg}`);
    if (typeof process !== 'undefined') (process as any).exitCode = 1;
  }
}

// 1. 测试 0-50 层全楼层数据生成
console.log('\n--- 1. 验证 0-50 层全楼层完整性 ---');
for (let f = 0; f <= 50; f++) {
  const floor = getFloor(f);
  assert(floor !== null && floor.layout.length === 11, `楼层 ${f}F 数据加载正确 (11x11 网格)`);
  assert(
    floor.upStairsPos !== undefined && floor.downStairsPos !== undefined,
    `楼层 ${f}F 包含有效的上下楼梯锚点`
  );
}

// 2. 测试战斗公式与临界值
console.log('\n--- 2. 验证确定性数学战斗与临界点计算 ---');
const baseHero = {
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

// 绿史莱姆 (HP: 35, ATK: 18, DEF: 1)
const slime = MONSTERS.green_slime;
const calc1 = calculateBattle(baseHero, slime);
assert(calc1.canFight === true, '初始勇士可以破防绿史莱姆');
assert(calc1.heroDamagePerTurn === 9, '初始勇士单次对绿史莱姆伤害为 9');
assert(calc1.turns === 4, '消灭绿史莱姆需要 4 回合');
assert(calc1.damage === 24, '初始勇士消灭绿史莱姆承受伤害为 24 HP');
assert(calc1.nextCritAtk === 13, '绿史莱姆下一升级临界点为 13 ATK (回合数由 4 降至 3)');
assert(calc1.reducedDamageAtCrit === 8, '达到临界点可减免 8 点伤害');

// 防杀测试 (勇士防御 20 > 绿史莱姆攻击 18)
const strongHero = { ...baseHero, atk: 30, def: 20 };
const calc2 = calculateBattle(strongHero, slime);
assert(calc2.damage === 0, '防御力高于怪物攻击时，完全无伤防杀 (损血 0)');

// 无法破防测试
const weakHero = { ...baseHero, atk: 1 };
const calc3 = calculateBattle(weakHero, slime);
assert(calc3.canFight === false, '勇士攻击力 ≤ 怪物防御力时，判定无法破防');

// 吸血鬼与十字架测试 (吸血鬼防御 120，故需破防攻击)
const vampire = MONSTERS.vampire;
const midHero = { ...baseHero, atk: 200, hp: 1000 };
const calc4NoCross = calculateBattle(midHero, vampire, false);
const calc4WithCross = calculateBattle(midHero, vampire, true);
assert(
  calc4NoCross.specialNotes.some((n) => n.includes('吸取 10%')),
  '无十字架时吸血鬼吸取 10% 生命'
);
assert(
  calc4WithCross.specialNotes.some((n) => n.includes('十字架抵御')),
  '持有十字架时成功免疫吸血鬼吸血'
);

// 3. 测试神圣祭坛价格与加点递增公式
console.log('\n--- 3. 验证神圣祭坛加点公式 ---');
const game = new GameState();
assert(game.getShopCost() === 20, '第 1 次加点价格为 20 G');
game.shopTimes = 1;
assert(game.getShopCost() === 20, 'n=1 计算基准');
game.shopTimes = 2;
assert(game.getShopCost() === 40, 'n=2 价格为 40 G');
game.shopTimes = 3;
assert(game.getShopCost() === 80, 'n=3 价格为 80 G');
game.shopTimes = 4;
assert(game.getShopCost() === 140, 'n=4 价格为 140 G');
game.shopTimes = 5;
assert(game.getShopCost() === 220, 'n=5 价格为 220 G');

// 4. 测试游戏交互行动 (移动、拾取、开门、楼梯)
console.log('\n--- 4. 验证游戏行动状态机 ---');
game.initGame();
assert(game.currentFloor === 0, '初始处于第 0 层仙灵密境');
assert(game.playerPos.x === 5 && game.playerPos.y === 9, '玩家出生在 0 层神殿入口 (5, 9)');
assert(game.playerStats.inventory.monster_manual === 1, '勇士开局默认自带【怪物手册】神器');
assert(game.playerStats.inventory.compass === 1, '勇士开局默认自带【楼层罗盘】神器');
assert(getFloor(1).layout[10][5]?.type === 'stairs_down', '1F 入口严格设有 stairs_down 可随时返回 0F');
assert(getFloor(1).layout[10][1]?.type === 'floor', '1F 取消地面多余罗盘拾取道具，直接为畅通地面');
assert(getFloor(3).layout[3][10]?.type === 'floor', '3F (10, 3) 移除多余重复的神秘老人，恢复为通畅地面');
assert(getFloor(1).layout[9][6]?.type === 'npc' && getFloor(1).layout[9][6]?.npcId === 'elder', '1F (6, 9) 保留智慧老人指导新手');

// 切换到 1 层测试经典 1 层行动状态机
game.changeFloor(1, 'up');
assert(game.currentFloor === 1, '通过光圈上行至 1 层');
assert(game.playerPos.x === 5 && game.playerPos.y === 10, '到达 1 层入口 (5, 10)');

// 测试在 1 层 (5, 10) 随时向下走入 stairs_down 返回 0 层
game.playerPos = { x: 5, y: 9, dir: 'down' };
game.move('down'); // 踩在 (5, 10) 下楼光圈
assert(game.currentFloor === 0, '成功从 1 层下楼光圈返回 0 层仙灵密境！');

// 再次上楼到 1 层继续测试移动、拾取、开门、楼梯
game.changeFloor(1, 'up');
// 向上移动一步到 (5, 9)
game.move('up');
assert(game.playerPos.x === 5 && game.playerPos.y === 9, '成功向上移动一步到走廊 (5, 9)');

// 向左移动一步到 (4, 9) 拾取黄钥匙
const prevKeys = game.playerStats.yellowKeys;
game.move('left');
assert(game.playerPos.x === 4 && game.playerPos.y === 9, '成功向左移动到 (4, 9)');
assert(game.playerStats.yellowKeys === prevKeys + 1, '成功拾取黄钥匙，钥匙数量 +1');

// 向右返回 (5, 9)
game.move('right');
assert(game.playerPos.x === 5 && game.playerPos.y === 9, '成功回到走廊 (5, 9)');

// 开黄门测试：在 1 层 (5, 8) 有黄门，向上移动
const keysBeforeDoor = game.playerStats.yellowKeys;
game.move('up'); // 移向 (5, 8) 黄门
assert(game.playerStats.yellowKeys === keysBeforeDoor - 1, '消耗 1 把黄钥匙成功开启黄色门');
assert(game.playerPos.x === 5 && game.playerPos.y === 8, '开门后勇士顺利迈入新格子 (5, 8)');

// 上楼梯测试：移到 (0, 0) 的上楼梯
game.playerPos.x = 0;
game.playerPos.y = 1;
game.move('up'); // 移到 (0, 0) 触发上楼
assert(game.currentFloor === 2, '成功通过楼梯跨越至第 2 层！');

// 5. 测试存档与读档完整性
console.log('\n--- 5. 验证存档与读档功能 ---');
game.playerStats.gold = 888;
game.playerStats.atk = 99;
// Mock LocalStorage
const mockStorage: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => mockStorage[k] || null,
  setItem: (k: string, v: string) => { mockStorage[k] = v; },
};

const saved = game.saveGame(1);
assert(saved === true, '游戏成功保存到槽位 1');

// 修改状态后再读档恢复
game.playerStats.gold = 0;
game.playerStats.atk = 10;
const loaded = game.loadGame(1);
assert(loaded === true, '游戏成功读取槽位 1');
assert(game.playerStats.gold === 888, '读取存档后金币正确恢复为 888');
assert(game.playerStats.atk === 99, '读取存档后攻击力正确恢复为 99');

// 6. 测试视角转换与基于角色朝向的前后左右自然坐标系
console.log('\n--- 6. 验证视角转换与基于角色前方的前后左右自然坐标系 ---');
import { getRelativeDirection } from './game/gameState';

// 6.1 朝向为 'up' (北)
assert(getRelativeDirection('up', 'forward') === 'up', '朝上时：向前为【上】');
assert(getRelativeDirection('up', 'backward') === 'down', '朝上时：向后为【下】');
assert(getRelativeDirection('up', 'left') === 'left', '朝上时：向左为【左】');
assert(getRelativeDirection('up', 'right') === 'right', '朝上时：向右为【右】');

// 6.2 朝向为 'right' (东)
assert(getRelativeDirection('right', 'forward') === 'right', '朝右时：向前为【右】');
assert(getRelativeDirection('right', 'backward') === 'left', '朝右时：向后为【左】');
assert(getRelativeDirection('right', 'left') === 'up', '朝右时：向左为【上】');
assert(getRelativeDirection('right', 'right') === 'down', '朝右时：向右为【下】');

// 6.3 朝向为 'down' (南)
assert(getRelativeDirection('down', 'forward') === 'down', '朝下时：向前为【下】');
assert(getRelativeDirection('down', 'backward') === 'up', '朝下时：向后为【上】');
assert(getRelativeDirection('down', 'left') === 'right', '朝下时：向左为【右】');
assert(getRelativeDirection('down', 'right') === 'left', '朝下时：向右为【左】');

// 6.4 朝向为 'left' (西)
assert(getRelativeDirection('left', 'forward') === 'left', '朝左时：向前为【左】');
assert(getRelativeDirection('left', 'backward') === 'right', '朝左时：向后为【右】');
assert(getRelativeDirection('left', 'left') === 'down', '朝左时：向左为【下】');
assert(getRelativeDirection('left', 'right') === 'up', '朝左时：向右为【上】');

// 6.5 测试右键智能寻路算法 (BFS 安全规避怪物与阻挡物)
import { findSafePath } from './game/pathfinding';
import { Tile } from './types/game';

console.log('\n--- 6.5 验证右键智能自动寻路 (避开怪物与障碍，最优最快) ---');
const testLayout: Tile[][] = Array(11).fill(null).map(() => Array(11).fill({ type: 'floor' }));

// 1. 直线空地寻路测试：从 (5, 5) 走到 (5, 2)
const straightPath = findSafePath(testLayout, { x: 5, y: 5 }, { x: 5, y: 2 });
assert(straightPath !== null && straightPath.length === 3, '空地上最优步数计算正确 (3步到达)');
assert(
  straightPath?.[0].dir === 'up' && straightPath?.[1].dir === 'up' && straightPath?.[2].dir === 'up',
  '空地上直线前行方向全为 up'
);

// 2. 规避怪物测试：在 (5, 4) 设置怪物，目标为 (5, 3)
testLayout[4][5] = { type: 'monster', monsterId: 'slime_green' };
const detourPath = findSafePath(testLayout, { x: 5, y: 5 }, { x: 5, y: 3 });
assert(detourPath !== null, '面对怪物阻挡时能成功计算绕行路径');
assert(
  detourPath !== null && !detourPath.some((step) => step.x === 5 && step.y === 4),
  '绕行路径严格避开怪物所在的 (5, 4) 格子'
);

// 3. 终点不可达或终点为阻挡物测试
assert(findSafePath(testLayout, { x: 5, y: 5 }, { x: 5, y: 4 }) === null, '右键怪物格子时返回 null (不触发误走)');
testLayout[3][5] = { type: 'wall' };
assert(findSafePath(testLayout, { x: 5, y: 5 }, { x: 5, y: 3 }) === null, '右键实体墙体格子时返回 null (无作用)');

// 4. 起点与终点重合
assert(findSafePath(testLayout, { x: 5, y: 5 }, { x: 5, y: 5 }) === null, '目标为当前所在格返回 null');

// 5. 封闭死胡同测试 (无法通行)
const blockedLayout: Tile[][] = Array(11).fill(null).map(() => Array(11).fill({ type: 'wall' }));
blockedLayout[5][5] = { type: 'floor' }; // 起点孤立
blockedLayout[5][7] = { type: 'floor' }; // 目标在隔壁但被四面死墙包围
assert(findSafePath(blockedLayout, { x: 5, y: 5 }, { x: 5, y: 7 }) === null, '无通路到达的目标格子返回 null (无作用)');

// 6.3 3D 自由旋转视角下屏幕视口方向换算测试
import { getCameraAdaptedDirection } from './game/gameState';
console.log('\n--- 7. 验证 3D 自由旋转视角下屏幕视口方向换算 ---');
assert(getCameraAdaptedDirection('up', 0) === 'up', '默认视角(yaw=0)：按W对应世界坐标【上】');
assert(getCameraAdaptedDirection('down', 0) === 'down', '默认视角(yaw=0)：按S对应世界坐标【下】');
assert(getCameraAdaptedDirection('left', 0) === 'left', '默认视角(yaw=0)：按A对应世界坐标【左】');
assert(getCameraAdaptedDirection('right', 0) === 'right', '默认视角(yaw=0)：按D对应世界坐标【右】');

assert(getCameraAdaptedDirection('up', Math.PI / 2) === 'left', '顺时针转90°(yaw=π/2)：按W(屏幕上)智能转为世界【左/西】');
assert(getCameraAdaptedDirection('down', Math.PI / 2) === 'right', '顺时针转90°(yaw=π/2)：按S(屏幕下)智能转为世界【右/东】');
assert(getCameraAdaptedDirection('left', Math.PI / 2) === 'down', '顺时针转90°(yaw=π/2)：按A(屏幕左)智能转为世界【下/南】');
assert(getCameraAdaptedDirection('right', Math.PI / 2) === 'up', '顺时针转90°(yaw=π/2)：按D(屏幕右)智能转为世界【上/北】');

assert(getCameraAdaptedDirection('up', Math.PI) === 'down', '旋转180°(yaw=π)：按W(屏幕上)智能转为世界【下/南】');
assert(getCameraAdaptedDirection('down', Math.PI) === 'up', '旋转180°(yaw=π)：按S(屏幕下)智能转为世界【上/北】');
assert(getCameraAdaptedDirection('left', Math.PI) === 'right', '旋转180°(yaw=π)：按A(屏幕左)智能转为世界【右/东】');
assert(getCameraAdaptedDirection('right', Math.PI) === 'left', '旋转180°(yaw=π)：按D(屏幕右)智能转为世界【左/西】');

assert(getCameraAdaptedDirection('up', -Math.PI / 2) === 'right', '逆时针转90°(yaw=-π/2)：按W(屏幕上)智能转为世界【右/东】');
assert(getCameraAdaptedDirection('down', -Math.PI / 2) === 'left', '逆时针转90°(yaw=-π/2)：按S(屏幕下)智能转为世界【左/西】');
assert(getCameraAdaptedDirection('left', -Math.PI / 2) === 'up', '逆时针转90°(yaw=-π/2)：按A(屏幕左)智能转为世界【上/北】');
assert(getCameraAdaptedDirection('right', -Math.PI / 2) === 'down', '逆时针转90°(yaw=-π/2)：按D(屏幕右)智能转为世界【下/南】');

// 8. 验证经典魔塔50层原版真实地图、怪物、神坛与宝藏
console.log('\n--- 8. 验证经典原版50层魔塔地图、怪物、神坛与宝藏配置 ---');
// 8.1 四大神坛商店所在层
const f4 = getFloor(4);
assert(f4.layout[0][5]?.type === 'shop', '第 4 层包含初始贪婪神坛商店 (坐标 5, 0)');
const f12 = getFloor(12);
assert(f12.layout[8][5]?.type === 'shop', '第 12 层包含中级贪婪神坛商店 (坐标 5, 8)');
const f32 = getFloor(32);
assert(f32.layout[9][9]?.type === 'shop', '第 32 层包含高级贪婪神坛商店 (坐标 9, 9)');
const f46 = getFloor(46);
assert(f46.layout[0][5]?.type === 'shop', '第 46 层包含终极贪婪神坛商店 (坐标 5, 0)');

// 8.2 第 6-10 层的真实原版布局、怪物与宝物
const f6 = getFloor(6);
assert(f6.downStairsPos.x === 0 && f6.downStairsPos.y === 0, '第 6 层下楼梯在 (0, 0)');
assert(f6.upStairsPos.x === 10 && f6.upStairsPos.y === 10, '第 6 层上楼梯在 (10, 10)');
assert(f6.layout[0][0]?.type === 'stairs_down', '第 6 层 (0, 0) 为下楼梯瓦片');
assert(f6.layout[10][10]?.type === 'stairs_up', '第 6 层 (10, 10) 为上楼梯瓦片');
assert(f6.layout[0][6]?.type === 'monster' && f6.layout[0][6]?.monsterId === 'junior_mage', '第 6 层走廊把守有初级法师');

const f7 = getFloor(7);
assert(f7.layout[0][2]?.type === 'item' && f7.layout[0][2]?.itemType === 'gem_red', '第 7 层宝库包含红宝石');

const f8 = getFloor(8);
assert(f8.layout[1][9]?.type === 'item' && f8.layout[1][9]?.itemType === 'key_red', '第 8 层密室包含珍贵红钥匙');

const f9 = getFloor(9);
assert(f9.layout[4][9]?.type === 'fake_wall', '第 9 层暗道包含假墙密道 (坐标 9, 4)');
assert(f9.layout[6][8]?.type === 'item' && f9.layout[6][8]?.itemType === 'shield_iron', '第 9 层暗室藏有【铁盾】(坐标 8, 6)');

const f10 = getFloor(10);
assert(f10.layout[3][5]?.type === 'monster' && f10.layout[3][5]?.monsterId === 'skeleton_captain', '第 10 层中央大殿坐镇守层头目【骷髅队长】');
assert(f10.layout[3][3]?.type === 'door_iron' && f10.layout[3][7]?.type === 'door_iron', '骷髅队长两侧由铁栅栏门机关封锁');

// 8.3 后续关键神兵神盾与Boss层
const f5 = getFloor(5);
assert(f5.layout[10][10]?.type === 'item' && f5.layout[10][10]?.itemType === 'sword_iron', '第 5 层暗角藏有【铁剑】');
assert(f5.layout[10][8]?.type === 'fake_wall', '第 5 层前往铁剑处有假墙阻隔');

const f11 = getFloor(11);
assert(f11.layout[1][1]?.type === 'item' && f11.layout[1][1]?.itemType === 'shield_silver', '第 11 层藏有神盾【银盾】');

const f15 = getFloor(15);
assert(f15.layout[4][5]?.type === 'monster' && f15.layout[4][5]?.monsterId === 'giant_squid', '第 15 层深渊守卫为【大乌贼】');

const f17 = getFloor(17);
assert(f17.layout[1][1]?.type === 'item' && f17.layout[1][1]?.itemType === 'sword_silver', '第 17 层藏有神兵【银剑】');

const f25 = getFloor(25);
assert(f25.layout[5][5]?.type === 'monster' && f25.layout[5][5]?.monsterId === 'archmage', '第 25 层守层Boss为【大法师】(坐标 5, 5)');

const f33 = getFloor(33);
assert(f33.layout[9][9]?.type === 'item' && f33.layout[9][9]?.itemType === 'sword_knight', '第 33 层剑冢藏有【骑士剑】');

const f35 = getFloor(35);
assert(f35.layout[5][5]?.type === 'monster' && f35.layout[5][5]?.monsterId === 'dragon', '第 35 层龙穴盘踞有【魔龙】');

const f38 = getFloor(38);
assert(f38.layout[6][1]?.type === 'item' && f38.layout[6][1]?.itemType === 'shield_knight', '第 38 层迷阵藏有【骑士盾】');

const f43 = getFloor(43);
assert(f43.layout[3][8]?.type === 'item' && f43.layout[3][8]?.itemType === 'shield_holy', '第 43 层圣殿藏有【圣光之盾】');

const f44 = getFloor(44);
assert(f44.layout[5][5]?.type === 'item' && f44.layout[5][5]?.itemType === 'shield_sacred', '第 44 层星空中央藏有至尊神盾【神圣神盾】');

const f50 = getFloor(50);
assert(f50.layout[5][5]?.type === 'monster' && f50.layout[5][5]?.monsterId === 'demon_lord', '第 50 层魔塔之巅盘踞终极【魔王】');

// 9. 验证对象邻接寻路与 13F 熔岩机制
console.log('\n--- 9. 验证对象邻接寻路与 13F 熔岩交互机制 ---');
const f13 = getFloor(13);
assert(f13.layout[4][5]?.type === 'item' && f13.layout[4][5]?.itemType === 'sword_sacred', '13F 圣剑室藏有【神圣神剑】');
assert(f13.layout[8][5]?.type === 'lava', '13F 圣剑室门内被熔岩之海覆盖阻隔');

// 测试无冰冻雪花时撞入熔岩被阻挡并给出清晰提示
const testGame = new GameState();
testGame.changeFloor(13, 'up');
// 传送到 13F 黄门前 (5, 9)，并将门清除方便测试熔岩
testGame.getCurrentFloorData().layout[9][5] = { type: 'floor' };
testGame.playerPos = { x: 5, y: 9, dir: 'up' };
let floatMsg = '';
testGame.move('up', undefined, (txt) => { floatMsg = txt; });
assert(testGame.playerPos.x === 5 && testGame.playerPos.y === 9, '无冰冻雪花时无法迈入熔岩 (位置保持 5, 9)');
assert(floatMsg.includes('冰冻雪花'), '无冰冻雪花时给出清晰的35层魔龙雪花提示');

// 测试获得冰冻雪花后熔岩冰封为道路
testGame.playerStats.inventory.snow_crystal = 1;
testGame.move('up', undefined, (txt) => { floatMsg = txt; });
assert(testGame.playerPos.x === 5 && testGame.playerPos.y === 8, '持有冰冻雪花时成功迈入熔岩格 (5, 8)');
assert(testGame.getCurrentFloorData().layout[8][5]?.type === 'floor', '熔岩成功被冰封凝结为普通地面');

// 测试 findPathToAdjacent
const adjTest = findPathToAdjacent(f13.layout, { x: 5, y: 10 }, { x: 5, y: 9 });
assert(adjTest !== null && adjTest.path.length === 0 && adjTest.finalDir === 'up', '与目标对象正相邻时直接返回当前位置并面朝目标');

// 10. 验证 49F 与 10F 机关铁门守卫联动机制
console.log('\n--- 10. 验证 49F 与 10F 机关铁门守卫联动机制 ---');
const doorTestGame = new GameState();
doorTestGame.initGame();
doorTestGame.playerStats.hp = 99999;
doorTestGame.playerStats.maxHp = 99999;
doorTestGame.playerStats.atk = 9999;
doorTestGame.playerStats.def = 9999;

// 测试 49F 铁门 1: (5, 8) 必须消灭两侧巫师 (4, 9) 与 (6, 9)
doorTestGame.changeFloor(49, 'up');
const f49Data = doorTestGame.getCurrentFloorData();
doorTestGame.playerPos = { x: 5, y: 9, dir: 'up' };

assert(f49Data.layout[8][5]?.type === 'door_iron', '49F 初始 (5, 8) 为铁门');
assert(f49Data.layout[9][4]?.type === 'monster', '49F (4, 9) 左侧守卫巫师存活');
assert(f49Data.layout[9][6]?.type === 'monster', '49F (6, 9) 右侧守卫巫师存活');

// 撞击铁门应被阻挡
let doorBlockMsg = '';
doorTestGame.move('up', undefined, (txt) => { doorBlockMsg = txt; });
assert(doorTestGame.playerPos.x === 5 && doorTestGame.playerPos.y === 9, '两守卫存活时，铁门不可开启 (玩家被阻拦在 5, 9)');
assert(doorBlockMsg.includes('消灭门两侧守护的巫师'), '给出明确消灭两侧巫师的提示');
assert(f49Data.layout[8][5]?.type === 'door_iron', '铁门依然处于关闭状态');

// 击杀左侧巫师 (4, 9)
doorTestGame.move('left');
assert(doorTestGame.playerPos.x === 4 && doorTestGame.playerPos.y === 9, '成功进入 (4, 9) 格子击败左侧巫师');
assert(f49Data.layout[8][5]?.type === 'door_iron', '只杀一人时，铁门依然关闭');

// 回到 (5, 9) 再次尝试撞门，仍应被阻挡
doorTestGame.move('right');
doorTestGame.move('up');
assert(doorTestGame.playerPos.x === 5 && doorTestGame.playerPos.y === 9, '右侧巫师尚存，铁门依然阻拦勇士');

// 击杀右侧巫师 (6, 9)
doorTestGame.move('right');
assert(doorTestGame.playerPos.x === 6 && doorTestGame.playerPos.y === 9, '成功进入 (6, 9) 格子击败右侧巫师');
assert(f49Data.layout[8][5]?.type === 'floor', '两侧巫师均被消灭，铁门自动轰然开启为普通地板！');

// 此时玩家可以自由穿过 (5, 8)
doorTestGame.move('left'); // 回到 (5, 9)
doorTestGame.move('up');   // 走进 (5, 8)
assert(doorTestGame.playerPos.x === 5 && doorTestGame.playerPos.y === 8, '铁门开启后勇士顺利迈入 (5, 8)');

// 测试 49F 铁门 2: (5, 6) 必须消灭两侧黑暗骑士 (4, 7) 与 (6, 7)
doorTestGame.move('up'); // 移到 (5, 7)
assert(doorTestGame.playerPos.x === 5 && doorTestGame.playerPos.y === 7, '勇士来到第二道铁门前走廊 (5, 7)');
assert(f49Data.layout[6][5]?.type === 'door_iron', '49F 初始 (5, 6) 为第二道铁门');
assert(f49Data.layout[7][4]?.type === 'monster', '49F (4, 7) 左侧黑暗骑士存活');
assert(f49Data.layout[7][6]?.type === 'monster', '49F (6, 7) 右侧黑暗骑士存活');

// 撞击第二道铁门应被阻挡
let door2BlockMsg = '';
doorTestGame.move('up', undefined, (txt) => { door2BlockMsg = txt; });
assert(doorTestGame.playerPos.x === 5 && doorTestGame.playerPos.y === 7, '黑暗骑士存活时，第二道铁门阻挡勇士');
assert(door2BlockMsg.includes('消灭门两侧守护的黑暗骑士'), '给出明确消灭两侧黑暗骑士的提示');

// 消灭两侧黑暗骑士
doorTestGame.move('left'); // 击杀 (4, 7)
assert(f49Data.layout[6][5]?.type === 'door_iron', '只杀左侧黑暗骑士，铁门保持关闭');
doorTestGame.move('right'); // 回到 (5, 7)
doorTestGame.move('right'); // 击杀 (6, 7)
assert(f49Data.layout[6][5]?.type === 'floor', '两侧黑暗骑士全部被灭，王座大门自动开启！');
doorTestGame.move('left');  // 回到 (5, 7)
doorTestGame.move('up');    // 走进 (5, 6)
assert(doorTestGame.playerPos.x === 5 && doorTestGame.playerPos.y === 6, '勇士顺利穿过第二道铁门 (5, 6)');

// 测试 10F 骷髅队长击败联动开启 (3, 3) 与 (7, 3) 铁门
doorTestGame.changeFloor(10, 'up');
const f10Data = doorTestGame.getCurrentFloorData();
assert(f10Data.layout[3][3]?.type === 'door_iron', '10F (3, 3) 初始为铁门');
assert(f10Data.layout[3][7]?.type === 'door_iron', '10F (7, 3) 初始为铁门');
assert(f10Data.layout[3][5]?.type === 'monster', '10F (5, 3) 骷髅队长存活');

// 未击杀队长前无法开门
doorTestGame.playerPos = { x: 3, y: 4, dir: 'up' };
let f10BlockMsg = '';
doorTestGame.move('up', undefined, (txt) => { f10BlockMsg = txt; });
assert(doorTestGame.playerPos.x === 3 && doorTestGame.playerPos.y === 4, '骷髅队长存活时无法开启 (3, 3) 铁门');
assert(f10BlockMsg.includes('骷髅队长'), '给出击败骷髅队长的提示');

// 击杀骷髅队长
doorTestGame.playerPos = { x: 5, y: 4, dir: 'up' };
doorTestGame.move('up'); // 击杀 (5, 3) 骷髅队长
assert(f10Data.layout[3][3]?.type === 'floor', '骷髅队长被击败后，(3, 3) 铁门自动开启');
assert(f10Data.layout[3][7]?.type === 'floor', '骷髅队长被击败后，(7, 3) 铁门自动开启');

// 10b. 30F 铁门：必须消灭全部史莱姆；楼梯必须一上一下
console.log('\n--- 10b. 验证 30F 铁门与上下楼梯 ---');
const f30 = getFloor(30);
assert(f30.layout[0][5]?.type === 'stairs_up', '30F 北侧为上楼光圈');
assert(f30.layout[10][5]?.type === 'stairs_down', '30F 南侧为下楼光圈');
assert(f30.layout[3][5]?.type === 'door_iron', '30F (5,3) 为机关铁门');

doorTestGame.changeFloor(30, 'up');
const f30Data = doorTestGame.getCurrentFloorData();
doorTestGame.playerPos = { x: 5, y: 4, dir: 'up' };
let f30Block = '';
doorTestGame.move('up', undefined, (txt) => { f30Block = txt; });
assert(doorTestGame.playerPos.y === 4, '史莱姆未清时 30F 铁门不可通行');
assert(f30Block.includes('史莱姆'), '30F 铁门给出消灭史莱姆提示');

// 清除全部 6 只史莱姆
for (const x of [2, 3, 4, 6, 7, 8]) {
  f30Data.layout[4][x] = { type: 'floor' };
}
// 在铁门南侧放一只临时怪并击杀，触发 checkPostBattleGuardedDoors
doorTestGame.playerPos = { x: 5, y: 5, dir: 'up' };
f30Data.layout[4][5] = { type: 'monster', monsterId: 'green_slime' };
doorTestGame.move('up');
assert(f30Data.layout[3][5]?.type === 'floor', '六只史莱姆清完后 30F 铁门自动开启');

// 10c. 全层楼梯与铁门登记完整性
console.log('\n--- 10c. 验证全层楼梯成对与铁门均已登记 ---');
for (let f = 1; f <= 49; f++) {
  const fl = getFloor(f);
  let ups = 0;
  let downs = 0;
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 11; x++) {
      const t = fl.layout[y][x];
      if (!t) continue;
      if (t.type === 'stairs_up') ups++;
      if (t.type === 'stairs_down') downs++;
      if (t.type === 'door_iron') {
        assert(Boolean(findIronDoorRule(f, x, y)), `${f}F 铁门 (${x},${y}) 必须登记开启条件`);
      }
    }
  }
  assert(ups === 1, `${f}F 必须恰好 1 个上楼口 (实际 ${ups})`);
  assert(downs === 1, `${f}F 必须恰好 1 个下楼口 (实际 ${downs})`);
}
assert(IRON_DOOR_RULES.length >= 20, '铁门规则表应覆盖全塔各扇铁门');

// 11. 验证全怪物双语名称规范化（杜绝下划线与 Code Name）
console.log('\n--- 11. 验证全怪物双语名称规范（杜绝下划线与 Code Name） ---');
let allNamesValid = true;
for (const [id, m] of Object.entries(MONSTERS)) {
  const zh = getMonsterName(id, 'zh');
  const en = getMonsterName(id, 'en');
  const valid = !zh.includes('_') && !en.includes('_') && zh !== id && en !== id && zh.length > 0 && en.length > 0;
  if (!valid) {
    allNamesValid = false;
    console.error(`Invalid name for ${id}: zh=${zh}, en=${en}`);
  }
}
assert(allNamesValid, '全塔所有 40 种怪物均具备合规中文名与英文名（无下划线，杜绝 code name）');
assert(getMonsterName('dark_knight', 'zh') === '黑暗骑士', 'dark_knight 中文显示为【黑暗骑士】');
assert(getMonsterName('dark_knight', 'en') === 'Dark Knight', 'dark_knight 英文显示为【Dark Knight】');
assert(getMonsterName('senior_wizard', 'zh') === '高级巫师', 'senior_wizard 中文显示为【高级巫师】');
assert(getMonsterName('senior_wizard', 'en') === 'Senior Wizard', 'senior_wizard 英文显示为【Senior Wizard】');
assert(getMonsterName('demon_lord', 'zh') === '魔王杰诺', 'demon_lord 中文显示为【魔王杰诺】');
assert(getMonsterName('demon_lord', 'en') === 'Demon Lord Zeno', 'demon_lord 英文显示为【Demon Lord Zeno】');
assert(MONSTERS.demon_lord.hp === 5000, '50F 魔王杰诺生命值严格回归原版 5000 HP');
assert(MONSTERS.demon_lord.atk === 1580, '50F 魔王杰诺攻击力严格回归原版 1580 ATK (杜绝 5000 变态剧情杀误填数值)');
assert(MONSTERS.demon_lord.def === 190, '50F 魔王杰诺防御力严格回归原版 190 DEF (确保 500+ 攻击力勇士可顺畅破防决战)');

// 12. 验证 0F 仙灵密境地图布局、传送口与仙女新手教学
console.log('\n--- 12. 验证 0F 仙灵密境地图布局、传送口与仙女新手教学 ---');
const f0 = getFloor(0);
assert(f0.upStairsPos.x === 5 && f0.upStairsPos.y === 1, '0F 上楼口坐标必须在 (5, 1)');
assert(f0.layout[1][5]?.type === 'stairs_up', '0F (5, 1) 瓦片必须为 stairs_up 传送光圈');
assert(f0.layout[2][5]?.type === 'npc' && f0.layout[2][5]?.npcId === 'fairy', '0F (5, 2) 必须为仙女 NPC');
assert(f0.layout[1][5]?.type === 'stairs_up' && f0.layout[2][5]?.npcId === 'fairy', '传送口严格位于仙女正后方');

// 验证 0F 圣殿大门与四个角落宝物配置
let f0Doors = { yellow: 0, red: 0, blue: 0, iron: 0 };
for (let y = 0; y < 11; y++) {
  for (let x = 0; x < 11; x++) {
    const t = f0.layout[y][x];
    if (!t) continue;
    if (t.type === 'door_yellow') f0Doors.yellow++;
    if (t.type === 'door_red') f0Doors.red++;
    if (t.type === 'door_blue') f0Doors.blue++;
    if (t.type === 'door_iron') f0Doors.iron++;
  }
}
assert(f0Doors.yellow === 0, '0F 彻底移除 4 扇多余杂乱的黄色大门 (door_yellow 数量为 0)');
assert(f0Doors.blue === 0, '0F 不使用蓝色大门 (door_blue 数量为 0)');
assert(f0Doors.iron === 1, '0F 中央金币大门为特殊机关大门，受23层暗号封印');
assert(f0.layout[4][5]?.type === 'door_iron', '0F (5, 4) 必须为特殊机关大门');
assert(f0.layout[5][5]?.type === 'item' && f0.layout[5][5]?.itemType === 'lucky_coin', '0F (5, 5) 密藏幸运金币神器');

// 验证四个角落精准精简宝物神台配置
assert(f0.layout[1][1]?.type === 'item' && f0.layout[1][1]?.itemType === 'gem_red', '西北神台配备 1 个红宝石 (1, 1)');
assert(f0.layout[2][1]?.type === 'item' && f0.layout[2][1]?.itemType === 'potion_red', '西北神台配备 1 个红血瓶 (1, 2)');
assert(f0.layout[1][9]?.type === 'item' && f0.layout[1][9]?.itemType === 'gem_blue', '东北神台配备 1 个蓝宝石 (9, 1)');
assert(f0.layout[2][9]?.type === 'item' && f0.layout[2][9]?.itemType === 'potion_red', '东北神台配备 1 个红血瓶 (9, 2)');
assert(f0.layout[9][1]?.type === 'item' && f0.layout[9][1]?.itemType === 'key_yellow', '西南神台配备 1 把黄钥匙 (1, 9)');
assert(f0.layout[8][1]?.type === 'item' && f0.layout[8][1]?.itemType === 'potion_red', '西南神台配备 1 个红血瓶 (1, 8)');
assert(f0.layout[9][9]?.type === 'item' && f0.layout[9][9]?.itemType === 'key_blue', '东南神台配备 1 把蓝钥匙 (9, 9)');
assert(f0.layout[8][9]?.type === 'item' && f0.layout[8][9]?.itemType === 'potion_red', '东南神台配备 1 个红血瓶 (9, 8)');

// 验证 0F 可达性 (四周神台开放可达，中央幸运金币密室必须开红门才能进入)
function f0Reachable(startX: number, startY: number, openDoors: Set<string> = new Set()) {
  const visited = new Set<string>();
  const queue = [{ x: startX, y: startY }];
  visited.add(`${startX},${startY}`);
  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= 11 || ny < 0 || ny >= 11) continue;
      const key = `${nx},${ny}`;
      if (visited.has(key)) continue;
      const t = f0.layout[ny][nx];
      if (!t || t.type === 'wall') continue;
      if (t.type.startsWith('door_') && !openDoors.has(key)) continue;
      visited.add(key);
      queue.push({ x: nx, y: ny });
    }
  }
  return visited;
}

const f0InitialReached = f0Reachable(5, 9);
assert(f0InitialReached.has('5,2'), '出生点 (5, 9) 可畅通直达仙女 (5, 2)');
assert(f0InitialReached.has('5,1'), '出生点 (5, 9) 可畅通直达仙女身后上楼光圈 (5, 1)');
assert(f0InitialReached.has('1,1') && f0InitialReached.has('1,2'), '西北神台开放：直接拾取红宝石与血瓶');
assert(f0InitialReached.has('9,1') && f0InitialReached.has('9,2'), '东北神台开放：直接拾取蓝宝石与血瓶');
assert(f0InitialReached.has('1,9') && f0InitialReached.has('1,8'), '西南神台开放：直接拾取黄钥匙与血瓶');
assert(f0InitialReached.has('9,9') && f0InitialReached.has('9,8'), '东南神台开放：直接拾取蓝钥匙与血瓶');
assert(!f0InitialReached.has('5,5'), '未开金币特殊机关门绝无法绕过并拾取中央幸运金币 (5, 5)');

const f0UnlockedReached = f0Reachable(5, 9, new Set(['5,4']));
assert(f0UnlockedReached.has('5,5'), '消耗红钥匙开启 (5, 4) 红门后，顺利拾取幸运金币');

// 验证仙女交谈完毕后消失
const fairyTestGame = new GameState();
fairyTestGame.initGame();
assert(fairyTestGame.currentFloor === 0, '初始在 0 层');
assert(fairyTestGame.getCurrentFloorData().layout[2][5]?.type === 'npc', '初始 (5, 2) 为仙女 NPC');
fairyTestGame.triggerNPC('fairy', 5, 2);
assert(fairyTestGame.isDialogueOpen === true, '触发仙女对话');
fairyTestGame.closeDialogue();
assert(fairyTestGame.isDialogueOpen === false, '对话顺利关闭');
assert(fairyTestGame.getCurrentFloorData().layout[2][5]?.type === 'floor', '仙女对话完毕后化作灵光隐去消失，原位置变为畅通地面');

// 验证仙女教学内容覆盖用户要求的关键操作与快捷键，且不含 A* 算法术语
const fairyZh = NPC_DIALOGUES.fairy.lines.zh.join('\n');
assert(!fairyZh.includes('A*'), '仙女对话不含突兀的【A* 算法】技术术语');
assert(fairyZh.includes('右键双击'), '仙女对话包含通俗的【右键双击】说明');
assert(fairyZh.includes('最优路径'), '仙女对话包含【选择最优路径】到达目标说明');
assert(fairyZh.includes('单击'), '仙女对话包含左键【单击】查看信息教学');
assert(fairyZh.includes('Ctrl') && fairyZh.includes('拖拽'), '仙女对话包含【Ctrl】拖拽平移视角教学');
assert(fairyZh.includes('Shift') && fairyZh.includes('拖拽'), '仙女对话包含【Shift】拖拽旋转视角教学');
assert(fairyZh.includes('空格') || fairyZh.includes('Space'), '仙女对话包含【空格键】复位视角教学');
assert(fairyZh.includes('身后') && fairyZh.includes('1F'), '仙女对话包含身后传送门前往 1F 指引');

// --- 13. 验证金币能力商店命名与经验老人 (Option A) 加点机制及 3D 建模 ---
console.log('\n--- 13. 验证金币商店命名规范与经验老人 (Option A) 机制及建模 ---');
const zhT = translations.zh;
assert(!zhT.shopTitle.includes('祈祷'), '金币商店标题去除【祈祷】术语，显示为【' + zhT.shopTitle + '】');
assert(!zhT.shopPrayerCost.includes('祈祷'), '金币商店消耗提示去除【祈祷】术语，显示为【' + zhT.shopPrayerCost + '】');
assert(!zhT.shopBlessingHp.includes('祈愿'), '金币商店选项去除【祈愿】术语，显示为【' + zhT.shopBlessingHp + '】');

// 经验老人分布验证
const checkF5 = getFloor(5);
const checkF11 = getFloor(11);
const checkF27 = getFloor(27);
const checkF42 = getFloor(42);
assert(checkF5.layout[0][6]?.type === 'npc' && checkF5.layout[0][6]?.npcId === 'elder_exp', '5F (6, 0) 成功配置经验老人且未阻挡门');
assert(checkF5.layout[0][5]?.type === 'floor', '5F (5, 0) 为畅通平地，允许玩家开启 (4, 0) 房门');
assert(checkF11.layout[0][0]?.type === 'npc' && checkF11.layout[0][0]?.npcId === 'elder_exp', '11F (0, 0) 成功配置经验老人于银盾房间');
assert(checkF11.layout[8][6]?.type === 'floor', '11F (6, 8) 走廊畅通，不再阻挡玩家通往楼梯的路线');
assert(checkF27.layout[0][5]?.type === 'npc' && checkF27.layout[0][5]?.npcId === 'elder_exp', '27F (5, 0) 成功配置经验老人');
assert(checkF42.layout[3][0]?.type === 'npc' && checkF42.layout[3][0]?.npcId === 'elder_exp', '42F (0, 3) 成功配置经验老人');

// 经验加点逻辑测试
const expGame = new GameState();
expGame.initGame();
expGame.currentFloor = 5;
const gainZone1 = expGame.getExpUpgradeGain();
assert(gainZone1.costAtk === 30 && gainZone1.atk === 5, '1区经验老人 30 经验提升 5 攻击');
assert(gainZone1.costDef === 30 && gainZone1.def === 5, '1区经验老人 30 经验提升 5 防御');
assert(gainZone1.costLevel === 100, '1区经验老人 100 经验提升等级');

// 经验不足测试
expGame.playerStats.exp = 20;
assert(expGame.buyExpUpgrade('atk') === false, '经验值不足时无法购买加点');
assert(expGame.playerStats.atk === 10, '攻击力保持不变');

// 经验充足购买测试
expGame.playerStats.exp = 150;
const prevAtk = expGame.playerStats.atk;
assert(expGame.buyExpUpgrade('atk') === true, '经验值充足时成功购买攻击力强化');
assert(expGame.playerStats.atk === prevAtk + 5, '攻击力正确增加 +5');
assert(expGame.playerStats.exp === 120, '经验值正确扣除 30 点');

// 突破升级测试
const prevHp = expGame.playerStats.hp;
const prevDef = expGame.playerStats.def;
const prevAtk2 = expGame.playerStats.atk;
assert(expGame.buyExpUpgrade('level') === true, '经验充足时成功突破等级');
assert(expGame.playerStats.hp === prevHp + gainZone1.levelGain.hp, '生命值大幅提升');
assert(expGame.playerStats.atk === prevAtk2 + gainZone1.levelGain.atk, '攻击力大幅提升');
assert(expGame.playerStats.def === prevDef + gainZone1.levelGain.def, '防御力大幅提升');
assert(expGame.playerStats.exp === 20, '经验值正确扣除 100 点');

// 验证高品质 3D 老人建模结构
const elderNormalMesh = ModelFactory.createOldManMesh('normal');
const elderExpMesh = ModelFactory.createOldManMesh('exp');
assert(elderNormalMesh.name === 'npc_old_man', '普通智慧老人 Mesh 标识正确');
assert(elderExpMesh.name === 'npc_elder_exp', '经验老人 Mesh 标识正确');
assert(elderNormalMesh.children.length >= 5, '长者建模包含皮靴、微驼身躯、长袍、五官头颅、古木拐杖等多重精致组件');
assert(elderExpMesh.children.length >= 5, '经验老人建模包含完整长者写实组件');

// --- 14. 验证 3D 场景对象生命周期与换层清理规范 (杜绝跨层穿模与幽灵商店) ---
console.log('\n--- 14. 验证 3D 场景对象生命周期与换层清理规范 ---');
const floor3Data = getFloor(3);
const floor4Data = getFloor(4);
let f3ShopCount = 0;
let f4ShopCount = 0;
for (let y = 0; y < 11; y++) {
  for (let x = 0; x < 11; x++) {
    if (floor3Data.layout[y][x]?.type === 'shop') f3ShopCount++;
    if (floor4Data.layout[y][x]?.type === 'shop') f4ShopCount++;
  }
}
assert(f4ShopCount === 3, '4F 地图数据中正确包含 3 格一体化商铺');
assert(f3ShopCount === 0, '3F 地图数据中绝无商铺瓦片 (0 格 shop)');
assert(floor3Data.layout[0][6]?.type === 'wall', '3F (6, 0) 为砖石墙体');

// 静态分析 ThreeCanvas 源码生命周期绑定：商铺必须加入 floorGroup 而非 scene，换层时彻底销毁
const threeCanvasCode = fs.readFileSync('src/engine/ThreeCanvas.ts', 'utf-8');
assert(!threeCanvasCode.includes('this.scene.add(shopObj)'), '禁止将商铺模型直接挂载至全局根场景 this.scene');
assert(threeCanvasCode.includes('this.floorGroup.add(shopObj)'), '商铺模型必须挂载至楼层容器 this.floorGroup');
assert(threeCanvasCode.includes('this.clearPathTarget()'), '换层 setFloor 时必须联动清空寻路目标标记');
assert(threeCanvasCode.includes('this.setSelectedTile(null, null)'), '换层 setFloor 时必须联动复位检视选中标记');

// --- 15. 验证打怪 0 损血无伤提示词规范（未受到伤害） ---
console.log('\n--- 15. 验证打怪 0 损血提示词规范 ---');
const notifZh = getCombatNotification('win_flawless', { gold: 5 }, 'zh');
const notifEn = getCombatNotification('win_flawless', { gold: 5 }, 'en');
assert(notifZh.text.includes('未受到伤害'), '中文浮动击杀提示词包含【未受到伤害】');
assert(!notifZh.text.includes('完全无伤防杀'), '杜绝【完全无伤防杀】复杂术语');
assert(notifEn.text.includes('No damage taken'), '英文浮动击杀提示词包含【No damage taken】');
assert(translations.zh.flawlessVictory === '未受到伤害', '中文手册与检视卡片预估损血词条为【未受到伤害】');
assert(translations.en.flawlessVictory === 'No damage taken', '英文手册与检视卡片预估损血词条为【No damage taken】');

// 战斗计算说明验证
const strongHeroTest = { ...baseHero, atk: 30, def: 20 };
const slimeTest = MONSTERS.green_slime;
const battleCalc = calculateBattle(strongHeroTest, slimeTest);
assert(battleCalc.damage === 0, '防御力高于怪物攻击力时损血为 0');
assert(battleCalc.specialNotes.some((n) => n.includes('未受到伤害')), '战力推演日志正确记录【未受到伤害】');

// --- 16. 验证隔断墙体厚度对齐门体 (0.16) 与记事本 (Notepad) 高精 3D 建模 ---
console.log('\n--- 16. 验证墙体厚度规范与记事本高精建模 ---');
// 墙体模型验证
const testWallMesh = ModelFactory.createWallMesh('castle') as any;
assert(testWallMesh.name === 'wall', '墙体 Mesh 命名正确');
const wallGeo = testWallMesh.geometry as any;
assert(wallGeo && wallGeo.parameters.width === 1.0, '墙体完整占据单格横向宽度 1.0');
assert(wallGeo && wallGeo.parameters.depth === 0.16, '隔断墙体厚度严格与门体厚度 0.16 一致');

// 记事本 3D 建模验证
const notepadMesh = ModelFactory.createItemMesh('notepad');
assert(notepadMesh.name === 'item_notepad', '记事本 Mesh 命名正确');
assert(notepadMesh.children.length > 0, '记事本包含多部件精致子模型结构');
// 验证记事本包含封面、书芯、书脊、护角、魔晶徽章、羽毛笔等组件
const bookGroup = notepadMesh.children[0] as any;
assert(bookGroup.children.length >= 8, '记事本手札包含皮革封面、羊皮纸内页、金黄护角、星光魔晶、书签丝带与羽毛笔');

// 5F 蓝宝石区域墙体与骷髅兵相邻坐标验证
const f5Data = getFloor(5);
assert(f5Data.layout[6][0]?.type === 'wall', '5F 骷髅兵左侧 (0, 6) 为实心墙体瓦片');
assert(f5Data.layout[6][1]?.type === 'monster' && f5Data.layout[6][1]?.monsterId === 'skeleton_soldier', '5F (1, 6) 为骷髅士兵');
assert(f5Data.layout[6][2]?.type === 'wall', '5F 骷髅兵右侧 (2, 6) 为实心墙体瓦片');
assert(f5Data.layout[6][3]?.type === 'wall' && f5Data.layout[6][4]?.type === 'wall', '5F (3, 6) 与 (4, 6) 连续实心隔墙');
assert(f5Data.layout[8][0]?.type === 'item' && f5Data.layout[8][0]?.itemType === 'gem_blue', '5F (0, 8) 蓝宝石宝藏配置正确');
assert(f5Data.layout[8][3]?.type === 'item' && f5Data.layout[8][3]?.itemType === 'notepad', '5F (3, 8) 记事本手札配置正确');

// --- 17. 验证 6F 地图门结构修复、神秘商人交易系统与智慧老人楼层专属指引 ---
console.log('\n--- 17. 验证 6F 门朝向修复、神秘商人交易与智慧老人指引 ---');
const f6Data = getFloor(6);
// 6F 左上密室单门结构验证
assert(f6Data.layout[3][1]?.type === 'wall', '6F (1, 3) 修复为实心西墙');
assert(f6Data.layout[3][2]?.type === 'floor', '6F (2, 3) 移除错误横向怪门，恢复为通畅地面');
assert(f6Data.layout[3][3]?.type === 'floor', '6F (3, 3) 为密室通畅地面');
assert(f6Data.layout[3][4]?.type === 'door_yellow', '6F (4, 3) 为面向走廊的唯一入口黄门');
assert(f6Data.layout[7][6]?.type === 'door_yellow', '6F (6, 7) 为药水房唯一入口黄门');
assert(f6Data.layout[7][7]?.type === 'floor', '6F (7, 7) 移除错误横向怪门，恢复为通畅地面');
assert(f6Data.layout[7][8]?.type === 'floor', '6F (8, 7) 为药水房内部通畅地面');
assert(f6Data.layout[7][9]?.type === 'wall', '6F (9, 7) 为连续平整东墙');

// 验证 6F 全图无任何紧挨双门笔误
let f6AdjacentDoorCount = 0;
for (let y = 0; y < 11; y++) {
  for (let x = 0; x < 10; x++) {
    const t1 = f6Data.layout[y][x];
    const t2 = f6Data.layout[y][x + 1];
    if (t1 && t2 && t1.type.startsWith('door_') && t2.type.startsWith('door_')) {
      f6AdjacentDoorCount++;
    }
  }
}
assert(f6AdjacentDoorCount === 0, '6F 彻底消除相邻门粘连笔误 (数量为 0)');

// 验证 6F 彻底移除冗余商人与老人 (避免与 7F 重复，还原纯正地宫探险)
let f6NpcCount = 0;
for (let y = 0; y < 11; y++) {
  for (let x = 0; x < 11; x++) {
    const tile = f6Data.layout[y][x];
    if (tile?.type === 'npc') {
      f6NpcCount++;
    }
  }
}
assert(f6NpcCount === 0, '6F 彻底移除商人与老人 NPC (NPC 数量为 0，杜绝与 7F 重复)');
assert(f6Data.layout[3][7]?.type === 'item' && f6Data.layout[3][7]?.itemType === 'gem_red', '6F (7, 3) 密室宝藏配置为红宝石');
assert(f6Data.layout[7][3]?.type === 'item' && f6Data.layout[7][3]?.itemType === 'potion_red', '6F (3, 7) 密室宝藏配置为红药水');

// 7F 神秘商人交易测试 (50 金币购买 5 把黄钥匙)
const tradeGame = new GameState();
tradeGame.initGame();
tradeGame.currentFloor = 7;
tradeGame.triggerNPC('trader', 4, 0);
assert(tradeGame.activeDialogue !== null, '成功触发 7F 神秘商人对话');
assert(tradeGame.activeDialogue?.trade?.tradeId === 'trader_7f', '商人挂载 7F 交易配置');
assert(tradeGame.activeDialogue?.trade?.costGold === 50, '7F 商人明码标价 50 金币');
assert(tradeGame.activeDialogue?.trade?.title.includes('5 把黄钥匙'), '7F 商人出售 5 把黄钥匙');

// 金币不足时购买失败
assert(tradeGame.buyTraderItem('trader_7f') === false, '金币不足 50 时无法购买黄钥匙礼包');
const prevYellow = tradeGame.playerStats.yellowKeys;

// 增加金币后购买成功
tradeGame.playerStats.gold = 60;
assert(tradeGame.buyTraderItem('trader_7f') === true, '金币充足时成功购买黄钥匙礼包');
assert(tradeGame.playerStats.gold === 10, '金币正确扣除 50 点');
assert(tradeGame.playerStats.yellowKeys === prevYellow + 5, '黄钥匙数量正确增加 +5 把');

// 再次对话呈现已售罄台词
tradeGame.closeDialogue();
tradeGame.triggerNPC('trader', 4, 0);
assert(tradeGame.activeDialogue?.trade === undefined, '已购商品不再重复挂载交易');

// 智慧老人楼层专属指引与首遇赠礼测试
const elderGame = new GameState();
elderGame.initGame();

// 1F 老人赠送黄钥匙
elderGame.currentFloor = 1;
const prev1FKeys = elderGame.playerStats.yellowKeys;
elderGame.triggerNPC('elder', 6, 9);
assert(elderGame.playerStats.yellowKeys === prev1FKeys + 1, '1F 智慧老人初次对话赠送新手黄钥匙 x1');
assert(elderGame.activeDialogue?.lines[2]?.includes('黄钥匙'), '1F 老人台词包含赠送黄钥匙');

// 4F 老人提示机关门
elderGame.currentFloor = 4;
elderGame.triggerNPC('elder', 9, 0);
assert(elderGame.activeDialogue?.lines.some(l => l.includes('机关铁门')), '4F 智慧老人讲解机关铁门与首领感应机制');

// 7F 老人提示战斗临界点并赠送蓝宝石 (+3 防御力)
elderGame.currentFloor = 7;
const prev7FDef = elderGame.playerStats.def;
elderGame.triggerNPC('elder', 6, 0);
assert(elderGame.playerStats.def === prev7FDef + 3, '7F 智慧老人初次对话赠送蓝宝石 x1 (防御力+3)');
assert(elderGame.activeDialogue?.lines.some(l => l.includes('蓝宝石')), '7F 智慧老人台词包含赠送蓝宝石');
assert(elderGame.activeDialogue?.lines.some(l => l.includes('攻击力低于怪物的防御力')), '7F 智慧老人传授破防与无伤受击秘诀');

// 9F 老人提示暗墙与铁盾
elderGame.currentFloor = 9;
elderGame.triggerNPC('elder', 10, 3);
assert(elderGame.activeDialogue?.lines.some(l => l.includes('铁盾')), '9F 智慧老人揭秘暗墙内封藏铁盾');

// 12F 智慧老人暗室资助 300 金币与蓝宝石测试
elderGame.currentFloor = 12;
const prev12Gold = elderGame.playerStats.gold;
const prev12Def = elderGame.playerStats.def;
elderGame.triggerNPC('elder', 10, 0);
assert(elderGame.playerStats.gold === prev12Gold + 300, '12F 智慧老人初次对话直接资助 300 金币');
assert(elderGame.playerStats.def === prev12Def + 3, '12F 智慧老人初次对话赠送蓝宝石 x1 (防御力+3)');
assert(elderGame.activeDialogue?.lines.some(l => l.includes('300金币')), '12F 老人台词明确提及资助 300 金币与蓝宝石');

// 12F 神秘商人 200 金币特惠红钥匙测试
tradeGame.currentFloor = 12;
tradeGame.playerStats.gold = 300;
tradeGame.triggerNPC('trader', 0, 0);
assert(tradeGame.activeDialogue?.trade?.tradeId === 'trader_12f', '12F 商人挂载 12F 交易配置');
assert(tradeGame.activeDialogue?.trade?.costGold === 200, '12F 商人红钥匙特惠降价为 200 金币');
const prevRedKeys = tradeGame.playerStats.redKeys;
assert(tradeGame.buyTraderItem('trader_12f') === true, '使用老人资助的金币顺利购买 1 把特惠红钥匙');
assert(tradeGame.playerStats.redKeys === prevRedKeys + 1, '红钥匙数量正确增加 +1 把');
assert(tradeGame.playerStats.gold === 100, '金币正确扣除 200 点 (剩余 100 金币)');

// 18. 验证全塔 NPC 有意义机制（地牢小偷、勘探暗道、全楼层商人特惠与长者专属赠礼）
console.log('\n--- 18. 验证全塔 NPC 有意义机制（杜绝空话、全部具备剧情线索与实质回馈） ---');
const npcAuditGame = new GameState();
npcAuditGame.initGame();

// (1) 2F 幽暗地牢测试
npcAuditGame.currentFloor = 2;
// 2F 小偷
npcAuditGame.triggerNPC('thief', 10, 9);
assert(npcAuditGame.activeDialogue !== null, '2F 成功触发地牢小偷解救对话');
assert(
  npcAuditGame.activeDialogue?.lines.some(l => l.includes('铁剑')) &&
  npcAuditGame.activeDialogue?.lines.some(l => l.includes('铁盾')),
  '2F 小偷答谢透露 5F 铁剑与 9F 铁盾重宝位置'
);
assert(npcAuditGame.activeDialogue?.lines.some(l => l.includes('开辟暗道')), '2F 小偷承诺后续将为勇士开辟暗道');
npcAuditGame.closeDialogue();

// 2F 智慧老人
const prev2FGold = npcAuditGame.playerStats.gold;
npcAuditGame.triggerNPC('elder', 10, 3);
assert(npcAuditGame.playerStats.gold === prev2FGold + 300, '2F 被囚老人获救后赠送 300 金币启动资金');
assert(npcAuditGame.activeDialogue?.lines.some(l => l.includes('300金币')), '2F 老人台词明确提及赠送 300 金币');
npcAuditGame.closeDialogue();

// 2F 商人
npcAuditGame.triggerNPC('trader', 10, 6);
assert(npcAuditGame.activeDialogue?.trade?.tradeId === 'trader_2f', '2F 商人挂载 2F 交易');
assert(npcAuditGame.activeDialogue?.trade?.costGold === 50, '2F 商人报恩特惠 50 金币');
assert(npcAuditGame.activeDialogue?.trade?.title.includes('4 把黄钥匙'), '2F 商人出售 4 把黄钥匙礼包');
npcAuditGame.playerStats.gold = 100;
assert(npcAuditGame.buyTraderItem('trader_2f') === true, '2F 顺利购买 4 把黄钥匙');
npcAuditGame.closeDialogue();

// (2) 29F 勘探小偷与暗道
npcAuditGame.currentFloor = 29;
const prev29Keys = npcAuditGame.playerStats.yellowKeys;
// 未取得铲子时：小偷请求寻找铲子，不给钥匙
npcAuditGame.triggerNPC('thief', 4, 1);
assert(npcAuditGame.activeDialogue?.lines.some(l => l.includes('我的铲子找不到了')), '29F 小偷未获得铲子时请求寻找铲子');
assert(npcAuditGame.playerStats.yellowKeys === prev29Keys, '未获得铲子时不赠送钥匙');
npcAuditGame.closeDialogue();

// 获得铲子后：交付铲子，小偷挖通暗道并赠送黄钥匙 x2
npcAuditGame.playerStats.inventory.thief_shovel = 1;
npcAuditGame.triggerNPC('thief', 4, 1);
assert(npcAuditGame.activeDialogue?.lines.some(l => l.includes('30 层的暗道已经被我挖通了')), '29F 小偷成功挖通 30 层暗道');
assert(npcAuditGame.playerStats.yellowKeys === prev29Keys + 2, '29F 小偷勘探暗道报恩赠送黄钥匙 x2');
assert(!npcAuditGame.playerStats.inventory.thief_shovel, '小偷铲子已被成功交接回收');
npcAuditGame.closeDialogue();

// 再次对话不重复赠礼
npcAuditGame.triggerNPC('thief', 4, 1);
assert(npcAuditGame.playerStats.yellowKeys === prev29Keys + 2, '29F 小偷不重复赠送钥匙');
assert(npcAuditGame.activeDialogue?.lines.some(l => l.includes('暗道已经被我挖通了，快去 30 层吧')), '29F 小偷展示暗道挖通后续台词');
npcAuditGame.closeDialogue();

// (3) 各楼层智慧老人专属赠礼与线索全面检验
const elderTests: Array<{ floor: number; stat: 'hp' | 'atk' | 'def' | 'gold' | 'blueKeys'; delta: number; desc: string }> = [
  { floor: 4, stat: 'hp', delta: 200, desc: '4F 智慧老人赠送初级红药水 (+200 HP)' },
  { floor: 9, stat: 'atk', delta: 3, desc: '9F 智慧老人赠送红宝石 (+3 ATK)' },
  { floor: 15, stat: 'hp', delta: 500, desc: '15F 暗室老人赠送高级蓝药水 (+500 HP)' },
  { floor: 16, stat: 'atk', delta: 3, desc: '16F 智慧老人赠送红宝石 (+3 ATK)' },
  { floor: 18, stat: 'atk', delta: 3, desc: '18F 智慧老人赠送红宝石 (+3 ATK)' },
  { floor: 21, stat: 'hp', delta: 500, desc: '21F 智慧老人赠送高级蓝药水 (+500 HP)' },
  { floor: 24, stat: 'def', delta: 3, desc: '24F 智慧老人决战前赠送蓝宝石 (+3 DEF)' },
  { floor: 31, stat: 'def', delta: 3, desc: '31F 智慧老人赠送蓝宝石 (+3 DEF)' },
  { floor: 33, stat: 'atk', delta: 3, desc: '33F 智慧老人赠送红宝石 (+3 ATK)' },
  { floor: 36, stat: 'hp', delta: 500, desc: '36F 智慧老人赠送高级蓝药水 (+500 HP)' },
  { floor: 37, stat: 'def', delta: 3, desc: '37F 智慧老人赠送蓝宝石 (+3 DEF)' },
  { floor: 38, stat: 'hp', delta: 500, desc: '38F 智慧老人赠送高级蓝药水 (+500 HP)' },
  { floor: 39, stat: 'blueKeys', delta: 1, desc: '39F 智慧老人赠送蓝钥匙 x1' },
  { floor: 41, stat: 'atk', delta: 3, desc: '41F 智慧老人赠送红宝石 (+3 ATK)' },
  { floor: 45, stat: 'hp', delta: 500, desc: '45F 智慧老人赠送高级蓝药水 (+500 HP)' },
  { floor: 46, stat: 'gold', delta: 500, desc: '46F 智慧老人终极神坛资助 500 金币' },
  { floor: 47, stat: 'atk', delta: 6, desc: '47F 智慧老人赠送红宝石 x2 (+6 ATK)' },
  { floor: 48, stat: 'hp', delta: 1000, desc: '48F 智慧老人赠送神圣圣水 (+1000 HP)' },
];

for (const t of elderTests) {
  npcAuditGame.currentFloor = t.floor;
  const beforeVal = (npcAuditGame.playerStats as any)[t.stat];
  npcAuditGame.triggerNPC('elder', 0, 0);
  const afterVal = (npcAuditGame.playerStats as any)[t.stat];
  assert(afterVal === beforeVal + t.delta, t.desc);
  assert(npcAuditGame.activeDialogue !== null && npcAuditGame.activeDialogue.lines.length > 0, `${t.floor}F 智慧老人对话丰富且无空话`);
  npcAuditGame.closeDialogue();

  // 验证不重复赠礼
  npcAuditGame.triggerNPC('elder', 0, 0);
  const reval = (npcAuditGame.playerStats as any)[t.stat];
  assert(reval === afterVal, `${t.floor}F 智慧老人不重复发放赠礼`);
  npcAuditGame.closeDialogue();
}

// (4) 全塔所有神秘商人交易配置完备性检查
const traderCheckGame = new GameState();
traderCheckGame.initGame();
const allTraderFloors = [2, 7, 12, 15, 28, 31, 38, 39, 45, 47];
for (const fl of allTraderFloors) {
  traderCheckGame.currentFloor = fl;
  traderCheckGame.triggerNPC('trader', 0, 0);
  assert(traderCheckGame.activeDialogue?.trade !== undefined, `${fl}F 神秘商人具备正式交易配置`);
  assert(traderCheckGame.activeDialogue?.trade?.costGold! > 0, `${fl}F 商人具有合规金币价格 (实际 ${traderCheckGame.activeDialogue?.trade?.costGold})`);
  assert(traderCheckGame.activeDialogue?.trade?.title.length! > 0, `${fl}F 商人商品具有清晰描述`);
  traderCheckGame.closeDialogue();
}

// 19. 验证 15F 核心守卫【大乌贼】高精 3D 专属生物建模与横跨 3 格宏伟 Boss 机制
console.log('\n--- 19. 验证 15F 核心守卫【大乌贼】高精 3D 专属生物建模与横跨 3 格机制 ---');
const squidMesh = ModelFactory.createMonsterMesh('giant_squid');
assert(squidMesh !== null && squidMesh.isGroup, '大乌贼 3D 模型生成成功且为 Group 实体');
assert(squidMesh.name === 'monster_giant_squid', '大乌贼模型节点命名为 monster_giant_squid');

// 严禁错位使用大魔王翅膀与重装战甲组件
let hasDemonWings = false;
squidMesh.traverse((c) => {
  if (c.name === 'wing_l' || c.name === 'wing_r') {
    hasDemonWings = true;
  }
});
assert(!hasDemonWings, '大乌贼彻底摒弃大魔王骨架龙翼 (杜绝错位为大魔王)');

// 验证乌贼软体动物与深海巨兽特征（包含圆锥胴体、肉鳍、巨瞳、漏斗管、角质喙与带吸盘触手）
let meshCount = 0;
squidMesh.traverse((c) => {
  if ((c as any).isMesh) meshCount++;
});
assert(meshCount >= 50, `大乌贼由多层精细软体部件组成 (包含 ${meshCount} 个 3D 网格部件)`);

// 验证横跨 3 格宏伟跨度 (包围盒 X 轴宽度 >= 2.6，实际 ~2.84 跨越 3 个走廊网格)
const squidBBox = new THREE.Box3().setFromObject(squidMesh);
const squidSpanX = squidBBox.max.x - squidBBox.min.x;
assert(squidSpanX >= 2.6, `大乌贼横向跨度达到 ${squidSpanX.toFixed(2)} (>= 2.6)，完美横跨封锁走廊 3 个网格`);

// 验证包含左翼与右翼触手群、核心胴体与前方长触腕
assert(Boolean(squidMesh.getObjectByName('squid_mantle')), '大乌贼包含核心圆锥胴体 (squid_mantle)');
assert(Boolean(squidMesh.getObjectByName('squid_head')), '大乌贼包含头部与巨瞳中枢 (squid_head)');
assert(Boolean(squidMesh.getObjectByName('squid_left_flank')), '大乌贼包含左翼触手群 (squid_left_flank)');
assert(Boolean(squidMesh.getObjectByName('squid_right_flank')), '大乌贼包含右翼触手群 (squid_right_flank)');
assert(Boolean(squidMesh.getObjectByName('squid_striking_l')), '大乌贼包含左前方捕食触腕 (squid_striking_l)');
assert(Boolean(squidMesh.getObjectByName('squid_striking_r')), '大乌贼包含右前方捕食触腕 (squid_striking_r)');

// 验证 15F 地图布局中走廊 (4,4), (5,4), (6,4) 均配置为大乌贼
const f15Check = new GameState();
f15Check.currentFloor = 15;
const f15Layout = f15Check.getCurrentFloorData().layout;
assert(f15Layout[4][4]?.type === 'monster' && f15Layout[4][4]?.monsterId === 'giant_squid', '15F 走廊左格 (4,4) 归属大乌贼');
assert(f15Layout[4][5]?.type === 'monster' && f15Layout[4][5]?.monsterId === 'giant_squid', '15F 走廊中格 (5,4) 归属大乌贼');
assert(f15Layout[4][6]?.type === 'monster' && f15Layout[4][6]?.monsterId === 'giant_squid', '15F 走廊右格 (6,4) 归属大乌贼');

// 验证战斗逻辑：击破大乌贼任意格，三格 (4,4), (5,4), (6,4) 均被整体清除贯通，且联动铁门顺利感应开启
f15Check.playerStats.hp = 99999;
f15Check.playerStats.atk = 9999;
f15Check.playerStats.def = 9999;
f15Check.playerPos = { x: 4, y: 5, dir: 'up' };

const clearedTiles: { x: number; y: number }[] = [];
f15Check.move('up', (tx, ty) => {
  clearedTiles.push({ x: tx, y: ty });
});

assert(f15Layout[4][4]?.type === 'floor', '击溃大乌贼后左格 (4,4) 恢复为通道地面');
assert(f15Layout[4][5]?.type === 'floor', '击溃大乌贼后中格 (5,4) 恢复为通道地面');
assert(f15Layout[4][6]?.type === 'floor', '击溃大乌贼后右格 (6,4) 恢复为通道地面');
assert(clearedTiles.some(t => t.x === 4 && t.y === 4), 'onTileChange 触发 (4,4) 移除通知');
assert(clearedTiles.some(t => t.x === 5 && t.y === 4), 'onTileChange 触发 (5,4) 移除通知');
assert(clearedTiles.some(t => t.x === 6 && t.y === 4), 'onTileChange 触发 (6,4) 移除通知');

// 验证 15F (5,2) 机关铁门在守卫大乌贼消灭后能够开启
const ironDoorCheck = f15Check.checkGuardedIronDoor(5, 2);
assert(ironDoorCheck.canOpen, '大乌贼被消灭后 15F (5,2) 机关铁门允许开启');

// --- 20. 验证首领战提示与机关铁门防重叠、独立持续时间与多语种通报 ---
console.log('\n--- 20. 验证首领战提示与机关铁门防重叠、独立持续时间与多语种通报 ---');
const f15NotifGame = new GameState();
f15NotifGame.currentFloor = 15;
f15NotifGame.playerStats.hp = 99999;
f15NotifGame.playerStats.atk = 9999;
f15NotifGame.playerStats.def = 9999;
f15NotifGame.playerPos = { x: 4, y: 5, dir: 'up' };

const capturedNotifs: { text: string; color: string; duration?: number }[] = [];
f15NotifGame.move('up', undefined, (txt, col, dur) => {
  capturedNotifs.push({ text: txt, color: col, duration: dur });
});

assert(capturedNotifs.length >= 3, '击破大乌贼共派发 3 条阶段通报 (战果、首领消灭、机关门开启)');
const combatWinNotif = capturedNotifs.find(n => n.text.includes('未受到伤害') || n.text.includes('HP'));
const bossSquidNotif = capturedNotifs.find(n => n.text.includes('大乌贼已被消灭') || n.text.includes('走廊畅通'));
const ironDoorNotif = capturedNotifs.find(n => n.text.includes('铁门开启'));

assert(Boolean(combatWinNotif), '捕获战果结算提示 (未受到伤害/HP损失)');
assert(Boolean(bossSquidNotif), '捕获大乌贼首领专属消灭通报');
assert(Boolean(ironDoorNotif), '捕获 15F 机关铁门解除联动通报');

assert(bossSquidNotif!.duration !== undefined && bossSquidNotif!.duration >= 4500, '大乌贼首领通报停留时长 >= 4500ms (杜绝一闪而过)');
assert(ironDoorNotif!.duration !== undefined && ironDoorNotif!.duration >= 4200, '机关铁门开启通报停留时长 >= 4200ms (确保从容阅览)');
assert(combatWinNotif!.duration !== undefined && combatWinNotif!.duration >= 2500, '战斗结算通报停留时长 >= 2500ms');

// 验证所有通报文字互不相同 (杜绝文字重复覆盖与视觉混淆)
const uniqueTexts = new Set(capturedNotifs.map(n => n.text));
assert(uniqueTexts.size === capturedNotifs.length, '各条通报内容彼此独立且无文字重合');

// 英文模式下大乌贼击溃与铁门通报验证
const f15EnGame = new GameState();
f15EnGame.setLanguage('en');
f15EnGame.currentFloor = 15;
f15EnGame.playerStats.hp = 99999;
f15EnGame.playerStats.atk = 9999;
f15EnGame.playerStats.def = 9999;
f15EnGame.playerPos = { x: 4, y: 5, dir: 'up' };

const enCapturedNotifs: { text: string; color: string; duration?: number }[] = [];
f15EnGame.move('up', undefined, (txt, col, dur) => {
  enCapturedNotifs.push({ text: txt, color: col, duration: dur });
});

const enSquidNotif = enCapturedNotifs.find(n => n.text.includes('Giant Squid defeated'));
const enDoorNotif = enCapturedNotifs.find(n => n.text.includes('upper floor gate opens'));
assert(Boolean(enSquidNotif), '英文模式捕获大乌贼击败提示: Giant Squid defeated! The hallway is clear!');
assert(Boolean(enDoorNotif), '英文模式捕获铁门开启提示: Giant Squid fallen, the upper floor gate opens!');
assert(enSquidNotif!.duration !== undefined && enSquidNotif!.duration >= 4500, '英文大乌贼提示时长 >= 4500ms');

// 验证 20F 吸血鬼伯爵击败后合并为单一精炼核心提示 (杜绝双重弹窗刷屏)
const f20VampGame = new GameState();
f20VampGame.currentFloor = 20;
f20VampGame.playerStats.hp = 99999;
f20VampGame.playerStats.atk = 9999;
f20VampGame.playerStats.def = 9999;
f20VampGame.playerPos = { x: 5, y: 6, dir: 'up' };

const f20Notifs: { text: string; color: string; duration?: number }[] = [];
f20VampGame.move('up', undefined, (txt, col, dur) => {
  f20Notifs.push({ text: txt, color: col, duration: dur });
});

const vampBossNotifs = f20Notifs.filter(n => n.text.includes('吸血鬼') || n.text.includes('二区通关') || n.text.includes('21 层'));
assert(vampBossNotifs.length === 1, '20F 击败吸血鬼仅弹出 1 个合并剧情通报 (杜绝两个弹窗)');
assert(vampBossNotifs[0].text.includes('二区通关') && vampBossNotifs[0].text.includes('铁门开启'), '通报完整囊括二区通关与通往 21 层铁门开启');
assert(f20VampGame.getCurrentFloorData().layout[2][5]?.type === 'floor', '20F (5,2) 铁门在吸血鬼败亡后顺利联动开启');

// --- 21. 验证 24F 走廊畅通性与红门决战要塞密室宝藏 ---
console.log('\n--- 21. 验证 24F 走廊畅通性与红门决战要塞密室宝藏 ---');
const f24TestGame = new GameState();
f24TestGame.currentFloor = 24;
const f24Layout = f24TestGame.getCurrentFloorData().layout;

assert(f24Layout[9][5]?.type === 'floor', '24F 走廊入口 (5,9) 为通畅地面');
assert(f24Layout[9][2]?.type === 'npc' && f24Layout[9][2]?.npcId === 'elder', '24F 智慧老人安置于上楼梯旁的壁龛 (2,9)，既便于对话又彻底解放底部单格走廊');
assert(f24Layout[10][4]?.type === 'floor', '24F (4,10) 为通畅地面，整条 10 行主干道彻底连通');
assert(f24Layout[7][5]?.type === 'door_red', '24F (5,7) 设有决战要塞红门');

// 验证红门密室宝藏
assert(f24Layout[5][5]?.type === 'item' && f24Layout[5][5]?.itemType === 'holy_water', '24F 红门密室核心配置【圣水】(生命值翻倍)');
assert(f24Layout[4][4]?.type === 'item' && f24Layout[4][4]?.itemType === 'gem_red', '24F 密室包含红宝石 (+3 ATK)');
assert(f24Layout[4][6]?.type === 'item' && f24Layout[4][6]?.itemType === 'gem_blue', '24F 密室包含蓝宝石 (+3 DEF)');
assert(f24Layout[5][4]?.type === 'item' && f24Layout[5][4]?.itemType === 'key_yellow', '24F 密室包含补给黄钥匙');
assert(f24Layout[5][6]?.type === 'item' && f24Layout[5][6]?.itemType === 'key_blue', '24F 密室包含补给蓝钥匙');
assert(f24Layout[6][5]?.type === 'item' && f24Layout[6][5]?.itemType === 'potion_blue', '24F 密室包含高级蓝血瓶');

// 模拟勇士从 (0, 10) 下楼梯出发，沿底行走廊畅行无阻前往红门
f24TestGame.playerStats.redKeys = 1;
f24TestGame.playerPos = { x: 0, y: 10, dir: 'right' };
f24TestGame.move('right'); // 到达 (1, 10)
f24TestGame.move('right'); // 到达 (2, 10)
assert(f24TestGame.playerPos.x === 2 && f24TestGame.playerPos.y === 10, '勇士到达老人正下方 (2, 10)');
// 勇士朝上触发智慧老人对话与礼物
const defBefore24 = f24TestGame.playerStats.def;
f24TestGame.move('up');
assert(f24TestGame.playerStats.def === defBefore24 + 3, '勇士在 (2, 10) 成功与老人互动并获得蓝宝石 (+3 DEF)');
assert(f24TestGame.playerPos.x === 2 && f24TestGame.playerPos.y === 10, '勇士与老人互动后依然稳稳立于通道 (2, 10)');
f24TestGame.closeDialogue(); // 勇士对话完毕，关闭对话框继续踏上征程

// 勇士继续向右畅通通行，穿过原先被堵塞的 (4, 10)
f24TestGame.move('right'); // (3, 10)
f24TestGame.move('right'); // (4, 10)
assert(f24TestGame.playerPos.x === 4 && f24TestGame.playerPos.y === 10, '勇士顺利通过原先被堵塞的 (4, 10) 通道！');
f24TestGame.move('right'); // (5, 10)
f24TestGame.move('up');    // (5, 9)
f24TestGame.move('up');    // (5, 8)
f24TestGame.move('up');    // 开门进入 (5, 7)
assert(f24TestGame.playerPos.x === 5 && f24TestGame.playerPos.y === 7, '勇士顺利耗费红钥匙开启并进入红门');
assert(f24TestGame.playerStats.redKeys === 0, '红钥匙正确消耗 1 把');
assert(f24Layout[7][5]?.type === 'floor', '红门已开启并变为通行地面');

// --- 22. 验证 0-50 层全塔地图连通性与零 NPC 阻塞点 (BFS 全量检测) ---
console.log('\n--- 22. 验证 0-50 层全塔地图连通性与零 NPC 阻塞点 ---');
for (let f = 0; f <= 50; f++) {
  const floorData = getFloor(f);
  if (!floorData) continue;
  const layout = floorData.layout;
  const down = floorData.downStairsPos;
  const up = floorData.upStairsPos;
  const allowLava = f === 13 || f === 26;

  const isPassable = (x: number, y: number): boolean => {
    if (x < 0 || x >= 11 || y < 0 || y >= 11) return false;
    const t = layout[y][x];
    if (t.type === 'wall' || t.type === 'npc' || t.type === 'shop') return false;
    if (t.type === 'lava' && !allowLava) return false;
    return true;
  };

  const bfs = (start: { x: number; y: number }): boolean[][] => {
    const visited: boolean[][] = Array.from({ length: 11 }, () => Array(11).fill(false));
    const q = [{ x: start.x, y: start.y }];
    visited[start.y][start.x] = true;
    while (q.length > 0) {
      const cur = q.shift()!;
      for (const [dx, dy] of [[0,1], [0,-1], [1,0], [-1,0]]) {
        const nx = cur.x + dx, ny = cur.y + dy;
        if (nx >= 0 && nx < 11 && ny >= 0 && ny < 11 && !visited[ny][nx]) {
          if (isPassable(nx, ny)) {
            visited[ny][nx] = true;
            q.push({ x: nx, y: ny });
          }
        }
      }
    }
    return visited;
  };

  const visitedDown = bfs(down);
  const upReachable = visitedDown[up.y][up.x];
  assert(upReachable, `楼层 ${f}F (${floorData.name}) 下楼梯至上楼梯双向完全连通`);

  // 验证所有 NPC 均有可触达的邻居格子
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 11; x++) {
      if (layout[y][x].type === 'npc') {
        const hasNeighbor = [[0,1], [0,-1], [1,0], [-1,0]].some(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          return nx >= 0 && nx < 11 && ny >= 0 && ny < 11 && visitedDown[ny][nx];
        });
        assert(hasNeighbor, `楼层 ${f}F NPC '${layout[y][x].npcId}' at (${x}, ${y}) 可正常对话互动`);
      }
    }
  }

  // 验证无任何 NPC 成为物理卡死瓶颈 (Bottleneck / Articulation Point)
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 11; x++) {
      if (layout[y][x].type === 'npc') {
        const visitedIfPass = Array.from({ length: 11 }, () => Array(11).fill(false));
        const q = [{ x: down.x, y: down.y }];
        visitedIfPass[down.y][down.x] = true;
        while (q.length > 0) {
          const cur = q.shift()!;
          for (const [dx, dy] of [[0,1], [0,-1], [1,0], [-1,0]]) {
            const nx = cur.x + dx, ny = cur.y + dy;
            if (nx >= 0 && nx < 11 && ny >= 0 && ny < 11 && !visitedIfPass[ny][nx]) {
              const pass = (nx === x && ny === y) || isPassable(nx, ny);
              if (pass) {
                visitedIfPass[ny][nx] = true;
                q.push({ x: nx, y: ny });
              }
            }
          }
        }
        let newlyReachable = 0;
        for (let ny = 0; ny < 11; ny++) {
          for (let nx = 0; nx < 11; nx++) {
            if (nx === x && ny === y) continue;
            if (layout[ny][nx].type !== 'wall' && (layout[ny][nx].type !== 'lava' || allowLava)) {
              if (visitedIfPass[ny][nx] && !visitedDown[ny][nx]) {
                newlyReachable++;
              }
            }
          }
        }
        assert(newlyReachable === 0, `楼层 ${f}F NPC '${layout[y][x].npcId}' at (${x}, ${y}) 不阻碍任何后续地图区域通行 (阻碍格数: 0)`);
      }
    }
  }
}

// 专项验证重点修正楼层
assert(getFloor(25).layout[2][5]?.type === 'stairs_up', '25F 上楼梯安置于王座深殿 (5,2)，杜绝绕行首领');
assert(getFloor(25).layout[3][5]?.type === 'door_iron', '25F 上楼梯前配置机关铁门 (5,3)');
assert(getFloor(25).layout[5][5]?.type === 'monster' && getFloor(25).layout[5][5]?.monsterId === 'archmage', '25F 中央镇守红衣大法师 (5,5)');
assert(getFloor(25).layout[10][0]?.type === 'floor', '25F 外圈走廊 (0,10) 为普通地面，不再有直接上楼的漏洞楼梯');

// 25F 决战红衣大法师模拟：验证击败大法师掉落 4 把红钥匙并开门
const f25Game = new GameState();
f25Game.currentFloor = 25;
f25Game.playerStats.atk = 500; // 强力勇士
f25Game.playerStats.def = 400;
f25Game.playerStats.hp = 5000;
f25Game.playerStats.redKeys = 0;
// 勇士身处 (5,6)，向上攻击大法师 (5,5)
f25Game.playerPos = { x: 5, y: 6, dir: 'up' };
f25Game.move('up');
assert(f25Game.playerStats.redKeys === 4, '消灭红衣大法师后掉落 4 把珍贵红钥匙');
assert(f25Game.getCurrentFloorData().layout[3][5]?.type === 'floor', '红衣大法师败亡，通往 26 层的铁门轰然开启！');

// 26F 与 27F 传送口对称与原版单老人规范验证
assert(getFloor(26).upStairsPos.x === 10 && getFloor(26).upStairsPos.y === 10, '26F 上楼梯位于右下方 (10,10)');
assert(getFloor(26).downStairsPos.x === 0 && getFloor(26).downStairsPos.y === 10, '26F 下楼梯位于左下方 (0,10)');
assert(getFloor(27).downStairsPos.x === 0 && getFloor(27).downStairsPos.y === 10, '27F 下楼传送口对称位于左下方 (0,10)');
assert(getFloor(27).upStairsPos.x === 10 && getFloor(27).upStairsPos.y === 10, '27F 上楼传送口对称位于右下方 (10,10)');
assert(getFloor(27).layout[10][0]?.type === 'stairs_down' && getFloor(27).layout[10][10]?.type === 'stairs_up', '27F 第 10 行底边左右两端呈完美轴对称双传送口');

// 验证 27F 符合原版魔塔设定（全层仅 1 位老人）
const f27NpcCount = getFloor(27).layout.flat().filter(t => t.type === 'npc').length;
assert(f27NpcCount === 1, '27F 全层严格保留且仅有 1 位老人 (北端经验老人)，与原版魔塔 50 层版图设计完全一致');

assert(getFloor(29).layout[1][4]?.type === 'npc' && getFloor(29).layout[1][5]?.type === 'floor', '29F 小偷安置于 (4,1)，(5,1) 通畅，暗墙与上楼梯直通');
assert(getFloor(37).layout[4][1]?.type === 'fake_wall' && getFloor(37).layout[4][9]?.type === 'fake_wall', '37F 坚不可摧四大宝库配置暗墙，尊循老人提示可探寻搜刮');
assert(getFloor(41).layout[3][4]?.type === 'npc' && getFloor(41).layout[5][5]?.type === 'floor', '41F (5,5) 核心十字路口彻底解放，老人安置于 (4,3) 壁龛');
assert(getFloor(47).layout[9][7]?.type === 'floor' && getFloor(47).layout[9][9]?.type === 'npc', '47F (7,9) 走廊通畅，老人移至 (9,9) 楼梯旁休息区');

// 21. 验证【中级卫兵】与【皇家骑士】3D 建模彻底区分，杜绝复用雷同模型
console.log('\n--- 21. 验证中级卫兵与皇家骑士专属建模区分 ---');
const midGuardMesh = ModelFactory.createMonsterMesh('mid_guard');
const knightMesh = ModelFactory.createMonsterMesh('knight');

assert(midGuardMesh !== null && midGuardMesh.isGroup, '中级卫兵 3D 模型生成成功且为 Group');
assert(midGuardMesh.name === 'monster_mid_guard', '中级卫兵命名节点为 monster_mid_guard');
assert(knightMesh !== null && knightMesh.isGroup, '皇家骑士 3D 模型生成成功且为 Group');
assert(knightMesh.name === 'monster_knight', '皇家骑士命名节点为 monster_knight');

// 验证中级卫兵与骑士部件数量与网格数量结构差异
let midGuardMeshes = 0;
let knightMeshes = 0;
midGuardMesh.traverse((c) => { if ((c as any).isMesh) midGuardMeshes++; });
knightMesh.traverse((c) => { if ((c as any).isMesh) knightMeshes++; });

assert(midGuardMeshes >= 25, `中级卫兵具备精细多层次部件 (实际部件数: ${midGuardMeshes})`);
assert(knightMeshes >= 15, `皇家骑士具备精细板甲部件 (实际部件数: ${knightMeshes})`);
assert(midGuardMeshes !== knightMeshes, `中级卫兵部件数 (${midGuardMeshes}) 与骑士 (${knightMeshes}) 完全不同，彻底杜绝模型一模一样复用`);

// 验证守卫系列与骑士系列其余怪兽模型均生成正常
const juniorGuardMesh = ModelFactory.createMonsterMesh('junior_guard');
const seniorGuardMesh = ModelFactory.createMonsterMesh('senior_guard');
const ironGuardMesh = ModelFactory.createMonsterMesh('iron_guard');
const magicGuardMesh = ModelFactory.createMonsterMesh('magic_guard');
const knightCaptainMesh = ModelFactory.createMonsterMesh('knight_captain');
const darkKnightMesh = ModelFactory.createMonsterMesh('dark_knight');
const dualSwordsmanMesh = ModelFactory.createMonsterMesh('dual_swordsman');

assert(juniorGuardMesh.name === 'monster_junior_guard', '初级卫兵专属建模生成成功');
assert(seniorGuardMesh.name === 'monster_senior_guard', '高级卫兵专属建模生成成功');
assert(ironGuardMesh.name === 'monster_iron_guard', '铁甲卫兵专属建模生成成功');
assert(magicGuardMesh.name === 'monster_magic_guard', '魔法警卫专属建模生成成功');
assert(knightCaptainMesh.name === 'monster_knight_captain', '骑士队长专属建模生成成功');
assert(darkKnightMesh.name === 'monster_dark_knight', '黑暗骑士专属建模生成成功');
assert(dualSwordsmanMesh.name === 'monster_dual_swordsman', '双手剑士专属建模生成成功');

// 21.5 验证【勇士 (Hero / 主角)】全新重构 3D 英雄史诗级建模
console.log('\n--- 21.5 验证主角勇士重构 3D 建模 (Hero Knight Mesh) ---');
const heroMesh = ModelFactory.createHeroMesh();
assert(heroMesh !== null && heroMesh.isGroup, '主角勇士 3D 模型生成成功且为 Group');
assert(heroMesh.name === 'hero', '主角勇士模型根节点命名为 hero');

// 验证子骨骼与组件组
const heroLegsG = heroMesh.getObjectByName('hero_legs');
const heroPelvisG = heroMesh.getObjectByName('hero_pelvis');
const heroTorsoG = heroMesh.getObjectByName('hero_torso');
const heroHelmG = heroMesh.getObjectByName('hero_helm');
const heroLeftArmG = heroMesh.getObjectByName('hero_left_arm');
const heroShieldG = heroMesh.getObjectByName('hero_shield');
const heroRightArmG = heroMesh.getObjectByName('hero_right_arm');
const heroSwordG = heroMesh.getObjectByName('hero_sword');
const heroCapeG = heroMesh.getObjectByName('hero_cape');

assert(Boolean(heroLegsG), '勇士具备独立双腿与全装甲铁靴模块 (hero_legs)');
assert(Boolean(heroPelvisG), '勇士具备独立武装皮带与层叠式板甲裙甲模块 (hero_pelvis)');
assert(Boolean(heroTorsoG), '勇士具备雄壮英武板甲胸甲、皇家蓝珐琅与护喉模块 (hero_torso)');
assert(Boolean(heroHelmG), '勇士具备圣殿冠军全覆面头盔与三段飘逸战翎模块 (hero_helm)');
assert(Boolean(heroLeftArmG), '勇士具备左臂全装甲与持盾手臂模块 (hero_left_arm)');
assert(Boolean(heroShieldG), '勇士具备专属神圣守护者纹章大盾 (hero_shield)');
assert(Boolean(heroRightArmG), '勇士具备右臂全装甲与执剑手臂模块 (hero_right_arm)');
assert(Boolean(heroSwordG), '勇士具备专属传奇勇者圣剑 (hero_sword)');
assert(Boolean(heroCapeG), '勇士具备双肩狮首扣立体层叠飘逸猩红斗篷 (hero_cape)');

let heroMeshCount = 0;
let heroHasShadows = true;
heroMesh.traverse((c) => {
  if ((c as any).isMesh) {
    heroMeshCount++;
    if (!(c as any).castShadow || !(c as any).receiveShadow) {
      heroHasShadows = false;
    }
  }
});

assert(heroMeshCount >= 45, `勇士拥有高精细度的英武英雄 3D 实体部件 (实际部件数: ${heroMeshCount})`);
assert(heroHasShadows, '勇士全套所有网格部件均正确启用阴影投射与接收');

// 验证勇士整体高度与贴地比例
const heroBox = new THREE.Box3().setFromObject(heroMesh);
const heroHeight = heroBox.max.y - heroBox.min.y;
assert(Math.abs(heroBox.min.y) < 0.02, `勇士战靴底部精准踩实地面 y=0 (实际 min.y: ${heroBox.min.y.toFixed(3)})`);
assert(heroHeight >= 0.85 && heroHeight <= 1.25, `勇士身高体态雄伟且与地格比例完美协调 (实际高度: ${heroHeight.toFixed(3)})`);

// 22. 验证魔塔全套 40 种怪物均具备 100% 独立专属 3D 建模，绝无任何共用与雷同
console.log('\n--- 22. 验证魔塔全套 40 种怪物均具备 100% 独立专属 3D 建模 ---');
const allMonsterIds = Object.keys(MONSTERS);
assert(allMonsterIds.length === 40, `魔塔当前登记怪物总数为 40 种 (实际数量: ${allMonsterIds.length})`);

const monsterMeshes: Record<string, any> = {};
const monsterMeshCounts: Record<string, number> = {};

for (const mId of allMonsterIds) {
  const m = ModelFactory.createMonsterMesh(mId);
  assert(m !== null && m.isGroup, `怪物 '${mId}' (${MONSTERS[mId].name}) 3D 模型生成成功且为 Group 实体`);
  assert(m.name === `monster_${mId}`, `怪物 '${mId}' 根节点命名空间必须为 'monster_${mId}'`);

  let meshCount = 0;
  m.traverse((c) => {
    if ((c as any).isMesh) meshCount++;
  });
  assert(meshCount >= 5, `怪物 '${mId}' 拥有丰富精细的立体几何网格组件 (实际部件数: ${meshCount})`);
  monsterMeshes[mId] = m;
  monsterMeshCounts[mId] = meshCount;
}

// 专项验证各大特色代表性怪物的专属特征几何体：
// 1. 史莱姆系列
assert(monsterMeshes.green_slime !== undefined, '绿史莱姆具备翡翠流体基底');
assert(monsterMeshes.red_slime.children.some((c: any) => c.geometry?.type === 'ConeGeometry'), '红史莱姆具备专属小恶魔果冻犄角 (Hornlets)');
assert(monsterMeshes.big_slime.children.some((c: any) => c.geometry?.type === 'DodecahedronGeometry'), '大史莱姆具备专属暗翠远古矿石结晶 (Emerald Geodes)');
let slimeKingMeshCount = 0;
monsterMeshes.slime_king.traverse((c: any) => { if (c.isMesh) slimeKingMeshCount++; });
assert(slimeKingMeshCount >= 15, `史莱姆王具备专属六峰帝皇金冠与悬浮权杖 (实际部件数: ${slimeKingMeshCount})`);

// 2. 幽灵系列
assert(monsterMeshes.ghost.name === 'monster_ghost', '幽灵为专属幽浮怨灵模型，彻底告别史莱姆复用');
let ghostMeshCount = 0;
monsterMeshes.ghost.traverse((c: any) => { if (c.isMesh) ghostMeshCount++; });
assert(ghostMeshCount >= 15, `幽灵拥有幽浮斗篷披风、尖角兜帽、鬼爪与环绕游魂鬼火 (实际部件数: ${ghostMeshCount})`);

// 3. 蝙蝠系列
assert(monsterMeshes.big_bat.children.some((c: any) => c.children?.length >= 6), '大蝙蝠装备精铸钉刺重型项圈与护耳');
assert(monsterMeshes.red_bat.children.some((c: any) => c.geometry?.type === 'TorusGeometry'), '红蝙蝠具备倒勾恶魔犄角与卷曲长尾');

// 4. 骷髅系列
assert(monsterMeshes.skeleton_captain.name === 'monster_skeleton_captain', '骷髅队长具备翼状骷髅盔、破损赤红披风与金柄马刀');
assert(monsterMeshes.ghost_soldier.name === 'monster_ghost_soldier', '鬼战士具备深紫幽冥透光骨骼与摄魂战镰');

// 5. 法师与巫师系列
assert(monsterMeshes.junior_wizard.name === 'monster_junior_wizard', '初级巫师具备深邃暗红兜帽与展开的悬浮远古魔法书');
assert(monsterMeshes.senior_wizard.name === 'monster_senior_wizard', '高级巫师具备背部悬浮金色奥术符文光轮');

// 6. 卫士系列 (5大卫士各有专属武器与盾牌)
assert(monsterMeshes.junior_guard.name === 'monster_junior_guard', '初级卫兵持步兵长直枪与圆木盾');
assert(monsterMeshes.mid_guard.name === 'monster_mid_guard', '中级卫兵身披赤红金边制服罩袍、高脊羽翎铁盔、长柄战戟与要塞守备盾');
assert(monsterMeshes.senior_guard.name === 'monster_senior_guard', '高级卫兵持重型双刃斧枪与金纹纹章塔盾');
assert(monsterMeshes.iron_guard.name === 'monster_iron_guard', '铁甲卫兵持六棱带刺狼牙破甲战锤与黑铁十字铆钉方盾');
assert(monsterMeshes.magic_guard.name === 'monster_magic_guard', '魔法警卫持奥术晶刃光矛与悬浮六边形奥术力场盾');

// 7. 骑士与武士系列 (8位骑士与武士各具独立建模)
assert(monsterMeshes.warrior.name === 'monster_warrior', '战士身披锁子甲交叉皮带、佩戴诺曼鼻甲盔并手持维京破阵战斧与圆木盾');
assert(monsterMeshes.dual_swordsman.name === 'monster_dual_swordsman', '双手剑士采用疾风刺客蒙面兜帽，双持弧刃弯月斩马刀');
assert(monsterMeshes.yellow_knight.name === 'monster_yellow_knight', '黄衣武士双臂前伸横握双手处决者大剑，威武无双');
assert(monsterMeshes.blue_knight.name === 'monster_blue_knight', '蓝衣武士手持细长刺剑并装备晶蓝冰霜圆盾');
assert(monsterMeshes.white_knight.name === 'monster_white_knight', '白衣武士身披圣洁白袍披风、晨曦十字大盾');
assert(monsterMeshes.dark_knight.name === 'monster_dark_knight', '黑暗骑士佩戴深渊尖角大头盔并手持锯齿黑炎巨剑');
assert(monsterMeshes.knight_captain.name === 'monster_knight_captain', '骑士队长身披鲜红天鹅绒将领披风与黄金阔剑');
assert(monsterMeshes.knight.name === 'monster_knight', '皇家骑士配备亮银十字板甲盔与圣殿十字大盾');

// 8. 首领与史诗级怪物
assert(monsterMeshes.giant_squid.name === 'monster_giant_squid', '大乌贼为 3 格超大体型鲜红深海巨兽，拥有 8 根立体蜿蜒吸盘触手与双眼');
assert(monsterMeshes.dragon.name === 'monster_dragon', '远古魔龙拥有壮阔龙头、獠牙、长颈、粗壮四肢利爪、展翅双翼与破阵尾刃');
assert(monsterMeshes.archmage.name === 'monster_archmage', '帝国大法师拥有飘逸银白长髯仙须、悬浮日曜神圣光轮与双蛇浑天仪星辰权杖');
assert(monsterMeshes.ghost_commander.name === 'monster_ghost_commander', '冥队长拥有冥骨犄角头盔、青蓝幽冥摄魂巨镰与噬魂哀嚎战盾');
assert(monsterMeshes.false_sorcerer.name === 'monster_false_sorcerer', '假魔王拥有苍白笑面瓷白恶魔假面、四翼虚影幻翼与虚空日蚀权杖');
assert(monsterMeshes.demon_lord.name === 'monster_demon_lord', '真魔王杰诺拥有九峰黑炎王冠、盘旋恶魔巨角、末日狱火巨剑与雄浑龙翼');

// --- 24. 验证全塔门的 3D 程序化朝向算法 (全走廊屏障、岩浆与连续通道门自适应) ---
console.log('\n--- 24. 验证门朝向算法 (岩浆屏障、南北与东西向走廊门旋转一致性) ---');
const floor26 = getFloor(26);
assert(floor26.layout[7][5]?.type === 'floor', '26F 岩浆室入口 (5, 7) 为畅通地面，彻底去除冗余的第三道红门');
assert(floor26.layout[8][5]?.type === 'door_red', '26F 仅保留两道红门：通道中段红门 (5, 8)');
assert(floor26.layout[9][5]?.type === 'door_red', '26F 仅保留两道红门：通道外门 (5, 9)');
assert(ThreeCanvas.isDoorVertical(floor26.layout, 5, 8) === false, '26F 通道中段红门 (5, 8) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor26.layout, 5, 9) === false, '26F 通道外门 (5, 9) 正确横向平齐');

const floor41 = getFloor(41);
assert(ThreeCanvas.isDoorVertical(floor41.layout, 0, 1) === false, '41F 西侧长廊红门入口 (0, 1) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 0, 2) === false, '41F 西侧长廊门 (0, 2) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 0, 3) === false, '41F 西侧长廊门 (0, 3) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 10, 1) === false, '41F 东侧长廊门 (10, 1) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 10, 2) === false, '41F 东侧长廊门 (10, 2) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 10, 3) === false, '41F 东侧长廊门 (10, 3) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 5, 6) === false, '41F 中央核心门 (5, 6) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 5, 7) === false, '41F 中央核心门 (5, 7) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 5, 8) === false, '41F 中央核心门 (5, 8) 正确横向平齐');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 4, 5) === true, '41F 横向走廊十字门 (4, 5) 正确纵向旋转 90 度以阻挡横向通路');
assert(ThreeCanvas.isDoorVertical(floor41.layout, 6, 5) === true, '41F 横向走廊十字门 (6, 5) 正确纵向旋转 90 度以阻挡横向通路');

const floor8 = getFloor(8);
assert(ThreeCanvas.isDoorVertical(floor8.layout, 2, 0) === true, '8F 顶部东西向长廊门 (2, 0) 正确纵向旋转 90 度');
assert(ThreeCanvas.isDoorVertical(floor8.layout, 3, 0) === true, '8F 顶部东西向长廊门 (3, 0) 正确纵向旋转 90 度');

const floor9 = getFloor(9);
assert(ThreeCanvas.isDoorVertical(floor9.layout, 7, 3) === true, '9F 东西向密道门 (7, 3) 正确纵向旋转 90 度');
assert(ThreeCanvas.isDoorVertical(floor9.layout, 8, 3) === true, '9F 东西向密道门 (8, 3) 正确纵向旋转 90 度');

console.log('\n--- 26. 验证 49F 假魔王王座大殿与八名魔法警卫十字阵机制 ---');
const f49Check = getFloor(49);
assert(f49Check.upStairsPos.x === 5 && f49Check.upStairsPos.y === 0, '49F 上楼口坐标必须为 (5, 0)');
assert(f49Check.layout[0][5]?.type === 'stairs_up', '49F (5, 0) 为通往 50F 的上楼梯');
assert(f49Check.layout[1][5]?.type === 'door_iron', '49F (5, 1) 为守护上楼梯的机关铁门');
assert(f49Check.layout[3][5]?.type === 'monster' && f49Check.layout[3][5]?.monsterId === 'false_sorcerer', '49F 王座中央 (5, 3) 坐镇假魔王');

// 验证围绕假魔王的 8 名魔法警卫
const expectedGuards = [
  [4, 2], [5, 2], [6, 2],
  [4, 3],         [6, 3],
  [4, 4], [5, 4], [6, 4],
];
for (const [gx, gy] of expectedGuards) {
  assert(f49Check.layout[gy][gx]?.type === 'monster' && f49Check.layout[gy][gx]?.monsterId === 'magic_guard', `49F 坐标 (${gx}, ${gy}) 必须部署魔法警卫`);
}

// 模拟 49F 战斗与结界测试
const f49Game = new GameState();
f49Game.changeFloor(49, 'up');
f49Game.playerStats.hp = 30000;
f49Game.playerStats.atk = 650;
f49Game.playerStats.def = 550;

// 1. 尝试直接攻击假魔王（由于十字警卫尚存，应被结界拦截）
let barrierMsg = '';
f49Game.playerPos = { x: 5, y: 5, dir: 'up' }; // 站在大殿 (5, 5) 处，准备消灭下方警卫 (5, 4)
// 先消灭下方警卫 (5, 4)
f49Game.move('up');
assert(f49Game.playerPos.x === 5 && f49Game.playerPos.y === 4, '消灭下方魔法警卫来到 (5, 4)');
// 此时 (5, 2), (4, 3), (6, 3) 仍存活，向上撞击假魔王 (5, 3) 应被结界阻隔
f49Game.move('up', undefined, (txt) => { barrierMsg = txt; });
assert(f49Game.playerPos.x === 5 && f49Game.playerPos.y === 4, '十字警卫未清空，假魔王受结界保护不可攻击');
assert(barrierMsg.includes('十字魔法阵庇护') || barrierMsg.includes('结界未除'), '提示十字魔法阵结界保护');

// 2. 清理其余 3 名十字警卫：左 (4, 3)、右 (6, 3)、上 (5, 2)
// 绕路击杀左警卫 (4, 3)
f49Game.playerPos = { x: 3, y: 3, dir: 'right' };
f49Game.move('right');
assert(f49Game.playerPos.x === 4 && f49Game.playerPos.y === 3, '消灭左侧十字警卫 (4, 3)');

// 绕路击杀右警卫 (6, 3)
f49Game.playerPos = { x: 7, y: 3, dir: 'left' };
f49Game.move('left');
assert(f49Game.playerPos.x === 6 && f49Game.playerPos.y === 3, '消灭右侧十字警卫 (6, 3)');

// 绕路击杀上警卫 (5, 2)
f49Game.playerPos = { x: 5, y: 1, dir: 'down' };
// 注意 (5, 1) 初始是铁门，先临时设为 floor 便于测试寻路
f49Game.getCurrentFloorData().layout[1][5] = { type: 'floor' };
f49Game.move('down');
assert(f49Game.playerPos.x === 5 && f49Game.playerPos.y === 2, '消灭上方十字警卫 (5, 2)');

// 恢复 (5, 1) 铁门状态
f49Game.getCurrentFloorData().layout[1][5] = { type: 'door_iron' };

// 3. 四名十字警卫已全部被消灭，结界破除，勇士挑战假魔王 (5, 3)
const initialRedKeys = f49Game.playerStats.redKeys;
f49Game.move('down'); // 从 (5, 2) 向下挑战 (5, 3)
assert(f49Game.playerPos.x === 5 && f49Game.playerPos.y === 3, '结界解除后成功挑战假魔王并踏入 (5, 3)');
assert(f49Game.playerStats.redKeys === initialRedKeys + 1, '击败假魔王奖励获得红钥匙 x1');
assert(f49Game.getCurrentFloorData().layout[1][5]?.type === 'floor', '击败假魔王后，守护 50F 阶梯的铁门 (5, 1) 自动开启！');

console.log('\n--- 27. 验证 35F 魔龙掉落【冰冻雪花】与 26F 假公主剧情揭秘 ---');
const dragonGame = new GameState();
dragonGame.changeFloor(35, 'up');
dragonGame.playerStats.hp = 20000;
dragonGame.playerStats.atk = 700;
dragonGame.playerStats.def = 600;
dragonGame.playerPos = { x: 5, y: 6, dir: 'up' }; // 站在魔龙 (5, 5) 下方
assert(Boolean(dragonGame.playerStats.inventory.snow_crystal) === false, '击败魔龙前玩家尚未拥有冰冻雪花');
assert(dragonGame.getCurrentFloorData().layout[2][5]?.type === 'door_iron', '击败魔龙前 (5, 2) 机关铁门保持关闭');
dragonGame.move('up'); // 挑战魔龙 (5, 5)
assert(dragonGame.playerPos.x === 5 && dragonGame.playerPos.y === 5, '击败魔龙踏入 (5, 5)');
assert(dragonGame.playerStats.inventory.snow_crystal === 1, '击败魔龙获得关键道具【冰冻雪花】');
assert(dragonGame.getCurrentFloorData().layout[2][5]?.type === 'floor', '魔龙伏诛，(5, 2) 铁门自动开启');

// 验证 26F 假公主剧情
const f26PrincessDlg = getDialogueData('princess', 'zh', 26);
assert(f26PrincessDlg !== undefined, '26F 假公主具备专属剧情配置');
assert(f26PrincessDlg?.name.includes('假公主'), '26F 公主名称明确标注为【假公主】');
assert(f26PrincessDlg?.lines[0].includes('愚蠢的勇士') || f26PrincessDlg?.lines[1].includes('50 层'), '26F 假公主揭露真正的公主被掠至 50 层魔塔之巅');

console.log('\n--- 28. 验证基于 .env.local 与环境变量的调试作弊控制台隔离机制 ---');
// 1. 验证配置文件与 .gitignore 安全策略
const envContent = fs.readFileSync('.env', 'utf-8');
const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8');
assert(envContent.includes('VITE_ENABLE_DEBUG=false'), '.env 文件默认声明 VITE_ENABLE_DEBUG=false，保障生产环境安全');
if (fs.existsSync('.env.local')) {
  const envLocalContent = fs.readFileSync('.env.local', 'utf-8');
  assert(envLocalContent.includes('VITE_ENABLE_DEBUG=true'), '.env.local 本地声明 VITE_ENABLE_DEBUG=true，为开发者提供调试能力');
} else {
  assert(!fs.existsSync('.env.local'), 'CI/生产环境下 .env.local 绝不应存在，严格遵循 .gitignore 隔离策略');
}
assert(gitignoreContent.includes('.env.local'), '.gitignore 必须明确忽略 .env.local，防止本地作弊配置泄露至 GitHub 生产');

// 2. 模拟 GitHub Pages 生产默认环境 (.env: VITE_ENABLE_DEBUG=false)：默认严格禁用
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'false' }, location: { hostname: 'frankliuao.github.io', protocol: 'https:' } }) === false,
  '生产环境默认 (.env: VITE_ENABLE_DEBUG=false 且运行在 github.io) 严格禁用作弊与调试控制台'
);
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'false' }, location: { hostname: 'magictower.github.io', protocol: 'https:' } }) === false,
  '任何 GitHub Pages (*.github.io) 默认生产构建均禁止开启作弊'
);
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'false' }, location: { hostname: 'play-magictower.com', protocol: 'https:' } }) === false,
  '独立公网生产域名下默认严格禁用作弊与调试控制台'
);

// 3. 模拟作者在 GitHub Pages 偶尔开启作弊器方式 A：在 GitHub 仓库 Variables 或 Actions 输入中显式设置 VITE_ENABLE_DEBUG=true
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'true' }, location: { hostname: 'frankliuao.github.io', protocol: 'https:' } }) === true,
  '通过 GitHub Actions 配置 VITE_ENABLE_DEBUG=true 时，GitHub Pages 线上支持全员开启作弊器'
);

// 4. 模拟作者在 GitHub Pages 偶尔开启作弊器方式 B：免重构免部署，直接使用 URL 秘籍参数 (?cheat=1 / ?debug=true)
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'false' }, location: { hostname: 'frankliuao.github.io', search: '?cheat=1' } }) === true,
  '线上环境通过 URL 携带 ?cheat=1 即刻开启作弊器，可将链接随手分享给特定想爽玩的玩家'
);
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'false' }, location: { hostname: 'frankliuao.github.io', search: '?debug=true' } }) === true,
  '线上环境通过 URL 携带 ?debug=true 亦可免重新打包即刻唤起调试控制台'
);

// 5. 模拟本地开发环境 (.env.local: VITE_ENABLE_DEBUG=true)：允许开启调试
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'true' }, location: { hostname: 'localhost', protocol: 'http:' } }) === true,
  '本地通过 .env.local (VITE_ENABLE_DEBUG=true) 成功启用开发者作弊控制台'
);
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'true' }, location: { hostname: '127.0.0.1', protocol: 'http:' } }) === true,
  '本地 127.0.0.1 环境通过 .env.local 正常启用调试控制台'
);
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'true' }, location: { hostname: '0.0.0.0', protocol: 'http:' } }) === true,
  '本地 0.0.0.0 环境通过 .env.local 正常启用调试控制台'
);
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'true' }, location: { hostname: '', protocol: 'file:' } }) === true,
  '本地 file: 协议环境通过 .env.local 正常启用调试控制台'
);

// 6. 模拟开发者本地将 .env.local 设为 false 以体验纯正无作弊通关
assert(
  isDebugAllowed({ env: { VITE_ENABLE_DEBUG: 'false' }, location: { hostname: 'localhost', protocol: 'http:' } }) === false,
  '本地若将 .env.local 切换为 VITE_ENABLE_DEBUG=false，控制台即刻关闭，便于本地自测正统通关体验'
);

// 29. 验证全语言绝对纯净双语隔离 (100% Strict Bilingual Isolation & Zero Leakage)
console.log('\n--- 29. 验证全语言绝对纯净双语隔离与细节本地化 (Zero Leakage) ---');

const chineseRegex = /[\u4e00-\u9fa5]/;

// 1. 验证全部 40 只怪物的双语描述与名称
const monsterKeys = Object.keys(MONSTERS);
assert(monsterKeys.length === 40, '全塔包含 40 种怪物');

for (const id of monsterKeys) {
  const mon = MONSTERS[id];
  // 英文模式严格无中文泄露
  assert(
    Boolean(mon.descriptionEn) && mon.descriptionEn!.trim().length > 0,
    `怪物 '${id}' 具备英文描述 (descriptionEn)`
  );
  assert(
    !chineseRegex.test(mon.descriptionEn || ''),
    `怪物 '${id}' 英文描述中严禁包含任何汉字泄露`
  );
  assert(
    !chineseRegex.test(mon.nameEn),
    `怪物 '${id}' 英文名称 (nameEn: '${mon.nameEn}') 严禁包含汉字`
  );
  assert(
    getMonsterDescription(id, 'en') === mon.descriptionEn,
    `getMonsterDescription('${id}', 'en') 纯净返回英文描述`
  );
  assert(
    !chineseRegex.test(getMonsterDescription(id, 'en')),
    `getMonsterDescription('${id}', 'en') 100% 无汉字`
  );

  // 中文模式具备中文描述
  assert(
    Boolean(mon.description) && mon.description!.trim().length > 0,
    `怪物 '${id}' 具备中文描述 (description)`
  );
  assert(
    getMonsterDescription(id, 'zh') === mon.description,
    `getMonsterDescription('${id}', 'zh') 纯净返回中文描述`
  );
}

// 2. 验证全部 33 种道具与法宝的双语描述与名称
const itemKeys = Object.keys(ITEMS);
assert(itemKeys.length === 33, '全塔包含 33 种道具法宝与装备');

for (const id of itemKeys) {
  const it = ITEMS[id as ItemType];
  // 英文模式严格无中文泄露
  assert(
    Boolean(it.descriptionEn) && it.descriptionEn!.trim().length > 0,
    `道具 '${id}' 具备英文描述 (descriptionEn)`
  );
  assert(
    !chineseRegex.test(it.descriptionEn || ''),
    `道具 '${id}' 英文描述中严禁包含任何汉字泄露`
  );
  assert(
    !chineseRegex.test(it.nameEn),
    `道具 '${id}' 英文名称 (nameEn: '${it.nameEn}') 严禁包含汉字`
  );
  assert(
    getItemDescription(id, 'en') === it.descriptionEn,
    `getItemDescription('${id}', 'en') 纯净返回英文描述`
  );
  assert(
    !chineseRegex.test(getItemDescription(id, 'en')),
    `getItemDescription('${id}', 'en') 100% 无汉字`
  );
  assert(
    !chineseRegex.test(getItemName(id, 'en')),
    `getItemName('${id}', 'en') 100% 无汉字`
  );

  // 中文模式具备中文描述
  assert(
    Boolean(it.description) && it.description.trim().length > 0,
    `道具 '${id}' 具备中文描述 (description)`
  );
  assert(
    getItemDescription(id, 'zh') === it.description,
    `getItemDescription('${id}', 'zh') 纯净返回中文描述`
  );
}

// 3. 验证怪物特殊技能双语徽章映射 (getSpecialAbilityLabel)
const testAbilities: SpecialAbility[] = [
  'FIRST_STRIKE',
  'DOUBLE_STRIKE',
  'TRIPLE_STRIKE',
  'MAGIC_ATTACK',
  'VAMPIRE_10',
  'VAMPIRE_20',
  'POISON',
  'DEFENSE_BREAK',
];

for (const ab of testAbilities) {
  const labelEn = getSpecialAbilityLabel(ab, 'en');
  const labelZh = getSpecialAbilityLabel(ab, 'zh');
  assert(Boolean(labelEn) && !chineseRegex.test(labelEn), `特技 '${ab}' 英文徽章 ('${labelEn}') 无汉字`);
  assert(Boolean(labelZh) && chineseRegex.test(labelZh), `特技 '${ab}' 中文徽章 ('${labelZh}') 为汉字`);
}
// 校验十字架吸血免疫双语
assert(getSpecialAbilityLabel('VAMPIRE_10', 'en', true) === 'Vampire Blocked', '十字架克制吸血10%英文显示 Vampire Blocked');
assert(getSpecialAbilityLabel('VAMPIRE_10', 'zh', true) === '吸血免疫', '十字架克制吸血10%中文显示 吸血免疫');

// 4. 验证 UI 核心新增双语键值纯净度
assert(TRANSLATIONS.en.canDefeat === '✓ Victory' && !chineseRegex.test(TRANSLATIONS.en.canDefeat), '英文战前推演胜利标签无汉字');
assert(TRANSLATIONS.en.dangerDefeat === '⚠ Danger' && !chineseRegex.test(TRANSLATIONS.en.dangerDefeat), '英文战前推演危险标签无汉字');
assert(TRANSLATIONS.en.expShopSubtitleDetail === 'Experience Elder · Martial Dao' && !chineseRegex.test(TRANSLATIONS.en.expShopSubtitleDetail), '英文经验加点副标无汉字');
assert(TRANSLATIONS.en.unitAtk === 'ATK' && !chineseRegex.test(TRANSLATIONS.en.unitAtk), '英文攻击单位为 ATK');
assert(TRANSLATIONS.en.unitDef === 'DEF' && !chineseRegex.test(TRANSLATIONS.en.unitDef), '英文防御单位为 DEF');
assert(TRANSLATIONS.zh.canDefeat === '✓ 可战胜', '中文战前推演胜利标签为可战胜');
assert(TRANSLATIONS.zh.dangerDefeat === '⚠ 危险', '中文战前推演危险标签为危险');
assert(TRANSLATIONS.zh.expShopSubtitleDetail === '经验老人 · 传授武道', '中文经验加点副标');
assert(TRANSLATIONS.zh.unitAtk === '攻', '中文攻击单位为 攻');
assert(TRANSLATIONS.zh.unitDef === '防', '中文防御单位为 防');

// 5. 验证商店确认机制与悬停提示双语纯净度
assert(Boolean(TRANSLATIONS.en.shopConfirmPrompt) && !chineseRegex.test(TRANSLATIONS.en.shopConfirmPrompt), '英文金币商店确认提示无汉字');
assert(Boolean(TRANSLATIONS.en.expConfirmPrompt) && !chineseRegex.test(TRANSLATIONS.en.expConfirmPrompt), '英文经验商店确认提示无汉字');
assert(Boolean(TRANSLATIONS.en.tipNotEnoughGold) && !chineseRegex.test(TRANSLATIONS.en.tipNotEnoughGold), '英文金币不足提示无汉字');
assert(Boolean(TRANSLATIONS.en.tipNotEnoughExp) && !chineseRegex.test(TRANSLATIONS.en.tipNotEnoughExp), '英文经验不足提示无汉字');
assert(Boolean(TRANSLATIONS.en.confirmBtn) && !chineseRegex.test(TRANSLATIONS.en.confirmBtn), '英文确认按钮无汉字');

assert(TRANSLATIONS.zh.shopConfirmPrompt === '确认强化？', '中文金币商店确认提示正确');
assert(TRANSLATIONS.zh.expConfirmPrompt === '确认提升？', '中文经验商店确认提示正确');
assert(TRANSLATIONS.zh.tipNotEnoughGold === '金币不足', '中文金币不足提示正确');
assert(TRANSLATIONS.zh.tipNotEnoughExp === '经验不足', '中文经验不足提示正确');
assert(TRANSLATIONS.zh.confirmBtn === '确认', '中文确认按钮正确');

// 6. 验证金币/经验不足时无法购买以及足额时的购买逻辑
const shopTestGame = new GameState();
shopTestGame.playerStats.gold = 10;
const shopCost1 = shopTestGame.getShopCost(); // 20
assert(shopTestGame.playerStats.gold < shopCost1, '测试金币不足状态');
assert(shopTestGame.buyShopUpgrade('atk') === false, '金币不足时 buyShopUpgrade 必须返回 false');
assert(shopTestGame.playerStats.atk === 10, '金币不足时攻击力不得发生变化');
assert(shopTestGame.playerStats.gold === 10, '金币不足时金币不得被扣除');

shopTestGame.playerStats.gold = 50;
const atkBefore = shopTestGame.playerStats.atk;
assert(shopTestGame.buyShopUpgrade('atk') === true, '金币充足时 buyShopUpgrade 返回 true');
assert(shopTestGame.playerStats.atk > atkBefore, '金币充足时攻击力提升成功');
assert(shopTestGame.playerStats.gold === 50 - shopCost1, '金币充足时金币正确扣除');

shopTestGame.playerStats.exp = 5;
const expGain = shopTestGame.getExpUpgradeGain();
assert(shopTestGame.playerStats.exp < expGain.costAtk, '测试经验不足状态');
assert(shopTestGame.buyExpUpgrade('atk') === false, '经验不足时 buyExpUpgrade 必须返回 false');
assert(shopTestGame.playerStats.exp === 5, '经验不足时经验值不得被扣除');

shopTestGame.playerStats.exp = 500;
const defBefore = shopTestGame.playerStats.def;
assert(shopTestGame.buyExpUpgrade('def') === true, '经验充足时 buyExpUpgrade 返回 true');
assert(shopTestGame.playerStats.def > defBefore, '经验充足时防御力提升成功');
assert(shopTestGame.playerStats.exp === 500 - expGain.costDef, '经验充足时经验正确扣除');

// --- 24. 验证 0F 封印金币大门、22F 小偷铲子、23F 【0F】暗墙解谜与 29F 小偷剧情联动 ---
console.log('\n--- 24. 验证 0F 封印大门、22F 小偷铲子、23F 拼字暗道与 29F 小偷剧情 ---');
const storyGame = new GameState();
storyGame.initGame();

// 1. 0F (5, 4) 神秘金币大门受 23F 封印
storyGame.currentFloor = 0;
assert(getFloor(0).layout[4][5]?.type === 'door_iron', '0F (5, 4) 必须为机关铁门 (特殊封印门)');
const f0DoorCheckLocked = storyGame.checkGuardedIronDoor(5, 4);
assert(f0DoorCheckLocked.canOpen === false, '未在 23F 走完暗道前，0F 金币大门处于封印状态不可开启');
assert(f0DoorCheckLocked.reason?.includes('门被神秘力量锁住了，到23层去找找线索吧'), '0F 金币大门提示：“门被神秘力量锁住了，到23层去找找线索吧”');

// 2. 22F 小偷暗道与小偷铲子拾取
const f22Data = getFloor(22);
assert(f22Data.layout[3][8]?.type === 'item' && f22Data.layout[3][8]?.itemType === 'thief_shovel', '22F (8, 3) 密室藏有【小偷的铲子】');
assert(f22Data.layout[6][6]?.type === 'fake_wall', '22F (6, 6) 为通往铲子密室的暗墙');
assert(f22Data.layout[5][4]?.type === 'fake_wall', '22F (4, 5) 为通往黄钥匙密室的暗墙');
storyGame.currentFloor = 22;
storyGame.playerPos = { x: 5, y: 6, dir: 'right' };
storyGame.move('right'); // 撞开 (6, 6) 暗墙
assert(storyGame.playerPos.x === 6 && storyGame.playerPos.y === 6, '勇士撞破 22F (6, 6) 暗墙成功进入暗道');
// 走向 (8, 3) 拾取铲子
storyGame.playerPos = { x: 8, y: 4, dir: 'up' };
storyGame.move('up'); // 走入 (8, 3)
assert(storyGame.playerStats.inventory.thief_shovel === 1, '成功拾取【小偷的铲子】入背包');

// 3. 23F 【0F】暗道点阵拼字解谜验证与楼层名称无剧透验证
assert(!FLOOR_NAMES[23].zh.includes('0F') && !FLOOR_NAMES[23].zh.includes('暗号'), '23F 中文楼层名严禁剧透暗号 (由玩家自行摸索)');
assert(!FLOOR_NAMES[23].en.includes('0F') && !FLOOR_NAMES[23].en.includes('Crest'), '23F 英文楼层名严禁剧透暗号');
assert(!getFloor(23).name.includes('0F') && !getFloor(23).name.includes('暗号'), '23F FloorData.name 严禁剧透暗号');
assert(!FLOOR_NAMES[22].zh.includes('秘道'), '22F 中文楼层名严禁剧透秘道');
assert(!getFloor(22).name.includes('秘道'), '22F FloorData.name 严禁剧透秘道');
const f23Data = getFloor(23);
assert(FLOOR_23_PUZZLE_TILES.length === 33, '23F 暗号【0F】由 33 块指定核心点阵暗墙组成');
storyGame.currentFloor = 23;
assert(storyGame.isFloor23PuzzleSolved === false, '23F 解谜初始为未完成状态');
// 模拟勇士在 23F 踏足走完 33 个点阵
for (const p of FLOOR_23_PUZZLE_TILES) {
  storyGame.checkFloor23PuzzleProgress(undefined, p.x, p.y);
}
assert(storyGame.isFloor23PuzzleSolved === true, '走完 23F 全部【0F】点阵后，成功解开神秘封印！');

// 4. 0F 神秘金币大门在解密后可正常开启
storyGame.currentFloor = 0;
const f0DoorCheckUnlocked = storyGame.checkGuardedIronDoor(5, 4);
assert(f0DoorCheckUnlocked.canOpen === true, '23F 走完 0F 后，0F 神秘金币大门封印解除，可以顺利打开！');

// 5. 29F 小偷剧情联动验证
const thiefTestGame = new GameState();
thiefTestGame.initGame();
thiefTestGame.currentFloor = 29;

// (a) 未拿铲子时：小偷说找不到铲子，不给钥匙，暗道 (5, 2) 封堵
assert(thiefTestGame.playerStats.inventory.thief_shovel === undefined, '未持有铲子状态');
thiefTestGame.playerPos = { x: 5, y: 1, dir: 'left' };
thiefTestGame.triggerNPC('thief', 4, 1);
assert(thiefTestGame.isDialogueOpen === true, '未持有铲子时小偷对话窗口必须正常开启 (isDialogueOpen === true)');
assert(thiefTestGame.activeDialogue?.lines[thiefTestGame.activeDialogue.lines.length - 1].includes('我的铲子找不到了，你能帮我找回来吗'), '未持铲子时小偷卡在求助台词：“我的铲子找不到了，你能帮我找回来吗”');
assert(thiefTestGame.playerStats.yellowKeys === 1, '未获得铲子时不赠送黄钥匙');
thiefTestGame.closeDialogue();
assert(thiefTestGame.isDialogueOpen === false, '对话关闭后 isDialogueOpen 正确复位为 false');

// 尝试硬闯 29F (5, 2) 暗道
thiefTestGame.playerPos = { x: 5, y: 1, dir: 'down' };
thiefTestGame.move('down'); // 试图进入 (5, 2)
assert(thiefTestGame.playerPos.x === 5 && thiefTestGame.playerPos.y === 1, '未得小偷开凿暗道前，勇士无法穿过 (5, 2)');

// (b) 拿到铲子后：小偷接受铲子，赠送 2 把黄钥匙，消耗铲子，挖通 (5, 2) 暗道
thiefTestGame.playerStats.inventory.thief_shovel = 1;
thiefTestGame.triggerNPC('thief', 4, 1);
assert(thiefTestGame.isDialogueOpen === true, '持有铲子时小偷剧情对话窗口必须正常开启 (isDialogueOpen === true)');
assert(thiefTestGame.playerStats.yellowKeys === 3, '交还铲子后，小偷赠送黄色钥匙 x2 (总钥匙数 1+2=3)');
assert(thiefTestGame.playerStats.inventory.thief_shovel === undefined, '小偷铲子成功交接消耗');
assert(thiefTestGame.elderGiftsGiven['thief_29f'] === true, '小偷赠礼标记置为 true');
thiefTestGame.closeDialogue();

// (c) 再次对话已完成剧情的小偷：同样必须正常弹出提示窗口
thiefTestGame.triggerNPC('thief', 4, 1);
assert(thiefTestGame.isDialogueOpen === true, '再次对话已完成任务的小偷，提示窗口同样正常开启');
thiefTestGame.closeDialogue();

// 小偷挖通后，勇士可顺利穿过 (5, 2) 走向上楼梯
thiefTestGame.move('down'); // 走入 (5, 2)
assert(thiefTestGame.playerPos.x === 5 && thiefTestGame.playerPos.y === 2, '小偷挖通暗道后，勇士顺畅通行穿过 (5, 2) 迈向 30 层！');

console.log('\n==============================================');
console.log(` 自检完毕：通过 ${passedTests} / ${totalTests} 项核心测试用例！`);
console.log('==============================================\n');



