// src/utils/env.ts
declare const process: any;

export interface EnvContext {
  env?: {
    VITE_ENABLE_DEBUG?: string | boolean;
    VITE_ENABLE_CHEAT?: string | boolean;
    DEV?: boolean;
    NODE_ENV?: string;
  };
  location?: {
    hostname?: string;
    protocol?: string;
    search?: string;
  };
}

/**
 * 判断当前环境是否允许启用开发者调试/作弊控制台。
 *
 * 核心机制（双通道灵活控制）：
 *
 * 渠道 1：免重构即时开启（URL 秘籍通道）
 * - 无论是本地还是 GitHub Pages 线上，访问带有 ?cheat=1 或 ?debug=true 等参数的网址时，
 *   立即开启作弊器！
 * - 适用场景：线上默认保持无作弊状态（正规玩家访问正常游戏），作者想给特定玩家爽玩时，
 *   只需直接分享带参数链接：https://frankliuao.github.io/magic-tower-3d/?cheat=1，零等待秒开！
 *
 * 渠道 2：构建级环境变量配置（VITE_ENABLE_DEBUG）
 * - 本地开发：通过本地 .env.local 传递 VITE_ENABLE_DEBUG=true（或一键改 false 测试原版）。
 * - GitHub Pages 部署：
 *   * 默认：.env 中为 VITE_ENABLE_DEBUG=false（保障正常玩家体验）；
 *   * 偶尔全员开启：在 GitHub 仓库 Settings -> Variables 中将 VITE_ENABLE_DEBUG 设为 true，
 *     或在 Actions 界面点击 "Run workflow" 勾选 enable_debug 开关，重新构建后线上全员开放。
 *
 * 渠道 3：本地开发模式与本地主机名自动兜底（DEV / localhost / 127.0.0.1 / file:）
 */
export function isDebugAllowed(ctx?: EnvContext | { location?: { hostname?: string; protocol?: string; search?: string } }): boolean {
  const loc = ctx?.location ?? (typeof window !== 'undefined' ? window.location : undefined);
  const search = loc?.search ?? '';

  // 1. URL 秘籍通道：检测 ?cheat=1, ?cheat=true, ?debug=1, ?debug=true
  if (
    search.includes('cheat=1') ||
    search.includes('cheat=true') ||
    search.includes('debug=1') ||
    search.includes('debug=true')
  ) {
    return true;
  }

  // 2. 提取环境变量来源（上下文注入 -> Vite import.meta.env -> Node process.env）
  const envSource: any =
    (ctx && 'env' in ctx ? ctx.env : undefined) ??
    (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) ??
    (typeof process !== 'undefined' ? process.env : undefined);

  const debugFlag = envSource?.VITE_ENABLE_DEBUG ?? envSource?.VITE_ENABLE_CHEAT;

  if (debugFlag !== undefined && debugFlag !== null && debugFlag !== '') {
    const isExplicitTrue = debugFlag === 'true' || debugFlag === '1' || debugFlag === true;
    if (isExplicitTrue) {
      return true;
    }

    const isExplicitFalse = debugFlag === 'false' || debugFlag === '0' || debugFlag === false;
    if (isExplicitFalse) {
      return false;
    }
  }

  // 3. Vite 本地开发模式 (DEV)
  if (envSource?.DEV === true) {
    return true;
  }

  // 4. 本地主机名检测 (支持本地静态文件运行或本地 preview 服务)
  const host = loc?.hostname ?? '';
  const protocol = loc?.protocol ?? '';

  const isLocalHost =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '[::1]' ||
    protocol === 'file:';

  return isLocalHost;
}
