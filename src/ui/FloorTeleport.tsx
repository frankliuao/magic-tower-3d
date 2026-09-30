// src/ui/FloorTeleport.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { getFloor } from '../data/floors';
import { Compass, X, ArrowUpRight } from 'lucide-react';
import { useI18n, getFloorName } from '../i18n';

interface FloorTeleportProps {
  game: GameState;
  onClose: () => void;
  onTeleport: (floor: number) => void;
}

export const FloorTeleport: React.FC<FloorTeleportProps> = ({ game, onClose, onTeleport }) => {
  const { lang, t } = useI18n();
  const explored = Array.from(game.exploredFloors).sort((a, b) => b - a);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950/80 border border-cyan-500/50 rounded-xl">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100">{t.teleportTitle}</h2>
              <p className="text-xs text-slate-400">{t.teleportSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 楼层网格 */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
          {explored.map((fNum) => {
            const fData = getFloor(fNum);
            const isCurrent = fNum === game.currentFloor;
            const localizedFloorName = getFloorName(fNum, lang, fData.name);

            return (
              <button
                key={fNum}
                onClick={() => {
                  onTeleport(fNum);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/50'
                    : 'bg-slate-800/70 hover:bg-slate-700 border-slate-700 hover:border-cyan-500/50 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-base font-mono">{fNum}F</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {localizedFloorName.replace(/^\d+F\s*/, '')}
                </div>
              </button>
            );
          })}
        </div>

        {/* 底部 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            {t.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
