// src/ui/Topbar.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { sound } from '../audio/sound';
import { useI18n } from '../i18n';
import { isDebugAllowed } from '../utils/env';
import {
  Save,
  RotateCcw,
  Volume2,
  VolumeX,
  Music2,
  Wrench,
  Languages,
} from 'lucide-react';

interface TopbarProps {
  game: GameState;
  onOpenDebug: () => void;
  onRestart: () => void;
  onQuickSave: () => void;
  onQuickLoad: () => void;
}

/**
 * 背景音乐关闭图标（带鲜明斜杠，贯穿音符并带有微切缝遮罩，醒目体现关闭/禁音状态）
 */
const MusicOff: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
      <mask id="music-slash-mask">
        <rect width="24" height="24" fill="white" />
        <path d="M22 2 2 22" stroke="black" strokeWidth="4" strokeLinecap="round" />
      </mask>
    </defs>
    <g mask="url(#music-slash-mask)">
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </g>
    <path d="M22 2 2 22" strokeWidth="2.4" />
  </svg>
);

export const Topbar: React.FC<TopbarProps> = ({
  game,
  onOpenDebug,
  onRestart,
  onQuickSave,
  onQuickLoad,
}) => {
  const { lang, toggleLang, t } = useI18n();
  const [soundEnabled, setSoundEnabled] = React.useState(sound.enabled);
  const [bgmEnabled, setBgmEnabled] = React.useState(sound.bgmEnabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  };

  const toggleBgm = () => {
    const on = sound.toggleBGM();
    setBgmEnabled(on);
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

        {/* 背景音乐开关 */}
        <button
          onClick={toggleBgm}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all cursor-pointer"
          title={bgmEnabled ? t.bgmMuteTip : t.bgmUnmuteTip}
        >
          {bgmEnabled ? (
            <Music2 className="w-4 h-4 text-green-400" />
          ) : (
            <MusicOff className="w-4 h-4 text-rose-400" />
          )}
        </button>

        {/* 调试菜单 (仅在本地开发环境可见，生产环境与 GitHub Pages 彻底隐匿以保障可玩性) */}
        {isDebugAllowed() && (
          <button
            onClick={onOpenDebug}
            className="p-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 rounded-lg text-purple-300 transition-all"
            title={t.debugTip}
          >
            <Wrench className="w-4 h-4" />
          </button>
        )}

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
