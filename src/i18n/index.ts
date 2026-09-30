// src/i18n/index.ts
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'zh' | 'en';

export interface Translations {
  // Topbar
  gameTitle: string;
  autoPathTip: string;
  monsterManualBtn: string;
  floorJumpBtn: string;
  saveBtn: string;
  loadBtn: string;
  muteTip: string;
  unmuteTip: string;
  debugTip: string;
  restartTip: string;
  langToggleTip: string;

  // Sidebar
  towerSubtitle: string;
  hp: string;
  atk: string;
  def: string;
  gold: string;
  exp: string;
  yellowKey: string;
  blueKey: string;
  redKey: string;
  equipAndRelics: string;
  weapon: string;
  shield: string;
  none: string;
  relicManual: string;
  relicCompass: string;
  relicCross: string;
  noRelics: string;
  moveControls: string;
  arrowKeysHint: string;
  up: string;
  down: string;
  left: string;
  right: string;

  // Viewport & Bottom overlays
  spaceResetPrompt: string;
  spaceResetFloating: string;
  zoomResetFloating: string;
  hintMove: string;
  hintInspect: string;
  hintPath: string;
  hintPan: string;
  hintRotate: string;
  hintZoom: string;
  hintManual: string;
  hintCompass: string;
  zoomInTip: string;
  zoomOutTip: string;
  zoomResetTip: string;
  restartConfirm: string;
  spaceResetBtnTitle: string;
  spaceResetKey: string;
  spaceResetText: string;
  pressKey: string;

  // Inspect Card
  inspectTitle: string;
  inspectCoordinate: string;
  inspectEngageBtn: string;
  inspectCloseBtn: string;
  inspectMonsterCategory: string;
  inspectItemCategory: string;
  inspectNpcCategory: string;
  inspectDoorCategory: string;
  inspectStairsCategory: string;
  inspectShopCategory: string;
  inspectLavaCategory: string;
  inspectWallCategory: string;
  inspectFloorCategory: string;
  inspectLavaFrozenNotice: string;
  inspectLavaBlockedNotice: string;
  inspectDoorOwned: string;
  inspectDoorMissing: string;
  inspectDoorFree: string;
  inspectStairsUp: string;
  inspectStairsDown: string;
  inspectShopDesc: string;
  inspectWallDesc: string;
  inspectFakeWallDesc: string;
  inspectFloorDesc: string;
  inspectRightDblClickHint: string;

  // Monster Manual
  manualTitle: string;
  manualSubtitle: string;
  currentFloorPrefix: string;
  noMonstersOnFloor: string;
  countLabel: string;
  estDamage: string;
  roundsLabel: string;
  immuneLabel: string;
  cannotPierce: string;
  breakpointTitle: string;
  raiseAtkPrefix: string;
  saveHpPrefix: string;
  alreadyZeroDamage: string;
  rewardGold: string;
  rewardExp: string;
  specialTrait: string;
  specialFirstStrike: string;
  specialVampire: string;
  specialVampireBlocked: string;
  specialDouble: string;
  specialTriple: string;
  specialPoison: string;
  closeManual: string;
  cannotBreakDefDetail: string;
  insufficientHp: string;
  flawlessVictory: string;
  estDamageDetail: string;
  breakpointUpgrade: string;
  breakpointNeed: string;
  breakpointBenefit: string;
  magicAttack: string;

  // Shop Modal
  shopTitle: string;
  shopSubtitle: string;
  shopCurrentGold: string;
  shopPrayerCost: string;
  shopBlessingHp: string;
  shopBlessingAtk: string;
  shopBlessingDef: string;
  shopLeave: string;
  shopSuccessFloating: string;
  shopNotEnoughGold: string;
  shopTotalPrayers: string;

  // Dialogue Modal
  dialogueNext: string;
  dialogueProceed: string;

  // Floor Teleport Modal
  teleportTitle: string;
  teleportSubtitle: string;
  cancelBtn: string;

  // Game Over Modal
  victoryTitle: string;
  victoryDesc: string;
  remainingHp: string;
  finalAtk: string;
  finalDef: string;
  accumulatedGold: string;
  restartVictory: string;
  defeatTitle: string;
  defeatDesc: string;
  loadLastSave: string;
  restartFromFloor1: string;
  defeatFloorDesc: string;
  restartGame: string;

  // Debug Panel
  debugTitle: string;
  debugSubtitle: string;
  debugStats: string;
  debugKeys: string;
  debugGold: string;
  debugRelics: string;
  debugJumpFloor: string;
  debugClearMonsters: string;
  debugClose: string;
  debugWarpToFloor: string;
  debugWarpBtn: string;
  debugClearBtn: string;

  // Notifications
  savedSuccess: string;
  loadSuccess: string;
  noSaveFound: string;
  clearedMonstersFloating: string;
  teleportedToPrefix: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  zh: {
    // Topbar
    gameTitle: '魔塔 3D 经典版',
    autoPathTip: '右键地板自动找路 (避开怪物)',
    monsterManualBtn: '怪物手册',
    floorJumpBtn: '楼层跳跃',
    saveBtn: '存盘',
    loadBtn: '读盘',
    muteTip: '静音',
    unmuteTip: '开启音效',
    debugTip: '开发者作弊与数值调试',
    restartTip: '重新开始游戏',
    langToggleTip: '切换为英文 (Switch to English)',

    // Sidebar
    towerSubtitle: 'MAGIC TOWER 3D',
    hp: '生命值',
    atk: '攻击力',
    def: '防御力',
    gold: '金币',
    exp: '经验',
    yellowKey: '黄钥匙',
    blueKey: '蓝钥匙',
    redKey: '红钥匙',
    equipAndRelics: '当前佩装 & 神器',
    weapon: '武器：',
    shield: '盾牌：',
    none: '无',
    relicManual: '手册',
    relicCompass: '罗盘',
    relicCross: '十字架',
    noRelics: '尚未获得神器',
    moveControls: '方向移动控制',
    arrowKeysHint: '方向键 (↑↓←→)',
    up: '上 (↑)',
    down: '下 (↓)',
    left: '左 (←)',
    right: '右 (→)',

    // Viewport & Bottom overlays
    spaceResetPrompt: '按 空格 复位勇士视野',
    spaceResetFloating: '视野已复位聚焦至勇士',
    zoomResetFloating: '缩放与平移已重置为 100%',
    hintMove: '行走: 方向键',
    hintInspect: '检视: 单击目标',
    hintPath: '寻路/交互: 右键双击',
    hintPan: '平移: Ctrl+拖动',
    hintRotate: '旋转: Shift+拖动',
    hintZoom: '缩放: Ctrl+滚轮',
    hintManual: '手册: L',
    hintCompass: '罗盘: G',
    zoomInTip: '放大视野以查看细节 (Ctrl + 滚轮向上)',
    zoomOutTip: '缩小视野以纵览全图 (Ctrl + 滚轮向下)',
    zoomResetTip: '点击重置缩放 100%',
    restartConfirm: '确认重新开始游戏吗？当前进度将重置。',
    spaceResetBtnTitle: '按空格键或点击此处复位视野至勇士',
    spaceResetKey: '空格',
    spaceResetText: '复位勇士视野',
    pressKey: '按 ',

    // Inspect Card
    inspectTitle: '地牢探查 · 目标详情',
    inspectCoordinate: '网格坐标',
    inspectEngageBtn: '前往 / 交互',
    inspectCloseBtn: '关闭',
    inspectMonsterCategory: '怪物敌酋',
    inspectItemCategory: '地牢珍宝',
    inspectNpcCategory: '剧情人物',
    inspectDoorCategory: '封锁之门',
    inspectStairsCategory: '传送光圈',
    inspectShopCategory: '神圣祭坛',
    inspectLavaCategory: '熔岩之海',
    inspectWallCategory: '地牢岩壁',
    inspectFloorCategory: '平整地面',
    inspectLavaFrozenNotice: '已持有【冰冻雪花】！踏入即可将熔岩凝结为寒冰坦途。',
    inspectLavaBlockedNotice: '滚烫炽热的远古岩浆。需击败35层魔龙取得【冰冻雪花】方可通行！',
    inspectDoorOwned: '拥有钥匙: {count} 把（可开启）',
    inspectDoorMissing: '缺少钥匙！当前拥有 {count} 把',
    inspectDoorFree: '机关铁门，达成楼层特定事件后自动开启',
    inspectStairsUp: '通往上一楼层 (第 {floor} 层)',
    inspectStairsDown: '通往下一楼层 (第 {floor} 层)',
    inspectShopDesc: '命运祈祷神坛：消耗金币永久提升勇士的生命、攻击或防御。',
    inspectWallDesc: '古老坚硬的花岗岩石壁，坚不可摧。',
    inspectFakeWallDesc: '伪装暗墙：看似普通墙体，撞击即可粉碎开启隐藏密道！',
    inspectFloorDesc: '地牢中平整的石板地面，安全无危险。',
    inspectRightDblClickHint: '提示：右键双击目标可直接自动寻路至身前并触发交互',

    // Monster Manual
    manualTitle: '透视之镜 · 怪物图鉴手册',
    manualSubtitle: '实时演算 100% 确定性数学战斗战损与攻防临界点',
    currentFloorPrefix: '当前：',
    noMonstersOnFloor: '当前楼层暂无敌意怪物',
    countLabel: '数量',
    estDamage: '预计损血',
    roundsLabel: '交锋回合',
    immuneLabel: '免疫',
    cannotPierce: '无法破防',
    breakpointTitle: '最佳升级临界点',
    raiseAtkPrefix: '提升至 {atk} 攻',
    saveHpPrefix: '可少损 {hp} 血',
    alreadyZeroDamage: '已达到无伤境界',
    rewardGold: '金币',
    rewardExp: '经验',
    specialTrait: '特性',
    specialFirstStrike: '先攻：首回合抢先攻击',
    specialVampire: '吸血：攻击前吸取勇士生命',
    specialVampireBlocked: '吸血 (已被十字架神圣力量净化免疫)',
    specialDouble: '连击：每回合发动2次攻势',
    specialTriple: '连击：每回合发动3次攻势',
    specialPoison: '剧毒：攻击附加中毒衰竭',
    closeManual: '关闭手册 (ESC)',
    cannotBreakDefDetail: '无法破防 (攻击 ≤ 防御)',
    insufficientHp: '战力不足 (损血 {damage} ≥ 当前生命)',
    flawlessVictory: '完全无伤防杀！(损血 0)',
    estDamageDetail: '预计损血：{damage} (击杀需 {turns} 回合)',
    breakpointUpgrade: '⚡ 升级临界点：攻击力提升至 ',
    breakpointNeed: '（尚需 +{diff}）',
    breakpointBenefit: '可减少受击 1 回合，少损血 -{saveHp} HP',
    magicAttack: '魔攻',

    // Shop Modal
    shopTitle: '远古祈祷神坛',
    shopSubtitle: '神圣的祷告将唤醒远古神力，守护你的征程',
    shopCurrentGold: '当前拥有金币：',
    shopPrayerCost: '本次祈祷需：',
    shopBlessingHp: '祈愿：生命庇护',
    shopBlessingAtk: '祈愿：神圣锋芒',
    shopBlessingDef: '祈愿：固若金汤',
    shopLeave: '离开神坛',
    shopSuccessFloating: '祈祷成功！属性大幅提升！',
    shopNotEnoughGold: '金币不足！',
    shopTotalPrayers: '已累计加点：{times} 次（全塔所有神坛共享价格涨幅）',

    // Dialogue Modal
    dialogueNext: '继续',
    dialogueProceed: '领命前行',

    // Floor Teleport Modal
    teleportTitle: '风之罗盘 · 楼层跃迁',
    teleportSubtitle: '瞬间传送至任意已探索过的楼层',
    cancelBtn: '取消',

    // Game Over Modal
    victoryTitle: '魔塔征服！英雄凯旋！',
    victoryDesc: '大魔王杰诺已被消灭，公主已被拯救，和平重新降临大地！',
    remainingHp: '剩余生命：',
    finalAtk: '最终攻击：',
    finalDef: '最终防御：',
    accumulatedGold: '积累金币：',
    restartVictory: '重新挑战传奇',
    defeatTitle: '勇士倒下了...',
    defeatDesc: '生命值耗尽，魔塔的幽魂再次吞噬了一位挑战者',
    loadLastSave: '读取最近存档',
    restartFromFloor1: '从第一层重新开始',
    defeatFloorDesc: '在第 {floor} 层遭遇了不可逾越的凶险。胜败乃兵家常事，少侠请重新来过！',
    restartGame: '重新开始游戏',

    // Debug Panel
    debugTitle: '开发者作弊与调试控制台',
    debugSubtitle: '快速验证 0-50 层全塔数值与关卡逻辑',
    debugStats: '属性飞升 (+2000HP / +100攻防)',
    debugKeys: '钥匙补给 (+10黄 / 5蓝 / 3红)',
    debugGold: '暴富发财 (+1000 金币)',
    debugRelics: '获取全神器 (手册/罗盘/十字架)',
    debugJumpFloor: '楼层瞬移',
    debugClearMonsters: '清空当前楼层怪物',
    debugClose: '关闭控制台',
    debugWarpToFloor: '穿梭至指定楼层 (0 ~ 50)：',
    debugWarpBtn: '立即传送',
    debugClearBtn: '一键清空当前楼层所有怪物',

    // Notifications
    savedSuccess: '进度已成功保存至槽位 1',
    loadSuccess: '已成功读取存档',
    noSaveFound: '没有找到可用的存档记录',
    clearedMonstersFloating: '当前楼层怪物已全部清空！',
    teleportedToPrefix: '已跃迁传送至 ',
  },
  en: {
    // Topbar
    gameTitle: 'Magic Tower 3D',
    autoPathTip: 'Right-click floor to pathfind (avoids monsters)',
    monsterManualBtn: 'Monster Manual',
    floorJumpBtn: 'Floor Jump',
    saveBtn: 'Save',
    loadBtn: 'Load',
    muteTip: 'Mute Audio',
    unmuteTip: 'Unmute Audio',
    debugTip: 'Developer Debug & Cheats',
    restartTip: 'Restart Game',
    langToggleTip: 'Switch to Chinese (切换为中文)',

    // Sidebar
    towerSubtitle: 'MAGIC TOWER 3D',
    hp: 'HP',
    atk: 'ATK',
    def: 'DEF',
    gold: 'Gold',
    exp: 'EXP',
    yellowKey: 'Yellow Key',
    blueKey: 'Blue Key',
    redKey: 'Red Key',
    equipAndRelics: 'Equipment & Relics',
    weapon: 'Weapon: ',
    shield: 'Shield: ',
    none: 'None',
    relicManual: 'Manual',
    relicCompass: 'Compass',
    relicCross: 'Cross',
    noRelics: 'No relics yet',
    moveControls: 'Movement Controls',
    arrowKeysHint: 'Arrow Keys (↑↓←→)',
    up: 'Up (↑)',
    down: 'Down (↓)',
    left: 'Left (←)',
    right: 'Right (→)',

    // Viewport & Bottom overlays
    spaceResetPrompt: 'Press Space to Reset Hero View',
    spaceResetFloating: 'View reset and centered on hero',
    zoomResetFloating: 'Zoom & pan reset to 100%',
    hintMove: 'Move: Arrow Keys',
    hintInspect: 'Inspect: Left Click',
    hintPath: 'Engage/Path: Right Dbl-Click',
    hintPan: 'Pan: Ctrl+Drag',
    hintRotate: 'Rotate: Shift+Drag',
    hintZoom: 'Zoom: Ctrl+Wheel',
    hintManual: 'Manual: L',
    hintCompass: 'Compass: G',
    zoomInTip: 'Zoom in to view details (Ctrl + Scroll up)',
    zoomOutTip: 'Zoom out to view overview (Ctrl + Scroll down)',
    zoomResetTip: 'Click to reset zoom to 100%',
    restartConfirm: 'Are you sure you want to restart? Current progress will be reset.',
    spaceResetBtnTitle: 'Press Space or click here to reset view to hero',
    spaceResetKey: 'Space',
    spaceResetText: 'to reset hero view',
    pressKey: 'Press ',

    // Inspect Card
    inspectTitle: 'Dungeon Inspection · Details',
    inspectCoordinate: 'Coordinates',
    inspectEngageBtn: 'Go & Interact',
    inspectCloseBtn: 'Close',
    inspectMonsterCategory: 'Hostile Monster',
    inspectItemCategory: 'Dungeon Treasure',
    inspectNpcCategory: 'Character',
    inspectDoorCategory: 'Locked Gate',
    inspectStairsCategory: 'Portal Ring',
    inspectShopCategory: 'Sacred Altar',
    inspectLavaCategory: 'Boiling Magma',
    inspectWallCategory: 'Dungeon Wall',
    inspectFloorCategory: 'Stone Floor',
    inspectLavaFrozenNotice: 'Carrying [Frost Snowflake]! Stepping on lava will freeze it into ice.',
    inspectLavaBlockedNotice: 'Boiling lava! You need the [Frost Snowflake] from the 35F Dragon to cross!',
    inspectDoorOwned: 'Keys owned: {count} (Can unlock)',
    inspectDoorMissing: 'Key required! You currently have {count}',
    inspectDoorFree: 'Mechanism gate, opens automatically upon specific floor events',
    inspectStairsUp: 'Ascend to floor {floor}',
    inspectStairsDown: 'Descend to floor {floor}',
    inspectShopDesc: 'Altar of Prayer: Spend gold to permanently boost HP, ATK, or DEF.',
    inspectWallDesc: 'Ancient solid granite wall, indestructible.',
    inspectFakeWallDesc: 'Illusion Wall: Secret passage opens upon bumping into it!',
    inspectFloorDesc: 'Safe dungeon stone pavement.',
    inspectRightDblClickHint: 'Tip: Double-right-click to auto-navigate and engage directly',

    // Monster Manual
    manualTitle: 'Clairvoyance Mirror · Monster Manual',
    manualSubtitle: 'Real-time calculation of 100% deterministic combat damage & breakpoints',
    currentFloorPrefix: 'Current: ',
    noMonstersOnFloor: 'No hostile monsters on this floor',
    countLabel: 'Count',
    estDamage: 'Est. Damage',
    roundsLabel: 'Rounds',
    immuneLabel: 'Immune',
    cannotPierce: 'Cannot Pierce DEF',
    breakpointTitle: 'Optimal Upgrade Breakpoint',
    raiseAtkPrefix: 'Raise to {atk} ATK',
    saveHpPrefix: 'Saves {hp} HP',
    alreadyZeroDamage: 'Damage already reduced to 0',
    rewardGold: 'Gold',
    rewardExp: 'EXP',
    specialTrait: 'Special',
    specialFirstStrike: 'First Strike: Attacks first in round 1',
    specialVampire: 'Vampire: Drains HP before attacking',
    specialVampireBlocked: 'Vampire (Neutralized by Holy Cross)',
    specialDouble: 'Double Strike: Attacks 2 times per round',
    specialTriple: 'Triple Strike: Attacks 3 times per round',
    specialPoison: 'Poison: Inflicts status decay on hit',
    closeManual: 'Close Manual (ESC)',
    cannotBreakDefDetail: 'Cannot pierce DEF (ATK ≤ DEF)',
    insufficientHp: 'HP too low (Damage {damage} ≥ current HP)',
    flawlessVictory: 'Flawless Victory! (0 Damage)',
    estDamageDetail: 'Est. Damage: {damage} ({turns} rounds)',
    breakpointUpgrade: '⚡ Breakpoint: Raise ATK to ',
    breakpointNeed: ' (Needs +{diff})',
    breakpointBenefit: 'Saves 1 round, reduces damage by -{saveHp} HP',
    magicAttack: 'Magic ATK',

    // Shop Modal
    shopTitle: 'Ancient Prayer Altar',
    shopSubtitle: 'Sacred prayers invoke ancient powers to protect your quest',
    shopCurrentGold: 'Current Gold: ',
    shopPrayerCost: 'Prayer Cost: ',
    shopBlessingHp: 'Prayer: Life Blessing',
    shopBlessingAtk: 'Prayer: Holy Edge',
    shopBlessingDef: 'Prayer: Iron Bastion',
    shopLeave: 'Leave Altar',
    shopSuccessFloating: 'Prayer answered! Attributes greatly enhanced!',
    shopNotEnoughGold: 'Not enough gold!',
    shopTotalPrayers: 'Total prayers: {times} (All altars share cost increase)',

    // Dialogue Modal
    dialogueNext: 'Next',
    dialogueProceed: 'Proceed',

    // Floor Teleport Modal
    teleportTitle: 'Wind Compass · Floor Leap',
    teleportSubtitle: 'Instantly teleport to any explored floor',
    cancelBtn: 'Cancel',

    // Game Over Modal
    victoryTitle: 'Tower Conquered! Victory!',
    victoryDesc: 'Demon Lord Jeno has been slain, the princess is saved, and peace returns to the land!',
    remainingHp: 'Remaining HP: ',
    finalAtk: 'Final ATK: ',
    finalDef: 'Final DEF: ',
    accumulatedGold: 'Total Gold: ',
    restartVictory: 'Play Again',
    defeatTitle: 'The Hero Has Fallen...',
    defeatDesc: 'Your HP was exhausted. The dark tower claims another challenger.',
    loadLastSave: 'Load Last Save',
    restartFromFloor1: 'Restart From Floor 1',
    defeatFloorDesc: 'Fell on Floor {floor}. Defeat is a common occurrence in battle, try again brave warrior!',
    restartGame: 'Restart Game',

    // Debug Panel
    debugTitle: 'Developer Debug & Cheat Console',
    debugSubtitle: 'Quick testing and verification for floors 0-50',
    debugStats: 'Stat Surge (+2000 HP / +100 ATK & DEF)',
    debugKeys: 'Key Supply (+10 Y / +5 B / +3 R)',
    debugGold: 'Fortune (+1000 Gold)',
    debugRelics: 'Obtain All Relics (Manual/Compass/Cross)',
    debugJumpFloor: 'Warp Floor',
    debugClearMonsters: 'Clear Floor Monsters',
    debugClose: 'Close Console',
    debugWarpToFloor: 'Warp to floor (0 ~ 50):',
    debugWarpBtn: 'Warp Now',
    debugClearBtn: 'Clear all monsters on current floor',

    // Notifications
    savedSuccess: 'Game successfully saved to Slot 1',
    loadSuccess: 'Game loaded successfully',
    noSaveFound: 'No valid save file found',
    clearedMonstersFloating: 'All monsters on this floor cleared!',
    teleportedToPrefix: 'Teleported to ',
  },
};

// 怪物名称双语映射表
export const MONSTER_NAMES: Record<string, { zh: string; en: string }> = {
  green_slime: { zh: '绿史莱姆', en: 'Green Slime' },
  red_slime: { zh: '红史莱姆', en: 'Red Slime' },
  black_slime: { zh: '黑史莱姆', en: 'Black Slime' },
  slime_king: { zh: '史莱姆王', en: 'Slime King' },
  small_bat: { zh: '小蝙蝠', en: 'Small Bat' },
  big_bat: { zh: '大蝙蝠', en: 'Big Bat' },
  red_bat: { zh: '红蝙蝠', en: 'Red Bat' },
  vampire: { zh: '吸血鬼', en: 'Vampire' },
  skeleton: { zh: '骷髅人', en: 'Skeleton' },
  skeleton_soldier: { zh: '骷髅士兵', en: 'Skeleton Soldier' },
  skeleton_captain: { zh: '骷髅队长', en: 'Skeleton Captain' },
  ghost_soldier: { zh: '幽灵士兵', en: 'Ghost Soldier' },
  junior_mage: { zh: '初级法师', en: 'Junior Mage' },
  senior_mage: { zh: '高级法师', en: 'Senior Mage' },
  red_mage: { zh: '红衣法师', en: 'Red Mage' },
  arch_mage: { zh: '大法师', en: 'Archmage' },
  junior_guard: { zh: '初级卫兵', en: 'Junior Guard' },
  mid_guard: { zh: '中级卫兵', en: 'Mid Guard' },
  senior_guard: { zh: '高级卫兵', en: 'Senior Guard' },
  iron_knight: { zh: '铁骑士', en: 'Iron Knight' },
  knight_captain: { zh: '骑士队长', en: 'Knight Captain' },
  shadow_knight: { zh: '暗黑骑士', en: 'Shadow Knight' },
  gold_knight: { zh: '黄金骑士', en: 'Gold Knight' },
  demon_slayer: { zh: '屠龙武士', en: 'Dragon Slayer' },
  giant_squid: { zh: '大乌贼', en: 'Giant Squid' },
  dragon: { zh: '魔龙', en: 'Magic Dragon' },
  demon_king: { zh: '大魔王杰诺', en: 'Demon Lord Jeno' },
};

// 道具与装备双语映射表
export const ITEM_NAMES: Record<string, { zh: string; en: string }> = {
  key_yellow: { zh: '黄钥匙', en: 'Yellow Key' },
  key_blue: { zh: '蓝钥匙', en: 'Blue Key' },
  key_red: { zh: '红钥匙', en: 'Red Key' },
  potion_red: { zh: '生命红药水', en: 'Red Potion' },
  potion_blue: { zh: '生命蓝药水', en: 'Blue Potion' },
  holy_water: { zh: '圣水', en: 'Holy Water' },
  gem_red: { zh: '红宝石', en: 'Ruby' },
  gem_blue: { zh: '蓝宝石', en: 'Sapphire' },
  sword_iron: { zh: '铁剑', en: 'Iron Sword' },
  sword_silver: { zh: '银剑', en: 'Silver Sword' },
  sword_knight: { zh: '骑士剑', en: 'Knight Sword' },
  sword_holy: { zh: '圣光之剑', en: 'Holy Sword' },
  sword_sacred: { zh: '神圣神剑', en: 'Sacred Sword' },
  shield_iron: { zh: '铁盾', en: 'Iron Shield' },
  shield_silver: { zh: '银盾', en: 'Silver Shield' },
  shield_knight: { zh: '骑士盾', en: 'Knight Shield' },
  shield_holy: { zh: '圣光之盾', en: 'Holy Shield' },
  shield_sacred: { zh: '神圣神盾', en: 'Sacred Shield' },
  monster_manual: { zh: '怪物手册', en: 'Monster Manual' },
  compass: { zh: '楼层罗盘', en: 'Floor Compass' },
  cross: { zh: '幸运十字架', en: 'Lucky Cross' },
  lucky_coin: { zh: '幸运金币', en: 'Lucky Coin' },
};

// 楼层名称双语映射表
export const FLOOR_NAMES: Record<number, { zh: string; en: string }> = {
  0: { zh: '0F 秘境·地下室 (幸运金币)', en: '0F Secret Basement (Lucky Coin)' },
  1: { zh: '1F 初入魔塔 (入口大殿)', en: '1F Tower Entrance (Great Hall)' },
  2: { zh: '2F 幽暗地牢 (解救小偷)', en: '2F Dark Dungeon (Rescue Thief)' },
  3: { zh: '3F 守护长廊', en: '3F Guard Corridor' },
  4: { zh: '4F 初始祈祷神坛', en: '4F Initial Prayer Altar' },
  5: { zh: '5F 铁剑秘室', en: '5F Iron Sword Vault' },
  6: { zh: '6F 迷宫回廊', en: '6F Labyrinth Corridor' },
  7: { zh: '7F 宝石宝库', en: '7F Gem Vault' },
  8: { zh: '8F 钥匙秘室', en: '8F Key Chamber' },
  9: { zh: '9F 暗道与铁盾', en: '9F Secret Passage & Iron Shield' },
  10: { zh: '10F 骷髅队长大殿', en: "10F Skeleton Captain's Hall" },
  11: { zh: '11F 银盾神殿', en: '11F Silver Shield Temple' },
  12: { zh: '12F 中级祈祷神坛', en: '12F Mid-level Prayer Altar' },
  13: { zh: '13F 迷失长廊', en: '13F Lost Hallway' },
  14: { zh: '14F 幽灵守卫营', en: '14F Ghost Guard Barracks' },
  15: { zh: '15F 深渊巨兽大乌贼', en: '15F Abyssal Giant Squid' },
  16: { zh: '16F 圣水秘殿', en: '16F Holy Water Sanctum' },
  17: { zh: '17F 银剑之冢', en: '17F Tomb of the Silver Sword' },
  18: { zh: '18F 魔法禁地', en: '18F Arcane Forbidden Area' },
  19: { zh: '19F 十字架神堂', en: '19F Holy Cross Chapel' },
  20: { zh: '20F 幽冥吸血鬼王', en: '20F Nether Vampire Lord' },
  21: { zh: '21F 熔岩试炼', en: '21F Magma Trials' },
  22: { zh: '22F 烈焰迷宫', en: '22F Flame Labyrinth' },
  23: { zh: '23F 熔火巨剑厅', en: '23F Molten Greatsword Hall' },
  24: { zh: '24F 烈火守卫要塞', en: '24F Fireguard Stronghold' },
  25: { zh: '25F 烈焰大法师主殿', en: '25F Fire Archmage Sanctuary' },
  26: { zh: '26F 冰霜凝界', en: '26F Frost Realm' },
  27: { zh: '27F 极寒回廊', en: '27F Frigid Corridor' },
  28: { zh: '28F 霜雪宝库', en: '28F Frost Treasury' },
  29: { zh: '29F 冰封迷宫', en: '29F Frozen Labyrinth' },
  30: { zh: '30F 冰渊领主殿', en: '30F Ice Lord Sanctuary' },
  31: { zh: '31F 天空神殿外廊', en: '31F Sky Temple Portico' },
  32: { zh: '32F 高级祈祷神坛', en: '32F High-level Prayer Altar' },
  33: { zh: '33F 骑士剑圣冢', en: '33F Knight Sword Sanctum' },
  34: { zh: '34F 云端浮岛', en: '34F Cloud Islands' },
  35: { zh: '35F 魔龙之窟', en: "35F Magic Dragon's Lair" },
  36: { zh: '36F 苍穹圣殿', en: '36F Celestial Temple' },
  37: { zh: '37F 星辰长廊', en: '37F Astral Corridor' },
  38: { zh: '38F 骑士盾圣堂', en: '38F Knight Shield Sanctuary' },
  39: { zh: '39F 虚空之门', en: '39F Void Gateway' },
  40: { zh: '40F 暗黑骑士统帅', en: '40F Shadow Knight Commander' },
  41: { zh: '41F 黄金回廊', en: '41F Golden Gallery' },
  42: { zh: '42F 辉煌神堂', en: '42F Radiant Shrine' },
  43: { zh: '43F 圣光之盾密室', en: '43F Holy Shield Vault' },
  44: { zh: '44F 神圣神盾星殿', en: '44F Sacred Shield Star Chamber' },
  45: { zh: '45F 极天之梯', en: '45F Empyrean Stairs' },
  46: { zh: '46F 终极祈祷神坛', en: '46F Ultimate Prayer Altar' },
  47: { zh: '47F 圣光之剑宝库', en: '47F Holy Sword Treasury' },
  48: { zh: '48F 神圣神剑圣域', en: '48F Sacred Sword Sanctuary' },
  49: { zh: '49F 假魔王封印殿', en: '49F False Demon Lord Chamber' },
  50: { zh: '50F 魔塔之巅·决战魔王杰诺', en: '50F Tower Apex · Showdown with Demon Lord Jeno' },
};

// NPC 剧情对话双语映射表
export const NPC_DIALOGUES: Record<
  string,
  {
    name: { zh: string; en: string };
    avatar: string;
    lines: { zh: string[]; en: string[] };
  }
> = {
  fairy: {
    name: { zh: '仙人 (仙女)', en: 'Celestial Fairy' },
    avatar: '🧙‍♀️',
    lines: {
      zh: [
        '勇敢的骑士，你终于苏醒了！整座魔塔已被大魔王杰诺霸占，公主也被囚禁在第50层塔顶。',
        '我已用仙灵之力为你斩断牢狱枷锁。请拾取前方的钥匙与疗伤红水，踏上登塔征程吧！',
        '切记：魔塔中的每一把钥匙与每一滴血水都无比珍贵，战斗前务必精打细算！',
      ],
      en: [
        'Brave Knight, you are finally awake! The Magic Tower has been seized by Demon Lord Jeno, and the princess is imprisoned at the top on 50F.',
        'I have used my fairy magic to break your prison chains. Collect the keys and red potion ahead, and embark on your ascent!',
        'Remember: every key and drop of blood is precious in this tower. Calculate carefully before each battle!',
      ],
    },
  },
  thief: {
    name: { zh: '小偷', en: 'Thief' },
    avatar: '🥷',
    lines: {
      zh: [
        '嘿！多谢你打开牢房！作为报答，我告诉你两个天大的秘密！',
        '在第 5 层的一处重兵把守之地藏有一柄【铁剑】，能提升 10 点攻击！',
        '而在第 9 层的一堵暗墙之后，藏有一面【铁盾】，能抵御极多伤害！快去找寻它们吧！',
      ],
      en: [
        'Hey! Thanks for unlocking my cell! As a reward, let me tell you two huge secrets!',
        'On Floor 5, guarded heavily, lies an [Iron Sword] that grants +10 Attack!',
        'And behind a secret false wall on Floor 9, an [Iron Shield] is hidden that blocks tons of damage! Go find them!',
      ],
    },
  },
  old_man_manual: {
    name: { zh: '神秘老人', en: 'Mystic Sage' },
    avatar: '🧙‍♂️',
    lines: {
      zh: [
        '年轻人，魔塔里危机四伏，鲁莽战斗只会白白送命。',
        '我这本【怪物手册】赠予你，它可以洞察所有妖魔的虚实、战斗损血和加点临界点。',
        '点击顶部或者按快捷键【L】即可查阅怪物手册。祝你好运！',
      ],
      en: [
        'Young warrior, the tower is fraught with perils. Reckless battles will only lead to your demise.',
        'Take this [Monster Manual]. It reveals all monster stats, exact combat damage, and optimal breakpoints.',
        'Click the top button or press [L] anytime to consult the manual. Good luck!',
      ],
    },
  },
  elder: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    avatar: '🧙‍♂️',
    lines: {
      zh: [
        '年轻人，魔塔里危机四伏，鲁莽战斗只会白白送命。',
        '每一把钥匙都要精打细算，注意寻找暗墙与宝物！祝你好运！',
      ],
      en: [
        'Young traveler, danger lurks on every floor. Mindless fighting will only cost your life.',
        'Manage every single key with care, and keep an eye out for secret walls and treasures! Safe travels!',
      ],
    },
  },
  old_man: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    avatar: '🧙‍♂️',
    lines: {
      zh: [
        '年轻人，魔塔里危机四伏，鲁莽战斗只会白白送命。',
        '每一把钥匙都要精打细算，注意寻找暗墙与宝物！祝你好运！',
      ],
      en: [
        'Young traveler, danger lurks on every floor. Mindless fighting will only cost your life.',
        'Manage every single key with care, and keep an eye out for secret walls and treasures! Safe travels!',
      ],
    },
  },
  trader: {
    name: { zh: '神秘商人', en: 'Mysterious Merchant' },
    avatar: '👳',
    lines: {
      zh: ['嘿嘿嘿！只要有足够的金币，我这里有你想要的一切钥匙与宝物！'],
      en: ['Hehehe! As long as you have enough gold, I have all the keys and treasures you desire!'],
    },
  },
  merchant: {
    name: { zh: '神秘商人', en: 'Mysterious Merchant' },
    avatar: '👳',
    lines: {
      zh: ['嘿嘿嘿！只要有足够的金币，我这里有你想要的一切钥匙与宝物！'],
      en: ['Hehehe! As long as you have enough gold, I have all the keys and treasures you desire!'],
    },
  },
  princess: {
    name: { zh: '被解救的公主', en: 'Rescued Princess' },
    avatar: '👸',
    lines: {
      zh: [
        '高贵的骑士大人！你战胜了不可战胜的魔王杰诺！',
        '整座王国的阴霾终于散去，人们将永远传颂你的荣耀与智慧！',
      ],
      en: [
        'Noble Knight! You have defeated the insurmountable Demon Lord Jeno!',
        'The dark shadows over our kingdom have finally dispersed. The world shall forever sing of your glory and wisdom!',
      ],
    },
  },
};

// 拾取道具双语提示生成器
export function getPickupNotification(
  itemType: string,
  lang: Language
): { text: string; color: string } {
  if (itemType === 'key_yellow') {
    return { text: lang === 'zh' ? '黄钥匙 +1' : 'Yellow Key +1', color: '#eab308' };
  }
  if (itemType === 'key_blue') {
    return { text: lang === 'zh' ? '蓝钥匙 +1' : 'Blue Key +1', color: '#3b82f6' };
  }
  if (itemType === 'key_red') {
    return { text: lang === 'zh' ? '红钥匙 +1' : 'Red Key +1', color: '#ef4444' };
  }
  if (itemType === 'potion_red') {
    return { text: lang === 'zh' ? '生命 +200' : 'HP +200', color: '#f87171' };
  }
  if (itemType === 'potion_blue') {
    return { text: lang === 'zh' ? '生命 +500' : 'HP +500', color: '#60a5fa' };
  }
  if (itemType === 'holy_water') {
    return { text: lang === 'zh' ? '生命值翻倍！' : 'HP Doubled!', color: '#c084fc' };
  }
  if (itemType === 'gem_red') {
    return { text: lang === 'zh' ? '攻击力 +3' : 'ATK +3', color: '#dc2626' };
  }
  if (itemType === 'gem_blue') {
    return { text: lang === 'zh' ? '防御力 +3' : 'DEF +3', color: '#2563eb' };
  }
  if (itemType === 'sword_iron') {
    return {
      text: lang === 'zh' ? '获得【铁剑】攻击 +10！' : 'Obtained [Iron Sword] ATK +10!',
      color: '#fef08a',
    };
  }
  if (itemType === 'sword_silver') {
    return {
      text: lang === 'zh' ? '获得【银剑】攻击 +20！' : 'Obtained [Silver Sword] ATK +20!',
      color: '#fef08a',
    };
  }
  if (itemType === 'sword_knight') {
    return {
      text: lang === 'zh' ? '获得【骑士剑】攻击 +40！' : 'Obtained [Knight Sword] ATK +40!',
      color: '#fef08a',
    };
  }
  if (itemType === 'sword_holy') {
    return {
      text: lang === 'zh' ? '获得【圣光之剑】攻击 +100！' : 'Obtained [Holy Sword] ATK +100!',
      color: '#fef08a',
    };
  }
  if (itemType === 'sword_sacred') {
    return {
      text: lang === 'zh' ? '获得神兵【神圣神剑】攻击 +150！' : 'Obtained [Sacred Sword] ATK +150!',
      color: '#38bdf8',
    };
  }
  if (itemType === 'shield_iron') {
    return {
      text: lang === 'zh' ? '获得【铁盾】防御 +10！' : 'Obtained [Iron Shield] DEF +10!',
      color: '#94a3b8',
    };
  }
  if (itemType === 'shield_silver') {
    return {
      text: lang === 'zh' ? '获得【银盾】防御 +20！' : 'Obtained [Silver Shield] DEF +20!',
      color: '#94a3b8',
    };
  }
  if (itemType === 'shield_knight') {
    return {
      text: lang === 'zh' ? '获得【骑士盾】防御 +40！' : 'Obtained [Knight Shield] DEF +40!',
      color: '#94a3b8',
    };
  }
  if (itemType === 'shield_holy') {
    return {
      text: lang === 'zh' ? '获得【圣光之盾】防御 +100！' : 'Obtained [Holy Shield] DEF +100!',
      color: '#94a3b8',
    };
  }
  if (itemType === 'shield_sacred') {
    return {
      text: lang === 'zh' ? '获得神盾【神圣神盾】防御 +150！' : 'Obtained [Sacred Shield] DEF +150!',
      color: '#38bdf8',
    };
  }
  if (itemType === 'monster_manual') {
    return {
      text: lang === 'zh' ? '获得神器【怪物手册】(快捷键 L)！' : 'Obtained [Monster Manual] (Hotkey L)!',
      color: '#34d399',
    };
  }
  if (itemType === 'compass') {
    return {
      text: lang === 'zh' ? '获得神器【楼层罗盘】(快捷键 G)！' : 'Obtained [Floor Compass] (Hotkey G)!',
      color: '#38bdf8',
    };
  }
  if (itemType === 'cross') {
    return {
      text: lang === 'zh' ? '获得神器【幸运十字架】(免疫吸血)！' : 'Obtained [Lucky Cross] (Vampire Immunity)!',
      color: '#facc15',
    };
  }
  if (itemType === 'lucky_coin') {
    return {
      text: lang === 'zh' ? '获得密宝【幸运金币】！金币收益永久翻倍！' : 'Obtained [Lucky Coin]! Gold earnings doubled!',
      color: '#facc15',
    };
  }
  if (itemType === 'sword_dragon') {
    return {
      text: lang === 'zh' ? '获得神兵【屠龙之刃】攻击 +100！' : 'Obtained [Dragon Slayer] ATK +100!',
      color: '#f43f5e',
    };
  }
  if (itemType === 'key_gold') {
    return {
      text: lang === 'zh' ? '获得【金钥匙】全钥匙 +1！' : 'Obtained [Gold Key] +1 to all keys!',
      color: '#fbbf24',
    };
  }
  if (itemType === 'snow_crystal') {
    return {
      text: lang === 'zh' ? '获得【冰冻雪花】！' : 'Obtained [Frost Snowflake]!',
      color: '#a5f3fc',
    };
  }
  if (itemType === 'notepad') {
    return {
      text: lang === 'zh' ? '获得【记事本】！' : 'Obtained [Notepad]!',
      color: '#38bdf8',
    };
  }
  if (itemType === 'pickaxe') {
    return {
      text: lang === 'zh' ? '获得【破墙十字镐】！' : 'Obtained [Wall-breaking Pickaxe]!',
      color: '#a3a3a3',
    };
  }
  if (itemType === 'bomb') {
    return {
      text: lang === 'zh' ? '获得【炼金炸弹】！' : 'Obtained [Alchemy Bomb]!',
      color: '#18181b',
    };
  }
  if (itemType === 'earthquake') {
    return {
      text: lang === 'zh' ? '获得【地震卷轴】！' : 'Obtained [Earthquake Scroll]!',
      color: '#b45309',
    };
  }
  if (itemType === 'down_fly') {
    return {
      text: lang === 'zh' ? '获得【向下飞行器】！' : 'Obtained [Down Flight Wing]!',
      color: '#818cf8',
    };
  }
  if (itemType === 'up_fly') {
    return {
      text: lang === 'zh' ? '获得【向上飞行器】！' : 'Obtained [Up Flight Wing]!',
      color: '#a78bfa',
    };
  }
  if (itemType === 'center_fly') {
    return {
      text: lang === 'zh' ? '获得【中心飞行器】！' : 'Obtained [Center Flight Wing]!',
      color: '#c084fc',
    };
  }
  return {
    text: lang === 'zh' ? '获得道具！' : 'Obtained Item!',
    color: '#facc15',
  };
}

// 辅助获取函数
export function getMonsterName(id: string, lang: Language): string {
  return MONSTER_NAMES[id]?.[lang] || id;
}

export function getItemName(id: string, lang: Language): string {
  return ITEM_NAMES[id]?.[lang] || id;
}

export function getFloorName(floorNum: number, lang: Language, fallbackName?: string): string {
  if (FLOOR_NAMES[floorNum]) {
    return FLOOR_NAMES[floorNum][lang];
  }
  if (fallbackName) {
    if (lang === 'en') {
      return fallbackName.replace(/(\d+)F\s*(.*)/, '$1F $2');
    }
    return fallbackName;
  }
  return lang === 'zh' ? `${floorNum}F 楼层` : `${floorNum}F Floor`;
}

export function getDialogueData(npcId: string, lang: Language) {
  const item = NPC_DIALOGUES[npcId];
  if (!item) return null;
  return {
    name: item.name[lang],
    avatar: item.avatar,
    lines: item.lines[lang],
    currentIndex: 0,
  };
}

export function getDoorNotification(
  type: 'yellow' | 'blue' | 'red' | 'iron',
  success: boolean,
  lang: Language
): { text: string; color: string } {
  if (type === 'iron') {
    return { text: lang === 'zh' ? '机关门开启！' : 'Gate opened!', color: '#94a3b8' };
  }
  if (type === 'yellow') {
    return success
      ? { text: lang === 'zh' ? '开门 -1 黄钥匙' : 'Door opened -1 Yellow Key', color: '#eab308' }
      : { text: lang === 'zh' ? '缺少黄色钥匙！' : 'Yellow key required!', color: '#f87171' };
  }
  if (type === 'blue') {
    return success
      ? { text: lang === 'zh' ? '开门 -1 蓝钥匙' : 'Door opened -1 Blue Key', color: '#3b82f6' }
      : { text: lang === 'zh' ? '缺少蓝色钥匙！' : 'Blue key required!', color: '#f87171' };
  }
  if (type === 'red') {
    return success
      ? { text: lang === 'zh' ? '开门 -1 红钥匙' : 'Door opened -1 Red Key', color: '#ef4444' }
      : { text: lang === 'zh' ? '缺少红色钥匙！' : 'Red key required!', color: '#f87171' };
  }
  return { text: '', color: '#ffffff' };
}

export function getCombatNotification(
  type: 'cannot_pierce' | 'low_hp' | 'win_flawless' | 'win_damage' | 'boss_skeleton' | 'boss_vampire' | 'boss_demon',
  params: { damage?: number; gold?: number },
  lang: Language
): { text: string; color: string } {
  if (type === 'cannot_pierce') {
    return { text: lang === 'zh' ? '无法破防！攻击力不足' : 'Cannot pierce DEF! Insufficient ATK', color: '#f87171' };
  }
  if (type === 'low_hp') {
    return {
      text: lang === 'zh' ? `生命不足！将损失 ${params.damage} HP` : `HP too low! Will lose ${params.damage} HP`,
      color: '#f87171',
    };
  }
  if (type === 'win_flawless') {
    return { text: lang === 'zh' ? `无伤击破！+${params.gold}G` : `Flawless Victory! +${params.gold}G`, color: '#22c55e' };
  }
  if (type === 'win_damage') {
    return { text: `-${params.damage} HP  +${params.gold}G`, color: '#ef4444' };
  }
  if (type === 'boss_skeleton') {
    return { text: lang === 'zh' ? '骷髅队长陨落！一区通关！' : 'Skeleton Captain fallen! Zone 1 Cleared!', color: '#facc15' };
  }
  if (type === 'boss_vampire') {
    return { text: lang === 'zh' ? '吸血鬼伯爵消灭！二区通关！' : 'Vampire Lord defeated! Zone 2 Cleared!', color: '#facc15' };
  }
  if (type === 'boss_demon') {
    return { text: lang === 'zh' ? '魔王杰诺消灭！魔塔被拯救！' : 'Demon Lord Jeno defeated! Tower Saved!', color: '#22c55e' };
  }
  return { text: '', color: '#ffffff' };
}

export function getEquipName(name: string | null | undefined, lang: Language): string {
  if (!name) return lang === 'zh' ? '无' : 'None';
  const map: Record<string, { zh: string; en: string }> = {
    铁剑: { zh: '铁剑', en: 'Iron Sword' },
    银剑: { zh: '银剑', en: 'Silver Sword' },
    骑士剑: { zh: '骑士剑', en: 'Knight Sword' },
    圣光之剑: { zh: '圣光之剑', en: 'Holy Sword' },
    神圣神剑: { zh: '神圣神剑', en: 'Sacred Sword' },
    屠龙之刃: { zh: '屠龙之刃', en: 'Dragon Slayer' },
    铁盾: { zh: '铁盾', en: 'Iron Shield' },
    银盾: { zh: '银盾', en: 'Silver Shield' },
    骑士盾: { zh: '骑士盾', en: 'Knight Shield' },
    圣光之盾: { zh: '圣光之盾', en: 'Holy Shield' },
    神圣神盾: { zh: '神圣神盾', en: 'Sacred Shield' },
  };
  return map[name]?.[lang] || name;
}

// React 语言上下文
interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'mota_3d_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 默认中文 (zh)
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    } catch (_) {}
    return 'zh';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (_) {}
  };

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const value: LanguageContextType = {
    lang,
    setLang,
    toggleLang,
    t: TRANSLATIONS[lang],
  };

  return React.createElement(LanguageContext.Provider, { value }, children);
};

export const useI18n = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // 降级兜底默认值
    return {
      lang: 'zh',
      setLang: () => {},
      toggleLang: () => {},
      t: TRANSLATIONS.zh,
    };
  }
  return ctx;
};
