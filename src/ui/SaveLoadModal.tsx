// src/ui/SaveLoadModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from '../game/gameState';
import { SaveSlot } from '../types/game';
import { useI18n, getFloorName } from '../i18n';
import {
  Save,
  RotateCcw,
  X,
  Trash2,
  AlertTriangle,
  Clock,
  Shield,
  Sword,
  Heart,
  Coins,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SaveLoadModalProps {
  isOpen: boolean;
  initialMode: 'save' | 'load';
  game: GameState;
  onClose: () => void;
  onSaveSuccess?: (slotId: number) => void;
  onLoadSuccess?: (slotId: number) => void;
}

type ConfirmState =
  | null
  | {
      type: 'overwrite' | 'load' | 'delete';
      slotId: number;
      slot: SaveSlot;
    };

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  initialMode,
  game,
  onClose,
  onSaveSuccess,
  onLoadSuccess,
}) => {
  const { lang, t } = useI18n();
  const [mode, setMode] = useState<'save' | 'load'>(initialMode);
  const [slots, setSlots] = useState<(SaveSlot | null)[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  // 刷新存档槽位数据
  const refreshSlots = useCallback(() => {
    setSlots(game.getAllSaveSlots(6));
  }, [game]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setConfirmState(null);
      refreshSlots();
    }
  }, [isOpen, initialMode, refreshSlots]);

  // 键盘 ESC 支持
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmState) {
          setConfirmState(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirmState, onClose]);

  if (!isOpen) return null;

  // 执行存盘
  const executeSave = (slotId: number) => {
    const ok = game.saveGame(slotId);
    if (ok) {
      refreshSlots();
      setConfirmState(null);
      onSaveSuccess?.(slotId);
      onClose();
    }
  };

  // 执行读盘
  const executeLoad = (slotId: number) => {
    const ok = game.loadGame(slotId);
    if (ok) {
      setConfirmState(null);
      onLoadSuccess?.(slotId);
      onClose();
    }
  };

  // 执行删除
  const executeDelete = (slotId: number) => {
    game.deleteSaveSlot(slotId);
    refreshSlots();
    setConfirmState(null);
  };

  // 点击槽位卡片主操作
  const handleSlotAction = (slotId: number, slot: SaveSlot | null) => {
    if (mode === 'save') {
      if (!slot) {
        // 空槽位：直接存入
        executeSave(slotId);
      } else {
        // 已有存档：提示确认覆盖
        setConfirmState({ type: 'overwrite', slotId, slot });
      }
    } else {
      // 读盘模式：仅允许点击非空槽位，并二次确认
      if (slot) {
        setConfirmState({ type: 'load', slotId, slot });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
      onClick={() => {
        if (!confirmState) onClose();
      }}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题与切换 Tab */}
        <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => {
                  setMode('save');
                  setConfirmState(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'save'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.saveTab}</span>
              </button>
              <button
                onClick={() => {
                  setMode('load');
                  setConfirmState(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'load'
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.loadTab}</span>
              </button>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-100 hidden sm:block">
                {mode === 'save' ? t.saveModalTitle : t.loadModalTitle}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {mode === 'save' ? t.saveModalSubtitle : t.loadModalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            title="关闭 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 槽位列表网格 (1~6 槽位) */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1">
          {slots.map((slot, idx) => {
            const slotId = idx + 1;
            const isEmpty = !slot;
            const floorTitle = slot
              ? getFloorName(slot.floor, lang, slot.floorName || `${slot.floor}F`)
              : '';

            return (
              <div
                key={slotId}
                className={`border rounded-xl p-4 transition-all flex flex-col justify-between relative group ${
                  isEmpty
                    ? 'bg-slate-950/40 border-dashed border-slate-700/60 text-slate-400 hover:border-slate-500'
                    : 'bg-slate-800/80 border-slate-700 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-950/20 text-slate-200'
                }`}
              >
                {/* 槽位头部 */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black tracking-wider uppercase ${
                        isEmpty
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                      }`}
                    >
                      {t.slotBadge.replace('{slot}', String(slotId))}
                    </span>
                    {!isEmpty && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {slot.timestamp}
                      </span>
                    )}
                  </div>

                  {!isEmpty && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmState({ type: 'delete', slotId, slot });
                      }}
                      className="p-1 hover:bg-rose-950/80 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-500/40"
                      title={t.deleteSlot}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 槽位核心内容 */}
                {isEmpty ? (
                  <div className="py-5 text-center flex flex-col items-center justify-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-2 text-slate-500">
                      <Sparkles className="w-5 h-5 opacity-40" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{t.slotEmpty}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {mode === 'save' ? t.slotEmptyDesc : t.slotNoData}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1 mb-3">
                    {/* 楼层进度 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                        <span>🏰</span> {floorTitle}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {slot.floor}F
                      </span>
                    </div>

                    {/* 勇士基础属性横幅 */}
                    <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px] font-mono">
                      <div className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{slot.stats.hp}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <Sword className="w-3 h-3 text-orange-500 shrink-0" />
                        <span>{slot.stats.atk}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sky-400">
                        <Shield className="w-3 h-3 text-sky-500 shrink-0" />
                        <span>{slot.stats.def}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Coins className="w-3 h-3 text-yellow-500 shrink-0" />
                        <span>{slot.stats.gold}</span>
                      </div>
                    </div>

                    {/* 钥匙与神装指示 */}
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-yellow-400 font-mono">
                          <KeyRound className="w-3 h-3" />
                          {slot.stats.yellowKeys}
                        </span>
                        <span className="flex items-center gap-0.5 text-blue-400 font-mono">
                          <KeyRound className="w-3 h-3" />
                          {slot.stats.blueKeys}
                        </span>
                        <span className="flex items-center gap-0.5 text-red-400 font-mono">
                          <KeyRound className="w-3 h-3" />
                          {slot.stats.redKeys}
                        </span>
                      </div>

                      {(slot.stats.weapon || slot.stats.shield) && (
                        <div className="text-[10px] text-indigo-300 truncate max-w-[130px]">
                          {[slot.stats.weapon, slot.stats.shield].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 底部交互操作按钮 */}
                <div className="pt-2">
                  {mode === 'save' ? (
                    isEmpty ? (
                      <button
                        onClick={() => handleSlotAction(slotId, slot)}
                        className="w-full py-2 bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-500/50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                        <span>{t.saveToSlot}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSlotAction(slotId, slot)}
                        className="w-full py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-amber-500/50"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-200" />
                        <span>{t.overwriteSlot}</span>
                      </button>
                    )
                  ) : (
                    <button
                      disabled={isEmpty}
                      onClick={() => handleSlotAction(slotId, slot)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        isEmpty
                          ? 'bg-slate-800/40 border-slate-700/40 text-slate-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-sky-700 to-cyan-600 hover:from-sky-600 hover:to-cyan-500 text-white shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer border-sky-500/50'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-200" />
                      <span>{t.loadFromSlot}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 二次确认弹窗覆盖层 (Confirm Dialog Modal) */}
        {confirmState && (
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-20 animate-in fade-in duration-150"
            onClick={() => setConfirmState(null)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 图标与标题 */}
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    confirmState.type === 'delete'
                      ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                      : confirmState.type === 'overwrite'
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                      : 'bg-sky-950/80 border-sky-500/50 text-sky-400'
                  }`}
                >
                  {confirmState.type === 'delete' ? (
                    <Trash2 className="w-6 h-6 animate-pulse" />
                  ) : confirmState.type === 'overwrite' ? (
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  ) : (
                    <RotateCcw className="w-6 h-6 animate-spin" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-100">
                    {confirmState.type === 'delete'
                      ? t.confirmDeleteTitle
                      : confirmState.type === 'overwrite'
                      ? t.confirmOverwriteTitle
                      : t.confirmLoadTitle}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {t.slotBadge.replace('{slot}', String(confirmState.slotId))}
                  </p>
                </div>
              </div>

              {/* 描述内容 */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {confirmState.type === 'delete'
                  ? t.confirmDeleteDesc.replace('{slot}', String(confirmState.slotId))
                  : confirmState.type === 'overwrite'
                  ? t.confirmOverwriteDesc
                      .replace('{slot}', String(confirmState.slotId))
                      .replace(
                        '{floor}',
                        getFloorName(
                          confirmState.slot.floor,
                          lang,
                          confirmState.slot.floorName || `${confirmState.slot.floor}F`
                        )
                      )
                      .replace('{time}', confirmState.slot.timestamp)
                  : t.confirmLoadDesc
                      .replace('{slot}', String(confirmState.slotId))
                      .replace(
                        '{floor}',
                        getFloorName(
                          confirmState.slot.floor,
                          lang,
                          confirmState.slot.floorName || `${confirmState.slot.floor}F`
                        )
                      )
                      .replace('{time}', confirmState.slot.timestamp)}
              </p>

              {/* 确认与取消操作 */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmState(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-700"
                >
                  {t.confirmUpFlyCancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmState.type === 'delete') {
                      executeDelete(confirmState.slotId);
                    } else if (confirmState.type === 'overwrite') {
                      executeSave(confirmState.slotId);
                    } else {
                      executeLoad(confirmState.slotId);
                    }
                  }}
                  className={`px-5 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border ${
                    confirmState.type === 'delete'
                      ? 'bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 border-rose-500/60'
                      : confirmState.type === 'overwrite'
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 border-amber-500/60'
                      : 'bg-gradient-to-r from-sky-700 to-cyan-600 hover:from-sky-600 hover:to-cyan-500 border-sky-500/60'
                  }`}
                >
                  <span>
                    {confirmState.type === 'delete'
                      ? t.deleteSlot
                      : confirmState.type === 'overwrite'
                      ? t.overwriteSlot
                      : t.loadFromSlot}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
