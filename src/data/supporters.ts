// src/data/supporters.ts

export interface Supporter {
  /** 赞助者姓名 / 昵称 */
  name: string;
  /** 打赏日期 (例如 '2026-10-26') */
  date?: string;
  /** 赞助者留言寄语 */
  message?: string;
}

/**
 * 英雄赞助榜 (Hero Supporters Board)
 *
 * 当有热心玩家在 Buy Me a Coffee (https://buymeacoffee.com/frankliuao) 打赏赞助并愿留名时，
 * 只需要在此列表中按格式添加一行，游戏 0F「英雄赞助榜」便会自动优雅排版展示！
 *
 * 所有赞助者一视同仁，共同铭刻在魔塔英雄榜上！
 *
 * 示例：
 * { name: '勇者小明', date: '2026-10-26', message: '童年回忆，制作太棒了！' },
 */
export const SUPPORTERS: Supporter[] = [
  {
    name: 'Someone',
    date: '2026-10-26',
    message: 'Like your Magic tower. Keep up the good work',
  },
];
