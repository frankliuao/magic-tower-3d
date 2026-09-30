// src/ui/Sidebar.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { MoveCommand } from '../types/game';
import { useI18n, getFloorName, getEquipName } from '../i18n';
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
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  game: GameState;
  onMove: (cmd: MoveCommand) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ game, onMove }) => {
  const { lang, t } = useI18n();
  const { playerStats, currentFloor } = game;
  const floorData = game.getCurrentFloorData();
  const displayedFloorName = getFloorName(currentFloor, lang, floorData.name);

  return (
    <aside className="w-72 bg-slate-900/95 text-slate-100 border-r border-slate-700/80 p-4 flex flex-col justify-between select-none shadow-2xl backdrop-blur-md z-20">
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
          <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
            {playerStats.inventory.monster_manual ? (
              <span className="px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-500/50 rounded text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {t.relicManual}
              </span>
            ) : null}
            {playerStats.inventory.compass ? (
              <span className="px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-500/50 rounded text-[10px] text-cyan-300 font-medium flex items-center gap-1">
                <Compass className="w-3 h-3" /> {t.relicCompass}
              </span>
            ) : null}
            {playerStats.inventory.cross ? (
              <span className="px-1.5 py-0.5 bg-yellow-950/60 border border-yellow-500/50 rounded text-[10px] text-yellow-300 font-medium flex items-center gap-1">
                <Cross className="w-3 h-3" /> {t.relicCross}
              </span>
            ) : null}
            {!playerStats.inventory.monster_manual &&
              !playerStats.inventory.compass &&
              !playerStats.inventory.cross && (
                <span className="text-[11px] text-slate-500 italic">{t.noRelics}</span>
              )}
          </div>
        </div>
      </div>

      {/* 虚拟方向控制手柄 (移动端与便捷点击) */}
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
    </aside>
  );
};
