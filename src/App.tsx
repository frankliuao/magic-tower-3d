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
import { ExpShopModal } from './ui/ExpShopModal';
import { DialogueModal } from './ui/DialogueModal';
import { GameOverModal } from './ui/GameOverModal';
import { DebugPanel } from './ui/DebugPanel';
import { InspectCard } from './ui/InspectCard';
import { ConfirmCenterFlyModal } from './ui/ConfirmCenterFlyModal';
import { ConfirmUpFlyModal } from './ui/ConfirmUpFlyModal';
import { ConfirmCoffeeModal } from './ui/ConfirmCoffeeModal';
import { SaveLoadModal } from './ui/SaveLoadModal';
import { MobileBottomDock } from './ui/MobileBottomDock';
import { ZoomIn, ZoomOut, Target, Zap } from 'lucide-react';
import { useI18n, getFloorName } from './i18n';
import { isDebugAllowed } from './utils/env';

interface FloatingItem {
  id: string;
  text: string;
  color: string;
  duration: number;
}

const getToastIcon = (text: string): string => {
  if (/乌贼|Squid/i.test(text)) return '🐙';
  if (/魔王|Demon|魔物/i.test(text)) return '👿';
  if (/吸血鬼|Vampire/i.test(text)) return '🦇';
  if (/骷髅|Skeleton/i.test(text)) return '💀';
  if (/通关|胜|Cleared|Victory|拯救/i.test(text)) return '🏆';
  if (/铁门|牢房|门|Gate|Door/i.test(text)) return '🚪';
  if (/钥匙|Key/i.test(text)) return '🗝️';
  if (/血|HP|生命/i.test(text)) return '❤️';
  if (/攻|ATK|斩|伤害|剑/i.test(text)) return '⚔️';
  if (/防|DEF|盾/i.test(text)) return '🛡️';
  if (/金币|G|Gold|宝|Gem/i.test(text)) return '💰';
  if (/药水|圣水|Potion|Water/i.test(text)) return '🧪';
  if (/密道|传送|Secret|Teleport/i.test(text)) return '🌀';
  if (/强化|功成|参悟|提升|Upgrade/i.test(text)) return '✨';
  if (/存|读|Save|Load/i.test(text)) return '💾';
  if (/不能|无法|不足|缺少|No |Cannot|Too low/i.test(text)) return '⚠️';
  return '✦';
};

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
  const lastFloatingTimeRef = useRef<number>(0);
  const queueOffsetRef = useRef<number>(0);

  // 视口平移与缩放状态
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isPanned, setIsPanned] = useState<boolean>(false);

  // 时空飞行器任意瞬移选点模式与确认弹窗
  const [isTargetingFly, setIsTargetingFly] = useState<boolean>(false);
  const [warpTargetCoord, setWarpTargetCoord] = useState<{ x: number; y: number } | null>(null);
  const [isConfirmCenterFlyOpen, setIsConfirmCenterFlyOpen] = useState<boolean>(false);

  // 向上飞行器确认弹窗
  const [isConfirmUpFlyOpen, setIsConfirmUpFlyOpen] = useState<boolean>(false);

  // Buy Me a Coffee 支持开发者弹窗
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState<boolean>(false);

  // 存盘与读盘多槽位面板状态
  const [saveLoadModalState, setSaveLoadModalState] = useState<{
    isOpen: boolean;
    mode: 'save' | 'load';
  }>({
    isOpen: false,
    mode: 'save',
  });

  // 移动端/窄屏与触屏设备检测 (仅移动端生效，桌面端完全不显示摇杆)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth < 768 ||
      (('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0)) &&
        window.innerWidth < 1024)
    );
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          (('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0)) &&
            window.innerWidth < 1024)
      );
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 手机端全属性滑出抽屉开关
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState<boolean>(false);

  const addFloating = useCallback((text: string, color: string, customDuration?: number) => {
    // 智能推断展示停留时长：保证玩家有充分时间阅读剧情与首领通报，绝不一闪而过
    let duration = customDuration;
    if (!duration) {
      if (/乌贼|魔王|伯爵|队长|陨落|拯救|Squid|Demon|Vampire|Captain|Cleared/i.test(text)) {
        duration = 4500;
      } else if (/铁门|机关|密道|Gate|Door|Secret/i.test(text)) {
        duration = 4200;
      } else if (text.length > 10) {
        duration = 3800;
      } else if (text.length > 6) {
        duration = 3200;
      } else {
        duration = 2600;
      }
    }

    const now = performance.now();
    // 如果与上一条提示在 120ms 内接踵触发（例如击杀首领同时触发战利、首领消灭与机关铁门）
    // 则以 180ms 错峰延时排队依次现身，产生行云流水的层次感，杜绝同时挤压
    if (now - lastFloatingTimeRef.current < 120) {
      queueOffsetRef.current += 180;
    } else {
      queueOffsetRef.current = 0;
    }
    lastFloatingTimeRef.current = now;

    const delay = queueOffsetRef.current;
    const id = Math.random().toString(36).substring(2, 9);

    setTimeout(() => {
      setFloatingTexts((prev) => {
        // 限制屏幕上同时显示的卡片不超过 4 张，超出时移出最老的一张
        const trimmed = prev.length >= 4 ? prev.slice(prev.length - 3) : prev;
        return [...trimmed, { id, text, color, duration }];
      });

      // 独立计时移除当前卡片
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
      }, duration);
    }, delay);
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

  // 监听 GameState 变化与挂载浮动提示回调
  useEffect(() => {
    game.onFloatingText = addFloating;
    const unsubscribe = game.subscribe(forceUpdate);
    return () => {
      game.onFloatingText = undefined;
      unsubscribe();
    };
  }, [game, forceUpdate, addFloating]);

  // 首次用户交互后自动开始播放背景音乐（浏览器自动播放策略要求）
  useEffect(() => {
    const startBGMOnce = () => {
      sound.startBGM();
      window.removeEventListener('keydown', startBGMOnce);
      window.removeEventListener('click', startBGMOnce);
      window.removeEventListener('touchstart', startBGMOnce);
    };
    window.addEventListener('keydown', startBGMOnce);
    window.addEventListener('click', startBGMOnce);
    window.addEventListener('touchstart', startBGMOnce);
    return () => {
      window.removeEventListener('keydown', startBGMOnce);
      window.removeEventListener('click', startBGMOnce);
      window.removeEventListener('touchstart', startBGMOnce);
    };
  }, []);

  // 玩家移动触发器 (自适应绝对网格移动)
  const handleMove = useCallback(
    (cmd: MoveCommand) => {
      game.moveByCommand(
        cmd,
        (x, y, isDoor, newTile) => {
          if (threeEngineRef.current) {
            if (newTile && newTile.type !== 'floor') {
              threeEngineRef.current.spawnTile(
                x,
                y,
                newTile,
                game.getCurrentFloorData().theme,
                game.getCurrentFloorData().layout
              );
            } else {
              threeEngineRef.current.removeTile(x, y, isDoor);
            }
          }
        },
        (txt, col, duration) => addFloating(txt, col, duration)
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

      // 处于【时空飞行器】选点模式中
      if (isTargetingFly) {
        if (gx === game.playerPos.x && gy === game.playerPos.y) {
          sound.playError();
          addFloating(lang === 'zh' ? '勇士已在当前位置！' : 'Already at current position!', '#ef4444');
          return;
        }

        const floor = game.getCurrentFloorData();
        const tile = floor.layout[gy]?.[gx];

        if (!tile || tile.type === 'wall' || tile.type === 'fake_wall' || tile.type === 'lava') {
          sound.playError();
          addFloating(lang === 'zh' ? '目标点为障碍物，无法安全着陆！' : 'Target is blocked by obstacles!', '#ef4444');
          return;
        }

        if (tile.type.startsWith('door_')) {
          sound.playError();
          addFloating(lang === 'zh' ? '目标点为封闭大门，无法直接穿越！' : 'Target is a closed gate!', '#ef4444');
          return;
        }

        if (tile.type === 'monster') {
          sound.playError();
          addFloating(lang === 'zh' ? '目标点盘踞着凶恶怪物，无法安全着陆！' : 'Target is occupied by a monster!', '#ef4444');
          return;
        }

        // 合法目标点：弹出确认弹窗
        setWarpTargetCoord({ x: gx, y: gy });
        setIsConfirmCenterFlyOpen(true);
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
    [game, isTargetingFly, lang, addFloating]
  );

  const handleCloseInspect = useCallback(() => {
    setSelectedTile(null);
    threeEngineRef.current?.setSelectedTile(null, null);
  }, []);

  // 右键双击智能自动寻路 / 交互交锋 (地板自动移动，对象自动走至身前并触发交互)
  const handleEngageOrPath = useCallback(
    (targetX: number, targetY: number) => {
      if (
        isTargetingFly ||
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

    // 绑定单击检视与双击/右键自动寻路/交互事件
    engine.onSelectTile = (gx, gy) => {
      handleSelectTile(gx, gy);
    };

    // 移动端触屏双击自动寻路 (手机无右键，双击地块/物品触发寻路)
    engine.onDoubleClickTile = (gx, gy) => {
      handleEngageOrPath(gx, gy);
    };

    // 电脑端专属：只能右键双击物品或地面开始自动寻路 (左键双击严禁自动寻路)
    engine.onRightDoubleClickTile = (gx, gy) => {
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

  // 确认执行时空瞬移跃迁
  const handleConfirmWarp = useCallback(() => {
    if (!warpTargetCoord) return;
    const { x, y } = warpTargetCoord;
    setIsConfirmCenterFlyOpen(false);
    setIsTargetingFly(false);
    setWarpTargetCoord(null);

    const success = game.useFreeFly(
      x,
      y,
      (tx, ty, isDoor, newTile) => {
        if (threeEngineRef.current) {
          if (newTile && newTile.type !== 'floor') {
            threeEngineRef.current.spawnTile(
              tx,
              ty,
              newTile,
              game.getCurrentFloorData().theme,
              game.getCurrentFloorData().layout
            );
          } else {
            threeEngineRef.current.removeTile(tx, ty, isDoor);
          }
        }
      },
      (txt, col, duration) => addFloating(txt, col, duration)
    );

    if (success && threeEngineRef.current) {
      threeEngineRef.current.updatePlayer(
        game.playerPos.x,
        game.playerPos.y,
        game.playerPos.dir,
        true
      );
    }
  }, [warpTargetCoord, game, addFloating]);

  const handleCancelWarp = useCallback(() => {
    setIsConfirmCenterFlyOpen(false);
    setWarpTargetCoord(null);
  }, []);

  const handleConfirmUpFly = useCallback(() => {
    setIsConfirmUpFlyOpen(false);
    const success = game.useUpFly();
    if (success) {
      const fData = game.getCurrentFloorData();
      if (threeEngineRef.current) {
        threeEngineRef.current.setFloor(fData);
        threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
      }
      game.notify();
    }
  }, [game]);

  // 是否打开了任意模态窗口 / 对话 / 抽屉
  const hasModal =
    isCoffeeModalOpen ||
    isConfirmCenterFlyOpen ||
    isConfirmUpFlyOpen ||
    isSidebarDrawerOpen ||
    saveLoadModalState.isOpen ||
    game.isMonsterManualOpen ||
    game.isFloorTeleportOpen ||
    game.isShopOpen ||
    game.isExpShopOpen ||
    game.isDialogueOpen ||
    game.isGameOver ||
    game.isVictory ||
    game.isDebugOpen;

  // 当任意模态窗口打开时，废除 3D 画布与底层可能残留的指针拖拽与手势状态，停止可能正在进行的自动寻路
  useEffect(() => {
    if (hasModal) {
      stopAutoWalk();
      threeEngineRef.current?.resetPointerState();
    }
  }, [hasModal, stopAutoWalk]);

  // 全局键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.code === 'Escape') {
        if (isSidebarDrawerOpen) {
          setIsSidebarDrawerOpen(false);
          return;
        }
        if (isCoffeeModalOpen) {
          setIsCoffeeModalOpen(false);
          return;
        }
        if (isConfirmUpFlyOpen) {
          setIsConfirmUpFlyOpen(false);
          return;
        }
        if (isConfirmCenterFlyOpen) {
          setIsConfirmCenterFlyOpen(false);
          setWarpTargetCoord(null);
          return;
        }
        if (isTargetingFly) {
          setIsTargetingFly(false);
          setWarpTargetCoord(null);
          addFloating(lang === 'zh' ? '已取消飞行传送' : 'Teleport cancelled', '#94a3b8');
          return;
        }
        handleCloseInspect();
        game.isMonsterManualOpen = false;
        game.isFloorTeleportOpen = false;
        game.isShopOpen = false;
        game.isExpShopOpen = false;
        game.isDebugOpen = false;
        game.notify();
        return;
      }

      if (e.code === 'KeyL' && !game.isDialogueOpen && !game.isShopOpen && !game.isExpShopOpen) {
        game.isMonsterManualOpen = !game.isMonsterManualOpen;
        game.notify();
        return;
      }

      if (e.code === 'KeyG' && !game.isDialogueOpen && !game.isShopOpen && !game.isExpShopOpen) {
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
  }, [
    game,
    handleMove,
    stopAutoWalk,
    addFloating,
    t.spaceResetFloating,
    isCoffeeModalOpen,
    isConfirmCenterFlyOpen,
    isConfirmUpFlyOpen,
    isSidebarDrawerOpen,
    saveLoadModalState.isOpen,
    isTargetingFly,
    handleCloseInspect,
    lang,
  ]);

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

  // 打开多槽位存盘与读盘管理面板
  const handleOpenSaveModal = useCallback(() => {
    setSaveLoadModalState({ isOpen: true, mode: 'save' });
  }, []);

  const handleOpenLoadModal = useCallback(() => {
    setSaveLoadModalState({ isOpen: true, mode: 'load' });
  }, []);

  const handleSaveSuccess = useCallback(
    (slotId: number) => {
      addFloating(t.saveSlotSuccess.replace('{slot}', String(slotId)), '#22c55e');
    },
    [addFloating, t.saveSlotSuccess]
  );

  const handleLoadSuccess = useCallback(
    (slotId: number) => {
      if (threeEngineRef.current) {
        threeEngineRef.current.setFloor(game.getCurrentFloorData());
        threeEngineRef.current.updatePlayer(game.playerPos.x, game.playerPos.y, game.playerPos.dir, true);
      }
      addFloating(t.loadSlotSuccess.replace('{slot}', String(slotId)), '#38bdf8');
    },
    [game, addFloating, t.loadSlotSuccess]
  );

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
    <div className="flex fixed inset-0 w-full h-[100dvh] bg-slate-950 overflow-hidden select-none font-sans">
      {/* 桌面端经典复古状态栏 (宽屏显示，窄屏/手机端隐匿) */}
      <Sidebar
        className="hidden md:flex shrink-0"
        game={game}
        onMove={handleMove}
        onOpenManual={() => {
          game.isMonsterManualOpen = true;
          game.notify();
        }}
        onOpenTeleport={() => {
          game.isFloorTeleportOpen = true;
          game.notify();
        }}
        onUseCenterFly={() => {
          if (game.playerStats.inventory.center_fly) {
            setSelectedTile(null);
            threeEngineRef.current?.setSelectedTile(null, null);
            setIsTargetingFly(true);
            addFloating(
              lang === 'zh'
                ? '【时空飞行器】：请点击地图上任意通畅地面进行传送（按 ESC 取消）'
                : '[Chrono Flyer]: Click any open floor tile on the map to teleport (Press ESC to cancel)',
              '#c084fc',
              4500
            );
          }
        }}
        onUseUpFly={() => {
          if (game.playerStats.inventory.up_fly) {
            setIsConfirmUpFlyOpen(true);
          }
        }}
        onQuickSave={handleOpenSaveModal}
        onQuickLoad={handleOpenLoadModal}
        onRestart={handleRestart}
      />

      {/* 手机端全功能滑出抽屉侧边栏 (点击顶部菜单触发) */}
      {isSidebarDrawerOpen && (
        <div className="fixed inset-0 z-50 flex select-none md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsSidebarDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            <Sidebar
              isDrawer={true}
              onCloseDrawer={() => setIsSidebarDrawerOpen(false)}
              game={game}
              onMove={handleMove}
              onOpenManual={() => {
                game.isMonsterManualOpen = true;
                game.notify();
              }}
              onOpenTeleport={() => {
                game.isFloorTeleportOpen = true;
                game.notify();
              }}
              onUseCenterFly={() => {
                if (game.playerStats.inventory.center_fly) {
                  setSelectedTile(null);
                  threeEngineRef.current?.setSelectedTile(null, null);
                  setIsTargetingFly(true);
                  addFloating(
                    lang === 'zh'
                      ? '【时空飞行器】：请点击地图上任意通畅地面进行传送（按 ESC 取消）'
                      : '[Chrono Flyer]: Click any open floor tile on the map to teleport (Press ESC to cancel)',
                    '#c084fc',
                    4500
                  );
                }
              }}
              onUseUpFly={() => {
                if (game.playerStats.inventory.up_fly) {
                  setIsConfirmUpFlyOpen(true);
                }
              }}
              onQuickSave={handleOpenSaveModal}
              onQuickLoad={handleOpenLoadModal}
              onRestart={handleRestart}
            />
          </div>
        </div>
      )}

      {/* 主游戏展示区 */}
      <div className="flex-1 flex flex-col relative w-full h-full min-h-0 overflow-hidden">
        {/* 顶部工具栏：移动端完全留空以展示完整 3D 地图，桌面端显示标准 Topbar */}
        {!isMobile && (
          <Topbar
            game={game}
            onOpenDebug={() => {
              if (!isDebugAllowed()) return;
              game.isDebugOpen = true;
              game.notify();
            }}
            onRestart={handleRestart}
            onQuickSave={handleOpenSaveModal}
            onQuickLoad={handleOpenLoadModal}
            onOpenCoffeeModal={() => {
              stopAutoWalk();
              setIsCoffeeModalOpen(true);
            }}
          />
        )}

        {/* 3D WebGL Three.js 画布容器 */}
        <div
          ref={canvasContainerRef}
          className="flex-1 w-full min-h-0 relative cursor-grab active:cursor-grabbing select-none overflow-hidden"
          style={{ touchAction: 'none' }}
        >
          {/* 时空飞行器任意瞬移选点模式横幅指示 */}
          {isTargetingFly && (
            <div className="absolute top-[calc(1rem+env(safe-area-inset-top,0px))] inset-x-0 flex justify-center z-50 pointer-events-auto">
              <div className="bg-purple-950/95 border-2 border-purple-400/80 rounded-2xl px-5 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-pulse">
                <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
                <span className="text-sm font-bold text-purple-100">
                  {lang === 'zh'
                    ? '【时空飞行器】：请点击地图上任意通畅地面进行传送'
                    : '[Chrono Flyer]: Click any open floor tile on the map to teleport'}
                </span>
                <button
                  onClick={() => {
                    setIsTargetingFly(false);
                    setWarpTargetCoord(null);
                    addFloating(lang === 'zh' ? '已取消飞行传送' : 'Teleport cancelled', '#94a3b8');
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-all ml-1"
                >
                  {lang === 'zh' ? '取消 (ESC)' : 'Cancel (ESC)'}
                </button>
              </div>
            </div>
          )}
          {/* 屏幕顶部浮动消息通知栈 (垂直自然流排列，错峰登场，杜绝字体重叠与过快消失) */}
          <div className="absolute top-[calc(2.5rem+env(safe-area-inset-top,0px))] inset-x-0 pointer-events-none flex flex-col items-center gap-2.5 z-40 px-4">
            {floatingTexts.map((item) => (
              <div
                key={item.id}
                className="floating-toast-card pointer-events-none select-none flex items-center gap-3 px-5 py-2.5 rounded-2xl backdrop-blur-md bg-slate-950/90 border shadow-2xl transition-all max-w-[90vw] md:max-w-xl"
                style={{
                  borderColor: `${item.color}55`,
                  boxShadow: `0 10px 30px rgba(0, 0, 0, 0.7), 0 0 18px ${item.color}33`,
                  animation: `toast-enter-fade ${item.duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                }}
              >
                <span className="text-xl select-none shrink-0 filter drop-shadow">
                  {getToastIcon(item.text)}
                </span>
                <span
                  className="text-sm md:text-base font-extrabold font-sans tracking-wide leading-tight drop-shadow text-center"
                  style={{ color: item.color }}
                >
                  {item.text}
                </span>
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
              onEngage={(x, y) => {
                handleCloseInspect();
                handleEngageOrPath(x, y);
              }}
            />
          )}


          {/* 桌面端专属：底部左侧快捷键提示与空格复位提示 */}
          {!isMobile && (
            <div className="absolute bottom-3 left-4 flex flex-col gap-2 select-none z-10">
              {/* 闪烁的空格复位勇士提示 */}
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
          )}

          {/* 桌面端专属：底部右侧缩放控制栏 */}
          {!isMobile && (
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
          )}
        </div>

        {/* 手机端专属：底部一体化操作与状态面板 (与 3D 地图零重叠) */}
        {isMobile && (
          <MobileBottomDock
            game={game}
            onMove={handleMove}
            getYaw={() => (threeEngineRef.current ? threeEngineRef.current.getCameraYaw() : 0)}
            onResetCamera={() => {
              threeEngineRef.current?.resetCameraView();
              addFloating(t.spaceResetFloating, '#38bdf8');
            }}
            onOpenDrawer={() => setIsSidebarDrawerOpen(true)}
            onOpenCoffeeModal={() => {
              stopAutoWalk();
              setIsCoffeeModalOpen(true);
            }}
            onOpenManual={() => {
              game.isMonsterManualOpen = true;
              game.notify();
            }}
            onOpenTeleport={() => {
              game.isFloorTeleportOpen = true;
              game.notify();
            }}
            onQuickSave={handleOpenSaveModal}
            onQuickLoad={handleOpenLoadModal}
            disabled={hasModal}
          />
        )}
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

      {/* 弹窗层：经验老人修行加点 */}
      {game.isExpShopOpen && (
        <ExpShopModal
          game={game}
          onClose={() => {
            game.isExpShopOpen = false;
            game.notify();
          }}
          onBuy={(type) => {
            const ok = game.buyExpUpgrade(type);
            if (ok) {
              addFloating(t.expSuccessFloating, '#10b981');
            } else {
              addFloating(t.expNotEnough, '#f87171');
            }
          }}
        />
      )}

      {/* 弹窗层：NPC 剧情对话 */}
      {game.isDialogueOpen && (
        <DialogueModal
          game={game}
          onClose={() => {
            game.closeDialogue((x, y, isDoor) => {
              if (threeEngineRef.current) {
                threeEngineRef.current.removeTile(x, y, isDoor);
              }
            });
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
          onLoadLastSave={handleOpenLoadModal}
        />
      )}

      {/* 弹窗层：调试作弊控制台 (严格限制在本地环境展示，生产与 GitHub Pages 绝对不挂载) */}
      {game.isDebugOpen && isDebugAllowed() && (
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

      {/* 弹窗层：时空飞行器使用确认弹窗 */}
      <ConfirmCenterFlyModal
        isOpen={isConfirmCenterFlyOpen}
        targetCoord={warpTargetCoord}
        onConfirm={handleConfirmWarp}
        onCancel={handleCancelWarp}
      />

      {/* 弹窗层：向上飞行器使用确认弹窗 */}
      <ConfirmUpFlyModal
        isOpen={isConfirmUpFlyOpen}
        currentFloor={game.currentFloor}
        onConfirm={handleConfirmUpFly}
        onCancel={() => setIsConfirmUpFlyOpen(false)}
      />

      {/* 弹窗层：Buy Me a Coffee 支持开发者弹窗 */}
      <ConfirmCoffeeModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
      />

      {/* 弹窗层：多槽位存盘与读盘管理面板 */}
      <SaveLoadModal
        isOpen={saveLoadModalState.isOpen}
        initialMode={saveLoadModalState.mode}
        game={game}
        onClose={() => setSaveLoadModalState((prev) => ({ ...prev, isOpen: false }))}
        onSaveSuccess={handleSaveSuccess}
        onLoadSuccess={handleLoadSuccess}
      />
    </div>
  );
};

export default App;
