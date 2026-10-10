// src/ui/DialogueModal.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { ChevronRight, Check, Coins } from 'lucide-react';
import { useI18n } from '../i18n';

interface DialogueModalProps {
  game: GameState;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({ game, onClose }) => {
  const { t } = useI18n();
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
              <button
                onClick={handleTrade}
                disabled={game.playerStats.gold < trade.costGold}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition-all ${
                  game.playerStats.gold >= trade.costGold
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-white cursor-pointer ring-1 ring-amber-300/50'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-75'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-300" />
                {game.playerStats.gold >= trade.costGold
                  ? `${trade.title} (${trade.costGold} ${game.language === 'zh' ? '金币' : 'Gold'})`
                  : `${game.language === 'zh' ? '金币不足' : 'Not Enough Gold'} (${trade.costGold} ${game.language === 'zh' ? '金币' : 'Gold'}，${game.language === 'zh' ? '拥有' : 'Have'}: ${game.playerStats.gold})`}
              </button>

              <button
                onClick={onClose}
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
