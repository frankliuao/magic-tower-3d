// src/ui/MobileBottomDock.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { Direction } from '../types/game';
import { useI18n, getFloorName } from '../i18n';
import { VirtualJoystick } from './VirtualJoystick';
import {
  Menu,
  Heart,
  Sword,
  Shield,
  Coins,
  Key,
  Target,
  BookOpen,
  Compass,
  Coffee,
  Save,
  RotateCcw,
  Languages,
} from 'lucide-react';

interface MobileBottomDockProps {
  game: GameState;
  onMove: (dir: Direction) => void;
  getYaw: () => number;
  onResetCamera: () => void;
  onOpenDrawer: () => void;
  onOpenCoffeeModal: () => void;
  onQuickSave: () => void;
  onQuickLoad: () => void;
  onOpenManual?: () => void;
  onOpenTeleport?: () => void;
  disabled?: boolean;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  game,
  onMove,
  getYaw,
  onResetCamera,
  onOpenDrawer,
  onOpenCoffeeModal,
  onQuickSave,
  onQuickLoad,
  onOpenManual,
  onOpenTeleport,
  disabled = false,
}) => {
  const { lang, toggleLang, t } = useI18n();
  const { playerStats, currentFloor } = game;
  const floorData = game.getCurrentFloorData();
  const displayedFloorName = getFloorName(currentFloor, lang, floorData.name);

  const hasManual = Boolean(playerStats.inventory.monster_manual);
  const hasCompass = Boolean(playerStats.inventory.compass);

  return (
    <footer className="w-full bg-slate-950/95 border-t border-slate-800/90 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl z-20 shrink-0 select-none px-2.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex flex-col gap-1.5">
      {/* 顶部全宽功能与状态导航条 (Top Utility Toolbar) */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2.5">
        {/* 左侧：楼层标识徽章 (宽度与下方摇杆右边缘严格对齐，充分利用空间) */}
        <div className="w-28 sm:w-32 shrink-0 flex items-center">
          <span
            className="w-full px-2 py-1 bg-amber-500/15 border border-amber-500/40 rounded-lg text-amber-300 font-extrabold text-xs font-mono drop-shadow truncate text-center flex items-center justify-center gap-1 shadow-sm"
            title={displayedFloorName}
          >
            <span className="text-[11px] opacity-80 shrink-0">🏰</span>
            <span className="truncate">{displayedFloorName}</span>
          </span>
        </div>

        {/* 右侧：存档、读档、语言切换、视角复位、咖啡与菜单抽屉 */}
        <div className="flex-1 min-w-0 flex items-center justify-end gap-1 overflow-x-auto no-scrollbar">
          {/* 存档按钮 */}
          <button
            type="button"
            onClick={onQuickSave}
            className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/60 rounded-lg text-xs font-bold text-indigo-300 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
            title={t.saveBtn}
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.saveBtn}</span>
          </button>

          {/* 读档按钮 */}
          <button
            type="button"
            onClick={onQuickLoad}
            className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 rounded-lg text-xs font-bold text-sky-300 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
            title={t.loadBtn}
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.loadBtn}</span>
          </button>

          {/* 语言切换按钮 (中 / EN) */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-950/70 to-slate-900 hover:from-amber-900/80 border border-amber-500/60 rounded-lg text-xs font-bold text-amber-300 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
            title={t.langToggleTip}
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'zh' ? 'EN' : '中文'}</span>
          </button>

          {/* 视角复位 */}
          <button
            type="button"
            onClick={onResetCamera}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 rounded-lg text-sky-400 active:scale-90 transition-all cursor-pointer shadow-sm shrink-0"
            title={t.spaceResetBtnTitle}
          >
            <Target className="w-3.5 h-3.5 text-sky-400" />
          </button>

          {/* 请喝咖啡 */}
          <button
            type="button"
            onClick={onOpenCoffeeModal}
            className="p-1.5 bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 border border-amber-400/80 rounded-lg text-amber-100 active:scale-95 transition-all cursor-pointer shadow shrink-0"
            title={t.coffeeTip}
          >
            <Coffee className="w-3.5 h-3.5 text-amber-200" />
          </button>

          {/* 抽屉菜单 */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-lg text-amber-400 active:scale-90 transition-all cursor-pointer shadow-sm shrink-0"
            title="菜单 (Menu)"
          >
            <Menu className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 主体操作与数值区 (Main Joystick & Stats Panel) */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2.5">
        {/* 左侧：虚拟触控摇杆 (居中自适应) */}
        <div className="shrink-0 flex items-center justify-center">
          <VirtualJoystick onMove={onMove} getYaw={getYaw} disabled={disabled} />
        </div>

        {/* 右侧：楼层、属性数值与核心快捷操作面板 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
          {/* 第 1 行：HP (生命) 与 金币 (Gold) */}
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-rose-500/30 rounded-lg px-2 py-1 shadow-inner">
              <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-rose-400 shrink-0" />
              <span className="font-extrabold text-rose-300 truncate">{playerStats.hp}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-yellow-500/30 rounded-lg px-2 py-1 shadow-inner">
              <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="font-extrabold text-yellow-300 truncate">{playerStats.gold}</span>
            </div>
          </div>

          {/* 第 2 行：ATK (攻击) 与 DEF (防御) */}
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-orange-500/30 rounded-lg px-2 py-1 shadow-inner">
              <Sword className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-extrabold text-orange-300 truncate">{playerStats.atk}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-sky-500/30 rounded-lg px-2 py-1 shadow-inner">
              <Shield className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-extrabold text-sky-300 truncate">{playerStats.def}</span>
            </div>
          </div>

          {/* 第 3 行：黄、蓝、红钥匙 + 罗盘与怪物手册徽章 */}
          <div className="flex items-center justify-between gap-1 bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono shadow-inner">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-yellow-400" title={t.yellowKey}>
                <Key className="w-3 h-3 text-yellow-400 shrink-0" />
                <span className="font-bold text-yellow-300">{playerStats.yellowKeys}</span>
              </div>
              <div className="flex items-center gap-0.5 text-blue-400" title={t.blueKey}>
                <Key className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="font-bold text-blue-300">{playerStats.blueKeys}</span>
              </div>
              <div className="flex items-center gap-0.5 text-red-400" title={t.redKey}>
                <Key className="w-3 h-3 text-red-400 shrink-0" />
                <span className="font-bold text-red-300">{playerStats.redKeys}</span>
              </div>
            </div>

            {/* 冒险道具徽章：罗盘与手册 */}
            <div className="flex items-center gap-1 shrink-0">
              {hasCompass && (
                <button
                  type="button"
                  onClick={onOpenTeleport}
                  className="p-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded text-cyan-300 active:scale-90 transition-all cursor-pointer"
                  title={t.floorJumpBtn}
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}

              {hasManual && (
                <button
                  type="button"
                  onClick={onOpenManual}
                  className="p-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 rounded text-emerald-300 active:scale-90 transition-all cursor-pointer"
                  title={t.monsterManualBtn}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
