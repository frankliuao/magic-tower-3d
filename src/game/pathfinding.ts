// src/game/pathfinding.ts
import { Direction, Tile } from '../types/game';

export interface PathStep {
  x: number;
  y: number;
  dir: Direction;
}

/**
 * 在 11x11 地牢网格中寻找最优、最快的安全通行路径 (BFS 广度优先搜索)
 * 严格避开所有怪物、实体墙体、闭合门与阻挡 NPC
 * 若无通路或目标不可达，返回 null
 */
export function findSafePath(
  layout: (Tile | null)[][],
  start: { x: number; y: number },
  target: { x: number; y: number }
): PathStep[] | null {
  // 1. 基础网格边界校验 (0~10)
  if (
    start.x < 0 ||
    start.x > 10 ||
    start.y < 0 ||
    start.y > 10 ||
    target.x < 0 ||
    target.x > 10 ||
    target.y < 0 ||
    target.y > 10
  ) {
    return null;
  }

  // 2. 起点与目标点重合 -> 无需移动
  if (start.x === target.x && start.y === target.y) {
    return null;
  }

  // 3. 终点格子有效性校验（终点不可为怪物、墙体、闭合门、NPC 等）
  const targetTile = layout[target.y]?.[target.x];
  if (!isWalkableTarget(targetTile)) {
    return null;
  }

  // 4. BFS 广度优先搜索 (无权网格图上严格保证步数最少、路径最优且最快)
  const queue: { x: number; y: number }[] = [{ x: start.x, y: start.y }];
  const cameFrom = new Map<string, { prevX: number; prevY: number; dir: Direction }>();
  const visited = new Set<string>();
  visited.add(`${start.x}_${start.y}`);

  const DIRS: { dx: number; dy: number; dir: Direction }[] = [
    { dx: 0, dy: -1, dir: 'up' },
    { dx: 0, dy: 1, dir: 'down' },
    { dx: -1, dy: 0, dir: 'left' },
    { dx: 1, dy: 0, dir: 'right' },
  ];

  let found = false;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr.x === target.x && curr.y === target.y) {
      found = true;
      break;
    }

    for (let i = 0; i < DIRS.length; i++) {
      const { dx, dy, dir } = DIRS[i];
      const nx = curr.x + dx;
      const ny = curr.y + dy;

      if (nx < 0 || nx > 10 || ny < 0 || ny > 10) continue;

      const key = `${nx}_${ny}`;
      if (visited.has(key)) continue;

      const tile = layout[ny]?.[nx];

      // 若到达目标点（已在前置校验通过）
      if (nx === target.x && ny === target.y) {
        visited.add(key);
        cameFrom.set(key, { prevX: curr.x, prevY: curr.y, dir });
        queue.push({ x: nx, y: ny });
        continue;
      }

      // 中间过渡格子：必须是可通行的安全格子（严格避开怪物、墙体、各色门等）
      if (isWalkableIntermediate(tile)) {
        visited.add(key);
        cameFrom.set(key, { prevX: curr.x, prevY: curr.y, dir });
        queue.push({ x: nx, y: ny });
      }
    }
  }

  if (!found) return null;

  // 5. 反向回溯构建从起点到终点的移动序列
  const path: PathStep[] = [];
  let currX = target.x;
  let currY = target.y;

  while (currX !== start.x || currY !== start.y) {
    const key = `${currX}_${currY}`;
    const info = cameFrom.get(key);
    if (!info) break;

    path.unshift({ x: currX, y: currY, dir: info.dir });
    currX = info.prevX;
    currY = info.prevY;
  }

  return path.length > 0 ? path : null;
}

/**
 * 目标格子是否允许作为点击目的地
 */
function isWalkableTarget(tile?: Tile | null): boolean {
  if (!tile || tile.type === 'floor') return true;
  // 道具格子可直接作为目的地（走过去顺带拾取）
  if (tile.type === 'item') return true;
  // 楼梯可作为目的地
  if (tile.type === 'stairs_up' || tile.type === 'stairs_down') return true;
  return false;
}

/**
 * 路径中间格子是否允许无阻碍安全通行
 */
function isWalkableIntermediate(tile?: Tile | null): boolean {
  if (!tile || tile.type === 'floor') return true;
  // 道具格子在自动寻路途中拾取，不造成碰撞阻挡
  if (tile.type === 'item') return true;
  // 其余阻挡物均不可通过（严格避开怪物、墙体、未开启的门、NPC 与祭坛）
  return false;
}

/**
 * 寻找到达目标对象 (怪物/NPC/门/祭坛) 邻接可交互格子的最短最优安全路径，
 * 以及到达后主角应该面朝的方向 (finalDir)。
 * 适用于：右键双击怪物/NPC/门自动走过去并触发战斗/对话/开门。
 */
export function findPathToAdjacent(
  layout: (Tile | null)[][],
  start: { x: number; y: number },
  target: { x: number; y: number }
): { path: PathStep[]; finalDir: Direction } | null {
  // 1. 基础网格边界校验 (0~10)
  if (
    start.x < 0 || start.x > 10 || start.y < 0 || start.y > 10 ||
    target.x < 0 || target.x > 10 || target.y < 0 || target.y > 10
  ) {
    return null;
  }

  const DIRS: { dx: number; dy: number; dir: Direction; lookAtTargetDir: Direction }[] = [
    { dx: 0, dy: -1, dir: 'up', lookAtTargetDir: 'down' },
    { dx: 0, dy: 1, dir: 'down', lookAtTargetDir: 'up' },
    { dx: -1, dy: 0, dir: 'left', lookAtTargetDir: 'right' },
    { dx: 1, dy: 0, dir: 'right', lookAtTargetDir: 'left' },
  ];

  // 2. 如果玩家已经在目标正相邻位置：直接原地转面朝目标即可交互
  for (const d of DIRS) {
    if (start.x + d.dx === target.x && start.y + d.dy === target.y) {
      return { path: [], finalDir: d.dir };
    }
  }

  // 3. 收集目标 4 个相邻的安全空位
  const validAdjacent: { x: number; y: number; finalDir: Direction }[] = [];
  for (const d of DIRS) {
    const ax = target.x + d.dx;
    const ay = target.y + d.dy;
    if (ax >= 0 && ax <= 10 && ay >= 0 && ay <= 10) {
      const tile = layout[ay]?.[ax];
      if (isWalkableIntermediate(tile)) {
        // 从 (ax, ay) 走向/望向 target 的方向为 d.lookAtTargetDir
        validAdjacent.push({ x: ax, y: ay, finalDir: d.lookAtTargetDir });
      }
    }
  }

  if (validAdjacent.length === 0) {
    return null;
  }

  // 4. 对每个相邻点寻路，找出步数最少的最优安全路径
  let bestResult: { path: PathStep[]; finalDir: Direction } | null = null;
  for (const adj of validAdjacent) {
    const p = findSafePath(layout, start, { x: adj.x, y: adj.y });
    if (p) {
      if (!bestResult || p.length < bestResult.path.length) {
        bestResult = { path: p, finalDir: adj.finalDir };
      }
    }
  }

  return bestResult;
}
