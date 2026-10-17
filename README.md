# Magic Tower 3D / 魔塔 3D

> A modern 3D panoramic remake of the classic 50-Floor retro RPG (*Tower of the Sorcerer*).  
> 经典 50 层魔塔（Tower of the Sorcerer）全 3D 现代化全景复刻版。

[🎮 Live Demo / 在线试玩](https://frankliuao.github.io/magic-tower-3d/) · [🕹️ Cheat Mode / 秘籍模式](https://frankliuao.github.io/magic-tower-3d/?cheat=1)

[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-1601%20Passed-success?style=flat-square)](https://github.com/frankliuao/magic-tower-3d)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

**Language Navigation / 语言切换:**  
[English](#english) | [中文](#中文)

---

<a id="english"></a>
## English

### 📖 Overview

**Magic Tower 3D** is a web-based 3D remake of the classic 50-Floor RPG puzzle game *Tower of the Sorcerer*, powered by **React 19, TypeScript, Three.js, and Tailwind CSS**. 

It faithfully recreates the original deterministic combat math, canonical quests, and hidden mechanisms while delivering a modern 3D panoramic experience with free multi-camera switching, procedural 3D models, and procedural Web Audio synthesis.

### ✨ Key Features

- **🏰 Full 3D Volumetric Dungeon**: 11×11 grid spaces featuring 5 distinct atmospheric floor themes (Stone Corridor, Secret Vault, Boiling Magma, Ancient Temple, Celestial Spire) with dynamic torchlight and shadow rendering.
- **👾 40 Distinct Procedural 3D Monsters**: All 40 canonical monsters feature 100% unique 3D procedural geometries and custom equipment (Archmage, 8 Magic Guards, False Sorcerer with pale mask, Demon Lord Zeno with dragon wings, etc.) without relying on heavy external asset packs.
- **🎥 3 Camera Perspectives**: Switch seamlessly between 45° Isometric Overview, Third-Person Follow, and First-Person Dungeon Crawler modes.
- **⚔️ Deterministic Combat & Breakpoint Calculus**: Zero RNG (no misses, no critical strikes). Includes First Strike, Multi-Strike, Magic Attack, Vampire Drain, and Armor Break. The in-game Monster Manual (`L` key) calculates exact combat damage and critical upgrade breakpoints in real time.
- **🗺️ Canonical Quests & Mechanisms**: 51 fully realized floors (0F–50F), including secret false walls, freezing the magma sea with the Snow Crystal, the 49F cross-guard barrier puzzle, and the final 50F showdown.
- **🌐 Strict Bilingual Isolation**: 100% pure localization with zero text leakage between English and Chinese across all 40 monsters, 32 items, 6 NPCs, and UI dialogues.
- **🔊 Procedural Web Audio**: Zero external audio downloads; leverages the Web Audio API to synthesize classic 8-bit/16-bit retro dungeon and combat sound effects on the fly.
- **🔧 Flexible Cheat Console**: Driven locally via `.env.local` (`VITE_ENABLE_DEBUG=true`). In production, hardcode safety is maintained by default while allowing instantaneous activation for casual players via URL parameter (`?cheat=1`).

### 🕹️ Controls

| Key / Control | Function |
| :--- | :--- |
| **W / A / S / D** or **Arrow Keys** | Move hero / Interact with tiles |
| **L** | Toggle Monster Manual |
| **G** | Toggle Floor Teleport Compass |
| **V** | Cycle Camera View (Isometric / Follow / First-Person) |
| **Space** | Reset camera view and focus on hero |
| **Left Click** | Inspect tile / monster / item / NPC details |
| **Double Right-Click** | Auto-navigate to destination (A* pathfinding avoiding monsters) |
| **Esc** | Close active dialog / modal |
| **Virtual D-Pad** | Touch & Mouse on-screen directional controls |

### 🚀 Getting Started

```bash
# 1. Clone repository
git clone https://github.com/frankliuao/magic-tower-3d.git
cd magic-tower-3d

# 2. Install dependencies
npm install

# 3. Run automated regression tests (1601+ test cases passing 100%)
npm test

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

### ⚙️ Environment Settings & Cheat Console

- **Local Development**: Copy `.env.example` to `.env.local` and set `VITE_ENABLE_DEBUG=true` to enable the top-right 🔧 cheat console (set to `false` to test pure non-cheat progression).
- **Production (GitHub Pages)**: The cheat console is strictly disabled by default. Accessing `https://<your-site>/?cheat=1` instantly unlocks the cheat console on the fly for casual gameplay.

### 📄 License

MIT License © 2026 [Ao Liu](https://github.com/frankliuao)

---

<a id="中文"></a>
## 中文

### 📖 项目简介

**魔塔 3D** 是一款基于 **React 19 + TypeScript + Three.js + Tailwind CSS** 构建的经典 50 层魔塔三维复刻网页游戏。

忠实还原原版严密纯数学策略、经典剧情任务与全部机关暗道，并以全三维渲染、多视角自由切换与纯程序化 Web Audio 合成音效带来全新视听体验。

### ✨ 核心特色

- **🏰 全 3D 地牢渲染**: 11×11 网格三维全景空间，5 种楼层主题风格（石廊、秘境、熔岩、古殿、天界），物理光影与动态火把光照。
- **👾 40 种专属独立怪物建模**: 魔塔全套 40 种怪物均具备 100% 独立 3D 造型与特征装备（包括红衣大法师、八名魔法警卫、假魔王恶魔白面具、真魔王杰诺等），纯代码程序化几何体构建，无需加载笨重外置模型。
- **🎥 三视角自由切换**: 45° 策略俯视 (Isometric)、第三人称追尾 (Follow)、第一人称沉浸 (First-Person Dungeon Crawler)。
- **⚔️ 纯数学确定性战斗**: 零随机（无 Miss/暴击），包含先攻、连击、魔攻、吸血与防杀；配备怪物手册（L 键）智能计算战损与攻击力临界点。
- **🗺️ 正统机关与剧情**: 完整重构 0~50 层地图，包含暗墙探秘、圣剑熔岩海冻结、49F 假魔王十字阵结界、50F 终局决战。
- **🌐 全语言纯净双语隔离**: 中英文模式严格隔离，40 种怪物、32 种道具法宝、6 位 NPC 及全部 UI 弹窗均拥有地道双语描述，杜绝语言混杂。
- **🔊 程序化 Web Audio 合成**: 零外部音频文件加载，利用 Web Audio API 动态合成经典 8-bit/16-bit 探险与战斗音效。
- **🔧 灵活调试与作弊控制台**: 本地 `.env.local` 自由驱动；线上默认为纯正硬核通关，亦支持通过 URL 秘籍参数（`?cheat=1`）随时随地开启爽玩。

### 🕹️ 操作指南

| 按键 / 操作 | 功能说明 |
| :--- | :--- |
| **W / A / S / D** 或 **方向键** | 移动勇士 / 触发交互 |
| **L** | 打开 / 关闭怪物手册 |
| **G** | 打开 / 关闭楼层传送罗盘 |
| **V** | 切换摄像机视角 (俯视 / 追尾 / 第一人称) |
| **空格键 (Space)** | 视野快速复位聚焦至勇士 |
| **鼠标左键单击** | 检视目标属性、怪物战损推演或道具说明 |
| **鼠标右键双击** | 智能寻路至目标（A* 算法避开敌意怪物） |
| **Esc** | 关闭当前打开的弹窗 |
| **触控虚拟手柄** | 屏幕方向控制（移动端 / 鼠标便捷点击） |

### 🚀 本地开发与构建

```bash
# 1. 克隆仓库
git clone https://github.com/frankliuao/magic-tower-3d.git
cd magic-tower-3d

# 2. 安装依赖
npm install

# 3. 运行自动化测试 (1601+ 项测试 100% 通过)
npm test

# 4. 启动本地开发服务
npm run dev

# 5. 编译生产优化包
npm run build
```

### ⚙️ 环境变量与作弊控制

- **本地开发 (Local Dev)**: 复制 `.env.example` 为 `.env.local`，设置 `VITE_ENABLE_DEBUG=true` 即可启用顶栏 🔧 作弊控制台（设为 `false` 可在本地体验纯正无作弊流程）。
- **线上环境 (Production)**: 默认严格关闭作弊；直接访问 `https://<your-site>/?cheat=1` 可随时随地为特定玩家解锁作弊控制台。

### 📄 开源许可

MIT License © 2026 [Ao Liu](https://github.com/frankliuao)
