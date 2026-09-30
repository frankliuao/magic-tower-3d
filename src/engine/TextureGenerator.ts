// src/engine/TextureGenerator.ts
import * as THREE from 'three';

/**
 * 纯程序化 Canvas 高清贴图生成器
 * 100% 离线、零外部图片依赖、提供精致的地下城与地牢材质细节
 */
export class TextureGenerator {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  // 1. 石砖墙面贴图 (Stone Brick Wall)
  static getBrickTexture(theme: string = 'castle'): THREE.CanvasTexture {
    const key = `brick_${theme}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    let baseColor = '#3b4252';
    let brickColor1 = '#4c566a';
    let brickColor2 = '#434c5e';
    let mortarColor = '#2e3440';

    if (theme === 'magma') {
      baseColor = '#451a03';
      brickColor1 = '#78350f';
      brickColor2 = '#92400e';
      mortarColor = '#290e02';
    } else if (theme === 'dark') {
      baseColor = '#18122b';
      brickColor1 = '#282245';
      brickColor2 = '#231b3e';
      mortarColor = '#0f0a1c';
    } else if (theme === 'celestial') {
      baseColor = '#1e293b';
      brickColor1 = '#334155';
      brickColor2 = '#273549';
      mortarColor = '#0f172a';
    }

    // 灰浆底色
    ctx.fillStyle = mortarColor;
    ctx.fillRect(0, 0, 256, 256);

    const rows = 8;
    const cols = 4;
    const h = 256 / rows;
    const w = 256 / cols;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (w / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * w + offset + 2;
        const y = r * h + 2;
        const bw = w - 4;
        const bh = h - 4;

        ctx.fillStyle = (r + c) % 2 === 0 ? brickColor1 : brickColor2;
        ctx.fillRect(x, y, bw, bh);

        // 砖块微糙噪点与高光倒角
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x, y, bw, 2);
        ctx.fillRect(x, y, 2, bh);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(x, y + bh - 2, bw, 2);
        ctx.fillRect(x + bw - 2, y, 2, bh);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, tex);
    return tex;
  }

  // 2. 石板地砖贴图 (Natural Dungeon Flagstone - 自然石板地表，杜绝网格化)
  static getFloorTexture(theme: string = 'castle'): THREE.CanvasTexture {
    const key = `floor_${theme}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // 自然石头地砖颜色：普通自然的石板灰/地牢青灰，告别蓝紫色网状格子
    let stoneBase = '#575f6d';
    let stoneHighlight = '#646d7c';
    let stoneShadow = '#474e5a';
    let mortarColor = '#2b3038';

    if (theme === 'magma') {
      stoneBase = '#44352f';
      stoneHighlight = '#53413a';
      stoneShadow = '#362924';
      mortarColor = '#201815';
    } else if (theme === 'dark') {
      stoneBase = '#30303e';
      stoneHighlight = '#3c3c4e';
      stoneShadow = '#252532';
      mortarColor = '#15151e';
    } else if (theme === 'celestial') {
      stoneBase = '#6b798e';
      stoneHighlight = '#7b8aa1';
      stoneShadow = '#5a6679';
      mortarColor = '#3a4454';
    }

    // 1. 底层灰浆微凹缝隙
    ctx.fillStyle = mortarColor;
    ctx.fillRect(0, 0, 256, 256);

    // 2. 单格整块天然大石板 (边缘留 2px 浅凹缝，形成自然砖缝而非密集网格)
    ctx.fillStyle = stoneBase;
    ctx.fillRect(2, 2, 252, 252);

    // 3. 仿手工凿痕与自然石纹微变色块 (天然风化花岗岩质感)
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // 绘制多层不规则石纹斑驳
    for (let i = 0; i < 60; i++) {
      const rx = 4 + rng(i * 13.7) * 240;
      const ry = 4 + rng(i * 29.3) * 240;
      const rw = 12 + rng(i * 7.1) * 32;
      const rh = 8 + rng(i * 17.9) * 24;
      ctx.fillStyle = i % 2 === 0 ? stoneHighlight : stoneShadow;
      ctx.globalAlpha = 0.28;
      ctx.fillRect(rx, ry, rw, rh);
    }

    // 4. 自然细微砂砾噪点与石面气孔
    for (let p = 0; p < 800; p++) {
      const px = 2 + rng(p * 5.3) * 252;
      const py = 2 + rng(p * 11.9) * 252;
      const shade = rng(p * 23.1);
      ctx.globalAlpha = 0.08 + rng(p * 3.7) * 0.12;
      ctx.fillStyle = shade > 0.5 ? '#ffffff' : '#000000';
      ctx.fillRect(px, py, 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;

    // 5. 石板边缘自然倒角与凿痕高光阴影 (顶/左受光，底/右阴影)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(2, 2, 252, 3);
    ctx.fillRect(2, 2, 3, 252);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(2, 251, 252, 3);
    ctx.fillRect(251, 2, 3, 252);

    // 6. 微弱的石块受力风化裂纹 (增添古老地牢沉浸感)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(35, 12);
    ctx.lineTo(60, 48);
    ctx.lineTo(85, 55);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, tex);
    return tex;
  }

  // 3. 经典地牢楼梯石阶贴图 (Earth-White / Earth-Yellow Stone Stairs Texture)
  static getStairsTexture(): THREE.CanvasTexture {
    const key = 'stairs_stone_ochre';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // 土黄与土白相间的古朴石灰岩/砂岩色调
    const mortar = '#5c492e';
    const baseYellow = '#d5be96';
    const baseWhite = '#e8dcc4';
    const highlight = '#f6efe2';
    const shadow = '#a68f6a';

    // 1. 底层灰缝
    ctx.fillStyle = mortar;
    ctx.fillRect(0, 0, 256, 256);

    // 2. 水平条纹石阶分块 (仿条石台阶造型)
    const numRows = 4;
    const stepH = 256 / numRows;

    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let r = 0; r < numRows; r++) {
      const y = r * stepH;
      // 踏板主石面
      ctx.fillStyle = r % 2 === 0 ? baseYellow : baseWhite;
      ctx.fillRect(2, y + 2, 252, stepH - 4);

      // 踏板边缘倒角与受光高光 (Step Edge Highlight)
      ctx.fillStyle = highlight;
      ctx.fillRect(2, y + 2, 252, 4);

      // 台阶内凹与踢面阴影 (Riser Shadow)
      ctx.fillStyle = shadow;
      ctx.fillRect(2, y + stepH - 5, 252, 3);

      // 石面天然凿痕与微斑
      for (let i = 0; i < 20; i++) {
        const sx = 6 + rng(r * 40 + i * 7.3) * 240;
        const sy = y + 4 + rng(r * 40 + i * 11.1) * (stepH - 10);
        const sw = 8 + rng(r * 40 + i * 3.7) * 20;
        const sh = 3 + rng(r * 40 + i * 5.9) * 6;
        ctx.fillStyle = i % 2 === 0 ? highlight : shadow;
        ctx.globalAlpha = 0.22;
        ctx.fillRect(sx, sy, sw, sh);
      }
      ctx.globalAlpha = 1.0;
    }

    // 3. 细微砂砾噪点
    for (let p = 0; p < 600; p++) {
      const px = 2 + rng(p * 3.1) * 252;
      const py = 2 + rng(p * 7.9) * 252;
      ctx.fillStyle = p % 2 === 0 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(px, py, 1.5, 1.5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, tex);
    return tex;
  }

  // 4. 门板木纹加铁条铆钉贴图 (Wood Planks with Iron Studs)
  static getDoorPlankTexture(type: 'yellow' | 'blue' | 'red' | 'iron'): THREE.CanvasTexture {
    const key = `door_plank_${type}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // 门板底色
    let base = '#78350f'; // 黄门：厚橡木
    let bandColor = '#eab308';
    let grainColor = '#92400e';

    if (type === 'blue') {
      base = '#1e3a5f';
      bandColor = '#38bdf8';
      grainColor = '#254f85';
    } else if (type === 'red') {
      base = '#7f1d1d';
      bandColor = '#ef4444';
      grainColor = '#991b1b';
    } else if (type === 'iron') {
      base = '#1e293b';
      bandColor = '#94a3b8';
      grainColor = '#334155';
    }

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 256, 512);

    // 绘制木纹板条 (3 条垂直厚木板)
    const plankW = 256 / 3;
    for (let i = 0; i < 3; i++) {
      const px = i * plankW;
      ctx.fillStyle = grainColor;
      ctx.fillRect(px + 4, 0, plankW - 8, 512);

      // 板间深凹缝
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px, 0, 3, 512);

      // 木纹条理
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let j = 0; j < 12; j++) {
        ctx.fillRect(px + 10 + (j % 4) * 12, (j * 43) % 512, 4, 80);
      }
    }

    // 绘制上下两道粗铁锁带 (Iron Straps)
    const drawStrap = (y: number) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, y - 2, 256, 36);
      ctx.fillStyle = bandColor;
      ctx.fillRect(0, y, 256, 32);

      // 铁铆钉 (Rivets)
      for (let x = 20; x < 256; x += 40) {
        ctx.beginPath();
        ctx.arc(x, y + 16, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - 2, y + 14, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    };

    drawStrap(80);
    drawStrap(400);

    const tex = new THREE.CanvasTexture(canvas);
    this.cache.set(key, tex);
    return tex;
  }

  // 4. 门框雕花石拱贴图 (Carved Stone Archway Texture)
  static getDoorFrameTexture(): THREE.CanvasTexture {
    const key = 'door_frame_stone';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // 城堡深色砌石底色
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 256, 256);

    // 绘制石拱砌块与分界石缝
    const rows = 4;
    const h = 256 / rows;
    for (let r = 0; r < rows; r++) {
      const y = r * h;
      ctx.fillStyle = r % 2 === 0 ? '#334155' : '#3e4c5f';
      ctx.fillRect(2, y + 2, 252, h - 4);

      // 石块高光倒角与暗部投影
      ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.fillRect(2, y + 2, 252, 2);
      ctx.fillRect(2, y + 2, 2, h - 4);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fillRect(2, y + h - 2, 252, 2);
      ctx.fillRect(252, y + 2, 2, h - 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, tex);
    return tex;
  }

  // 5. 仙女魔法阵纹饰 (Magic Circle Rune)
  static getMagicRuneTexture(): THREE.CanvasTexture {
    const key = 'magic_rune';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 116, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.stroke();

    // 内接六芒星
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
      const x = cx + Math.cos(a) * 96;
      const y = cy + Math.sin(a) * 96;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI) / 3 + Math.PI / 2;
      const x = cx + Math.cos(a) * 96;
      const y = cy + Math.sin(a) * 96;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // 核心小星辉
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    this.cache.set(key, tex);
    return tex;
  }

  // 10. 仙女二次元治愈系动漫面庞贴图 (Anime Fairy Face with Sparkling Eyes & Blush)
  static getFairyFaceTexture(): THREE.CanvasTexture {
    const key = 'fairy_face';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 512, 512);

    // 柔软轻透瓷肌底色 (Porcelain Skin Soft Gradient)
    const skinGrad = ctx.createRadialGradient(256, 260, 40, 256, 260, 230);
    skinGrad.addColorStop(0.0, 'rgba(255, 248, 242, 0.55)');
    skinGrad.addColorStop(0.6, 'rgba(255, 237, 213, 0.35)');
    skinGrad.addColorStop(1.0, 'rgba(255, 237, 213, 0.0)');
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.arc(256, 260, 230, 0, Math.PI * 2);
    ctx.fill();

    // 辅助绘制单侧大眼睛
    const drawEye = (cx: number, cy: number, isLeft: boolean) => {
      ctx.save();

      // 1. 虹膜底座与外轮廓
      const eyeW = 54;
      const eyeH = 72;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, eyeW, eyeH, 0, 0, Math.PI * 2);
      ctx.clip();

      // 虹膜渐变 (深邃宝蓝到透亮天蓝)
      const grad = ctx.createLinearGradient(cx, cy - eyeH, cx, cy + eyeH);
      grad.addColorStop(0.0, '#0c4a6e');
      grad.addColorStop(0.3, '#0284c7');
      grad.addColorStop(0.7, '#38bdf8');
      grad.addColorStop(1.0, '#7dd3fc');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - eyeW - 10, cy - eyeH - 10, (eyeW + 10) * 2, (eyeH + 10) * 2);

      // 瞳孔
      ctx.fillStyle = '#082f49';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 6, eyeW * 0.45, eyeH * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();

      // 虹膜底部半月形反光
      ctx.fillStyle = 'rgba(224, 242, 254, 0.65)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + eyeH * 0.45, eyeW * 0.65, eyeH * 0.28, 0, 0, Math.PI);
      ctx.fill();

      // 主星辉高光 (明亮的大光斑)
      ctx.fillStyle = '#ffffff';
      const hlX = isLeft ? cx - 18 : cx - 14;
      const hlY = cy - 24;
      ctx.beginPath();
      ctx.ellipse(hlX, hlY, 16, 20, isLeft ? -0.2 : -0.1, 0, Math.PI * 2);
      ctx.fill();

      // 次高光 (小光斑)
      ctx.beginPath();
      const hl2X = isLeft ? cx + 16 : cx + 18;
      const hl2Y = cy + 18;
      ctx.ellipse(hl2X, hl2Y, 8, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 2. 上睫毛与眼线眼尾
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (isLeft) {
        ctx.arc(cx, cy - 6, eyeW + 6, Math.PI * 1.15, Math.PI * 1.85);
      } else {
        ctx.arc(cx, cy - 6, eyeW + 6, Math.PI * 1.15, Math.PI * 1.85);
      }
      ctx.stroke();

      // 俏丽眼睫毛翘角 (Lash Flick)
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cx - eyeW - 6, cy - 14);
        ctx.quadraticCurveTo(cx - eyeW - 18, cy - 24, cx - eyeW - 14, cy - 32);
      } else {
        ctx.moveTo(cx + eyeW + 6, cy - 14);
        ctx.quadraticCurveTo(cx + eyeW + 18, cy - 24, cx + eyeW + 14, cy - 32);
      }
      ctx.stroke();

      // 3. 柔和下眼睑线
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 8, eyeW * 0.8, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    // 绘制左右双眼
    drawEye(165, 240, true);
    drawEye(347, 240, false);

    // 眉毛 (柔和修长细眉)
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    // 左眉
    ctx.beginPath();
    ctx.moveTo(115, 168);
    ctx.quadraticCurveTo(165, 142, 215, 162);
    ctx.stroke();
    // 右眉
    ctx.beginPath();
    ctx.moveTo(297, 162);
    ctx.quadraticCurveTo(347, 142, 397, 168);
    ctx.stroke();

    // 少女粉嫩腮红 (Blush)
    const drawBlush = (bx: number, by: number) => {
      const blushGrad = ctx.createRadialGradient(bx, by, 4, bx, by, 42);
      blushGrad.addColorStop(0.0, 'rgba(251, 113, 133, 0.70)');
      blushGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.35)');
      blushGrad.addColorStop(1.0, 'rgba(251, 113, 133, 0.0)');
      ctx.fillStyle = blushGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 42, 0, Math.PI * 2);
      ctx.fill();

      // 腮红高光线条
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(bx + i * 12 - 6, by - 6);
        ctx.lineTo(bx + i * 12 + 6, by + 6);
        ctx.stroke();
      }
    };
    drawBlush(130, 318);
    drawBlush(382, 318);

    // 俏皮可爱小巧鼻尖
    ctx.fillStyle = 'rgba(180, 83, 9, 0.45)';
    ctx.beginPath();
    ctx.arc(256, 292, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 甜美微笑着的小嘴 (Sweet Smiling Lips)
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(234, 342);
    ctx.quadraticCurveTo(256, 362, 278, 342);
    ctx.stroke();

    // 唇瓣内粉色与唇蜜高光
    ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
    ctx.beginPath();
    ctx.moveTo(238, 344);
    ctx.quadraticCurveTo(256, 360, 274, 344);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(252, 347, 2.5, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    this.cache.set(key, tex);
    return tex;
  }

  // 13. 传送光柱空心圆柱表面流光贴图 (Portal Hollow Light Cylinder with Moving Arrows)
  static getPortalCylinderTexture(isUp: boolean): THREE.CanvasTexture {
    const key = `portal_cylinder_${isUp ? 'up' : 'down'}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // 1. 半透明纵向能量光柱底色渐变
    const beamGrad = ctx.createLinearGradient(0, 512, 0, 0);
    if (isUp) {
      beamGrad.addColorStop(0.0, 'rgba(56, 189, 248, 0.45)');
      beamGrad.addColorStop(0.2, 'rgba(14, 165, 233, 0.28)');
      beamGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.18)');
      beamGrad.addColorStop(1.0, 'rgba(2, 132, 199, 0.04)');
    } else {
      beamGrad.addColorStop(0.0, 'rgba(168, 85, 247, 0.45)');
      beamGrad.addColorStop(0.2, 'rgba(147, 51, 234, 0.28)');
      beamGrad.addColorStop(0.7, 'rgba(192, 132, 252, 0.18)');
      beamGrad.addColorStop(1.0, 'rgba(126, 34, 206, 0.04)');
    }
    ctx.fillStyle = beamGrad;
    ctx.fillRect(0, 0, 512, 512);

    // 2. 纵向细长能量光丝 (Vertical Laser Streaks - 参考光柱图例)
    ctx.strokeStyle = isUp ? 'rgba(186, 230, 253, 0.40)' : 'rgba(233, 213, 255, 0.40)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 16; i++) {
      const x = i * 32 + 16;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    // 3. 科技发光流光箭头 (Sci-Fi Flow Chevrons)
    const drawChevron = (cx: number, cy: number, w: number, h: number, up: boolean) => {
      const dir = up ? -1 : 1; // up: 尖端朝上方 (Canvas y 减小方向)
      ctx.save();
      ctx.translate(cx, cy);

      // 外层霓虹发光光晕
      ctx.shadowColor = up ? '#38bdf8' : '#c084fc';
      ctx.shadowBlur = 14;
      ctx.fillStyle = up ? 'rgba(56, 189, 248, 0.95)' : 'rgba(192, 132, 252, 0.95)';

      // 主科技箭头
      ctx.beginPath();
      ctx.moveTo(0, dir * h);
      ctx.lineTo(w, dir * (-h * 0.2));
      ctx.lineTo(w * 0.65, dir * (-h * 0.2));
      ctx.lineTo(0, dir * (h * 0.25));
      ctx.lineTo(-w * 0.65, dir * (-h * 0.2));
      ctx.lineTo(-w, dir * (-h * 0.2));
      ctx.closePath();
      ctx.fill();

      // 内层纯白高光核 (White-hot core)
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, dir * (h * 0.85));
      ctx.lineTo(w * 0.5, dir * (-h * 0.05));
      ctx.lineTo(w * 0.3, dir * (-h * 0.05));
      ctx.lineTo(0, dir * (h * 0.35));
      ctx.lineTo(-w * 0.3, dir * (-h * 0.05));
      ctx.lineTo(-w * 0.5, dir * (-h * 0.05));
      ctx.closePath();
      ctx.fill();

      // 次级跟随羽翼 (Trailing Chevron)
      ctx.fillStyle = up ? 'rgba(56, 189, 248, 0.65)' : 'rgba(192, 132, 252, 0.65)';
      ctx.beginPath();
      ctx.moveTo(0, dir * (h * 0.2));
      ctx.lineTo(w * 0.85, dir * (-h * 0.65));
      ctx.lineTo(w * 0.60, dir * (-h * 0.65));
      ctx.lineTo(0, dir * (-h * 0.20));
      ctx.lineTo(-w * 0.60, dir * (-h * 0.65));
      ctx.lineTo(-w * 0.85, dir * (-h * 0.65));
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // 在 512x512 画布上均匀排布 4 列、每列 4 层的箭头矩阵 (圆柱 360° 周向与全高度)
    const cols = 4;
    const rows = 4;
    for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) * (512 / cols);
      for (let r = 0; r < rows; r++) {
        const cy = (r + 0.5) * (512 / rows);
        drawChevron(cx, cy, 32, 38, isUp);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.generateMipmaps = true;
    this.cache.set(key, tex);
    return tex;
  }

  // 14. 传送门地面光圈纹理 (Portal Ground Radial Disc)
  static getPortalGroundTexture(isUp: boolean): THREE.CanvasTexture {
    const key = `portal_ground_${isUp ? 'up' : 'down'}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const cx = 256;
    const cy = 256;

    // 1. 中心光圈径向渐变
    const radGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
    if (isUp) {
      radGrad.addColorStop(0.0, 'rgba(224, 242, 254, 0.95)');
      radGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.65)');
      radGrad.addColorStop(0.75, 'rgba(14, 165, 233, 0.25)');
      radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    } else {
      radGrad.addColorStop(0.0, 'rgba(243, 232, 255, 0.95)');
      radGrad.addColorStop(0.35, 'rgba(192, 132, 252, 0.65)');
      radGrad.addColorStop(0.75, 'rgba(147, 51, 234, 0.25)');
      radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    }
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 250, 0, Math.PI * 2);
    ctx.fill();

    // 2. 同心科技圆环与刻度线
    const primaryCol = isUp ? 'rgba(56, 189, 248, 0.85)' : 'rgba(192, 132, 252, 0.85)';
    ctx.strokeStyle = primaryCol;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.stroke();

    // 3. 径向刻度线 (Compass ticks)
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI * 2) / 24;
      const rInner = i % 2 === 0 ? 180 : 195;
      const rOuter = 210;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    this.cache.set(key, tex);
    return tex;
  }
}

