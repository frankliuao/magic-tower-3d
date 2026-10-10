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
  };
}

/**
 * 判断当前环境是否允许启用开发者调试/作弊控制台。
 *
 * 核心机制（.env.local 参数与环境变量驱动）：
 * 1. 优先读取 Vite 环境变量 VITE_ENABLE_DEBUG：
 *    - 本地开发：通过本地配置文件 `.env.local`（已在 .gitignore 忽略，绝不会提交至 GitHub）
 *      传递 `VITE_ENABLE_DEBUG=true`（若想本地体验纯正通关，亦可一键改为 false）。
 *    - 生产部署 / GitHub Pages：由于 Git 仓库中没有 `.env.local`，Vite 默认读取 `.env`，
 *      其设定为 `VITE_ENABLE_DEBUG=false`，构建产物中作弊与调试控制台 100% 物理熔断。
 *
 * 2. 多重防线（Defense in Depth）：
 *    - 若环境变量显式设为 'false'，无条件禁用；
 *    - 若设置了 'true'，但在公网生产域名（如 *.github.io）下运行，自动触发生产安全熔断；
 *    - 若未配置环境变量，按本地开发模式 (DEV) 及 localhost / 127.0.0.1 / file: 协议兜底。
 */
export function isDebugAllowed(ctx?: EnvContext | { location?: { hostname?: string; protocol?: string } }): boolean {
  // 提取环境变量来源（上下文注入 -> Vite import.meta.env -> Node process.env）
  const envSource: any =
    (ctx && 'env' in ctx ? ctx.env : undefined) ??
    (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) ??
    (typeof process !== 'undefined' ? process.env : undefined);

  const debugFlag = envSource?.VITE_ENABLE_DEBUG ?? envSource?.VITE_ENABLE_CHEAT;

  const loc = ctx?.location ?? (typeof window !== 'undefined' ? window.location : undefined);
  const host = loc?.hostname ?? '';
  const protocol = loc?.protocol ?? '';

  // 1. 如果通过环境变量显式声明（.env / .env.local）
  if (debugFlag !== undefined && debugFlag !== null && debugFlag !== '') {
    const isExplicitFalse = debugFlag === 'false' || debugFlag === '0' || debugFlag === false;
    if (isExplicitFalse) {
      return false;
    }

    const isExplicitTrue = debugFlag === 'true' || debugFlag === '1' || debugFlag === true;
    if (isExplicitTrue) {
      // 生产域名双重防线：即使误将带 true 的产物推送到线上，也保护 GitHub Pages 纯正游戏环境
      if (host.endsWith('.github.io')) {
        return false;
      }
      return true;
    }
  }

  // 2. Vite 本地开发模式 (DEV)
  if (envSource?.DEV === true) {
    return true;
  }

  // 3. 本地主机名检测 (支持本地静态文件运行或本地 preview 服务)
  const isLocalHost =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '[::1]' ||
    protocol === 'file:';

  return isLocalHost;
}
