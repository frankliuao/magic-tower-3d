// src/ui/VirtualJoystick.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Direction } from '../types/game';
import { getCameraAdaptedDirection } from '../game/gameState';

interface VirtualJoystickProps {
  onMove: (dir: Direction) => void;
  getYaw?: () => number;
  disabled?: boolean;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  getYaw,
  disabled = false,
}) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeDir, setActiveDir] = useState<Direction | null>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const activeDirRef = useRef<Direction | null>(null);
  activeDirRef.current = activeDir;

  const repeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 清除行走定时器
  const clearRepeatTimer = useCallback(() => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  }, []);

  // 根据当前摇杆偏向计算真实移动方向（结合 3D 相机朝向）
  const triggerStep = useCallback(
    (screenDir: 'up' | 'down' | 'left' | 'right') => {
      const yaw = getYaw ? getYaw() : 0;
      const worldDir = getCameraAdaptedDirection(screenDir, yaw);
      onMove(worldDir);
    },
    [getYaw, onMove]
  );

  // 释放/重置
  const handleRelease = useCallback(() => {
    setIsPressed(false);
    setKnobPos({ x: 0, y: 0 });
    setActiveDir(null);
    clearRepeatTimer();
  }, [clearRepeatTimer]);

  useEffect(() => {
    return () => {
      clearRepeatTimer();
    };
  }, [clearRepeatTimer]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch (_) {}

    setIsPressed(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressed && e.type !== 'pointerdown') return;
    if (!baseRef.current || disabled) return;

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    const maxRadius = 36;
    const deadZone = 11;

    // 限制摇杆旋钮在底盘圆周内
    let kx = deltaX;
    let ky = deltaY;
    if (dist > maxRadius) {
      kx = (deltaX / dist) * maxRadius;
      ky = (deltaY / dist) * maxRadius;
    }
    setKnobPos({ x: kx, y: ky });

    if (dist < deadZone) {
      if (activeDirRef.current !== null) {
        setActiveDir(null);
        clearRepeatTimer();
      }
      return;
    }

    // 计算角度 (-180° ~ +180°)
    const angleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    let dir: 'up' | 'down' | 'left' | 'right';
    if (angleDeg >= -45 && angleDeg < 45) {
      dir = 'right';
    } else if (angleDeg >= 45 && angleDeg < 135) {
      dir = 'down';
    } else if (angleDeg >= -135 && angleDeg < -45) {
      dir = 'up';
    } else {
      dir = 'left';
    }

    if (activeDirRef.current !== dir) {
      setActiveDir(dir);
      clearRepeatTimer();
      // 立即行走一步
      triggerStep(dir);

      // 开启长按平滑连续走步定时器 (约 190ms 一步)
      repeatTimerRef.current = setInterval(() => {
        if (activeDirRef.current) {
          triggerStep(activeDirRef.current);
        }
      }, 190);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    handleRelease();
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-32 h-32 select-none touch-none rounded-full bg-slate-950/70 border-2 border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center justify-center pointer-events-auto"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* 4 方向指示图标 */}
      <span
        className={`absolute top-1.5 text-xs font-bold transition-colors ${
          activeDir === 'up' ? 'text-amber-400 scale-125' : 'text-slate-500'
        }`}
      >
        ▲
      </span>
      <span
        className={`absolute bottom-1.5 text-xs font-bold transition-colors ${
          activeDir === 'down' ? 'text-amber-400 scale-125' : 'text-slate-500'
        }`}
      >
        ▼
      </span>
      <span
        className={`absolute left-2 text-xs font-bold transition-colors ${
          activeDir === 'left' ? 'text-amber-400 scale-125' : 'text-slate-500'
        }`}
      >
        ◀
      </span>
      <span
        className={`absolute right-2 text-xs font-bold transition-colors ${
          activeDir === 'right' ? 'text-amber-400 scale-125' : 'text-slate-500'
        }`}
      >
        ▶
      </span>

      {/* 中心十字底纹 */}
      <div className="absolute w-12 h-12 rounded-full border border-dashed border-slate-700/60 pointer-events-none" />

      {/* 摇杆可移动手柄 (Knob) */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-75 pointer-events-none ${
          isPressed
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200/90 shadow-amber-500/30 scale-105'
            : 'bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-500/70 opacity-80'
        }`}
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      >
        <div
          className={`w-4 h-4 rounded-full ${
            isPressed ? 'bg-amber-100 shadow-inner' : 'bg-slate-400/80'
          }`}
        />
      </div>
    </div>
  );
};
