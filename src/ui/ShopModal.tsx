// src/ui/ShopModal.tsx
import React from 'react';
import { GameState } from '../game/gameState';
import { Sparkles, Heart, Sword, Shield, LogOut, Coins } from 'lucide-react';
import { useI18n } from '../i18n';

interface ShopModalProps {
  game: GameState;
  onClose: () => void;
  onBuy: (type: 'hp' | 'atk' | 'def') => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ game, onClose, onBuy }) => {
  const { t } = useI18n();
  const cost = game.getShopCost();
  const gain = game.getShopGain();
  const canAfford = game.playerStats.gold >= cost;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-amber-500/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 顶部神像装饰 */}
        <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 p-6 text-center border-b border-amber-500/30">
          <div className="w-14 h-14 mx-auto mb-2 bg-amber-500/20 border border-amber-400/50 rounded-full flex items-center justify-center shadow-inner">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-amber-300 drop-shadow">{t.shopTitle}</h2>
          <p className="text-xs text-amber-200/80 mt-1">
            {t.shopSubtitle}
          </p>
        </div>

        {/* 交互说明与金币状态 */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Coins className="w-4 h-4 text-yellow-400" />
              {t.shopCurrentGold}
              <span className="font-bold text-yellow-300 font-mono text-sm">
                {game.playerStats.gold} G
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400">{t.shopPrayerCost}</span>
              <span
                className={`font-mono font-bold text-sm ml-1 ${
                  canAfford ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {cost} G
              </span>
            </div>
          </div>

          {/* 加点选项列表 */}
          <div className="space-y-2.5">
            {/* 增加生命 */}
            <button
              disabled={!canAfford}
              onClick={() => onBuy('hp')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                canAfford
                  ? 'bg-rose-950/50 hover:bg-rose-900/60 border-rose-500/50 text-rose-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-sm">{t.shopBlessingHp}</span>
              </div>
              <span className="font-mono font-bold text-rose-300 text-sm">+{gain.hp} HP</span>
            </button>

            {/* 增加攻击 */}
            <button
              disabled={!canAfford}
              onClick={() => onBuy('atk')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                canAfford
                  ? 'bg-orange-950/50 hover:bg-orange-900/60 border-orange-500/50 text-orange-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sword className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-sm">{t.shopBlessingAtk}</span>
              </div>
              <span className="font-mono font-bold text-orange-300 text-sm">+{gain.atk} ATK</span>
            </button>

            {/* 增加防御 */}
            <button
              disabled={!canAfford}
              onClick={() => onBuy('def')}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                canAfford
                  ? 'bg-sky-950/50 hover:bg-sky-900/60 border-sky-500/50 text-sky-200 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-sm">{t.shopBlessingDef}</span>
              </div>
              <span className="font-mono font-bold text-sky-300 text-sm">+{gain.def} DEF</span>
            </button>
          </div>

          <div className="text-[11px] text-center text-slate-400 pt-1">
            {t.shopTotalPrayers.replace('{times}', String(game.shopTimes))}
          </div>
        </div>

        {/* 底部退出 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t.shopLeave}
          </button>
        </div>
      </div>
    </div>
  );
};
