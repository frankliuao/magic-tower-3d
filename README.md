# 魔塔 3D / Magic Tower 3D

> 经典 50 层魔塔（Tower of the Sorcerer）全 3D 现代化全景复刻版。  
> A modern 3D panoramic remake of the classic 50-Floor Magic Tower (*Tower of the Sorcerer*).

[🎮 在线试玩 / Live Demo](https://frankliuao.github.io/magic-tower-3d/) · [🕹️ 秘籍模式 / Cheat Mode](https://frankliuao.github.io/magic-tower-3d/?cheat=1)

[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-1035%20Passed-success?style=flat-square)](https://github.com/frankliuao/magic-tower-3d)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 📖 项目简介 / Overview

**魔塔 3D** 是一款基于 **React 19 + TypeScript + Three.js + Tailwind CSS** 构建的经典 50 层魔塔三维复刻网页游戏。忠实还原原版严密纯数学策略、经典剧情任务与全部机关暗道，并以全三维渲染、多视角自由切换与纯程序化 Web Audio 合成音效带来全新视听体验。

**Magic Tower 3D** is a web-based 3D remake of the classic 50-Floor RPG puzzle game *Tower of the Sorcerer*, powered by **React 19, TypeScript, Three.js, and Tailwind CSS**. It faithfully recreates the deterministic combat math, canonical quests, and hidden mechanisms while offering full 3D rendering, seamless multi-camera switching, and procedural Web Audio synthesis.

---

## ✨ 核心特色 / Key Features

- **🏰 全 3D 地牢渲染 (Full 3D Dungeon)**: 11×11 网格三维全景空间，5 种楼层主题风格（石廊、秘境、熔岩、古殿、天界），物理光影与动态火把光照。
- **👾 40 种专属独立怪物建模 (40 Distinct 3D Monsters)**: 魔塔全套 40 种怪物均具备 100% 独立 3D 造型与特征装备（包括红衣大法师、八名魔法警卫、假魔王恶魔白面具、真魔王杰诺等），绝无雷同复用。
- **🎥 三视角自由切换 (3 Camera Modes)**: 45° 策略俯视 (Isometric)、第三人称追尾 (Follow)、第一人称沉浸 (First-Person Dungeon Crawler)。
- **⚔️ 纯数学确定性战斗 (Deterministic Combat)**: 零随机（无 Miss/暴击），包含先攻、连击、魔攻、吸血与防杀；配备怪物手册（L 键）智能计算战损与攻击力临界点。
- **🗺️ 正统机关与剧情 (Canonical Maps & Puzzles)**: 完整重构 1~50 层地图，包含暗墙探秘、圣剑熔岩海冻结、49F 假魔王十字阵结界、50F 终局决战。
- **🔊 程序化 Web Audio 合成 (Procedural Audio)**: 零外部音频文件加载，利用 Web Audio API 动态合成经典 8-bit/16-bit 探险与战斗音效。
- **🔧 灵活调试与作弊控制台 (Cheat Console)**: 本地 `.env.local` 自由驱动；线上默认为纯正硬核通关，亦支持通过 URL 秘籍参数（`?cheat=1`）随时随地开启爽玩。

---

## 🕹️ 快捷键指南 / Controls

| 操作 / Key | 功能 (中文) | Function (English) |
| :--- | :--- | :--- |
| **W / A / S / D** 或 **方向键** | 移动勇士 / 地图交互 | Move hero / Interact |
| **L** | 打开 / 关闭怪物手册 | Toggle Monster Manual |
| **G** | 打开 / 关闭楼层传送罗盘 | Toggle Floor Compass |
| **V** | 切换摄像机视角 (俯视 / 追尾 / 第一人称) | Cycle Camera View (Isometric / Follow / FPS) |
| **Esc** | 关闭当前打开的弹窗 | Close active modal |
| **触控虚拟手柄** | 移动控制（移动端 / 鼠标支持） | Virtual D-Pad for Touch & Mouse |

---

## 🚀 本地开发与构建 / Getting Started

```bash
# 1. 克隆仓库 / Clone repository
git clone https://github.com/frankliuao/magic-tower-3d.git
cd magic-tower-3d

# 2. 安装依赖 / Install dependencies
npm install

# 3. 运行自动化测试 (1035+ 测试项 100% 通过) / Run tests
npm test

# 4. 启动本地开发服务 / Start dev server
npm run dev

# 5. 编译生产优化包 / Build for production
npm run build
```

### ⚙️ 环境变量与作弊控制 / Environment Settings

- **本地开发 (Local Dev)**: 复制 `.env.example` 为 `.env.local`，设置 `VITE_ENABLE_DEBUG=true` 即可启用顶栏 🔧 作弊控制台（设为 `false` 可在本地体验纯正无作弊流程）。
- **线上环境 (Production)**: 默认严格关闭作弊；直接访问 `https://<your-site>/?cheat=1` 可随时随地为特定玩家解锁作弊控制台。

---

## 📄 开源许可 / License

MIT License © 2026 [Ao Liu](https://github.com/frankliuao)
