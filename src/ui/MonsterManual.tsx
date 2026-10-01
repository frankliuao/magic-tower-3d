import React from 'react';
import { GameState } from '../game/gameState';
import { MONSTERS } from '../data/monsters';
import { calculateBattle } from '../game/combat';
import { Monster } from '../types/game';
import { BookOpen, X, ShieldAlert, Award, Swords, Sparkles } from 'lucide-react';
import { useI18n, getMonsterName, getFloorName } from '../i18n';
import { MonsterIcon } from './MonsterIcon';

interface MonsterManualProps {
  game: GameState;
  onClose: () => void;
}

export const MonsterManual: React.FC<MonsterManualProps> = ({ game, onClose }) => {
  const { lang, t } = useI18n();
  const floorData = game.getCurrentFloorData();
  const hasCross = Boolean(game.playerStats.inventory.cross);

  // 扫描当前楼层所有怪物并去重统计数量
  const monsterCounts: Map<string, number> = new Map();
  floorData.layout.forEach((row) => {
    row.forEach((tile) => {
      if (tile && tile.type === 'monster' && tile.monsterId) {
        const id = tile.monsterId;
        monsterCounts.set(id, (monsterCounts.get(id) || 0) + 1);
      }
    });
  });

  const uniqueMonsters: { monster: Monster; count: number }[] = [];
  monsterCounts.forEach((count, id) => {
    const mon = MONSTERS[id];
    if (mon) {
      uniqueMonsters.push({ monster: mon, count });
    }
  });

  // 按怪物攻击力升序排序
  uniqueMonsters.sort((a, b) => a.monster.atk - b.monster.atk);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* 标题栏 */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                {t.manualTitle}
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  {t.currentFloorPrefix}{getFloorName(game.currentFloor, lang, floorData.name)}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.manualSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 怪物列表内容 */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {uniqueMonsters.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">{t.noMonstersOnFloor}</p>
            </div>
          ) : (
            uniqueMonsters.map(({ monster, count }) => {
              const calc = calculateBattle(game.playerStats, monster, hasCross);
              const cannotBreakDef = !calc.canFight;
              const willDie = calc.canFight && game.playerStats.hp <= calc.damage;
              const zeroDamage = calc.canFight && calc.damage === 0;
              const monsterName = getMonsterName(monster.id, lang);

              return (
                <div
                  key={monster.id}
                  className="bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 rounded-xl p-4 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* 怪物基础信息 */}
                    <div className="flex items-center gap-3.5">
                      <MonsterIcon
                        monsterId={monster.id}
                        name={monsterName}
                        color={monster.color}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{monsterName}</span>
                          <span className="text-[11px] text-slate-400">
                            {lang === 'zh' ? `×${count}只` : `×${count}`}
                          </span>
                          {/* 特殊属性徽章 */}
                          {monster.special?.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40"
                            >
                              {s === 'FIRST_STRIKE'
                                ? (lang === 'zh' ? '先攻' : 'First Strike')
                                : s === 'DOUBLE_STRIKE'
                                ? (lang === 'zh' ? '2连击' : '2 Strikes')
                                : s === 'MAGIC_ATTACK'
                                ? (lang === 'zh' ? '魔攻' : 'Magic ATK')
                                : s === 'VAMPIRE_10'
                                ? (lang === 'zh' ? '吸血10%' : 'Vampire 10%')
                                : s}
                            </span>
                          ))}
                        </div>
                        {/* 四维属性 */}
                        <div className="flex items-center gap-3 text-xs mt-1.5 font-mono">
                          <span className="text-rose-400">{t.hp}: {monster.hp}</span>
                          <span className="text-orange-400">{t.atk}: {monster.atk}</span>
                          <span className="text-sky-400">{t.def}: {monster.def}</span>
                          <span className="text-yellow-400">{t.gold}: +{monster.gold}</span>
                          <span className="text-emerald-400">{t.exp}: +{monster.exp}</span>
                        </div>
                      </div>
                    </div>

                    {/* 战损结果判定标签 */}
                    <div className="text-right">
                      {cannotBreakDef ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-950/80 border border-red-500/60 rounded-lg text-xs font-bold text-red-300">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {t.cannotBreakDefDetail}
                        </div>
                      ) : willDie ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-950/80 border border-rose-500/60 rounded-lg text-xs font-bold text-rose-300">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {t.insufficientHp.replace('{damage}', String(calc.damage))}
                        </div>
                      ) : zeroDamage ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-950/80 border border-emerald-500/60 rounded-lg text-xs font-bold text-emerald-300 shadow-sm">
                          <Award className="w-3.5 h-3.5" />
                          {t.flawlessVictory}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-950/80 border border-amber-500/60 rounded-lg text-xs font-bold text-amber-300">
                          <Swords className="w-3.5 h-3.5" />
                          {t.estDamageDetail
                            .replace('{damage}', String(calc.damage))
                            .replace('{turns}', String(calc.turns))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 临界值提示 (减少受击所需攻击力) */}
                  {calc.canFight && calc.nextCritAtk && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="text-slate-400">
                        {t.breakpointUpgrade}
                        <strong className="text-amber-400 font-mono text-xs">{calc.nextCritAtk}</strong>
                        {t.breakpointNeed.replace(
                          '{diff}',
                          String(calc.nextCritAtk - game.playerStats.atk)
                        )}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {t.breakpointBenefit.replace(
                          '{saveHp}',
                          String(calc.reducedDamageAtCrit)
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 底部关闭 */}
        <div className="bg-slate-800/80 border-t border-slate-700/80 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
          >
            {t.closeManual}
          </button>
        </div>
      </div>
    </div>
  );
};
