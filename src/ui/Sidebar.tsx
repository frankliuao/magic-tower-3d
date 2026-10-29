// src/ui/Sidebar.tsx
import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { MoveCommand } from '../types/game';
import { useI18n, getFloorName, getEquipName } from '../i18n';
import { sound } from '../audio/sound';
import {
  Heart,
  Shield,
  Sword,
  Coins,
  Sparkles,
  Key,
  Compass,
  BookOpen,
  Cross,
  Zap,
  ArrowUpCircle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  RotateCcw,
  Volume2,
  VolumeX,
  Music2,
  Languages,
} from 'lucide-react';

interface SidebarProps {
  game: GameState;
  onMove: (cmd: MoveCommand) => void;
  onOpenManual?: () => void;
  onOpenTeleport?: () => void;
  onUseCenterFly?: () => void;
  onUseUpFly?: () => void;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
  onQuickSave?: () => void;
  onQuickLoad?: () => void;
  onRestart?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  game,
  onMove,
  onOpenManual,
  onOpenTeleport,
  onUseCenterFly,
  onUseUpFly,
  isDrawer = false,
  onCloseDrawer,
  onQuickSave,
  onQuickLoad,
  onRestart,
  className = '',
}) => {
  const { lang, toggleLang, t } = useI18n();
  const { playerStats, currentFloor } = game;
  const floorData = game.getCurrentFloorData();
  const displayedFloorName = getFloorName(currentFloor, lang, floorData.name);

  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [bgmEnabled, setBgmEnabled] = useState(sound.bgmEnabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  };

  const toggleBgm = () => {
    const on = sound.toggleBGM();
    setBgmEnabled(on);
  };

  return (
    <aside
      className={`bg-slate-900/95 text-slate-100 p-4 flex flex-col justify-between select-none shadow-2xl backdrop-blur-md z-20 ${
        isDrawer
          ? 'w-full h-full overflow-y-auto'
          : 'w-72 border-r border-slate-700/80'
      } ${className}`}
    >
      {/* 抽屉模式顶部标题与关闭按钮 */}
      {isDrawer && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏰</span>
            <span className="font-extrabold text-amber-400 text-sm tracking-wide">
              {t.gameTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseDrawer}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="关闭 (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 楼层标识 */}
      <div>
        <div className="bg-gradient-to-r from-amber-600/30 to-amber-900/40 border border-amber-500/50 rounded-lg p-3 mb-4 text-center shadow-inner">
          <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            {t.towerSubtitle}
          </div>
          <div className="text-xl font-black text-amber-400 mt-0.5 tracking-wide drop-shadow">
            {displayedFloorName}
          </div>
        </div>

        {/* 勇士属性面板 */}
        <div className="space-y-2.5 bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow">
          {/* 生命值 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500 stroke-rose-400" />
              {t.hp}
            </span>
            <span className="font-mono font-bold text-rose-300 text-sm tracking-wider">
              {playerStats.hp}
            </span>
          </div>

          {/* 攻击力 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
              <Sword className="w-4 h-4 text-orange-400" />
              {t.atk}
            </span>
            <span className="font-mono font-bold text-orange-300 text-sm tracking-wider">
              {playerStats.atk}
            </span>
          </div>

          {/* 防御力 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
              <Shield className="w-4 h-4 text-sky-400" />
              {t.def}
            </span>
            <span className="font-mono font-bold text-sky-300 text-sm tracking-wider">
              {playerStats.def}
            </span>
          </div>

          {/* 金币 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-400">
              <Coins className="w-4 h-4 text-yellow-400" />
              {t.gold}
            </span>
            <span className="font-mono font-bold text-yellow-300 text-sm tracking-wider">
              {playerStats.gold} G
            </span>
          </div>

          {/* 经验 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {t.exp}
            </span>
            <span className="font-mono font-bold text-emerald-300 text-sm tracking-wider">
              {playerStats.exp}
            </span>
          </div>
        </div>

        {/* 钥匙库存 */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {/* 黄钥匙 */}
          <div className="bg-yellow-950/40 border border-yellow-600/40 rounded-lg p-2 text-center flex flex-col items-center">
            <Key className="w-4 h-4 text-yellow-400 mb-0.5" />
            <span className="text-[10px] text-yellow-300 font-medium">{t.yellowKey}</span>
            <span className="font-mono font-bold text-yellow-200 text-base">
              {playerStats.yellowKeys}
            </span>
          </div>

          {/* 蓝钥匙 */}
          <div className="bg-blue-950/40 border border-blue-600/40 rounded-lg p-2 text-center flex flex-col items-center">
            <Key className="w-4 h-4 text-blue-400 mb-0.5" />
            <span className="text-[10px] text-blue-300 font-medium">{t.blueKey}</span>
            <span className="font-mono font-bold text-blue-200 text-base">
              {playerStats.blueKeys}
            </span>
          </div>

          {/* 红钥匙 */}
          <div className="bg-red-950/40 border border-red-600/40 rounded-lg p-2 text-center flex flex-col items-center">
            <Key className="w-4 h-4 text-red-400 mb-0.5" />
            <span className="text-[10px] text-red-300 font-medium">{t.redKey}</span>
            <span className="font-mono font-bold text-red-200 text-base">
              {playerStats.redKeys}
            </span>
          </div>
        </div>

        {/* 装备与神器栏 */}
        <div className="mt-3 bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.equipAndRelics}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.weapon}</span>
            <span className="font-semibold text-amber-300">
              {getEquipName(playerStats.weapon, lang)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.shield}</span>
            <span className="font-semibold text-sky-300">
              {getEquipName(playerStats.shield, lang)}
            </span>
          </div>
          {playerStats.inventory.cross ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-700/60">
              <span className="px-1.5 py-0.5 bg-yellow-950/60 border border-yellow-500/50 rounded text-[10px] text-yellow-300 font-medium flex items-center gap-1">
                <Cross className="w-3 h-3" /> {t.relicCross}
              </span>
            </div>
          ) : null}
          {/* 神器与秘宝快捷操作区：怪物手册、楼层跳跃、中心飞行器 */}
          <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              {/* 怪物手册 */}
              <button
                type="button"
                onClick={() => {
                  onOpenManual?.();
                  if (isDrawer) onCloseDrawer?.();
                }}
                className="py-1.5 px-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 rounded-lg text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5 shadow transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                title={`${t.monsterManualBtn} (L)`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{t.monsterManualBtn}</span>
              </button>

              {/* 楼层跳跃 */}
              <button
                type="button"
                onClick={() => {
                  onOpenTeleport?.();
                  if (isDrawer) onCloseDrawer?.();
                }}
                className="py-1.5 px-2 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/60 rounded-lg text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 shadow transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                title={`${t.floorJumpBtn} (G)`}
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{t.floorJumpBtn}</span>
              </button>
            </div>

            {/* 时空飞行器 (拥有时显现) */}
            {playerStats.inventory.center_fly ? (
              <button
                type="button"
                onClick={() => {
                  onUseCenterFly?.();
                  if (isDrawer) onCloseDrawer?.();
                }}
                title={lang === 'zh' ? '点击使用【时空飞行器】(一次性消耗品，点击后可瞬移至当前楼层任意通畅地面)' : 'Click to use [Chrono Flyer] (One-time consumable, teleport to any open floor tile on current level)'}
                className="w-full py-2 px-3 bg-gradient-to-r from-purple-900/90 via-fuchsia-950/80 to-purple-900/90 hover:from-purple-800 hover:to-fuchsia-900 border border-purple-400/80 rounded-lg text-xs text-purple-200 font-bold flex items-center justify-between shadow-md hover:shadow-purple-500/25 active:scale-[0.98] cursor-pointer transition-all ring-1 ring-purple-400/40"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-300 animate-pulse shrink-0" />
                  <span className="tracking-wide">{lang === 'zh' ? '使用时空飞行器' : 'Use Chrono Flyer'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-normal">
                  {lang === 'zh' ? '一次性' : '1x Use'}
                </span>
              </button>
            ) : null}

            {/* 向上飞行器 (拥有时显现) */}
            {playerStats.inventory.up_fly ? (
              <button
                type="button"
                onClick={() => {
                  onUseUpFly?.();
                  if (isDrawer) onCloseDrawer?.();
                }}
                title={lang === 'zh' ? '点击使用【向上飞行器】(一次性消耗品，使勇士瞬间上升一层)' : 'Click to use [Up Flyer] (One-time consumable, elevates hero up one floor)'}
                className="w-full py-2 px-3 bg-gradient-to-r from-indigo-900/90 via-violet-950/80 to-indigo-900/90 hover:from-indigo-800 hover:to-violet-900 border border-indigo-400/80 rounded-lg text-xs text-indigo-200 font-bold flex items-center justify-between shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] cursor-pointer transition-all ring-1 ring-indigo-400/40"
              >
                <div className="flex items-center gap-1.5">
                  <ArrowUpCircle className="w-4 h-4 text-indigo-300 animate-pulse shrink-0" />
                  <span className="tracking-wide">{lang === 'zh' ? '使用向上飞行器' : 'Use Up Flyer'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-normal">
                  {lang === 'zh' ? '一次性' : '1x Use'}
                </span>
              </button>
            ) : null}
          </div>
        </div>

        {/* 抽屉模式下补充快捷菜单控制栏：存读档、音效音乐、语言、重开 */}
        {isDrawer && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'zh' ? '游戏管理与系统设置' : 'Settings & Controls'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onQuickSave?.();
                  onCloseDrawer?.();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.saveBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickLoad?.();
                  onCloseDrawer?.();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl text-xs font-bold text-sky-300 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.loadBtn}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* 音效开关 */}
              <button
                type="button"
                onClick={toggleSound}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 transition-all cursor-pointer"
                title={soundEnabled ? t.muteTip : t.unmuteTip}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-green-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-[10px]">{soundEnabled ? t.sfxOn : t.sfxOff}</span>
              </button>

              {/* 音乐开关 */}
              <button
                type="button"
                onClick={toggleBgm}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 transition-all cursor-pointer"
                title={bgmEnabled ? t.bgmMuteTip : t.bgmUnmuteTip}
              >
                <Music2 className={`w-4 h-4 ${bgmEnabled ? 'text-green-400' : 'text-slate-500'}`} />
                <span className="text-[10px]">{bgmEnabled ? t.bgmOn : t.bgmOff}</span>
              </button>

              {/* 语言切换 */}
              <button
                type="button"
                onClick={toggleLang}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-amber-300 font-bold transition-all cursor-pointer"
                title={t.langToggleTip}
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px]">{lang === 'zh' ? 'EN' : '中文'}</span>
              </button>
            </div>

            {/* 重新开始 */}
            <button
              type="button"
              onClick={() => {
                onCloseDrawer?.();
                onRestart?.();
              }}
              className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-600/40 rounded-xl text-xs font-bold text-rose-300 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.restartTip}</span>
            </button>
          </div>
        )}
      </div>

      {/* 桌面端虚拟十字方向键 (仅在非抽屉模式下渲染) */}
      {!isDrawer && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col items-center">
          <div className="text-[10px] text-slate-400 mb-2 font-medium flex items-center justify-between w-full px-1">
            <span>{t.moveControls}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">
              {t.arrowKeysHint}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 w-40">
            <div />
            <button
              onClick={() => onMove('up')}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex flex-col items-center justify-center border border-slate-600 shadow transition-all active:scale-95 group"
              title={t.up}
            >
              <ChevronUp className="w-5 h-5 text-slate-200 group-hover:text-amber-300" />
              <span className="text-[9px] text-amber-400 font-bold -mt-0.5">{t.up}</span>
            </button>
            <div />
            <button
              onClick={() => onMove('left')}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex flex-col items-center justify-center border border-slate-600 shadow transition-all active:scale-95 group"
              title={t.left}
            >
              <ChevronLeft className="w-5 h-5 text-slate-200 group-hover:text-amber-300" />
              <span className="text-[9px] text-amber-400 font-bold -mt-0.5">{t.left}</span>
            </button>
            <button
              onClick={() => onMove('down')}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex flex-col items-center justify-center border border-slate-600 shadow transition-all active:scale-95 group"
              title={t.down}
            >
              <ChevronDown className="w-5 h-5 text-slate-200 group-hover:text-amber-300" />
              <span className="text-[9px] text-amber-400 font-bold -mt-0.5">{t.down}</span>
            </button>
            <button
              onClick={() => onMove('right')}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg flex flex-col items-center justify-center border border-slate-600 shadow transition-all active:scale-95 group"
              title={t.right}
            >
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-amber-300" />
              <span className="text-[9px] text-amber-400 font-bold -mt-0.5">{t.right}</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

