// src/ui/ExpShopModal.tsx
import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { Sparkles, Heart, Sword, Shield, LogOut, Award, Check, X, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';

interface ExpShopModalProps {
  game: GameState;
  onClose: () => void;
  onBuy: (type: 'hp' | 'atk' | 'def' | 'level') => void;
}

export const ExpShopModal: React.FC<ExpShopModalProps> = ({ game, onClose, onBuy }) => {
  const { t } = useI18n();
  const [pendingConfirm, setPendingConfirm] = useState<'hp' | 'atk' | 'def' | 'level' | null>(null);

  const gain = game.getExpUpgradeGain();
  const currentExp = game.playerStats.exp;

  const options: Array<{
    type: 'level' | 'atk' | 'def' | 'hp';
    cost: number;
    label: string;
    gainSummary: string;
    detailSub?: string;
    icon: React.ReactNode;
    bgActive: string;
    borderActive: string;
    textActive: string;
    gainColor: string;
  }> = [
    {
      type: 'level',
      cost: gain.costLevel,
      label: t.expUpgradeLevel,
      gainSummary: `+Lv & +${gain.levelGain.hp} HP / +${gain.levelGain.atk} ${t.unitAtk} / +${gain.levelGain.def} ${t.unitDef}`,
      detailSub: `+${gain.levelGain.hp} HP / +${gain.levelGain.atk} ${t.unitAtk} / +${gain.levelGain.def} ${t.unitDef}`,
      icon: <Award className="w-5 h-5 text-amber-400" />,
      bgActive: 'bg-amber-950/50 hover:bg-amber-900/60',
      borderActive: 'border-amber-500/50',
      textActive: 'text-amber-200',
      gainColor: 'text-amber-300',
    },
    {
      type: 'atk',
      cost: gain.costAtk,
      label: t.expUpgradeAtk,
      gainSummary: `+${gain.atk} ATK`,
      icon: <Sword className="w-5 h-5 text-orange-400" />,
      bgActive: 'bg-orange-950/50 hover:bg-orange-900/60',
      borderActive: 'border-orange-500/50',
      textActive: 'text-orange-200',
      gainColor: 'text-orange-300',
    },
    {
      type: 'def',
      cost: gain.costDef,
      label: t.expUpgradeDef,
      gainSummary: `+${gain.def} DEF`,
      icon: <Shield className="w-5 h-5 text-sky-400" />,
      bgActive: 'bg-sky-950/50 hover:bg-sky-900/60',
      borderActive: 'border-sky-500/50',
      textActive: 'text-sky-200',
      gainColor: 'text-sky-300',
    },
    {
      type: 'hp',
      cost: gain.costHp,
      label: t.expUpgradeHp,
      gainSummary: `+${gain.hp} HP`,
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      bgActive: 'bg-rose-950/50 hover:bg-rose-900/60',
      borderActive: 'border-rose-500/50',
      textActive: 'text-rose-200',
      gainColor: 'text-rose-300',
    },
  ];

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
            {options.map((opt) => {
              const canAfford = currentExp >= opt.cost;
              const isConfirming = canAfford && pendingConfirm === opt.type;

              return (
                <div key={opt.type} className="relative group">
                  {/* 当经验不足时悬停提示 Tooltip */}
                  {!canAfford && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/95 border border-rose-500/70 text-rose-300 text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-20 whitespace-nowrap flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{t.tipNotEnoughExp} ({opt.cost} EXP)</span>
                    </div>
                  )}

                  {isConfirming ? (
                    /* 确认加点状态卡片 */
                    <div className="w-full p-3 rounded-xl border-2 border-emerald-400/90 bg-gradient-to-r from-emerald-950/90 to-slate-900 shadow-xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                          {opt.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                            <span>{t.expConfirmPrompt}</span>
                            <span className="text-white font-extrabold">{opt.label}</span>
                          </div>
                          <div className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
                            {opt.gainSummary} · -{opt.cost} EXP
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onBuy(opt.type);
                            setPendingConfirm(null);
                          }}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1 transition-all cursor-pointer ring-1 ring-emerald-300/50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {t.confirmBtn}
                        </button>
                        <button
                          onClick={() => setPendingConfirm(null)}
                          className="px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-600 active:scale-95 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition-all cursor-pointer border border-slate-600 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          {t.cancelBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 常规状态（足额可点击进入确认，不足时 gray out） */
                    <button
                      disabled={!canAfford}
                      title={!canAfford ? `${t.tipNotEnoughExp} (${opt.cost} EXP)` : undefined}
                      onClick={() => {
                        if (canAfford) {
                          setPendingConfirm(opt.type);
                        }
                      }}
                      className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        canAfford
                          ? `${opt.bgActive} ${opt.borderActive} ${opt.textActive} hover:scale-[1.02] active:scale-[0.98] cursor-pointer`
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-500 opacity-40 grayscale cursor-not-allowed select-none'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {opt.icon}
                        <div className="text-left">
                          <div className="font-bold text-sm">{opt.label}</div>
                          {opt.detailSub && (
                            <div className="text-[10px] text-amber-300/80">
                              {opt.detailSub}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold text-sm ${canAfford ? opt.gainColor : 'text-slate-500'}`}>
                          {opt.type === 'level' ? '' : opt.gainSummary}
                        </span>
                        <span
                          className={`font-mono text-xs font-semibold ${
                            canAfford ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {opt.cost} EXP
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部退出 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3.5 flex justify-end">
          <button
            onClick={() => {
              setPendingConfirm(null);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t.expShopLeave}
          </button>
        </div>
      </div>
    </div>
  );
};
