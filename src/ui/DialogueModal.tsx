// src/ui/DialogueModal.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { ChevronRight, Check } from 'lucide-react';
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

  const handleNext = () => {
    if (isLast) {
      game.isDialogueOpen = false;
      game.activeDialogue = null;
      onClose();
    } else {
      dialogue.currentIndex++;
      game.notify();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden mb-6 sm:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* 对话框头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dialogue.avatar}</span>
            <span className="font-bold text-amber-300 text-sm">{dialogue.name}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {dialogue.currentIndex + 1} / {dialogue.lines.length}
          </span>
        </div>

        {/* 对话文本 */}
        <div className="p-6 min-h-[110px] flex items-center">
          <p className="text-slate-100 text-sm leading-relaxed tracking-wide">
            {dialogue.lines[dialogue.currentIndex]}
          </p>
        </div>

        {/* 底部按钮 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3 flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-105 active:scale-95"
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
      </div>
    </div>
  );
};
