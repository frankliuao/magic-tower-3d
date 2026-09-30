// src/App.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, getCameraAdaptedDirection } from './game/gameState';
import { ThreeCanvas } from './engine/ThreeCanvas';
import { Direction, MoveCommand, Tile } from './types/game';
import { findSafePath, findPathToAdjacent } from './game/pathfinding';
import { sound } from './audio/sound';
import { Sidebar } from './ui/Sidebar';
import { Topbar } from './ui/Topbar';
import { MonsterManual } from './ui/MonsterManual';
import { FloorTeleport } from './ui/FloorTeleport';
import { ShopModal } from './ui/ShopModal';
import { DialogueModal } from './ui/DialogueModal';
import { GameOverModal } from './ui/GameOverModal';
import { DebugPanel } from './ui/DebugPanel';
import { InspectCard } from './ui/InspectCard';
import { ZoomIn, ZoomOut, Target } from 'lucide-react';
import { useI18n, getFloorName } from './i18n';

interface FloatingItem {
  id: string;
  text: string;
  color: string;
}

export const App: React.FC = () => {
  const { lang, t } = useI18n();

  // 核心单例游戏引擎与状态
  const gameRef = useRef<GameState | null>(null);
  if (!gameRef.current) {
    gameRef.current = new GameState();
  }
  const game = gameRef.current;

  // 同步当前语言至游戏核心状态
  useEffect(() => {
    game.setLanguage(lang);
  }, [lang, game]);

  // React 状态同步
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  // 3D 渲染画布容器
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const threeEngineRef = useRef<ThreeCanvas | null>(null);

  // 自动寻路状态与计时器
  const autoWalkTimerRef = useRef<number | null>(null);

  // 浮动伤害与提示文本
  const [floatingTexts, setFloatingTexts] = useState<FloatingItem[]>([]);
  // 视口平移与缩放状态
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isPanned, setIsPanned] = useState<boolean>(false);

  const addFloating = useCallback((text: string, color: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingTexts((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  }, []);

  // 停止自动寻路
  const stopAutoWalk = useCallback(() => {
    if (autoWalkTimerRef.current !== null) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
    }
    if (threeEngineRef.current) {
      threeEngineRef.current.clearPathTarget();
    }
  }, []);

  // 监听 GameState 变化
  useEffect(() => {
    return game.subscribe(forceUpdate);
  }, [game, forceUpdate]);

  // 玩家移动触发器 (自适应绝对网格移动)
  const handleMove = useCallback(
    (cmd: MoveCommand) => {
      game.moveByCommand(
        cmd,
        (x, y, isDoor) => {
          if (threeEngineRef.current) {
            threeEngineRef.current.removeTile(x, y, isDoor);
          }
        },
        (txt, col) => addFloating(txt, col)
      );

      // 通知 3D 角色与摄像机平滑更新位置与朝向
      if (threeEngineRef.current) {
        threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir);
      }
    },
    [game, addFloating]
  );

  // 选中的瓦片 (单机检视)
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number; tile: Tile | null } | null>(null);

  const handleSelectTile = useCallback(
    (gx: number, gy: number) => {
      if (gx < 0 || gx > 10 || gy < 0 || gy > 10) {
        setSelectedTile(null);
        threeEngineRef.current?.setSelectedTile(null, null);
        return;
      }

      const floor = game.getCurrentFloorData();
      const tile = floor.layout[gy]?.[gx] || null;

      // 左键点击地板 (普通空地)：检视窗口消失并取消选中
      if (!tile || tile.type === 'floor') {
        setSelectedTile(null);
        threeEngineRef.current?.setSelectedTile(null, null);
        return;
      }

      // 左键点击 Object (怪物、NPC、道具、门、传送光圈、商店、熔岩、墙壁等)：弹出窗口显示信息
      setSelectedTile({ x: gx, y: gy, tile });
      threeEngineRef.current?.setSelectedTile(gx, gy);
    },
    [game]
  );

  const handleCloseInspect = useCallback(() => {
    setSelectedTile(null);
    threeEngineRef.current?.setSelectedTile(null, null);
  }, []);

  // 右键双击智能自动寻路 / 交互交锋 (地板自动移动，对象自动走至身前并触发交互)
  const handleEngageOrPath = useCallback(
    (targetX: number, targetY: number) => {
      if (
        game.isDialogueOpen ||
        game.isShopOpen ||
        game.isMonsterManualOpen ||
        game.isFloorTeleportOpen ||
        game.isGameOver ||
        game.isVictory
      ) {
        return;
      }

      stopAutoWalk();

      const floor = game.getCurrentFloorData();
      const targetTile = floor.layout[targetY]?.[targetX];
      const playerPos = { x: game.playerPos.x, y: game.playerPos.y };

      // 若点击位置与玩家当前位置相同
      if (playerPos.x === targetX && playerPos.y === targetY) {
        return;
      }

      // 1. 空地面或楼梯传送门：直接自动寻路前往目标格子
      const isDirectWalkable =
        !targetTile ||
        targetTile.type === 'floor' ||
        targetTile.type === 'stairs_up' ||
        targetTile.type === 'stairs_down';

      if (isDirectWalkable) {
        const path = findSafePath(floor.layout, playerPos, { x: targetX, y: targetY });
        if (!path || path.length === 0) {
          sound.playError();
          addFloating(lang === 'zh' ? '无可用安全通路！' : 'No safe path available!', '#f87171');
          return;
        }

        if (threeEngineRef.current) {
          threeEngineRef.current.setPathTarget(targetX, targetY);
        }

        let stepIndex = 0;
        autoWalkTimerRef.current = window.setInterval(() => {
          if (
            stepIndex >= path.length ||
            game.isDialogueOpen ||
            game.isShopOpen ||
            game.isGameOver ||
            game.isVictory
          ) {
            stopAutoWalk();
            return;
          }

          const step = path[stepIndex++];
          handleMove(step.dir);

          if (stepIndex >= path.length) {
            stopAutoWalk();
          }
        }, 115);
        return;
      }

      // 2. 道具：可直接寻路踩上去拾取
      if (targetTile.type === 'item') {
        const directPath = findSafePath(floor.layout, playerPos, { x: targetX, y: targetY });
        if (directPath && directPath.length > 0) {
          if (threeEngineRef.current) {
            threeEngineRef.current.setPathTarget(targetX, targetY);
          }
          let stepIndex = 0;
          autoWalkTimerRef.current = window.setInterval(() => {
            if (
              stepIndex >= directPath.length ||
              game.isDialogueOpen ||
              game.isShopOpen ||
              game.isGameOver ||
              game.isVictory
            ) {
              stopAutoWalk();
              return;
            }

            const step = directPath[stepIndex++];
            handleMove(step.dir);

            if (stepIndex >= directPath.length) {
              stopAutoWalk();
            }
          }, 115);
          return;
        }
      }

      // 3. 目标为实体对象 (怪物、NPC、门、商店、道具阻挡)：自动寻路至正前方并立即触发交互！
      const adj = findPathToAdjacent(floor.layout, playerPos, { x: targetX, y: targetY });
      if (!adj) {
        sound.playError();
        addFloating(lang === 'zh' ? '无可用安全路径靠近！' : 'No safe path to reach target!', '#f87171');
        return;
      }

      // 已经在正前方相邻格子：直接原地转向并触发交互
      if (adj.path.length === 0) {
        handleMove(adj.finalDir);
        return;
      }

      if (threeEngineRef.current) {
        threeEngineRef.current.setPathTarget(targetX, targetY);
      }

      let stepIndex = 0;
      autoWalkTimerRef.current = window.setInterval(() => {
        if (
          game.isDialogueOpen ||
          game.isShopOpen ||
          game.isGameOver ||
          game.isVictory
        ) {
          stopAutoWalk();
          return;
        }

        if (stepIndex < adj.path.length) {
          const step = adj.path[stepIndex++];
          handleMove(step.dir);
        } else {
          // 到达目标正前方，执行最后的交互踏步/交锋
          stopAutoWalk();
          handleMove(adj.finalDir);
        }
      }, 115);
    },
    [game, handleMove, stopAutoWalk, addFloating, lang]
  );

  // 初始化 Three.js 引擎
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const engine = new ThreeCanvas(canvasContainerRef.current);
    threeEngineRef.current = engine;

    engine.onCameraStateChange = (zoom, panned) => {
      setZoomLevel(zoom);
      setIsPanned(panned);
    };

    // 绑定单击检视与右键双击自动寻路/交互事件
    engine.onSelectTile = (gx, gy) => {
      handleSelectTile(gx, gy);
    };

    engine.onRightDoubleClickTile = (gx, gy) => {
      handleEngageOrPath(gx, gy);
    };

    engine.onRightClickTile = (gx, gy) => {
      handleEngageOrPath(gx, gy);
    };

    // 初始载入地图与玩家位置
    engine.setFloor(game.getCurrentFloorData());
    engine.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);

    return () => {
      stopAutoWalk();
      engine.dispose();
      threeEngineRef.current = null;
    };
  }, [handleSelectTile, handleEngageOrPath, stopAutoWalk]);

  // 当楼层变化时同步 3D 地图与玩家位置
  const lastFloorRef = useRef(game.currentFloor);
  useEffect(() => {
    if (threeEngineRef.current && lastFloorRef.current !== game.currentFloor) {
      stopAutoWalk();
      handleCloseInspect();
      lastFloorRef.current = game.currentFloor;
      threeEngineRef.current.setFloor(game.getCurrentFloorData());
      threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
    }
  }, [game.currentFloor, stopAutoWalk, handleCloseInspect]);

  // 全局键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 打开任意模态窗口时拦截普通方向移动
      const hasModal =
        game.isMonsterManualOpen ||
        game.isFloorTeleportOpen ||
        game.isShopOpen ||
        game.isDialogueOpen ||
        game.isGameOver ||
        game.isVictory ||
        game.isDebugOpen;

      if (e.code === 'Escape') {
        handleCloseInspect();
        game.isMonsterManualOpen = false;
        game.isFloorTeleportOpen = false;
        game.isShopOpen = false;
        game.isDebugOpen = false;
        game.notify();
        return;
      }

      if (e.code === 'KeyL' && !game.isDialogueOpen && !game.isShopOpen) {
        game.isMonsterManualOpen = !game.isMonsterManualOpen;
        game.notify();
        return;
      }

      if (e.code === 'KeyG' && !game.isDialogueOpen && !game.isShopOpen) {
        game.isFloorTeleportOpen = !game.isFloorTeleportOpen;
        game.notify();
        return;
      }

      if (e.code === 'Space' && !hasModal) {
        e.preventDefault();
        threeEngineRef.current?.resetCameraView();
        addFloating(t.spaceResetFloating, '#38bdf8');
        return;
      }

      if (hasModal) return;

      const getDir = (screenDir: 'up' | 'down' | 'left' | 'right'): Direction => {
        const yaw = threeEngineRef.current ? threeEngineRef.current.getCameraYaw() : 0;
        return getCameraAdaptedDirection(screenDir, yaw);
      };

      if (e.code === 'ArrowUp') {
        e.preventDefault();
        stopAutoWalk();
        handleMove(getDir('up'));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        stopAutoWalk();
        handleMove(getDir('down'));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stopAutoWalk();
        handleMove(getDir('left'));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stopAutoWalk();
        handleMove(getDir('right'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game, handleMove, stopAutoWalk, addFloating, t.spaceResetFloating]);

  // 重新开始游戏
  const handleRestart = useCallback(() => {
    if (window.confirm(t.restartConfirm)) {
      game.initGame();
      if (threeEngineRef.current) {
        threeEngineRef.current.setFloor(game.getCurrentFloorData());
        threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
      }
    }
  }, [game, t.restartConfirm]);

  // 快速存读档
  const handleQuickSave = useCallback(() => {
    game.saveGame(1);
    addFloating(t.savedSuccess, '#22c55e');
  }, [game, addFloating, t.savedSuccess]);

  const handleQuickLoad = useCallback(() => {
    const success = game.loadGame(1);
    if (success) {
      if (threeEngineRef.current) {
        threeEngineRef.current.setFloor(game.getCurrentFloorData());
        threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
      }
      addFloating(t.loadSuccess, '#38bdf8');
    } else {
      addFloating(t.noSaveFound, '#f87171');
    }
  }, [game, addFloating, t.loadSuccess, t.noSaveFound]);

  // 罗盘楼层传送
  const handleTeleport = useCallback(
    (floor: number) => {
      game.currentFloor = floor;
      const fData = game.getCurrentFloorData();
      game.playerPos.x = fData.downStairsPos.x;
      game.playerPos.y = fData.downStairsPos.y;
      if (threeEngineRef.current) {
        threeEngineRef.current.setFloor(fData);
        threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
      }
      game.notify();
      addFloating(`${t.teleportedToPrefix}${getFloorName(floor, lang)}`, '#06b6d4');
    },
    [game, addFloating, t.teleportedToPrefix, lang]
  );

  // 调试一键清怪
  const handleClearMonsters = useCallback(() => {
    const fData = game.getCurrentFloorData();
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        if (fData.layout[y][x]?.type === 'monster') {
          fData.layout[y][x] = { type: 'floor' };
          if (threeEngineRef.current) {
            threeEngineRef.current.removeTile(x, y, false);
          }
        }
      }
    }
    game.notify();
    addFloating(t.clearedMonstersFloating, '#a855f7');
  }, [game, addFloating, t.clearedMonstersFloating]);

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden select-none font-sans">
      {/* 左侧经典复古状态栏 */}
      <Sidebar game={game} onMove={handleMove} />

      {/* 主游戏展示区 */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* 顶部工具栏 */}
        <Topbar
          game={game}
          onOpenManual={() => {
            game.isMonsterManualOpen = true;
            game.notify();
          }}
          onOpenTeleport={() => {
            game.isFloorTeleportOpen = true;
            game.notify();
          }}
          onOpenDebug={() => {
            game.isDebugOpen = true;
            game.notify();
          }}
          onRestart={handleRestart}
          onQuickSave={handleQuickSave}
          onQuickLoad={handleQuickLoad}
        />

        {/* 3D WebGL Three.js 画布容器 */}
        <div
          ref={canvasContainerRef}
          className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
        >
          {/* 屏幕中央浮动战斗战损与提示数字 */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {floatingTexts.map((item) => (
              <div
                key={item.id}
                className="absolute text-lg font-black font-mono tracking-wider floating-text-anim"
                style={{ color: item.color }}
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* 选中华丽检视卡片 */}
          {selectedTile && (
            <InspectCard
              tile={selectedTile.tile}
              gridX={selectedTile.x}
              gridY={selectedTile.y}
              game={game}
              onClose={handleCloseInspect}
            />
          )}

          {/* 底部左侧：操作快捷键提示与空格复位提示 */}
          <div className="absolute bottom-3 left-4 flex flex-col gap-2 select-none z-10">
            {/* 闪烁的空格复位勇士提示 (在图像下方，在控制提示上方) */}
            <button
              onClick={() => {
                threeEngineRef.current?.resetCameraView();
                addFloating(t.spaceResetFloating, '#38bdf8');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/60 rounded-xl text-amber-300 text-xs font-semibold backdrop-blur-md shadow-lg animate-pulse w-fit pointer-events-auto cursor-pointer transition-all active:scale-95"
              title={t.spaceResetBtnTitle}
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {t.pressKey}
                <strong className="font-mono bg-amber-400/30 text-amber-200 px-1.5 py-0.5 rounded">
                  {t.spaceResetKey}
                </strong>{' '}
                {t.spaceResetText}
              </span>
            </button>

            {/* 控制提示栏 */}
            <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl px-3.5 py-1.5 backdrop-blur-sm text-[11px] text-slate-300 flex items-center gap-2.5 shadow-lg pointer-events-none">
              <span>{t.hintMove}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintInspect}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintPath}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintPan}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintRotate}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintZoom}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintManual}</span>
              <span className="text-slate-600">|</span>
              <span>{t.hintCompass}</span>
            </div>
          </div>

          {/* 底部右侧：缩放控制栏 */}
          <div className="absolute bottom-3 right-4 flex items-center gap-2 z-10 select-none">
            <div className="flex items-center bg-slate-900/85 border border-slate-700/80 rounded-xl px-1.5 py-1 backdrop-blur-md shadow-lg text-slate-300 gap-0.5">
              <button
                onClick={() => threeEngineRef.current?.zoomOut()}
                className="p-1.5 hover:bg-slate-800 active:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all ml-1"
                title={t.zoomOutTip}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  threeEngineRef.current?.resetCameraView();
                  addFloating(t.zoomResetFloating, '#38bdf8');
                }}
                className="px-2 py-1 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 transition-all hover:bg-slate-800/60 rounded"
                title={t.zoomResetTip}
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => threeEngineRef.current?.zoomIn()}
                className="p-1.5 hover:bg-slate-800 active:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
                title={t.zoomInTip}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗层：怪物手册 */}
      {game.isMonsterManualOpen && (
        <MonsterManual
          game={game}
          onClose={() => {
            game.isMonsterManualOpen = false;
            game.notify();
          }}
        />
      )}

      {/* 弹窗层：楼层传送 */}
      {game.isFloorTeleportOpen && (
        <FloorTeleport
          game={game}
          onClose={() => {
            game.isFloorTeleportOpen = false;
            game.notify();
          }}
          onTeleport={handleTeleport}
        />
      )}

      {/* 弹窗层：神坛加点 */}
      {game.isShopOpen && (
        <ShopModal
          game={game}
          onClose={() => {
            game.isShopOpen = false;
            game.notify();
          }}
          onBuy={(type) => {
            const ok = game.buyShopUpgrade(type);
            if (ok) {
              addFloating(t.shopSuccessFloating, '#facc15');
            } else {
              addFloating(t.shopNotEnoughGold, '#f87171');
            }
          }}
        />
      )}

      {/* 弹窗层：NPC 剧情对话 */}
      {game.isDialogueOpen && (
        <DialogueModal
          game={game}
          onClose={() => {
            game.isDialogueOpen = false;
            game.notify();
          }}
        />
      )}

      {/* 弹窗层：胜利 / 失败结算 */}
      {(game.isGameOver || game.isVictory) && (
        <GameOverModal
          game={game}
          onRestart={() => {
            game.initGame();
            if (threeEngineRef.current) {
              threeEngineRef.current.setFloor(game.getCurrentFloorData());
              threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
            }
          }}
          onLoadLastSave={handleQuickLoad}
        />
      )}

      {/* 弹窗层：调试作弊控制台 */}
      {game.isDebugOpen && (
        <DebugPanel
          game={game}
          onClose={() => {
            game.isDebugOpen = false;
            game.notify();
          }}
          onJumpFloor={handleTeleport}
          onClearMonsters={handleClearMonsters}
        />
      )}
    </div>
  );
};

export default App;
