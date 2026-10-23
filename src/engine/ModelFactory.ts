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

    // 材质体系：高精度秘银板甲、皇家蓝珐琅、耀目赤金、深渊锁甲与圣光红宝石
    const mithrilMat = new THREE.MeshStandardMaterial({
      color: 0xecf2f8,
      metalness: 0.92,
      roughness: 0.18,
    });
    const royalBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.70,
      roughness: 0.28,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.20,
      emissive: 0xd97706,
      emissiveIntensity: 0.16,
    });
    const steelDarkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.80,
      roughness: 0.50,
    });
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.80,
    });
    const capeMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    const capeDarkMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });
    const plumeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.55,
    });
    const rubyMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: 0.65,
      metalness: 0.25,
      roughness: 0.15,
    });
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.96,
      roughness: 0.12,
    });
    const runicFullerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.2,
    });
    const slitMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // -------------------------------------------------------------------------
    // 1. 双腿与全覆盖哥特式骑士铁靴 (Legs, Greaves, Poleyns & Sabatons)
    // -------------------------------------------------------------------------
    const legG = new THREE.Group();
    legG.name = 'hero_legs';

    const createHeroLeg = (xSide: number) => {
      const leg = new THREE.Group();

      // (1) 尖头哥特式板甲铁靴 (Sabatons) - 底部精准平齐贴地 y = 0
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.045, 0.16), mithrilMat);
      sole.position.set(0, 0.0225, 0.02);

      // 前端哥特式微收窄鞋头与金边 (Gothic Sabaton Tapered Toe & Trim)
      const toeMid = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.040, 0.05), mithrilMat);
      toeMid.position.set(0, 0.020, 0.115);

      const toeTip = new THREE.Mesh(new THREE.BoxGeometry(0.060, 0.032, 0.035), mithrilMat);
      toeTip.position.set(0, 0.016, 0.15);

      const toeGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.012, 0.04), goldMat);
      toeGoldTrim.position.set(0, 0.032, 0.135);

      const heelRim = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.02, 0.06), goldMat);
      heelRim.position.set(0, 0.015, -0.04);

      // (2) 脚踝转轴护甲 (Ankle Cuffs)
      const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.056, 0.04, 10), steelDarkMat);
      ankle.position.set(0, 0.065, 0.01);

      // (3) 小腿胫甲与侧翼加强脊 (Greaves with Fluted Ridges)
      const greave = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.048, 0.16, 10), mithrilMat);
      greave.position.set(0, 0.15, 0.01);

      const greaveRidge = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.15, 0.025), goldMat);
      greaveRidge.position.set(0, 0.15, 0.06);

      // (4) 铰接式圆盘膝甲 (Articulated Knee Poleyns with Gold Rivet & Wing)
      const kneeCup = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), mithrilMat);
      kneeCup.position.set(0, 0.24, 0.035);

      const kneeRivet = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), goldMat);
      kneeRivet.position.set(0, 0.24, 0.078);

      const kneeWing = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.05), goldMat);
      kneeWing.position.set(xSide * 0.055, 0.24, 0.02);

      // (5) 大腿装甲与防穿刺锁甲底衬 (Cuisses & Mail Hose)
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.054, 0.15, 10), mithrilMat);
      thigh.position.set(0, 0.32, 0.0);

      const hipMail = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.06, 10), steelDarkMat);
      hipMail.position.set(0, 0.39, 0.0);

      leg.add(
        sole, toeMid, toeTip, toeGoldTrim, heelRim,
        ankle, greave, greaveRidge,
        kneeCup, kneeRivet, kneeWing,
        thigh, hipMail
      );
      leg.position.set(xSide * 0.11, 0, 0);
      return leg;
    };

    legG.add(createHeroLeg(-1), createHeroLeg(1));
    group.add(legG);

    // -------------------------------------------------------------------------
    // 2. 战术武装皮带与层叠式板甲裙甲 (Belt, Lion Buckle, Faulds & Tassets)
    // -------------------------------------------------------------------------
    const pelvisG = new THREE.Group();
    pelvisG.name = 'hero_pelvis';

    // 纯牛皮武装战带
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.21, 0.055, 16), leatherMat);
    belt.position.set(0, 0.41, 0);

    // 耀目黄金狮王宝石扣 (Lion Head Arming Buckle with Ruby)
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.075, 0.035), goldMat);
    buckle.position.set(0, 0.41, 0.17);
    const buckleGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.028, 0), rubyMat);
    buckleGem.position.set(0, 0.41, 0.19);

    // 前甲裙板 (Front Fauld) 与金边
    const frontFauld = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.025), mithrilMat);
    frontFauld.position.set(0, 0.36, 0.15);
    frontFauld.rotation.x = 0.12;

    const frontFauldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.016, 0.03), goldMat);
    frontFauldTrim.position.set(0, 0.32, 0.16);
    frontFauldTrim.rotation.x = 0.12;

    // 左右护胯甲片 (Side Tassets)
    const tassetL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.18), mithrilMat);
    tassetL.position.set(-0.19, 0.32, 0.0);
    tassetL.rotation.z = -0.15;
    const tassetTrimL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.018, 0.18), goldMat);
    tassetTrimL.position.set(-0.20, 0.25, 0.0);
    tassetTrimL.rotation.z = -0.15;

    const tassetR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.18), mithrilMat);
    tassetR.position.set(0.19, 0.32, 0.0);
    tassetR.rotation.z = 0.15;
    const tassetTrimR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.018, 0.18), goldMat);
    tassetTrimR.position.set(0.20, 0.25, 0.0);
    tassetTrimR.rotation.z = 0.15;

    // 后臀裙甲 (Rear Culet)
    const rearCulet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.025), mithrilMat);
    rearCulet.position.set(0, 0.36, -0.15);
    rearCulet.rotation.x = -0.12;

    pelvisG.add(
      belt, buckle, buckleGem,
      frontFauld, frontFauldTrim,
      tassetL, tassetTrimL,
      tassetR, tassetTrimR,
      rearCulet
    );
    group.add(pelvisG);

    // -------------------------------------------------------------------------
    // 3. 雄壮英武板甲胸甲、皇家蓝珐琅与护喉 (Contoured Cuirass, Emblem & Gorget)
    // -------------------------------------------------------------------------
    const torsoG = new THREE.Group();
    torsoG.name = 'hero_torso';

    // (1) 腹部护甲收腰层 (Abdomen Armor)
    const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.198, 0.12, 16), mithrilMat);
    abdomen.scale.set(1.0, 1.0, 0.76);
    abdomen.position.set(0, 0.48, 0);

    // (2) 倒三角英武胸甲主板 (Sculpted Breastplate Cuirass)
    const breastplate = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.185, 0.20, 16), mithrilMat);
    breastplate.scale.set(1.0, 1.0, 0.74);
    breastplate.position.set(0, 0.60, 0);

    // 胸甲中央锋脊棱线 (Central Ridge / Keel)
    const centerKeel = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.20, 0.045), goldMat);
    centerKeel.position.set(0, 0.60, 0.145);

    // (3) 皇家蓝珐琅胸徽基底 (Royal Azure Enamel Inlay)
    const royalBluePlate = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.17, 0.035), royalBlueMat);
    royalBluePlate.position.set(0, 0.60, 0.125);

    // (4) 圣光金色荣耀十字徽章 (Champion Holy Cross & Heart Gem)
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.042, 0.025), goldMat);
    crossH.position.set(0, 0.61, 0.16);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.17, 0.025), goldMat);
    crossV.position.set(0, 0.60, 0.16);
    const heartRuby = new THREE.Mesh(new THREE.OctahedronGeometry(0.032, 0), rubyMat);
    heartRuby.position.set(0, 0.61, 0.178);

    // (5) 骑士钢护喉与金饰边 (Gorget & Throat Collar)
    const gorget = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.145, 0.09, 14), mithrilMat);
    gorget.position.set(0, 0.72, 0.01);
    const throatRim = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.014, 6, 16), goldMat);
    throatRim.rotation.x = Math.PI / 2;
    throatRim.position.set(0, 0.73, 0.01);

    torsoG.add(
      abdomen, breastplate, centerKeel,
      royalBluePlate, crossH, crossV, heartRuby,
      gorget, throatRim
    );
    group.add(torsoG);

    // -------------------------------------------------------------------------
    // 4. 荣耀圣殿冠军头盔与三段飘逸战翎 (Heroic Great Helm, Crown & Flowing Plume)
    // -------------------------------------------------------------------------
    const helmG = new THREE.Group();
    helmG.name = 'hero_helm';

    // (1) 战盔穹顶与面颊护甲 (Helm Dome & Cheek Guards)
    const helmDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.155, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
      mithrilMat
    );
    helmDome.position.set(0, 0.90, 0.0);

    const helmCheeks = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.142, 0.17, 16), mithrilMat);
    helmCheeks.position.set(0, 0.83, 0.0);

    // 前凸式锐角下颌甲 (Bevor Chin Plate)
    const chinBevor = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.13, 5), mithrilMat);
    chinBevor.rotation.x = -Math.PI / 2;
    chinBevor.position.set(0, 0.77, 0.09);

    // (2) 护目狭缝与坚毅目光 (Heroic Visor Slit & Glowing Eyes)
    const browRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.165, 0.165, 0.03, 16, 1, false, 0, Math.PI),
      goldMat
    );
    browRim.position.set(0, 0.865, 0.02);

    const slitRecess = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.045), slitMat);
    slitRecess.position.set(0, 0.845, 0.14);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.016, 0.02), eyeGlowMat);
    eyeL.position.set(-0.05, 0.845, 0.155);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.016, 0.02), eyeGlowMat);
    eyeR.position.set(0.05, 0.845, 0.155);

    // 面罩黄金十字加强梁 (Golden Visor Reinforcement Cross)
    const nasalGuard = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.14, 0.03), goldMat);
    nasalGuard.position.set(0, 0.825, 0.155);
    const visorLip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.012, 0.03), goldMat);
    visorLip.position.set(0, 0.865, 0.145);

    // (3) 王者黄金头冠与双翼战徽 (Champion Crown & Winged Diadem)
    const crownCirclet = new THREE.Mesh(new THREE.CylinderGeometry(0.162, 0.162, 0.028, 16), goldMat);
    crownCirclet.position.set(0, 0.92, 0.0);

    const crestWingL = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.10, 4), goldMat);
    crestWingL.rotation.z = 0.45;
    crestWingL.rotation.x = -0.2;
    crestWingL.position.set(-0.065, 0.95, 0.13);

    const crestWingR = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.10, 4), goldMat);
    crestWingR.rotation.z = -0.45;
    crestWingR.rotation.x = -0.2;
    crestWingR.position.set(0.065, 0.95, 0.13);

    const crownGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), rubyMat);
    crownGem.position.set(0, 0.94, 0.155);

    // (4) 盔顶高脊与战翎底座 (Helmet Comb & Golden Plume Socket)
    const helmComb = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.28), goldMat);
    helmComb.position.set(0, 1.01, -0.01);

    const plumeSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.028, 0.06, 8), goldMat);
    plumeSocket.position.set(0, 1.03, -0.05);

    // (5) 三重自然飘逸大红战翎与侧羽 (Triple-Tier Champion Plume)
    const plumeTier1 = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.26, 8), plumeMat);
    plumeTier1.rotation.x = -0.35;
    plumeTier1.position.set(0, 1.12, -0.06);

    const plumeTier2 = new THREE.Mesh(new THREE.ConeGeometry(0.046, 0.24, 8), plumeMat);
    plumeTier2.rotation.x = -0.80;
    plumeTier2.position.set(0, 1.18, -0.18);

    const plumeTier3 = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.20, 8), plumeMat);
    plumeTier3.rotation.x = -1.25;
    plumeTier3.position.set(0, 1.13, -0.30);

    const plumeSideL = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.18, 6), plumeMat);
    plumeSideL.rotation.z = 0.22;
    plumeSideL.rotation.x = -0.50;
    plumeSideL.position.set(-0.04, 1.10, -0.12);

    const plumeSideR = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.18, 6), plumeMat);
    plumeSideR.rotation.z = -0.22;
    plumeSideR.rotation.x = -0.50;
    plumeSideR.position.set(0.04, 1.10, -0.12);

    helmG.add(
      helmDome, helmCheeks, chinBevor,
      browRim, slitRecess, eyeL, eyeR, nasalGuard, visorLip,
      crownCirclet, crestWingL, crestWingR, crownGem,
      helmComb, plumeSocket,
      plumeTier1, plumeTier2, plumeTier3, plumeSideL, plumeSideR
    );
    group.add(helmG);

    // -------------------------------------------------------------------------
    // 5. 左臂：重装肩甲、臂铠与神圣守护者纹章大盾 (Left Arm, Spaulder & Shield)
    // -------------------------------------------------------------------------
    const leftArmG = new THREE.Group();
    leftArmG.name = 'hero_left_arm';

    // 左重装肩甲 (Spaulder)
    const spaulderL = new THREE.Group();
    const spaulderDomeL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), mithrilMat);
    spaulderDomeL.scale.set(1.15, 0.85, 1.15);
    const spaulderTrimL = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 6, 12, Math.PI), goldMat);
    spaulderTrimL.rotation.x = Math.PI / 2;
    const spaulderBossL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), goldMat);
    spaulderBossL.position.set(-0.09, 0, 0);
    const spaulderLameL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.05, 10), mithrilMat);
    spaulderLameL.position.set(0, -0.06, 0);
    spaulderL.add(spaulderDomeL, spaulderTrimL, spaulderBossL, spaulderLameL);
    spaulderL.position.set(-0.27, 0.67, 0.0);

    // 左上臂 (Upper Arm / Bicep)
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.042, 0.16, 8), mithrilMat);
    upperArmL.position.set(-0.27, 0.53, 0.02);
    upperArmL.rotation.z = 0.18;
    upperArmL.rotation.x = 0.15;

    // 左护肘 (Couter with Apex)
    const couterL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), mithrilMat);
    couterL.position.set(-0.28, 0.43, 0.06);
    const couterApexL = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.035, 6), goldMat);
    couterApexL.rotation.z = Math.PI / 2;
    couterApexL.position.set(-0.31, 0.43, 0.06);

    // 左前臂 (Vambrace) - 屈臂护盾姿态
    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.040, 0.16, 8), mithrilMat);
    forearmL.position.set(-0.26, 0.38, 0.14);
    forearmL.rotation.x = 0.65;
    forearmL.rotation.y = 0.25;

    // 左手铁甲手套 (Gauntlet) - 紧扣盾牌内圈把手
    const gauntletL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.07), mithrilMat);
    gauntletL.position.set(-0.24, 0.35, 0.22);
    const gauntletCuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.025, 8), goldMat);
    gauntletCuffL.position.set(-0.25, 0.36, 0.18);

    // 神圣守护者重盾 (Holy Heater Shield) - 坚固安装在小臂外侧
    const shieldG = new THREE.Group();
    shieldG.name = 'hero_shield';

    // 盾牌深色实木与钢衬底
    const shieldBack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.44, 0.025), steelDarkMat);
    shieldBack.position.set(0, 0, -0.015);

    // 盾面主体（皇家蓝高贵盾心，上下弧面与收尖）
    const shieldFace = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.03), royalBlueMat);
    shieldFace.position.set(0, 0.07, 0.005);

    const shieldPoint = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.22, 4), royalBlueMat);
    shieldPoint.rotation.y = Math.PI / 4;
    shieldPoint.rotation.z = Math.PI;
    shieldPoint.position.set(0, -0.16, 0.005);

    // 盾牌外围重甲黄金滚边 (Beveled Gold Rims)
    const rimTop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.035, 0.045), goldMat);
    rimTop.position.set(0, 0.21, 0.015);
    const rimSideL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.30, 0.045), goldMat);
    rimSideL.position.set(-0.165, 0.07, 0.015);
    const rimSideR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.30, 0.045), goldMat);
    rimSideR.position.set(0.165, 0.07, 0.015);
    const rimApex = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), goldMat);
    rimApex.position.set(0, -0.27, 0.015);

    // 盾面浮雕神圣十字勋章与中央耀眼红宝石
    const shieldCrossH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.045, 0.035), goldMat);
    shieldCrossH.position.set(0, 0.06, 0.03);
    const shieldCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.34, 0.035), goldMat);
    shieldCrossV.position.set(0, 0.02, 0.03);
    const shieldBoss = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), goldMat);
    shieldBoss.position.set(0, 0.06, 0.05);
    const shieldRuby = new THREE.Mesh(new THREE.OctahedronGeometry(0.032, 0), rubyMat);
    shieldRuby.position.set(0, 0.06, 0.072);

    shieldG.add(
      shieldBack, shieldFace, shieldPoint,
      rimTop, rimSideL, rimSideR, rimApex,
      shieldCrossH, shieldCrossV, shieldBoss, shieldRuby
    );
    // 盾牌自然护卫在小臂与左胸前侧，威严坚固
    shieldG.position.set(-0.29, 0.44, 0.16);
    shieldG.rotation.y = 0.28;
    shieldG.rotation.x = -0.06;

    leftArmG.add(spaulderL, upperArmL, couterL, couterApexL, forearmL, gauntletL, gauntletCuffL, shieldG);
    group.add(leftArmG);

    // -------------------------------------------------------------------------
    // 6. 右臂：重装肩甲、臂铠与勇者神圣利刃 (Right Arm, Spaulder & Holy Sword)
    // -------------------------------------------------------------------------
    const rightArmG = new THREE.Group();
    rightArmG.name = 'hero_right_arm';

    // 右重装肩甲 (Spaulder)
    const spaulderR = new THREE.Group();
    const spaulderDomeR = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), mithrilMat);
    spaulderDomeR.scale.set(1.15, 0.85, 1.15);
    const spaulderTrimR = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 6, 12, Math.PI), goldMat);
    spaulderTrimR.rotation.x = Math.PI / 2;
    const spaulderBossR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), goldMat);
    spaulderBossR.position.set(0.09, 0, 0);
    const spaulderLameR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.05, 10), mithrilMat);
    spaulderLameR.position.set(0, -0.06, 0);
    spaulderR.add(spaulderDomeR, spaulderTrimR, spaulderBossR, spaulderLameR);
    spaulderR.position.set(0.27, 0.67, 0.0);

    // 右上臂 (Upper Arm / Bicep)
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.042, 0.16, 8), mithrilMat);
    upperArmR.position.set(0.27, 0.53, 0.02);
    upperArmR.rotation.z = -0.20;
    upperArmR.rotation.x = 0.22;

    // 右护肘 (Couter with Apex)
    const couterR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), mithrilMat);
    couterR.position.set(0.29, 0.42, 0.07);
    const couterApexR = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.035, 6), goldMat);
    couterApexR.rotation.z = -Math.PI / 2;
    couterApexR.position.set(0.32, 0.42, 0.07);

    // 右前臂 (Vambrace) - 执剑前倾出击蓄势姿态
    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.040, 0.16, 8), mithrilMat);
    forearmR.position.set(0.29, 0.36, 0.16);
    forearmR.rotation.x = 0.55;
    forearmR.rotation.y = -0.15;

    // 右手铁甲手套握柄 (Gauntlet)
    const gauntletR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.075), mithrilMat);
    gauntletR.position.set(0.30, 0.34, 0.24);
    const gauntletCuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.025, 8), goldMat);
    gauntletCuffR.position.set(0.29, 0.35, 0.20);

    // 传奇勇者圣剑 (The Legendary Holy Broadsword)
    const swordG = new THREE.Group();
    swordG.name = 'hero_sword';

    // (1) 剑首配重球与镶嵌红宝石 (Pommel & Ruby)
    const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.042, 0), goldMat);
    pommel.position.y = -0.14;
    const pommelRuby = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), rubyMat);
    pommelRuby.position.y = -0.14;

    // (2) 细密皮革缠绕剑柄 (Leather Grip - firmly gripped inside gauntlet)
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 8), leatherMat);
    grip.position.y = -0.04;

    // (3) 翼展黄金雕花护手与核心红宝石 (Winged Crossguard & Core Gem)
    const guardBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.042, 0.055), goldMat);
    guardBar.position.y = 0.05;
    const guardCenterBoss = new THREE.Mesh(new THREE.OctahedronGeometry(0.038, 0), goldMat);
    guardCenterBoss.position.set(0, 0.05, 0.03);
    const guardRuby = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), rubyMat);
    guardRuby.position.set(0, 0.05, 0.045);

    // (4) 锋锐双刃秘银剑身、血槽与尖锋 (Double-Edged Blade, Fuller & Tip)
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.62, 0.016), bladeMat);
    blade.position.y = 0.36;

    // 剑脊神圣符文血槽 (Runic Fuller)
    const fuller = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.52, 0.02), runicFullerMat);
    fuller.position.set(0, 0.34, 0);

    // 剑尖折角收敛 (Sword Tip)
    const swordTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 4), bladeMat);
    swordTip.rotation.y = Math.PI / 4;
    swordTip.position.y = 0.73;

    swordG.add(pommel, pommelRuby, grip, guardBar, guardCenterBoss, guardRuby, blade, fuller, swordTip);

    // 将圣剑精准装配在右手手心，剑刃斜向前上方指向敌人
    swordG.position.set(0.30, 0.34, 0.24);
    swordG.rotation.x = 0.45;
    swordG.rotation.z = -0.15;

    rightArmG.add(spaulderR, upperArmR, couterR, couterApexR, forearmR, gauntletR, gauntletCuffR, swordG);
    group.add(rightArmG);

    // -------------------------------------------------------------------------
    // 7. 高贵层叠飘逸猩红斗篷 (Regal Multi-Tier Flowing Red Cape & Lion Clasps)
    // -------------------------------------------------------------------------
    const capeG = new THREE.Group();
    capeG.name = 'hero_cape';

    // 双肩黄金狮首披风扣与红宝石 (Lion Clasps with Rubies)
    const claspL = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 10), goldMat);
    claspL.rotation.x = Math.PI / 2;
    claspL.position.set(-0.16, 0.69, -0.11);
    const claspGemL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), rubyMat);
    claspGemL.position.set(-0.16, 0.69, -0.125);

    const claspR = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 10), goldMat);
    claspR.rotation.x = Math.PI / 2;
    claspR.position.set(0.16, 0.69, -0.11);
    const claspGemR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), rubyMat);
    claspGemR.position.set(0.16, 0.69, -0.125);

    // 背后金色披风连接链 (Golden Mantel Chain)
    const mantleChain = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.008, 6, 16, Math.PI), goldMat);
    mantleChain.position.set(0, 0.69, -0.115);

    // 三段式自然垂坠与向后飘扬的立体斗篷褶皱 (Layered Billowing Folds)
    // 上段：贴合肩颈自然垂落
    const capeTop = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.20, 0.02), capeMat);
    capeTop.position.set(0, 0.58, -0.15);
    capeTop.rotation.x = 0.12;

    // 中段：逐渐向外展开微扬
    const capeMid = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.02), capeMat);
    capeMid.position.set(0, 0.40, -0.19);
    capeMid.rotation.x = 0.22;

    // 下段：宽大飘逸下摆波浪褶皱
    const capeBottom = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.02), capeMat);
    capeBottom.position.set(0, 0.20, -0.25);
    capeBottom.rotation.x = 0.32;

    // 内衬深色阴影板，营造丰富体积感
    const capeLining = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.015), capeDarkMat);
    capeLining.position.set(0, 0.38, -0.18);
    capeLining.rotation.x = 0.20;

    capeG.add(claspL, claspGemL, claspR, claspGemR, mantleChain, capeTop, capeMid, capeBottom, capeLining);
    group.add(capeG);

    // -------------------------------------------------------------------------
    // 8. 阴影投射与网格比例调优 (Scale & Shadows)
    // -------------------------------------------------------------------------
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // 角色比例调优：0.85 比例在 1x1 地格中威风凛凛且动作舒展无穿模
    group.scale.multiplyScalar(0.85);
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
  // 3. 智者 / 经验老人 (Elder / Sage NPC) - 真正逼真传神的长者形象
  // 拥有慈祥微驼的长者身姿、深邃法袍金丝滚边、秃顶白发、茂密垂胸长髯与胡髭、
  // 枯木盘龙拐杖与古朴灵晶、挽袖褶皱与脚蹬皮靴，彻底告别粗糙几何方块
  // =========================================================================
  static createOldManMesh(variant: 'normal' | 'exp' = 'normal'): THREE.Group {
    const group = new THREE.Group();
    group.name = variant === 'exp' ? 'npc_elder_exp' : 'npc_old_man';

    // 材质定义
    // 经验老人着深邃翠绿长袍 (0x065f46)，普通智慧老人着经典宝蓝长袍 (0x1e3a8a)
    const robeColor = variant === 'exp' ? 0x065f46 : 0x1e3a8a;
    const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.68 });
    const innerTunicMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.75 }); // 象牙麻布内衬
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.75, roughness: 0.3 }); // 金丝锦绣滚边
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }); // 皮革腰带
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.25 }); // 铜扣
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.85 }); // 磨损长者深褐皮靴
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfad1b0, roughness: 0.55 }); // 慈祥红润长者肤色
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 }); // 苍白银丝须发
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.9 }); // 饱经风霜的古木拐杖

    // 拐杖顶端灵晶 (经验老人为翡翠荧光，普通老人为苍蓝符文灵石)
    const staffCrystalMat = new THREE.MeshStandardMaterial({
      color: variant === 'exp' ? 0x10b981 : 0x38bdf8,
      emissive: variant === 'exp' ? 0x059669 : 0x0284c7,
      emissiveIntensity: 0.75,
      metalness: 0.2,
      roughness: 0.15,
    });

    // 1. 站姿与步伐：皮靴 (Boots & Feet)
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.14), bootMat);
    bootL.position.set(-0.08, 0.025, 0.05);
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.14), bootMat);
    bootR.position.set(0.08, 0.025, 0.05);

    // 2. 长者微驼身躯与宽袍大袖 (Torso & Layered Robe with natural elder stoop)
    const bodyG = new THREE.Group();
    bodyG.position.y = 0;
    bodyG.rotation.x = 0.06; // 慈祥睿智长者自然微驼前倾姿态

    // 下摆长袍 (Flared Robe Gown)
    const robeSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.38, 0.65, 16), robeMat);
    robeSkirt.position.y = 0.35;
    // 底部金丝滚边
    const hemTrim = new THREE.Mesh(new THREE.CylinderGeometry(0.375, 0.385, 0.04, 16), goldTrimMat);
    hemTrim.position.y = 0.04;
    // 正面中央对襟金丝锦条
    const frontTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 0.02), goldTrimMat);
    frontTrim.position.set(0, 0.35, 0.29);

    // 上身长袍 (Upper Robe Torso)
    const upperTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.32, 16), robeMat);
    upperTorso.position.y = 0.58;

    // 内衬衣领 V-领口露出米白象牙布料
    const innerNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.14, 12), innerTunicMat);
    innerNeck.position.set(0, 0.70, 0.02);

    // 皮革腰带与黄铜搭扣 (Leather Belt & Buckle)
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.23, 0.06, 16), leatherMat);
    belt.position.y = 0.46;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.03), buckleMat);
    buckle.position.set(0, 0.46, 0.23);

    // 左右宽大袍袖 (Draped Robe Sleeves)
    // 左臂与左手自然下垂
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, 0.30, 10), robeMat);
    sleeveL.position.set(-0.25, 0.54, 0.02);
    sleeveL.rotation.z = -0.35;
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
    handL.position.set(-0.30, 0.38, 0.02);

    // 右臂抬起、右手紧握拐杖
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, 0.26, 10), robeMat);
    sleeveR.position.set(0.24, 0.56, 0.08);
    sleeveR.rotation.x = 0.35;
    sleeveR.rotation.z = 0.30;
    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
    handR.position.set(0.28, 0.50, 0.18);
    // 右手拇指紧扣握柄
    const thumbR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.04, 6), skinMat);
    thumbR.position.set(0.26, 0.52, 0.18);
    thumbR.rotation.z = -0.5;

    bodyG.add(
      robeSkirt, hemTrim, frontTrim, upperTorso, innerNeck, belt, buckle,
      sleeveL, handL, sleeveR, handR, thumbR
    );

    // 3. 头部与五官神韵 (Dignified Kind Elder Face, Ears, Nose & Hair)
    const headG = new THREE.Group();
    headG.position.set(0, 0.80, 0.06);

    // 长者头部基座 (Head cranium)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), skinMat);

    // 左右真实长者耳朵 (Ears)
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), skinMat);
    earL.scale.set(0.5, 1.3, 0.8);
    earL.position.set(-0.14, 0, 0.01);
    const earR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), skinMat);
    earR.scale.set(0.5, 1.3, 0.8);
    earR.position.set(0.14, 0, 0.01);

    // 真正老人的发型：光亮智者顶秃，两鬓与脑后白发环绕 (Bald Crown with Silver Fringe Hair)
    // 脑后丰满长卷白发 (Back Hair flowing down to collar)
    const backHair = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.26, 12), hairMat);
    backHair.position.set(0, -0.06, -0.07);
    backHair.rotation.x = -0.15;

    // 两鬓苍白发丝 (Sideburn Tufts)
    const templeHairL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), hairMat);
    templeHairL.scale.set(0.7, 1.2, 0.9);
    templeHairL.position.set(-0.12, 0.02, -0.03);
    const templeHairR = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), hairMat);
    templeHairR.scale.set(0.7, 1.2, 0.9);
    templeHairR.position.set(0.12, 0.02, -0.03);

    // 慈祥深邃眼眸 (Kind squinting elder eyes)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const eyeLW = new THREE.Mesh(new THREE.SphereGeometry(0.024), eyeWhiteMat);
    eyeLW.scale.set(1.1, 0.55, 0.5);
    eyeLW.position.set(-0.045, 0.02, 0.13);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.015), eyeMat);
    eyeL.position.set(-0.045, 0.02, 0.142);

    const eyeRW = new THREE.Mesh(new THREE.SphereGeometry(0.024), eyeWhiteMat);
    eyeRW.scale.set(1.1, 0.55, 0.5);
    eyeRW.position.set(0.045, 0.02, 0.13);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.015), eyeMat);
    eyeR.position.set(0.045, 0.02, 0.142);

    // 浓密微垂白眉毛 (Bushy Arching White Eyebrows)
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.026, 0.026), hairMat);
    browL.position.set(-0.05, 0.055, 0.138);
    browL.rotation.z = -0.18;
    browL.rotation.y = 0.12;

    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.026, 0.026), hairMat);
    browR.position.set(0.05, 0.055, 0.138);
    browR.rotation.z = 0.18;
    browR.rotation.y = -0.12;

    // 立体长者鹰钩/圆润鼻梁与鼻头 (Distinct Elder Nose)
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, 0.07, 8), skinMat);
    noseBridge.position.set(0, -0.01, 0.142);
    noseBridge.rotation.x = 0.22;
    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.030, 8, 8), skinMat);
    noseTip.position.set(0, -0.035, 0.155);

    // 浓密八字大白胡髭 (Thick White Mustache curving over lips)
    const mustL = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.13, 8), hairMat);
    mustL.position.set(-0.045, -0.065, 0.148);
    mustL.rotation.z = 1.35;
    mustL.rotation.x = 0.25;

    const mustR = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.13, 8), hairMat);
    mustR.position.set(0.045, -0.065, 0.148);
    mustR.rotation.z = -1.35;
    mustR.rotation.x = 0.25;

    // 层次丰满的垂胸长者白髯 (Majestic Layered Flowing White Beard)
    // 1) 颔下基座
    const chinBeard = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), hairMat);
    chinBeard.position.set(0, -0.10, 0.11);
    // 2) 胸前飘垂主须
    const mainBeard = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 12), hairMat);
    mainBeard.position.set(0, -0.28, 0.12);
    mainBeard.rotation.x = 0.20;
    // 3) 飘逸下垂须尖 (延伸至腹部腰带上方)
    const beardTip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.26, 8), hairMat);
    beardTip.position.set(0, -0.42, 0.16);
    beardTip.rotation.x = 0.15;

    headG.add(
      head, earL, earR, backHair, templeHairL, templeHairR,
      eyeLW, eyeL, eyeRW, eyeR, browL, browR,
      noseBridge, noseTip, mustL, mustR,
      chinBeard, mainBeard, beardTip
    );

    // 4. 苍劲古木灵杖 (Realistic Gnarled Wooden Staff with Focus Crystal)
    const staffG = new THREE.Group();
    // 直抵地面的木杖杆身
    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.98, 8), woodMat);
    staffShaft.position.y = 0.49;

    // 拐杖上部树瘤盘结与曲木弯柄
    const staffKnot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), woodMat);
    staffKnot.position.y = 0.96;
    const staffHeadCurved = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.038, 0.14, 8), woodMat);
    staffHeadCurved.position.set(-0.02, 1.02, 0);
    staffHeadCurved.rotation.z = -0.35;

    // 拐杖顶峰镶嵌的古朴高亮灵晶
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.048), staffCrystalMat);
    crystal.position.set(-0.04, 1.09, 0);

    staffG.add(staffShaft, staffKnot, staffHeadCurved, crystal);
    staffG.position.set(0.28, 0, 0.18);

    group.add(bootL, bootR, bodyG, headG, staffG);

    // 5. 挂载友好交互指示器 (头顶气泡与脚底光环)
    group.add(this.createNpcBubble());

    // 整体等比缩小 20% 契合魔塔 0.8x 角色比例标准
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

    if (monsterId === 'giant_squid') {
      group = this.createGiantSquidMesh(monsterId, data, color);
    } else if (monsterId === 'ghost') {
      group = this.createGhostMesh(monsterId, data, color);
    } else if (monsterId === 'dragon') {
      group = this.createDragonMesh(monsterId, data, color);
    } else if (monsterId === 'archmage') {
      group = this.createArchmageMesh(monsterId, data, color);
    } else if (monsterId === 'ghost_commander') {
      group = this.createGhostCommanderMesh(monsterId, data, color);
    } else if (monsterId === 'false_sorcerer') {
      group = this.createFalseSorcererMesh(monsterId, data, color);
    } else if (monsterId === 'demon_lord') {
      group = this.createDemonLordMesh(monsterId, data, color);
    } else if (monsterId === 'skeleton_captain') {
      group = this.createSkeletonMesh(monsterId, data, color);
    } else if (data.modelType === 'slime') {
      group = this.createSlimeMesh(monsterId, data, color);
    } else if (data.modelType === 'bat') {
      group = this.createBatMesh(monsterId, data, color);
    } else if (data.modelType === 'skeleton') {
      group = this.createSkeletonMesh(monsterId, data, color);
    } else if (data.modelType === 'mage') {
      group = this.createMageMesh(monsterId, data, color);
    } else if (data.modelType === 'guard') {
      group = this.createGuardMesh(monsterId, data, color);
    } else if (data.modelType === 'knight') {
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

    // 角色体型等比缩减 20% (大乌贼为横跨 3 格的超大型深海巨兽，保持 3 格宽幅原生物理体量)
    if (monsterId !== 'giant_squid') {
      group.scale.multiplyScalar(0.8);
    }
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.1 史莱姆系列 (Slime: Green Slime, Red Slime, Big Slime, Slime King)
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

    if (monsterId === 'red_slime') {
      // 红史莱姆专属：头顶一对小恶魔果冻犄角 (Demon Jelly Hornlets)
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.65,
        roughness: 0.2,
      });
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 8), hornMat);
      hornL.position.set(-0.12, 0.70, 0.04);
      hornL.rotation.z = 0.45;
      hornL.rotation.x = -0.2;
      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 8), hornMat);
      hornR.position.set(0.12, 0.70, 0.04);
      hornR.rotation.z = -0.45;
      hornR.rotation.x = -0.2;
      group.add(hornL, hornR);
    } else if (monsterId === 'big_slime') {
      // 大史莱姆专属：体表多块墨绿远古矿石结晶 (Embedded Emerald Geodes)
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b,
        roughness: 0.85,
      });
      const rockOffsets = [
        [-0.32, 0.28, 0.12, 0.08],
        [0.34, 0.25, 0.10, 0.09],
        [-0.24, 0.46, -0.15, 0.07],
        [0.26, 0.44, -0.16, 0.07],
        [0.0, 0.62, -0.18, 0.08],
        [0.18, 0.15, 0.28, 0.06],
      ];
      for (const [rx, ry, rz, rs] of rockOffsets) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rs, 0), rockMat);
        rock.position.set(rx, ry, rz);
        group.add(rock);
      }
      group.scale.set(1.3, 1.3, 1.3);
    } else if (monsterId === 'slime_king') {
      // 史莱姆王专属：六角华美王冠与右侧悬浮黄金权杖
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

      const scepterG = new THREE.Group();
      const scepterStaff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.65, 8),
        crownGold
      );
      scepterStaff.position.y = 0.32;
      const scepterHead = new THREE.Mesh(new THREE.OctahedronGeometry(0.07, 0), crownGold);
      scepterHead.position.y = 0.64;
      const scepterGem = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.5 })
      );
      scepterGem.position.y = 0.64;
      scepterG.add(scepterStaff, scepterHead, scepterGem);
      scepterG.position.set(0.48, 0.15, 0.10);
      scepterG.rotation.z = -0.2;

      group.add(crownG, scepterG);
      group.scale.set(1.4, 1.35, 1.4);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.1.1 幽灵系列 (Ghost: 游荡冤魂 / 怨念幽灵)
  // 标志性特征：半空漂浮灵体、残破深紫幽灵长袍兜帽、幽暗深渊面腔、幽蓝摄魄凶瞳、悬浮鬼爪与环绕阴火
  // -------------------------------------------------------------------------
  private static createGhostMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const ghostMat = new THREE.MeshPhysicalMaterial({
      color: 0x9333ea,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.5,
      transmission: 0.45,
      transparent: true,
      opacity: 0.88,
      roughness: 0.35,
      metalness: 0.05,
    });
    const darkVoidMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // 幽蓝勾魂寒眸
    const wispMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 2.2,
      transparent: true,
      opacity: 0.9,
    });

    // 1. 悬浮躯干与波浪形灵体长尾 (Floating Torso & Spectral Tail)
    const torsoPts: THREE.Vector2[] = [
      new THREE.Vector2(0, 0.05),
      new THREE.Vector2(0.08, 0.15),
      new THREE.Vector2(0.16, 0.30),
      new THREE.Vector2(0.22, 0.48),
      new THREE.Vector2(0.20, 0.68),
      new THREE.Vector2(0.12, 0.78),
      new THREE.Vector2(0.0, 0.82),
    ];
    const ghostTorso = new THREE.Mesh(new THREE.LatheGeometry(torsoPts, 20), ghostMat);
    ghostTorso.position.y = 0.15;

    // 弯曲飘荡的幽灵尾部 (Wispy Ghost Tail)
    const tailG = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const segR = 0.07 - i * 0.012;
      const seg = new THREE.Mesh(new THREE.ConeGeometry(segR, 0.16, 8), ghostMat);
      seg.position.set(Math.sin(i * 0.7) * 0.06, -0.08 - i * 0.10, Math.cos(i * 0.7) * 0.05);
      seg.rotation.x = 0.35 + i * 0.15;
      seg.rotation.z = Math.sin(i) * 0.3;
      tailG.add(seg);
    }
    tailG.position.y = 0.25;

    // 2. 幽灵深斗篷兜帽与深邃面腔 (Ghost Cowl Hood & Deep Shadow Cavity)
    const hoodG = new THREE.Group();
    const hoodCowl = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), ghostMat);
    hoodCowl.position.set(0, 0.88, 0);

    const faceVoid = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), darkVoidMat);
    faceVoid.position.set(0, 0.88, 0.06);

    // 幽冷勾魂双眸
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), eyeMat);
    eyeL.position.set(-0.048, 0.89, 0.16);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), eyeMat);
    eyeR.position.set(0.048, 0.89, 0.16);

    // 尖翘兜帽尖端 (Pointed Hood Peak)
    const hoodPeak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 8), ghostMat);
    hoodPeak.position.set(0, 1.05, -0.08);
    hoodPeak.rotation.x = -0.55;

    hoodG.add(hoodCowl, faceVoid, eyeL, eyeR, hoodPeak);

    // 3. 悬浮利爪 (Floating Ghost Claws)
    const createClaw = (x: number) => {
      const cg = new THREE.Group();
      const sleeve = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.20, 8), ghostMat);
      sleeve.rotation.x = Math.PI / 2 + 0.3;
      sleeve.rotation.z = x > 0 ? -0.4 : 0.4;
      sleeve.position.set(0, 0, 0);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), ghostMat);
      hand.position.set(0, -0.05, 0.12);

      for (let f = -1; f <= 1; f++) {
        const finger = new THREE.Mesh(new THREE.ConeGeometry(0.010, 0.06, 4), ghostMat);
        finger.position.set(f * 0.018, -0.08, 0.15);
        finger.rotation.x = 0.5;
        cg.add(finger);
      }
      cg.add(sleeve, hand);
      cg.position.set(x, 0.60, 0.10);
      return cg;
    };

    // 4. 环绕幽魂鬼火 (Orbiting Will-o'-Wisps)
    const wispsG = new THREE.Group();
    for (let w = 0; w < 3; w++) {
      const angle = (w * Math.PI * 2) / 3;
      const wisp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), wispMat);
      wisp.position.set(Math.cos(angle) * 0.36, 0.50 + Math.sin(angle * 2) * 0.15, Math.sin(angle) * 0.36);
      wispsG.add(wisp);
    }

    group.add(ghostTorso, tailG, hoodG, createClaw(-0.26), createClaw(0.26), wispsG);
    group.scale.set(1.15, 1.15, 1.15);
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
      // 大蝙蝠专属：黑铁钉刺项圈 (Spiked Iron Collar) 与角质耳铠
      const ironCollarMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.85,
        roughness: 0.30,
      });
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.024, 8, 16), ironCollarMat);
      collar.position.set(0, 0.61, 0.03);
      collar.rotation.x = 0.55;
      for (let s = 0; s < 6; s++) {
        const ang = (s * Math.PI * 2) / 6;
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.07, 6), ironCollarMat);
        spike.position.set(Math.cos(ang) * 0.12, 0.61, Math.sin(ang) * 0.12 + 0.03);
        spike.rotation.x = Math.PI / 2;
        group.add(spike);
      }
      group.add(collar);
      group.scale.set(1.28, 1.28, 1.28);
    } else if (monsterId === 'red_bat') {
      // 红蝙蝠专属：血魔双弯角 (Blood Demon Horns) 与恶魔尖尾 (Devil Tail)
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0x881337,
        roughness: 0.3,
        metalness: 0.1,
      });
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 8), hornMat);
      hornL.position.set(-0.10, 0.94, -0.06);
      hornL.rotation.x = -0.65;
      hornL.rotation.z = -0.35;

      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 8), hornMat);
      hornR.position.set(0.10, 0.94, -0.06);
      hornR.rotation.x = -0.65;
      hornR.rotation.z = 0.35;

      // 恶魔尖尾
      const tailMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.6 });
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.008, 0.28, 8), tailMat);
      tail.position.set(0, 0.18, -0.15);
      tail.rotation.x = -0.7;
      const tailSpade = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 4), tailMat);
      tailSpade.position.set(0, 0.08, -0.24);
      tailSpade.rotation.x = Math.PI - 0.7;

      group.add(hornL, hornR, tail, tailSpade);
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

      // 队长金尖弯刀与黄金盾钉
      const cutlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.60, 0.02),
        goldArmorMat
      );
      cutlass.position.set(0.32, 0.40, 0.22);
      cutlass.rotation.x = Math.PI / 4;

      const shieldSpike = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.12, 8),
        goldArmorMat
      );
      shieldSpike.position.set(-0.26, 0.44, 0.26);
      shieldSpike.rotation.x = Math.PI / 2;

      group.add(captainHelm, hornL, hornR, cape, cutlass, shieldSpike);
      group.scale.set(1.25, 1.25, 1.25);
    } else if (monsterId === 'ghost_soldier') {
      // 鬼战士专属：幽蓝灵光虚影、摄魂长柄战镰 (Soul Scythe) 与双肩魂火
      const soulScytheG = new THREE.Group();
      const scythePole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 1.35, 8),
        new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.6 })
      );
      scythePole.position.y = 0.50;

      const scytheBlade = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.52, 4),
        new THREE.MeshStandardMaterial({ color: 0xc7d2fe, emissive: 0x6366f1, emissiveIntensity: 1.5, metalness: 0.9 })
      );
      scytheBlade.position.set(0.24, 1.10, 0);
      scytheBlade.rotation.z = Math.PI / 2 + 0.3;
      soulScytheG.add(scythePole, scytheBlade);
      soulScytheG.position.set(0.32, 0.15, 0.18);
      soulScytheG.rotation.x = 0.2;

      // 幽火护肩
      const fireMat = new THREE.MeshStandardMaterial({
        color: 0xa5b4fc,
        emissive: 0x6366f1,
        emissiveIntensity: 2.2,
      });
      const soulFireL = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), fireMat);
      soulFireL.position.set(-0.25, 0.68, 0);
      const soulFireR = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), fireMat);
      soulFireR.position.set(0.25, 0.68, 0);

      group.add(soulScytheG, soulFireL, soulFireR);
      group.scale.set(1.15, 1.15, 1.15);
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
    } else if (monsterId === 'junior_wizard') {
      robeHex = 0xea580c; // 初级巫师：秘术炽橙
      trimHex = 0xfef08a; // 浅金符文
      hatHex = 0xc2410c;
      orbHex = 0xfbbf24; // 琥珀金魔球
    } else if (monsterId === 'senior_wizard') {
      robeHex = 0xb91c1c; // 高级巫师：深邃猩红
      trimHex = 0xf59e0b; // 纯金符文
      hatHex = 0x991b1b;
      orbHex = 0xf43f5e; // 绯红魔核
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

    const isWizard = monsterId === 'junior_wizard' || monsterId === 'senior_wizard';

    if (isWizard) {
      // 巫师专属：深邃神秘兜帽 (Mystic Hood Cowl)
      const cowlDome = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), hatMat);
      cowlDome.position.set(0, 0.84, 0);
      const cowlBrim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 16), hatMat);
      cowlBrim.position.set(0, 0.82, 0.05);
      const cowlTail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), hatMat);
      cowlTail.position.set(0, 0.95, -0.12);
      cowlTail.rotation.x = -0.7;
      hatG.add(cowlDome, cowlBrim, cowlTail);
    } else {
      // 法师专属：经典尖顶宽檐巫师帽 (Pointed Wizard Hat)
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.025, 24), hatMat);
      brim.position.y = 0.86;
      brim.rotation.x = -0.1;

      const crownBase = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 16), hatMat);
      crownBase.position.set(0, 1.01, -0.02);
      crownBase.rotation.x = -0.15;

      const crownTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), hatMat);
      crownTip.position.set(0, 1.22, -0.1);
      crownTip.rotation.x = -0.45;
      crownTip.rotation.z = -0.2;

      const hatBand = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.02, 8, 20), trimMat);
      hatBand.rotation.x = Math.PI / 2 - 0.1;
      hatBand.position.set(0, 0.88, -0.01);

      hatG.add(brim, crownBase, crownTip, hatBand);
    }

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

    if (monsterId === 'junior_wizard') {
      // 展开的远古秘术魔导书 (Open Ancient Grimoire)
      const bookG = new THREE.Group();
      const coverMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
      const pageMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 });
      const coverL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.015), coverMat);
      coverL.position.set(-0.06, 0, 0);
      coverL.rotation.y = 0.3;
      const coverR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.015), coverMat);
      coverR.position.set(0.06, 0, 0);
      coverR.rotation.y = -0.3;
      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.03), pageMat);
      bookG.add(coverL, coverR, pages);
      bookG.position.set(-0.34, 0.58, 0.20);
      bookG.rotation.x = 0.5;
      armL.add(sleeveL, handL, bookG);
    } else {
      const castGlowMat = new THREE.MeshStandardMaterial({
        color: orbHex,
        emissive: orbHex,
        emissiveIntensity: 2.0,
        roughness: 0.1,
      });
      const castGlow = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), castGlowMat);
      castGlow.position.set(-0.32, 0.62, 0.16);
      armL.add(sleeveL, handL, castGlow);
    }

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

    // 高级巫师专属：背部悬浮金色奥术符文光轮 (Arcane Halo Glyph Ring)
    if (monsterId === 'senior_wizard') {
      const haloMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 1.5,
        metalness: 0.9,
      });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.02, 12, 32), haloMat);
      halo.position.set(0, 0.65, -0.15);
      group.add(halo);
    }

    group.add(robe, stole, belt, buckle, headG, hatG, armR, armL, staffG);

    if (monsterId === 'senior_mage') {
      group.scale.set(1.15, 1.15, 1.15);
    } else if (monsterId === 'red_mage') {
      group.scale.set(1.25, 1.25, 1.25);
    } else if (monsterId === 'junior_wizard') {
      group.scale.set(1.18, 1.18, 1.18);
    } else if (monsterId === 'senior_wizard') {
      group.scale.set(1.28, 1.28, 1.28);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.5.1 城堡守卫/卫兵系列 (Guard: Junior Guard, Medium Guard, Senior Guard, Iron Guard, Magic Guard)
  // 5大守卫各具特色：
  // - junior_guard: 朴素步兵圆顶盔、长直枪(Infantry Pike，无斧钩)、步兵圆木盾(Wooden Buckler)
  // - mid_guard: 经典高脊前檐红翎头盔、长柄战戟(Royal Halberd，带月牙斧刃刺矛背钩与红流苏)、金塔要塞守备方盾(Castle Garrison Shield)
  // - senior_guard: 紫金重装护面盔、双面重型斧枪(Double Poleaxe)、金纹重型纹章塔盾(Heavy Pavise Shield)
  // - iron_guard: 沉重黑铁全覆面桶盔、六棱带刺狼牙破甲战锤(Spiked Morningstar Polearm)、黑铁十字铆钉方盾(Heavy Iron Pavise)
  // - magic_guard: 奥术兜帽护面盔镶嵌发光晶石、奥术能量晶刃光矛(Arcane Crystal Glaive)、悬浮六边形奥术力场结界盾(Hexagonal Barrier Shield)
  // -------------------------------------------------------------------------
  private static createGuardMesh(monsterId: string, data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    // 配色方案定制
    let tabardColor = 0xdc2626;     // 战袍（中级卫兵基准：猩红）
    let tabardTrimColor = 0xfbbf24; // 饰边金色
    let armorMetalColor = 0x64748b; // 锻造精钢
    let armorTrimColor = 0xd97706;  // 铜金铆钉与扣件
    let helmetCombColor = 0xf59e0b; // 盔脊颜色
    let plumeColor = 0xef4444;      // 盔翎颜色
    let eyeGlowColor = 0xfef08a;     // 面罩内冷酷警戒目光

    if (monsterId === 'junior_guard') {
      tabardColor = 0x15803d;
      tabardTrimColor = 0xa3e635;
      armorMetalColor = 0x64748b;
      armorTrimColor = 0x94a3b8;
      helmetCombColor = 0x94a3b8;
      plumeColor = 0x16a34a;
      eyeGlowColor = 0xe2e8f0;
    } else if (monsterId === 'mid_guard') {
      tabardColor = 0xdc2626;
      tabardTrimColor = 0xfbbf24;
      armorMetalColor = 0x64748b;
      armorTrimColor = 0xd97706;
      helmetCombColor = 0xf59e0b;
      plumeColor = 0xef4444;
      eyeGlowColor = 0xfef08a;
    } else if (monsterId === 'senior_guard') {
      tabardColor = 0x581c87;
      tabardTrimColor = 0xfbbf24;
      armorMetalColor = 0x334155;
      armorTrimColor = 0xf59e0b;
      helmetCombColor = 0xf59e0b;
      plumeColor = 0xa855f7;
      eyeGlowColor = 0xf43f5e;
    } else if (monsterId === 'iron_guard') {
      tabardColor = 0x1e293b;
      tabardTrimColor = 0x475569;
      armorMetalColor = 0x0f172a;
      armorTrimColor = 0x64748b;
      helmetCombColor = 0x475569;
      plumeColor = 0x475569;
      eyeGlowColor = 0xffffff;
    } else if (monsterId === 'magic_guard') {
      tabardColor = 0x4338ca;
      tabardTrimColor = 0x38bdf8;
      armorMetalColor = 0x312e81;
      armorTrimColor = 0x67e8f9;
      helmetCombColor = 0x38bdf8;
      plumeColor = 0x06b6d4;
      eyeGlowColor = 0x38bdf8;
    }

    const tabardMat = new THREE.MeshStandardMaterial({
      color: tabardColor,
      roughness: 0.65,
    });
    const tabardTrimMat = new THREE.MeshStandardMaterial({
      color: tabardTrimColor,
      metalness: 0.85,
      roughness: 0.25,
    });
    const armorMat = new THREE.MeshStandardMaterial({
      color: armorMetalColor,
      metalness: 0.85,
      roughness: 0.28,
    });
    const armorTrimMat = new THREE.MeshStandardMaterial({
      color: armorTrimColor,
      metalness: 0.90,
      roughness: 0.22,
    });
    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.80,
    });
    const buckleMat = new THREE.MeshStandardMaterial({
      color: armorTrimColor,
      metalness: 0.92,
      roughness: 0.20,
    });
    const mailMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.80,
      roughness: 0.50,
    });

    // 1. 躯干、锁甲底衬与卫士制服罩袍 (Torso & Heraldic Tabard)
    const torsoG = new THREE.Group();
    const breastplate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.26), armorMat);
    breastplate.position.set(0, 0.46, 0);

    const gorget = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.08, 10), armorMat);
    gorget.position.set(0, 0.65, 0);

    const tabardFront = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.38, 0.03), tabardMat);
    tabardFront.position.set(0, 0.46, 0.13);

    const tabardBack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.38, 0.03), tabardMat);
    tabardBack.position.set(0, 0.46, -0.13);

    const tabardStripe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.035), tabardTrimMat);
    tabardStripe.position.set(0, 0.46, 0.132);

    const chestBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), tabardTrimMat);
    chestBadge.position.set(0, 0.52, 0.145);

    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.065, 12), beltMat);
    belt.position.set(0, 0.29, 0);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.075, 0.04), buckleMat);
    buckle.position.set(0, 0.29, 0.14);

    const skirtFront = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.20, 0.025), tabardMat);
    skirtFront.position.set(0, 0.18, 0.12);

    const skirtBack = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.20, 0.025), tabardMat);
    skirtBack.position.set(0, 0.18, -0.12);

    const skirtTrimFront = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.03), tabardTrimMat);
    skirtTrimFront.position.set(0, 0.085, 0.12);

    const tassetL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.16, 0.18), armorMat);
    tassetL.position.set(-0.19, 0.19, 0);
    const tassetR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.16, 0.18), armorMat);
    tassetR.position.set(0.19, 0.19, 0);

    torsoG.add(
      breastplate, gorget, tabardFront, tabardBack, tabardStripe, chestBadge,
      belt, buckle, skirtFront, skirtBack, skirtTrimFront, tassetL, tassetR
    );

    // 2. 卫兵头盔 (五种不同盔型)
    const helmG = new THREE.Group();
    const headInner = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    headInner.position.set(0, 0.81, 0);

    const eyeMat = new THREE.MeshBasicMaterial({ color: eyeGlowColor });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.016, 0.02), eyeMat);
    eyeL.position.set(-0.045, 0.815, 0.12);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.016, 0.02), eyeMat);
    eyeR.position.set(0.045, 0.815, 0.12);
    helmG.add(headInner, eyeL, eyeR);

    if (monsterId === 'junior_guard') {
      // 初级卫兵：朴素步兵圆顶锅盔 (Kettle Hat / Footman Sallet)，无高耸盔脊与羽翎
      const kettleDome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), armorMat);
      kettleDome.position.set(0, 0.84, 0);
      const kettleBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.025, 16), armorTrimMat);
      kettleBrim.position.set(0, 0.83, 0);
      const chinStrap = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 6, 12, Math.PI), beltMat);
      chinStrap.position.set(0, 0.78, 0.02);
      chinStrap.rotation.x = Math.PI;
      helmG.add(kettleDome, kettleBrim, chinStrap);
    } else if (monsterId === 'iron_guard') {
      // 铁甲卫兵：全覆面重型黑铁桶盔 (Heavy Iron Bucket Helm)
      const ironHelm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.28, 12), armorMat);
      ironHelm.position.set(0, 0.85, 0);
      // 十字观察铁缝
      const slitH = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.04), new THREE.MeshBasicMaterial({ color: 0x050505 }));
      slitH.position.set(0, 0.83, 0.16);
      const slitV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.04), armorTrimMat);
      slitV.position.set(0, 0.83, 0.162);
      // 顶部加固铁钉
      const topSpike = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 6), armorTrimMat);
      topSpike.position.set(0, 1.01, 0);
      helmG.add(ironHelm, slitH, slitV, topSpike);
    } else if (monsterId === 'magic_guard') {
      // 魔法警卫：奥术兜帽护面盔，前额镶嵌奥术晶石 (Arcane Gem Visored Helm)
      const arcaneHelm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.22, 14), armorMat);
      arcaneHelm.position.set(0, 0.86, 0);
      const hoodBrim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 8, 16), tabardMat);
      hoodBrim.position.set(0, 0.85, 0.03);
      // 前额发光奥术晶石
      const foreheadGem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.04, 0),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x06b6d4, emissiveIntensity: 2.0 })
      );
      foreheadGem.position.set(0, 0.94, 0.15);
      helmG.add(arcaneHelm, hoodBrim, foreheadGem);
    } else if (monsterId === 'senior_guard') {
      // 高级卫兵：紫金重装双翎护面盔 (Visored Barbute with Twin Plumes)
      const helmDome = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.24, 14), armorMat);
      helmDome.position.set(0, 0.86, 0);
      const visorTrim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 12, Math.PI), tabardTrimMat);
      visorTrim.position.set(0, 0.83, 0.04);
      visorTrim.rotation.x = Math.PI / 2;
      // 左右双翎羽
      const plumeMat = new THREE.MeshStandardMaterial({ color: plumeColor, roughness: 0.75 });
      const plumeL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 6), plumeMat);
      plumeL.position.set(-0.11, 1.02, -0.05);
      plumeL.rotation.z = 0.25;
      const plumeR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 6), plumeMat);
      plumeR.position.set(0.11, 1.02, -0.05);
      plumeR.rotation.z = -0.25;
      helmG.add(helmDome, visorTrim, plumeL, plumeR);
    } else {
      // 中级卫兵（基准）：经典高脊前檐红翎头盔 (Morion with Brass Comb & Red Plume)
      const helmDome = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.165, 0.20, 14), armorMat);
      helmDome.position.set(0, 0.86, 0);
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.20, 0.025, 12, 1, false, 0, Math.PI),
        armorTrimMat
      );
      brim.rotation.x = 0.25;
      brim.position.set(0, 0.83, 0.08);

      const combMat = new THREE.MeshStandardMaterial({
        color: helmetCombColor,
        metalness: 0.90,
        roughness: 0.20,
      });
      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.08, 0.32), combMat);
      comb.position.set(0, 0.98, -0.01);

      const plumeMat = new THREE.MeshStandardMaterial({ color: plumeColor, roughness: 0.75 });
      const plume = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.26, 8), plumeMat);
      plume.rotation.x = -0.35;
      plume.position.set(0, 1.06, -0.07);

      helmG.add(helmDome, brim, comb, plume);
    }

    // 3. 双腿与长靴
    const legG = new THREE.Group();
    const createGuardLeg = (x: number) => {
      const g = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.18, 8), mailMat);
      thigh.position.set(0, 0.18, 0);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), armorTrimMat);
      knee.position.set(0, 0.09, 0.02);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.05, 0.18, 8), armorMat);
      shin.position.set(0, 0.0, 0);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.16), armorMat);
      boot.position.set(0, -0.08, 0.03);
      g.add(thigh, knee, shin, boot);
      g.position.set(x, 0, 0);
      return g;
    };
    legG.add(createGuardLeg(-0.11), createGuardLeg(0.11));

    const createGuardSpaulder = (x: number) => {
      const spG = new THREE.Group();
      const topPlate = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), armorMat);
      topPlate.scale.set(1.1, 0.7, 1.1);
      const rimPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.04, 10), armorTrimMat);
      rimPlate.position.set(0, -0.05, 0);
      spG.add(topPlate, rimPlate);
      spG.position.set(x, 0.62, 0);
      return spG;
    };

    // 4. 右臂与专属武器 (5大卫兵各自专属武器)
    const armR = new THREE.Group();
    const shoulderR = createGuardSpaulder(0.24);
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.18, 8), armorMat);
    upperArmR.position.set(0.24, 0.48, 0.02);
    upperArmR.rotation.z = -0.25;
    upperArmR.rotation.x = 0.20;

    const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), armorTrimMat);
    elbowR.position.set(0.27, 0.40, 0.06);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.18, 8), armorMat);
    forearmR.position.set(0.28, 0.34, 0.14);
    forearmR.rotation.x = 0.55;

    const gauntletR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.075), armorTrimMat);
    gauntletR.position.set(0.28, 0.28, 0.20);

    const weaponG = new THREE.Group();

    if (monsterId === 'junior_guard') {
      // 初级卫兵：长直枪 (Infantry Pike - 纯长木杆 + 柳叶精钢枪尖 + 绿枪缨，无斧刃与背钩)
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 1.50, 8),
        new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.7 })
      );
      shaft.position.y = 0.38;
      const spearHead = new THREE.Mesh(
        new THREE.ConeGeometry(0.032, 0.38, 4),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
      );
      spearHead.position.y = 1.15;
      const greenTassel = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.12, 6),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 })
      );
      greenTassel.position.y = 0.92;
      weaponG.add(shaft, spearHead, greenTassel);
    } else if (monsterId === 'senior_guard') {
      // 高级卫兵：双面重型斧枪 (Double Battle-Axe Poleaxe - 左右对称宽刃双斧 + 顶端重矛)
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 1.45, 8),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
      );
      shaft.position.y = 0.35;
      const topSpike = new THREE.Mesh(
        new THREE.ConeGeometry(0.03, 0.36, 4),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.15 })
      );
      topSpike.position.y = 1.12;
      const axeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.15 });
      const axeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.018), axeMat);
      axeL.position.set(-0.11, 0.90, 0);
      const axeR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.018), axeMat);
      axeR.position.set(0.11, 0.90, 0);
      const goldCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.10), armorTrimMat);
      goldCollar.position.y = 0.88;
      weaponG.add(shaft, topSpike, axeL, axeR, goldCollar);
    } else if (monsterId === 'iron_guard') {
      // 铁甲卫兵：重型破甲狼牙铁战锤 (Spiked Morningstar Polearm - 黑铁手柄 + 六棱带钉实心锤头 + 顶端穿甲锥)
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1.35, 8),
        new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.85, roughness: 0.3 })
      );
      shaft.position.y = 0.32;
      const hammerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 6), armorMat);
      hammerHead.position.y = 0.90;
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.07, 4), armorTrimMat);
        spike.position.set(Math.cos(ang) * 0.08, 0.90, Math.sin(ang) * 0.08);
        spike.rotation.z = Math.cos(ang) * -1.57;
        spike.rotation.x = Math.sin(ang) * 1.57;
        weaponG.add(spike);
      }
      const topPick = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 4), armorTrimMat);
      topPick.position.y = 1.08;
      weaponG.add(shaft, hammerHead, topPick);
    } else if (monsterId === 'magic_guard') {
      // 魔法警卫：奥术晶刃光矛 (Arcane Crystal Glaive - 发光水晶刀刃 + 符文环)
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 1.45, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 })
      );
      shaft.position.y = 0.35;
      const crystalBlade = new THREE.Mesh(
        new THREE.ConeGeometry(0.045, 0.45, 4),
        new THREE.MeshStandardMaterial({
          color: 0x67e8f9,
          emissive: 0x06b6d4,
          emissiveIntensity: 1.8,
          roughness: 0.1,
        })
      );
      crystalBlade.position.y = 1.15;
      const runeRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.065, 0.012, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 2.0 })
      );
      runeRing.position.y = 0.92;
      runeRing.rotation.x = Math.PI / 2;
      weaponG.add(shaft, crystalBlade, runeRing);
    } else {
      // 中级卫兵（基准）：经典长柄战戟 (Royal Halberd - 精钢宽弧斧刃、破甲背钩、挺直刺矛尖、赤红丝绦)
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 1.45, 8),
        new THREE.MeshStandardMaterial({ color: 0x3f1d0b, roughness: 0.65 })
      );
      shaft.position.y = 0.35;
      const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.08), armorTrimMat);
      socket.position.y = 0.88;
      const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      tassel.position.y = 0.82;
      const headMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.15 });
      const spearSpike = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.36, 4), headMat);
      spearSpike.position.y = 1.10;
      const axeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.016), headMat);
      axeBlade.position.set(0.10, 0.92, 0);
      const rearBeak = new THREE.Mesh(new THREE.ConeGeometry(0.020, 0.14, 4), armorTrimMat);
      rearBeak.rotation.z = Math.PI / 2;
      rearBeak.position.set(-0.08, 0.92, 0);
      weaponG.add(shaft, socket, tassel, spearSpike, axeBlade, rearBeak);
    }

    weaponG.position.set(0.28, 0.28, 0.20);
    weaponG.rotation.x = 0.12;
    armR.add(shoulderR, upperArmR, elbowR, forearmR, gauntletR, weaponG);

    // 5. 左臂与专属盾牌 (5大卫兵各自专属盾牌)
    const armL = new THREE.Group();
    const shoulderL = createGuardSpaulder(-0.24);
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.18, 8), armorMat);
    upperArmL.position.set(-0.24, 0.48, 0.02);
    upperArmL.rotation.z = 0.25;
    upperArmL.rotation.x = 0.20;

    const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), armorTrimMat);
    elbowL.position.set(-0.27, 0.40, 0.06);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.18, 8), armorMat);
    forearmL.position.set(-0.28, 0.34, 0.14);
    forearmL.rotation.x = 0.55;

    const gauntletL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.075), armorTrimMat);
    gauntletL.position.set(-0.28, 0.28, 0.20);

    const shieldG = new THREE.Group();

    if (monsterId === 'junior_guard') {
      // 初级卫兵：小型步兵圆木盾 (Round Wooden Buckler - 绿色盘面、铁圈包边、凸起铁盾脐)
      const bucklerDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.03, 16),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 })
      );
      bucklerDisc.rotation.x = Math.PI / 2;
      const bucklerRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.19, 0.015, 6, 16),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 })
      );
      const bucklerBoss = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 })
      );
      bucklerBoss.position.z = 0.025;
      shieldG.add(bucklerDisc, bucklerRim, bucklerBoss);
    } else if (monsterId === 'iron_guard') {
      // 铁甲卫兵：沉重黑铁十字铆钉方盾 (Heavy Iron Cross-Reinforced Pavise)
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.54, 0.05), armorMat);
      // 十字加固黑铁板
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.54, 0.06), armorTrimMat);
      crossV.position.z = 0.01;
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.06), armorTrimMat);
      crossH.position.z = 0.01;
      shieldG.add(slab, crossV, crossH);
      // 沉重铆钉
      const rivetPositions = [
        [-0.14, 0.22], [0.14, 0.22], [-0.14, -0.22], [0.14, -0.22], [0, 0]
      ];
      rivetPositions.forEach(([rx, ry]) => {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), armorTrimMat);
        rivet.position.set(rx, ry, 0.04);
        shieldG.add(rivet);
      });
    } else if (monsterId === 'magic_guard') {
      // 魔法警卫：悬浮六边形奥术结界力场盾 (Hexagonal Arcane Barrier Shield - 半透明青蓝光盾)
      const barrierMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.02, 6),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 1.5,
          transmission: 0.65,
          transparent: true,
          opacity: 0.85,
          roughness: 0.1,
        })
      );
      barrierMesh.rotation.x = Math.PI / 2;
      const runeRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.20, 0.012, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x06b6d4, emissiveIntensity: 2.0 })
      );
      runeRing.position.z = 0.015;
      shieldG.add(barrierMesh, runeRing);
    } else if (monsterId === 'senior_guard') {
      // 高级卫兵：金纹重型纹章塔盾 (Royal Pavise Shield with Crown Crest)
      const shieldPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.56, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.55 })
      );
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
      const rimTop = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.04, 0.05), rimMat);
      rimTop.position.set(0, 0.27, 0);
      const rimBottom = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.05), rimMat);
      rimBottom.position.set(0, -0.27, 0);
      const crownCrest = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.03), rimMat);
      crownCrest.position.set(0, 0.06, 0.03);
      shieldG.add(shieldPlate, rimTop, rimBottom, crownCrest);
    } else {
      // 中级卫兵（基准）：要塞守备盾 (Castle Garrison Shield - 红底、铜金包边、金色城堡浮雕)
      const shieldPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.54, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55 })
      );
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.88, roughness: 0.25 });
      const rimTop = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.035, 0.05), rimMat);
      rimTop.position.set(0, 0.26, 0);
      const rimBottom = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.05), rimMat);
      rimBottom.position.set(0, -0.26, 0);
      const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.54, 0.05), rimMat);
      rimLeft.position.set(-0.17, 0, 0);
      const rimRight = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.54, 0.05), rimMat);
      rimRight.position.set(0.17, 0, 0);

      const crestMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.18 });
      const towerBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.025), crestMat);
      towerBody.position.set(0, 0.02, 0.026);
      const crenelL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.025), crestMat);
      crenelL.position.set(-0.05, 0.12, 0.026);
      const crenelR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.025), crestMat);
      crenelR.position.set(0.05, 0.12, 0.026);

      shieldG.add(shieldPlate, rimTop, rimBottom, rimLeft, rimRight, towerBody, crenelL, crenelR);
    }

    shieldG.position.set(-0.28, 0.38, 0.18);
    shieldG.rotation.y = 0.32;
    armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, shieldG);

    // 组装整体守卫
    group.add(torsoG, helmG, legG, armR, armL);

    // 体量细化
    if (monsterId === 'mid_guard') {
      group.scale.set(1.08, 1.08, 1.08);
    } else if (monsterId === 'senior_guard') {
      group.scale.set(1.18, 1.18, 1.18);
    } else if (monsterId === 'iron_guard') {
      group.scale.set(1.15, 1.15, 1.15);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.5.2 皇家骑士与重装武士系列 (Knight: Knight, Knight Captain, Dark Knight, White Knight, Yellow Knight, Blue Knight, Warrior, Dual Swordsman)
  // 8位骑士与战士各具独一无二建模：
  // - warrior: 维京诺曼鼻甲盔、锁子甲胸铠、宽刃破阵战斧、北欧彩绘圆木盾 (与板甲骑士决然不同)
  // - dual_swordsman: 敏捷刺客兜帽蒙面、双持弧刃弯月斩马刀 (双刀流，无盾)
  // - yellow_knight: 重装牛角肩铠、双手横持处决者巨剑 (双手重剑姿态，无盾)
  // - blue_knight: 钴蓝流线型盔、细长破甲刺剑、晶蓝冰霜圆盾
  // - dark_knight: 黑曜尖角恶魔盔、锯齿黑炎巨剑、深渊骨刺盾
  // - white_knight: 圣白鎏金板甲、圣银大阔剑、晨曦十字大风筝盾、圣洁白披风
  // - knight_captain: 灿金统帅重铠、将领威严赤红大翎、鲜红天鹅绒将领斗篷、统帅金阔剑、太阳纹章盾
  // - knight: 经典亮银抛光板甲、皇家蔚蓝羽翎、封闭式十字大头盔、精钢十字阔剑、圣殿十字大盾
  // -------------------------------------------------------------------------
  private static createKnightMesh(monsterId: string, data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    let armorColor = 0xd1d5db; // 经典亮银
    let trimColor = 0xf59e0b;  // 饰边黄金
    let plumeColor = 0x2563eb; // 翎羽
    let eyeSlitColor = 0x050508;

    if (monsterId === 'knight') {
      armorColor = 0xd1d5db;
      trimColor = 0xf59e0b;
      plumeColor = 0x2563eb;
    } else if (monsterId === 'knight_captain') {
      armorColor = 0xf59e0b;
      trimColor = 0xfef08a;
      plumeColor = 0xdc2626;
    } else if (monsterId === 'dark_knight') {
      armorColor = 0x18181b;
      trimColor = 0x7c3aed;
      plumeColor = 0x991b1b;
      eyeSlitColor = 0xef4444;
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
    } else if (monsterId === 'warrior') {
      armorColor = 0x475569;
      trimColor = 0x94a3b8;
      plumeColor = 0x38bdf8;
    } else if (monsterId === 'dual_swordsman') {
      armorColor = 0x1e293b;
      trimColor = 0x0284c7;
      plumeColor = 0x38bdf8;
    }

    const armorMat = new THREE.MeshStandardMaterial({
      color: armorColor,
      metalness: monsterId === 'warrior' || monsterId === 'dual_swordsman' ? 0.6 : 0.88,
      roughness: monsterId === 'warrior' || monsterId === 'dual_swordsman' ? 0.45 : 0.22,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: trimColor,
      metalness: 0.92,
      roughness: 0.18,
    });

    // 1. 躯干
    const torsoG = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.28), armorMat);
    torso.position.set(0, 0.46, 0);

    if (monsterId === 'warrior') {
      // 战士：锁子甲底衬与皮质X型武装交叉皮带
      const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.02), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
      strap1.position.set(0, 0.46, 0.142);
      strap1.rotation.z = 0.45;
      const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.02), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
      strap2.position.set(0, 0.46, 0.142);
      strap2.rotation.z = -0.45;
      torsoG.add(torso, strap1, strap2);
    } else {
      const breastRidge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.03), trimMat);
      breastRidge.position.set(0, 0.48, 0.135);
      const fauld = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.14, 8), armorMat);
      fauld.position.set(0, 0.22, 0);
      torsoG.add(torso, breastRidge, fauld);
    }

    // 2. 头部与头盔 (各骑士独立特色头盔)
    const helmG = new THREE.Group();
    if (monsterId === 'warrior') {
      // 战士：诺曼/维京护鼻铁盔 (Norman Nasal Helmet with Mail Coif)
      const coif = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
      coif.position.set(0, 0.82, 0);
      const coneHelm = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.26, 12), armorMat);
      coneHelm.position.set(0, 0.90, 0);
      const nasal = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.025), armorMat);
      nasal.position.set(0, 0.79, 0.15);
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      eyeL.position.set(-0.05, 0.81, 0.13);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      eyeR.position.set(0.05, 0.81, 0.13);
      helmG.add(coif, coneHelm, nasal, eyeL, eyeR);
    } else if (monsterId === 'dual_swordsman') {
      // 双手剑士：疾风刺客兜帽蒙面面罩 (Assassin Cowl with Fierce Blue Eyes)
      const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), armorMat);
      cowl.position.set(0, 0.82, 0);
      const mask = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 0.08), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      mask.position.set(0, 0.78, 0.12);
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.02), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      eyeL.position.set(-0.05, 0.84, 0.14);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.02), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      eyeR.position.set(0.05, 0.84, 0.14);
      helmG.add(cowl, mask, eyeL, eyeR);
    } else if (monsterId === 'dark_knight') {
      // 黑暗骑士：恶魔黑角全盔 (Horned Demon Great Helm)
      const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.28, 14), armorMat);
      const slitMat = new THREE.MeshBasicMaterial({ color: eyeSlitColor });
      const slit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.05), slitMat);
      slit.position.set(0, 0.03, 0.155);
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 6), trimMat);
      hornL.position.set(-0.16, 0.14, -0.02);
      hornL.rotation.z = 0.55;
      hornL.rotation.x = -0.2;
      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 6), trimMat);
      hornR.position.set(0.16, 0.14, -0.02);
      hornR.rotation.z = -0.55;
      hornR.rotation.x = -0.2;
      helmG.add(helm, slit, hornL, hornR);
      helmG.position.set(0, 0.82, 0);
    } else {
      // 标准与队长闭面大头盔
      const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.28, 14), armorMat);
      const slitMat = new THREE.MeshBasicMaterial({ color: eyeSlitColor });
      const slit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.05), slitMat);
      slit.position.set(0, 0.03, 0.155);
      const helmCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.04), trimMat);
      helmCrossV.position.set(0, 0.02, 0.158);

      const plumeMat = new THREE.MeshStandardMaterial({ color: plumeColor, roughness: 0.75 });
      const plume = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.26, 6), plumeMat);
      plume.rotation.x = -0.5;
      plume.position.set(0, 0.22, -0.05);

      helmG.add(helm, slit, helmCrossV, plume);
      helmG.position.set(0, 0.82, 0);
    }

    const createPauldron = (x: number) => {
      const pG = new THREE.Group();
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), trimMat);
      p.scale.set(1.1, 0.8, 1.1);
      const flange = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.18), trimMat);
      flange.position.set(x > 0 ? 0.06 : -0.06, 0.04, 0);
      pG.add(p, flange);

      if (monsterId === 'yellow_knight') {
        // 黄衣武士：重装牛角肩甲尖刺
        const hornSpike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 6), trimMat);
        hornSpike.position.set(x > 0 ? 0.06 : -0.06, 0.12, 0);
        hornSpike.rotation.z = x > 0 ? -0.4 : 0.4;
        pG.add(hornSpike);
      }

      pG.position.set(x, 0.62, 0);
      return pG;
    };

    // 3. 双腿板甲
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 8), armorMat);
    legL.position.set(-0.1, 0.12, 0);
    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 8), armorMat);
    legR.position.set(0.1, 0.12, 0);

    // 4. 右手武器与右臂
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

    const weaponR = new THREE.Group();

    if (monsterId === 'warrior') {
      // 战士：宽刃破阵战斧 (Broad-Bladed Viking Battleaxe)
      const haft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03 })
      );
      haft.position.y = 0.20;
      const axeHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.20, 0.025),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
      );
      axeHead.position.set(0.08, 0.42, 0);
      weaponR.add(haft, axeHead);
    } else if (monsterId === 'dual_swordsman') {
      // 双手剑士：右持弧刃弯月斩马刀 (Curved Scimitar / Saber)
      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16), trimMat);
      hilt.position.y = -0.08;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.62, 0.015),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 })
      );
      blade.position.set(0.04, 0.26, 0);
      blade.rotation.z = -0.12;
      weaponR.add(hilt, blade);
    } else if (monsterId === 'yellow_knight') {
      // 黄衣武士：双手巨型处决者大剑 (Two-Handed Executioner Greatsword)
      const hilt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.26),
        new THREE.MeshStandardMaterial({ color: 0x451a03 })
      );
      hilt.position.y = -0.15;
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.04), trimMat);
      cross.position.y = 0.0;
      const heavyBlade = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.85, 0.025),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.12 })
      );
      heavyBlade.position.y = 0.44;
      weaponR.add(hilt, cross, heavyBlade);
    } else if (monsterId === 'blue_knight') {
      // 蓝衣武士：细长刺剑 / 破甲剑 (Runic Estoc / Thrusting Rapier)
      const rapierBlade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.016, 0.72, 8),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.1 })
      );
      rapierBlade.position.y = 0.36;
      const cupGuard = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), trimMat);
      cupGuard.rotation.x = Math.PI;
      const rapierHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
      rapierHilt.position.y = -0.06;
      weaponR.add(rapierBlade, cupGuard, rapierHilt);
    } else if (monsterId === 'dark_knight') {
      // 黑暗骑士：锯齿黑炎巨剑 (Jagged Dark Flame Greatsword)
      const darkHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18), trimMat);
      darkHilt.position.y = -0.12;
      const darkCross = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.04), trimMat);
      darkCross.position.y = -0.02;
      const darkBlade = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.72, 0.025),
        new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.3 })
      );
      darkBlade.position.y = 0.34;
      const flameCore = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.65, 0.028),
        new THREE.MeshStandardMaterial({ color: 0x9333ea, emissive: 0x7c3aed, emissiveIntensity: 2.2 })
      );
      flameCore.position.y = 0.34;
      weaponR.add(darkHilt, darkCross, darkBlade, flameCore);
    } else {
      // 标准阔剑 (Broadsword)
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.65, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.10 })
      );
      blade.position.y = 0.28;
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.03), trimMat);
      cross.position.y = -0.05;
      const hilt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      hilt.position.y = -0.13;
      const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), trimMat);
      pommel.position.y = -0.21;
      weaponR.add(blade, cross, hilt, pommel);
    }

    weaponR.position.set(0.28, 0.26, 0.20);
    weaponR.rotation.x = Math.PI / 4;
    armR.add(shoulderR, upperArmR, elbowR, forearmR, gauntletR, weaponR);

    // 5. 左臂与专属盾牌 / 左手武器
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

    if (monsterId === 'dual_swordsman') {
      // 双手剑士：左手双持另一柄弧刃弯刀
      const swordL = weaponR.clone();
      swordL.position.set(-0.28, 0.26, 0.20);
      swordL.rotation.x = Math.PI / 4;
      swordL.rotation.y = -Math.PI / 6;
      armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, swordL);
    } else if (monsterId === 'yellow_knight') {
      // 黄衣武士：双手紧握大剑，左手共同向前握持大剑柄 (两手合抱姿态，无盾牌)
      forearmL.position.set(-0.16, 0.34, 0.22);
      forearmL.rotation.z = -0.55;
      forearmL.rotation.y = 0.45;
      gauntletL.position.set(-0.10, 0.32, 0.28);
      armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL);
    } else if (monsterId === 'warrior') {
      // 战士：北欧彩绘圆木盾 (Painted Viking Round Shield)
      const shieldG = new THREE.Group();
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.03, 16),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 })
      );
      disc.rotation.x = Math.PI / 2;
      const ironRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.25, 0.015, 6, 16),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 })
      );
      const boss = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      boss.position.z = 0.02;
      shieldG.add(disc, ironRim, boss);
      shieldG.position.set(-0.30, 0.38, 0.18);
      shieldG.rotation.y = 0.35;
      armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, shieldG);
    } else if (monsterId === 'blue_knight') {
      // 蓝衣武士：晶蓝冰霜圆盾 (Frost Buckler with 6-pointed star)
      const shieldG = new THREE.Group();
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.20, 0.03, 16),
        new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.7 })
      );
      disc.rotation.x = Math.PI / 2;
      const iceStar = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.08, 0),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.5 })
      );
      iceStar.position.z = 0.025;
      shieldG.add(disc, iceStar);
      shieldG.position.set(-0.30, 0.38, 0.18);
      shieldG.rotation.y = 0.35;
      armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, shieldG);
    } else if (monsterId === 'dark_knight') {
      // 黑暗骑士：深渊骨刺黑曜盾 (Demonic Spiked Obsidian Shield)
      const shieldG = new THREE.Group();
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.52, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 })
      );
      const spikeCenter = new THREE.Mesh(
        new THREE.ConeGeometry(0.05, 0.14, 4),
        new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x6d28d9, emissiveIntensity: 1.8 })
      );
      spikeCenter.position.set(0, 0.06, 0.08);
      spikeCenter.rotation.x = Math.PI / 2;
      shieldG.add(plate, spikeCenter);
      shieldG.position.set(-0.30, 0.38, 0.18);
      shieldG.rotation.y = 0.35;
      armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, shieldG);
    } else {
      // 圣殿骑士 / 骑士队长十字盾
      const shieldG = new THREE.Group();
      const shield = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.05), armorMat);
      const shieldRim = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.54, 0.04), trimMat);
      shieldRim.position.z = -0.006;

      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.025), trimMat);
      crossV.position.set(0, 0.02, 0.032);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.025), trimMat);
      crossH.position.set(0, 0.06, 0.032);
      const crossCenter = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.055, 0),
        new THREE.MeshStandardMaterial({ color: plumeColor, metalness: 0.85 })
      );
      crossCenter.position.set(0, 0.06, 0.048);

      shieldG.add(shieldRim, shield, crossV, crossH, crossCenter);
      shieldG.position.set(-0.30, 0.38, 0.18);
      shieldG.rotation.y = 0.35;

      armL.add(shoulderL, upperArmL, elbowL, forearmL, gauntletL, shieldG);
    }

    torsoG.add(torso);
    group.add(torsoG, helmG, legL, legR, armR, armL);

    // 披风配饰
    if (monsterId === 'knight_captain') {
      const capeMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.80 });
      const cape = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.68, 0.025), capeMat);
      cape.position.set(0, 0.34, -0.16);
      cape.rotation.x = -0.12;
      group.add(cape);
    } else if (monsterId === 'white_knight') {
      const capeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.80 });
      const cape = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.68, 0.025), capeMat);
      cape.position.set(0, 0.34, -0.16);
      cape.rotation.x = -0.12;
      group.add(cape);
    }

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
    } else if (monsterId === 'giant_squid') {
      return this.createGiantSquidMesh(monsterId, _data, _color);
    } else {
      return this.createDemonLordMesh(monsterId, _data, _color);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 7.6.1 终极真魔王杰诺 (Demon Lord Zeno - 50F Final Boss)
  // 标志性特征：
  // 1. 黑曜深渊重铠与鎏金九峰魔皇王冠 (Hellcrown)
  // 2. 胸口跳动的深渊魔核晶石 (Abyssal Heart Core)
  // 3. 盘旋巨型恶魔弯角与燃火炽眸
  // 4. 右手末日狱火巨剑 (Doom Greatsword)，剑身嵌有熔岩狱火凹槽
  // 5. 背后壮阔 3D 骨架真皮质恶魔龙翼 (wing_l, wing_r)
  // -------------------------------------------------------------------------
  private static createDemonLordMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.92,
      roughness: 0.22,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
      metalness: 0.95,
      roughness: 0.22,
    });
    const demonSkinMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.55,
    });
    const demonEyeMat = new THREE.MeshStandardMaterial({
      color: 0xff2222,
      emissive: 0xff0000,
      emissiveIntensity: 2.5,
    });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff1111,
      emissive: 0xdc2626,
      emissiveIntensity: 2.2,
    });
    const hornBaseMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.40,
    });
    const hornTipMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xb91c1c,
      emissiveIntensity: 1.3,
      roughness: 0.30,
    });
    const wingBoneMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.35,
    });
    const wingMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x3f0a0a,
      emissive: 0x180303,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    const tabardMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.70,
    });
    const swordSteelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.20,
    });
    const hellfireMat = new THREE.MeshStandardMaterial({
      color: 0xff4422,
      emissive: 0xea580c,
      emissiveIntensity: 2.6,
    });
    const fangMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.30,
    });

    // 1. 下肢与利爪战靴
    const lowerBody = new THREE.Group();
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.26), armorMat);
    pelvis.position.set(0, 0.50, 0);
    const beltBuckle = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), goldTrimMat);
    beltBuckle.position.set(0, 0.52, 0.14);
    const tabard = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.03), tabardMat);
    tabard.position.set(0, 0.36, 0.13);
    tabard.rotation.x = -0.08;
    lowerBody.add(pelvis, beltBuckle, tabard);

    const createLeg = (isRight: boolean) => {
      const leg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.26, 8), armorMat);
      thigh.position.set(sign * 0.15, 0.36, 0);
      thigh.rotation.z = -sign * 0.12;

      const knee = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.12, 6), goldTrimMat);
      knee.position.set(sign * 0.18, 0.26, 0.08);
      knee.rotation.x = Math.PI / 2;

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.26, 8), armorMat);
      shin.position.set(sign * 0.18, 0.13, 0);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.24), armorMat);
      foot.position.set(sign * 0.18, 0.04, 0.04);

      for (let c = -1; c <= 1; c++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 5), fangMat);
        claw.position.set(sign * 0.18 + c * 0.045, 0.025, 0.17);
        claw.rotation.x = Math.PI / 2;
        leg.add(claw);
      }
      leg.add(thigh, knee, shin, foot);
      return leg;
    };
    lowerBody.add(createLeg(false), createLeg(true));

    // 2. 魁梧躯干与深渊魔核
    const torso = new THREE.Group();
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.42, 10), armorMat);
    chest.position.set(0, 0.76, 0);
    chest.scale.set(1.0, 1.0, 0.82);

    const pecL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.06), armorMat);
    pecL.position.set(-0.10, 0.82, 0.13);
    pecL.rotation.z = -0.06;
    const pecR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.06), armorMat);
    pecR.position.set(0.10, 0.82, 0.13);
    pecR.rotation.z = 0.06;

    const heartCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), coreMat);
    heartCore.position.set(0, 0.78, 0.15);
    const coreFrame = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.018, 8, 12), goldTrimMat);
    coreFrame.position.set(0, 0.78, 0.14);

    torso.add(chest, pecL, pecR, heartCore, coreFrame);

    const createPauldron = (isRight: boolean) => {
      const sign = isRight ? 1 : -1;
      const p = new THREE.Group();
      const base = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.65), armorMat);
      base.position.set(sign * 0.38, 0.92, 0);
      base.rotation.z = -sign * 0.4;

      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 6), hornTipMat);
      horn.position.set(sign * 0.44, 1.06, 0);
      horn.rotation.z = -sign * 0.65;
      horn.rotation.x = -0.15;
      p.add(base, horn);
      return p;
    };
    torso.add(createPauldron(false), createPauldron(true));

    // 3. 强壮双臂与狱火巨剑
    const armL = new THREE.Group();
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.28, 8), armorMat);
    upperArmL.position.set(-0.38, 0.74, 0.06);
    upperArmL.rotation.z = 0.35;
    upperArmL.rotation.x = 0.25;

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.26, 8), armorMat);
    forearmL.position.set(-0.48, 0.54, 0.18);
    forearmL.rotation.z = 0.60;
    forearmL.rotation.x = 0.70;

    const handClawL = new THREE.Group();
    const palmL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.06), demonSkinMat);
    palmL.position.set(-0.55, 0.44, 0.26);
    handClawL.add(palmL);
    for (let c = 0; c < 4; c++) {
      const talon = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.08, 5), fangMat);
      talon.position.set(-0.58 + (c - 1.5) * 0.03, 0.40, 0.29);
      talon.rotation.x = Math.PI / 2.5;
      handClawL.add(talon);
    }
    armL.add(upperArmL, forearmL, handClawL);

    const armR = new THREE.Group();
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.28, 8), armorMat);
    upperArmR.position.set(0.38, 0.74, 0.04);
    upperArmR.rotation.z = -0.25;
    upperArmR.rotation.x = 0.35;

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.26, 8), armorMat);
    forearmR.position.set(0.44, 0.56, 0.20);
    forearmR.rotation.z = -0.20;
    forearmR.rotation.x = 0.85;

    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.08), armorMat);
    handR.position.set(0.46, 0.46, 0.32);

    const sword = new THREE.Group();
    const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), goldTrimMat);
    pommel.position.set(0, -0.40, 0);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 8), new THREE.MeshStandardMaterial({ color: 0x221111 }));
    grip.position.set(0, -0.22, 0);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.10), goldTrimMat);
    guard.position.set(0, -0.04, 0);
    const guardGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), coreMat);
    guardGem.position.set(0, -0.04, 0.06);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.035), swordSteelMat);
    blade.position.set(0, 0.46, 0);
    const bladeTip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 4), swordSteelMat);
    bladeTip.position.set(0, 1.02, 0);
    bladeTip.rotation.y = Math.PI / 4;

    const hellfireCore = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.85, 0.042), hellfireMat);
    hellfireCore.position.set(0, 0.44, 0);

    sword.add(pommel, grip, guard, guardGem, blade, bladeTip, hellfireCore);
    sword.position.set(0.46, 0.46, 0.32);
    sword.rotation.x = Math.PI / 3.5;
    sword.rotation.y = -0.25;

    armR.add(upperArmR, forearmR, handR, sword);

    // 4. 恶魔之首、犄角与九峰王冠
    const headG = new THREE.Group();
    const headBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), demonSkinMat);
    headBase.position.set(0, 1.08, 0.04);

    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.16), armorMat);
    jaw.position.set(0, 0.99, 0.11);

    for (let f = -1; f <= 1; f += 2) {
      const fang = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.07, 4), fangMat);
      fang.position.set(f * 0.07, 1.04, 0.18);
      fang.rotation.x = Math.PI;
      headG.add(fang);
    }

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.02, 0.02), demonEyeMat);
    eyeL.position.set(-0.065, 1.10, 0.16);
    eyeL.rotation.z = -0.25;
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.02, 0.02), demonEyeMat);
    eyeR.position.set(0.065, 1.10, 0.16);
    eyeR.rotation.z = 0.25;

    const crown = new THREE.Group();
    const crownBand = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.05, 0.27), goldTrimMat);
    crownBand.position.set(0, 1.20, 0.04);
    crown.add(crownBand);
    const spirePositions = [-0.11, -0.055, 0, 0.055, 0.11];
    spirePositions.forEach((spX, idx) => {
      const h = idx === 2 ? 0.14 : (idx === 1 || idx === 3 ? 0.11 : 0.08);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.022, h, 4), goldTrimMat);
      spire.position.set(spX, 1.22 + h / 2, 0.17);
      spire.rotation.y = Math.PI / 4;
      crown.add(spire);
    });

    const createCurvedHorn = (isRight: boolean) => {
      const sign = isRight ? 1 : -1;
      const hornG = new THREE.Group();
      const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.20, 8), hornBaseMat);
      seg1.position.set(sign * 0.16, 1.18, -0.02);
      seg1.rotation.z = -sign * 0.75;
      seg1.rotation.x = -0.35;

      const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.24, 8), hornBaseMat);
      seg2.position.set(sign * 0.28, 1.30, -0.06);
      seg2.rotation.z = -sign * 0.35;
      seg2.rotation.x = -0.15;

      const seg3 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.30, 8), hornTipMat);
      seg3.position.set(sign * 0.33, 1.50, -0.04);
      seg3.rotation.z = sign * 0.15;
      seg3.rotation.x = 0.20;

      hornG.add(seg1, seg2, seg3);
      return hornG;
    };

    headG.add(headBase, jaw, eyeL, eyeR, crown, createCurvedHorn(false), createCurvedHorn(true));

    // 5. 3D 骨架龙翼/恶魔之翼 (wing_l, wing_r)
    const createDemonWing = (isRight: boolean) => {
      const sign = isRight ? 1 : -1;
      const wing = new THREE.Group();
      wing.name = isRight ? 'wing_r' : 'wing_l';

      const mainStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.50, 6), wingBoneMat);
      mainStrut.position.set(sign * 0.26, 0.95, -0.22);
      mainStrut.rotation.z = -sign * 0.85;
      mainStrut.rotation.y = sign * 0.35;

      const talon = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 5), fangMat);
      talon.position.set(sign * 0.48, 1.15, -0.32);
      talon.rotation.z = sign * 0.25;

      const spar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.65, 5), wingBoneMat);
      spar1.position.set(sign * 0.72, 0.92, -0.38);
      spar1.rotation.z = -sign * 0.55;

      const spar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.03, 0.60, 5), wingBoneMat);
      spar2.position.set(sign * 0.66, 0.70, -0.32);
      spar2.rotation.z = -sign * 0.25;

      const spar3 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.52, 5), wingBoneMat);
      spar3.position.set(sign * 0.52, 0.55, -0.26);
      spar3.rotation.z = sign * 0.15;

      const membraneGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        sign * 0.48, 0.35, -0.15,
        sign * 0.85, 0.15, -0.22,

        0, 0, 0,
        sign * 0.85, 0.15, -0.22,
        sign * 0.78, -0.25, -0.16,

        0, 0, 0,
        sign * 0.78, -0.25, -0.16,
        sign * 0.55, -0.45, -0.10,
      ]);
      membraneGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      membraneGeo.computeVertexNormals();
      const membraneMesh = new THREE.Mesh(membraneGeo, wingMembraneMat);
      membraneMesh.position.set(sign * 0.12, 0.80, -0.18);

      wing.add(mainStrut, talon, spar1, spar2, spar3, membraneMesh);
      return wing;
    };

    group.add(lowerBody, torso, armL, armR, headG, createDemonWing(false), createDemonWing(true));
    group.scale.set(2.45, 2.45, 2.45);
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.6.2 远古魔龙 (Ancient Dragon - 35F Boss)
  // -------------------------------------------------------------------------
  private static createDragonMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const scalesMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      emissive: 0x450a0a,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.20,
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.50,
      metalness: 0.15,
    });
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.35,
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.35,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xea580c,
      emissiveIntensity: 2.2,
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.3,
    });
    const wingBoneMat = new THREE.MeshStandardMaterial({
      color: 0x450a0a,
      roughness: 0.40,
    });
    const wingMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });

    // 1. 龙躯干与腹部
    const torsoG = new THREE.Group();
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.65, 10), scalesMat);
    chest.position.set(0, 0.70, 0);
    chest.rotation.x = 0.40;

    for (let i = 0; i < 5; i++) {
      const bPlate = new THREE.Mesh(new THREE.BoxGeometry(0.28 - i * 0.02, 0.09, 0.04), bellyMat);
      bPlate.position.set(0, 0.54 + i * 0.09, 0.20 - i * 0.04);
      bPlate.rotation.x = 0.40;
      torsoG.add(bPlate);
    }

    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), scalesMat);
    pelvis.position.set(0, 0.56, -0.28);
    torsoG.add(chest, pelvis);

    // 2. 颈部
    const neckG = new THREE.Group();
    const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.24, 0.22, 8), scalesMat);
    seg1.position.set(0, 0.88, 0.16);
    seg1.rotation.x = -0.30;

    const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.20, 0.22, 8), scalesMat);
    seg2.position.set(0, 1.05, 0.26);
    seg2.rotation.x = -0.15;

    const seg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.22, 8), scalesMat);
    seg3.position.set(0, 1.22, 0.32);
    seg3.rotation.x = 0.10;

    const seg4 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.18, 8), scalesMat);
    seg4.position.set(0, 1.34, 0.36);
    seg4.rotation.x = 0.32;

    for (let i = 0; i < 4; i++) {
      const spine = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 4), spineMat);
      spine.position.set(0, 0.90 + i * 0.14, 0.12 + i * 0.06);
      spine.rotation.x = -0.6;
      neckG.add(spine);
    }
    neckG.add(seg1, seg2, seg3, seg4);

    // 3. 龙首与獠牙
    const headG = new THREE.Group();
    headG.position.set(0, 1.45, 0.44);

    const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.22), scalesMat);
    cranium.position.set(0, 0, 0);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.28), scalesMat);
    snout.position.set(0, -0.02, 0.20);

    const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), hornMat);
    nostrilL.position.set(-0.06, 0.04, 0.31);
    const nostrilR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), hornMat);
    nostrilR.position.set(0.06, 0.04, 0.31);

    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.26), scalesMat);
    jaw.position.set(0, -0.14, 0.16);
    jaw.rotation.x = 0.35;

    for (let t = -2; t <= 2; t++) {
      const upperTooth = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.06, 4), boneMat);
      upperTooth.position.set(t * 0.035, -0.08, 0.12 + Math.abs(t) * 0.02);
      upperTooth.rotation.x = Math.PI;

      const lowerTooth = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.06, 4), boneMat);
      lowerTooth.position.set(t * 0.03, -0.10, 0.16 + Math.abs(t) * 0.02);
      headG.add(upperTooth, lowerTooth);
    }

    const createEye = (isRight: boolean) => {
      const eg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
      const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.045, 0.038), pupilMat);
      pupil.position.z = 0.018;
      eg.add(eyeBall, pupil);
      eg.position.set(sign * 0.11, 0.05, 0.06);
      eg.rotation.y = sign * 0.4;
      return eg;
    };

    const createHorn = (isRight: boolean) => {
      const hg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      const hornBase = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.22, 8), hornMat);
      hornBase.position.set(sign * 0.10, 0.12, -0.06);
      hornBase.rotation.x = -0.75;
      hornBase.rotation.z = -sign * 0.35;

      const hornTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.32, 8), hornMat);
      hornTip.position.set(sign * 0.15, 0.26, -0.22);
      hornTip.rotation.x = -1.10;
      hornTip.rotation.z = -sign * 0.20;

      hg.add(hornBase, hornTip);
      return hg;
    };

    headG.add(cranium, snout, nostrilL, nostrilR, jaw, createEye(false), createEye(true), createHorn(false), createHorn(true));

    // 4. 后肢与利爪
    const hindLegsG = new THREE.Group();
    const createHindLeg = (isRight: boolean) => {
      const lg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.34, 8), scalesMat);
      thigh.position.set(sign * 0.28, 0.46, -0.22);
      thigh.rotation.z = -sign * 0.25;
      thigh.rotation.x = 0.20;

      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), scalesMat);
      knee.position.set(sign * 0.32, 0.30, -0.15);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.08, 0.28, 8), scalesMat);
      shin.position.set(sign * 0.32, 0.16, -0.18);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.22), scalesMat);
      foot.position.set(sign * 0.32, 0.04, -0.10);

      for (let c = -1; c <= 1; c++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.11, 5), boneMat);
        claw.position.set(sign * 0.32 + c * 0.05, 0.03, 0.02);
        claw.rotation.x = Math.PI / 2.2;
        lg.add(claw);
      }
      const dewclaw = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.08, 5), boneMat);
      dewclaw.position.set(sign * 0.32, 0.04, -0.22);
      dewclaw.rotation.x = -Math.PI / 2.2;
      lg.add(thigh, knee, shin, foot, dewclaw);
      return lg;
    };
    hindLegsG.add(createHindLeg(false), createHindLeg(true));

    // 5. 前肢龙臂
    const forearmsG = new THREE.Group();
    const createForearm = (isRight: boolean) => {
      const fg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.24, 8), scalesMat);
      bicep.position.set(sign * 0.28, 0.66, 0.10);
      bicep.rotation.z = -sign * 0.35;
      bicep.rotation.x = 0.45;

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.22, 8), scalesMat);
      forearm.position.set(sign * 0.32, 0.48, 0.24);
      forearm.rotation.x = 0.85;

      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.10), scalesMat);
      hand.position.set(sign * 0.32, 0.38, 0.32);

      for (let c = -1; c <= 1; c++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.09, 5), boneMat);
        claw.position.set(sign * 0.32 + c * 0.035, 0.36, 0.38);
        claw.rotation.x = Math.PI / 2;
        fg.add(claw);
      }
      fg.add(bicep, forearm, hand);
      return fg;
    };
    forearmsG.add(createForearm(false), createForearm(true));

    // 6. 3D 魔龙之翼 (wing_l, wing_r)
    const createWing = (isRight: boolean) => {
      const wg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      wg.name = isRight ? 'wing_r' : 'wing_l';

      const bone1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.55, 8), wingBoneMat);
      bone1.position.set(sign * 0.24, 0.95, -0.12);
      bone1.rotation.z = -sign * 0.95;
      bone1.rotation.y = sign * 0.30;

      const wristClaw = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 5), boneMat);
      wristClaw.position.set(sign * 0.52, 1.18, -0.22);
      wristClaw.rotation.z = sign * 0.25;

      const spar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.035, 0.70, 6), wingBoneMat);
      spar1.position.set(sign * 0.78, 0.96, -0.30);
      spar1.rotation.z = -sign * 0.60;

      const spar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.030, 0.65, 6), wingBoneMat);
      spar2.position.set(sign * 0.72, 0.72, -0.25);
      spar2.rotation.z = -sign * 0.30;

      const spar3 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.026, 0.58, 6), wingBoneMat);
      spar3.position.set(sign * 0.56, 0.56, -0.20);
      spar3.rotation.z = sign * 0.10;

      const membraneGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        sign * 0.52, 0.35, -0.12,
        sign * 0.92, 0.12, -0.20,

        0, 0, 0,
        sign * 0.92, 0.12, -0.20,
        sign * 0.82, -0.26, -0.14,

        0, 0, 0,
        sign * 0.82, -0.26, -0.14,
        sign * 0.58, -0.48, -0.08,
      ]);
      membraneGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      membraneGeo.computeVertexNormals();
      const membrane = new THREE.Mesh(membraneGeo, wingMembraneMat);
      membrane.position.set(sign * 0.10, 0.82, -0.10);

      wg.add(bone1, wristClaw, spar1, spar2, spar3, membrane);
      return wg;
    };

    // 7. 蜿蜒破阵龙尾
    const tailG = new THREE.Group();
    const tailPts = [
      { y: 0.52, z: -0.45, r: 0.14 },
      { y: 0.44, z: -0.65, r: 0.11 },
      { y: 0.38, z: -0.84, r: 0.08 },
      { y: 0.40, z: -1.02, r: 0.05 },
    ];
    tailPts.forEach((pt) => {
      const seg = new THREE.Mesh(new THREE.SphereGeometry(pt.r, 8, 8), scalesMat);
      seg.position.set(0, pt.y, pt.z);
      const spine = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 4), spineMat);
      spine.position.set(0, pt.y + pt.r + 0.04, pt.z);
      spine.rotation.x = -0.5;
      tailG.add(seg, spine);
    });
    const tailBlade = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.24, 4), spineMat);
    tailBlade.position.set(0, 0.44, -1.14);
    tailBlade.rotation.x = -Math.PI / 2;
    tailG.add(tailBlade);

    group.add(torsoG, neckG, headG, hindLegsG, forearmsG, createWing(false), createWing(true), tailG);
    group.scale.set(2.2, 2.2, 2.2);
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.6.3 帝国大法师 (Archmage - 25F Boss)
  // -------------------------------------------------------------------------
  private static createArchmageMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const robeMat = new THREE.MeshStandardMaterial({
      color: 0x831843,
      roughness: 0.60,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.18,
    });
    const sashMat = new THREE.MeshStandardMaterial({
      color: 0x581c87,
      roughness: 0.50,
    });
    const beardMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.40,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.55,
    });
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.8,
      metalness: 0.9,
    });
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const staffWoodMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.70,
    });

    // 1. 法袍躯干
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.42, 0.95, 16), robeMat);
    robe.position.set(0, 0.48, 0);

    const stoleL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.03), sashMat);
    stoleL.position.set(-0.11, 0.52, 0.22);
    const stoleR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.03), sashMat);
    stoleR.position.set(0.11, 0.52, 0.22);

    const goldBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.27, 0.07, 16), goldMat);
    goldBelt.position.set(0, 0.52, 0);

    // 2. 头部、长髯仙须与高耸礼冠
    const headG = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), skinMat);
    head.position.set(0, 1.05, 0);

    const beardTop = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.36, 10), beardMat);
    beardTop.position.set(0, 0.84, 0.12);
    beardTop.rotation.x = -0.22;
    const beardTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 8), beardMat);
    beardTip.position.set(0, 0.65, 0.17);
    beardTip.rotation.x = -0.15;

    const eyebrowL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.03), beardMat);
    eyebrowL.position.set(-0.06, 1.10, 0.14);
    const eyebrowR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.03), beardMat);
    eyebrowR.position.set(0.06, 1.10, 0.14);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    eyeL.position.set(-0.05, 1.06, 0.14);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    eyeR.position.set(0.05, 1.06, 0.14);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.28, 12), robeMat);
    crown.position.set(0, 1.24, 0);
    const crownTop = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.24, 4), goldMat);
    crownTop.position.set(0, 1.48, 0);

    headG.add(head, beardTop, beardTip, eyebrowL, eyebrowR, eyeL, eyeR, crown, crownTop);

    // 3. 金色日曜光轮 (8 Sunbeams)
    const haloG = new THREE.Group();
    const haloRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.022, 12, 32), haloMat);
    haloG.add(haloRing);
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4;
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.16, 4), goldMat);
      ray.position.set(Math.cos(ang) * 0.44, Math.sin(ang) * 0.44, 0);
      ray.rotation.z = ang - Math.PI / 2;
      haloG.add(ray);
    }
    haloG.position.set(0, 1.05, -0.16);

    // 4. 右臂与双蛇浑天仪权杖
    const armR = new THREE.Group();
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.38, 10), robeMat);
    sleeveR.position.set(0.28, 0.72, 0.10);
    sleeveR.rotation.z = -0.35;
    sleeveR.rotation.x = 0.35;

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
    handR.position.set(0.34, 0.54, 0.24);

    const staffG = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.55, 8), staffWoodMat);
    shaft.position.y = 0.40;

    const goldTip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), goldMat);
    goldTip.position.y = -0.38;
    goldTip.rotation.x = Math.PI;

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 24), goldMat);
    ring1.position.y = 1.18;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.014, 8, 24), goldMat);
    ring2.position.y = 1.18;
    ring2.rotation.x = Math.PI / 2;

    const starGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), crystalMat);
    starGem.position.y = 1.18;

    staffG.add(shaft, goldTip, ring1, ring2, starGem);
    staffG.position.set(0.34, 0.54, 0.24);
    staffG.rotation.x = 0.15;
    armR.add(sleeveR, handR, staffG);

    // 5. 左臂与悬浮奥术火球
    const armL = new THREE.Group();
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.38, 10), robeMat);
    sleeveL.position.set(-0.28, 0.72, 0.10);
    sleeveL.rotation.z = 0.35;
    sleeveL.rotation.x = 0.45;

    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
    handL.position.set(-0.34, 0.56, 0.26);

    const fireOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xdc2626, emissiveIntensity: 2.2 })
    );
    fireOrb.position.set(-0.34, 0.70, 0.28);
    armL.add(sleeveL, handL, fireOrb);

    // 6. 背后披风
    const cape = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.88, 0.03), sashMat);
    cape.position.set(0, 0.52, -0.22);
    cape.rotation.x = -0.10;

    group.add(robe, stoleL, stoleR, goldBelt, headG, haloG, armR, armL, cape);
    group.scale.set(1.55, 1.55, 1.55);
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.6.4 冥界统帅：冥队长 (Ghost Commander - 40F Boss)
  // -------------------------------------------------------------------------
  private static createGhostCommanderMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const netherSteelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.94,
      roughness: 0.22,
    });
    const soulGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.6,
    });
    const shroudMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      transparent: true,
      opacity: 0.85,
      roughness: 0.70,
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.40,
    });
    const scytheBladeMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.5,
      transmission: 0.65,
      transparent: true,
      opacity: 0.90,
      roughness: 0.10,
    });

    // 1. 冥铁重铠躯干
    const torsoG = new THREE.Group();
    const breastplate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.30), netherSteelMat);
    breastplate.position.set(0, 0.52, 0);

    const soulRune = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), soulGlowMat);
    soulRune.position.set(0, 0.56, 0.16);

    const fauld = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.16, 8), netherSteelMat);
    fauld.position.set(0, 0.26, 0);
    torsoG.add(breastplate, soulRune, fauld);

    // 2. 冥骨犄角头盔与魂火之眸
    const headG = new THREE.Group();
    const skullHelm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.28, 12), netherSteelMat);
    skullHelm.position.set(0, 0.92, 0);

    const skullFace = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.18, 0.16), boneMat);
    skullFace.position.set(0, 0.88, 0.08);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), soulGlowMat);
    eyeL.position.set(-0.06, 0.92, 0.16);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), soulGlowMat);
    eyeR.position.set(0.06, 0.92, 0.16);

    const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), boneMat);
    teeth.position.set(0, 0.82, 0.16);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.28, 6), netherSteelMat);
    hornL.position.set(-0.18, 1.08, -0.02);
    hornL.rotation.z = 0.65;
    hornL.rotation.x = -0.25;

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.28, 6), netherSteelMat);
    hornR.position.set(0.18, 1.08, -0.02);
    hornR.rotation.z = -0.65;
    hornR.rotation.x = -0.25;

    headG.add(skullHelm, skullFace, eyeL, eyeR, teeth, hornL, hornR);

    // 3. 双腿重铠
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.28, 8), netherSteelMat);
    legL.position.set(-0.12, 0.14, 0);
    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.28, 8), netherSteelMat);
    legR.position.set(0.12, 0.14, 0);

    // 4. 右臂与幽冥摄魂战镰
    const armR = new THREE.Group();
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), netherSteelMat);
    shoulderR.position.set(0.28, 0.68, 0);
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.24, 8), netherSteelMat);
    upperArmR.position.set(0.28, 0.52, 0.03);
    upperArmR.rotation.z = -0.25;
    upperArmR.rotation.x = 0.30;
    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.22, 8), netherSteelMat);
    forearmR.position.set(0.32, 0.36, 0.16);
    forearmR.rotation.x = 0.65;
    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), netherSteelMat);
    handR.position.set(0.32, 0.28, 0.24);

    const scytheG = new THREE.Group();
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.65, 8), netherSteelMat);
    haft.position.y = 0.40;

    const topSpike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.18, 4), soulGlowMat);
    topSpike.position.y = 1.25;

    const scytheBlade = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.025), scytheBladeMat);
    scytheBlade.position.set(0.24, 1.15, 0);
    scytheBlade.rotation.z = -0.35;

    scytheG.add(haft, topSpike, scytheBlade);
    scytheG.position.set(0.32, 0.28, 0.24);
    scytheG.rotation.x = 0.25;
    armR.add(shoulderR, upperArmR, forearmR, handR, scytheG);

    // 5. 左臂与噬魂哀嚎战盾
    const armL = new THREE.Group();
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), netherSteelMat);
    shoulderL.position.set(-0.28, 0.68, 0);
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.24, 8), netherSteelMat);
    upperArmL.position.set(-0.28, 0.52, 0.03);
    upperArmL.rotation.z = 0.25;
    upperArmL.rotation.x = 0.30;
    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.22, 8), netherSteelMat);
    forearmL.position.set(-0.32, 0.36, 0.16);
    forearmL.rotation.x = 0.65;
    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), netherSteelMat);
    handL.position.set(-0.32, 0.28, 0.24);

    const shieldG = new THREE.Group();
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.62, 0.05), netherSteelMat);
    const ghostFace = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), boneMat);
    ghostFace.position.set(0, 0.05, 0.03);
    const ghostEyeL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), soulGlowMat);
    ghostEyeL.position.set(-0.04, 0.08, 0.12);
    const ghostEyeR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), soulGlowMat);
    ghostEyeR.position.set(0.04, 0.08, 0.12);
    const ghostMouth = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.06, 8), soulGlowMat);
    ghostMouth.position.set(0, -0.01, 0.12);

    shieldG.add(shieldPlate, ghostFace, ghostEyeL, ghostEyeR, ghostMouth);
    shieldG.position.set(-0.34, 0.42, 0.22);
    shieldG.rotation.y = 0.35;
    armL.add(shoulderL, upperArmL, forearmL, handL, shieldG);

    // 6. 巡游幽冥鬼火
    for (let w = 0; w < 3; w++) {
      const ang = (w * Math.PI * 2) / 3;
      const wisp = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), soulGlowMat);
      wisp.position.set(Math.cos(ang) * 0.45, 0.85 + w * 0.12, Math.sin(ang) * 0.45);
      group.add(wisp);
    }

    // 7. 残破幽冥披风
    const cape = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.75, 0.025), shroudMat);
    cape.position.set(0, 0.40, -0.18);
    cape.rotation.x = -0.12;

    group.add(torsoG, headG, legL, legR, armR, armL, cape);
    group.scale.set(1.85, 1.85, 1.85);
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.6.5 假面魔王：假魔王 (False Sorcerer - 49F Boss)
  // -------------------------------------------------------------------------
  private static createFalseSorcererMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    const robeMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.70,
    });
    const crimsonTrimMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.50,
    });
    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.05,
    });
    const maskPaintMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
    });
    const voidEyeMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 2.5,
    });
    const accretionMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 2.6,
      roughness: 0.2,
    });
    const voidOrbMat = new THREE.MeshBasicMaterial({
      color: 0x050505,
    });
    const shadowWingMat = new THREE.MeshStandardMaterial({
      color: 0x4c0519,
      emissive: 0x2e0854,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      roughness: 0.5,
    });

    // 1. 虚空法袍身躯
    const torsoG = new THREE.Group();
    const robeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.44, 0.96, 14), robeMat);
    robeBody.position.set(0, 0.48, 0);

    const crimsonStripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.96, 0.02), crimsonTrimMat);
    crimsonStripe.position.set(0, 0.48, 0.24);
    torsoG.add(robeBody, crimsonStripe);

    // 2. 兜帽与标志性假面
    const headG = new THREE.Group();
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), robeMat);
    hood.position.set(0, 1.05, -0.02);
    hood.scale.set(1.05, 1.15, 1.1);

    const maskPlate = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12, 0, Math.PI, 0, Math.PI), porcelainMat);
    maskPlate.position.set(0, 1.05, 0.05);
    maskPlate.rotation.y = -Math.PI / 2;

    const smileL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.02), maskPaintMat);
    smileL.position.set(-0.035, 0.98, 0.16);
    smileL.rotation.z = -0.35;
    const smileR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.02), maskPaintMat);
    smileR.position.set(0.035, 0.98, 0.16);
    smileR.rotation.z = 0.35;

    const tearL = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.02), maskPaintMat);
    tearL.position.set(-0.05, 1.02, 0.16);
    const tearR = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.02), maskPaintMat);
    tearR.position.set(0.05, 1.02, 0.16);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.02), voidEyeMat);
    eyeL.position.set(-0.05, 1.07, 0.15);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.02), voidEyeMat);
    eyeR.position.set(0.05, 1.07, 0.15);

    headG.add(hood, maskPlate, smileL, smileR, tearL, tearR, eyeL, eyeR);

    // 3. 背后四翼半透明虚影幻翼 (wing_l, wing_r)
    const createShadowWings = (isRight: boolean) => {
      const wg = new THREE.Group();
      const sign = isRight ? 1 : -1;
      wg.name = isRight ? 'wing_r' : 'wing_l';

      const wingTop = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.65, 4), shadowWingMat);
      wingTop.position.set(sign * 0.35, 0.95, -0.15);
      wingTop.rotation.z = -sign * 0.75;
      wingTop.rotation.x = -0.25;

      const wingBottom = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.50, 4), shadowWingMat);
      wingBottom.position.set(sign * 0.32, 0.65, -0.15);
      wingBottom.rotation.z = -sign * 1.15;
      wingBottom.rotation.x = 0.15;

      wg.add(wingTop, wingBottom);
      return wg;
    };

    // 4. 右臂与虚空日蚀权杖
    const armR = new THREE.Group();
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.36, 10), robeMat);
    sleeveR.position.set(0.28, 0.68, 0.08);
    sleeveR.rotation.z = -0.35;
    sleeveR.rotation.x = 0.35;

    const staffG = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.55, 8),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
    );
    shaft.position.y = 0.40;

    const crescent = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.02, 8, 24, Math.PI * 1.5),
      crimsonTrimMat
    );
    crescent.position.y = 1.18;

    const voidSphere = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), voidOrbMat);
    voidSphere.position.y = 1.18;

    const accretionRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.015, 8, 24), accretionMat);
    accretionRing1.position.y = 1.18;
    accretionRing1.rotation.x = Math.PI / 3;

    const accretionRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 24), accretionMat);
    accretionRing2.position.y = 1.18;
    accretionRing2.rotation.y = Math.PI / 3;

    staffG.add(shaft, crescent, voidSphere, accretionRing1, accretionRing2);
    staffG.position.set(0.34, 0.52, 0.22);
    staffG.rotation.x = 0.18;
    armR.add(sleeveR, staffG);

    // 5. 左臂与浮空咒印
    const armL = new THREE.Group();
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.36, 10), robeMat);
    sleeveL.position.set(-0.28, 0.68, 0.08);
    sleeveL.rotation.z = 0.35;
    sleeveL.rotation.x = 0.45;

    for (let r = 0; r < 3; r++) {
      const rune = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.01), accretionMat);
      rune.position.set(-0.35 + (r - 1) * 0.05, 0.65 + r * 0.06, 0.26);
      rune.rotation.y = 0.25 * r;
      armL.add(rune);
    }
    armL.add(sleeveL);

    group.add(torsoG, headG, createShadowWings(false), createShadowWings(true), armR, armL);
    group.scale.set(1.85, 1.85, 1.85);
    return group;
  }

  // -------------------------------------------------------------------------
  // 7.7 深渊巨兽系列：大乌贼 (Red Colossal Giant Squid / Kraken - 鲜红巨型海怪)
  // -------------------------------------------------------------------------
  private static createGiantSquidMesh(monsterId: string, _data: any, _color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    group.name = `monster_${monsterId}`;

    // 1. 经典鲜红深海软体巨兽材质库 (Vibrant Crimson Red Cephalopod Shading)
    // 胴体外皮：鲜亮深红/赤红晶莹水润皮肤
    const squidSkinMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444, // 鲜亮赤红 (Vivid Scarlet/Crimson)
      emissive: 0x991b1b, // 深血红内蕴柔光
      emissiveIntensity: 0.28,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
    });

    // 腹部/内侧柔嫩肉质：浅珊瑚粉红
    const underbellyMat = new THREE.MeshStandardMaterial({
      color: 0xfca5a5,
      roughness: 0.32,
      metalness: 0.02,
    });

    // 游动侧鳍：柔韧赤红肉翼
    const finMat = new THREE.MeshPhysicalMaterial({
      color: 0xdc2626,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.25,
      roughness: 0.22,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
    });

    // 经典乌贼/章鱼吸盘：珠光暖白/象牙吸盘环与深红吸孔
    const suckerMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5, // 暖白象牙吸盘肉圈
      roughness: 0.35,
    });
    const suckerPitMat = new THREE.MeshBasicMaterial({
      color: 0x881337, // 暗红吸盘深孔
    });

    // 鲜明灵动双眼：大眼白 + 漆黑眼瞳 + 灵光高光点
    const eyeScleraMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });
    const pupilMat = new THREE.MeshBasicMaterial({
      color: 0x09090b,
    });
    const glintMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const corneaMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      transparent: true,
      opacity: 0.9,
      roughness: 0.04,
      ior: 1.33,
    });

    // 标志性喷水漏斗嘴管 (Siphon Funnel & Mouth)
    const mouthRimMat = new THREE.MeshStandardMaterial({
      color: 0xf87171,
      roughness: 0.25,
    });
    const mouthHoleMat = new THREE.MeshBasicMaterial({
      color: 0x450a0a,
    });

    // 体表黄金微光魔斑 (Golden Bioluminescent Photophore Dots)
    const bioSpotMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    // 地面深海潮汐暗圈 (Floor Abyssal Puddle across 3 tiles)
    const abyssalPoolMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x450a0a,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      transparent: true,
      opacity: 0.65,
    });

    // 2. 连续平滑骨骼管道触手生成器 (Continuous Smooth Tapered Tentacle Builder)
    // 利用 CatmullRomCurve3 样条曲线与重叠球关节、圆锥台，实现完全连续、无破损缝隙、自然渐细的纯天然软体腕足
    const createSmoothTentacle = (
      points: THREE.Vector3[],
      rStart: number,
      rEnd: number,
      segments: number = 8,
      hasSuckers: boolean = true
    ): THREE.Group => {
      const armGroup = new THREE.Group();
      const curve = new THREE.CatmullRomCurve3(points);
      const sampledPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        sampledPoints.push(curve.getPointAt(i / segments));
      }

      for (let i = 0; i < segments; i++) {
        const p1 = sampledPoints[i];
        const p2 = sampledPoints[i + 1];
        const t1 = i / segments;
        const t2 = (i + 1) / segments;
        const r1 = rStart * (1 - t1) + rEnd * t1;
        const r2 = rStart * (1 - t2) + rEnd * t2;

        const segVec = new THREE.Vector3().subVectors(p2, p1);
        const segLen = segVec.length();
        if (segLen < 0.001) continue;

        // 骨节圆台
        const cylGeo = new THREE.CylinderGeometry(r2, r1, segLen, 10);
        const cylMesh = new THREE.Mesh(cylGeo, squidSkinMat);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        cylMesh.position.copy(mid);

        const up = new THREE.Vector3(0, 1, 0);
        const dir = segVec.clone().normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        cylMesh.quaternion.copy(quat);
        armGroup.add(cylMesh);

        // 骨节连接球 (完全消除段落错缝与悬空，使关节天衣无缝)
        const ballGeo = new THREE.SphereGeometry(r1 * 1.02, 10, 8);
        const ballMesh = new THREE.Mesh(ballGeo, squidSkinMat);
        ballMesh.position.copy(p1);
        armGroup.add(ballMesh);

        // 末端尖梢圆球封顶
        if (i === segments - 1) {
          const tipGeo = new THREE.SphereGeometry(r2 * 1.02, 8, 6);
          const tipMesh = new THREE.Mesh(tipGeo, squidSkinMat);
          tipMesh.position.copy(p2);
          armGroup.add(tipMesh);
        }

        // 吸盘紧密吸附在内侧/腹侧
        if (hasSuckers && i > 0 && i < segments) {
          let sDir = new THREE.Vector3(0, -1, 0).cross(dir).cross(dir).normalize();
          if (sDir.lengthSq() < 0.1) sDir.set(0, -1, 0);

          const rMid = (r1 + r2) * 0.5;
          const sG = new THREE.Group();
          const suckerRadius = rMid * 0.44;
          const cup = new THREE.Mesh(
            new THREE.SphereGeometry(suckerRadius, 6, 6, 0, Math.PI * 2, 0, Math.PI * 0.55),
            suckerMat
          );
          const pit = new THREE.Mesh(
            new THREE.CircleGeometry(suckerRadius * 0.55, 6),
            suckerPitMat
          );
          pit.position.y = suckerRadius * 0.58;
          pit.rotation.x = -Math.PI / 2;
          sG.add(cup, pit);
          sG.position.copy(mid).add(sDir.clone().multiplyScalar(rMid * 0.92));
          sG.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sDir);
          armGroup.add(sG);
        }
      }
      return armGroup;
    };

    // 3. 地面横跨 3 格的暗涌水潭 (Floor Abyssal Puddle across 3 tiles)
    const poolG = new THREE.Group();
    poolG.name = 'squid_ink_pool';
    const poolMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.45, 1.48, 0.01, 32),
      abyssalPoolMat
    );
    poolMesh.scale.set(1.0, 1.0, 0.35);
    poolMesh.position.set(0, 0.005, 0.02);
    poolG.add(poolMesh);
    group.add(poolG);

    // 4. 饱满圆润的红色大乌贼/巨型章鱼头部与胴体 (Plump Crimson Mantle Dome)
    const mantleG = new THREE.Group();
    mantleG.name = 'squid_mantle';

    // 标志性饱满圆浑的巨型头部圆顶 (高度 1.38, 丰盈饱满)
    const mantlePts: THREE.Vector2[] = [
      new THREE.Vector2(0, 1.38),
      new THREE.Vector2(0.08, 1.35),
      new THREE.Vector2(0.20, 1.25),
      new THREE.Vector2(0.32, 1.10),
      new THREE.Vector2(0.42, 0.90),
      new THREE.Vector2(0.46, 0.68),
      new THREE.Vector2(0.44, 0.48),
      new THREE.Vector2(0.38, 0.32),
      new THREE.Vector2(0.25, 0.22),
      new THREE.Vector2(0.0, 0.22),
    ];
    const mantleGeo = new THREE.LatheGeometry(mantlePts, 24);
    const mantleMesh = new THREE.Mesh(mantleGeo, squidSkinMat);
    mantleG.add(mantleMesh);

    // 腹侧柔和珊瑚粉亮色垫
    const bellyPts: THREE.Vector2[] = [
      new THREE.Vector2(0, 1.18),
      new THREE.Vector2(0.12, 1.00),
      new THREE.Vector2(0.24, 0.80),
      new THREE.Vector2(0.28, 0.60),
      new THREE.Vector2(0.24, 0.42),
      new THREE.Vector2(0, 0.28),
    ];
    const bellyGeo = new THREE.LatheGeometry(bellyPts, 18, 0, Math.PI * 0.75);
    const bellyMesh = new THREE.Mesh(bellyGeo, underbellyMat);
    bellyMesh.position.set(0, 0, 0.16);
    bellyMesh.rotation.y = -Math.PI * 0.375;
    mantleG.add(bellyMesh);

    // 头部两侧优雅圆润的游动肉鳍 (Curved Natural Swimming Fins)
    const createFin = (isRight: boolean) => {
      const sign = isRight ? 1 : -1;
      const finGroup = new THREE.Group();
      finGroup.name = isRight ? 'squid_fin_r' : 'squid_fin_l';

      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.quadraticCurveTo(0.36, 0.04, 0.44, -0.16);
      finShape.quadraticCurveTo(0.36, -0.36, 0.18, -0.42);
      finShape.quadraticCurveTo(0.04, -0.36, 0, -0.28);
      finShape.closePath();

      const finGeo = new THREE.ExtrudeGeometry(finShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      });
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.position.set(sign * 0.20, 1.25, 0.0);
      finMesh.scale.x = sign;
      finMesh.rotation.y = sign * 0.10;
      finGroup.add(finMesh);
      return finGroup;
    };
    mantleG.add(createFin(false), createFin(true));

    // 背侧黄金星光斑纹
    const spotCoords = [
      [0, 1.26, -0.22],
      [-0.14, 1.10, -0.30],
      [0.14, 1.10, -0.30],
      [-0.20, 0.90, -0.35],
      [0.20, 0.90, -0.35],
      [0, 0.94, -0.40],
      [-0.18, 0.72, -0.38],
      [0.18, 0.72, -0.38],
      [0, 0.74, -0.42],
    ];
    spotCoords.forEach(([sx, sy, sz]) => {
      const spot = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 6), bioSpotMat);
      spot.position.set(sx, sy, sz);
      spot.scale.set(1.2, 0.6, 0.6);
      mantleG.add(spot);
    });

    // 5. 乌贼面部与生动双眼 (Expressive Head, Eyes & Siphon Mouth)
    const headG = new THREE.Group();
    headG.name = 'squid_head';

    // 标志性两只大眼睛 (特大高反差双目，神气活现极具辨识度)
    const createEye = (isRight: boolean) => {
      const sign = isRight ? 1 : -1;
      const eyeG = new THREE.Group();

      // 眼眶鼓包
      const socket = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 14, 12),
        squidSkinMat
      );
      socket.position.set(sign * 0.24, 0.50, 0.30);
      socket.scale.set(1.1, 1.0, 1.2);

      // 大眼白
      const eyeball = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 16),
        eyeScleraMat
      );
      eyeball.position.set(sign * 0.25, 0.50, 0.35);

      // 炯炯有神的漆黑大瞳孔
      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 12, 12),
        pupilMat
      );
      pupil.position.set(sign * 0.26, 0.50, 0.43);
      pupil.scale.set(1.0, 1.0, 0.4);

      // 生动高光灵动白点 (Catchlight)
      const glint = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 8, 8),
        glintMat
      );
      glint.position.set(sign * 0.24 + 0.02, 0.53, 0.45);

      // 紧锁的上眼睑威严眼罩 (Hooded Eyelid Fold)
      const lid = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
        squidSkinMat
      );
      lid.position.set(sign * 0.25, 0.51, 0.35);
      lid.rotation.x = -0.45;
      lid.rotation.z = -sign * 0.20;

      // 水润透明晶状角膜
      const cornea = new THREE.Mesh(
        new THREE.SphereGeometry(0.115, 12, 12),
        corneaMat
      );
      cornea.position.set(sign * 0.25, 0.50, 0.35);

      eyeG.add(socket, eyeball, pupil, glint, lid, cornea);
      return eyeG;
    };
    headG.add(createEye(false), createEye(true));

    // 章鱼/乌贼圆润嘟嘟喷水嘴 (Chubby Cute Funnel Siphon)
    const mouthG = new THREE.Group();
    const siphonTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.10, 0.16, 14),
      squidSkinMat
    );
    siphonTube.position.set(0, 0.30, 0.40);
    siphonTube.rotation.x = 0.55;

    const siphonLip = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.025, 8, 16),
      mouthRimMat
    );
    siphonLip.position.set(0, 0.26, 0.46);
    siphonLip.rotation.x = 0.55;

    const siphonHole = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 12),
      mouthHoleMat
    );
    siphonHole.position.set(0, 0.26, 0.46);
    siphonHole.rotation.x = 0.55;

    mouthG.add(siphonTube, siphonLip, siphonHole);
    headG.add(mouthG);

    // 6. 左翼连贯平滑触手群 (Left Flank Tentacles - 完整覆盖左侧格 x=4, 延伸至 X = -1.45)
    const leftFlankG = new THREE.Group();
    leftFlankG.name = 'squid_left_flank';

    // 腕足 L1: 顺着西墙攀卷而上的巨型连贯主腕
    const armL1 = createSmoothTentacle([
      new THREE.Vector3(-0.28, 0.30, 0.05),
      new THREE.Vector3(-0.60, 0.22, 0.08),
      new THREE.Vector3(-0.95, 0.25, 0.04),
      new THREE.Vector3(-1.25, 0.45, 0.00),
      new THREE.Vector3(-1.42, 0.75, -0.02),
      new THREE.Vector3(-1.38, 1.00, -0.04),
    ], 0.11, 0.035, 8);

    // 腕足 L2: 贴地游走覆盖左侧走廊地面的游蛇腕
    const armL2 = createSmoothTentacle([
      new THREE.Vector3(-0.24, 0.24, 0.20),
      new THREE.Vector3(-0.55, 0.12, 0.32),
      new THREE.Vector3(-0.90, 0.07, 0.36),
      new THREE.Vector3(-1.25, 0.06, 0.32),
      new THREE.Vector3(-1.38, 0.22, 0.20),
    ], 0.10, 0.032, 8);

    // 腕足 L3: 凌空高高弓起的威吓重鞭
    const armL3 = createSmoothTentacle([
      new THREE.Vector3(-0.22, 0.38, 0.12),
      new THREE.Vector3(-0.50, 0.70, 0.22),
      new THREE.Vector3(-0.80, 0.98, 0.28),
      new THREE.Vector3(-1.08, 0.95, 0.32),
      new THREE.Vector3(-1.22, 0.70, 0.35),
    ], 0.09, 0.030, 8);

    // 腕足 L4: 牢牢抓地的后锚支撑腕
    const armL4 = createSmoothTentacle([
      new THREE.Vector3(-0.26, 0.26, -0.15),
      new THREE.Vector3(-0.65, 0.14, -0.28),
      new THREE.Vector3(-1.05, 0.10, -0.32),
      new THREE.Vector3(-1.28, 0.18, -0.24),
    ], 0.095, 0.032, 6);

    leftFlankG.add(armL1, armL2, armL3, armL4);

    // 7. 右翼连贯平滑触手群 (Right Flank Tentacles - 完整覆盖右侧格 x=6, 延伸至 X = +1.45)
    const rightFlankG = new THREE.Group();
    rightFlankG.name = 'squid_right_flank';

    // 腕足 R1: 顺着东墙攀卷而上的巨型连贯主腕
    const armR1 = createSmoothTentacle([
      new THREE.Vector3(0.28, 0.30, 0.05),
      new THREE.Vector3(0.60, 0.22, 0.08),
      new THREE.Vector3(0.95, 0.25, 0.04),
      new THREE.Vector3(1.25, 0.45, 0.00),
      new THREE.Vector3(1.42, 0.75, -0.02),
      new THREE.Vector3(1.38, 1.00, -0.04),
    ], 0.11, 0.035, 8);

    // 腕足 R2: 贴地游走覆盖右侧走廊地面的游蛇腕
    const armR2 = createSmoothTentacle([
      new THREE.Vector3(0.24, 0.24, 0.20),
      new THREE.Vector3(0.55, 0.12, 0.32),
      new THREE.Vector3(0.90, 0.07, 0.36),
      new THREE.Vector3(1.25, 0.06, 0.32),
      new THREE.Vector3(1.38, 0.22, 0.20),
    ], 0.10, 0.032, 8);

    // 腕足 R3: 凌空高高弓起的威吓重鞭
    const armR3 = createSmoothTentacle([
      new THREE.Vector3(0.22, 0.38, 0.12),
      new THREE.Vector3(0.50, 0.70, 0.22),
      new THREE.Vector3(0.80, 0.98, 0.28),
      new THREE.Vector3(1.08, 0.95, 0.32),
      new THREE.Vector3(1.22, 0.70, 0.35),
    ], 0.09, 0.030, 8);

    // 腕足 R4: 牢牢抓地的后锚支撑腕
    const armR4 = createSmoothTentacle([
      new THREE.Vector3(0.26, 0.26, -0.15),
      new THREE.Vector3(0.65, 0.14, -0.28),
      new THREE.Vector3(1.05, 0.10, -0.32),
      new THREE.Vector3(1.28, 0.18, -0.24),
    ], 0.095, 0.032, 6);

    rightFlankG.add(armR1, armR2, armR3, armR4);

    // 8. 正前方两条生动捕食触手 (2 Front Striking Prehensile Tentacles)
    const strikingL = new THREE.Group();
    strikingL.name = 'squid_striking_l';
    const armC1 = createSmoothTentacle([
      new THREE.Vector3(-0.12, 0.26, 0.25),
      new THREE.Vector3(-0.18, 0.15, 0.42),
      new THREE.Vector3(-0.28, 0.12, 0.58),
      new THREE.Vector3(-0.32, 0.36, 0.65),
      new THREE.Vector3(-0.24, 0.58, 0.60),
    ], 0.09, 0.028, 8);
    strikingL.add(armC1);

    const strikingR = new THREE.Group();
    strikingR.name = 'squid_striking_r';
    const armC2 = createSmoothTentacle([
      new THREE.Vector3(0.12, 0.26, 0.25),
      new THREE.Vector3(0.18, 0.15, 0.42),
      new THREE.Vector3(0.28, 0.12, 0.58),
      new THREE.Vector3(0.32, 0.36, 0.65),
      new THREE.Vector3(0.24, 0.58, 0.60),
    ], 0.09, 0.028, 8);
    strikingR.add(armC2);

    group.add(mantleG, headG, leftFlankG, rightFlankG, strikingL, strikingR);
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
    } else if (itemType === 'notepad') {
      return this.createNotepadMesh();
    } else if (itemType === 'cross') {
      return this.createCrossMesh();
    } else if (itemType === 'monster_manual') {
      return this.createMonsterManualMesh();
    } else if (itemType === 'compass') {
      return this.createCompassMesh();
    } else if (itemType === 'snow_crystal') {
      return this.createSnowCrystalMesh();
    } else if (itemType === 'thief_shovel') {
      return this.createShovelMesh();
    } else if (itemType === 'center_fly') {
      return this.createCenterFlyMesh();
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

  // 记事本 / 冒险手记 (Notepad / Explorer's Chronicle) - 彻底重构写实高精 3D 建模
  static createNotepadMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_notepad';

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // 复古深褐皮革封皮
      roughness: 0.65,
      metalness: 0.15,
    });
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x271105, // 书脊深邃老皮革
      roughness: 0.7,
      metalness: 0.1,
    });
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a, // 泛黄微黄羊皮纸书页芯
      roughness: 0.9,
      metalness: 0.05,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // 纯金/黄铜护角、皮扣与笔尖
      metalness: 0.9,
      roughness: 0.2,
    });
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // 封面天蓝星光魔晶徽章
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.3,
    });
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // 垂落的书签深红丝带
      roughness: 0.5,
      metalness: 0.1,
    });
    const quillMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe, // 探险家羽毛笔天蓝白羽毛
      roughness: 0.6,
      metalness: 0.05,
    });

    const book = new THREE.Group();

    // 1. 底封 (Back Cover)
    const backCover = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.016, 0.46), leatherMat);
    backCover.position.y = 0.01;
    book.add(backCover);

    // 2. 书芯内页厚纸块 (Parchment Paper Block)
    const paperBlock = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.09, 0.43), pagesMat);
    paperBlock.position.set(0.012, 0.065, 0);
    book.add(paperBlock);

    // 3. 面封 (Front Cover)
    const frontCover = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.018, 0.46), leatherMat);
    frontCover.position.y = 0.12;
    book.add(frontCover);

    // 4. 书脊半圆柱 (Book Spine)
    const spineGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.46, 12, 1, false, Math.PI / 2, Math.PI);
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.rotation.x = Math.PI / 2;
    spine.position.set(-0.175, 0.065, 0);
    book.add(spine);

    // 5. 纯金/黄铜金属护角 (Brass Corner Protectors - 4 corners)
    const cornerOffsets = [
      { x: 0.165, z: 0.215 },
      { x: 0.165, z: -0.215 },
    ];
    for (const off of cornerOffsets) {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.024, 0.045), goldMat);
      corner.position.set(off.x, 0.122, off.z);
      book.add(corner);
    }

    // 6. 封面天蓝星光魔晶徽章 (Notebook Gem Emblem)
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), gemMat);
    gem.position.set(0.02, 0.138, 0);
    gem.rotation.y = Math.PI / 4;
    book.add(gem);

    // 7. 封皮束带与锁扣 (Leather Strap & Buckle)
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.012), leatherMat);
    strap.position.set(0.18, 0.065, 0);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.04, 0.02), goldMat);
    buckle.position.set(0.175, 0.065, 0);
    book.add(strap, buckle);

    // 8. 垂落红色书签缎带 (Silk Bookmark Ribbon)
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.12), ribbonMat);
    ribbon.position.set(0.05, 0.06, 0.26);
    ribbon.rotation.x = 0.2;
    book.add(ribbon);

    // 9. 精致古典羽毛笔 (Classic Explorer Quill Pen 斜置在书面上)
    const quillG = new THREE.Group();
    // 笔身羽管
    const quillStem = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.012, 0.36, 8), quillMat);
    quillStem.position.y = 0.18;
    // 羽毛宽边
    const featherVane = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.22, 0.006), quillMat);
    featherVane.position.set(0.02, 0.24, 0);
    featherVane.rotation.z = -0.15;
    // 黄铜金属笔嘴
    const nib = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.05, 6), goldMat);
    nib.position.y = -0.01;
    nib.rotation.z = Math.PI;

    quillG.add(quillStem, featherVane, nib);
    quillG.position.set(-0.02, 0.15, 0.05);
    quillG.rotation.set(0.1, 0.4, -Math.PI / 3);
    book.add(quillG);

    // 整体悬浮微倾展示
    book.rotation.set(0.2, 0.35, -0.12);
    book.position.set(0, 0.22, 0);
    group.add(book);

    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 神圣十字架 (Holy Cross)
  static createCrossMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_cross';

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.15,
    });
    const rubyMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.1,
    });

    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.52, 0.06), goldMat);
    vBar.position.y = 0.34;
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.06), goldMat);
    hBar.position.y = 0.42;

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.018, 8, 24), goldMat);
    halo.position.set(0, 0.42, -0.01);

    const ruby = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), rubyMat);
    ruby.position.set(0, 0.42, 0.035);

    group.add(vBar, hBar, halo, ruby);
    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    return group;
  }

  // 怪物手册 (Monster Manual)
  static createMonsterManualMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_monster_manual';

    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x065f46, // 翠绿古典精装魔法典籍
      roughness: 0.7,
      metalness: 0.15,
    });
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.9,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.2,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
      metalness: 0.3,
      roughness: 0.1,
    });

    const book = new THREE.Group();
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.44), coverMat);
    cover.position.y = 0.06;
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.08, 0.41), pagesMat);
    pages.position.set(0.01, 0.06, 0);
    const eye = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), eyeMat);
    eye.position.set(0, 0.125, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 8, 20), goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.122, 0);

    book.add(cover, pages, eye, ring);
    book.rotation.set(0.2, 0.3, -0.1);
    book.position.set(0, 0.22, 0);
    group.add(book);

    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    return group;
  }

  // 楼层罗盘 (Floor Teleport Compass)
  static createCompassMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_compass';

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
    });
    const needleRedMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.5,
    });
    const needleBlueMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.5,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24), brassMat);
    body.position.y = 0.25;

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), brassMat);
    ring.position.set(0, 0.25, 0.24);

    const needleN = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.15, 4), needleRedMat);
    needleN.rotation.x = Math.PI / 2;
    needleN.position.set(0, 0.285, 0.075);

    const needleS = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.15, 4), needleBlueMat);
    needleS.rotation.x = -Math.PI / 2;
    needleS.position.set(0, 0.285, -0.075);

    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.015, 24), glassMat);
    glass.position.y = 0.29;

    group.add(body, ring, needleN, needleS, glass);
    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    return group;
  }

  // 冰冻雪花 (Snow Crystal)
  static createSnowCrystalMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_snow_crystal';

    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      transmission: 0.75,
      roughness: 0.15,
      transparent: true,
      opacity: 0.9,
    });

    const crystalG = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const arm = new THREE.Group();
      arm.rotation.y = (i * Math.PI) / 3;

      const mainSpike = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.32), iceMat);
      mainSpike.position.z = 0.16;

      const sub1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.10), iceMat);
      sub1.rotation.y = Math.PI / 4;
      sub1.position.set(0.04, 0, 0.18);

      const sub2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.10), iceMat);
      sub2.rotation.y = -Math.PI / 4;
      sub2.position.set(-0.04, 0, 0.18);

      arm.add(mainSpike, sub1, sub2);
      crystalG.add(arm);
    }

    const center = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), iceMat);
    crystalG.add(center);

    crystalG.position.y = 0.35;
    group.add(crystalG);

    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    return group;
  }

  // 小偷的铲子 (Thief's Shovel) - 精致写实 3D 金属掘地铁铲
  static createShovelMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_thief_shovel';

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x475569,
      emissiveIntensity: 0.25,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.7,
      metalness: 0.1,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.35,
    });

    const shovelG = new THREE.Group();

    // 1. 铲把 (Wooden Shaft)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.52, 8), woodMat);
    shaft.position.y = 0.32;
    shovelG.add(shaft);

    // 2. 铲柄顶端 D 形握手 (D-Grip)
    const gripBase = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.025, 0.025), brassMat);
    gripBase.position.y = 0.58;
    const gripTop = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.11, 8), woodMat);
    gripTop.rotation.z = Math.PI / 2;
    gripTop.position.y = 0.65;
    const gripLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.07, 8), brassMat);
    gripLeft.position.set(-0.045, 0.615, 0);
    const gripRight = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.07, 8), brassMat);
    gripRight.position.set(0.045, 0.615, 0);
    shovelG.add(gripBase, gripTop, gripLeft, gripRight);

    // 3. 铁铲连接套筒 (Collar / Socket)
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.09, 8), steelMat);
    socket.position.y = 0.09;
    shovelG.add(socket);

    // 4. 铁铲头 (Shovel Scoop Blade)
    const bladeGeo = new THREE.BoxGeometry(0.16, 0.20, 0.02);
    const blade = new THREE.Mesh(bladeGeo, steelMat);
    blade.position.y = -0.02;
    shovelG.add(blade);

    // 铲刃倒角尖锋
    const tipGeo = new THREE.ConeGeometry(0.11, 0.08, 4);
    tipGeo.rotateY(Math.PI / 4);
    tipGeo.rotateX(Math.PI);
    const tip = new THREE.Mesh(tipGeo, steelMat);
    tip.position.y = -0.14;
    shovelG.add(tip);

    // 整体斜向倾斜与微浮
    shovelG.rotation.z = Math.PI / 6;
    shovelG.rotation.x = Math.PI / 12;
    shovelG.position.y = 0.22;
    group.add(shovelG);

    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 中心对称飞行器 (Center Flyer / 筋斗云时空神翼)
  static createCenterFlyMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'item_center_fly';

    // 材质定义：时空紫晶与圣金流光
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8b4fe,
      emissive: 0x9333ea,
      emissiveIntensity: 0.65,
      transmission: 0.6,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
    });
    const coreCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0abfc,
      emissive: 0xa855f7,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      transmission: 0.5,
      transparent: true,
      opacity: 0.95,
    });

    const flyG = new THREE.Group();

    // 1. 核心时空八面体能量水晶 (Chronocrystal Core)
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), coreCrystalMat);
    core.position.y = 0.38;
    flyG.add(core);

    // 2. 环绕核心的星轨时钟金环 (Orbit Chrono Ring)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.016, 8, 32), goldMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.y = 0.38;
    flyG.add(ring);

    // 3. 对称羽翼构型 (Symmetric Celestial Wings)
    const createWing = (isRight: boolean): THREE.Group => {
      const wing = new THREE.Group();
      const sign = isRight ? 1 : -1;

      // 主羽 (Primary Feather)
      const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.018), wingMat);
      f1.rotation.z = sign * 0.45;
      f1.position.set(sign * 0.14, 0.08, 0);

      // 次羽 (Secondary Feather)
      const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.045, 0.016), wingMat);
      f2.rotation.z = sign * 0.25;
      f2.position.set(sign * 0.13, 0.02, 0);

      // 底羽 (Lower Feather)
      const f3 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.014), wingMat);
      f3.rotation.z = sign * 0.05;
      f3.position.set(sign * 0.10, -0.04, 0);

      wing.add(f1, f2, f3);
      return wing;
    };

    const leftWing = createWing(false);
    leftWing.position.set(-0.06, 0.38, 0);
    const rightWing = createWing(true);
    rightWing.position.set(0.06, 0.38, 0);

    flyG.add(leftWing, rightWing);

    // 4. 底部微型对称指针轴 (Chrono Needle Marker)
    const needleV = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.01), goldMat);
    needleV.position.y = 0.38;
    const needleH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.01), goldMat);
    needleH.position.y = 0.38;
    flyG.add(needleV, needleH);

    group.add(flyG);

    group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 39F 囚禁中心飞行器的神圣铁笼 (Iron Cage holding the Center Flyer)
  static createFlyerCageMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'cage_center_fly';

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.35,
    });
    const darkIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.4,
    });
    const goldLockMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0xb45309,
      emissiveIntensity: 0.3,
    });

    const cageGroup = new THREE.Group();

    // 1. 底座方框与顶盖方框
    const frameSize = 0.78;
    const barThick = 0.035;
    const cageHeight = 0.76;

    const createSquareFrame = (yPos: number) => {
      const f = new THREE.Group();
      const bNorth = new THREE.Mesh(new THREE.BoxGeometry(frameSize, barThick, barThick), darkIronMat);
      bNorth.position.set(0, yPos, -frameSize / 2);
      const bSouth = new THREE.Mesh(new THREE.BoxGeometry(frameSize, barThick, barThick), darkIronMat);
      bSouth.position.set(0, yPos, frameSize / 2);
      const bWest = new THREE.Mesh(new THREE.BoxGeometry(barThick, barThick, frameSize), darkIronMat);
      bWest.position.set(-frameSize / 2, yPos, 0);
      const bEast = new THREE.Mesh(new THREE.BoxGeometry(barThick, barThick, frameSize), darkIronMat);
      bEast.position.set(frameSize / 2, yPos, 0);
      f.add(bNorth, bSouth, bWest, bEast);
      return f;
    };

    cageGroup.add(createSquareFrame(0.04));
    cageGroup.add(createSquareFrame(cageHeight));

    // 2. 四角坚固方铁柱 (Corner Pillars)
    const pillarGeom = new THREE.BoxGeometry(barThick * 1.2, cageHeight, barThick * 1.2);
    const half = frameSize / 2;
    const corners = [
      [-half, -half],
      [half, -half],
      [-half, half],
      [half, half],
    ];
    for (const [cx, cz] of corners) {
      const p = new THREE.Mesh(pillarGeom, darkIronMat);
      p.position.set(cx, cageHeight / 2, cz);
      cageGroup.add(p);
    }

    // 3. 四个面的通透铁栅栏圆柱 (4-Sided Vertical Bars)
    const barRadius = 0.013;
    const barGeom = new THREE.CylinderGeometry(barRadius, barRadius, cageHeight - 0.04, 8);
    const barOffsets = [-0.18, 0, 0.18];

    // 南北面栅栏
    for (const offset of barOffsets) {
      const barN = new THREE.Mesh(barGeom, ironMat);
      barN.position.set(offset, cageHeight / 2, -half);
      const barS = new THREE.Mesh(barGeom, ironMat);
      barS.position.set(offset, cageHeight / 2, half);
      cageGroup.add(barN, barS);
    }
    // 东西面栅栏
    for (const offset of barOffsets) {
      const barW = new THREE.Mesh(barGeom, ironMat);
      barW.position.set(-half, cageHeight / 2, offset);
      const barE = new THREE.Mesh(barGeom, ironMat);
      barE.position.set(half, cageHeight / 2, offset);
      cageGroup.add(barW, barE);
    }

    // 4. 顶部十字加固梁 (Top Cross Grate)
    const topCross1 = new THREE.Mesh(new THREE.BoxGeometry(frameSize, barThick * 0.8, barThick * 0.8), darkIronMat);
    topCross1.position.y = cageHeight;
    const topCross2 = new THREE.Mesh(new THREE.BoxGeometry(barThick * 0.8, barThick * 0.8, frameSize), darkIronMat);
    topCross2.position.y = cageHeight;
    cageGroup.add(topCross1, topCross2);

    // 5. 正面门锁与锁链 (Front Heavy Padlock)
    const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.04), goldLockMat);
    lockBody.position.set(0, cageHeight * 0.5, half + 0.02);
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16, Math.PI), ironMat);
    shackle.position.set(0, cageHeight * 0.5 + 0.05, half + 0.02);
    shackle.rotation.z = Math.PI;
    cageGroup.add(lockBody, shackle);

    group.add(cageGroup);

    // 6. 囚禁在笼内的中心对称飞行器 (Floating & Glowing Center Flyer inside)
    const innerFlyer = ModelFactory.createCenterFlyMesh();
    innerFlyer.name = 'cage_inner_flyer';
    innerFlyer.scale.set(0.85, 0.85, 0.85);
    innerFlyer.position.set(0, -0.02, 0);
    group.add(innerFlyer);

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
  // 规则：
  // 1. 密集实心山体/2x2及以上厚墙区或纯孤立立柱 (如50F四柱、5F柱)：整格饱满 1.0 x 0.90 x 1.0 方块，杜绝细杆与空心
  // 2. 隔断墙与走廊墙：厚度严格等于门厚 (0.16)，与门平齐无缝对接
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

    const createSolidBlock = () => {
      if (!this.sharedWallGeo) {
        this.sharedWallGeo = new THREE.BoxGeometry(1.0, WALL_H, 1.0);
        this.sharedWallGeo.translate(0, WALL_H / 2, 0);
      }
      const solidMesh = new THREE.Mesh(this.sharedWallGeo, wallMat);
      solidMesh.name = 'wall';
      solidMesh.castShadow = true;
      solidMesh.receiveShadow = true;
      return solidMesh;
    };

    // 默认或无上下文时（如单元测试）：回退为标准单格实心或薄墙
    if (!layout || x === undefined || y === undefined) {
      const geo = new THREE.BoxGeometry(1.0, WALL_H, T);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.name = 'wall';
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

    const isSolidWallTile = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return true;
      const t = layout[ty]?.[tx];
      if (!t) return false;
      return t.type === 'wall' || t.type === 'fake_wall';
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

    const wallNeighborCount = (hasNorth ? 1 : 0) + (hasSouth ? 1 : 0) + (hasWest ? 1 : 0) + (hasEast ? 1 : 0);

    // A. 孤立立柱 (无任何正交邻接墙体，如 5F 骷髅兵旁 (0,6)、50F 圣殿四柱 (3,3), (7,3) 等)：
    // 坚固饱满实心石柱，绝不退化为细竹竿
    if (wallNeighborCount === 0) {
      return createSolidBlock();
    }

    // B. 实心厚墙区判定 (2x2 连续实心方块簇或周围有 3~4 个实体墙邻居)
    // 包含 4 个拐角对应的对角检查：若处于厚墙内部或拐角内侧，使用整块实心石方块填充，杜绝镂空空心
    if (wallNeighborCount >= 3) {
      return createSolidBlock();
    }

    const isNWCornerSolid = hasNorth && hasWest && isSolidWallTile(x - 1, y - 1);
    const isNECornerSolid = hasNorth && hasEast && isSolidWallTile(x + 1, y - 1);
    const isSWCornerSolid = hasSouth && hasWest && isSolidWallTile(x - 1, y + 1);
    const isSECornerSolid = hasSouth && hasEast && isSolidWallTile(x + 1, y + 1);

    if (isNWCornerSolid || isNECornerSolid || isSWCornerSolid || isSECornerSolid) {
      return createSolidBlock();
    }

    // C. 纯横向走向墙段 (水平横向隔断，左右连通，前后通透)
    if (hasWest && hasEast && !hasNorth && !hasSouth) {
      const geo = new THREE.BoxGeometry(1.0, WALL_H, T);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.name = 'wall';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // D. 纯纵向走向墙段 (垂直南北隔断，上下连通，左右通透)
    if (hasNorth && hasSouth && !hasWest && !hasEast) {
      const geo = new THREE.BoxGeometry(T, WALL_H, 1.0);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.name = 'wall';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // E. 单向突出隔断尽头 (Dead-End 端头墙)：
    // 充满整格长度 1.0，厚度严格对齐门厚 T=0.16，不再出现只占半格或断裂
    if ((hasWest || hasEast) && !hasNorth && !hasSouth) {
      const geo = new THREE.BoxGeometry(1.0, WALL_H, T);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.name = 'wall';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    if ((hasNorth || hasSouth) && !hasWest && !hasEast) {
      const geo = new THREE.BoxGeometry(T, WALL_H, 1.0);
      geo.translate(0, WALL_H / 2, 0);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.name = 'wall';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // F. 拐角 (L-Corner)、丁字路口 (T-Junction) 与十字交叉 (Cross)
    // 采用厚度 T=0.16 的核心立柱 + 0.42 延伸悬臂一体化无缝拼装
    const armLen = (1.0 - T) / 2; // 0.42
    const armCenter = (1.0 + T) / 4; // 0.29

    const group = new THREE.Group();
    group.name = 'wall';

    // 核心立柱 (厚度 T x T)
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

