import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { ChevronRight, Check, Coins, X, AlertCircle, Key, Coffee, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';
import { BUY_ME_A_COFFEE_URL } from './ConfirmCoffeeModal';
import { SUPPORTERS } from '../data/supporters';

interface DialogueModalProps {
  game: GameState;
  onClose: () => void;
  onOpenCoffeeModal?: () => void;
}

const KEY_PATTERN =
  /(?:【|\[)?((?:蓝色钥匙|蓝钥匙|\bBlue\s+Keys?\b|\bblue\s+keys?\b)|(?:黄色钥匙|黄钥匙|\bYellow\s+Keys?\b|\byellow\s+keys?\b)|(?:红色钥匙|红钥匙|\bRed\s+Keys?\b|\bred\s+keys?\b)|(?:金钥匙|\bGold\s+Keys?\b|\bgold\s+keys?\b))(?:】|\])?/g;

interface KeyConfig {
  label: string;
  textColor: string;
  iconColor: string;
}

function getKeyConfig(matchedStr: string): KeyConfig | null {
  const lower = matchedStr.toLowerCase();
  if (matchedStr.includes('蓝') || lower.includes('blue')) {
    return {
      label: matchedStr.includes('钥匙') ? '蓝钥匙' : lower.includes('keys') ? 'Blue Keys' : 'Blue Key',
      textColor: 'text-sky-400',
      iconColor: 'text-sky-400',
    };
  }
  if (matchedStr.includes('黄') || lower.includes('yellow')) {
    return {
      label: matchedStr.includes('钥匙') ? '黄钥匙' : lower.includes('keys') ? 'Yellow Keys' : 'Yellow Key',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-400',
    };
  }
  if (matchedStr.includes('红') || lower.includes('red')) {
    return {
      label: matchedStr.includes('钥匙') ? '红钥匙' : lower.includes('keys') ? 'Red Keys' : 'Red Key',
      textColor: 'text-rose-400',
      iconColor: 'text-rose-400',
    };
  }
  if (matchedStr.includes('金') || lower.includes('gold')) {
    return {
      label: matchedStr.includes('钥匙') ? '金钥匙' : lower.includes('keys') ? 'Gold Keys' : 'Gold Key',
      textColor: 'text-amber-300',
      iconColor: 'text-amber-300',
    };
  }
  return null;
}

export function formatDialogueText(text: string | undefined): React.ReactNode {
  if (!text) return '';

  const sanitized = text
    .replace(/当前楼层的中心对称位置\s*\(10\s*-\s*x,\s*10\s*-\s*y\)/g, '关于中心对称的点')
    .replace(/当前楼层与地图中心对称的位置/g, '关于中心对称的点')
    .replace(/\(10\s*-\s*x,\s*10\s*-\s*y\)/g, '关于中心对称的点');

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  KEY_PATTERN.lastIndex = 0;

  while ((match = KEY_PATTERN.exec(sanitized)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(sanitized.slice(lastIndex, match.index));
    }

    const matchedKey = match[1];
    const cfg = getKeyConfig(matchedKey);

    if (cfg) {
      nodes.push(
        <span
          key={`key-${match.index}`}
          className={`${cfg.textColor} font-bold inline-flex items-center gap-1 mx-0.5 align-middle select-text`}
        >
          <span>{cfg.label}</span>
          <Key className={`w-4 h-4 ${cfg.iconColor} inline shrink-0`} />
        </span>
      );
    } else {
      nodes.push(match[0]);
    }

    lastIndex = KEY_PATTERN.lastIndex;
  }

  if (lastIndex < sanitized.length) {
    nodes.push(sanitized.slice(lastIndex));
  }

  return nodes;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  game,
  onClose,
  onOpenCoffeeModal,
}) => {
  const { t } = useI18n();
  const [isConfirmingTrade, setIsConfirmingTrade] = useState(false);
  const dialogue = game.activeDialogue;
  if (!dialogue) return null;

  const isLast = dialogue.currentIndex >= dialogue.lines.length - 1;
  const trade = dialogue.trade;
  const canTrade = trade && !trade.isBought && isLast;
  const isHonorMonument =
    dialogue.npcId === 'honor_monument' || dialogue.npcId === 'monument';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 select-none">
      <div
        className="bg-slate-900 border-2 border-amber-500/70 rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] shadow-2xl overflow-hidden flex flex-col mb-4 sm:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 对话框头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{dialogue.avatar}</span>
            <span className="font-bold text-amber-300 text-lg leading-tight">{dialogue.name}</span>
          </div>
          {dialogue.lines.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {dialogue.currentIndex + 1} / {dialogue.lines.length}
              </span>
            </div>
          )}
        </div>

        {/* 对话文本 */}
        <div className="p-5 sm:p-7 min-h-[120px] flex flex-col justify-start gap-4 overflow-y-auto min-h-0 flex-1">
          {isHonorMonument && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-amber-200 font-medium">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{t.coffeeModalProjectNote}</span>
            </div>
          )}
          <p className="text-slate-100 text-[18px] sm:text-[20px] leading-[1.75] font-medium tracking-wide whitespace-pre-line">
            {formatDialogueText(dialogue.lines[dialogue.currentIndex])}
          </p>
          {isHonorMonument && (
            <div className="mt-1">
              {SUPPORTERS.length > 0 ? (
                <div className="bg-slate-950/60 border border-amber-500/40 rounded-xl p-3.5 max-h-48 overflow-y-auto space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{game.language === 'zh' ? '🏆 英雄赞助榜' : '🏆 Hero Supporters Board'}</span>
                    </span>
                    <span className="text-[10px] text-amber-400/80 font-mono bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {SUPPORTERS.length} {game.language === 'zh' ? '位支持者' : 'Supporters'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {SUPPORTERS.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/20 text-xs shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-bold text-amber-200 truncate flex items-center gap-1.5">
                            <span className="text-amber-400">⭐</span>
                            <span>{s.name}</span>
                          </span>
                          {s.date && <span className="text-[10px] text-slate-400 font-mono">{s.date}</span>}
                        </div>
                        {s.message && (
                          <p className="text-[11px] text-slate-300 italic mt-1 line-clamp-2">
                            "{s.message}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/40 border border-dashed border-amber-500/30 text-center text-xs text-amber-400/70 font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>
                    {game.language === 'zh'
                      ? '赞助榜虚位以待，期待第一位支持的勇者！'
                      : 'The board awaits its first patron!'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
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
          ) : isHonorMonument ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  window.open(BUY_ME_A_COFFEE_URL, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer ring-1 ring-amber-300/50"
              >
                <Coffee className="w-4 h-4 text-slate-950" />
                <span>{t.monumentSupportBtn}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </button>

              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 rounded-xl text-sm font-bold shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {t.coffeeModalCancelBtn}
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
