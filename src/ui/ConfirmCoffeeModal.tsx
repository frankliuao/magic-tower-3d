// src/ui/ConfirmCoffeeModal.tsx
import React from 'react';
import { Coffee, ExternalLink, X, Heart } from 'lucide-react';
import { useI18n } from '../i18n';

interface ConfirmCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/frankliuao';

export const ConfirmCoffeeModal: React.FC<ConfirmCoffeeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  const handleConfirm = () => {
    window.open(BUY_ME_A_COFFEE_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-amber-500/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-500/50 rounded-xl shadow-inner">
              <Coffee className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-black text-amber-300 tracking-wide flex items-center gap-1.5">
              {t.coffeeModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-4">
          {/* 开源非营利说明与致谢 (放置在最上方) */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-amber-200 font-medium">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-relaxed">{t.coffeeModalProjectNote}</span>
          </div>

          {/* 单纯打赏消息与支持说明 */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2 text-slate-200">
            <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
              {t.coffeeModalDesc}
            </p>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="bg-slate-950/70 border-t border-slate-800 px-6 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-700"
          >
            {t.coffeeModalCancelBtn}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5 text-slate-950" />
            <span>{t.coffeeModalConfirmBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
