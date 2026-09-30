// src/game/combat.ts
import { Monster, PlayerStats, BattleCalculation } from '../types/game';

/**
 * 魔塔经典战斗伤害计算器（100% 确定性数学演算）
 */
export function calculateBattle(
  hero: PlayerStats,
  monster: Monster,
  hasCross: boolean = false
): BattleCalculation {
  const notes: string[] = [];

  // 1. 破防判定
  if (hero.atk <= monster.def) {
    return {
      canFight: false,
      damage: Infinity,
      turns: Infinity,
      damagePerTurn: 0,
      heroDamagePerTurn: 0,
      specialNotes: ['无法破防，攻击力过低！'],
    };
  }

  const heroDamagePerHit = hero.atk - monster.def;
  const turns = Math.ceil(monster.hp / heroDamagePerHit);

  // 2. 怪物单次伤害计算
  const specials = monster.special || [];
  let monsterDamagePerHit = 0;

  if (specials.includes('MAGIC_ATTACK')) {
    monsterDamagePerHit = monster.atk;
    notes.push('魔攻属性：无视勇士防御');
  } else {
    monsterDamagePerHit = Math.max(0, monster.atk - hero.def);
  }

  // 连击判定
  let strikesPerTurn = 1;
  if (specials.includes('DOUBLE_STRIKE')) {
    strikesPerTurn = 2;
    notes.push('2连击：每回合攻击2次');
  } else if (specials.includes('TRIPLE_STRIKE')) {
    strikesPerTurn = 3;
    notes.push('3连击：每回合攻击3次');
  }

  // 3. 怪物出手次数计算
  let monsterTotalStrikes = 0;
  if (specials.includes('FIRST_STRIKE')) {
    monsterTotalStrikes = turns * strikesPerTurn;
    notes.push('先攻：先手攻击勇士');
  } else {
    monsterTotalStrikes = Math.max(0, turns - 1) * strikesPerTurn;
  }

  let totalDamage = monsterTotalStrikes * monsterDamagePerHit;

  // 4. 吸血特技判定
  if (specials.includes('VAMPIRE_10')) {
    if (hasCross) {
      notes.push('十字架抵御了吸血！');
    } else {
      const vampDamage = Math.floor(hero.hp * 0.1);
      totalDamage += vampDamage;
      notes.push(`吸血：开战前吸取 10% 当前生命 (-${vampDamage})`);
    }
  } else if (specials.includes('VAMPIRE_20')) {
    if (hasCross) {
      notes.push('十字架抵御了吸血！');
    } else {
      const vampDamage = Math.floor(hero.hp * 0.2);
      totalDamage += vampDamage;
      notes.push(`强力吸血：开战前吸取 20% 当前生命 (-${vampDamage})`);
    }
  }

  // 5. 临界值计算（减少1次受击所需的攻击力）
  let nextCritAtk: number | undefined;
  let reducedDamageAtCrit: number | undefined;

  if (turns > 1 && monsterDamagePerHit > 0) {
    const targetTurns = turns - 1;
    const requiredHeroHit = Math.ceil(monster.hp / targetTurns);
    nextCritAtk = monster.def + requiredHeroHit;

    // 计算达到该攻击力时减少的伤害
    const newMonsterStrikes = specials.includes('FIRST_STRIKE')
      ? targetTurns * strikesPerTurn
      : (targetTurns - 1) * strikesPerTurn;
    const newDamage = newMonsterStrikes * monsterDamagePerHit;
    reducedDamageAtCrit = totalDamage - newDamage;
  }

  if (totalDamage === 0) {
    notes.push('防杀：完全无伤击杀！');
  }

  return {
    canFight: true,
    damage: totalDamage,
    turns,
    damagePerTurn: monsterDamagePerHit * strikesPerTurn,
    heroDamagePerTurn: heroDamagePerHit,
    nextCritAtk,
    reducedDamageAtCrit,
    specialNotes: notes,
  };
}
