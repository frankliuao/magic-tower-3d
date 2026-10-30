# Magic Tower 3D / 魔塔 3D

> A modern 3D panoramic remake of the classic 50-Floor retro RPG (*Tower of the Sorcerer*).  
> 经典 50 层魔塔（Tower of the Sorcerer）全 3D 现代化全景复刻版。

[🎮 Live Demo / 在线试玩](https://frankliuao.github.io/magic-tower-3d/) · [🕹️ Cheat Mode / 秘籍模式](https://frankliuao.github.io/magic-tower-3d/?cheat=1) · [☕ Buy Me a Coffee / 支持作者](https://buymeacoffee.com/frankliuao)

[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-2029%20Passed-success?style=flat-square)](https://github.com/frankliuao/magic-tower-3d)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/frankliuao)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

**Language Navigation / 语言切换:**  
[English](#english) | [中文](#中文)

---

<a id="english"></a>
## English

### 📖 Overview

**Magic Tower 3D** is a web-based 3D remake of the classic 50-Floor RPG puzzle game *Tower of the Sorcerer*, powered by **React 19, TypeScript, Three.js, and Tailwind CSS**. 

It faithfully recreates the original deterministic combat math, canonical quests, and hidden mechanisms while delivering a modern 3D panoramic experience with free camera manipulation, responsive mobile controls, procedural 3D models, and procedural Web Audio synthesis.

### ✨ Key Features

- **🏰 Full 3D Volumetric Dungeon**: 11×11 grid spaces featuring 5 distinct atmospheric floor themes (Stone Corridor, Secret Vault, Boiling Magma, Ancient Temple, Celestial Spire) with dynamic torchlight and shadow rendering.
- **📱 Fluid Mobile & Touch Experience**: Tailored mobile layout featuring an ergonomic virtual joystick, unified bottom dashboard (HP, ATK, DEF, Gold, Keys, Save/Load, Language Switcher), two-finger camera rotation/pinch-to-zoom, and zero-overlap full-screen 3D panoramic views.
- **👾 40 Distinct Procedural 3D Monsters**: All 40 canonical monsters feature 100% unique 3D procedural geometries and custom equipment (Archmage, 8 Magic Guards, False Sorcerer with pale mask, Demon Lord Zeno with dragon wings, etc.) without relying on heavy external asset packs.
- **🎥 3D Camera Manipulation**: Left-click drag (or single-finger drag on mobile) to pan across the dungeon map; Shift/Ctrl + drag (or two-finger slide on mobile) for full 360° pitch and yaw rotation; Ctrl + wheel (or two-finger pinch) to zoom in and out.
- **⚔️ Deterministic Combat & Breakpoint Calculus**: Zero RNG (no misses, no critical strikes). Includes First Strike, Multi-Strike, Magic Attack, Vampire Drain, and Armor Break. The in-game Monster Manual (`L` key) calculates exact combat damage and critical upgrade breakpoints in real time.
- **🗺️ Canonical Quests & Mechanisms**: 51 fully realized floors (0F–50F), including secret false walls, freezing the magma sea with the Snow Crystal, the 49F cross-guard barrier puzzle, and the final 50F showdown.
- **💾 Multi-Slot Save & Load**: Dedicated multi-slot saving and loading system accessible on both desktop and mobile devices anytime.
- **🌐 Strict Bilingual Isolation**: 100% pure localization with zero text leakage between English and Chinese across all 40 monsters, 32 items, 6 NPCs, and UI dialogues.
- **🔊 Procedural Web Audio**: Zero external audio downloads; leverages the Web Audio API to synthesize classic 8-bit/16-bit retro dungeon and combat sound effects on the fly.
- **🔧 Flexible Cheat Console**: Driven locally via `.env.local` (`VITE_ENABLE_DEBUG=true`). In production, hardcode safety is maintained by default while allowing instantaneous activation for casual players via URL parameter (`?cheat=1`).

### 🕹️ Controls

| Key / Control | Function |
| :--- | :--- |
| **W / A / S / D** or **Arrow Keys** | Move hero / Interact with tiles |
| **Virtual Touch Joystick** | Mobile & tablet on-screen responsive movement |
| **Left-Click Drag / Single-Finger Drag** | Pan camera view across the dungeon floor |
| **Shift / Ctrl + Drag / Two-Finger Slide** | Rotate 3D camera 360° freely (Yaw & Pitch) |
| **Ctrl + Scroll / Two-Finger Pinch** | Zoom camera in and out |
| **Space / Target Button** | Reset camera view and focus on hero |
| **Left Click / Tap** | Inspect tile / monster / item / NPC details |
| **Double Right-Click (PC) / Double Tap (Mobile)** | Auto-navigate to destination (A* pathfinding avoiding monsters) |
| **L** | Toggle Monster Manual |
| **G** | Toggle Floor Teleport Compass |
| **Esc** | Close active dialog / modal |

### ☕ Support the Project (Buy Me a Coffee)

**Magic Tower 3D** is a 100% free, ad-free, open-source fan remake created purely out of love for retro gaming and classic puzzle RPGs.

If you had fun playing, conquered the Demon Lord, or wish to support ongoing updates, hosting, and future enhancements, consider buying the creator a cup of coffee:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/frankliuao)

👉 **[Support Ao Liu on Buy Me a Coffee](https://buymeacoffee.com/frankliuao)**

> 🏆 **Hero Supporters Monument**: All patrons are permanently commemorated on the in-game 0F Hero Supporters Monument located in the sanctuary of Floor 0!

### 🚀 Getting Started

```bash
# 1. Clone repository
git clone https://github.com/frankliuao/magic-tower-3d.git
cd magic-tower-3d

# 2. Install dependencies
npm install

# 3. Run automated regression tests (2029+ test cases passing 100%)
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

忠实还原原版严密纯数学策略、经典剧情任务与全部机关暗道，并以全三维渲染、多视角与全景自由旋转、移动端深度适配与纯程序化 Web Audio 合成音效带来全新视听体验。

### ✨ 核心特色

- **🏰 全 3D 地牢渲染**: 11×11 网格三维全景空间，5 种楼层主题风格（石廊、秘境、熔岩、古殿、天界），物理光影与动态火把光照。
- **📱 移动端专属深度适配**: 针对手机屏幕定制一体化底部控制台（VirtualJoystick 虚拟摇杆、楼层徽章、属性数值、钥匙、存读档与多语言切换），支持双指旋转视角与捏合缩放，与 3D 地图零遮挡。
- **👾 40 种专属独立怪物建模**: 魔塔全套 40 种怪物均具备 100% 独立 3D 造型与特征装备（包括红衣大法师、八名魔法警卫、假魔王恶魔白面具、真魔王杰诺等），纯代码程序化几何体构建，无需加载笨重外置模型。
- **🎥 自由 3D 摄像机交互**: 鼠标左键直接拖拽（或手机单指拖拽）畅快平移地图；按住 Shift 或 Ctrl 拖拽（或手机双指同向滑动）360° 自由旋转三维视角；鼠标滚轮（或手机双指捏合）无级缩放。
- **⚔️ 纯数学确定性战斗**: 零随机（无 Miss/暴击），包含先攻、连击、魔攻、吸血与防杀；配备怪物手册（L 键）智能计算战损与攻击力临界点。
- **🗺️ 正统机关与剧情**: 完整重构 0~50 层地图，包含暗墙探秘、圣剑熔岩海冻结、49F 假魔王十字阵结界、50F 终局决战。
- **💾 多槽位存档与读档**: 提供完整的本地多槽位存读档与快照管理，电脑端与手机端均可一键随时存盘读盘。
- **🌐 全语言纯净双语隔离**: 中英文模式严格隔离，40 种怪物、32 种道具法宝、6 位 NPC 及全部 UI 弹窗均拥有地道双语描述，杜绝语言混杂。
- **🔊 程序化 Web Audio 合成**: 零外部音频文件加载，利用 Web Audio API 动态合成经典 8-bit/16-bit 探险与战斗音效。
- **🔧 灵活调试与作弊控制台**: 本地 `.env.local` 自由驱动；线上默认为纯正硬核通关，亦支持通过 URL 秘籍参数（`?cheat=1`）随时随地开启爽玩。

### 🕹️ 操作指南

| 按键 / 操作 | 功能说明 |
| :--- | :--- |
| **W / A / S / D** 或 **方向键** | 移动勇士 / 触发地块交互 |
| **触控虚拟摇杆** | 移动端专属自适应摇杆，丝滑走位与方向控制 |
| **鼠标左键直接拖拽 / 单指拖拽** | 平移地图视角，纵览全层布局 |
| **Shift 或 Ctrl + 拖拽 / 双指同向滑动** | 360° 自由旋转 3D 视角（偏航角与俯仰角） |
| **鼠标滚轮 / 双指捏合缩放** | 放大缩小三维视野 |
| **空格键 (Space) / 复位按钮** | 视角快速复位聚焦至勇士中心 |
| **鼠标左键单击 / 单指轻点** | 检视目标属性、怪物战损推演或道具说明 |
| **鼠标右键双击 (电脑) / 屏幕双击 (手机)** | 智能寻路至目标（A* 算法避开敌意怪物） |
| **L** | 打开 / 关闭怪物手册（实时测算攻击力临界点） |
| **G** | 打开 / 关闭楼层传送罗盘 |
| **Esc** | 关闭当前打开的弹窗 |

### ☕ 支持项目 / 请作者喝杯咖啡 (Buy Me a Coffee)

**魔塔 3D** 是一个完全免费、无商业广告、开源的独立复刻项目，纯粹出于对经典 50 层魔塔与复古地牢游戏的热爱精心制作。

如果您在游戏中重温了当年的感动、成功突破了高难楼层，或者希望支持后续优化、服务器托管以及更多新特性开发，欢迎请作者喝一杯咖啡：

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-赞助支持-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/frankliuao)

👉 **[前往 Buy Me a Coffee 支持作者 (Ao Liu)](https://buymeacoffee.com/frankliuao)**

> 🏆 **英雄赞助榜 (Hero Supporters Monument)**：所有赞助者的名字与寄语将被永久镌刻在游戏内 0 层（0F 初始大殿）中央圣殿的【英雄赞助碑】上，与所有登塔勇士一同见证传奇！

### 🚀 本地开发与构建

```bash
# 1. 克隆仓库
git clone https://github.com/frankliuao/magic-tower-3d.git
cd magic-tower-3d

# 2. 安装依赖
npm install

# 3. 运行自动化测试 (2029+ 项测试 100% 通过)
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
