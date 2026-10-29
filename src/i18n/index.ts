import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MONSTERS } from '../data/monsters';
import { ITEMS } from '../data/items';
import { ItemType, SpecialAbility } from '../types/game';

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
  bgmMuteTip: string;
  bgmUnmuteTip: string;
  sfxOn: string;
  sfxOff: string;
  bgmOn: string;
  bgmOff: string;
  debugTip: string;
  restartTip: string;
  coffeeTip: string;
  langToggleTip: string;

  // Buy Me a Coffee & Honor Monument Modal
  coffeeModalTitle: string;
  coffeeModalLeavingWarning: string;
  coffeeModalDesc: string;
  coffeeModalProjectNote: string;
  coffeeModalConfirmBtn: string;
  coffeeModalCancelBtn: string;
  monumentSupportBtn: string;

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
  canDefeat: string;
  dangerDefeat: string;

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

  // Shop Modal (Gold)
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
  shopConfirmPrompt: string;
  tipNotEnoughGold: string;

  // Experience Elder Shop Modal
  expShopTitle: string;
  expShopSubtitle: string;
  expCurrent: string;
  expUpgradeCost: string;
  expUpgradeHp: string;
  expUpgradeAtk: string;
  expUpgradeDef: string;
  expUpgradeLevel: string;
  expShopLeave: string;
  expSuccessFloating: string;
  expNotEnough: string;
  expConfirmPrompt: string;
  tipNotEnoughExp: string;
  expShopSubtitleDetail: string;
  unitAtk: string;
  unitDef: string;

  // Dialogue Modal
  dialogueNext: string;
  dialogueProceed: string;

  // Floor Teleport Modal
  teleportTitle: string;
  teleportSubtitle: string;
  cancelBtn: string;
  confirmBtn: string;

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

  // Confirm Center Fly Modal
  confirmCenterFlyTitle: string;
  confirmCenterFlyDesc: string;
  confirmCenterFlyWarning: string;
  confirmCenterFlyOk: string;
  confirmCenterFlyCancel: string;

  // Confirm Up Fly Modal
  confirmUpFlyTitle: string;
  confirmUpFlyDesc43: string;
  confirmUpFlyDescOther: string;
  confirmUpFlyBlocked49: string;
  confirmUpFlyBlocked50: string;
  confirmUpFlyWarning: string;
  confirmUpFlyOk: string;
  confirmUpFlyCancel: string;

  // 存盘与读盘多槽位系统
  saveModalTitle: string;
  saveModalSubtitle: string;
  loadModalTitle: string;
  loadModalSubtitle: string;
  saveTab: string;
  loadTab: string;
  slotBadge: string;
  slotEmpty: string;
  slotEmptyDesc: string;
  slotNoData: string;
  saveToSlot: string;
  overwriteSlot: string;
  loadFromSlot: string;
  deleteSlot: string;
  confirmOverwriteTitle: string;
  confirmOverwriteDesc: string;
  confirmLoadTitle: string;
  confirmLoadDesc: string;
  confirmDeleteTitle: string;
  confirmDeleteDesc: string;
  saveSlotSuccess: string;
  loadSlotSuccess: string;
  deleteSlotSuccess: string;

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
    bgmMuteTip: '关闭背景音乐',
    bgmUnmuteTip: '开启背景音乐',
    sfxOn: '音效: 开',
    sfxOff: '音效: 关',
    bgmOn: 'BGM: 开',
    bgmOff: 'BGM: 关',
    debugTip: '开发者作弊与数值调试',
    restartTip: '重新开始游戏',
    coffeeTip: '请作者喝杯咖啡 (Buy Me a Coffee)',
    langToggleTip: '切换为英文 (Switch to English)',

    // Buy Me a Coffee & Honor Board Modal
    coffeeModalTitle: '支持开发者',
    coffeeModalLeavingWarning: '即将离开游戏并在新标签页中打开外部赞助页面',
    coffeeModalDesc: '感谢您对魔塔 3D 的热爱，请考虑在 Buy Me a Coffee 上给我打赏。打赏后，如果你愿意，我会将你的名字同步在 0 层的英雄赞助榜上。请在打赏时留言表明意向。谢谢！',
    coffeeModalProjectNote: '《魔塔 3D》为完全开源且免费体验的独立重制项目，你的每一份支持都是持续维护与优化游戏的最大动力！',
    coffeeModalConfirmBtn: '前往支持 (Buy Me a Coffee)',
    coffeeModalCancelBtn: '我慎重考虑一下',
    monumentSupportBtn: '前往支持 (Buy Me a Coffee)',

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
    hintPan: '平移: 单击拖拽',
    hintRotate: '旋转: Shift/Ctrl+拖动',
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
    canDefeat: '✓ 可战胜',
    dangerDefeat: '⚠ 危险',

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
    alreadyZeroDamage: '已达到未受伤害状态',
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
    flawlessVictory: '未受到伤害',
    estDamageDetail: '预计损血：{damage} (击杀需 {turns} 回合)',
    breakpointUpgrade: '⚡ 升级临界点：攻击力提升至 ',
    breakpointNeed: '（尚需 +{diff}）',
    breakpointBenefit: '可减少受击 1 回合，少损血 -{saveHp} HP',
    magicAttack: '魔攻',

    // Shop Modal (Gold)
    shopTitle: '金币能力商店',
    shopSubtitle: '使用金币购买生命与攻防强化，突破极限战力！',
    shopCurrentGold: '当前拥有金币：',
    shopPrayerCost: '本次强化消耗：',
    shopBlessingHp: '提升生命值',
    shopBlessingAtk: '提升攻击力',
    shopBlessingDef: '提升防御力',
    shopLeave: '离开商店',
    shopSuccessFloating: '强化成功！属性已提升！',
    shopNotEnoughGold: '金币不足！',
    shopTotalPrayers: '全塔累计强化：{times} 次（所有金币商店共享加价）',
    shopConfirmPrompt: '确认强化？',
    tipNotEnoughGold: '金币不足',

    // Experience Elder Shop Modal
    expShopTitle: '经验修行精进',
    expShopSubtitle: '参透实战心得，将百炼经验化为通天战力！',
    expCurrent: '当前拥有经验：',
    expUpgradeCost: '消耗经验：',
    expUpgradeHp: '强健体魄 (+生命)',
    expUpgradeAtk: '磨砺剑芒 (+攻击)',
    expUpgradeDef: '厚土护体 (+防御)',
    expUpgradeLevel: '境界突破 (+等级与全属性)',
    expShopLeave: '结束修行',
    expSuccessFloating: '参悟功成！属性大幅精进！',
    expNotEnough: '经验值不足！',
    expConfirmPrompt: '确认提升？',
    tipNotEnoughExp: '经验不足',
    expShopSubtitleDetail: '经验老人 · 传授武道',
    unitAtk: '攻',
    unitDef: '防',

    // Dialogue Modal
    dialogueNext: '继续',
    dialogueProceed: '领命前行',

    // Floor Teleport Modal
    teleportTitle: '风之罗盘 · 楼层跃迁',
    teleportSubtitle: '瞬间传送至任意已探索过的楼层',
    cancelBtn: '取消',
    confirmBtn: '确认',

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

    // Confirm Center Fly Modal
    confirmCenterFlyTitle: '确认使用【时空飞行器】？',
    confirmCenterFlyDesc: '即将瞬移传送至目标地面。确定要立即开启跃迁吗？',
    confirmCenterFlyWarning: '【特别注意】：此飞行器为一次性消耗品，使用一次后能量耗尽即会损毁消失！',
    confirmCenterFlyOk: '确认传送',
    confirmCenterFlyCancel: '取消',

    // Confirm Up Fly Modal
    confirmUpFlyTitle: '确认使用【向上飞行器】？',
    confirmUpFlyDesc43: '【时空共鸣】：感应到正上方存在隐藏的【44F 圣盾密室】结界！使用向上飞行器可直接突破空间结界，升入 44 层获取顶级【神圣之盾】。确定立即开启升层吗？',
    confirmUpFlyDescOther: '即将使用【向上飞行器】直升一层（从 {from}F 飞往 {to}F）。\n\n【关键警示】：经典魔塔中，向上飞行器最核心的战略价值是用于突破 43 层结界以进入隐藏的【44F 圣盾密室】。若在当前楼层消耗，后续将无法进入 44 层获取顶级神圣盾！确定要现在使用吗？',
    confirmUpFlyBlocked49: '【结界阻隔】：49层魔能结界剧烈波动，上方通向 50 层的路径已被魔王封印，向上飞行器无法突破决战封印！',
    confirmUpFlyBlocked50: '当前已是最高层（50F 魔塔之巅），无法向上飞行！',
    confirmUpFlyWarning: '【特别注意】：此飞行器为一次性消耗品，使用后立即从背包中移除！',
    confirmUpFlyOk: '确认升层',
    confirmUpFlyCancel: '取消',

    // 存盘与读盘多槽位系统
    saveModalTitle: '游戏存盘',
    saveModalSubtitle: '请选择要保存当前进度的目标槽位',
    loadModalTitle: '读取存档',
    loadModalSubtitle: '请选择要恢复的冒险游戏存档',
    saveTab: '💾 存盘',
    loadTab: '📂 读盘',
    slotBadge: '槽位 {slot}',
    slotEmpty: '空槽位',
    slotEmptyDesc: '空闲槽位，点击即可将当前冒险进度保存至此',
    slotNoData: '暂无存档记录',
    saveToSlot: '存入此槽位',
    overwriteSlot: '覆盖此存档',
    loadFromSlot: '读取此存档',
    deleteSlot: '删除',
    confirmOverwriteTitle: '⚠️ 确认覆盖存档？',
    confirmOverwriteDesc: '槽位 {slot} 已有存档数据（{floor} · {time}）。覆盖后原有进度将无法找回，是否确认覆盖？',
    confirmLoadTitle: '⚠️ 确认读取存档？',
    confirmLoadDesc: '即将载入 槽位 {slot}（{floor} · {time}）的进度，当前未保存的游玩数据将会丢失，是否确认读取？',
    confirmDeleteTitle: '🗑️ 确认删除存档？',
    confirmDeleteDesc: '确定要彻底删除 槽位 {slot} 的存档吗？此操作无法撤销。',
    saveSlotSuccess: '游戏进度已成功保存至槽位 {slot}！',
    loadSlotSuccess: '已成功读取槽位 {slot} 的存档！',
    deleteSlotSuccess: '槽位 {slot} 存档已成功删除！',

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
    bgmMuteTip: 'Mute Music',
    bgmUnmuteTip: 'Play Music',
    sfxOn: 'SFX: On',
    sfxOff: 'SFX: Off',
    bgmOn: 'BGM: On',
    bgmOff: 'BGM: Off',
    debugTip: 'Developer Debug & Cheats',
    restartTip: 'Restart Game',
    coffeeTip: 'Buy Me a Coffee',
    langToggleTip: 'Switch to Chinese (切换为中文)',

    // Buy Me a Coffee & Honor Board Modal
    coffeeModalTitle: 'Support the Developer',
    coffeeModalLeavingWarning: 'Leaving the game to open an external link in a new tab',
    coffeeModalDesc: 'Thank you for your love for Magic Tower 3D! Please consider supporting me on Buy Me a Coffee. If you wish, your name will be synced onto the 0F Hero Supporters Board. Please leave a note with your intention when donating. Thank you!',
    coffeeModalProjectNote: 'Magic Tower 3D is a completely open-source, free-to-play remake. Every cup of coffee fuels future updates and optimizations!',
    coffeeModalConfirmBtn: 'Support on Buy Me a Coffee',
    coffeeModalCancelBtn: 'I will consider carefully',
    monumentSupportBtn: 'Support on Buy Me a Coffee',

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
    hintPan: 'Pan: Drag',
    hintRotate: 'Rotate: Shift/Ctrl+Drag',
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
    canDefeat: '✓ Victory',
    dangerDefeat: '⚠ Danger',

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
    alreadyZeroDamage: 'Already taking no damage',
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
    flawlessVictory: 'No damage taken',
    estDamageDetail: 'Est. Damage: {damage} ({turns} rounds)',
    breakpointUpgrade: '⚡ Breakpoint: Raise ATK to ',
    breakpointNeed: ' (Needs +{diff})',
    breakpointBenefit: 'Saves 1 round, reduces damage by -{saveHp} HP',
    magicAttack: 'Magic ATK',

    // Shop Modal (Gold)
    shopTitle: 'Gold Ability Shop',
    shopSubtitle: 'Spend gold to enhance attributes and boost battle prowess!',
    shopCurrentGold: 'Current Gold: ',
    shopPrayerCost: 'Enhancement Cost: ',
    shopBlessingHp: 'Enhance HP',
    shopBlessingAtk: 'Enhance Attack',
    shopBlessingDef: 'Enhance Defense',
    shopLeave: 'Leave Shop',
    shopSuccessFloating: 'Enhancement successful! Attributes upgraded!',
    shopNotEnoughGold: 'Not enough gold!',
    shopTotalPrayers: 'Total enhancements: {times} (Shared across all shops)',
    shopConfirmPrompt: 'Confirm upgrade?',
    tipNotEnoughGold: 'Not enough gold',

    // Experience Elder Shop Modal
    expShopTitle: 'Experience Training',
    expShopSubtitle: 'Harness battle experience to cultivate boundless combat power!',
    expCurrent: 'Current EXP: ',
    expUpgradeCost: 'Cost EXP: ',
    expUpgradeHp: 'Vitality (+HP)',
    expUpgradeAtk: 'Martial Edge (+ATK)',
    expUpgradeDef: 'Iron Bastion (+DEF)',
    expUpgradeLevel: 'Breakthrough (+Level & All Stats)',
    expShopLeave: 'Leave Training',
    expSuccessFloating: 'Enlightenment reached! Attributes boosted!',
    expNotEnough: 'Not enough EXP!',
    expConfirmPrompt: 'Confirm upgrade?',
    tipNotEnoughExp: 'Not enough EXP',
    expShopSubtitleDetail: 'Experience Elder · Martial Dao',
    unitAtk: 'ATK',
    unitDef: 'DEF',

    // Dialogue Modal
    dialogueNext: 'Next',
    dialogueProceed: 'Proceed',

    // Floor Teleport Modal
    teleportTitle: 'Wind Compass · Floor Leap',
    teleportSubtitle: 'Instantly teleport to any explored floor',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',

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

    // Confirm Center Fly Modal
    confirmCenterFlyTitle: 'Confirm Use [Chrono Flyer]?',
    confirmCenterFlyDesc: 'You are about to teleport to the selected destination. Activate teleportation now?',
    confirmCenterFlyWarning: '[NOTICE]: This flyer is a one-time consumable and will be destroyed upon use!',
    confirmCenterFlyOk: 'Confirm Teleport',
    confirmCenterFlyCancel: 'Cancel',

    // Confirm Up Fly Modal
    confirmUpFlyTitle: 'Confirm Use [Up Flyer]?',
    confirmUpFlyDesc43: '[Spacetime Resonance]: Detected the hidden [44F Holy Shield Vault] barrier above! Using the Up Flyer will breach the seal and ascend directly to Floor 44 to claim the legendary Sacred Shield. Confirm ascension now?',
    confirmUpFlyDescOther: 'About to use [Up Flyer] to ascend one floor (from {from}F to {to}F).\n\n[Warning]: In Magic Tower, this item is crucially required to breach Floor 43 barrier and access the hidden [44F Holy Shield Vault]. If consumed now, you will be unable to access Floor 44 and its Holy Shield! Are you sure you want to proceed?',
    confirmUpFlyBlocked49: '[Barrier Blocked]: Floor 49 magic barrier disrupts vertical flight to Floor 50! Cannot ascend from this floor.',
    confirmUpFlyBlocked50: 'Already on the highest floor (50F Tower Peak), cannot fly up!',
    confirmUpFlyWarning: '[NOTICE]: This flyer is a one-time consumable and will be permanently removed upon use!',
    confirmUpFlyOk: 'Confirm Ascend',
    confirmUpFlyCancel: 'Cancel',

    // 存盘与读盘多槽位系统
    saveModalTitle: 'Save Game',
    saveModalSubtitle: 'Select a slot to save your current progress',
    loadModalTitle: 'Load Game',
    loadModalSubtitle: 'Select a saved game to resume your adventure',
    saveTab: '💾 Save',
    loadTab: '📂 Load',
    slotBadge: 'Slot {slot}',
    slotEmpty: 'Empty Slot',
    slotEmptyDesc: 'Empty slot, click to save current progress here',
    slotNoData: 'No save data',
    saveToSlot: 'Save Here',
    overwriteSlot: 'Overwrite Save',
    loadFromSlot: 'Load Save',
    deleteSlot: 'Delete',
    confirmOverwriteTitle: '⚠️ Confirm Overwrite?',
    confirmOverwriteDesc: 'Slot {slot} already has saved data ({floor} · {time}). Overwriting will permanently replace it. Are you sure?',
    confirmLoadTitle: '⚠️ Confirm Load Save?',
    confirmLoadDesc: 'About to load Slot {slot} ({floor} · {time}). Any unsaved progress will be lost. Are you sure?',
    confirmDeleteTitle: '🗑️ Confirm Delete?',
    confirmDeleteDesc: 'Are you sure you want to permanently delete Slot {slot} save? This cannot be undone.',
    saveSlotSuccess: 'Game successfully saved to Slot {slot}!',
    loadSlotSuccess: 'Successfully loaded Slot {slot} save!',
    deleteSlotSuccess: 'Slot {slot} save deleted successfully!',

    // Notifications
    savedSuccess: 'Game successfully saved to Slot 1',
    loadSuccess: 'Game loaded successfully',
    noSaveFound: 'No valid save file found',
    clearedMonstersFloating: 'All monsters on this floor cleared!',
    teleportedToPrefix: 'Teleported to ',
  },
};

// 怪物名称双语映射表（涵盖全塔 40 种怪物及别名）
export const MONSTER_NAMES: Record<string, { zh: string; en: string }> = {
  // 史莱姆系列
  green_slime: { zh: '绿史莱姆', en: 'Green Slime' },
  red_slime: { zh: '红史莱姆', en: 'Red Slime' },
  big_slime: { zh: '大史莱姆', en: 'Big Slime' },
  black_slime: { zh: '黑史莱姆', en: 'Black Slime' },
  slime_king: { zh: '史莱姆王', en: 'Slime King' },

  // 蝙蝠系列
  small_bat: { zh: '小蝙蝠', en: 'Small Bat' },
  big_bat: { zh: '大蝙蝠', en: 'Big Bat' },
  red_bat: { zh: '红蝙蝠', en: 'Red Bat' },

  // 骷髅系列
  skeleton: { zh: '骷髅人', en: 'Skeleton' },
  skeleton_soldier: { zh: '骷髅士兵', en: 'Skeleton Soldier' },
  skeleton_captain: { zh: '骷髅队长', en: 'Skeleton Captain' },

  // 法师与巫师系列
  junior_mage: { zh: '初级法师', en: 'Junior Mage' },
  senior_mage: { zh: '高级法师', en: 'Senior Mage' },
  red_mage: { zh: '红衣法师', en: 'Red Mage' },
  archmage: { zh: '大法师', en: 'Archmage' },
  arch_mage: { zh: '大法师', en: 'Archmage' },
  junior_wizard: { zh: '初级巫师', en: 'Junior Wizard' },
  senior_wizard: { zh: '高级巫师', en: 'Senior Wizard' },

  // 卫兵与警卫系列
  junior_guard: { zh: '初级卫兵', en: 'Junior Guard' },
  mid_guard: { zh: '中级卫兵', en: 'Medium Guard' },
  senior_guard: { zh: '高级卫兵', en: 'Senior Guard' },
  iron_guard: { zh: '铁甲卫兵', en: 'Iron Guard' },
  magic_guard: { zh: '魔法警卫', en: 'Magic Guard' },

  // 兽人与战士系列
  orc: { zh: '兽人', en: 'Orc' },
  orc_knight: { zh: '兽人武士', en: 'Orc Knight' },
  ghost_soldier: { zh: '鬼战士', en: 'Ghost Soldier' },
  ghost: { zh: '幽灵', en: 'Ghost' },
  ghost_commander: { zh: '冥队长', en: 'Ghost Commander' },
  dual_swordsman: { zh: '双手剑士', en: 'Dual Swordsman' },
  warrior: { zh: '战士', en: 'Warrior' },

  // 骑士系列
  knight: { zh: '骑士', en: 'Knight' },
  knight_captain: { zh: '骑士队长', en: 'Knight Captain' },
  dark_knight: { zh: '黑暗骑士', en: 'Dark Knight' },
  shadow_knight: { zh: '黑暗骑士', en: 'Dark Knight' },
  white_knight: { zh: '白衣武士', en: 'White Knight' },
  yellow_knight: { zh: '黄衣武士', en: 'Yellow Knight' },
  blue_knight: { zh: '蓝衣武士', en: 'Blue Knight' },
  iron_knight: { zh: '铁骑士', en: 'Iron Knight' },
  gold_knight: { zh: '黄金骑士', en: 'Gold Knight' },
  demon_slayer: { zh: '屠龙武士', en: 'Dragon Slayer' },

  // 首领与远古神魔系列
  golem: { zh: '石头人', en: 'Golem' },
  giant_squid: { zh: '大乌贼', en: 'Giant Squid' },
  dragon: { zh: '魔龙', en: 'Ancient Dragon' },
  vampire: { zh: '吸血鬼', en: 'Vampire' },
  false_sorcerer: { zh: '假魔王', en: 'False Sorcerer' },
  demon_lord: { zh: '魔王杰诺', en: 'Demon Lord Zeno' },
  demon_king: { zh: '魔王杰诺', en: 'Demon Lord Zeno' },
};

// 道具与装备双语映射表
export const ITEM_NAMES: Record<string, { zh: string; en: string }> = {
  key_yellow: { zh: '黄钥匙', en: 'Yellow Key' },
  key_blue: { zh: '蓝钥匙', en: 'Blue Key' },
  key_red: { zh: '红钥匙', en: 'Red Key' },
  potion_red: { zh: '小血瓶', en: 'Small Red Potion' },
  potion_blue: { zh: '大血瓶', en: 'Large Red Potion' },
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
  shield_sacred: { zh: '神圣之盾', en: 'Sacred Shield' },
  monster_manual: { zh: '怪物手册', en: 'Monster Manual' },
  compass: { zh: '楼层罗盘', en: 'Floor Compass' },
  cross: { zh: '神圣十字架', en: 'Holy Cross' },
  lucky_coin: { zh: '幸运金币', en: 'Lucky Coin' },
  pickaxe: { zh: '破墙十字镐', en: 'Pickaxe' },
  bomb: { zh: '炼金炸弹', en: 'Bomb' },
  earthquake: { zh: '地震卷轴', en: 'Earthquake Scroll' },
  key_gold: { zh: '金钥匙', en: 'Gold Key' },
  notepad: { zh: '记事本', en: 'Notepad' },
  snow_crystal: { zh: '冰冻雪花', en: 'Snow Crystal' },
  down_fly: { zh: '向下飞行器', en: 'Down Flyer' },
  up_fly: { zh: '向上飞行器', en: 'Up Flyer' },
  center_fly: { zh: '时空飞行器', en: 'Chrono Flyer' },
  sword_dragon: { zh: '屠龙之刃', en: 'Dragon Slayer' },
  thief_shovel: { zh: '小偷的铲子', en: "Thief's Shovel" },
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
  22: { zh: '22F 炽热走廊', en: '22F Molten Corridor' },
  23: { zh: '23F 熔岩裂隙', en: '23F Magma Fissure' },
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
  44: { zh: '44F 神圣之盾星殿', en: '44F Sacred Shield Star Chamber' },
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
  honor_monument: {
    name: { zh: '英雄赞助榜', en: 'Hero Supporters Board' },
    avatar: '🏆',
    lines: {
      zh: [
        '感谢您对魔塔 3D 的热爱，请考虑在 Buy Me a Coffee 上给我打赏。打赏后，如果你愿意，我会将你的名字同步在这个赞助榜上。请在打赏时留言表明意向。谢谢！',
      ],
      en: [
        'Thank you for your love for Magic Tower 3D! Please consider supporting me on Buy Me a Coffee. If you wish, your name will be synced onto this supporters board. Please leave a note with your intention when donating. Thank you!',
      ],
    },
  },
  fairy: {
    name: { zh: '仙人 (仙女)', en: 'Celestial Fairy' },
    avatar: '🧚‍♀️',
    lines: {
      zh: [
        '年轻的勇士，你终于苏醒了！整座魔塔已被大魔王杰诺霸占，公主也被囚禁在第50层塔顶。我以仙灵之力为你破除束缚，助你踏上登塔征程！',
        '【基础操作 · 洞悉万物】：\n• 鼠标左键【单击】任意目标（怪物、物品、大门或机关），可在右下角卡片查看详细信息、战前推演损血与属性。\n• 顶部【怪物手册】(快捷键 L) 随时为你洞察全层妖魔战损与加点临界点！',
        '【行动探索 · 智能寻路】：\n• 使用键盘【方向键】控制勇士前后左右移动。\n• 鼠标【右键双击】任意空地或目标，勇士将自动选择最优路径避开怪物并前往！',
        '【3D 视角 · 自由掌控】：\n• 鼠标【直接左键拖拽】（电脑支持直接左键拖拽，手机支持单指拖拽）即可平移视角查看整张地图。\n• 按住【Shift 或 Ctrl + 鼠标左键拖拽】（或手机双指同向滑动）可 360° 自由旋转三维视角。\n• 按住【Ctrl + 滚轮】（或手机双指捏合）缩放视野远近，按【空格键 (Space)】可随时一键将镜头复位！',
        '【启程指引】：\n我身后的光柱正是通往魔塔 1F 的传送门！大殿四周 4 处神台已为你备好红蓝宝石、血瓶与钥匙。中央圣殿密藏着能使战利金币翻倍的【幸运金币】，由红门紧锁守护。待你在塔中寻得红钥匙后，便可回来解开封印！善用顶部【楼层罗盘】(快捷键 G) 在已探索楼层间瞬间穿梭，去拯救王国吧！',
      ],
      en: [
        'Brave warrior, you are finally awake! The Magic Tower has been seized by Demon Lord Zeno, and the princess is held at the 50F summit. With my fairy magic, I have broken your shackles to aid your ascent!',
        '【Basic Controls · Observation】:\n• [Left-click] any monster, item, or door to inspect detailed stats and exact combat damage predictions in the bottom-right card.\n• Open the [Monster Manual] at the top (Hotkey: L) anytime to consult deterministic damage and critical breakpoints!',
        '【Movement & Navigation】:\n• Use [Arrow Keys] to move your warrior.\n• [Double-right-click] any reachable tile or object to automatically take the optimal path avoiding monsters!',
        '【3D Camera Controls】:\n• [Left-click Drag] (direct drag on PC, single-finger drag on mobile) to pan across the floor map.\n• Hold [Shift or Ctrl + Left-click Drag] (or slide two fingers on mobile) to rotate the 3D camera 360° freely.\n• Hold [Ctrl + Scroll Wheel] (or two-finger pinch on mobile) to zoom in/out, and press [Spacebar] anytime to instantly reset the camera view!',
        '【Ascension Guide】:\nThe light portal directly behind me leads up to 1F! The 4 shrines around the hall provide you with gems, potions, and keys. The central sanctuary enshrines the [Lucky Coin] (which doubles gold from battles), safely locked behind a Red Door. Once you discover a Red Key higher in the tower, return here to break the seal! Use your [Floor Compass] (G) anytime, and go save the kingdom!',
      ],
    },
  },
  thief: {
    name: { zh: '小偷', en: 'Thief' },
    avatar: '🥷',
    lines: {
      zh: [
        '嘿！多谢你打开牢房救了我！作为报答，我告诉你两个天大的秘密！',
        '在第 5 层的一处重兵把守之地藏有一柄【铁剑】，能提升 10 点攻击！',
        '而在第 9 层的一堵暗墙之后，藏有一面【铁盾】，能抵御极多伤害！快去找寻它们吧！',
        '咱们后会有期，前面我还会为你开辟暗道！',
      ],
      en: [
        'Hey! Thanks for unlocking my cell and freeing me! As a reward, let me tell you two huge secrets!',
        'On Floor 5, guarded heavily, lies an [Iron Sword] that grants +10 Attack!',
        'And behind a secret false wall on Floor 9, an [Iron Shield] is hidden that blocks tons of damage! Go find them!',
        'See you ahead—I will dig secret bypasses for you further up the tower!',
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
  elder_exp: {
    name: { zh: '经验老人', en: 'Experience Elder' },
    avatar: '🧙‍♂️',
    lines: {
      zh: [
        '年轻人，你斩妖除魔积攒了深厚的战斗心得！',
        '老夫精通玄门易理，能将你的【经验值】化为脱胎换骨的通天战力！',
      ],
      en: [
        'Young warrior, you have accumulated rich combat wisdom through countless battles!',
        'I can channel your [Experience] into boundless vitality and mighty combat prowess!',
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
    return { text: lang === 'zh' ? '生命 +500' : 'HP +500', color: '#ef4444' };
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
      text: lang === 'zh' ? '获得神盾【神圣之盾】防御 +150！' : 'Obtained [Sacred Shield] DEF +150!',
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
  if (itemType === 'thief_shovel') {
    return {
      text: lang === 'zh' ? '获得【小偷的铲子】！' : "Obtained [Thief's Shovel]!",
      color: '#fbbf24',
    };
  }
  if (itemType === 'key_gold') {
    return {
      text: lang === 'zh' ? '获得金钥匙，全钥匙 +1！' : 'Obtained Gold Key, +1 to all keys!',
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
      text: lang === 'zh' ? '获得秘宝【时空飞行器】！(一次性道具)' : 'Obtained [Chrono Flyer]! (One-time consumable)',
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
  const item = MONSTER_NAMES[id];
  if (item && item[lang]) {
    return item[lang];
  }
  const mon = MONSTERS[id];
  if (mon) {
    if (lang === 'zh' && mon.name) return mon.name;
    if (lang === 'en' && mon.nameEn) return mon.nameEn;
  }
  // 严格杜绝 code name（严禁包含下划线 _）
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getItemName(id: string, lang: Language): string {
  const item = ITEM_NAMES[id];
  if (item && item[lang]) {
    return item[lang];
  }
  const it = ITEMS[id as ItemType];
  if (it) {
    if (lang === 'zh' && it.name) return it.name;
    if (lang === 'en' && it.nameEn) return it.nameEn;
  }
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getMonsterDescription(id: string, lang: Language): string {
  const mon = MONSTERS[id];
  if (mon) {
    if (lang === 'en' && mon.descriptionEn) return mon.descriptionEn;
    if (lang === 'zh' && mon.description) return mon.description;
  }
  return lang === 'zh' ? '游荡于魔塔中的凶残妖魔。' : 'A menacing creature roaming the Magic Tower.';
}

export function getItemDescription(id: string, lang: Language): string {
  const item = ITEMS[id as ItemType];
  if (item) {
    if (lang === 'en' && item.descriptionEn) return item.descriptionEn;
    if (lang === 'zh' && item.description) return item.description;
  }
  return lang === 'zh' ? '散落于地牢中的珍稀法宝。' : 'A rare relic found within the dungeon.';
}

export function getSpecialAbilityLabel(
  ability: SpecialAbility,
  lang: Language,
  hasCross?: boolean
): string {
  if (ability === 'FIRST_STRIKE') return lang === 'zh' ? '先攻' : 'First Strike';
  if (ability === 'DOUBLE_STRIKE') return lang === 'zh' ? '2连击' : '2 Strikes';
  if (ability === 'TRIPLE_STRIKE') return lang === 'zh' ? '3连击' : '3 Strikes';
  if (ability === 'MAGIC_ATTACK') return lang === 'zh' ? '魔攻' : 'Magic ATK';
  if (ability === 'VAMPIRE_10') {
    return hasCross
      ? (lang === 'zh' ? '吸血免疫' : 'Vampire Blocked')
      : (lang === 'zh' ? '吸血10%' : 'Vampire 10%');
  }
  if (ability === 'VAMPIRE_20') {
    return hasCross
      ? (lang === 'zh' ? '吸血免疫' : 'Vampire Blocked')
      : (lang === 'zh' ? '吸血20%' : 'Vampire 20%');
  }
  if (ability === 'POISON') return lang === 'zh' ? '中毒' : 'Poison';
  if (ability === 'DEFENSE_BREAK') return lang === 'zh' ? '破甲' : 'Armor Break';
  return String(ability);
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

export interface TraderFloorOffer {
  tradeId: string;
  costGold: number;
  itemType: ItemType;
  count: number;
  title: { zh: string; en: string };
  linesBefore: { zh: string[]; en: string[] };
  linesAfter: { zh: string[]; en: string[] };
  linesAlreadyBought: { zh: string[]; en: string[] };
}

export const TRADER_FLOOR_OFFERS: Record<number, TraderFloorOffer> = {
  2: {
    tradeId: 'trader_2f',
    costGold: 50,
    itemType: 'key_yellow',
    count: 4,
    title: { zh: '购买 4 把黄钥匙', en: 'Buy 4 Yellow Keys' },
    linesBefore: {
      zh: [
        '感谢你打开地牢救了我！作为报恩，我将身上的 4 把黄钥匙以 50 金币超值赠与你！',
      ],
      en: [
        'Thank you for unlocking my dungeon cell! As gratitude, take these 4 Yellow Keys for just 50 Gold!',
      ],
    },
    linesAfter: {
      zh: ['黄钥匙拿好，地牢外守卫森严，多加保重！'],
      en: ['Take the Yellow Keys. The dungeon is heavily guarded, stay safe!'],
    },
    linesAlreadyBought: {
      zh: ['黄钥匙拿好，地牢外守卫森严，多加保重！'],
      en: ['Take the Yellow Keys. The dungeon is heavily guarded, stay safe!'],
    },
  },
  7: {
    tradeId: 'trader_7f',
    costGold: 50,
    itemType: 'key_yellow',
    count: 5,
    title: { zh: '购买 5 把黄钥匙', en: 'Buy 5 Yellow Keys' },
    linesBefore: {
      zh: [
        '年轻人，我这里有 5 把黄钥匙，只要 50 个金币打包卖给你！',
        '每一扇黄门都需要精打细算，前期物资紧缺，这 5 把黄钥匙能解你的燃眉之急！要来一份吗？',
      ],
      en: [
        'Young warrior, I have 5 Yellow Keys here—bundled for only 50 Gold!',
        'Every yellow door counts in this tower. These 5 keys will greatly relieve your key drought! Care to purchase?',
      ],
    },
    linesAfter: {
      zh: ['黄钥匙已经全部卖给你了，祝你在前方的迷宫中探险顺利！'],
      en: ['All 5 Yellow Keys are now yours. Safe travels in the labyrinth ahead!'],
    },
    linesAlreadyBought: {
      zh: ['黄钥匙已经全部卖给你了，祝你在前方的迷宫中探险顺利！'],
      en: ['All 5 Yellow Keys are now yours. Safe travels in the labyrinth ahead!'],
    },
  },
  12: {
    tradeId: 'trader_12f',
    costGold: 200,
    itemType: 'key_red',
    count: 1,
    title: { zh: '购买 1 把红钥匙', en: 'Buy 1 Red Key' },
    linesBefore: {
      zh: [
        '嘿嘿，看你打破暗墙有缘，这把价值连城的红钥匙特惠价只要 200 金币！你要买下它吗？',
      ],
      en: [
        'Hehehe, since you broke through the secret wall, I offer this priceless Red Key for a special bargain: only 200 Gold! Care to buy?',
      ],
    },
    linesAfter: {
      zh: ['红钥匙已交给你，愿它为你打开通往二区神器的红色大门！'],
      en: ['The Red Key is yours. May it unlock the sanctum red door to Sector 2 relics!'],
    },
    linesAlreadyBought: {
      zh: ['红钥匙已交给你，愿它为你打开通往二区神器的红色大门！'],
      en: ['The Red Key is yours. May it unlock the sanctum red door to Sector 2 relics!'],
    },
  },
  15: {
    tradeId: 'trader_15f',
    costGold: 100,
    itemType: 'key_blue',
    count: 1,
    title: { zh: '购买 1 把蓝钥匙', en: 'Buy 1 Blue Key' },
    linesBefore: {
      zh: [
        '年轻人，二区的蓝门越来越多了吧？我这里有 1 把蓝钥匙，特惠只要 100 金币！',
      ],
      en: [
        'Young warrior, more blue doors in Sector 2? I have 1 Blue Key for only 100 Gold!',
      ],
    },
    linesAfter: {
      zh: ['蓝钥匙拿好，注意避开强大的大蝙蝠与大乌贼！'],
      en: ['Keep the Blue Key safe, and watch out for the giant bats and squid!'],
    },
    linesAlreadyBought: {
      zh: ['蓝钥匙拿好，注意避开强大的大蝙蝠与大乌贼！'],
      en: ['Keep the Blue Key safe, and watch out for the giant bats and squid!'],
    },
  },
  28: {
    tradeId: 'trader_28f',
    costGold: 100,
    itemType: 'key_blue',
    count: 1,
    title: { zh: '购买 1 把蓝钥匙', en: 'Buy 1 Blue Key' },
    linesBefore: {
      zh: [
        '熔岩深处危机四伏，我这里有 1 把珍贵的蓝钥匙，只要 100 金币！你需要吗？',
      ],
      en: [
        'Perils lurk in the magma depths! I offer 1 rare Blue Key for 100 Gold. Need it?',
      ],
    },
    linesAfter: {
      zh: ['合作愉快，前方就是骑士之路了，一路顺风！'],
      en: ['Pleasure doing business! The Knight Path lies ahead, safe journey!'],
    },
    linesAlreadyBought: {
      zh: ['合作愉快，前方就是骑士之路了，一路顺风！'],
      en: ['Pleasure doing business! The Knight Path lies ahead, safe journey!'],
    },
  },
  31: {
    tradeId: 'trader_31f',
    costGold: 200,
    itemType: 'key_yellow',
    count: 4,
    title: { zh: '购买 4 把黄钥匙', en: 'Buy 4 Yellow Keys' },
    linesBefore: {
      zh: [
        '三区到处都是机关大门，4 把黄钥匙特惠价 200 金币，要买吗？',
      ],
      en: [
        'Sector 3 is filled with gates! 4 Yellow Keys for only 200 Gold, interested?',
      ],
    },
    linesAfter: {
      zh: ['合作愉快，三区要多加防备双手剑士与骑士幽灵！'],
      en: ['Pleasure trading, watch out for the dual swordsmen and knight ghosts!'],
    },
    linesAlreadyBought: {
      zh: ['合作愉快，三区要多加防备双手剑士与骑士幽灵！'],
      en: ['Pleasure trading, watch out for the dual swordsmen and knight ghosts!'],
    },
  },
  38: {
    tradeId: 'trader_38f',
    costGold: 100,
    itemType: 'key_yellow',
    count: 3,
    title: { zh: '购买 3 把黄钥匙', en: 'Buy 3 Yellow Keys' },
    linesBefore: {
      zh: [
        '3 把黄钥匙只要 100 金币，超值甩卖助你探索迷阵！',
      ],
      en: [
        '3 Yellow Keys for just 100 Gold, special bargain to help you navigate!',
      ],
    },
    linesAfter: {
      zh: ['祝你早日通过三区隘口夺得骑士之盾！'],
      en: ['May you conquer Sector 3 and claim the Knight Shield!'],
    },
    linesAlreadyBought: {
      zh: ['祝你早日通过三区隘口夺得骑士之盾！'],
      en: ['May you conquer Sector 3 and claim the Knight Shield!'],
    },
  },
  39: {
    tradeId: 'trader_39f',
    costGold: 600,
    itemType: 'key_blue',
    count: 3,
    title: { zh: '购买 3 把蓝钥匙', en: 'Buy 3 Blue Keys' },
    linesBefore: {
      zh: [
        '3 把珍贵的蓝钥匙，打包特惠 600 金币，你需要吗？',
      ],
      en: [
        '3 rare Blue Keys bundled for only 600 Gold, need them?',
      ],
    },
    linesAfter: {
      zh: ['收好蓝钥匙，前方就是四区神圣天界了！'],
      en: ['Take care of the Blue Keys, the Celestial Sector lies ahead!'],
    },
    linesAlreadyBought: {
      zh: ['收好蓝钥匙，前方就是四区神圣天界了！'],
      en: ['Take care of the Blue Keys, the Celestial Sector lies ahead!'],
    },
  },
  45: {
    tradeId: 'trader_45f',
    costGold: 500,
    itemType: 'key_red',
    count: 1,
    title: { zh: '购买 1 把红钥匙', en: 'Buy 1 Red Key' },
    linesBefore: {
      zh: [
        '天界深处封印重重！这把绝版红钥匙开价 500 金币，助你解开神圣殿堂！',
      ],
      en: [
        'Deep celestial barriers await! This rare Red Key is 500 Gold, unlocking sacred halls!',
      ],
    },
    linesAfter: {
      zh: ['红钥匙已交给你，祝你登上塔巅！'],
      en: ['The Red Key is yours, may you reach the summit!'],
    },
    linesAlreadyBought: {
      zh: ['红钥匙已交给你，祝你登上塔巅！'],
      en: ['The Red Key is yours, may you reach the summit!'],
    },
  },
  47: {
    tradeId: 'trader_47f',
    costGold: 300,
    itemType: 'key_red',
    count: 1,
    title: { zh: '购买 1 把红钥匙', en: 'Buy 1 Red Key' },
    linesBefore: {
      zh: [
        '勇士，决战在即！这把最后的红钥匙特惠 300 金币赠售，为你开启圣光神剑！',
      ],
      en: [
        'Final showdown approaches! This last Red Key for 300 Gold will unlock the Sacred Blade!',
      ],
    },
    linesAfter: {
      zh: ['愿圣光神剑助你诛灭魔王！'],
      en: ['May the Sacred Blade aid you in destroying the Demon Lord!'],
    },
    linesAlreadyBought: {
      zh: ['愿圣光神剑助你诛灭魔王！'],
      en: ['May the Sacred Blade aid you in destroying the Demon Lord!'],
    },
  },
};

export interface ElderFloorConfig {
  name?: { zh: string; en: string };
  lines: { zh: string[]; en: string[] };
  linesAfterGift?: { zh: string[]; en: string[] };
}

export const ELDER_FLOOR_DIALOGUES: Record<number, ElderFloorConfig> = {
  1: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，欢迎来到魔塔1层！魔塔危机四伏，鲁莽战斗只会白白送命。',
        '每一把钥匙都要精打细算！仔细搜寻角落和看似完整的石壁，这里隐藏着意想不到的暗墙与通道！',
        '这把黄钥匙赠予你，愿它能在关键时刻助你一臂之力！',
      ],
      en: [
        'Young warrior, welcome to Floor 1! Perils lurk everywhere; reckless battles will only lead to your demise.',
        'Manage every key with utmost care! Search corners and solid stone walls, for unexpected false walls and passages hide within.',
        'Take this Yellow Key as my humble gift. May it aid you at a critical moment!',
      ],
    },
    linesAfterGift: {
      zh: ['记住我的话，仔细搜寻每一面石壁，祝你早日登上塔顶解救公主！'],
      en: ['Remember my words: examine every stone wall. May you reach the summit and rescue the princess!'],
    },
  },
  2: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '感谢你打开地牢牢房救了我！魔塔危机四伏，没有充足的金币将寸步难行。',
        '老夫被囚禁前积攒了【300金币】，现在全部赠予你！去 3 层或更高层的神坛强化自己吧！',
      ],
      en: [
        'Thank you for unlocking my prison cell! The tower is treacherous; without enough gold you cannot survive.',
        'I hid [300 Gold] before being captured—I bestow it all upon you! Use it at the altars to empower yourself!',
      ],
    },
    linesAfterGift: {
      zh: ['带上这 300 金币去神坛强化自己吧！祝你早日攻克魔塔救出公主！'],
      en: ['Use the 300 Gold to empower yourself at the altars! Safe travels!'],
    },
  },
  3: {
    name: { zh: '神秘老人', en: 'Mystic Sage' },
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
  4: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻人，你注意到那些沉重的特殊铁门了吗？',
        '那些是机关铁门，普通钥匙是无法打开它们的！',
        '只有击败看守它们的特定怪物首领，机关才会感应解锁！在向深处探索时务必谨记这一点。',
        '这瓶【初级红药水】(生命+200) 赠予你，助你在探索初期保持充沛体力！',
      ],
      en: [
        'Young traveler, have you noticed those heavy iron gates?',
        'Those are mechanical trap doors—ordinary keys cannot unlock them!',
        'Only by defeating the specific monster captains guarding them will the mechanism spring open! Remember this well as you venture deeper.',
        'Take this [Red Potion] (+200 HP) as my gift to sustain your vigor!',
      ],
    },
    linesAfterGift: {
      zh: ['击败看守的怪物头领即可开启铁门，多加保重！'],
      en: ['Defeat the guard captains to unlock the iron gates, stay safe!'],
    },
  },
  6: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻人，你看到东北角的那位神秘行脚商人了吗？',
        '如果你从他手中买下了礼物，随后再次与他交谈，他心情大好时会告诉你关于魔塔分区与守关头目的关键情报！',
        '另外，前方7层藏有珍贵的红蓝宝石，做好万全准备再去探寻吧！',
      ],
      en: [
        'Young warrior, have you seen the mysterious traveling merchant in the northeast corner?',
        'If you purchase his item and converse with him again, in his good spirits he will disclose vital secrets regarding tower sectors and area bosses!',
        'Furthermore, precious Red and Blue Gems await on Floor 7 ahead. Prepare yourself thoroughly!',
      ],
    },
  },
  7: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '勇士，切记战斗临界点的玄机：',
        '如果你的攻击力低于怪物的防御力，你的利刃将无法对怪物造成任何伤害（破防失败）！',
        '建议优先提升攻击力破防，或者提升防御力将怪物伤害降至最低。',
        '这颗【蓝宝石】赠予你，愿它为你筑起坚不可摧的坚固防御！',
      ],
      en: [
        'Warrior, remember the secrets of combat breakpoints:',
        'If your Attack is lower than a monster’s Defense, your blade will deal zero damage!',
        'Prioritize raising Attack to break defense thresholds, or boosting Defense to reduce incoming damage to zero.',
        'Take this [Blue Gem] as my gift. May it fortify your defense into an unyielding shield!',
      ],
    },
    linesAfterGift: {
      zh: ['记住我的话：善用蓝宝石提升防御力，将损血降至最低！祝你顺利通过7层矿晶宝库！'],
      en: ['Remember my words: use the Blue Gem to bolster Defense and minimize damage!'],
    },
  },
  9: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '嘘……放轻脚步！仔细听这层坚硬的石壁，是不是隐约传来空洞的回音？',
        '在走廊右侧寻找虚假的暗墙！勇敢地撞上去，里面封藏着能大幅抵御伤害的古老重宝——【铁盾】！',
        '这颗【红宝石】赠予你，增强你的攻击锋芒，助你更快劈开顽敌！',
      ],
      en: [
        'Hush... tread lightly! Listen to the stone walls on this floor—can you hear the hollow echoes?',
        'Search for false walls along the right hallway! Push firmly into them; behind lies the ancient treasure [Iron Shield] that grants heavy defense!',
        'Take this [Red Gem] as my gift to hone your blade for swift victories!',
      ],
    },
    linesAfterGift: {
      zh: ['暗墙就在走廊右侧，撞击即可开启通往铁盾的道路！'],
      en: ['The false wall is along the right corridor—push into it to reach the Iron Shield!'],
    },
  },
  12: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你竟然发现了这处隐秘暗室！二区的妖魔比一区凶残数倍，必须做好万全准备。',
        '老夫游历全塔积攒的【300金币】与【蓝宝石】赠予你！你可以拿这笔金币去左侧暗室向神秘商人购买特惠红钥匙，或者去神坛强化自身！',
      ],
      en: [
        'Young warrior, you actually discovered this hidden sanctuary! Sector 2 monsters are far fiercer, requiring thorough preparation.',
        'Take these [300 Gold] and [Blue Gem] as my gift! Use this gold to purchase the discounted Red Key from the merchant in the left alcove, or empower yourself at the altar!',
      ],
    },
    linesAfterGift: {
      zh: ['带上这笔金币与蓝宝石，去左侧暗室看看红钥匙商人，或者去神坛强化自己吧！祝你早日攻克二区！'],
      en: ['Take this gold and Blue Gem. Visit the Red Key merchant in the left alcove or empower yourself at the altar!'],
    },
  },
  15: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻人，你竟然识破了暗墙发现了这里！二区深渊魔窟的大乌贼极为凶残，但击破它能解锁深渊宝库！',
        '这瓶【高级蓝药水】(生命+500) 赠予你，助你调整气血，迎战深渊巨兽！',
      ],
      en: [
        'Young warrior, you saw through the false wall and found this sanctum! The giant squid in this abyss is ferocious, but slaying it unseals the treasure vault!',
        'Take this [Blue Potion] (+500 HP) to restore your vitality and conquer the abyss!',
      ],
    },
    linesAfterGift: {
      zh: ['调整好状态，击败中央的大乌贼解开深渊封印！'],
      en: ['Keep your stats high and defeat the giant squid to break the abyss seals!'],
    },
  },
  16: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '老夫游历全塔多年，可以明确告诉你：整座魔塔中隐藏着极其罕见的红钥匙，每一把都通往足以改变战局的重宝密室！',
        '这颗【红宝石】赠予你，愿它为你灌注神力，破敌斩煞！',
      ],
      en: [
        'I have wandered this tower for decades. Rare Red Keys are hidden across the floors, each unlocking sanctums that turn the tide of battle!',
        'Take this [Red Gem] as my gift. May it empower your strikes to crush any foe!',
      ],
    },
    linesAfterGift: {
      zh: ['珍贵的红钥匙每一把都要用在刀刃上，祝你探险顺利！'],
      en: ['Use every rare Red Key where it counts most. Best of luck!'],
    },
  },
  18: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '警告你，年轻人！在二区若不多次在商店提升攻击力，你的利刃将根本无法斩开石头人的坚硬护甲！',
        '这颗【红宝石】赠予你，助你早日突破破防临界点！',
      ],
      en: [
        'A dire warning, warrior! In Sector 2, if you do not boost your Attack substantially at the shop, your blade cannot pierce the stone golem’s hide!',
        'Take this [Red Gem] to help you reach that critical damage threshold!',
      ],
    },
    linesAfterGift: {
      zh: ['切记优先提升攻击力破开石头人防御！'],
      en: ['Remember to prioritize Attack to pierce the golem defenses!'],
    },
  },
  21: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你已踏入炽热的熔岩要塞！这里的烈焰妖魔攻击迅猛，必须时刻留意血线！',
        '驻守在25层的红衣魔王是大法师！他的法力深不可测，若没有拿到更高阶的圣剑神盾，贸然挑战等同于自寻死路！',
        '这瓶【高级蓝药水】(生命+500) 赠予你，愿你在烈焰中保持坚韧！',
      ],
      en: [
        'Young warrior, you have entered the molten Magma Fortress! Monsters strike with blazing speed; guard your vitality carefully!',
        'The crimson arch-mage ruling Floor 25 possesses unfathomable sorcery! Without high-tier sacred blades and shields, challenging him is sheer suicide!',
        'Take this [Blue Potion] (+500 HP) to sustain your endurance across the flames!',
      ],
    },
    linesAfterGift: {
      zh: ['在 25 层决战前做好最充足的准备，切勿轻敌！'],
      en: ['Prepare thoroughly before challenging Floor 25; do not underestimate the arch-mage!'],
    },
  },
  24: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '勇士！前方 25 层就是魔塔二区的大首领——红衣魔王大法师！',
        '决战在即，法师的魔法冲击极为致命，你的防御力将决定你能承受多少次法术冲击！',
        '这颗【蓝宝石】赠予你，为你筑牢护甲，抵御烈焰浩劫！',
      ],
      en: [
        'Warrior! Floor 25 ahead is the throne room of the Sector 2 Lord—the Crimson Arch-Mage!',
        'The showdown is imminent! His magic strikes are lethal; your defense determines your survival against his spells!',
        'Take this [Blue Gem] to fortify your armor against the flame cataclysm!',
      ],
    },
    linesAfterGift: {
      zh: ['身后的要塞密室封存着前人留下的决战【圣水】与重宝，若有红钥匙不妨开启！带上坚固的防御去 25 层诛灭红衣魔王吧！'],
      en: ['The fortress vault behind holds sacred [Holy Water] and battle treasures. Unlock it with a Red Key!'],
    },
  },
  31: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '双手剑士的剑招势大力沉，攻击力极高！在能够对其形成‘一击必杀’之前，千万不要轻易去招惹他！',
        '这颗【蓝宝石】赠予你，增强你的体魄护甲，减少与三区强敌交战时的战损！',
      ],
      en: [
        'Two-handed swordsmen strike with devastating force! Unless you can kill them in a single strike, do not provoke them lightly!',
        'Take this [Blue Gem] to fortify your armor and minimize damage against Sector 3 foes!',
      ],
    },
    linesAfterGift: {
      zh: ['善用防御力减少交战损失，避开过于强劲的双手剑士！'],
      en: ['Maximize defense to cut battle losses, and avoid two-handed swordsmen until you are strong enough!'],
    },
  },
  33: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你已来到幽暗剑冢！在这层迷宫右下角的暗墙深处，封印着三区神兵——【骑士剑】！',
        '只要穿过虚假的石壁，便能拔出此剑，攻击力大幅提升！',
        '这颗【红宝石】赠予你，愿你的剑刃更加锋利！',
      ],
      en: [
        'Young warrior, welcome to the Sword Tomb! Hidden deep behind the false walls at the lower-right rests the Sector 3 relic—the [Knight Sword]!',
        'Push through the false wall to claim this sword and vastly boost your attack power!',
        'Take this [Red Gem] to sharpen your edge even further!',
      ],
    },
    linesAfterGift: {
      zh: ['去右下角暗墙寻找骑士剑吧，它将彻底扭转你在三区的战局！'],
      en: ['Find the Knight Sword behind the lower-right false wall; it will completely turn the tide in Sector 3!'],
    },
  },
  36: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻人，36层是一座结构对称的封印迷宫！仔细观察两侧大门的排布，切勿盲目消耗宝贵的钥匙。',
        '这瓶【高级蓝药水】(生命+500) 赠予你，助你在幽暗走廊中恢复元气！',
      ],
      en: [
        'Warrior, Floor 36 is a symmetrical sealed labyrinth! Study the layout of doors carefully and do not waste precious keys needlessly.',
        'Take this [Blue Potion] (+500 HP) to rejuvenate yourself in these gloomy corridors!',
      ],
    },
    linesAfterGift: {
      zh: ['精打细算每把钥匙，祝你顺利穿越 36 层迷宫！'],
      en: ['Conserve every key wisely. May you traverse the Floor 36 labyrinth safely!'],
    },
  },
  37: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '勇士！37层是坚不可摧的宝物库！这里的深处封藏着密集的红蓝宝石与血瓶，甚至还有珍稀的炸弹！',
        '这颗【蓝宝石】赠予你，为你抵御看守宝库的强大冥界幽灵！',
      ],
      en: [
        'Warrior! Floor 37 is the Indomitable Treasure Vault! Abundant gems, potions, and even rare bombs are sealed within.',
        'Take this [Blue Gem] to shield yourself against the nether phantoms guarding the vaults!',
      ],
    },
    linesAfterGift: {
      zh: ['妥善规划钥匙，搜集 37 层的大量宝物来大幅提升战力！'],
      en: ['Plan your keys carefully and claim Floor 37’s bountiful treasures to surge in power!'],
    },
  },
  38: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你是否渴望最强坚盾？在 38 层左下方被机关铁门封锁的密室中，守护着【骑士盾】！',
        '击败右侧的看守队长即可开启机关门。这瓶【高级蓝药水】(生命+500) 赠予你，祝你夺得神盾！',
      ],
      en: [
        'Young warrior, do you seek an impenetrable shield? In the lower-left chamber behind iron trap doors lies the [Knight Shield]!',
        'Defeat the guard captains on the right to open the gates. Take this [Blue Potion] (+500 HP) to aid your quest!',
      ],
    },
    linesAfterGift: {
      zh: ['击败看守队长解锁机关门，骑士盾就是你的了！'],
      en: ['Defeat the guard captains to open the gates, and the Knight Shield is yours!'],
    },
  },
  39: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '古老的密宝谜题：在时钟的3点钟方向，拥有任意传送功能的神秘时空密宝就会显现神迹……',
        '这把蓝钥匙赠予你，愿它为你打开通往谜底的核心大门！',
      ],
      en: [
        'An ancient relic riddle: At the 3 o’clock position of the clock dial, the sacred relic granting boundless teleportation shall reveal its divine light...',
        'Take this Blue Key to unlock the gateway toward this mystic enigma!',
      ],
    },
    linesAfterGift: {
      zh: ['记住 3 点钟方向的时钟谜题，时空飞行密宝就在那里！'],
      en: ['Remember the 3 o’clock clock riddle; the mystical flight relic awaits there!'],
    },
  },
  41: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你终于登上了四区——神圣天界！这里的魔法警卫与高级巫师拥有极强的魔力。',
        '这颗【红宝石】赠予你，为你注入神圣之力，披荆斩棘！',
      ],
      en: [
        'Brave warrior, you have ascended to Sector 4—the Celestial Realm! Magic guards and senior wizards here wield tremendous sorcery.',
        'Take this [Red Gem] to channel holy power and cleave through the celestial trials!',
      ],
    },
    linesAfterGift: {
      zh: ['四区的敌人实力飞跃，切记稳扎稳打提升属性！'],
      en: ['Enemies in Sector 4 are formidable; proceed cautiously and keep enhancing your attributes!'],
    },
  },
  45: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '勇士！在 45 层下方的机关密室中藏有能穿梭天界的【向上飞行器】！',
        '这瓶【高级蓝药水】(生命+500) 赠予你，为你保持全盛战力！',
      ],
      en: [
        'Warrior! In the lower chamber of Floor 45, an [Up Flight Wing] is sealed away to aid your skyward ascent!',
        'Take this [Blue Potion] (+500 HP) to keep your vigor at its peak!',
      ],
    },
    linesAfterGift: {
      zh: ['解开下方机关取得飞行器，能让你在关键楼层自由穿梭！'],
      en: ['Solve the lower chamber traps to claim the flight wing for boundless mobility!'],
    },
  },
  46: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你已抵达塔巅前的终极神坛！这里的金币商店提供整座魔塔最强大的属性加成！',
        '老夫将积攒毕生的【500金币】赠予你，去神坛全力强化你的攻击与防御吧！',
      ],
      en: [
        'Young warrior, you have reached the ultimate altar before the pinnacle! The shop here grants the greatest attribute boosts in the tower!',
        'I gift you [500 Gold] gathered over a lifetime—use it at the altar to maximize your attack and defense!',
      ],
    },
    linesAfterGift: {
      zh: ['善用这 500 金币在终极神坛强化，以最强姿态迎接最终决战！'],
      en: ['Empower yourself at the ultimate altar with this gold and prepare for the final showdown!'],
    },
  },
  47: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '勇士，决战迫在眉睫！在 48 层的密室深处封存着诛灭魔王的究极神兵——【圣光之剑】！',
        '这两颗珍稀的【红宝石】(攻击力+6) 赠予你，愿圣光洗礼你的利刃！',
      ],
      en: [
        'Warrior, the final showdown is at hand! In the deep vaults of Floor 48 rests the ultimate blade to slay the Demon Lord—the [Holy Sword]!',
        'Take these two rare [Red Gems] (+6 ATK). May holy light bless your blade!',
      ],
    },
    linesAfterGift: {
      zh: ['带上圣光之力，去 48 层夺取神兵吧！'],
      en: ['With holy might, proceed to Floor 48 and claim the Sacred Blade!'],
    },
  },
  48: {
    name: { zh: '智慧老人', en: 'Wise Sage' },
    lines: {
      zh: [
        '年轻的勇士，你终于来到了神圣宝库！封印神剑的魔法门需要击败全部神圣守卫才会解除！',
        '这瓶至高无上的【神圣圣水】(生命+1000) 赠予你，愿神圣之力佑你凯旋！',
        '此外切记：49 层的假魔王受十字魔法阵庇护，必须先消灭其上、下、左、右四方向的魔法警卫破除结界，方可与其决战！',
      ],
      en: [
        'Brave warrior, you have arrived at the Sacred Vault! The magic gates sealing the holy sword will unseal once all sacred guards are defeated!',
        'Take this supreme [Holy Water] (+1000 HP). May the divine light guide you to glory!',
        'Also remember: The False Sorcerer on 49F is protected by a cross barrier. Defeat the four magic guards above, below, left, and right of him first to dispel the seal!',
      ],
    },
    linesAfterGift: {
      zh: ['消灭 49 层假魔王四周呈十字分布的 4 名魔法警卫解除结界，即可诛灭假魔王前往 50 层！'],
      en: ['Defeat the 4 magic guards arranged in a cross around the False Sorcerer on 49F to break the seal and reach Floor 50!'],
    },
  },
};

export function getDialogueData(
  npcId: string,
  lang: Language,
  floorNum?: number,
  isTraderBought?: boolean,
  hasElderGift?: boolean,
  extraFlag?: boolean
) {
  // 1. 特殊经验老人
  if (npcId === 'elder_exp') {
    const item = NPC_DIALOGUES['elder_exp'];
    return {
      name: item.name[lang],
      avatar: item.avatar,
      lines: item.lines[lang],
      currentIndex: 0,
    };
  }

  // 2. 特殊小偷 (29F 勘探暗道)
  if (npcId === 'thief' && floorNum === 29) {
    return {
      name: lang === 'zh' ? '小偷' : 'Thief',
      avatar: '🥷',
      lines: hasElderGift
        ? (lang === 'zh'
            ? ['暗道已经被我挖通了，快去 30 层吧！祝你早日救出公主！']
            : ['The tunnel is clear, head straight to Floor 30! May you rescue the princess soon!'])
        : (extraFlag
            ? (lang === 'zh'
                ? [
                    '太好了！你帮我找回了铲子！',
                    '前面 30 层的暗道已经被我挖通了！这两把黄钥匙送给你，快去吧！',
                  ]
                : [
                    'Fantastic! You found my shovel!',
                    'The secret bypass into Floor 30 is now dug open! Take these 2 Yellow Keys and go forth!',
                  ])
            : (lang === 'zh'
                ? [
                    '嘿！朋友！你救了我之后，我一直在为你勘探地道。',
                    '我的铲子找不到了，好像是在 22 层的暗道深处遗落了……你能帮我找回来吗？',
                  ]
                : [
                    'Hey friend! Ever since you rescued me, I have been scouting tunnels for you.',
                    'I lost my shovel, I think I dropped it deep in the secret passages of Floor 22... Could you help me find it?',
                  ])),
      currentIndex: 0,
    };
  }

  // 2.5 特殊 26F 假公主（揭露魔王骗局）
  if (npcId === 'princess' && floorNum === 26) {
    return {
      name: lang === 'zh' ? '假公主（魔王幻象）' : 'Fake Princess (Illusion)',
      avatar: '👸',
      lines: lang === 'zh'
        ? [
            '桀桀桀……愚蠢的勇士，你真以为我是真正的公主吗？！',
            '真正的公主早就被魔王大人带去了 50 层魔塔之巅！我不过是引诱你踏入陷阱的幻象！有胆量就去 50 层受死吧！',
          ]
        : [
            'Hahaha... Foolish warrior, did you truly believe I was the real princess?!',
            'The true princess has long been taken by Demon Lord Zeno to the 50F summit! I am merely an illusion to lure you into despair! Face your doom on Floor 50!',
          ],
      currentIndex: 0,
    };
  }

  // 3. 特殊商人（神秘商人）
  if ((npcId === 'trader' || npcId === 'merchant') && floorNum && TRADER_FLOOR_OFFERS[floorNum]) {
    const offer = TRADER_FLOOR_OFFERS[floorNum];
    const lines = isTraderBought ? offer.linesAlreadyBought[lang] : offer.linesBefore[lang];
    return {
      name: lang === 'zh' ? '神秘商人' : 'Mysterious Merchant',
      avatar: '👳',
      lines,
      currentIndex: 0,
      trade: isTraderBought
        ? undefined
        : {
            tradeId: offer.tradeId,
            costGold: offer.costGold,
            title: offer.title[lang],
            isBought: false,
          },
    };
  }

  // 4. 特殊智慧老人（按层区分线索与赠与）
  if ((npcId === 'elder' || npcId === 'old_man') && floorNum && ELDER_FLOOR_DIALOGUES[floorNum]) {
    const elderCfg = ELDER_FLOOR_DIALOGUES[floorNum];
    const lines = hasElderGift && elderCfg.linesAfterGift ? elderCfg.linesAfterGift[lang] : elderCfg.lines[lang];
    return {
      name: elderCfg.name ? elderCfg.name[lang] : (lang === 'zh' ? '智慧老人' : 'Wise Sage'),
      avatar: '🧙‍♂️',
      lines,
      currentIndex: 0,
    };
  }

  // 5. 标准 NPC 配置
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
    return {
      text: lang === 'zh'
        ? (params.gold ? `未受到伤害！+${params.gold}G` : '未受到伤害！')
        : (params.gold ? `No damage taken! +${params.gold}G` : 'No damage taken!'),
      color: '#22c55e',
    };
  }
  if (type === 'win_damage') {
    return { text: `-${params.damage} HP  +${params.gold}G`, color: '#ef4444' };
  }
  if (type === 'boss_skeleton') {
    return { text: lang === 'zh' ? '骷髅队长陨落！一区通关！' : 'Skeleton Captain fallen! Zone 1 Cleared!', color: '#facc15' };
  }
  if (type === 'boss_vampire') {
    return {
      text: lang === 'zh'
        ? '吸血鬼伯爵消灭！二区通关，通往 21 层的铁门开启！'
        : 'Vampire Lord defeated! Zone 2 cleared, the iron gate opens!',
      color: '#facc15',
    };
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
    神圣之盾: { zh: '神圣之盾', en: 'Sacred Shield' },
    神圣神盾: { zh: '神圣之盾', en: 'Sacred Shield' },
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

export const translations = TRANSLATIONS;
