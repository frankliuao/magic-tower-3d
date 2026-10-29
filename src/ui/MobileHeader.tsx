// src/ui/MobileHeader.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { useI18n, getFloorName } from '../i18n';
import {
  Menu,
  Heart,
  Sword,
  Shield,
  Coins,
  Key,
  Coffee,
  BookOpen,
  Compass,
} from 'lucide-react';

interface MobileHeaderProps {
  game: GameState;
  onOpenDrawer: () => void;
  onOpenCoffeeModal: () => void;
  onOpenManual?: () => void;
  onOpenTeleport?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  game,
  onOpenDrawer,
  onOpenCoffeeModal,
  onOpenManual,
  onOpenTeleport,
}) => {
  const { lang, t } = useI18n();
  const { playerStats, currentFloor } = game;
  const floorData = game.getCurrentFloorData();
  const displayedFloorName = getFloorName(currentFloor, lang, floorData.name);

  return (
    <header className="h-12 bg-slate-900/95 border-b border-slate-700/80 px-2.5 flex items-center justify-between backdrop-blur-md z-30 shadow-md select-none shrink-0 w-full text-slate-100">
      {/* 左侧：菜单抽屉展开按钮与当前楼层 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg text-amber-400 border border-slate-700 flex items-center gap-1 shadow cursor-pointer transition-all active:scale-95"
          title="展开属性与菜单 (Menu)"
        >
          <Menu className="w-4 h-4 text-amber-400" />
        </button>

        <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/40 rounded-lg text-amber-300 font-extrabold text-xs font-mono drop-shadow truncate max-w-[90px]">
          {displayedFloorName}
        </span>
      </div>

      {/* 中部：核心关键数值快速预览 (血量 / 攻防 / 金币 / 钥匙) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-mono">
        {/* 血量 */}
        <div className="flex items-center gap-0.5 text-rose-400 font-bold" title={t.hp}>
          <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-rose-400 shrink-0" />
          <span>{playerStats.hp}</span>
        </div>

        {/* 攻防 */}
        <div className="flex items-center gap-1 text-slate-300">
          <span className="flex items-center text-orange-400 font-bold" title={t.atk}>
            <Sword className="w-3.5 h-3.5 shrink-0" />
            <span>{playerStats.atk}</span>
          </span>
          <span className="flex items-center text-sky-400 font-bold" title={t.def}>
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>{playerStats.def}</span>
          </span>
        </div>

        {/* 金币 */}
        <div className="flex items-center gap-0.5 text-yellow-400 font-bold" title={t.gold}>
          <Coins className="w-3.5 h-3.5 shrink-0" />
          <span>{playerStats.gold}</span>
        </div>

        {/* 钥匙集锦 */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-700/80">
          <span className="text-yellow-300 font-bold flex items-center gap-0.5" title={t.yellowKey}>
            <Key className="w-3 h-3 text-yellow-400 shrink-0" />
            <span>{playerStats.yellowKeys}</span>
          </span>
          <span className="text-blue-300 font-bold flex items-center gap-0.5" title={t.blueKey}>
            <Key className="w-3 h-3 text-blue-400 shrink-0" />
            <span>{playerStats.blueKeys}</span>
          </span>
          <span className="text-red-300 font-bold flex items-center gap-0.5" title={t.redKey}>
            <Key className="w-3 h-3 text-red-400 shrink-0" />
            <span>{playerStats.redKeys}</span>
          </span>
        </div>
      </div>

      {/* 右侧：快捷道具与打赏咖啡 */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* 怪物手册 (若拥有) */}
        {playerStats.inventory.monster_manual ? (
          <button
            type="button"
            onClick={onOpenManual}
            className="p-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 rounded-lg text-emerald-300 transition-all cursor-pointer"
            title={t.monsterManualBtn}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        ) : null}

        {/* 楼层跳跃罗盘 (若拥有) */}
        {playerStats.inventory.compass ? (
          <button
            type="button"
            onClick={onOpenTeleport}
            className="p-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg text-cyan-300 transition-all cursor-pointer"
            title={t.floorJumpBtn}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        ) : null}

        {/* 请喝咖啡打赏按钮 */}
        <button
          type="button"
          onClick={onOpenCoffeeModal}
          className="p-1.5 bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 hover:to-yellow-500 border border-amber-400/80 rounded-lg text-amber-100 shadow transition-all cursor-pointer"
          title={t.coffeeTip}
        >
          <Coffee className="w-3.5 h-3.5 text-amber-200" />
        </button>
      </div>
    </header>
  );
};
