// src/ui/InspectCard.tsx
import React from 'react';
import {
  X,
  Shield,
  Sword,
  Heart,
  Coins,
  Sparkles,
  Flame,
  Info,
  KeyRound,
  DoorClosed,
  Navigation,
} from 'lucide-react';
import { Tile, SpecialAbility } from '../types/game';
import { GameState } from '../game/gameState';
import { MONSTERS } from '../data/monsters';
import { ITEMS } from '../data/items';
import { calculateBattle } from '../game/combat';
import { useI18n, getMonsterName, getItemName, getFloorName } from '../i18n';

interface InspectCardProps {
  tile: Tile | null;
  gridX: number;
  gridY: number;
  game: GameState;
  onClose: () => void;
}

export const InspectCard: React.FC<InspectCardProps> = ({
  tile,
  gridX,
  gridY,
  game,
  onClose,
}) => {
  const { lang, t } = useI18n();

  const renderContent = () => {
    // 1. 怪物 (Monster)
    if (tile?.type === 'monster' && tile.monsterId) {
      const monster = MONSTERS[tile.monsterId];
      if (!monster) return null;

      const calc = calculateBattle(
        game.playerStats,
        monster,
        Boolean(game.playerStats.inventory.cross)
      );

      const mName = getMonsterName(monster.id, lang);

      const renderTraitBadge = (sp: SpecialAbility, idx: number) => {
        let label = '';
        let color = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        if (sp === 'FIRST_STRIKE') {
          label = t.specialFirstStrike;
          color = 'bg-red-500/20 text-red-300 border-red-500/40';
        } else if (sp === 'DOUBLE_STRIKE') {
          label = t.specialDouble;
          color = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
        } else if (sp === 'TRIPLE_STRIKE') {
          label = t.specialTriple;
          color = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
        } else if (sp === 'MAGIC_ATTACK') {
          label = t.magicAttack;
          color = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
        } else if (sp === 'VAMPIRE_10' || sp === 'VAMPIRE_20') {
          label = game.playerStats.inventory.cross ? t.specialVampireBlocked : t.specialVampire;
          color = game.playerStats.inventory.cross
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-red-500/20 text-red-300 border-red-500/40';
        } else if (sp === 'POISON') {
          label = t.specialPoison;
          color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        } else {
          return null;
        }

        return (
          <span
            key={idx}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${color} font-medium`}
          >
            {label}
          </span>
        );
      };

      return (
        <div className="flex flex-col gap-2.5">
          {/* 怪物名称与分类 */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner shrink-0"
              style={{
                backgroundColor: `${monster.color}25`,
                border: `2px solid ${monster.color}`,
                color: monster.color,
              }}
            >
              {mName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100 truncate">{mName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/70 border border-red-700/60 text-red-300 shrink-0">
                  {t.inspectMonsterCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                {monster.description || ''}
              </p>
            </div>
          </div>

          {/* 属性网格 */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono">{monster.hp}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Sword className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono">{monster.atk}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono">{monster.def}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-300">
              <Coins className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono">+{monster.gold} G</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 col-span-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono">+{monster.exp} EXP</span>
            </div>
          </div>

          {/* 特殊技能标签 */}
          {monster.special && monster.special.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {monster.special.map((sp, i) => renderTraitBadge(sp, i))}
            </div>
          )}

          {/* 战斗演练推演结果 */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col gap-1 text-xs ${
              !calc.canFight
                ? 'bg-red-950/50 border-red-700/60 text-red-200'
                : game.playerStats.hp <= calc.damage
                ? 'bg-amber-950/50 border-amber-700/60 text-amber-200'
                : calc.damage === 0
                ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-200'
                : 'bg-yellow-950/40 border-yellow-700/50 text-yellow-200'
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span>{t.estDamage}</span>
              <span className="font-mono font-bold text-sm">
                {!calc.canFight
                  ? t.cannotPierce
                  : calc.damage === 0
                  ? t.flawlessVictory
                  : `-${calc.damage} HP`}
              </span>
            </div>
            {calc.canFight && (
              <div className="text-[11px] opacity-85 flex justify-between">
                <span>{t.roundsLabel}: {calc.turns}</span>
                <span>{game.playerStats.hp > calc.damage ? '✓ 可战胜' : '⚠ 危险'}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2. 道具 (Item)
    if (tile?.type === 'item' && tile.itemType) {
      const item = ITEMS[tile.itemType];
      const iName = getItemName(tile.itemType, lang);

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner shrink-0"
              style={{
                backgroundColor: `${item?.color || '#facc15'}25`,
                border: `2px solid ${item?.color || '#facc15'}`,
                color: item?.color || '#facc15',
              }}
            >
              {tile.itemType.startsWith('key_') ? (
                <KeyRound className="w-5 h-5" />
              ) : tile.itemType.includes('sword') ? (
                <Sword className="w-5 h-5" />
              ) : tile.itemType.includes('shield') ? (
                <Shield className="w-5 h-5" />
              ) : tile.itemType.includes('potion') ? (
                <Heart className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100 truncate">{iName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-700/60 text-amber-300 shrink-0">
                  {t.inspectItemCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{item?.description || ''}</p>
            </div>
          </div>
        </div>
      );
    }

    // 3. 剧情人物 (NPC)
    if (tile?.type === 'npc' && tile.npcId) {
      const npcId = tile.npcId;
      let npcName = lang === 'zh' ? '神秘剧情角色' : 'NPC Character';
      let npcDesc =
        lang === 'zh'
          ? '在地牢中相遇的友善盟友，交谈可获取关键指引或神秘法宝。'
          : 'A friendly ally met in the dungeon. Speak to gain insights or relics.';
      let avatar = '🧙';

      if (npcId === 'fairy') {
        npcName = lang === 'zh' ? '仙人 (仙女)' : 'Celestial Fairy';
        npcDesc =
          lang === 'zh'
            ? '掌管魔塔天界封印的仙子，指引勇士拯救王国并赠予神圣罗盘。'
            : 'Fairy overseeing tower seals, guiding the hero with sacred lore.';
        avatar = '🧙‍♀️';
      } else if (npcId === 'thief') {
        npcName = lang === 'zh' ? '大盗' : 'Thief';
        npcDesc =
          lang === 'zh'
            ? '掌握暗门与密道机关的开锁大师，告知楼层中隐藏的神兵密道。'
            : 'Lockpick master who reveals secret false walls and passages.';
        avatar = '🥷';
      } else if (npcId === 'old_man_manual' || npcId === 'elder' || npcId === 'old_man') {
        npcName = lang === 'zh' ? '神秘老人' : 'Mystic Sage';
        npcDesc =
          lang === 'zh'
            ? '洞悉万物弱点的古老学者，传授【怪物手册】并点拨战斗临界点。'
            : 'Ancient sage who offers the Monster Manual and strategic tips.';
        avatar = '🧙‍♂️';
      } else if (npcId === 'trader' || npcId === 'merchant') {
        npcName = lang === 'zh' ? '神秘商人' : 'Merchant';
        npcDesc =
          lang === 'zh'
            ? '往来魔塔各层的神秘黑市行商，提供稀有法宝、钥匙与能力收购。'
            : 'Wandering merchant trading rare relics, keys, and powers.';
        avatar = '👳';
      } else if (npcId === 'princess') {
        npcName = lang === 'zh' ? '王国公主' : 'Princess';
        npcDesc =
          lang === 'zh'
            ? '被魔王囚禁于塔顶的无辜公主，等待着勇士手刃魔王将其解救。'
            : 'The captured princess awaiting the hero to conquer the Demon Lord.';
        avatar = '👸';
      }

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/50 flex items-center justify-center text-2xl shrink-0">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100 truncate">{npcName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-700/60 text-purple-300 shrink-0">
                  {t.inspectNpcCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{npcDesc}</p>
            </div>
          </div>
        </div>
      );
    }

    // 4. 门 (Door)
    if (tile?.type.startsWith('door_')) {
      const isYellow = tile.type === 'door_yellow';
      const isBlue = tile.type === 'door_blue';
      const isRed = tile.type === 'door_red';
      const isIron = tile.type === 'door_iron';

      const doorName = isYellow
        ? lang === 'zh'
          ? '黄铜之门'
          : 'Yellow Gate'
        : isBlue
        ? lang === 'zh'
          ? '湛蓝之门'
          : 'Blue Gate'
        : isRed
        ? lang === 'zh'
          ? '赤红结界门'
          : 'Red Barrier Gate'
        : lang === 'zh'
        ? '机关铁门'
        : 'Iron Gate';

      const keyCount = isYellow
        ? game.playerStats.yellowKeys
        : isBlue
        ? game.playerStats.blueKeys
        : isRed
        ? game.playerStats.redKeys
        : 0;

      const hasKey = keyCount > 0;

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isYellow
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                  : isBlue
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : isRed
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300'
              }`}
            >
              <DoorClosed className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100">{doorName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-700/60 text-blue-300 shrink-0">
                  {t.inspectDoorCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isIron
                  ? t.inspectDoorFree
                  : hasKey
                  ? t.inspectDoorOwned.replace('{count}', String(keyCount))
                  : t.inspectDoorMissing.replace('{count}', String(keyCount))}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 5. 传送光圈 (Stairs)
    if (tile?.type === 'stairs_up' || tile?.type === 'stairs_down') {
      const isUp = tile.type === 'stairs_up';
      const destFloor = isUp ? game.currentFloor + 1 : game.currentFloor - 1;
      const title = isUp
        ? lang === 'zh'
          ? '传送光圈 · 向上'
          : 'Portal · Ascend'
        : lang === 'zh'
        ? '传送光圈 · 向下'
        : 'Portal · Descend';

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isUp
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              }`}
            >
              <Navigation className={`w-5 h-5 ${isUp ? '' : 'rotate-180'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100">{title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950/70 border border-sky-700/60 text-sky-300 shrink-0">
                  {t.inspectStairsCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isUp
                  ? t.inspectStairsUp.replace('{floor}', String(destFloor))
                  : t.inspectStairsDown.replace('{floor}', String(destFloor))}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 6. 神坛商店 (Shop)
    if (tile?.type === 'shop') {
      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100">{t.shopTitle}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-700/60 text-amber-300 shrink-0">
                  {t.inspectShopCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.inspectShopDesc}</p>
            </div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-xs flex justify-between items-center text-amber-300">
            <span>{t.shopPrayerCost}</span>
            <span className="font-mono font-bold">{game.getShopCost()} G</span>
          </div>
        </div>
      );
    }

    // 7. 熔岩之海 (Lava)
    if (tile?.type === 'lava') {
      const hasSnow = Boolean(game.playerStats.inventory.snow_crystal);

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/60 text-orange-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100">
                  {lang === 'zh' ? '炽热熔岩之海' : 'Boiling Lava'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/70 border border-orange-700/60 text-orange-300 shrink-0">
                  {t.inspectLavaCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {hasSnow ? t.inspectLavaFrozenNotice : t.inspectLavaBlockedNotice}
              </p>
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border text-xs font-medium ${
              hasSnow
                ? 'bg-sky-950/50 border-sky-700/60 text-sky-200'
                : 'bg-red-950/50 border-red-700/60 text-red-200'
            }`}
          >
            {hasSnow
              ? lang === 'zh'
                ? '✓ 已配备【冰冻雪花】，直接走向熔岩即可凝结冰霜大道！'
                : '✓ [Frost Snowflake] equipped. Step onto lava to freeze it into ice!'
              : lang === 'zh'
              ? '⚠ 炽热极温阻挡！请前往35层击败魔龙获取【冰冻雪花】。'
              : '⚠ Blazing heat blocks you! Defeat the 35F Dragon for the Frost Snowflake.'}
          </div>
        </div>
      );
    }

    // 8. 暗墙与实体墙 (Wall / Fake Wall)
    if (tile?.type === 'wall' || tile?.type === 'fake_wall') {
      const isFake = tile.type === 'fake_wall';
      const name = isFake
        ? lang === 'zh'
          ? '伪装暗墙'
          : 'Illusion Wall'
        : lang === 'zh'
        ? '坚实石壁'
        : 'Granite Wall';
      const desc = isFake ? t.inspectFakeWallDesc : t.inspectWallDesc;

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-100">{name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                  {t.inspectWallCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
        </div>
      );
    }

    // 9. 普通地面 (Floor)
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700/60 flex items-center justify-center shrink-0 text-slate-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-100">
                {lang === 'zh' ? '地牢石板路' : 'Dungeon Floor'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                {t.inspectFloorCategory}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.inspectFloorDesc}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-4 left-4 z-20 w-80 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 text-slate-100 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-auto"
    >
      {/* 顶部标题与关闭 */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-xs text-sky-300">{t.inspectTitle}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1 hover:bg-slate-800 active:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          title={t.inspectCloseBtn}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 主体介绍 */}
      <div className="py-0.5">{renderContent()}</div>
    </div>
  );
};
