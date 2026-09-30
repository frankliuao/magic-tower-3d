// src/ui/DebugPanel.tsx
import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { Wrench, X, Shield, Key, Coins, Zap, FastForward, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n';

interface DebugPanelProps {
  game: GameState;
  onClose: () => void;
  onJumpFloor: (floor: number) => void;
  onClearMonsters: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  game,
  onClose,
  onJumpFloor,
  onClearMonsters,
}) => {
  const { t } = useI18n();
  const [targetFloor, setTargetFloor] = useState<number>(game.currentFloor);

  const addStats = () => {
    game.playerStats.hp += 2000;
    game.playerStats.atk += 100;
    game.playerStats.def += 100;
    game.notify();
  };

  const addKeys = () => {
    game.playerStats.yellowKeys += 10;
    game.playerStats.blueKeys += 5;
    game.playerStats.redKeys += 3;
    game.notify();
  };

  const addGold = () => {
    game.playerStats.gold += 1000;
    game.notify();
  };

  const giveAllArtifacts = () => {
    game.playerStats.inventory.monster_manual = 1;
    game.playerStats.inventory.compass = 1;
    game.playerStats.inventory.cross = 1;
    game.notify();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-purple-500/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-950/80 border border-purple-500/50 rounded-xl">
              <Wrench className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100">{t.debugTitle}</h2>
              <p className="text-xs text-slate-400">{t.debugSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 作弊功能栏 */}
        <div className="p-6 space-y-4 text-xs">
          {/* 属性与物资注入 */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={addStats}
              className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-slate-700 text-left flex items-center gap-2 text-slate-200 transition-all font-semibold"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>{t.debugStats}</span>
            </button>
            <button
              onClick={addKeys}
              className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-slate-700 text-left flex items-center gap-2 text-slate-200 transition-all font-semibold"
            >
              <Key className="w-4 h-4 text-yellow-400" />
              <span>{t.debugKeys}</span>
            </button>
            <button
              onClick={addGold}
              className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-slate-700 text-left flex items-center gap-2 text-slate-200 transition-all font-semibold"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{t.debugGold}</span>
            </button>
            <button
              onClick={giveAllArtifacts}
              className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-slate-700 text-left flex items-center gap-2 text-slate-200 transition-all font-semibold"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{t.debugRelics}</span>
            </button>
          </div>

          {/* 任意跳转楼层 */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <FastForward className="w-4 h-4 text-indigo-400" />
              {t.debugWarpToFloor}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="50"
                value={targetFloor}
                onChange={(e) => setTargetFloor(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-white w-28 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => {
                  onJumpFloor(targetFloor);
                  onClose();
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow transition-all"
              >
                {t.debugWarpBtn}
              </button>
            </div>
          </div>

          {/* 秒杀当前层怪物 */}
          <button
            onClick={() => {
              onClearMonsters();
              onClose();
            }}
            className="w-full p-3 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 rounded-xl text-rose-200 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {t.debugClearBtn}
          </button>
        </div>

        {/* 底部 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            {t.debugClose}
          </button>
        </div>
      </div>
    </div>
  );
};
