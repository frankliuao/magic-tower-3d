import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { ChevronRight, Check, Coins, X, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';

interface DialogueModalProps {
  game: GameState;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({ game, onClose }) => {
  const { t } = useI18n();
  const [isConfirmingTrade, setIsConfirmingTrade] = useState(false);
  const dialogue = game.activeDialogue;
  if (!dialogue) return null;

  const isLast = dialogue.currentIndex >= dialogue.lines.length - 1;
  const trade = dialogue.trade;
  const canTrade = trade && !trade.isBought && isLast;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      dialogue.currentIndex++;
      game.notify();
    }
  };

  const handleTrade = () => {
    if (!trade) return;
    game.buyTraderItem(trade.tradeId);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden mb-6 sm:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* 对话框头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{dialogue.avatar}</span>
            <span className="font-bold text-amber-300 text-lg">{dialogue.name}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {dialogue.currentIndex + 1} / {dialogue.lines.length}
          </span>
        </div>

        {/* 对话文本 (字体增大 40%: 由 14px 增至 20px) */}
        <div className="p-7 min-h-[140px] flex items-center">
          <p className="text-slate-100 text-[20px] leading-[1.75] font-medium tracking-wide whitespace-pre-line">
            {dialogue.lines[dialogue.currentIndex]}
          </p>
        </div>

        {/* 底部按钮 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3.5 flex items-center justify-between gap-3">
          {canTrade ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              {game.playerStats.gold >= trade.costGold ? (
                isConfirmingTrade ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTrade}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white rounded-xl text-sm font-bold shadow ring-1 ring-emerald-300/50 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      {t.confirmBtn} ({trade.costGold} G)
                    </button>
                    <button
                      onClick={() => setIsConfirmingTrade(false)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-300 rounded-xl text-sm font-medium transition-all cursor-pointer border border-slate-600"
                    >
                      <X className="w-4 h-4" />
                      {t.cancelBtn}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsConfirmingTrade(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition-all bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-95 text-white cursor-pointer ring-1 ring-amber-300/50"
                  >
                    <Coins className="w-4 h-4 text-amber-300" />
                    {trade.title} ({trade.costGold} {game.language === 'zh' ? '金币' : 'Gold'})
                  </button>
                )
              ) : (
                <div className="relative group">
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/95 border border-rose-500/70 text-rose-300 text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-20 whitespace-nowrap flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{t.tipNotEnoughGold} ({trade.costGold} G)</span>
                  </div>
                  <button
                    disabled
                    title={`${t.tipNotEnoughGold} (${trade.costGold} G)`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition-all bg-slate-800/40 border border-slate-700/50 text-slate-500 opacity-40 grayscale cursor-not-allowed select-none"
                  >
                    <Coins className="w-4 h-4 text-slate-500" />
                    {trade.title} ({trade.costGold} {game.language === 'zh' ? '金币' : 'Gold'})
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setIsConfirmingTrade(false);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 rounded-xl text-sm font-bold shadow transition-all cursor-pointer"
              >
                {game.language === 'zh' ? '暂不购买' : 'Decline'}
              </button>
            </div>
          ) : (
            <div className="flex justify-end w-full">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-xl text-sm font-bold shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isLast ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t.dialogueProceed}
                  </>
                ) : (
                  <>
                    {t.dialogueNext}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
