// src/test_run.ts
import { GameState } from './game/gameState';
import { getFloor } from './data/floors';
import { MONSTERS } from './data/monsters';
import { calculateBattle } from './game/combat';
import { findPathToAdjacent } from './game/pathfinding';

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
assert(game.currentFloor === 1, '初始处于经典第 1 层');
assert(game.playerPos.x === 5 && game.playerPos.y === 10, '玩家出生在 1 层入口 (5, 10)');

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

console.log('\n==============================================');
console.log(` 自检完毕：通过 ${passedTests} / ${totalTests} 项核心测试用例！`);
console.log('==============================================\n');
