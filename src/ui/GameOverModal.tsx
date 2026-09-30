// src/ui/GameOverModal.tsx
import React, { useEffect } from 'react';
import { GameState } from '../game/gameState';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RotateCcw, RotateCw } from 'lucide-react';
import { useI18n } from '../i18n';

interface GameOverModalProps {
  game: GameState;
  onRestart: () => void;
  onLoadLastSave: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ game, onRestart, onLoadLastSave }) => {
  const { t } = useI18n();
  const isVictory = game.isVictory;

  useEffect(() => {
    if (isVictory) {
      // 触发满屏庆典礼花
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
      const interval = setInterval(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVictory]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div
        className={`bg-slate-900 border-2 rounded-2xl w-full max-w-md p-6 text-center shadow-2xl ${
          isVictory ? 'border-amber-400' : 'border-rose-600'
        }`}
      >
        {isVictory ? (
          <>
            <div className="w-16 h-16 mx-auto mb-3 bg-amber-500/20 border border-amber-400/60 rounded-full flex items-center justify-center">
              <Trophy className="w-9 h-9 text-amber-400 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-amber-300">{t.victoryTitle}</h2>
            <p className="text-xs text-amber-200/80 mt-1 mb-6">
              {t.victoryDesc}
            </p>

            {/* 战绩统分 */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-xs">
              <div className="text-left">
                <span className="text-slate-400">{t.remainingHp}</span>
                <span className="font-bold text-rose-400 font-mono ml-1">
                  {game.playerStats.hp}
                </span>
              </div>
              <div className="text-left">
                <span className="text-slate-400">{t.finalAtk}</span>
                <span className="font-bold text-orange-400 font-mono ml-1">
                  {game.playerStats.atk}
                </span>
              </div>
              <div className="text-left">
                <span className="text-slate-400">{t.finalDef}</span>
                <span className="font-bold text-sky-400 font-mono ml-1">
                  {game.playerStats.def}
                </span>
              </div>
              <div className="text-left">
                <span className="text-slate-400">{t.accumulatedGold}</span>
                <span className="font-bold text-yellow-400 font-mono ml-1">
                  {game.playerStats.gold} G
                </span>
              </div>
            </div>

            <button
              onClick={onRestart}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t.restartVictory}
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-3 bg-rose-500/20 border border-rose-500/60 rounded-full flex items-center justify-center">
              <Skull className="w-9 h-9 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-rose-400">{t.defeatTitle}</h2>
            <p className="text-xs text-rose-300/80 mt-1 mb-6">
              {t.defeatFloorDesc.replace('{floor}', String(game.currentFloor))}
            </p>

            <div className="space-y-2.5">
              <button
                onClick={onLoadLastSave}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm shadow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                {t.loadLastSave}
              </button>
              <button
                onClick={onRestart}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm border border-slate-600 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t.restartGame}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
