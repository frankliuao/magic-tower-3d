// src/ui/ExpShopModal.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { Sparkles, Heart, Sword, Shield, LogOut, Award } from 'lucide-react';
import { useI18n } from '../i18n';

interface ExpShopModalProps {
  game: GameState;
  onClose: () => void;
  onBuy: (type: 'hp' | 'atk' | 'def' | 'level') => void;
}

export const ExpShopModal: React.FC<ExpShopModalProps> = ({ game, onClose, onBuy }) => {
  const { t } = useI18n();
  const gain = game.getExpUpgradeGain();
  const currentExp = game.playerStats.exp;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 顶部经验宗师标志 */}
        <div className="bg-gradient-to-b from-emerald-950/80 to-slate-900 p-6 text-center border-b border-emerald-500/30">
          <div className="w-14 h-14 mx-auto mb-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full flex items-center justify-center shadow-inner">
            <Award className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-black text-emerald-300 drop-shadow">{t.expShopTitle}</h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            {t.expShopSubtitle}
          </p>
        </div>

        {/* 经验值状态栏 */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {t.expCurrent}
              <span className="font-bold text-emerald-300 font-mono text-sm">
                {currentExp} EXP
              </span>
            </div>
            <div className="text-right text-slate-400 text-[11px]">
              {t.expShopSubtitleDetail}
            </div>
          </div>

          {/* 加点选项列表 */}
          <div className="space-y-2.5">
            {/* 境界突破 / 等级提升 */}
            <button
              disabled={currentExp < gain.costLevel}
              onClick={() => onBuy('level')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                currentExp >= gain.costLevel
                  ? 'bg-amber-950/50 hover:bg-amber-900/60 border-amber-500/50 text-amber-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="font-bold text-sm">{t.expUpgradeLevel}</div>
                  <div className="text-[10px] text-amber-300/80">
                    +{gain.levelGain.hp} HP / +{gain.levelGain.atk} {t.unitAtk} / +{gain.levelGain.def} {t.unitDef}
                  </div>
                </div>
              </div>
              <span
                className={`font-mono font-bold text-sm ${
                  currentExp >= gain.costLevel ? 'text-amber-300' : 'text-slate-500'
                }`}
              >
                {gain.costLevel} EXP
              </span>
            </button>

            {/* 提升攻击 */}
            <button
              disabled={currentExp < gain.costAtk}
              onClick={() => onBuy('atk')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                currentExp >= gain.costAtk
                  ? 'bg-orange-950/50 hover:bg-orange-900/60 border-orange-500/50 text-orange-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sword className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-sm">{t.expUpgradeAtk}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-orange-300 text-sm">+{gain.atk} ATK</span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    currentExp >= gain.costAtk ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {gain.costAtk} EXP
                </span>
              </div>
            </button>

            {/* 提升防御 */}
            <button
              disabled={currentExp < gain.costDef}
              onClick={() => onBuy('def')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                currentExp >= gain.costDef
                  ? 'bg-sky-950/50 hover:bg-sky-900/60 border-sky-500/50 text-sky-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-sm">{t.expUpgradeDef}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sky-300 text-sm">+{gain.def} DEF</span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    currentExp >= gain.costDef ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {gain.costDef} EXP
                </span>
              </div>
            </button>

            {/* 提升生命 */}
            <button
              disabled={currentExp < gain.costHp}
              onClick={() => onBuy('hp')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                currentExp >= gain.costHp
                  ? 'bg-rose-950/50 hover:bg-rose-900/60 border-rose-500/50 text-rose-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-sm">{t.expUpgradeHp}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-rose-300 text-sm">+{gain.hp} HP</span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    currentExp >= gain.costHp ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {gain.costHp} EXP
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 底部退出 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t.expShopLeave}
          </button>
        </div>
      </div>
    </div>
  );
};
