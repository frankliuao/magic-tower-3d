# 魔塔 3D (Magic Tower 3D) - 经典50层三维全景复刻版

基于 **React 19 + TypeScript + Three.js + Tailwind CSS** 构建的现代化全 3D 经典 50 层魔塔（Tower of the Sorcerer）全景复刻游戏。

![Three.js WebGL](https://img.shields.io/badge/Three.js-r186-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-cyan?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-purple?style=flat-square)

---

## 🎮 游戏特性

1. **三维地牢渲染 (Three.js WebGL)**：
   - 11×11 经典网格三维几何投影，支持不同楼层主题（城堡石廊、地牢秘境、熔岩炽焰、幽冥古殿、天界神殿）。
   - PBR 物理材质与真实光影，勇士随身携带动态暖橙色火把点光源。
   - 动态动画：门锁垂直滑升天花板开启动画、悬浮钥匙/宝石自转、果冻史莱姆呼吸律动、蝙蝠翅膀煽动、祭坛旋转水晶。
2. **多视角无缝切换**：
   - **45° 策略俯视视角 (Tactical ISO)**：最佳全局战局洞察与路线推演。
   - **第三人称追尾视角 (Follow)**：贴身观察勇士探险，更具 RPG 动作感。
   - **第一人称地牢视角 (FPS)**：沉浸式置身迷宫深处，体验原汁原味的 Dungeon Crawler 爬塔。
3. **100% 经典纯数学确定性战斗系统**：
   - 严格还原原版无随机性（无 Miss、无暴击）的数值博弈。
   - 破防判定、$T = \lceil HP_m / (ATK_h - DEF_m) \rceil$ 回合计算与无伤“防杀”机制。
   - 特殊技能系统：先攻（First Strike）、2/3 连击（Multi-strike）、魔攻（Magic Attack）、吸血鬼吸血（Vampirism）、十字架驱魔庇护。
4. **全套经典交互系统**：
   - **怪物手册 (L 键)**：透视当前层所有敌人属性、战损预测与**下一级攻击临界点（减少受击所需攻击力）**。
   - **风之罗盘 (G 键)**：已探索楼层瞬间跳转。
   - **远古神圣祭坛**：支持 $20 + 10 \times n \times (n - 1)$ 经典加点涨价公式。
   - **NPC 剧情系统**：仙人破枷锁、小偷赠情报、老人予手册、救出公主大决战。
   - **存档与读档**：支持多槽位 LocalStorage 完整状态序列化。
   - **开发者调试台**：支持一键加点、钥匙补给、全层穿梭与清怪。
5. **纯程序化 Web Audio 合成音效**：
   - 摆脱对任何外部 MP3 文件的依赖，采用 Web Audio API 合成复古 8-bit/16-bit 音效（步履、挥剑斩击、石门开合、宝石清鸣、药水吞咽、升级号角与胜利礼花）。

---

## 🕹️ 操作指南

| 按键 / 控制 | 功能说明 |
| :--- | :--- |
| **W / A / S / D** 或 **↑ / ↓ / ← / →** | 控制勇士在三维地牢中移动与交互 |
| **L** | 开启 / 关闭【怪物手册】 |
| **G** | 开启 / 关闭【风之罗盘（楼层跃迁）】 |
| **V** | 循环切换摄像机视角（45°策略 / 追尾 / 第一人称） |
| **Esc** | 关闭当前打开的任何弹窗 |
| **界面手柄** | 左侧状态栏底部提供针对触摸屏与鼠标点击的虚拟方向盘 |

---

## 🛠️ 本地运行与构建

```bash
# 安装依赖
npm install

# 运行自动化逻辑与全 50 层数据自检测试（130 项测试用例全部通过）
npm test

# 启动本地开发热更新服务
npm run dev

# 编译生产优化包
npm run build
```
