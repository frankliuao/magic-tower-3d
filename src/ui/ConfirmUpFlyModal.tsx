// src/ui/ConfirmUpFlyModal.tsx
import React from 'react';
import { ArrowUpCircle, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useI18n, getItemName } from '../i18n';

interface ConfirmUpFlyModalProps {
  isOpen: boolean;
  currentFloor: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmUpFlyModal: React.FC<ConfirmUpFlyModalProps> = ({
  isOpen,
  currentFloor,
  onConfirm,
  onCancel,
}) => {
  const { lang, t } = useI18n();

  if (!isOpen) return null;

  const isHighestFloor = currentFloor >= 50;
  const isFloor49Blocked = currentFloor === 49;
  const isBlocked = isHighestFloor || isFloor49Blocked;
  const isFloor43Secret = currentFloor === 43;

  let desc = '';
  if (isHighestFloor) {
    desc = t.confirmUpFlyBlocked50;
  } else if (isFloor49Blocked) {
    desc = t.confirmUpFlyBlocked49;
  } else if (isFloor43Secret) {
    desc = t.confirmUpFlyDesc43;
  } else {
    desc = t.confirmUpFlyDescOther
      .replace('{from}', String(currentFloor))
      .replace('{to}', String(currentFloor + 1));
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-indigo-500/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-950/80 border border-indigo-500/50 rounded-xl">
              <ArrowUpCircle className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">{t.confirmUpFlyTitle}</h2>
              <p className="text-xs text-indigo-300 font-medium">{getItemName('up_fly', lang)}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {desc}
          </p>

          {isBlocked ? (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{lang === 'zh' ? '当前楼层受到特殊法则限制，无法向上跃迁！' : 'Special realm restrictions prevent vertical leap on this floor!'}</span>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.confirmUpFlyWarning}</span>
            </div>
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="bg-slate-950/60 border-t border-slate-800 px-6 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-700"
          >
            {isBlocked ? (lang === 'zh' ? '关闭' : 'Close') : t.confirmUpFlyCancel}
          </button>
          {!isBlocked && (
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5 border border-indigo-400/60"
            >
              <ArrowUpCircle className="w-4 h-4 text-yellow-300" />
              <span>{t.confirmUpFlyOk}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
