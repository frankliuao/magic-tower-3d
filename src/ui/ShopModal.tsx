// src/ui/ShopModal.tsx
import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { Sparkles, Heart, Sword, Shield, LogOut, Coins, Check, X, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';

interface ShopModalProps {
  game: GameState;
  onClose: () => void;
  onBuy: (type: 'hp' | 'atk' | 'def') => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ game, onClose, onBuy }) => {
  const { t } = useI18n();
  const [pendingConfirm, setPendingConfirm] = useState<'hp' | 'atk' | 'def' | null>(null);

  const cost = game.getShopCost();
  const gain = game.getShopGain();
  const canAfford = game.playerStats.gold >= cost;

  const options: Array<{
    type: 'hp' | 'atk' | 'def';
    label: string;
    gainText: string;
    icon: React.ReactNode;
    bgActive: string;
    borderActive: string;
    textActive: string;
    gainColor: string;
  }> = [
    {
      type: 'hp',
      label: t.shopBlessingHp,
      gainText: `+${gain.hp} HP`,
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      bgActive: 'bg-rose-950/50 hover:bg-rose-900/60',
      borderActive: 'border-rose-500/50',
      textActive: 'text-rose-200',
      gainColor: 'text-rose-300',
    },
    {
      type: 'atk',
      label: t.shopBlessingAtk,
      gainText: `+${gain.atk} ATK`,
      icon: <Sword className="w-5 h-5 text-orange-400" />,
      bgActive: 'bg-orange-950/50 hover:bg-orange-900/60',
      borderActive: 'border-orange-500/50',
      textActive: 'text-orange-200',
      gainColor: 'text-orange-300',
    },
    {
      type: 'def',
      label: t.shopBlessingDef,
      gainText: `+${gain.def} DEF`,
      icon: <Shield className="w-5 h-5 text-sky-400" />,
      bgActive: 'bg-sky-950/50 hover:bg-sky-900/60',
      borderActive: 'border-sky-500/50',
      textActive: 'text-sky-200',
      gainColor: 'text-sky-300',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-amber-500/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 顶部神像装饰 */}
        <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 p-6 text-center border-b border-amber-500/30">
          <div className="w-14 h-14 mx-auto mb-2 bg-amber-500/20 border border-amber-400/50 rounded-full flex items-center justify-center shadow-inner">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-amber-300 drop-shadow">{t.shopTitle}</h2>
          <p className="text-xs text-amber-200/80 mt-1">
            {t.shopSubtitle}
          </p>
        </div>

        {/* 交互说明与金币状态 */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Coins className="w-4 h-4 text-yellow-400" />
              {t.shopCurrentGold}
              <span className="font-bold text-yellow-300 font-mono text-sm">
                {game.playerStats.gold} G
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400">{t.shopPrayerCost}</span>
              <span
                className={`font-mono font-bold text-sm ml-1 ${
                  canAfford ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {cost} G
              </span>
            </div>
          </div>

          {/* 加点选项列表 */}
          <div className="space-y-2.5">
            {options.map((opt) => {
              const isConfirming = canAfford && pendingConfirm === opt.type;

              return (
                <div key={opt.type} className="relative group">
                  {/* 当金币不足时悬停提示 Tooltip */}
                  {!canAfford && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/95 border border-rose-500/70 text-rose-300 text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-20 whitespace-nowrap flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{t.tipNotEnoughGold} ({cost} G)</span>
                    </div>
                  )}

                  {isConfirming ? (
                    /* 确认购买状态卡片 */
                    <div className="w-full p-3 rounded-xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-950/90 to-slate-900 shadow-xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                          {opt.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                            <span>{t.shopConfirmPrompt}</span>
                            <span className="text-white font-extrabold">{opt.label}</span>
                          </div>
                          <div className="text-[11px] text-amber-300/80 font-mono mt-0.5">
                            {opt.gainText} · -{cost} G
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
                      title={!canAfford ? `${t.tipNotEnoughGold} (${cost} G)` : undefined}
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
                        <span className="font-bold text-sm">{opt.label}</span>
                      </div>
                      <span className={`font-mono font-bold text-sm ${canAfford ? opt.gainColor : 'text-slate-500'}`}>
                        {opt.gainText}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-center text-slate-400 pt-1">
            {t.shopTotalPrayers.replace('{times}', String(game.shopTimes))}
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
            {t.shopLeave}
          </button>
        </div>
      </div>
    </div>
  );
};
