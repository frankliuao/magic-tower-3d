// src/engine/ModelFactory.ts
import * as THREE from 'three';
import { ItemType, Tile } from '../types/game';
import { MONSTERS } from '../data/monsters';
import { TextureGenerator } from './TextureGenerator';

/**
 * 3D 高精细度程序化模型与材质工厂
 * 重新设计所有角色、NPC（仙女、老头、小偷、公主）、门锁、怪物与地牢环境
 */
export class ModelFactory {
  // 材质与几何体缓存
  private static matCache: Map<string, THREE.Material> = new Map();

  // =========================================================================
  // 1. 勇士 (Hero / Knight)
  // =========================================================================
  static createHeroMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'hero';

    // 身体 / 护甲 (蓝银高光板甲)
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.8,
      roughness: 0.25,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.25,
    });

    // 躯干板甲
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.28), armorMat);
    torso.position.y = 0.48;
    torso.castShadow = true;

    // 胸甲金色十字徽章
    const crestH = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.02), goldMat);
    crestH.position.set(0, 0.52, 0.15);
    const crestV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.02), goldMat);
    crestV.position.set(0, 0.52, 0.15);
    group.add(torso, crestH, crestV);

    // 左右肩甲 (Pauldrons)
    const pauldronGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const pauldronL = new THREE.Mesh(pauldronGeom, silverMat);
    pauldronL.scale.set(1.2, 0.8, 1.2);
    pauldronL.position.set(-0.25, 0.65, 0);
    const pauldronR = new THREE.Mesh(pauldronGeom, silverMat);
    pauldronR.scale.set(1.2, 0.8, 1.2);
    pauldronR.position.set(0.25, 0.65, 0);
    group.add(pauldronL, pauldronR);

    // 头盔 (Knight Great Helm)
    const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.3, 16), silverMat);
    helm.position.y = 0.88;
    helm.castShadow = true;

    // 面罩护目狭缝 (Visor Slit with glowing heroic eyes inside)
    const slitMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.06), slitMat);
    slit.position.set(0, 0.9, 0.15);

    const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), eyeGlowMat);
    eyeL.position.set(-0.06, 0.9, 0.17);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), eyeGlowMat);
    eyeR.position.set(0.06, 0.9, 0.17);

    // 头顶红色羽缨 (Red Feather Crest / Plume)
    const plumeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 8), plumeMat);
    plume.position.set(0, 1.1, -0.06);
    plume.rotation.x = -Math.PI / 4;
    group.add(helm, slit, eyeL, eyeR, plume);

    // 飘逸红色披风 (Flowing Red Cape)
    const capeMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.58), capeMat);
    cape.position.set(0, 0.46, -0.16);
    cape.rotation.x = 0.2;
    group.add(cape);

    // 双腿与战靴
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.14), silverMat);
    legL.position.set(-0.1, 0.14, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.14), silverMat);
    legR.position.set(0.1, 0.14, 0);
    group.add(legL, legR);

    // 右手铁剑
    const swordGroup = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.6, 0.015), silverMat);
    blade.position.y = 0.3;
    const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.06), goldMat);
    const swordGrip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    swordGrip.position.y = -0.09;
    const swordPommel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldMat);
    swordPommel.position.y = -0.17;
    swordGroup.add(blade, swordGuard, swordGrip, swordPommel);
    swordGroup.position.set(0.32, 0.45, 0.1);
    swordGroup.rotation.x = Math.PI / 4;
    group.add(swordGroup);

    // 左手圣盾
    const shieldGroup = new THREE.Group();
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.36), armorMat);
    const shieldRim = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.5, 0.38), goldMat);
    shieldRim.scale.set(0.95, 0.95, 0.95);
    const shieldEmblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), goldMat);
    shieldEmblem.position.x = -0.05;
    shieldGroup.add(shieldPlate, shieldRim, shieldEmblem);
    shieldGroup.position.set(-0.3, 0.45, 0.05);
    group.add(shieldGroup);

    // 角色体型等比缩减 20%
    group.scale.multiplyScalar(0.8);
    return group;
  }

  // =========================================================================
  // 2. 仙子 / 仙女 (Fairy NPC) - 极其优雅、丝滑流线的神圣仙灵二次元美少女
  // =========================================================================
  static createFairyMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'npc_fairy';

    // 材质定义：清透典雅的仙灵粉缎、纯净白丝、温润肌肤与闪耀黄金
    const dressMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.18,
      roughness: 0.32,
      metalness: 0.08,
    });
    const whiteSilkMat = new THREE.MeshStandardMaterial({
      color: 0xfff5f8,
      roughness: 0.28,
      metalness: 0.05,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.52,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.30,
      metalness: 0.15,
      emissive: 0xeab308,
      emissiveIntensity: 0.12,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.88,
      roughness: 0.20,
      emissive: 0xca8a04,
      emissiveIntensity: 0.25,
    });

    // 1. 丝滑流线型层叠仙灵长裙 (Multi-layered flowing flared gown)
    const dressCurvePoints: THREE.Vector2[] = [
      new THREE.Vector2(0.075, 0.58),
      new THREE.Vector2(0.095, 0.50),
      new THREE.Vector2(0.135, 0.40),
      new THREE.Vector2(0.19, 0.28),
      new THREE.Vector2(0.26, 0.16),
      new THREE.Vector2(0.34, 0.06),
      new THREE.Vector2(0.37, 0.0),
    ];
    const skirtGeo = new THREE.LatheGeometry(dressCurvePoints, 32);
    skirtGeo.computeVertexNormals();
    const skirt = new THREE.Mesh(skirtGeo, dressMat);

    // 裙摆内层纯白花边衬裙 (Ruffled Underskirt)
    const underCurvePoints: THREE.Vector2[] = [
      new THREE.Vector2(0.25, 0.14),
      new THREE.Vector2(0.34, 0.05),
      new THREE.Vector2(0.40, 0.0),
    ];
    const underSkirtGeo = new THREE.LatheGeometry(underCurvePoints, 32);
    underSkirtGeo.computeVertexNormals();
    const underSkirt = new THREE.Mesh(underSkirtGeo, whiteSilkMat);

    // 2. 纤细苗条上身、柔美胸衣、腰间金饰与背部蝴蝶结 (Bodice, Waist Ribbon & Bow)
    const bodiceGeo = new THREE.CylinderGeometry(0.075, 0.068, 0.16, 20);
    const bodice = new THREE.Mesh(bodiceGeo, dressMat);
    bodice.position.y = 0.66;
    const waistBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.025, 20), goldMat);
    waistBelt.position.y = 0.58;

    // 背后精致金色蝴蝶结 (Back Waist Bow)
    const bowGroup = new THREE.Group();
    const bowL = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 8, 14), goldMat);
    bowL.rotation.y = 0.35;
    bowL.position.set(-0.045, 0, 0);
    const bowR = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 8, 14), goldMat);
    bowR.rotation.y = -0.35;
    bowR.position.set(0.045, 0, 0);
    const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.020, 10, 10), goldMat);
    bowGroup.add(bowL, bowR, bowKnot);
    bowGroup.position.set(0, 0.58, -0.08);

    // 领口雪白蕾丝荷叶边与胸前金饰 (Neck Frill & Chest Ornament)
    const neckFrill = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.014, 10, 20), whiteSilkMat);
    neckFrill.rotation.x = Math.PI / 2;
    neckFrill.position.y = 0.74;

    const chestBow = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.038, 5), goldMat);
    chestBow.rotation.z = Math.PI / 2;
    chestBow.position.set(0, 0.70, 0.075);

    // 3. 优雅圆润的手臂与轻盈喇叭荷叶袖 (Graceful Flared Bell Sleeves & Fairy Pose)
    const armGroupL = new THREE.Group();
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), dressMat);
    shoulderL.position.set(-0.10, 0.72, 0);
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.13, 10), skinMat);
    upperArmL.position.set(-0.11, 0.65, 0.02);
    upperArmL.rotation.z = 0.32;
    upperArmL.rotation.x = -0.22;
    const cuffL = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.08, 14, 1, true), whiteSilkMat);
    cuffL.position.set(-0.08, 0.58, 0.07);
    cuffL.rotation.z = -0.38;
    cuffL.rotation.x = -0.55;
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.020, 10, 10), skinMat);
    handL.position.set(-0.03, 0.56, 0.10);
    armGroupL.add(shoulderL, upperArmL, cuffL, handL);

    const armGroupR = new THREE.Group();
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), dressMat);
    shoulderR.position.set(0.10, 0.72, 0);
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.13, 10), skinMat);
    upperArmR.position.set(0.12, 0.65, 0.03);
    upperArmR.rotation.z = -0.30;
    upperArmR.rotation.x = -0.15;
    const cuffR = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.08, 14, 1, true), whiteSilkMat);
    cuffR.position.set(0.13, 0.58, 0.07);
    cuffR.rotation.x = -0.38;
    cuffR.rotation.z = 0.20;
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.020, 10, 10), skinMat);
    handR.position.set(0.13, 0.53, 0.12);
    armGroupR.add(shoulderR, upperArmR, cuffR, handR);

    // 4. 仙子美颜头颅、超清动漫星眸面庞、精致精灵耳与飘逸金发
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.83;
    // 微微昂首朝向俯视摄像机（约 10 度），确保晶莹大眼睛与甜美微笑 100% 迎向玩家视角！
    headGroup.rotation.x = -0.16;

    // 头部圆润素体
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 24), skinMat);

    // 仙灵尖尖精灵耳 (Pointed Elf Ears) 与耳垂粉晶吊坠
    const earGeo = new THREE.ConeGeometry(0.022, 0.075, 8);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.position.set(-0.112, 0.01, -0.015);
    earL.rotation.set(-0.2, 0.3, Math.PI / 2 + 0.35);
    const earR = new THREE.Mesh(earGeo, skinMat);
    earR.position.set(0.112, 0.01, -0.015);
    earR.rotation.set(-0.2, -0.3, -Math.PI / 2 - 0.35);

    const earringMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const earringL = new THREE.Mesh(new THREE.OctahedronGeometry(0.014, 0), earringMat);
    earringL.position.set(-0.12, -0.025, 0.0);
    const earringR = new THREE.Mesh(new THREE.OctahedronGeometry(0.014, 0), earringMat);
    earringR.position.set(0.12, -0.025, 0.0);
    headGroup.add(head, earL, earR, earringL, earringR);

    // 精准贴合头部曲面的超清二次元神仙面庞 (Anime Fairy Face Plate with Sparkling Blue Eyes & Blush)
    const faceGeo = new THREE.PlaneGeometry(0.17, 0.17, 12, 12);
    const pos = faceGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // 沿球心外扩 0.0025，形成严密包裹头部的平滑曲面，绝无穿模
      const distSq = x * x + y * y;
      const z = Math.sqrt(Math.max(0.0001, 0.1175 * 0.1175 - distSq));
      pos.setZ(i, z);
    }
    faceGeo.computeVertexNormals();

    const faceMat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.getFairyFaceTexture(),
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.name = 'fairy_face';
    faceMesh.renderOrder = 5;
    faceMesh.castShadow = false;
    headGroup.add(faceMesh);

    // 秀发系统：层次分明、绝不遮挡双眼与眉毛
    // A. 头顶发盖（仅覆盖头顶颅盖骨，前额完全镂空开放，theta 仅延伸至 0.24 PI）
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.118, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.24),
      hairMat
    );

    // B. 脑后发丘（后半球 z <= 0，紧贴后脑勺）
    const hairBack = new THREE.Mesh(
      new THREE.SphereGeometry(0.118, 20, 16, -Math.PI / 2, Math.PI, Math.PI * 0.22, Math.PI * 0.52),
      hairMat
    );

    // C. 额前灵动中分微弧碎刘海 (Delicate parted wisps) - 完全位于额头两侧上方，绝不遮挡眼睛与腮红
    const wispL = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.055, 6), hairMat);
    wispL.position.set(-0.038, 0.062, 0.112);
    wispL.rotation.set(-0.35, 0.2, 0.35);

    const wispR = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.055, 6), hairMat);
    wispR.position.set(0.038, 0.062, 0.112);
    wispR.rotation.set(-0.35, -0.2, -0.35);

    // D. 脸颊两侧修容柔顺鬓发 (Face-framing side locks) - 顺着外侧脸颊自然弯垂 (|x| >= 0.095)
    const createCurvedSideLock = (isLeft: boolean) => {
      const strandGroup = new THREE.Group();
      const count = 5;
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const radius = 0.020 * (1 - t * 0.5);
        const seg = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 8), hairMat);
        const xOffset = isLeft ? -0.102 - t * 0.015 : 0.102 + t * 0.015;
        seg.position.set(xOffset, 0.03 - t * 0.18, 0.03 - t * 0.02);
        strandGroup.add(seg);
      }
      return strandGroup;
    };
    const sideLockL = createCurvedSideLock(true);
    const sideLockR = createCurvedSideLock(false);

    // E. 双侧悬浮俏皮双马尾 (Twin Fairy Side Twintails) 与蝴蝶结头绳
    const createTwintail = (isLeft: boolean) => {
      const tailGroup = new THREE.Group();
      tailGroup.position.set(isLeft ? -0.115 : 0.115, 0.04, -0.03);

      const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.007, 6, 10), goldMat);
      ribbon.rotation.x = Math.PI / 2;
      tailGroup.add(ribbon);

      const numPts = 6;
      for (let i = 0; i < numPts; i++) {
        const t = i / numPts;
        const r = 0.024 * (1 - t * 0.6);
        const node = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), hairMat);
        const sway = Math.sin(t * Math.PI) * 0.025;
        node.position.set(
          (isLeft ? -sway : sway) + (isLeft ? -t * 0.04 : t * 0.04),
          -t * 0.28,
          -t * 0.05
        );
        tailGroup.add(node);
      }
      return tailGroup;
    };
    const twintailL = createTwintail(true);
    const twintailR = createTwintail(false);

    // F. 背后及腰瀑布长发 (Cascading Long Waves)
    const backHairCurve: THREE.Vector2[] = [
      new THREE.Vector2(0.10, 0.02),
      new THREE.Vector2(0.125, -0.12),
      new THREE.Vector2(0.155, -0.26),
      new THREE.Vector2(0.18, -0.38),
      new THREE.Vector2(0.16, -0.45),
    ];
    const backHairGeo = new THREE.LatheGeometry(backHairCurve, 18, Math.PI * 0.72, Math.PI * 1.56);
    backHairGeo.computeVertexNormals();
    const cascadingHair = new THREE.Mesh(backHairGeo, hairMat);
    cascadingHair.position.set(0, 0, -0.015);

    // G. 仙灵璀璨王冠与红宝石星辉 (Royal Filigree Tiara with Ruby)
    const tiara = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.012, 8, 20), goldMat);
    tiara.rotation.x = Math.PI / 2;
    tiara.position.set(0, 0.105, 0.01);
    const tiaraGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.032, 0),
      new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.9 })
    );
    tiaraGem.position.set(0, 0.12, 0.082);

    headGroup.add(
      hairCrown,
      hairBack,
      wispL,
      wispR,
      sideLockL,
      sideLockR,
      twintailL,
      twintailR,
      cascadingHair,
      tiara,
      tiaraGem
    );

    // 5. 晶莹剔透流光蝶翼 (Delicate Luminescent Butterfly Wings)
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0xcffafe,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      transmission: 0.75,
      transparent: true,
      opacity: 0.88,
      roughness: 0.12,
      side: THREE.DoubleSide,
    });

    const createWingShape = (isUpper: boolean): THREE.Shape => {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      if (isUpper) {
        s.bezierCurveTo(0.15, 0.12, 0.35, 0.32, 0.42, 0.26);
        s.bezierCurveTo(0.44, 0.16, 0.35, 0.06, 0.20, 0.02);
      } else {
        s.bezierCurveTo(0.12, -0.04, 0.28, -0.18, 0.25, -0.25);
        s.bezierCurveTo(0.18, -0.28, 0.08, -0.18, 0.02, -0.05);
      }
      s.closePath();
      return s;
    };

    const upperWingGeo = new THREE.ShapeGeometry(createWingShape(true));
    const lowerWingGeo = new THREE.ShapeGeometry(createWingShape(false));

    // 左侧仙翼总成
    const wingGroupL = new THREE.Group();
    wingGroupL.name = 'wing_l';
    wingGroupL.position.set(-0.06, 0.70, -0.10);
    const wingUL = new THREE.Mesh(upperWingGeo, wingMat);
    wingUL.rotation.y = Math.PI - 0.2;
    wingUL.rotation.z = -0.2;
    const wingLL = new THREE.Mesh(lowerWingGeo, wingMat);
    wingLL.rotation.y = Math.PI - 0.2;
    wingLL.rotation.z = -0.1;
    wingGroupL.add(wingUL, wingLL);

    // 右侧仙翼总成
    const wingGroupR = new THREE.Group();
    wingGroupR.name = 'wing_r';
    wingGroupR.position.set(0.06, 0.70, -0.10);
    const wingUR = new THREE.Mesh(upperWingGeo, wingMat);
    wingUR.rotation.y = 0.2;
    wingUR.rotation.z = 0.2;
    const wingLR = new THREE.Mesh(lowerWingGeo, wingMat);
    wingLR.rotation.y = 0.2;
    wingLR.rotation.z = 0.1;
    wingGroupR.add(wingUR, wingLR);

    // 6. 星辰祈愿魔杖 (Celestial Star Wand)
    const wandGroup = new THREE.Group();
    const wandShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.012, 0.52, 12), goldMat);
    wandShaft.position.y = 0.26;
    const wandStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), goldMat);
    wandStar.position.y = 0.52;
    wandStar.name = 'wand_star';
    const wandCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfacc15, emissiveIntensity: 0.9 })
    );
    wandCore.position.y = 0.52;
    wandGroup.add(wandShaft, wandStar, wandCore);
    wandGroup.position.set(0.18, 0.48, 0.16);
    wandGroup.rotation.z = -0.22;
    wandGroup.rotation.x = -0.15;

    // 7. 脚底神圣光辉魔法阵 (Floating Runic Magic Circle)
    const runeTex = TextureGenerator.getMagicRuneTexture();
    const runeMat = new THREE.MeshBasicMaterial({
      map: runeTex,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    });
    const runeDisc = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.05), runeMat);
    runeDisc.rotation.x = -Math.PI / 2;
    runeDisc.position.y = 0.02;
    runeDisc.name = 'fairy_rune';
    runeDisc.castShadow = false;

    group.add(
      skirt,
      underSkirt,
      bodice,
      waistBelt,
      bowGroup,
      neckFrill,
      chestBow,
      armGroupL,
      armGroupR,
      headGroup,
      wingGroupL,
      wingGroupR,
      wandGroup,
      runeDisc
    );

    return group;
  }

  // =========================================================================
  // 友好 NPC 专属：头顶悬浮金色互动对话气泡与脚底光环 (Interactive NPC Dialogue Bubble)
  // =========================================================================
  private static createNpcBubble(): THREE.Group {
    const bubbleG = new THREE.Group();
    bubbleG.name = 'npc_bubble';
    bubbleG.position.set(0, 1.25, 0);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.85,
      metalness: 0.85,
      roughness: 0.2,
    });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 气泡主圆角底盘
    const bg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), goldMat);
    bg.rotation.x = Math.PI / 2;

    // 气泡下方向下小尾巴 (Speech Pointer)
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), goldMat);
    tail.position.set(0, -0.12, 0);
    tail.rotation.z = Math.PI;

    // 气泡内部省略号 3 个白色微亮圆点 (...)
    const dot1 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), whiteMat);
    dot1.position.set(-0.06, 0, 0.025);
    const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), whiteMat);
    dot2.position.set(0, 0, 0.025);
    const dot3 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), whiteMat);
    dot3.position.set(0.06, 0, 0.025);

    bubbleG.add(bg, tail, dot1, dot2, dot3);

    // 脚底友好柔和金光光环 (Friendly NPC Ground Halo)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.02, 8, 24), haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, -1.23, 0); // 落在地面高度
    halo.name = 'npc_halo';
    bubbleG.add(halo);

    // 角色体型等比缩减 20%
    bubbleG.scale.multiplyScalar(0.8);
    return bubbleG;
  }

  // =========================================================================
  // 3. 神秘老人 / 仙人 (Old Man / Sage NPC) - 仙风道骨白鹤仙袍智者，绝非蓝袍法师怪
  // 拥有寿星长者仙袍、长寿白须、挽发道髻金簪、灵木手杖与宝葫芦、头顶友好互动气泡
  // =========================================================================
  static createOldManMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'npc_old_man';

    const robeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 }); // 鹤羽素白仙袍
    const azureMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }); // 天青色云纹边饰
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.25 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });

    // 1. 宽袖仙风道袍 (Torso & Flowing Sleeves)
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.36, 0.72, 16), robeMat);
    robe.position.y = 0.36;
    const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 16), azureMat);
    sash.position.y = 0.44;
    const sashKnot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.03), goldMat);
    sashKnot.position.set(0, 0.38, 0.23);

    // 宽袍大袖
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.32, 10), robeMat);
    sleeveL.position.set(-0.26, 0.46, 0.02);
    sleeveL.rotation.z = -0.4;
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.32, 10), robeMat);
    sleeveR.position.set(0.26, 0.46, 0.02);
    sleeveR.rotation.z = 0.4;

    // 2. 慈祥长者面容 (Serene Kind Face & Flowing White Beard)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), skinMat);
    head.position.set(0, 0.82, 0);

    // 飘逸仙翁长白须 (三缕长须飘逸垂胸，长达腹部)
    const beardMain = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.42, 10), hairMat);
    beardMain.position.set(0, 0.60, 0.10);
    beardMain.rotation.x = 0.18;
    const beardL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.30, 8), hairMat);
    beardL.position.set(-0.06, 0.64, 0.09);
    beardL.rotation.x = 0.15;
    beardL.rotation.z = -0.15;
    const beardR = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.30, 8), hairMat);
    beardR.position.set(0.06, 0.64, 0.09);
    beardR.rotation.x = 0.15;
    beardR.rotation.z = 0.15;

    // 慈祥长寿白眉与和蔼眼眸
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), hairMat);
    browL.position.set(-0.05, 0.88, 0.14);
    browL.rotation.z = -0.2;
    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), hairMat);
    browR.position.set(0.05, 0.88, 0.14);
    browR.rotation.z = 0.2;

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.018), eyeMat);
    eyeL.position.set(-0.045, 0.84, 0.13);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.018), eyeMat);
    eyeR.position.set(0.045, 0.84, 0.13);

    // 3. 道骨仙风发型：银白发髻与碧玉发簪 (Silver Topknot & Jade Hairpin - 绝无巫师尖帽)
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), hairMat);
    hairTop.position.set(0, 0.98, -0.02);
    const hairpin = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.24, 6), goldMat);
    hairpin.rotation.z = Math.PI / 2;
    hairpin.position.set(0, 0.98, -0.02);

    const hairBack = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.34, 10), hairMat);
    hairBack.position.set(0, 0.74, -0.08);

    // 4. 寿星盘龙灵木手杖与宝葫芦 (Immortal Walking Cane & Golden Gourd)
    const staffG = new THREE.Group();
    const caneShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.96, 8), woodMat);
    caneShaft.position.y = 0.48;
    const caneKnob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), woodMat);
    caneKnob.position.y = 0.98;

    // 悬挂红绳小金葫芦 (Calabash of Longevity)
    const gourdUpper = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), goldMat);
    gourdUpper.position.set(0.06, 0.88, 0);
    const gourdLower = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), goldMat);
    gourdLower.position.set(0.06, 0.82, 0);
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.08), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    cord.position.set(0.03, 0.92, 0);

    staffG.add(caneShaft, caneKnob, gourdUpper, gourdLower, cord);
    staffG.position.set(0.34, 0, 0.10);

    group.add(
      robe, sash, sashKnot, sleeveL, sleeveR,
      head, beardMain, beardL, beardR, browL, browR, eyeL, eyeR,
      hairTop, hairpin, hairBack, staffG
    );

    // 5. 挂载友好交互指示器 (头顶气泡与脚底光环)
    group.add(this.createNpcBubble());

    // 角色体型等比缩减 20%
    group.scale.multiplyScalar(0.8);
    return group;
  }

  // =========================================================================
  // 3.5 富商 / 交易者 (Trader / Merchant NPC) - 华贵红金长袍，提金币钱袋与金币
  // =========================================================================
  static createTraderMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'npc_trader';

    const redRobeMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.55 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.25 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
    const pouchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

    // 富商长袍
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.70, 14), redRobeMat);
    robe.position.y = 0.35;
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.03), goldMat);
    trim.position.set(0, 0.35, 0.18);

    // 头部
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), skinMat);
    head.position.set(0, 0.82, 0);

    // 富商八字胡与笑容
    const mustache = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.03), hairMat);
    mustache.position.set(0, 0.78, 0.14);
    const smile = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.02), hairMat);
    smile.position.set(0, 0.75, 0.14);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02), eyeMat);
    eyeL.position.set(-0.05, 0.84, 0.13);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02), eyeMat);
    eyeR.position.set(0.05, 0.84, 0.13);

    // 商贾宽边礼帽配羽毛与翡翠
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.17, 0.12, 12), redRobeMat);
    hat.position.set(0, 0.94, -0.02);
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 14), redRobeMat);
    hatBrim.position.set(0, 0.89, -0.02);
    const feather = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.22, 6), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    feather.position.set(0.16, 1.05, -0.02);
    feather.rotation.z = -0.4;

    // 左手提沉甸甸的金币钱袋
    const pouch = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), pouchMat);
    pouch.position.set(-0.28, 0.42, 0.12);
    const pouchTie = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 6, 10), goldMat);
    pouchTie.position.set(-0.28, 0.50, 0.12);
    pouchTie.rotation.x = Math.PI / 2;

    // 右手摊开呈现一枚闪耀大金币
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), goldMat);
    coin.rotation.x = Math.PI / 3;
    coin.position.set(0.28, 0.48, 0.16);

    group.add(robe, trim, head, mustache, smile, eyeL, eyeR, hat, hatBrim, feather, pouch, pouchTie, coin);
    group.add(this.createNpcBubble());

    // 角色体型等比缩减 20%
    group.scale.multiplyScalar(0.8);
    return group;
  }

  // =========================================================================
  // 4. 小偷 / 盗贼 (Thief NPC) - 帅气中世纪轻甲游侠盗贼（棕色皮马甲与红发带）
  // =========================================================================
  static createThiefMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'npc_thief';

    // 材质库：采用暖棕与暗赤色皮革，彻底与绿色怪区分开
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x92400e, // 暖鞍棕色游侠贴身皮革马甲
      roughness: 0.65,
      metalness: 0.1,
    });
    const darkLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // 深巧克力色负重腰带、皮带与皮靴
      roughness: 0.72,
    });
    const cowlMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // 沉稳深石灰蓝兜帽与单肩披风
      roughness: 0.82,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.6,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.92,
      roughness: 0.18,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.25,
    });

    // 1. 敏捷下肢与皮革长靴 (Legs & High Laced Boots)
    const legL = new THREE.Group();
    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.22, 10), darkLeatherMat);
    thighL.position.y = 0.26;
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.14), darkLeatherMat);
    bootL.position.set(0, 0.08, 0.02);
    const cuffL = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 6, 12), brassMat);
    cuffL.rotation.x = Math.PI / 2;
    cuffL.position.y = 0.15;
    legL.add(thighL, bootL, cuffL);
    legL.position.x = -0.11;

    const legR = new THREE.Group();
    const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.22, 10), darkLeatherMat);
    thighR.position.y = 0.26;
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.14), darkLeatherMat);
    bootR.position.set(0, 0.08, 0.02);
    const cuffR = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 6, 12), brassMat);
    cuffR.rotation.x = Math.PI / 2;
    cuffR.position.y = 0.15;
    legR.add(thighR, bootR, cuffR);
    legR.position.x = 0.11;

    group.add(legL, legR);

    // 2. 游侠皮甲躯干与十字背带 (Torso with Crossed Harness)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.34, 12), leatherMat);
    torso.position.y = 0.50;
    torso.scale.set(1.15, 1.0, 0.85);

    // 胸前交叉皮带与黄铜中心扣
    const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.02), darkLeatherMat);
    strap1.position.set(0, 0.50, 0.12);
    strap1.rotation.z = 0.55;
    const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.02), darkLeatherMat);
    strap2.position.set(0, 0.50, 0.12);
    strap2.rotation.z = -0.55;
    const centerBuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), brassMat);
    centerBuckle.rotation.x = Math.PI / 2;
    centerBuckle.position.set(0, 0.50, 0.13);

    // 3. 盗贼多功能腰带、锁匠工具包与挂环 (Utility Belt & Lockpick Pouches)
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 14), darkLeatherMat);
    belt.position.y = 0.37;
    belt.scale.set(1.15, 1.0, 0.88);
    const beltBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.03), brassMat);
    beltBuckle.position.set(0, 0.37, 0.14);

    // 左右侧边装备小皮包
    const pouchL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.07), darkLeatherMat);
    pouchL.position.set(-0.18, 0.36, 0.04);
    const pouchR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.07), darkLeatherMat);
    pouchR.position.set(0.18, 0.36, 0.04);

    // 腰间开锁钥匙环与长细撬锁针 (Lockpicks Ring)
    const pickRing = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.005, 6, 12), brassMat);
    pickRing.position.set(-0.12, 0.33, 0.12);
    const pickNeedle = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.10), steelMat);
    pickNeedle.position.set(-0.12, 0.28, 0.12);
    pickNeedle.rotation.z = -0.2;

    group.add(torso, strap1, strap2, centerBuckle, belt, beltBuckle, pouchL, pouchR, pickRing, pickNeedle);

    // 4. 潇洒单肩披风 (Asymmetric Rogue Shoulder Capelet)
    const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.42), cowlMat);
    cape.position.set(-0.06, 0.52, -0.14);
    cape.rotation.y = 0.15;
    cape.rotation.x = -0.1;
    group.add(cape);

    // 5. 游侠兜帽、蒙面巾与锐利目光 (Hood, Mask & Focused Eyes)
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.78;

    // 兜帽深顶与垂褶
    const hoodTop = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), cowlMat);
    hoodTop.position.set(0, 0.02, -0.02);
    const hoodPeak = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.20, 8), cowlMat);
    hoodPeak.position.set(0, 0.14, -0.09);
    hoodPeak.rotation.x = -0.65;

    // 兜帽前额檐边
    const hoodBrim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 16, Math.PI * 1.3), cowlMat);
    hoodBrim.rotation.x = 0.3;
    hoodBrim.position.set(0, 0.02, 0.04);

    // 帅气游侠红发带与潇洒短发 (Rogue Red Headband & Short Brown Hair)
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
    const headbandMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });

    const headband = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16), headbandMat);
    headband.rotation.x = Math.PI / 2;
    headband.position.set(0, 0.05, 0.02);

    const hairBangs = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.04), hairMat);
    hairBangs.position.set(0, 0.08, 0.11);

    // 兜帽阴影下的英俊脸庞与友好微笑
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), skinMat);
    face.position.set(0, 0, 0.02);

    const smile = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), new THREE.MeshBasicMaterial({ color: 0x991b1b }));
    smile.position.set(0, -0.04, 0.12);

    // 炯炯有神的锐利琥珀金眼瞳 (Amber Rogue Eyes)
    const eyeIrisMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.018), eyeIrisMat);
    eyeL.position.set(-0.045, 0.035, 0.12);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.018), eyeIrisMat);
    eyeR.position.set(0.045, 0.035, 0.12);

    headGroup.add(hoodTop, hoodPeak, hoodBrim, headband, hairBangs, face, smile, eyeL, eyeR);
    group.add(headGroup);

    // 6. 盗贼双臂与精钢匕首 (Articulated Arms & Sleek Thief Daggers)
    // 左臂与左手握持开锁长针
    const armGroupL = new THREE.Group();
    armGroupL.position.set(-0.18, 0.62, 0);
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.16, 8), leatherMat);
    sleeveL.position.y = -0.06;
    const bracerL = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.12, 8), darkLeatherMat);
    bracerL.position.set(0.02, -0.16, 0.06);
    bracerL.rotation.x = -0.4;
    const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), darkLeatherMat);
    gloveL.position.set(0.03, -0.22, 0.10);
    armGroupL.add(sleeveL, bracerL, gloveL);

    // 右臂与右手握持锋利盗贼匕首 (Stealth Falchion Dagger)
    const armGroupR = new THREE.Group();
    armGroupR.position.set(0.18, 0.62, 0);
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.16, 8), leatherMat);
    sleeveR.position.y = -0.06;
    const bracerR = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.12, 8), darkLeatherMat);
    bracerR.position.set(-0.02, -0.16, 0.08);
    bracerR.rotation.x = -0.6;
    const gloveR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), darkLeatherMat);
    gloveR.position.set(-0.03, -0.22, 0.14);

    // 匕首总成
    const daggerGroup = new THREE.Group();
    const daggerBlade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.012), steelMat);
    daggerBlade.position.y = 0.12;
    const daggerGuard = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.015, 0.02), brassMat);
    daggerGuard.position.y = 0.0;
    const daggerGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08), darkLeatherMat);
    daggerGrip.position.y = -0.04;
    const daggerPommel = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), brassMat);
    daggerPommel.position.y = -0.08;
    daggerGroup.add(daggerBlade, daggerGuard, daggerGrip, daggerPommel);

    daggerGroup.position.set(-0.03, -0.22, 0.16);
    daggerGroup.rotation.x = -0.8;
    daggerGroup.rotation.z = -0.2;

    armGroupR.add(sleeveR, bracerR, gloveR, daggerGroup);
    group.add(armGroupL, armGroupR);

    // 7. 挂载友好互动对话气泡
    group.add(this.createNpcBubble());

    // 递归阴影投射与接收
    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    // 角色体型等比缩减 20%
    group.scale.multiplyScalar(0.8);
    return group;
  }

  // =========================================================================
  // 5. 公主 (Princess NPC)
  // =========================================================================
  static createPrincessMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'npc_princess';

    const royalPinkMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });

    // 华丽公主皇室长裙
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.65, 16), royalPinkMat);
    skirt.position.y = 0.32;
    const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.25, 12), royalPinkMat);
    bodice.position.y = 0.68;

    // 头部与长卷金发
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 })
    );
    head.position.y = 0.88;
    const hair = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.5, 12), hairMat);
    hair.position.set(0, 0.75, -0.06);

    // 纯金皇冠 (Royal Coronet with Ruby)
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.12, 8), goldMat);
    crown.position.set(0, 1.02, 0);
    const ruby = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.04, 0),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.3 })
    );
    ruby.position.set(0, 1.04, 0.1);

    group.add(skirt, bodice, head, hair, crown, ruby);

    // 角色体型等比缩减 20%
    group.scale.multiplyScalar(0.8);
    return group;
  }

  // =========================================================================
  // 6. 门 (Door) - 极简纯粹门体设计：无门框石梁，纯色金属门扇与钥匙色彩严格match
  // 尺寸精准填满单格网格 (宽 1.0，高 1.20 与墙壁严丝合缝平齐)
  // =========================================================================
  static createDoorMesh(type: 'yellow' | 'blue' | 'red' | 'iron'): THREE.Group {
    const group = new THREE.Group();
    group.name = `door_${type}`;

    let mainColorHex = 0xfacc15; // 黄门 (与黄钥匙 0xfacc15 严格对齐)
    let darkColorHex = 0xca8a04;
    let emissiveHex = 0xeab308;

    if (type === 'blue') {
      mainColorHex = 0x38bdf8; // 蓝门 (与蓝钥匙 0x38bdf8 严格对齐)
      darkColorHex = 0x0284c7;
      emissiveHex = 0x0ea5e9;
    } else if (type === 'red') {
      mainColorHex = 0xef4444; // 红门 (与红钥匙 0xef4444 严格对齐)
      darkColorHex = 0xb91c1c;
      emissiveHex = 0xdc2626;
    } else if (type === 'iron') {
      mainColorHex = 0x94a3b8; // 铁门 / 栅栏门
      darkColorHex = 0x475569;
      emissiveHex = 0x64748b;
    }

    // 整个门作为一个门板对象 (包含左右双对开门扇 door_leaf_l 和 door_leaf_r)
    const doorPanel = new THREE.Group();
    doorPanel.name = 'door_panel';

    const doorLeafL = new THREE.Group();
    doorLeafL.name = 'door_leaf_l';
    const doorLeafR = new THREE.Group();
    doorLeafR.name = 'door_leaf_r';

    const DOOR_H = 0.90; // 严格与主角同高 (0.90)

    if (type === 'iron') {
      // 铁栅栏门风格 (双扇对开铁门)
      const ironMat = new THREE.MeshStandardMaterial({
        color: mainColorHex,
        metalness: 0.9,
        roughness: 0.25,
      });

      // 左半门栅栏
      const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, DOOR_H, 0.12), ironMat);
      sideL.position.set(-0.46, DOOR_H / 2, 0);
      const hBarLGeo = new THREE.BoxGeometry(0.48, 0.07, 0.10);
      const hTopL = new THREE.Mesh(hBarLGeo, ironMat);
      hTopL.position.set(-0.24, DOOR_H - 0.05, 0);
      const hMidL = new THREE.Mesh(hBarLGeo, ironMat);
      hMidL.position.set(-0.24, DOOR_H / 2, 0);
      const hBotL = new THREE.Mesh(hBarLGeo, ironMat);
      hBotL.position.set(-0.24, 0.05, 0);
      doorLeafL.add(sideL, hTopL, hMidL, hBotL);

      for (let i = 0; i < 3; i++) {
        const x = -0.36 + i * 0.12;
        const vBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, DOOR_H - 0.02, 8), ironMat);
        vBar.position.set(x, DOOR_H / 2, 0);
        doorLeafL.add(vBar);
      }

      // 右半门栅栏
      const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.08, DOOR_H, 0.12), ironMat);
      sideR.position.set(0.46, DOOR_H / 2, 0);
      const hBarRGeo = new THREE.BoxGeometry(0.48, 0.07, 0.10);
      const hTopR = new THREE.Mesh(hBarRGeo, ironMat);
      hTopR.position.set(0.24, DOOR_H - 0.05, 0);
      const hMidR = new THREE.Mesh(hBarRGeo, ironMat);
      hMidR.position.set(0.24, DOOR_H / 2, 0);
      const hBotR = new THREE.Mesh(hBarRGeo, ironMat);
      hBotR.position.set(0.24, 0.05, 0);
      doorLeafR.add(sideR, hTopR, hMidR, hBotR);

      for (let i = 0; i < 3; i++) {
        const x = 0.12 + i * 0.12;
        const vBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, DOOR_H - 0.02, 8), ironMat);
        vBar.position.set(x, DOOR_H / 2, 0);
        doorLeafR.add(vBar);
      }
    } else {
      // 鲜艳纯正的金属光泽实心门扇 (黄门、蓝门、红门)
      const doorMat = new THREE.MeshStandardMaterial({
        color: mainColorHex,
        emissive: emissiveHex,
        emissiveIntensity: 0.22,
        metalness: 0.85,
        roughness: 0.26,
      });
      const trimMat = new THREE.MeshStandardMaterial({
        color: darkColorHex,
        metalness: 0.88,
        roughness: 0.22,
      });

      // 1. 左右双开对扇门板本体 (每扇宽 0.485, 高 0.90, 厚 0.16)
      const leafGeo = new THREE.BoxGeometry(0.485, DOOR_H, 0.16);
      leafGeo.translate(0, DOOR_H / 2, 0);

      const leafL = new THREE.Mesh(leafGeo, doorMat);
      leafL.position.x = -0.245;
      leafL.castShadow = true;
      leafL.receiveShadow = true;

      const leafR = new THREE.Mesh(leafGeo, doorMat);
      leafR.position.x = 0.245;
      leafR.castShadow = true;
      leafR.receiveShadow = true;

      // 2. 门板横向加固金属横梁与包边 (分别附着在左右两扇门上)
      const barGeo = new THREE.BoxGeometry(0.485, 0.07, 0.18);

      const barTopL = new THREE.Mesh(barGeo, trimMat);
      barTopL.position.set(-0.245, 0.72, 0);
      const barMidL = new THREE.Mesh(barGeo, trimMat);
      barMidL.position.set(-0.245, DOOR_H / 2, 0);
      const barBottomL = new THREE.Mesh(barGeo, trimMat);
      barBottomL.position.set(-0.245, 0.18, 0);

      const barTopR = new THREE.Mesh(barGeo, trimMat);
      barTopR.position.set(0.245, 0.72, 0);
      const barMidR = new THREE.Mesh(barGeo, trimMat);
      barMidR.position.set(0.245, DOOR_H / 2, 0);
      const barBottomR = new THREE.Mesh(barGeo, trimMat);
      barBottomR.position.set(0.245, 0.18, 0);

      // 3. 正中圆形锁芯徽章与钥匙孔 (左右对开各占一半)
      const lockPlateLGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.20, 16, 1, false, -Math.PI / 2, Math.PI);
      lockPlateLGeo.rotateX(Math.PI / 2);
      const lockPlateL = new THREE.Mesh(lockPlateLGeo, trimMat);
      lockPlateL.position.set(0, DOOR_H / 2, 0);

      const lockPlateRGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.20, 16, 1, false, Math.PI / 2, Math.PI);
      lockPlateRGeo.rotateX(Math.PI / 2);
      const lockPlateR = new THREE.Mesh(lockPlateRGeo, trimMat);
      lockPlateR.position.set(0, DOOR_H / 2, 0);

      // 钥匙孔槽
      const keyholeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const keyholeFront = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.075, 0.02), keyholeMat);
      keyholeFront.position.set(0, DOOR_H / 2, 0.105);
      const keyholeBack = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.075, 0.02), keyholeMat);
      keyholeBack.position.set(0, DOOR_H / 2, -0.105);

      doorLeafL.add(leafL, barTopL, barMidL, barBottomL, lockPlateL);
      doorLeafR.add(leafR, barTopR, barMidR, barBottomR, lockPlateR, keyholeFront, keyholeBack);
    }

    doorPanel.add(doorLeafL, doorLeafR);

    group.add(doorPanel);
    return group;
  }

  // =========================================================================
  // 7. 怪物系列 (Monsters)
  // =========================================================================
  static createMonsterMesh(monsterId: string): THREE.Group {
    const data = MONSTERS[monsterId] || MONSTERS.green_slime;
    const color = new THREE.Color(data.color);
    let group: THREE.Group;

    if (data.modelType === 'slime') {
      group = this.createSlimeMesh(monsterId, data, color);
    } else if (data.modelType === 'bat') {
      group = this.createBatMesh(monsterId, data, color);
    } else if (data.modelType === 'skeleton') {
      group = this.createSkeletonMesh(monsterId, data, color);
    } else if (data.modelType === 'mage') {
      group = this.createMageMesh(monsterId, data, color);
    } else if (data.modelType === 'guard' || data.modelType === 'knight') {
      group = this.createKnightMesh(monsterId, data, color);
    } else {
      group = this.createBossMesh(monsterId, data, color);
    }

    // 递归为所有怪物部件开启阴影投射与阴影接收
    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    // 角色体型等比缩减 20%
    group.scale.multiplyScalar(0.8);
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.1 史莱姆系列 (Slime)
  // -------------------------------------------------------------------------
  private static createSlimeMesh(monsterId: string, _data: any, color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.02),
      new THREE.Vector2(0.18, 0.025),
      new THREE.Vector2(0.34, 0.05),
      new THREE.Vector2(0.43, 0.12),
      new THREE.Vector2(0.45, 0.22),
      new THREE.Vector2(0.41, 0.34),
      new THREE.Vector2(0.32, 0.46),
      new THREE.Vector2(0.20, 0.58),
      new THREE.Vector2(0.10, 0.68),
      new THREE.Vector2(0.03, 0.76),
      new THREE.Vector2(0.0, 0.80),
    ];
    const slimeGeo = new THREE.LatheGeometry(pts, 24);
    slimeGeo.computeVertexNormals();

    const slimeMat = new THREE.MeshPhysicalMaterial({
      color,
      transmission: 0.52,
      opacity: 0.94,
      transparent: true,
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      ior: 1.35,
      reflectivity: 0.85,
    });

    const body = new THREE.Mesh(slimeGeo, slimeMat);

    // 内部发光魔核
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: color,
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), coreMat);
    core.position.set(0, 0.28, 0);

    // 内部悬浮微小气泡
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), bubbleMat);
    b1.position.set(0.14, 0.22, 0.08);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), bubbleMat);
    b2.position.set(-0.12, 0.36, -0.06);

    // 灵动神态 3D 大眼睛
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEye = (x: number) => {
      const eyeG = new THREE.Group();
      const white = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), eyeWhiteMat);
      white.scale.set(1.0, 1.15, 0.5);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyePupilMat);
      pupil.scale.set(1.0, 1.1, 0.3);
      pupil.position.set(0, 0, 0.04);

      const spec = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), specMat);
      spec.position.set(0.02, 0.03, 0.06);

      eyeG.add(white, pupil, spec);
      eyeG.position.set(x, 0.35, 0.36);
      eyeG.rotation.x = -0.15;
      eyeG.rotation.y = x < 0 ? -0.15 : 0.15;
      return eyeG;
    };

    group.add(body, core, b1, b2, createEye(-0.13), createEye(0.13));

    if (monsterId === 'big_slime') {
      group.scale.set(1.25, 1.25, 1.25);
    } else if (monsterId === 'slime_king') {
      const crownG = new THREE.Group();
      const crownGold = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.9,
        roughness: 0.2,
      });
      const crownCirclet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.2, 0.08, 16, 1, true),
        crownGold
      );
      crownG.add(crownCirclet);

      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI * 2) / 6;
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 6), crownGold);
        spire.position.set(Math.cos(ang) * 0.21, 0.09, Math.sin(ang) * 0.21);
        crownG.add(spire);

        const gemMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0xef4444 : 0x3b82f6,
          emissive: i % 2 === 0 ? 0xdc2626 : 0x2563eb,
          emissiveIntensity: 0.8,
          metalness: 0.3,
          roughness: 0.1,
        });
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), gemMat);
        gem.position.set(Math.cos(ang) * 0.215, 0.0, Math.sin(ang) * 0.215);
        crownG.add(gem);
      }

      crownG.position.y = 0.74;
      group.add(crownG);
      group.scale.set(1.4, 1.35, 1.4);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.2 蝙蝠系列 (Bat) - 饱满丝绒身躯、萌系生动面庞、平滑弧度翼膜与连贯骨架拍击
  // -------------------------------------------------------------------------
  private static createBatMesh(monsterId: string, _data: any, color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    // 材质定义
    const batFurMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.65,
      metalness: 0.1,
    });

    const chestFurMat = new THREE.MeshStandardMaterial({
      color: color.clone().offsetHSL(0, -0.05, 0.12),
      roughness: 0.8,
      metalness: 0.05,
    });

    const innerEarMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const wingMembraneMat = new THREE.MeshStandardMaterial({
      color: color.clone().multiplyScalar(0.72),
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const wingBoneMat = new THREE.MeshStandardMaterial({
      color: color.clone().multiplyScalar(0.5),
      roughness: 0.5,
      metalness: 0.1,
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff1020,
      emissive: 0xee0022,
      emissiveIntensity: 0.75,
      roughness: 0.15,
    });

    const eyeSpecMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const fangMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.05 });
    const darkFeatureMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });

    // 1. 躯干 (Torso) - 饱满梨形丝绒身体，平滑无棱角
    const torsoPoints: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.08, 0.03),
      new THREE.Vector2(0.14, 0.10),
      new THREE.Vector2(0.16, 0.20), // 饱满肚子
      new THREE.Vector2(0.14, 0.32), // 胸部
      new THREE.Vector2(0.10, 0.42), // 颈部收束
      new THREE.Vector2(0, 0.45),
    ];
    const torsoGeo = new THREE.LatheGeometry(torsoPoints, 24);
    torsoGeo.computeVertexNormals();
    const torso = new THREE.Mesh(torsoGeo, batFurMat);
    torso.position.set(0, 0.28, -0.02);
    torso.rotation.x = 0.22; // 自然前倾悬停身姿

    // 胸部毛领圈 (Chest Ruff)
    const chestRuff = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.032, 12, 24), chestFurMat);
    chestRuff.position.set(0, 0.60, 0.03);
    chestRuff.rotation.x = 0.55;
    chestRuff.scale.set(1.05, 0.85, 1.15);

    // 底部抓握小脚爪 (Talons)
    const createFoot = (x: number) => {
      const footG = new THREE.Group();
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.010, 0.08, 8), batFurMat);
      leg.position.set(0, -0.04, 0);
      leg.rotation.x = -0.3;
      footG.add(leg);

      for (let i = -1; i <= 1; i++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.028, 6), darkFeatureMat);
        claw.position.set(i * 0.012, -0.08, 0.015);
        claw.rotation.x = Math.PI * 0.65;
        footG.add(claw);
      }
      footG.position.set(x, 0.30, -0.06);
      return footG;
    };

    // 2. 头部 (Head) - 圆润自然萌态头部与圆滑吻部，彻底消除尖锥匹诺曹长鼻
    const headG = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.145, 24, 20), batFurMat);
    skull.scale.set(1.05, 0.95, 1.05);

    // 圆润口吻 (Smooth Rounded Muzzle)
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 16), batFurMat);
    muzzle.scale.set(1.15, 0.75, 1.25);
    muzzle.position.set(0, -0.04, 0.11);

    // 小巧黑鼻头 (Button Nose)
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 12), darkFeatureMat);
    nose.scale.set(1.2, 0.8, 1.0);
    nose.position.set(0, -0.015, 0.20);

    // 晶莹吸血尖牙 (Vampire Fangs)
    const fangL = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.052, 10), fangMat);
    fangL.position.set(-0.038, -0.082, 0.15);
    fangL.rotation.x = Math.PI - 0.22;
    fangL.rotation.z = -0.08;

    const fangR = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.052, 10), fangMat);
    fangR.position.set(0.038, -0.082, 0.15);
    fangR.rotation.x = Math.PI - 0.22;
    fangR.rotation.z = 0.08;

    // 灵动红宝石大眼睛与高光点 (Glossy Ruby Eyes & Highlights)
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 16), eyeMat);
    eyeL.position.set(-0.065, 0.024, 0.125);
    const specL = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), eyeSpecMat);
    specL.position.set(-0.056, 0.040, 0.154);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 16), eyeMat);
    eyeR.position.set(0.065, 0.024, 0.125);
    const specR = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), eyeSpecMat);
    specR.position.set(0.074, 0.040, 0.154);

    // 杯状自然微弯蝙蝠耳廓 (Cupped Aerodynamic Bat Ears)
    const earShape = new THREE.Shape();
    earShape.moveTo(0, 0);
    earShape.quadraticCurveTo(0.065, 0.10, 0.055, 0.23);
    earShape.quadraticCurveTo(0.025, 0.21, 0.0, 0.25);
    earShape.quadraticCurveTo(-0.035, 0.15, -0.045, 0.05);
    earShape.quadraticCurveTo(-0.025, 0.01, 0, 0);

    const earGeo = new THREE.ExtrudeGeometry(earShape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    });
    earGeo.computeVertexNormals();

    const innerEarShape = new THREE.Shape();
    innerEarShape.moveTo(0, 0.02);
    innerEarShape.quadraticCurveTo(0.045, 0.09, 0.038, 0.19);
    innerEarShape.quadraticCurveTo(0.0, 0.21, -0.028, 0.06);
    innerEarShape.closePath();

    const innerEarGeo = new THREE.ExtrudeGeometry(innerEarShape, {
      depth: 0.013,
      bevelEnabled: false,
    });
    innerEarGeo.computeVertexNormals();

    const createEar = (isLeftEar: boolean) => {
      const earG = new THREE.Group();
      const outerEar = new THREE.Mesh(earGeo, batFurMat);
      const innerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
      innerEar.position.set(0, 0, 0.003);
      earG.add(outerEar, innerEar);

      if (isLeftEar) {
        earG.position.set(-0.09, 0.11, -0.01);
        earG.rotation.set(-0.15, -0.18, 0.36);
      } else {
        earG.scale.set(-1, 1, 1);
        earG.position.set(0.09, 0.11, -0.01);
        earG.rotation.set(-0.15, 0.18, -0.36);
      }
      return earG;
    };

    headG.add(
      skull,
      muzzle,
      nose,
      fangL,
      fangR,
      eyeL,
      specL,
      eyeR,
      specR,
      createEar(true),
      createEar(false)
    );
    headG.position.set(0, 0.69, 0.08);

    // 3. 翅膀 (Wings) - 水平展开面向下，前缘骨骼顺应+Z，后缘三段贝塞尔花边顺应-Z
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    // 上缘骨架轮廓
    wingShape.quadraticCurveTo(0.18, 0.16, 0.38, 0.19);
    wingShape.quadraticCurveTo(0.52, 0.21, 0.70, 0.18);
    // 翼膜下缘三段平滑圆弧花边 (Scallops)
    wingShape.quadraticCurveTo(0.56, 0.04, 0.50, -0.09);
    wingShape.quadraticCurveTo(0.38, 0.00, 0.30, -0.12);
    wingShape.quadraticCurveTo(0.18, -0.03, 0.10, -0.10);
    wingShape.quadraticCurveTo(0.04, -0.04, 0, 0);

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    });
    // 旋转 90 度使翼面完全水平面向下 (Broad wing surface facing DOWN towards ground!)
    wingGeo.rotateX(Math.PI / 2);
    wingGeo.computeVertexNormals();

    const createWingGroup = (isLeft: boolean) => {
      const wg = new THREE.Group();
      wg.name = isLeft ? 'bat_wing_l' : 'bat_wing_r';

      // 翼膜主体 (水平平铺)
      const membrane = new THREE.Mesh(wingGeo, wingMembraneMat);
      wg.add(membrane);

      // 水平骨骼装配辅助函数 (精准连接 XZ 平面上的两个端点)
      const addBone = (x1: number, z1: number, x2: number, z2: number, r1: number, r2: number) => {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.hypot(dx, dz);
        const ang = Math.atan2(dz, dx);
        const bone = new THREE.Mesh(
          new THREE.CylinderGeometry(r2, r1, len, 8),
          wingBoneMat
        );
        bone.position.set((x1 + x2) / 2, 0.006, (z1 + z2) / 2);
        bone.rotation.y = -ang;
        bone.rotation.z = -Math.PI / 2;
        wg.add(bone);
      };

      // 1. 上臂骨 (肩部到腕关节)
      addBone(0, 0, 0.38, 0.19, 0.015, 0.013);

      // 2. 腕关节球 (Wrist joint)
      const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), wingBoneMat);
      wristJoint.position.set(0.38, 0.008, 0.19);
      wg.add(wristJoint);

      // 3. 前臂骨 (腕关节到翼尖)
      addBone(0.38, 0.19, 0.70, 0.18, 0.013, 0.007);

      // 4. 翼指骨 1 (腕部延伸至第一翼尖下沿)
      addBone(0.38, 0.19, 0.50, -0.09, 0.009, 0.005);

      // 5. 翼指骨 2 (腕部延伸至第二翼尖下沿)
      addBone(0.38, 0.19, 0.30, -0.12, 0.008, 0.005);

      // 6. 拇指钩爪 (Thumb hook claw)
      const thumbClaw = new THREE.Mesh(new THREE.ConeGeometry(0.010, 0.038, 8), darkFeatureMat);
      thumbClaw.position.set(0.38, 0.015, 0.205);
      thumbClaw.rotation.x = -Math.PI / 4;
      thumbClaw.rotation.y = 0.3;
      wg.add(thumbClaw);

      if (!isLeft) {
        // 右翼：向正X水平展开，面向下
        wg.position.set(0.09, 0.50, 0.02);
        wg.rotation.set(0.08, 0, -0.15);
      } else {
        // 左翼：镜像反转，向负X水平展开，面向下
        wg.scale.set(-1, 1, 1);
        wg.position.set(-0.09, 0.50, 0.02);
        wg.rotation.set(0.08, 0, 0.15);
      }

      return wg;
    };

    group.add(
      torso,
      chestRuff,
      createFoot(-0.06),
      createFoot(0.06),
      headG,
      createWingGroup(true),
      createWingGroup(false)
    );

    if (monsterId === 'big_bat') {
      group.scale.set(1.28, 1.28, 1.28);
    } else if (monsterId === 'red_bat') {
      group.scale.set(1.45, 1.45, 1.45);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.3 骷髅系列 (Skeleton) - 完整骨骼连贯双臂与持械，去除黑色突兀块
  // -------------------------------------------------------------------------
  private static createSkeletonMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.65,
      metalness: 0.1,
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.6,
    });

    // 1. 颅骨 (Skull)
    const skullG = new THREE.Group();
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), boneMat);
    cranium.scale.set(0.95, 1.05, 1.1);

    const socketMat = new THREE.MeshBasicMaterial({ color: 0x05050a });
    const socketL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.04), socketMat);
    socketL.position.set(-0.055, 0.01, 0.125);
    const socketR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.04), socketMat);
    socketR.position.set(0.055, 0.01, 0.125);

    const soulFireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const soulL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), soulFireMat);
    soulL.position.set(-0.055, 0.01, 0.135);
    const soulR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), soulFireMat);
    soulR.position.set(0.055, 0.01, 0.135);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 3), socketMat);
    nose.position.set(0, -0.035, 0.14);
    nose.rotation.x = Math.PI;

    const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.04), boneMat);
    teeth.position.set(0, -0.065, 0.12);

    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.045, 0.09), boneMat);
    jaw.position.set(0, -0.11, 0.07);

    skullG.add(cranium, socketL, socketR, soulL, soulR, nose, teeth, jaw);
    skullG.position.set(0, 0.82, 0);

    // 颈椎
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 6), boneMat);
    neck.position.set(0, 0.72, 0);

    // 2. 脊椎与胸廓肋骨 (Spine & Ribcage)
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.44, 8), boneMat);
    spine.position.set(0, 0.48, -0.02);

    const ribcageG = new THREE.Group();
    for (let r = 0; r < 4; r++) {
      const radius = 0.16 - r * 0.015;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.016, 6, 16, Math.PI * 1.05),
        boneMat
      );
      rib.rotation.x = Math.PI / 2 + 0.1;
      rib.rotation.z = Math.PI * 0.475;
      rib.position.set(0, 0.58 - r * 0.065, 0.02);
      ribcageG.add(rib);
    }
    const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.015), boneMat);
    sternum.position.set(0, 0.48, 0.15);
    ribcageG.add(sternum);

    const clavicle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.40, 6), boneMat);
    clavicle.rotation.z = Math.PI / 2;
    clavicle.position.set(0, 0.66, 0);

    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.08, 0.09, 8), boneMat);
    pelvis.position.set(0, 0.26, 0);

    // 3. 完整连贯的双腿骨骼
    const createLeg = (x: number) => {
      const legG = new THREE.Group();
      const hip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), jointMat);
      hip.position.set(0, 0.24, 0);
      const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.022, 0.16, 6), boneMat);
      femur.position.set(0, 0.16, 0);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), jointMat);
      knee.position.set(0, 0.08, 0);
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.16, 6), boneMat);
      tibia.position.set(0, 0.0, 0);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.10), boneMat);
      foot.position.set(0, -0.07, 0.03);
      legG.add(hip, femur, knee, tibia, foot);
      legG.position.set(x, 0.08, 0);
      return legG;
    };

    // 4. 关键补全：连贯右臂与锻铁弯刀（握在手骨中，绝不浮空！）
    const armR = new THREE.Group();
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), jointMat);
    shoulderR.position.set(0.20, 0.66, 0);
    const humerusR = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, 0.18, 6), boneMat);
    humerusR.position.set(0.24, 0.58, 0.04);
    humerusR.rotation.z = -0.4;
    humerusR.rotation.x = 0.3;
    const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), jointMat);
    elbowR.position.set(0.28, 0.50, 0.08);
    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.16, 6), boneMat);
    forearmR.position.set(0.29, 0.44, 0.14);
    forearmR.rotation.x = 0.6;
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), jointMat);
    handR.position.set(0.30, 0.38, 0.20);

    const sword = new THREE.Group();
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.55, 0.015),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
    );
    blade.position.y = 0.26;
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.025, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 })
    );
    const hilt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    hilt.position.y = -0.06;
    sword.add(blade, guard, hilt);
    sword.position.set(0.30, 0.38, 0.20);
    sword.rotation.x = Math.PI / 4;
    armR.add(shoulderR, humerusR, elbowR, forearmR, handR, sword);

    // 5. 关键补全：连贯左臂与木质包铁圆盾（牢固系在左手和前臂上！）
    const armL = new THREE.Group();
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), jointMat);
    shoulderL.position.set(-0.20, 0.66, 0);
    const humerusL = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, 0.18, 6), boneMat);
    humerusL.position.set(-0.24, 0.58, 0.04);
    humerusL.rotation.z = 0.4;
    humerusL.rotation.x = 0.3;
    const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), jointMat);
    elbowL.position.set(-0.27, 0.50, 0.08);
    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.16, 6), boneMat);
    forearmL.position.set(-0.26, 0.44, 0.14);
    forearmL.rotation.x = 0.6;
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), jointMat);
    handL.position.set(-0.25, 0.38, 0.18);

    const shield = new THREE.Group();
    const buckler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.025, 16),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 })
    );
    buckler.rotation.x = Math.PI / 2;
    const boss = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 })
    );
    boss.position.set(0, 0, 0.02);
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.014, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 })
    );
    rim.position.set(0, 0, 0.01);
    shield.add(buckler, boss, rim);
    shield.position.set(-0.26, 0.44, 0.18);
    shield.rotation.y = 0.35;
    armL.add(shoulderL, humerusL, elbowL, forearmL, handL, shield);

    group.add(skullG, neck, spine, ribcageG, clavicle, pelvis, createLeg(-0.09), createLeg(0.09), armR, armL);

    // 6. 骷髅士兵专属装备（去除黑色圆柱烟囱和黑色方盒，改用贴合头骨的铁盔与弧形胸甲）
    if (monsterId === 'skeleton_soldier') {
      const ironMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.85,
        roughness: 0.3,
      });

      const helmG = new THREE.Group();
      const skullCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.155, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        ironMat
      );
      skullCap.position.set(0, 0.83, 0);

      const brimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.03, 16), ironMat);
      brimMesh.position.set(0, 0.82, 0);

      const noseGuard = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.08, 0.03), ironMat);
      noseGuard.position.set(0, 0.77, 0.15);

      helmG.add(skullCap, brimMesh, noseGuard);

      // 贴合胸腔弧度的护胸铁甲板（非黑方块！）
      const breastplateG = new THREE.Group();
      const chestPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.17, 0.26, 12, 1, false, -Math.PI * 0.45, Math.PI * 0.9),
        ironMat
      );
      chestPlate.position.set(0, 0.50, 0.06);

      const strapMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
      const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.02), strapMat);
      strap1.position.set(-0.06, 0.50, 0.17);
      strap1.rotation.z = -0.3;
      const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.02), strapMat);
      strap2.position.set(0.06, 0.50, 0.17);
      strap2.rotation.z = 0.3;

      breastplateG.add(chestPlate, strap1, strap2);
      group.add(helmG, breastplateG);
    }

    // 7. 骷髅队长专属角盔与红披风
    if (monsterId === 'skeleton_captain') {
      const goldArmorMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        metalness: 0.9,
        roughness: 0.2,
      });

      const captainHelm = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        goldArmorMat
      );
      captainHelm.position.set(0, 0.84, 0);

      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.30, 8), goldArmorMat);
      hornL.position.set(-0.18, 1.05, 0);
      hornL.rotation.z = 0.6;
      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.30, 8), goldArmorMat);
      hornR.position.set(0.18, 1.05, 0);
      hornR.rotation.z = -0.6;

      const capeMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.7,
        side: THREE.DoubleSide,
      });
      const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.68), capeMat);
      cape.position.set(0, 0.44, -0.16);
      cape.rotation.x = -0.12;

      group.add(captainHelm, hornL, hornR, cape);
      group.scale.set(1.25, 1.25, 1.25);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.4 魔法使系列 (Mage: 初级法师 / 高级法师 / 红衣法师)
  // -------------------------------------------------------------------------
  private static createMageMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    let robeHex = 0x2563eb; // 初级法师：经典皇家蓝
    let trimHex = 0xfacc15; // 黄金饰边
    let hatHex = 0x1d4ed8;
    let orbHex = 0x38bdf8; // 冰晶蓝魔球

    if (monsterId === 'senior_mage') {
      robeHex = 0x7c3aed; // 高级法师：皇家秘术紫
      trimHex = 0xe2e8f0; // 秘银饰边
      hatHex = 0x6d28d9;
      orbHex = 0xa855f7; // 虚空紫魔球
    } else if (monsterId === 'red_mage') {
      robeHex = 0xdc2626; // 红衣法师：鲜血深红
      trimHex = 0xfacc15; // 黄金符文
      hatHex = 0xb91c1c;
      orbHex = 0xff0033; // 烈焰血红
    }

    const robeMat = new THREE.MeshStandardMaterial({
      color: robeHex,
      roughness: 0.6,
      metalness: 0.1,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: trimHex,
      metalness: 0.85,
      roughness: 0.25,
    });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.5 });
    const beardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });

    // 1. 经典宽摆巫师法袍 (Flared Wizard Robe)
    const robePts: THREE.Vector2[] = [
      new THREE.Vector2(0.14, 0.72),
      new THREE.Vector2(0.18, 0.55),
      new THREE.Vector2(0.24, 0.38),
      new THREE.Vector2(0.32, 0.20),
      new THREE.Vector2(0.42, 0.02),
      new THREE.Vector2(0.0, 0.0),
    ];
    const robe = new THREE.Mesh(new THREE.LatheGeometry(robePts, 20), robeMat);

    // 金色前襟装饰垂直带
    const stole = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.02), trimMat);
    stole.position.set(0, 0.36, 0.21);

    // 腰部皮带与金扣
    const belt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.23, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 })
    );
    belt.position.y = 0.44;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.04), trimMat);
    buckle.position.set(0, 0.44, 0.23);

    // 2. 头部、面庞与浓密白长须 (Head, Face & Flowing Wizard Beard)
    const headG = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), skinMat);
    head.position.y = 0.78;

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeMat);
    eyeL.position.set(-0.045, 0.81, 0.12);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeMat);
    eyeR.position.set(0.045, 0.81, 0.12);

    // 标志性浓密白胡须 (Flowing Wizard Beard)
    const beard = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 10), beardMat);
    beard.position.set(0, 0.63, 0.12);
    beard.rotation.x = -0.2;

    const mustache = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 6), beardMat);
    mustache.rotation.z = Math.PI / 2;
    mustache.position.set(0, 0.76, 0.13);

    headG.add(head, eyeL, eyeR, beard, mustache);

    // 3. 灵魂设计：经典尖顶宽檐巫师帽 (Pointed Wide-Brim Wizard Hat)
    const hatG = new THREE.Group();
    const hatMat = new THREE.MeshStandardMaterial({
      color: hatHex,
      roughness: 0.55,
      metalness: 0.1,
    });

    // 宽大的圆弧帽檐 (Wide Brim - 俯视一眼即可认出是巫师帽)
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.025, 24), hatMat);
    brim.position.y = 0.86;
    brim.rotation.x = -0.1;

    // 尖锥帽冠 (Tall Conical Crown)
    const crownBase = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 16), hatMat);
    crownBase.position.set(0, 1.01, -0.02);
    crownBase.rotation.x = -0.15;

    // 帽顶微曲尖端 (Crooked Pointy Tip)
    const crownTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), hatMat);
    crownTip.position.set(0, 1.22, -0.1);
    crownTip.rotation.x = -0.45;
    crownTip.rotation.z = -0.2;

    // 帽子上的金色装饰带 (Golden Hatband)
    const hatBand = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.02, 8, 20), trimMat);
    hatBand.rotation.x = Math.PI / 2 - 0.1;
    hatBand.position.set(0, 0.88, -0.01);

    hatG.add(brim, crownBase, crownTip, hatBand);

    // 4. 双手与宽大袖袍 (Connected Sleeved Arms & Hands)
    // 右手紧握法杖
    const armR = new THREE.Group();
    const sleeveR = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.32, 12), robeMat);
    sleeveR.position.set(0.24, 0.54, 0.06);
    sleeveR.rotation.z = -0.55;
    sleeveR.rotation.x = 0.25;

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
    handR.position.set(0.32, 0.52, 0.16);
    armR.add(sleeveR, handR);

    // 左手托起施法光晕
    const armL = new THREE.Group();
    const sleeveL = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.32, 12), robeMat);
    sleeveL.position.set(-0.24, 0.54, 0.06);
    sleeveL.rotation.z = 0.55;
    sleeveL.rotation.x = 0.25;

    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
    handL.position.set(-0.32, 0.54, 0.16);

    const castGlowMat = new THREE.MeshStandardMaterial({
      color: orbHex,
      emissive: orbHex,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });
    const castGlow = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), castGlowMat);
    castGlow.position.set(-0.32, 0.62, 0.16);
    armL.add(sleeveL, handL, castGlow);

    // 5. 远古魔法权杖 (Ancient Magic Staff - 稳固握在手中)
    const staffG = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.028, 1.15, 8),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 })
    );
    shaft.position.y = 0.57;

    const headCrescent = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.02, 8, 16), trimMat);
    headCrescent.position.y = 1.08;

    const orbMat = new THREE.MeshStandardMaterial({
      color: orbHex,
      emissive: orbHex,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), orbMat);
    orb.position.y = 1.08;

    staffG.add(shaft, headCrescent, orb);
    staffG.position.set(0.32, 0, 0.16);

    group.add(robe, stole, belt, buckle, headG, hatG, armR, armL, staffG);

    if (monsterId === 'senior_mage') {
      group.scale.set(1.15, 1.15, 1.15);
    } else if (monsterId === 'red_mage') {
      group.scale.set(1.25, 1.25, 1.25);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.5 卫兵与骑士系列 (Guard & Knight) - 完整铠甲双臂与武器大盾
  // -------------------------------------------------------------------------
  private static createKnightMesh(monsterId: string, data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    let armorColor = 0x64748b;
    let trimColor = 0x94a3b8;
    let plumeColor = 0xef4444;

    if (monsterId === 'iron_guard') {
      armorColor = 0x1e293b;
      trimColor = 0x475569;
      plumeColor = 0x475569;
    } else if (monsterId === 'white_knight') {
      armorColor = 0xf8fafc;
      trimColor = 0xfacc15;
      plumeColor = 0xffffff;
    } else if (monsterId === 'yellow_knight') {
      armorColor = 0xeab308;
      trimColor = 0xca8a04;
      plumeColor = 0xfbbf24;
    } else if (monsterId === 'blue_knight') {
      armorColor = 0x2563eb;
      trimColor = 0x60a5fa;
      plumeColor = 0x38bdf8;
    }

    const armorMat = new THREE.MeshStandardMaterial({
      color: armorColor,
      metalness: 0.85,
      roughness: 0.25,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      metalness: 0.9,
      roughness: 0.2,
    });

    // 躯干板甲
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.28), armorMat);
    torso.position.set(0, 0.46, 0);

    // 腰部裙甲片
    const fauld = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.14, 8), armorMat);
    fauld.position.set(0, 0.22, 0);

    // 封闭全罩骑士头盔
    const helmG = new THREE.Group();
    const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.28, 14), armorMat);

    const slitMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.05), slitMat);
    slit.position.set(0, 0.03, 0.155);

    const plumeMat = new THREE.MeshStandardMaterial({ color: plumeColor, roughness: 0.8 });
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 6), plumeMat);
    plume.rotation.x = -0.5;
    plume.position.set(0, 0.22, -0.05);

    helmG.add(helm, slit, plume);
    helmG.position.set(0, 0.82, 0);

    const createPauldron = (x: number) => {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), trimMat);
      p.scale.set(1.1, 0.8, 1.1);
      p.position.set(x, 0.62, 0);
      return p;
    };

    // 双腿板甲
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 8), armorMat);
    legL.position.set(-0.1, 0.12, 0);
    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 8), armorMat);
    legR.position.set(0.1, 0.12, 0);

    // 关键补全：连贯双臂与长剑（握在铁手套中！）
    const armR = new THREE.Group();
    const shoulderR = createPauldron(0.24);
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.20, 8), armorMat);
    upperArmR.position.set(0.24, 0.46, 0.03);
    upperArmR.rotation.z = -0.3;
    upperArmR.rotation.x = 0.25;

    const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), trimMat);
    elbowR.position.set(0.27, 0.38, 0.07);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.18, 8), armorMat);
    forearmR.position.set(0.28, 0.32, 0.14);
    forearmR.rotation.x = 0.6;

    const gauntletR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), trimMat);
    gauntletR.position.set(0.28, 0.26, 0.20);

    const sword = new THREE.Group();
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.65, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 })
    );
    blade.position.y = 0.28;
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.03), trimMat);
    cross.position.y = -0.05;
    const hilt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    hilt.position.y = -0.13;
    sword.add(blade, cross, hilt);
    sword.position.set(0.28, 0.26, 0.20);
    sword.rotation.x = Math.PI / 4;

    armR.add(shoulderR, upperArmR, elbowR, forearmR, gauntletR, sword);

    // 关键补全：连贯左臂与纹章大盾（固定在左前臂上！）
    const armL = new THREE.Group();
    const shoulderL = createPauldron(-0.24);
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.20, 8), armorMat);
    upperArmL.position.set(-0.24, 0.46, 0.03);
    upperArmL.rotation.z = 0.3;
    upperArmL.rotation.x = 0.25;

    const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), trimMat);
    elbowL.position.set(-0.27, 0.38, 0.07);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.18, 8), armorMat);
    forearmL.position.set(-0.28, 0.32, 0.14);
    forearmL.rotation.x = 0.6;

    const gauntletL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), trimMat);
    gauntletL.position.set(-0.28, 0.26, 0.20);

    const shieldG = new THREE.Group();
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.06), trimMat);
    const emblem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.MeshStandardMaterial({ color: plumeColor, metalness: 0.8 })
    );
    emblem.position.set(0, 0.05, 0.035);
    shieldG.add(shield, emblem);
    shieldG.position.set(-0.30, 0.38, 0.18);
    shieldG.rotation.y = 0.35;

    armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, shieldG);

    group.add(torso, fauld, helmG, legL, legR, armR, armL);

    if (data.modelType === 'knight') {
      group.scale.set(1.15, 1.15, 1.15);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.6 史诗首领系列 (Boss: Orc, Golem, Vampire, Demon Lord)
  // -------------------------------------------------------------------------
  private static createBossMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    if (monsterId === 'orc' || monsterId === 'orc_knight') {
      const isKnight = monsterId === 'orc_knight';

      // 狂暴绿皮兽人 / 兽人武士骑士：凶悍霸气、肌肉肌理分明、带刺重装肩铠、獠牙面容、双手紧握重兵器
      const skinMat = new THREE.MeshStandardMaterial({ color: 0x235336, roughness: 0.65 }); // 军绿兽人厚实皮肤
      const chestMat = new THREE.MeshStandardMaterial({ color: 0x2e6b46, roughness: 0.60 }); // 腹肌与胸肌浅绿色高光
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.30 }); // 锻造黑铁重甲
      const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.90, roughness: 0.25 }); // 淬火冷钢
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.35 }); // 铆钉与扣件
      const leatherMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.80 }); // 粗糙皮革背带与护腰
      const boneMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.35 }); // 象牙巨獠牙与巨角
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // 嗜血血红双眼
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x2a0808 }); // 怒吼口咽深处
      const redCrestMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 }); // 骑士赤红盔缨

      // 1. 强壮肌肉躯干与兽人战甲 (Muscular Barbarian Torso)
      const torsoG = new THREE.Group();

      // 上半身宽阔胸廓与倒三角背阔肌 (Broad Muscular Upper Chest)
      const upperChest = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.27, 0.32, 10), skinMat);
      upperChest.position.set(0, 0.58, 0);
      upperChest.scale.set(1.0, 1.0, 0.78);

      // 胸肌板块 (Pectoral Muscles)
      const pecL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.13, 0.08), chestMat);
      pecL.position.set(-0.09, 0.61, 0.13);
      pecL.rotation.z = -0.08;
      const pecR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.13, 0.08), chestMat);
      pecR.position.set(0.09, 0.61, 0.13);
      pecR.rotation.z = 0.08;

      // 腹肌板块 (Abdominal Core)
      const abs = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.24, 8), chestMat);
      abs.position.set(0, 0.36, 0.02);
      abs.scale.set(0.9, 1.0, 0.7);

      torsoG.add(upperChest, pecL, pecR, abs);

      // 皮革武装带与护甲 (Harness / Armor Plates)
      const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.02), leatherMat);
      strapL.position.set(-0.02, 0.54, 0.15);
      strapL.rotation.z = 0.42;
      const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.02), leatherMat);
      strapR.position.set(0.02, 0.54, 0.15);
      strapR.rotation.z = -0.42;
      const beltBuckle = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), brassMat);
      beltBuckle.position.set(0, 0.54, 0.17);
      torsoG.add(strapL, strapR, beltBuckle);

      if (isKnight) {
        // 兽人武士：重型精铸钉刺胸铠 (Heavy Spiked Iron Cuirass)
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.10), ironMat);
        plate.position.set(0, 0.58, 0.14);
        const centerBoss = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 6), darkSteelMat);
        centerBoss.position.set(0, 0.58, 0.20);
        centerBoss.rotation.x = Math.PI / 2;
        torsoG.add(plate, centerBoss);
      }

      // 重装战带与战裙 (Heavy War Belt & Loincloth)
      const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 12), leatherMat);
      belt.position.set(0, 0.25, 0);
      const warKilt = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.04), leatherMat);
      warKilt.position.set(0, 0.15, 0.12);
      const kiltStud1 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), brassMat);
      kiltStud1.position.set(-0.06, 0.14, 0.15);
      const kiltStud2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), brassMat);
      kiltStud2.position.set(0.06, 0.14, 0.15);
      torsoG.add(belt, warKilt, kiltStud1, kiltStud2);

      // 2. 标志性双肩重型带刺肩铠 (Spiked Shoulder Pauldrons)
      const createPauldron = (x: number, isRight: boolean) => {
        const pg = new THREE.Group();
        const mainPlate = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), ironMat);
        mainPlate.position.set(0, 0, 0);

        // 向上向外弯曲的双刺
        const spike1 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.20, 6), isKnight ? darkSteelMat : boneMat);
        spike1.position.set(isRight ? 0.08 : -0.08, 0.14, 0.02);
        spike1.rotation.z = isRight ? -0.55 : 0.55;

        const spike2 = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.15, 6), isKnight ? darkSteelMat : boneMat);
        spike2.position.set(isRight ? 0.04 : -0.04, 0.12, 0.09);
        spike2.rotation.z = isRight ? -0.35 : 0.35;
        spike2.rotation.x = 0.25;

        pg.add(mainPlate, spike1, spike2);
        pg.position.set(x, 0.68, 0);
        return pg;
      };

      const pauldronL = createPauldron(-0.32, false);
      const pauldronR = createPauldron(0.32, true);
      torsoG.add(pauldronL, pauldronR);

      // 3. 生动凶猛的头颅、巨獠牙与角盔 (Fierce Orc Head with Heavy Tusks & War Helm)
      const headG = new THREE.Group();
      headG.position.set(0, 0.88, 0.02);

      // 头颅基底 (强健下颌轮廓)
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), skinMat);
      cranium.scale.set(0.95, 1.05, 1.05);

      // 宽下巴与下颚 (Massive Jawline)
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.16), skinMat);
      jaw.position.set(0, -0.08, 0.06);

      // 尖尖的地精/兽人耳朵 (Pointed Ears with Earring)
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), skinMat);
      earL.position.set(-0.18, 0.02, -0.04);
      earL.rotation.z = 1.2;
      earL.rotation.y = -0.3;
      const earring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 12), brassMat);
      earring.position.set(-0.21, 0.0, -0.04);

      const earR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), skinMat);
      earR.position.set(0.18, 0.02, -0.04);
      earR.rotation.z = -1.2;
      earR.rotation.y = 0.3;

      // 凶暴 scowl 眉骨与血红双眼
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.05, 0.08), skinMat);
      brow.position.set(0, 0.05, 0.15);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
      eyeL.position.set(-0.06, 0.03, 0.17);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
      eyeR.position.set(0.06, 0.03, 0.17);

      // 宽扁塌鼻与鼻孔 (Broad Snout)
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.06, 0.06), skinMat);
      snout.position.set(0, -0.01, 0.18);

      // 怒吼大口与锋利排牙 (Snarling Mouth & Upper Teeth)
      const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.06), mouthMat);
      mouth.position.set(0, -0.06, 0.15);
      const upperTeeth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.02), boneMat);
      upperTeeth.position.set(0, -0.04, 0.17);

      // 经典巨大弯曲下颚獠牙 (Formidable Curved Lower Tusks)
      const createTusk = (x: number, isRight: boolean) => {
        const tg = new THREE.Group();
        const baseCone = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 8), boneMat);
        baseCone.position.set(0, 0.06, 0);
        baseCone.rotation.x = -0.35;
        baseCone.rotation.z = isRight ? -0.20 : 0.20;
        tg.add(baseCone);
        tg.position.set(x, -0.08, 0.15);
        return tg;
      };
      const tuskL = createTusk(-0.065, false);
      const tuskR = createTusk(0.065, true);

      // 战盔 (Heavy Riveted Barbarian War Helm)
      const helm = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), ironMat);
      helm.position.set(0, 0.05, 0);
      const nasalGuard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.03), ironMat);
      nasalGuard.position.set(0, 0.03, 0.18);

      // 战盔两侧巨型弯角 (Curved Ivory War Horns with Brass Sockets)
      const createHorn = (x: number, isRight: boolean) => {
        const hg = new THREE.Group();
        const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.04, 8), brassMat);
        socket.rotation.z = isRight ? -Math.PI / 2 : Math.PI / 2;

        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.24, 8), boneMat);
        horn.position.set(isRight ? 0.10 : -0.10, 0.08, 0);
        horn.rotation.z = isRight ? -0.75 : 0.75;
        horn.rotation.y = -0.2;

        hg.add(socket, horn);
        hg.position.set(x, 0.11, 0.02);
        return hg;
      };
      const hornL = createHorn(-0.16, false);
      const hornR = createHorn(0.16, true);

      headG.add(cranium, jaw, earL, earring, earR, brow, eyeL, eyeR, snout, mouth, upperTeeth, tuskL, tuskR, helm, nasalGuard, hornL, hornR);

      if (isKnight) {
        // 骑士额外配有鲜红头盔战缨 (Crimson Horsehair Crest)
        const crest = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.32), redCrestMat);
        crest.position.set(0, 0.25, -0.04);
        headG.add(crest);
      }

      // 4. 粗壮双臂与带刺护臂 (Muscular Arms with Spiked Vambraces)
      const armL = new THREE.Group();
      const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.22, 8), skinMat);
      bicepL.position.set(-0.30, 0.52, 0.04);
      bicepL.rotation.z = 0.35;
      bicepL.rotation.x = 0.3;

      const vambraceL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.16, 8), ironMat);
      vambraceL.position.set(-0.25, 0.38, 0.16);
      vambraceL.rotation.z = 0.3;
      vambraceL.rotation.x = 0.5;

      const handL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
      handL.position.set(-0.20, 0.32, 0.24);
      armL.add(bicepL, vambraceL, handL);

      const armR = new THREE.Group();
      const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.22, 8), skinMat);
      bicepR.position.set(0.30, 0.52, 0.04);
      bicepR.rotation.z = -0.35;
      bicepR.rotation.x = 0.3;

      const vambraceR = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.16, 8), ironMat);
      vambraceR.position.set(0.28, 0.38, 0.16);
      vambraceR.rotation.z = -0.3;
      vambraceR.rotation.x = 0.5;

      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
      handR.position.set(0.24, 0.32, 0.24);
      armR.add(bicepR, vambraceR, handR);

      // 5. 兵器 (Weaponry)
      if (!isKnight) {
        // 普通兽人：霸气双手带刺巨型战锤 (Massive Spiked War Hammer)
        const hammerG = new THREE.Group();
        const handle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.032, 0.95, 8),
          new THREE.MeshStandardMaterial({ color: 0x542d13, roughness: 0.85 })
        );
        handle.position.y = 0.45;

        // 铁质绑带
        const handleRing = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.04, 8), brassMat);
        handleRing.position.y = 0.70;

        // 巨大六面体锻钢锤头
        const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.22), ironMat);
        hammerHead.position.y = 0.82;

        // 前部破甲大锥刺 (Armor-Piercing Spike)
        const spikeFront = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), darkSteelMat);
        spikeFront.position.set(0, 0.82, 0.18);
        spikeFront.rotation.x = Math.PI / 2;

        // 后部破甲鸦喙啄 (Crow's Beak Pick)
        const pickRear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 6), darkSteelMat);
        pickRear.position.set(0, 0.82, -0.18);
        pickRear.rotation.x = -Math.PI / 2;

        // 顶端冠刺
        const spikeTop = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 6), darkSteelMat);
        spikeTop.position.set(0, 0.98, 0);

        hammerG.add(handle, handleRing, hammerHead, spikeFront, pickRear, spikeTop);
        hammerG.position.set(0.18, 0.06, 0.20);
        hammerG.rotation.x = Math.PI / 4;
        hammerG.rotation.y = -0.25;
        group.add(hammerG);
      } else {
        // 兽人武士：右手六棱狼牙破甲槌 + 左手巨型带刺战盾
        const maceG = new THREE.Group();
        const maceShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8), darkSteelMat);
        maceShaft.position.y = 0.35;
        const maceHead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), ironMat);
        maceHead.position.y = 0.68;
        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2;
          const flange = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), darkSteelMat);
          flange.position.set(Math.cos(ang) * 0.12, 0.68, Math.sin(ang) * 0.12);
          flange.rotation.z = Math.cos(ang) * -1.57;
          flange.rotation.x = Math.sin(ang) * 1.57;
          maceG.add(flange);
        }
        const topSpike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 6), darkSteelMat);
        topSpike.position.y = 0.80;
        maceG.add(maceShaft, maceHead, topSpike);
        maceG.position.set(0.30, 0.15, 0.24);
        maceG.rotation.x = 0.6;
        group.add(maceG);

        // 左手重型带刺盾牌 (Spiked Tower Shield)
        const shieldG = new THREE.Group();
        const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.56, 0.05), ironMat);
        const shieldRim = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.60, 0.03), darkSteelMat);
        shieldRim.position.z = -0.01;
        const shieldBoss = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.15, 6), brassMat);
        shieldBoss.position.set(0, 0.04, 0.10);
        shieldBoss.rotation.x = Math.PI / 2;
        shieldG.add(shieldPlate, shieldRim, shieldBoss);
        shieldG.position.set(-0.34, 0.42, 0.24);
        shieldG.rotation.y = 0.35;
        shieldG.rotation.z = -0.10;
        group.add(shieldG);
      }

      // 6. 强壮双腿与装甲战靴 (Muscular Legs & Armored Boots)
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.26, 8), skinMat);
      legL.position.set(-0.15, 0.13, 0);
      const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.22), ironMat);
      bootL.position.set(-0.15, 0.06, 0.04);

      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.26, 8), skinMat);
      legR.position.set(0.15, 0.13, 0);
      const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.22), ironMat);
      bootR.position.set(0.15, 0.06, 0.04);

      group.add(torsoG, headG, armL, armR, legL, bootL, legR, bootR);
      group.scale.set(1.2, 1.2, 1.2);
    } else if (monsterId === 'golem') {
      // 远古岩石傀儡
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 });
      const gBody = new THREE.Mesh(new THREE.DodecahedronGeometry(0.36, 0), stoneMat);
      gBody.position.set(0, 0.52, 0);

      const gHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), stoneMat);
      gHead.position.set(0, 0.88, 0);

      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 1.8,
      });
      const rCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), coreMat);
      rCore.position.set(0, 0.52, 0.2);

      const createStoneArm = (x: number) => {
        const ag = new THREE.Group();
        const shoulder = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), stoneMat);
        shoulder.position.set(x, 0.60, 0);
        const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.22, 6), stoneMat);
        bicep.position.set(x, 0.44, 0.04);
        const fist = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13, 0), stoneMat);
        fist.position.set(x, 0.28, 0.12);
        ag.add(shoulder, bicep, fist);
        return ag;
      };

      const stoneLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.26, 6), stoneMat);
      stoneLegL.position.set(-0.16, 0.13, 0);
      const stoneLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.26, 6), stoneMat);
      stoneLegR.position.set(0.16, 0.13, 0);

      group.add(gBody, gHead, rCore, createStoneArm(-0.38), createStoneArm(0.38), stoneLegL, stoneLegR);
      group.scale.set(1.3, 1.3, 1.3);
    } else if (monsterId === 'vampire') {
      // 暗夜吸血鬼伯爵：高领血披风、苍白面庞、双手握红宝石刺剑
      const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
      const capeMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5, side: THREE.DoubleSide });
      const paleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });

      const vBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 12), suitMat);
      vBody.position.set(0, 0.45, 0);

      const cravat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.04), paleMat);
      cravat.position.set(0, 0.60, 0.16);

      const headG = new THREE.Group();
      const vHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), paleMat);
      vHead.position.set(0, 0.82, 0);

      const hairMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 });
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
      hair.position.set(0, 0.84, -0.02);

      const vEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.025), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      vEyeL.position.set(-0.05, 0.83, 0.13);
      const vEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.025), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      vEyeR.position.set(0.05, 0.83, 0.13);

      headG.add(vHead, hair, vEyeL, vEyeR);

      const collar = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.4, 8, 1, true), capeMat);
      collar.position.set(0, 0.88, -0.06);
      collar.rotation.x = -0.3;

      const armR = new THREE.Group();
      const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.24, 8), suitMat);
      sleeveR.position.set(0.24, 0.46, 0.04);
      sleeveR.rotation.z = -0.35;
      sleeveR.rotation.x = 0.3;
      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), paleMat);
      handR.position.set(0.28, 0.35, 0.16);

      const rapier = new THREE.Group();
      const blade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.018, 0.65, 8),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 })
      );
      blade.position.y = 0.32;
      const cupGuard = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 })
      );
      cupGuard.rotation.x = Math.PI;
      const rapierHilt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x991b1b })
      );
      rapierHilt.position.y = -0.06;
      rapier.add(blade, cupGuard, rapierHilt);
      rapier.position.set(0.28, 0.35, 0.16);
      rapier.rotation.x = Math.PI / 3;

      armR.add(sleeveR, handR, rapier);

      const armL = new THREE.Group();
      const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.24, 8), suitMat);
      sleeveL.position.set(-0.24, 0.46, 0.04);
      sleeveL.rotation.z = 0.35;
      sleeveL.rotation.x = 0.3;
      const handL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), paleMat);
      handL.position.set(-0.28, 0.35, 0.16);
      armL.add(sleeveL, handL);

      group.add(vBody, cravat, headG, collar, armR, armL);
      group.scale.set(1.2, 1.2, 1.2);
    } else {
      // 终极魔王杰诺 (Demon King Zeno)
      const demonMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.35), demonMat);
      dBody.position.set(0, 0.55, 0);

      const dHead = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.32), demonMat);
      dHead.position.set(0, 0.98, 0);

      const hornMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 8), hornMat);
      hornL.position.set(-0.28, 1.3, 0);
      hornL.rotation.z = 0.6;
      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 8), hornMat);
      hornR.position.set(0.28, 1.3, 0);
      hornR.rotation.z = -0.6;

      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        side: THREE.DoubleSide,
      });
      const wL = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.65), wingMat);
      wL.position.set(-0.45, 0.8, -0.15);
      wL.rotation.y = 0.4;
      const wR = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.65), wingMat);
      wR.position.set(0.45, 0.8, -0.15);
      wR.rotation.y = -0.4;

      const armR = new THREE.Group();
      const bicepR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.14), demonMat);
      bicepR.position.set(0.36, 0.60, 0.08);
      bicepR.rotation.x = 0.4;
      const gauntletR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), demonMat);
      gauntletR.position.set(0.40, 0.50, 0.20);

      const sword = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 1.1, 0.03),
        new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xdc2626,
          emissiveIntensity: 1.5,
        })
      );
      sword.position.set(0.40, 0.50, 0.20);
      sword.rotation.x = Math.PI / 4;
      armR.add(bicepR, gauntletR, sword);

      group.add(dBody, dHead, hornL, hornR, wL, wR, armR);
      group.scale.set(1.4, 1.4, 1.4);
    }

    return group;
  }

  // =========================================================================
  // 8. 道具 (Items) - 钥匙、宝石、药水、装备 (全面启用阴影投射与真实光影)
  // =========================================================================
  static createItemMesh(itemType: ItemType): THREE.Group {
    const group = new THREE.Group();
    group.name = `item_${itemType}`;

    // 钥匙：精致复古金属骷髅钥匙 (Skeleton Key with Ring & Teeth)
    if (itemType.startsWith('key_')) {
      let keyColor = 0xfacc15;
      if (itemType === 'key_blue') keyColor = 0x38bdf8;
      if (itemType === 'key_red') keyColor = 0xef4444;

      const keyMat = new THREE.MeshStandardMaterial({
        color: keyColor,
        metalness: 0.9,
        roughness: 0.15,
        emissive: keyColor,
        emissiveIntensity: 0.25,
      });

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 8, 16), keyMat);
      ring.position.y = 0.58;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 8), keyMat);
      stem.position.y = 0.32;
      const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.09), keyMat);
      tooth1.position.set(0, 0.18, 0.05);
      const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.07), keyMat);
      tooth2.position.set(0, 0.28, 0.04);

      group.add(ring, stem, tooth1, tooth2);
    } else if (itemType.startsWith('gem_')) {
      // 宝石：璀璨切面八面体魔晶 (Facet-cut Gemstone)
      const color = itemType === 'gem_red' ? 0xdc2626 : 0x2563eb;
      const gemMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.3,
      });
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), gemMat);
      gem.position.y = 0.48;
      group.add(gem);
    } else if (itemType.startsWith('potion_') || itemType === 'holy_water') {
      // 药水：玻璃炼金药剂瓶与冒泡药液 (Alchemy Flask with Glowing Potion)
      // 用户规范：小血瓶与大血瓶必须均为红色生命药水，绝不可为蓝色，小血瓶相比大血瓶体型更加紧凑精巧
      const isSmallPotion = itemType === 'potion_red';
      const isBigPotion = itemType === 'potion_blue';

      // 无论小血瓶还是大血瓶，均为红色药水 (小血瓶为鲜亮红宝石色，大血瓶为深邃赤红晶露)
      let liquidColor = 0xef4444;
      if (isBigPotion) liquidColor = 0xdc2626;
      if (itemType === 'holy_water') liquidColor = 0xa855f7;

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.75,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
      });

      // 瓶身体型分级：小血瓶小巧精致 (半径 0.17)，大血瓶饱满硕大 (半径 0.25)
      const flaskRadius = isSmallPotion ? 0.17 : isBigPotion ? 0.25 : 0.22;
      const bottleY = isSmallPotion ? 0.28 : isBigPotion ? 0.36 : 0.33;
      const neckRadius = isSmallPotion ? 0.065 : isBigPotion ? 0.092 : 0.082;
      const neckHeight = isSmallPotion ? 0.14 : isBigPotion ? 0.20 : 0.17;
      const neckY = bottleY + flaskRadius * 0.86;

      const bottle = new THREE.Mesh(new THREE.SphereGeometry(flaskRadius, 16, 16), glassMat);
      bottle.position.y = bottleY;
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(neckRadius, neckRadius, neckHeight, 12), glassMat);
      neck.position.y = neckY;

      const liquidMat = new THREE.MeshStandardMaterial({
        color: liquidColor,
        emissive: liquidColor,
        emissiveIntensity: 0.55,
      });
      const liquid = new THREE.Mesh(new THREE.SphereGeometry(flaskRadius * 0.84, 14, 14), liquidMat);
      liquid.position.y = bottleY - 0.015;

      const corkRadius = neckRadius * 0.9;
      const corkHeight = isSmallPotion ? 0.08 : 0.10;
      const cork = new THREE.Mesh(
        new THREE.CylinderGeometry(corkRadius, corkRadius, corkHeight),
        new THREE.MeshStandardMaterial({ color: 0x92400e })
      );
      cork.position.y = neckY + neckHeight / 2 + corkHeight / 2 - 0.015;

      group.add(bottle, neck, liquid, cork);

      // 大血瓶专属：颈部装饰华丽纯金项圈以凸显大血瓶的尊贵高阶效力
      if (isBigPotion) {
        const goldRing = new THREE.Mesh(
          new THREE.TorusGeometry(neckRadius * 1.06, 0.016, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.88, roughness: 0.2 })
        );
        goldRing.rotation.x = Math.PI / 2;
        goldRing.position.y = neckY - 0.01;
        group.add(goldRing);
      }
    } else if (itemType.startsWith('sword_')) {
      // 武器剑类
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.95,
        roughness: 0.1,
      });
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.02), bladeMat);
      blade.position.y = 0.45;
      const hilt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 })
      );
      hilt.position.y = 0.1;
      group.add(blade, hilt);
      group.rotation.z = Math.PI / 4;
    } else if (itemType.startsWith('shield_')) {
      // 防具盾类
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.85,
        roughness: 0.2,
      });
      const shield = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.08), shieldMat);
      shield.position.y = 0.42;
      group.add(shield);
    } else if (itemType === 'lucky_coin') {
      // 幸运金币 (Lucky Gold Coin - 璀璨黄金巨币与发光星纹)
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xeab308,
        emissiveIntensity: 0.5,
        metalness: 0.95,
        roughness: 0.15,
      });
      const coinGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24);
      coinGeo.rotateX(Math.PI / 2);
      const coin = new THREE.Mesh(coinGeo, goldMat);
      coin.position.y = 0.42;

      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.12, 0),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, metalness: 0.9 })
      );
      star.position.set(0, 0.42, 0.04);
      group.add(coin, star);
    } else {
      // 默认道具箱
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), boxMat);
      box.position.y = 0.32;
      group.add(box);
    }

    // 关键修正：递归为所有道具部件开启阴影投射与阴影接收（如钥匙齿、圆环、药水瓶等）
    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // =========================================================================
  // =========================================================================
  // 9. 传送光圈与空心光柱 (Portal Ground Ring & Hollow Light Cylinder)
  // 地上一圈发光法阵，竖起空心圆柱形光墙，表面流动发光箭头与浮动能量环
  // =========================================================================
  static createStairsMesh(isUp: boolean): THREE.Group {
    const group = new THREE.Group();
    group.name = isUp ? 'stairs_up' : 'stairs_down';

    // 色调设定：上行光柱为璀璨天光青蓝/星辰青；下行光柱为神秘霓虹紫/暗夜虚空紫
    const glowHex = isUp ? 0x38bdf8 : 0xc084fc;
    const coreHex = isUp ? 0x0284c7 : 0x9333ea;
    const ringHex = isUp ? 0x7dd3fc : 0xe9d5ff;

    // 1. 地面平齐圆盘基底与发光符文阵 (Ground Flat Circle & Rune Pad)
    // 微凸底座环 (极低，高0.02，不遮挡通行感)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.46, 0.02, 32), baseMat);
    dais.position.y = 0.01;

    // 地面平铺发光符文光圈 (Flat Glowing Ground Circle Disc)
    const groundTex = TextureGenerator.getPortalGroundTexture(isUp);
    const groundMat = new THREE.MeshBasicMaterial({
      map: groundTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const groundDisc = new THREE.Mesh(new THREE.CircleGeometry(0.44, 32), groundMat);
    groundDisc.rotation.x = -Math.PI / 2;
    groundDisc.position.y = 0.022;

    // 地面发光霓虹边缘光环 (Ground Neon Ring)
    const neonRingMat = new THREE.MeshStandardMaterial({
      color: ringHex,
      emissive: glowHex,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    const groundRing = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.014, 10, 36), neonRingMat);
    groundRing.name = 'portal_ground_ring';
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = 0.024;

    // 地面环周 4 个聚能水晶定位节点 (Perimeter Focus Nodes)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const nx = Math.cos(angle) * 0.43;
      const nz = Math.sin(angle) * 0.43;
      const node = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.032, 0.035, 8),
        neonRingMat
      );
      node.position.set(nx, 0.025, nz);
      group.add(node);
    }
    group.add(dais, groundDisc, groundRing);

    // 2. 空心圆柱发光光墙 (Hollow Vertical Light Wall Cylinder with Moving Arrows)
    // 采用 openEnded = true 创造空心光柱，两面渲染 DoubleSide，透明发光
    const cylinderTex = TextureGenerator.getPortalCylinderTexture(isUp).clone();
    cylinderTex.wrapS = THREE.RepeatWrapping;
    cylinderTex.wrapT = THREE.RepeatWrapping;
    cylinderTex.needsUpdate = true;

    const cylinderMat = new THREE.MeshStandardMaterial({
      map: cylinderTex,
      color: glowHex,
      emissive: coreHex,
      emissiveIntensity: 1.6,
      emissiveMap: cylinderTex,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false,
      roughness: 0.1,
      metalness: 0.1,
    });

    const cylinderH = 1.38;
    const cylinderRadius = 0.41;
    const cylinderGeo = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderH, 36, 1, true);
    const portalCylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
    portalCylinder.name = 'portal_cylinder';
    portalCylinder.position.y = cylinderH / 2 + 0.02; // y = 0.71
    group.add(portalCylinder);

    // 3. 内部柔和能量核心柱 (Inner Soft Volumetric Glow Column)
    const innerMat = new THREE.MeshBasicMaterial({
      color: glowHex,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const innerGeo = new THREE.CylinderGeometry(0.36, 0.36, 1.32, 28, 1, true);
    const innerBeam = new THREE.Mesh(innerGeo, innerMat);
    innerBeam.position.y = 0.70;
    group.add(innerBeam);

    // 4. 浮空同心能量光环组 (Floating Tech Energy Rings - 沿光柱上下律动漂浮)
    const floatGroup = new THREE.Group();
    floatGroup.name = 'portal_float_rings';

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: ringHex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.422, 0.009, 8, 36), ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.36;
    ring1.name = 'float_ring_1';

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: ringHex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.422, 0.009, 8, 36), ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.88;
    ring2.name = 'float_ring_2';

    floatGroup.add(ring1, ring2);
    group.add(floatGroup);

    return group;
  }

  // =========================================================================
  // 10. 经典能力提升商铺 (3格一体化豪华中世纪魔法商铺 / Storefront Shop)
  // =========================================================================
  static createShopMesh(isWide: boolean = true): THREE.Group {
    const group = new THREE.Group();
    group.name = 'shop';

    const width = isWide ? 2.92 : 0.96;
    const halfW = width / 2;

    // 材质定义
    const floorWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.8 });
    const counterWoodMat = new THREE.MeshStandardMaterial({ color: 0x271406, roughness: 0.75 });
    const counterTopMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.35, metalness: 0.1 });
    const panelWoodMat = new THREE.MeshStandardMaterial({ color: 0x4a2810, roughness: 0.7 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.6 });
    const shelfWoodMat = new THREE.MeshStandardMaterial({ color: 0x1f1105, roughness: 0.85 });

    // 1. 实木地板基底 (Raised Wooden Shop Flooring)
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.04, 0.96), floorWoodMat);
    floorMesh.position.set(0, 0.02, -0.02);
    group.add(floorMesh);

    // 2. 长条形实木售货柜台 (Storefront Counter) - 位于 z = 0.22 处面向玩家
    const counterBase = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.44, 0.36), counterWoodMat);
    counterBase.position.set(0, 0.22, 0.22);
    group.add(counterBase);

    // 柜台台面 (Polished Beveled Countertop)
    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.06, 0.42), counterTopMat);
    counterTop.position.set(0, 0.46, 0.22);
    group.add(counterTop);

    // 柜台正面装饰浮雕面板与金属立柱
    if (isWide) {
      const panelXs = [-0.95, 0, 0.95];
      for (const px of panelXs) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.32, 0.02), panelWoodMat);
        panel.position.set(px, 0.22, 0.41);
        if (px === 0) {
          // 正中心展示华丽商会剑盾徽章 (Royal Guild Crest) - 镶嵌在柜台正面，绝不遮挡掌柜视线
          const emblemPlate = new THREE.Mesh(
            new THREE.BoxGeometry(0.36, 0.22, 0.025),
            new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 })
          );
          emblemPlate.position.set(0, 0.22, 0.425);
          const emblemRim = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.25, 0.015), goldMat);
          emblemRim.position.set(0, 0.22, 0.42);
          const emblem = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.055, 0),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 1.2 })
          );
          emblem.position.set(0, 0.22, 0.44);
          group.add(panel, emblemRim, emblemPlate, emblem);
        } else {
          const stud = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), brassMat);
          stud.position.set(px, 0.22, 0.43);
          group.add(panel, stud);
        }
      }
      const postXs = [-1.38, -0.47, 0.47, 1.38];
      for (const postX of postXs) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.46, 8), brassMat);
        post.position.set(postX, 0.23, 0.40);
        group.add(post);
      }
    } else {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.32, 0.02), panelWoodMat);
      panel.position.set(0, 0.22, 0.41);
      const emblem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.045, 0),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 1.2 })
      );
      emblem.position.set(0, 0.22, 0.43);
      group.add(panel, emblem);
    }

    // 3. 柜台后方的掌柜/神秘神职商人 (The Shopkeeper / Priest) - 开放式全貌无遮挡呈现
    const merchantG = new THREE.Group();
    merchantG.name = 'shopkeeper';

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.55 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.25 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.5 });
    const beardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });

    // 袍身
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.65, 12), robeMat);
    robe.position.set(0, 0.34, -0.08);
    const stole = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.60, 0.02), trimMat);
    stole.position.set(0, 0.34, 0.05);

    // 头部与面部
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), skinMat);
    head.position.set(0, 0.74, -0.06);

    // 慈祥五官与胡须
    const beard = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 8), beardMat);
    beard.position.set(0, 0.58, 0.04);
    beard.rotation.x = -0.2;

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02), eyeMat);
    eyeL.position.set(-0.045, 0.76, 0.06);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02), eyeMat);
    eyeR.position.set(0.045, 0.76, 0.06);
    const eyeHiL = new THREE.Mesh(new THREE.SphereGeometry(0.007), eyeHighlightMat);
    eyeHiL.position.set(-0.04, 0.77, 0.075);
    const eyeHiR = new THREE.Mesh(new THREE.SphereGeometry(0.007), eyeHighlightMat);
    eyeHiR.position.set(0.05, 0.77, 0.075);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.04), skinMat);
    nose.position.set(0, 0.74, 0.07);

    // 神职商贾华丽头冠
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.18, 12), robeMat);
    hat.position.set(0, 0.86, -0.06);
    const hatRim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 16), trimMat);
    hatRim.position.set(0, 0.80, -0.06);
    hatRim.rotation.x = Math.PI / 2;
    const hatGem = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 1.2 })
    );
    hatGem.position.set(0, 0.85, 0.07);

    // 双臂迎宾手势
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.32, 8), robeMat);
    armL.position.set(-0.25, 0.54, 0.04);
    armL.rotation.z = -0.6;
    armL.rotation.x = 0.5;
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
    handL.position.set(-0.35, 0.48, 0.16);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.32, 8), robeMat);
    armR.position.set(0.25, 0.54, 0.04);
    armR.rotation.z = 0.6;
    armR.rotation.x = 0.5;
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
    handR.position.set(0.35, 0.48, 0.16);

    merchantG.add(robe, stole, head, beard, eyeL, eyeR, eyeHiL, eyeHiR, nose, hat, hatRim, hatGem, armL, handL, armR, handR);
    group.add(merchantG);

    // 4. 柜台展示货品 (Counter Goods)
    if (isWide) {
      // 金币堆
      const coinG = new THREE.Group();
      const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 10), goldMat);
      c1.position.set(-0.85, 0.53, 0.20);
      const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 10), goldMat);
      c2.position.set(-0.73, 0.55, 0.24);
      const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 10), goldMat);
      c3.position.set(-0.80, 0.52, 0.30);
      coinG.add(c1, c2, c3);
      group.add(coinG);

      // 聚宝红木匣 (Open Gem Box)
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
      const jewelBox = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.10, 0.16), boxMat);
      jewelBox.position.set(-1.12, 0.54, 0.22);
      const gemR = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.035, 0),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 1.0 })
      );
      gemR.position.set(-1.15, 0.60, 0.22);
      const gemB = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.035, 0),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.0 })
      );
      gemB.position.set(-1.08, 0.60, 0.24);
      group.add(jewelBox, gemR, gemB);

      // 黄铜天平
      const scaleStand = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.03, 0.22, 8), brassMat);
      scaleStand.position.set(-0.55, 0.59, 0.22);
      const scaleBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6), brassMat);
      scaleBeam.position.set(-0.55, 0.69, 0.22);
      scaleBeam.rotation.z = Math.PI / 2;
      const panL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.02, 8), brassMat);
      panL.position.set(-0.64, 0.62, 0.22);
      const panR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.02, 8), brassMat);
      panR.position.set(-0.46, 0.63, 0.22);
      group.add(scaleStand, scaleBeam, panL, panR);

      // 右侧：炼金药水瓶与卷轴
      const redFlask = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 1.2, roughness: 0.1 })
      );
      redFlask.position.set(0.72, 0.55, 0.24);
      const neckRed = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 8), brassMat);
      neckRed.position.set(0.72, 0.62, 0.24);

      const blueVial = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.14, 0.09),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2, roughness: 0.1 })
      );
      blueVial.position.set(0.88, 0.56, 0.20);

      const goldVial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.13, 8),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.8, roughness: 0.2 })
      );
      goldVial.position.set(1.05, 0.55, 0.26);

      const scrollMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 });
      const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8), scrollMat);
      scroll.position.set(1.18, 0.52, 0.22);
      scroll.rotation.x = Math.PI / 2;
      scroll.rotation.z = 0.4;
      const inkwell = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.04, 8), ironMat);
      inkwell.position.set(0.60, 0.51, 0.30);
      group.add(redFlask, neckRed, blueVial, goldVial, scroll, inkwell);
    }

    // 中央账本 (Trade Ledger)
    const ledgerCover = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.18), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
    ledgerCover.position.set(0.14, 0.50, 0.26);
    ledgerCover.rotation.y = -0.15;
    const ledgerPages = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.16), new THREE.MeshStandardMaterial({ color: 0xfef9c3 }));
    ledgerPages.position.set(0.14, 0.515, 0.26);
    ledgerPages.rotation.y = -0.15;
    group.add(ledgerCover, ledgerPages);

    // 5. 后方倚墙木质展示货架 (Rear Shelving Unit) - 高度 0.88 严密对齐迷宫石墙，作为开阔背景
    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(width - 0.06, 0.88, 0.04), shelfWoodMat);
    shelfBack.position.set(0, 0.44, -0.44);
    group.add(shelfBack);

    // 货架顶部雕花拱形木质封顶 (Decorative Crown Moulding)
    const shelfCrown = new THREE.Mesh(new THREE.BoxGeometry(width - 0.02, 0.05, 0.08), counterWoodMat);
    shelfCrown.position.set(0, 0.89, -0.43);
    const crownTrim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.02, 0.02, 0.09), brassMat);
    crownTrim.position.set(0, 0.92, -0.43);
    group.add(shelfCrown, crownTrim);

    // 货架横板 (2 层)
    const shelfYLevels = [0.38, 0.65];
    for (const sy of shelfYLevels) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(width - 0.04, 0.03, 0.24), counterWoodMat);
      plank.position.set(0, sy, -0.34);
      group.add(plank);
    }
    // 货架垂直隔板
    if (isWide) {
      const divXs = [-1.40, -0.48, 0.48, 1.40];
      for (const dx of divXs) {
        const div = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.88, 0.25), counterWoodMat);
        div.position.set(dx, 0.44, -0.34);
        group.add(div);
      }

      // 上层中间：发光占卜紫晶球 (Rotating Mana Crystal Orb)
      const orbTripod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.05, 8), brassMat);
      orbTripod.position.set(0, 0.68, -0.32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 1.5,
        roughness: 0.1,
      });
      const crystalOrb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), orbMat);
      crystalOrb.position.set(0, 0.74, -0.32);
      crystalOrb.name = 'shop_crystal';
      group.add(orbTripod, crystalOrb);

      // 上层左右：彩色魔法药典与卷轴 (Colorful Grimoires & Spellbooks)
      const bookColors = [0x9333ea, 0x06b6d4, 0x10b981, 0xf59e0b, 0xe11d48];
      for (let i = 0; i < 5; i++) {
        const bMat = new THREE.MeshStandardMaterial({ color: bookColors[i], roughness: 0.5 });
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.18, 0.14), bMat);
        book.position.set(-1.18 + i * 0.055, 0.75, -0.32);
        group.add(book);
      }
      for (let i = 0; i < 4; i++) {
        const bMat = new THREE.MeshStandardMaterial({ color: bookColors[(i + 2) % 5], roughness: 0.5 });
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.17, 0.13), bMat);
        book.position.set(0.88 + i * 0.055, 0.74, -0.32);
        group.add(book);
      }

      // 下层：木制酒桶与封印藏宝箱
      const kegMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
      const kegL = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.20, 10), kegMat);
      kegL.position.set(-0.95, 0.48, -0.32);
      const chestMat = new THREE.MeshStandardMaterial({ color: 0x271406, roughness: 0.6 });
      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.16), chestMat);
      chest.position.set(0.95, 0.45, -0.32);
      const chestLock = new THREE.Mesh(new THREE.OctahedronGeometry(0.03, 0), brassMat);
      chestLock.position.set(0.95, 0.45, -0.23);
      group.add(kegL, chest, chestLock);
    }

    // 6. 柜台两侧优雅黄铜台灯 (Counter Lamp Posts with Glowing Lanterns) - 设于两侧远端，完全不遮挡视野
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    const createCounterLamp = (x: number, lanternName: string) => {
      const lampG = new THREE.Group();
      lampG.position.set(x, 0.46, 0.22); // 稳固立于实木柜台台面两端

      // 黄铜灯柱底座与立杆
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 0.04, 10), brassMat);
      lampBase.position.y = 0.02;
      const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.22, 8), brassMat);
      lampPost.position.y = 0.13;
      const lampFinial = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), goldMat);
      lampFinial.position.y = 0.26;

      // 弧形外弯悬挂支架
      const armCurve = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.015), brassMat);
      armCurve.position.set(x > 0 ? -0.04 : 0.04, 0.24, 0);

      // 悬挂吊灯 (可自由摆动摇曳)
      const lg = new THREE.Group();
      lg.name = lanternName;
      lg.position.set(x > 0 ? -0.07 : 0.07, 0.23, 0);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05, 6), brassMat);
      chain.position.y = -0.025;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.035, 6), brassMat);
      cap.position.y = -0.06;
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.07, 6), lanternMat);
      glass.position.y = -0.10;
      const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.06), brassMat);
      bottom.position.y = -0.14;
      lg.add(chain, cap, glass, bottom);

      lampG.add(lampBase, lampPost, lampFinial, armCurve, lg);
      return lampG;
    };

    if (isWide) {
      group.add(createCounterLamp(-halfW + 0.12, 'shop_lantern_l'));
      group.add(createCounterLamp(halfW - 0.12, 'shop_lantern_r'));
    } else {
      group.add(createCounterLamp(-halfW + 0.08, 'shop_lantern_l'));
    }

    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 保留历史接口平滑兼容
  static createAltarMesh(): THREE.Group {
    return this.createShopMesh(true);
  }

  private static sharedWallGeo: THREE.BoxGeometry | null = null;
  private static sharedFloorGeo: THREE.BoxGeometry | null = null;

  // =========================================================================
  // 11. 墙体 (Wall) - 厚度与门体严格一致 (0.16)，智能平滑衔接相邻墙体与门
  // =========================================================================
  static createWallMesh(
    theme: string,
    layout?: (Tile | null)[][],
    x?: number,
    y?: number
  ): THREE.Object3D {
    const matKey = `wall_mat_${theme}`;
    let wallMat = this.matCache.get(matKey) as THREE.MeshStandardMaterial;
    if (!wallMat) {
      const tex = TextureGenerator.getBrickTexture(theme);
      wallMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.85,
        metalness: 0.1,
      });
      this.matCache.set(matKey, wallMat);
    }

    const WALL_H = 0.90; // 与主角同高 (0.90)，避免遮挡视野
    const T = 0.16; // 严格与门体厚度对齐 (0.16)
    const armLen = 0.42; // (1.0 - T) / 2
    const armCenter = 0.29; // (0.5 + T / 2) / 2

    // 默认或无上下文时（如单元测试）：回退为标准单格横向薄墙
    if (!layout || x === undefined || y === undefined) {
      const geo = new THREE.BoxGeometry(1.0, WALL_H, T);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    const isWallLike = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return false;
      const t = layout[ty]?.[tx];
      if (!t) return false;
      return t.type === 'wall' || t.type === 'fake_wall' || t.type.startsWith('door_') || t.type === 'shop';
    };

    let hasNorth = isWallLike(x, y - 1);
    let hasSouth = isWallLike(x, y + 1);
    let hasWest = isWallLike(x - 1, y);
    let hasEast = isWallLike(x + 1, y);

    // 边界延展：若位于地图外沿且有邻接墙体走向，则顺向延展贴满边界，防止边缘断层
    if (x === 0 && (hasNorth || hasSouth || hasEast)) hasWest = true;
    if (x === 10 && (hasNorth || hasSouth || hasWest)) hasEast = true;
    if (y === 0 && (hasWest || hasEast || hasSouth)) hasNorth = true;
    if (y === 10 && (hasWest || hasEast || hasNorth)) hasSouth = true;

    // 1. 若 8 个邻近网格全为实体墙（处于 3x3 实体岩体正中心内部）：直接使用整块实心石方块填充
    if (
      hasNorth && hasSouth && hasWest && hasEast &&
      isWallLike(x - 1, y - 1) && isWallLike(x + 1, y - 1) &&
      isWallLike(x - 1, y + 1) && isWallLike(x + 1, y + 1)
    ) {
      const solidGeo = new THREE.BoxGeometry(1.0, WALL_H, 1.0);
      solidGeo.translate(0, WALL_H / 2, 0);
      const solidMesh = new THREE.Mesh(solidGeo, wallMat);
      solidMesh.castShadow = true;
      solidMesh.receiveShadow = true;
      return solidMesh;
    }

    // 2. 纯横向走向墙段 (水平贯穿)
    if (hasWest && hasEast && !hasNorth && !hasSouth) {
      const geo = new THREE.BoxGeometry(1.0, WALL_H, T);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // 3. 纯纵向走向墙段 (纵向贯穿)
    if (hasNorth && hasSouth && !hasWest && !hasEast) {
      const geo = new THREE.BoxGeometry(T, WALL_H, 1.0);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // 4. 单向横向尽头
    if ((hasWest || hasEast) && !hasNorth && !hasSouth) {
      const posX = hasWest ? -0.21 : 0.21;
      const geo = new THREE.BoxGeometry(0.58, WALL_H, T);
      geo.translate(posX, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // 5. 单向纵向尽头
    if ((hasNorth || hasSouth) && !hasWest && !hasEast) {
      const posZ = hasNorth ? -0.21 : 0.21;
      const geo = new THREE.BoxGeometry(T, WALL_H, 0.58);
      geo.translate(0, WALL_H / 2, posZ);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // 6. 独立立柱 (无任何正交邻接)
    if (!hasNorth && !hasSouth && !hasWest && !hasEast) {
      const geo = new THREE.BoxGeometry(0.20, WALL_H, 0.20);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // 7. 转角、T 字路口与十字交叉结构 (复合轻量组件)
    const group = new THREE.Group();
    group.name = 'wall';

    // 核心立柱 (对齐厚度 T x T)
    const centerGeo = new THREE.BoxGeometry(T, WALL_H, T);
    centerGeo.translate(0, WALL_H / 2, 0);
    const centerMesh = new THREE.Mesh(centerGeo, wallMat);
    centerMesh.castShadow = true;
    centerMesh.receiveShadow = true;
    group.add(centerMesh);

    if (hasWest) {
      const armGeo = new THREE.BoxGeometry(armLen, WALL_H, T);
      armGeo.translate(-armCenter, WALL_H / 2, 0);
      const arm = new THREE.Mesh(armGeo, wallMat);
      arm.castShadow = true;
      arm.receiveShadow = true;
      group.add(arm);
    }
    if (hasEast) {
      const armGeo = new THREE.BoxGeometry(armLen, WALL_H, T);
      armGeo.translate(armCenter, WALL_H / 2, 0);
      const arm = new THREE.Mesh(armGeo, wallMat);
      arm.castShadow = true;
      arm.receiveShadow = true;
      group.add(arm);
    }
    if (hasNorth) {
      const armGeo = new THREE.BoxGeometry(T, WALL_H, armLen);
      armGeo.translate(0, WALL_H / 2, -armCenter);
      const arm = new THREE.Mesh(armGeo, wallMat);
      arm.castShadow = true;
      arm.receiveShadow = true;
      group.add(arm);
    }
    if (hasSouth) {
      const armGeo = new THREE.BoxGeometry(T, WALL_H, armLen);
      armGeo.translate(0, WALL_H / 2, armCenter);
      const arm = new THREE.Mesh(armGeo, wallMat);
      arm.castShadow = true;
      arm.receiveShadow = true;
      group.add(arm);
    }

    return group;
  }

  // =========================================================================
  // 12. 地砖 (Floor) (共享几何体与材质缓存以极度降低开销)
  // =========================================================================
  static createFloorMesh(theme: string): THREE.Mesh {
    const matKey = `floor_mat_${theme}`;
    let floorMat = this.matCache.get(matKey) as THREE.MeshStandardMaterial;
    if (!floorMat) {
      const tex = TextureGenerator.getFloorTexture(theme);
      floorMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.9,
      });
      this.matCache.set(matKey, floorMat);
    }

    if (!this.sharedFloorGeo) {
      this.sharedFloorGeo = new THREE.BoxGeometry(1.0, 0.2, 1.0);
    }

    const floor = new THREE.Mesh(this.sharedFloorGeo, floorMat);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    return floor;
  }

  // =========================================================================
  // 13. 熔岩地块 (Lava Pool)
  // =========================================================================
  private static sharedLavaGeo: THREE.BoxGeometry | null = null;
  private static sharedLavaCrustGeo: THREE.BoxGeometry | null = null;

  static createLavaMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'lava_tile';

    const lavaMatKey = 'lava_magma_mat';
    let lavaMat = this.matCache.get(lavaMatKey) as THREE.MeshStandardMaterial;
    if (!lavaMat) {
      lavaMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff4400,
        emissiveIntensity: 0.95,
        roughness: 0.35,
        metalness: 0.1,
      });
      this.matCache.set(lavaMatKey, lavaMat);
    }

    if (!this.sharedLavaGeo) {
      this.sharedLavaGeo = new THREE.BoxGeometry(0.98, 0.18, 0.98);
    }

    const magma = new THREE.Mesh(this.sharedLavaGeo, lavaMat);
    magma.position.y = -0.06;
    magma.name = 'lava_magma';
    group.add(magma);

    // 浮动玄武岩碎壳
    const crustMatKey = 'lava_crust_mat';
    let crustMat = this.matCache.get(crustMatKey) as THREE.MeshStandardMaterial;
    if (!crustMat) {
      crustMat = new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.95,
        metalness: 0.2,
      });
      this.matCache.set(crustMatKey, crustMat);
    }

    if (!this.sharedLavaCrustGeo) {
      this.sharedLavaCrustGeo = new THREE.BoxGeometry(0.38, 0.05, 0.38);
    }

    const crust1 = new THREE.Mesh(this.sharedLavaCrustGeo, crustMat);
    crust1.position.set(-0.22, 0.02, -0.2);
    crust1.rotation.y = 0.4;
    crust1.name = 'lava_crust_1';

    const crust2 = new THREE.Mesh(this.sharedLavaCrustGeo, crustMat);
    crust2.position.set(0.24, 0.02, 0.18);
    crust2.rotation.y = -0.3;
    crust2.scale.set(0.85, 1, 0.85);
    crust2.name = 'lava_crust_2';

    // 熔岩冒泡发光核
    const emberMatKey = 'lava_ember_mat';
    let emberMat = this.matCache.get(emberMatKey) as THREE.MeshBasicMaterial;
    if (!emberMat) {
      emberMat = new THREE.MeshBasicMaterial({
        color: 0xffea00,
      });
      this.matCache.set(emberMatKey, emberMat);
    }
    const bubbleGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const bubble = new THREE.Mesh(bubbleGeo, emberMat);
    bubble.position.set(0.04, 0.02, -0.05);
    bubble.name = 'lava_bubble';

    group.add(crust1, crust2, bubble);
    return group;
  }

  // =========================================================================
  // 14. 选中光标指示器 (Selection Marker)
  // =========================================================================
  static createSelectionMarkerMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'selection_marker';

    const mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    const borderGeoH = new THREE.BoxGeometry(0.3, 0.02, 0.04);
    const borderGeoV = new THREE.BoxGeometry(0.04, 0.02, 0.3);

    // 四角高光直角括号 (0.45 偏移)
    const corners = [
      { x: -0.32, z: -0.45, isH: true },
      { x: -0.45, z: -0.32, isH: false },

      { x: 0.32, z: -0.45, isH: true },
      { x: 0.45, z: -0.32, isH: false },

      { x: -0.32, z: 0.45, isH: true },
      { x: -0.45, z: 0.32, isH: false },

      { x: 0.32, z: 0.45, isH: true },
      { x: 0.45, z: 0.32, isH: false },
    ];

    corners.forEach((c) => {
      const b = new THREE.Mesh(c.isH ? borderGeoH : borderGeoV, mat);
      b.position.set(c.x, 0.03, c.z);
      group.add(b);
    });

    // 中心微光环
    const ringGeo = new THREE.RingGeometry(0.18, 0.22, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.025;
    ring.name = 'selection_ring';
    group.add(ring);

    return group;
  }
}

