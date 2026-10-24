// src/ui/ConfirmCenterFlyModal.tsx
import React from 'react';
import { Zap, AlertTriangle, X } from 'lucide-react';
import { useI18n, getItemName } from '../i18n';

interface ConfirmCenterFlyModalProps {
  isOpen: boolean;
  targetCoord?: { x: number; y: number } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmCenterFlyModal: React.FC<ConfirmCenterFlyModalProps> = ({
  isOpen,
  targetCoord,
  onConfirm,
  onCancel,
}) => {
  const { lang, t } = useI18n();

  if (!isOpen) return null;

  const desc = targetCoord
    ? lang === 'zh'
      ? `即将瞬移传送至目标地面 (${targetCoord.x}, ${targetCoord.y})。确定要立即开启跃迁吗？`
      : `You are about to teleport to (${targetCoord.x}, ${targetCoord.y}). Activate teleportation now?`
    : t.confirmCenterFlyDesc;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-purple-500/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950/80 border border-purple-500/50 rounded-xl">
              <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">{t.confirmCenterFlyTitle}</h2>
              <p className="text-xs text-purple-300 font-medium">{getItemName('center_fly', lang)}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed">
            {desc}
          </p>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{t.confirmCenterFlyWarning}</span>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="bg-slate-950/60 border-t border-slate-800 px-6 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-700"
          >
            {t.confirmCenterFlyCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-700 hover:from-purple-600 hover:to-fuchsia-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5 border border-purple-400/60"
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>{t.confirmCenterFlyOk}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
