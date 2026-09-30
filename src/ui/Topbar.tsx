// src/ui/Topbar.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { sound } from '../audio/sound';
import { useI18n } from '../i18n';
import {
  Compass,
  BookOpen,
  Save,
  RotateCcw,
  Volume2,
  VolumeX,
  Wrench,
  Languages,
} from 'lucide-react';

interface TopbarProps {
  game: GameState;
  onOpenManual: () => void;
  onOpenTeleport: () => void;
  onOpenDebug: () => void;
  onRestart: () => void;
  onQuickSave: () => void;
  onQuickLoad: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  game,
  onOpenManual,
  onOpenTeleport,
  onOpenDebug,
  onRestart,
  onQuickSave,
  onQuickLoad,
}) => {
  const { lang, toggleLang, t } = useI18n();
  const [soundEnabled, setSoundEnabled] = React.useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  };

  return (
    <header className="h-14 bg-slate-900/90 border-b border-slate-700/80 px-4 flex items-center justify-between backdrop-blur-md z-20 shadow-md">
      {/* 游戏标题 */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-amber-400 text-sm tracking-wide flex items-center gap-1.5">
          <span className="text-base">🏰</span> {t.gameTitle}
        </span>
      </div>

      {/* 核心快捷功能按钮 */}
      <div className="flex items-center gap-2">
        {/* 怪物手册 */}
        <button
          onClick={onOpenManual}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 rounded-lg text-xs font-bold text-emerald-300 shadow transition-all hover:scale-105 active:scale-95"
          title={`${t.monsterManualBtn} (L)`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          {t.monsterManualBtn}
        </button>

        {/* 楼层罗盘 */}
        <button
          onClick={onOpenTeleport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/60 rounded-lg text-xs font-bold text-cyan-300 shadow transition-all hover:scale-105 active:scale-95"
          title={`${t.floorJumpBtn} (G)`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          {t.floorJumpBtn}
        </button>

        {/* 快速存档 */}
        <button
          onClick={onQuickSave}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-all hover:scale-105 active:scale-95"
          title={t.saveBtn}
        >
          <Save className="w-3.5 h-3.5 text-indigo-400" />
          {t.saveBtn}
        </button>

        {/* 快速读档 */}
        <button
          onClick={onQuickLoad}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-all hover:scale-105 active:scale-95"
          title={t.loadBtn}
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          {t.loadBtn}
        </button>

        {/* 音效开关 */}
        <button
          onClick={toggleSound}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all"
          title={soundEnabled ? t.muteTip : t.unmuteTip}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-green-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        {/* 调试菜单 */}
        <button
          onClick={onOpenDebug}
          className="p-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 rounded-lg text-purple-300 transition-all"
          title={t.debugTip}
        >
          <Wrench className="w-4 h-4" />
        </button>

        {/* 重新开始 */}
        <button
          onClick={onRestart}
          className="p-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 rounded-lg text-rose-300 transition-all"
          title={t.restartTip}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 语言切换按钮 (Top-Right Language Switcher: 默认中文，可切换英文) */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-950/70 to-slate-800 hover:from-amber-900/80 hover:to-slate-700 border border-amber-500/60 rounded-lg text-xs font-bold text-amber-300 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
          title={t.langToggleTip}
        >
          <Languages className="w-4 h-4 text-amber-400" />
          <span>{lang === 'zh' ? 'EN' : '中文'}</span>
        </button>
      </div>
    </header>
  );
};
