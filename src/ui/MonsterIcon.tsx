import React from 'react';
import { MonsterThumbnailRenderer } from '../engine/MonsterThumbnailRenderer';

interface MonsterIconProps {
  monsterId: string;
  name: string;
  color: string;
  className?: string;
}

/**
 * 怪物 3D 肖像。怪物手册与单击检视卡共用同一套离屏缩略图。
 */
export const MonsterIcon: React.FC<MonsterIconProps> = ({
  monsterId,
  name,
  color,
  className = 'w-14 h-14',
}) => {
  const thumb = MonsterThumbnailRenderer.getThumbnail(monsterId);

  return (
    <div
      className={`${className} rounded-xl flex items-center justify-center bg-slate-900/90 border border-slate-700/80 shadow-inner overflow-hidden relative group shrink-0`}
    >
      {thumb ? (
        <img
          src={thumb}
          alt={name}
          className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-200 group-hover:scale-110"
        />
      ) : (
        <div
          className="w-full h-full rounded-lg flex items-center justify-center font-bold text-white shadow-md text-base"
          style={{ backgroundColor: color }}
        >
          {name.substring(0, 1)}
        </div>
      )}
    </div>
  );
};
