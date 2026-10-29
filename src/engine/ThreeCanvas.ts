// src/engine/ThreeCanvas.ts
import * as THREE from 'three';
import { Direction, FloorData, Tile } from '../types/game';
import { ModelFactory } from './ModelFactory';

export interface FloatingText {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number; // 3D world pos
  z: number;
  opacity: number;
  createdAt: number;
}

interface AnimatedItem {
  type: 'item_rotate' | 'altar' | 'shop' | 'fairy' | 'slime' | 'bat' | 'portal' | 'npc' | 'lava' | 'monster_idle' | 'giant_squid';
  mesh: THREE.Object3D;
  initialX: number;
  initialY: number;
  baseScale?: THREE.Vector3;
  crystal?: THREE.Object3D;
  wingL?: THREE.Object3D;
  wingR?: THREE.Object3D;
  wandStar?: THREE.Object3D;
  rune?: THREE.Object3D;
  batWingL?: THREE.Object3D;
  batWingR?: THREE.Object3D;
  lanternL?: THREE.Object3D;
  lanternR?: THREE.Object3D;
  shopkeeper?: THREE.Object3D;
  portalWall?: THREE.Object3D;
  portalArrow?: THREE.Object3D;
  portalCylinder?: THREE.Mesh;
  portalGroundRing?: THREE.Object3D;
  portalFloatRings?: THREE.Object3D;
  isUp?: boolean;
  bubble?: THREE.Object3D;
  halo?: THREE.Object3D;
  mantle?: THREE.Object3D;
  leftFlank?: THREE.Object3D;
  rightFlank?: THREE.Object3D;
  strikingL?: THREE.Object3D;
  strikingR?: THREE.Object3D;
  finL?: THREE.Object3D;
  finR?: THREE.Object3D;
}

export class ThreeCanvas {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private reqId: number | null = null;

  // 场景节点
  private floorGroup: THREE.Group = new THREE.Group();
  private heroGroup: THREE.Group | null = null;
  private playerTorchLight: THREE.PointLight;
  private ambientLight: THREE.AmbientLight;
  private dirLight: THREE.DirectionalLight;

  // 交互、射线拾取与选中指示器
  private raycaster = new THREE.Raycaster();
  private pointerDownPos = { x: 0, y: 0 };
  private pointerDownOnCanvas: boolean = false;
  public onRightClickTile?: (gridX: number, gridY: number) => void;
  public onRightDoubleClickTile?: (gridX: number, gridY: number) => void;
  public onDoubleClickTile?: (gridX: number, gridY: number) => void;
  public onSelectTile?: (gridX: number, gridY: number) => void;
  private pathMarker: THREE.Mesh | null = null;
  private selectionMarker: THREE.Group | null = null;
  private selectedTilePos: { x: number; y: number } | null = null;

  // 双击与拖拽手势状态
  private lastLeftClickTime: number = 0;
  private lastLeftClickPos: { x: number; y: number } = { x: 0, y: 0 };
  private lastLeftClickCoords: { gridX: number; gridY: number } | null = null;
  private lastRightClickTime: number = 0;
  private lastRightClickPos: { x: number; y: number } = { x: 0, y: 0 };
  private dragMode: 'none' | 'pan' | 'rotate' = 'none';
  private initialPanOffset: { x: number; y: number } = { x: 0, y: 0 };
  private isPanMoved: boolean = false;

  // 移动端双指触控手势状态 (双指 Pinch 缩放与双指同向滑动旋转视角)
  private isTwoFingerGesture: boolean = false;
  private hasTwoFingerMoved: boolean = false;
  private lastTouchDistance: number = 0;
  private lastTouchCenter: { x: number; y: number } = { x: 0, y: 0 };
  private resizeObserver?: ResizeObserver;

  // 动画与插值状态
  private playerGridPos = { x: 5, y: 5 };
  private playerFacing: Direction = 'down';
  private heroTargetPos = new THREE.Vector3(0, 0, 0);
  private heroCurrentPos = new THREE.Vector3(0, 0, 0);
  private heroWalkProgress = 1.0; // 0 to 1
  private cameraTargetPos = new THREE.Vector3(0, 8.5, 7.5);
  private cameraTargetLook = new THREE.Vector3(0, 0.4, 0);
  private cameraCurrentLook = new THREE.Vector3(0, 0.4, 0);

  // 视口平移、缩放与自由旋转状态
  private currentZoom: number = 1.0;
  private targetZoom: number = 1.0;
  private panOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  private targetPanOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  private cameraYaw: number = 0; // 方位角 (Yaw)
  private targetCameraYaw: number = 0;
  private cameraPitch: number = 0.85; // 俯仰角 (Pitch, ~49°)
  private targetCameraPitch: number = 0.85;
  private isDragging: boolean = false;
  private lastPointerPos: { x: number; y: number } = { x: 0, y: 0 };
  public onCameraStateChange?: (zoom: number, isModified: boolean) => void;

  // 门开启升降动画列表
  private openingDoors: { group: THREE.Group; startTime: number; duration: number }[] = [];

  // 悬浮跳字系统
  public floatingTexts: FloatingText[] = [];

  // 网格瓦片三维网格映射: key = `${x}_${y}`
  private tileMeshes: Map<string, THREE.Object3D> = new Map();

  // 极速动画待机列表（消除全场景递归查询）
  private animatedItems: AnimatedItem[] = [];

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. 场景 (禁用视距雾气，确保镜头无论放大还是缩小，场景光照明暗完全恒定固定)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);
    this.scene.fog = null;

    // 2. 摄像机
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 9, 8);
    this.camera.lookAt(0, 0, 0);

    // 3. 渲染器 (针对 Retina 屏幕限制像素比至 1.5，开启节能与高性能平衡)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.localClippingEnabled = true; // 启用逐材质裁剪面 (用于门扇滑入墙体裁剪)
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    // 4. 灯光系统
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.50);
    this.scene.add(this.ambientLight);

    // 平行光：高清晰度柔和阴影 (PCFSoftShadowMap 消除边缘锯齿)
    this.dirLight = new THREE.DirectionalLight(0xfff5ea, 1.25);
    this.dirLight.position.set(10, 18, 12);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 45;
    this.dirLight.shadow.camera.left = -11;
    this.dirLight.shadow.camera.right = 11;
    this.dirLight.shadow.camera.top = 11;
    this.dirLight.shadow.camera.bottom = -11;
    this.dirLight.shadow.bias = -0.00015;
    this.dirLight.shadow.normalBias = 0.015;
    this.scene.add(this.dirLight);

    // 勇士随身火把光源：柔和点光源漫反射（严禁投射点光源立方体深度阴影，彻底消除每帧 6 次全场景阴影重绘！）
    this.playerTorchLight = new THREE.PointLight(0xff9933, 1.35, 6.0, 1.2);
    this.playerTorchLight.castShadow = false;
    this.scene.add(this.playerTorchLight);

    this.scene.add(this.floorGroup);

    // 5. 创建勇士模型
    this.heroGroup = ModelFactory.createHeroMesh();
    this.heroGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.scene.add(this.heroGroup);

    // 6. 绑定窗口尺寸与交互事件（拖拽平移、滚轮缩放、双击复位、移动端双指手势）
    window.addEventListener('resize', this.onResize);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.onResize();
      });
      this.resizeObserver.observe(this.container);
    }
    this.container.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('wheel', this.onWheel, { passive: false });
    this.container.addEventListener('contextmenu', this.onContextMenu);
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.onTouchEnd, { passive: false });
    this.container.addEventListener('touchcancel', this.onTouchEnd, { passive: false });

    // 7. 启动渲染循环
    this.startLoop();
  }

  // 坐标转换：将 11x11 网格坐标 (0~10) 映射为世界空间 (X, Z)
  public static gridToWorld(x: number, y: number): { x: number; z: number } {
    return {
      x: (x - 5) * 1.0,
      z: (y - 5) * 1.0,
    };
  }

  // 构建 / 刷新整层 3D 地牢
  public setFloor(floorData: FloorData) {
    // 清理旧瓦片
    while (this.floorGroup.children.length > 0) {
      const obj = this.floorGroup.children[0];
      this.floorGroup.remove(obj);
    }
    this.tileMeshes.clear();
    this.animatedItems = [];
    this.openingDoors = [];
    this.clearPathTarget();
    this.setSelectedTile(null, null);

    // 换层时重置视角平移与缩放至默认
    this.resetCameraView();

    // 根据楼层主题调节光影氛围 (禁用视距暗雾，确保无论近景还是远景缩放，光照恒定固定)
    this.scene.fog = null;
    if (floorData.theme === 'magma') {
      this.scene.background = new THREE.Color(0x1a0503);
      this.ambientLight.color.setHex(0xff7744);
      this.ambientLight.intensity = 0.6;
    } else if (floorData.theme === 'dark') {
      this.scene.background = new THREE.Color(0x060410);
      this.ambientLight.color.setHex(0xa855f7);
      this.ambientLight.intensity = 0.4;
    } else if (floorData.theme === 'celestial') {
      this.scene.background = new THREE.Color(0x0c1e33);
      this.ambientLight.color.setHex(0xe0f2fe);
      this.ambientLight.intensity = 0.75;
    } else {
      this.scene.background = new THREE.Color(0x090d16);
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.55;
    }

    // 循环 11x11 网格生成瓦片
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        const tile = floorData.layout[y][x];
        const world = ThreeCanvas.gridToWorld(x, y);

        // 默认地砖底盘 (熔岩地块由自身的岩浆池模型承载覆盖)
        if (!tile || tile.type !== 'lava') {
          const floorMesh = ModelFactory.createFloorMesh(floorData.theme);
          floorMesh.position.set(world.x, -0.1, world.z);
          this.floorGroup.add(floorMesh);
        }

        if (!tile || tile.type === 'floor') continue;

        // 特殊处理横跨 3 格的一体化魔法商铺 (3-Tile Wide Storefront)
        if (tile.type === 'shop') {
          const hasLeft = x > 0 && floorData.layout[y][x - 1]?.type === 'shop';
          const hasRight = x < 10 && floorData.layout[y][x + 1]?.type === 'shop';

          if (hasLeft && !hasRight) {
            // 这是横跨3格商铺的右翼格，由中心格一体化统筹渲染
            this.tileMeshes.set(`${x}_${y}`, new THREE.Group());
            continue;
          }
          if (!hasLeft && hasRight) {
            // 这是横跨3格商铺的左翼格，由中心格一体化统筹渲染
            this.tileMeshes.set(`${x}_${y}`, new THREE.Group());
            continue;
          }

          // 中心格（或独立单格）创建华丽一体化商铺模型！
          const isWide = hasLeft || hasRight;
          const shopObj = ModelFactory.createShopMesh(isWide);
          shopObj.position.set(world.x, 0, world.z);

          // 开启实体阴影
          shopObj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const isTransparent = Array.isArray(mesh.material)
                ? mesh.material.some((m) => m.transparent)
                : (mesh.material as THREE.Material)?.transparent;
              if (mesh.name.includes('glow') || isTransparent) {
                mesh.castShadow = false;
              } else {
                mesh.castShadow = true;
              }
              mesh.receiveShadow = true;
            }
          });

          this.tileMeshes.set(`${x}_${y}`, shopObj);
          this.floorGroup.add(shopObj);

          this.animatedItems.push({
            type: 'shop',
            mesh: shopObj,
            initialX: world.x,
            initialY: 0,
            crystal: shopObj.getObjectByName('shop_crystal') || undefined,
            lanternL: shopObj.getObjectByName('shop_lantern_l') || undefined,
            lanternR: shopObj.getObjectByName('shop_lantern_r') || undefined,
            shopkeeper: shopObj.getObjectByName('shopkeeper') || undefined,
          });
          continue;
        }

        // 特殊处理横跨 3 格的一体化深海大乌贼 Boss (3-Tile Wide Colossal Giant Squid)
        if (tile.type === 'monster' && tile.monsterId === 'giant_squid') {
          const hasLeft = x > 0 && floorData.layout[y][x - 1]?.monsterId === 'giant_squid';
          const hasRight = x < 10 && floorData.layout[y][x + 1]?.monsterId === 'giant_squid';

          if (!hasLeft && hasRight) {
            // 这是横跨 3 格大乌贼的左翼格 (x=4)，由中心格一体化统筹渲染与交互绑定
            continue;
          }
          if (hasLeft && !hasRight) {
            // 这是横跨 3 格大乌贼的右翼格 (x=6)，由中心格一体化统筹渲染与交互绑定
            continue;
          }

          // 中心格（或独立单格）创建霸气横跨 3 格的一体化深海大乌贼模型！
          const squidObj = ModelFactory.createMonsterMesh('giant_squid');
          squidObj.position.set(world.x, 0, world.z);
          // 大乌贼面向南方通道 (正面朝向下方的挑战者)
          squidObj.rotation.y = 0;

          // 开启阴影
          squidObj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          this.tileMeshes.set(`${x}_${y}`, squidObj);
          if (hasLeft) {
            this.tileMeshes.set(`${x - 1}_${y}`, squidObj);
          }
          if (hasRight) {
            this.tileMeshes.set(`${x + 1}_${y}`, squidObj);
          }
          this.floorGroup.add(squidObj);

          this.animatedItems.push({
            type: 'giant_squid',
            mesh: squidObj,
            initialX: world.x,
            initialY: 0,
            mantle: squidObj.getObjectByName('squid_mantle') || undefined,
            leftFlank: squidObj.getObjectByName('squid_left_flank') || undefined,
            rightFlank: squidObj.getObjectByName('squid_right_flank') || undefined,
            strikingL: squidObj.getObjectByName('squid_striking_l') || undefined,
            strikingR: squidObj.getObjectByName('squid_striking_r') || undefined,
            finL: squidObj.getObjectByName('squid_fin_l') || undefined,
            finR: squidObj.getObjectByName('squid_fin_r') || undefined,
          });
          continue;
        }

        const tileObj = this.buildTileObject(tile, floorData.theme, floorData.layout, x, y);
        if (tileObj) {
          tileObj.position.set(world.x, 0, world.z);

          // 开启实体阴影投射与阴影接收（排除地面光环与透明面部，避免在地面产生锯齿状暗斑）
          tileObj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const isTransparent = Array.isArray(mesh.material)
                ? mesh.material.some((m) => m.transparent)
                : (mesh.material as THREE.Material)?.transparent;
              if (
                mesh.name.includes('rune') ||
                mesh.name.includes('ring') ||
                mesh.name.includes('face') ||
                isTransparent
              ) {
                mesh.castShadow = false;
              } else {
                mesh.castShadow = true;
              }
              mesh.receiveShadow = true;
            }
          });

          // 自动判断门的朝向：若门嵌在纵向墙体（南北走向）中，旋转 90 度以与南北墙壁严格平齐顺向
          if (tile.type.startsWith('door_')) {
            if (ThreeCanvas.isDoorVertical(floorData.layout, x, y)) {
              tileObj.rotation.y = Math.PI / 2;
            } else {
              tileObj.rotation.y = 0;
            }
          }

          // 怪物朝向：进入楼层时所有怪物立即转向主角方向，时时刻刻盯着主角
          if (tile.type === 'monster') {
            const heroWorld = ThreeCanvas.gridToWorld(this.playerGridPos.x, this.playerGridPos.y);
            const dx = heroWorld.x - world.x;
            const dz = heroWorld.z - world.z;
            tileObj.rotation.y = Math.atan2(dx, dz);
          }

          // 注册需要持续逐帧微动的场景物体与怪物待机动作
          if (tileObj.name.startsWith('item_')) {
            this.animatedItems.push({
              type: 'item_rotate',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
            });
          } else if (tileObj.name === 'cage_center_fly') {
            const innerFlyer = tileObj.getObjectByName('cage_inner_flyer');
            if (innerFlyer) {
              this.animatedItems.push({
                type: 'item_rotate',
                mesh: innerFlyer,
                initialX: world.x,
                initialY: 0,
              });
            }
          } else if (tileObj.name === 'altar') {
            this.animatedItems.push({
              type: 'altar',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              crystal: tileObj.getObjectByName('altar_crystal') || undefined,
            });
          } else if (tileObj.name === 'npc_fairy') {
            this.animatedItems.push({
              type: 'fairy',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              wingL: tileObj.getObjectByName('wing_l') || undefined,
              wingR: tileObj.getObjectByName('wing_r') || undefined,
              wandStar: tileObj.getObjectByName('wand_star') || undefined,
              rune: tileObj.getObjectByName('fairy_rune') || undefined,
            });
          } else if (tileObj.name.includes('slime')) {
            this.animatedItems.push({
              type: 'slime',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              baseScale: tileObj.scale.clone(),
            });
          } else if (tileObj.name.includes('bat')) {
            this.animatedItems.push({
              type: 'bat',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              baseScale: tileObj.scale.clone(),
              batWingL: tileObj.getObjectByName('bat_wing_l') || undefined,
              batWingR: tileObj.getObjectByName('bat_wing_r') || undefined,
            });
          } else if (tile.type === 'monster') {
            // 骷髅战士/队长、法师、守卫、骑士、Boss等所有人形或特殊怪物：警戒呼吸与悬浮微动
            this.animatedItems.push({
              type: 'monster_idle',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              baseScale: tileObj.scale.clone(),
            });
          } else if (tile.type === 'stairs_up' || tile.type === 'stairs_down') {
            this.animatedItems.push({
              type: 'portal',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              portalCylinder: (tileObj.getObjectByName('portal_cylinder') as THREE.Mesh) || undefined,
              portalGroundRing: tileObj.getObjectByName('portal_ground_ring') || undefined,
              portalFloatRings: tileObj.getObjectByName('portal_float_rings') || undefined,
              isUp: tile.type === 'stairs_up',
            });
          } else if (tile.type === 'npc' && tileObj.name !== 'npc_fairy') {
            const bubble = tileObj.getObjectByName('npc_bubble') || undefined;
            const halo = tileObj.getObjectByName('npc_halo') || undefined;
            if (bubble || halo) {
              this.animatedItems.push({
                type: 'npc',
                mesh: tileObj,
                initialX: world.x,
                initialY: 0,
                bubble,
                halo,
              });
            }
          } else if (tile.type === 'lava') {
            this.animatedItems.push({
              type: 'lava',
              mesh: tileObj,
              initialX: world.x,
              initialY: 0,
              bubble: tileObj.getObjectByName('lava_bubble') || undefined,
            });
          }

          this.floorGroup.add(tileObj);
          this.tileMeshes.set(`${x}_${y}`, tileObj);
        }
      }
    }
  }

  // 判断门所处的墙体走向（true 为南北纵向旋转 90 度以阻挡东西向走廊，false 为东西横向以阻挡南北向走廊）
  public static isDoorVertical(layout: (Tile | null)[][], x: number, y: number): boolean {
    const isBoundary = (tx: number, ty: number): boolean => {
      // 地图外部边界等同于外圈实体城墙，形成天然屏障
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return true;
      const t = layout[ty]?.[tx];
      if (!t) return false;
      // 实体墙壁、暗墙、岩浆(Lava)均为不可跨越的障碍物/墙体，门必须嵌入这些屏障之间
      // 注意：相邻的门绝不能当成墙体！多道连续的门（如26F连续三道红门、41F回廊连续黄门）属于同一走廊通道内的安全门，朝向必须严格保持一致！
      return t.type === 'wall' || t.type === 'fake_wall' || t.type === 'lava';
    };

    const isDoor = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return false;
      const t = layout[ty]?.[tx];
      return !!t && t.type.startsWith('door_');
    };

    const bLeft = isBoundary(x - 1, y);
    const bRight = isBoundary(x + 1, y);
    const bUp = isBoundary(x, y - 1);
    const bDown = isBoundary(x, y + 1);

    // 1. 如果左右两侧均为主屏障（墙体/暗墙/岩浆/外沿），门横跨走廊拦截南北通路 -> 必须横向平齐 (false)
    if (bLeft && bRight && !(bUp && bDown)) return false;

    // 2. 如果上下两侧均为主屏障，门纵跨走廊拦截东西通路 -> 必须纵向旋转 90 度 (true)
    if (bUp && bDown && !(bLeft && bRight)) return true;

    // 3. 关联同向门：如果与相邻门处于同一纵向走廊（上下相邻门），必须同为横向平齐 (false)
    if (isDoor(x, y - 1) || isDoor(x, y + 1)) return false;

    // 4. 关联同向门：如果与相邻门处于同一横向走廊（左右相邻门），必须同为纵向 (true)
    if (isDoor(x - 1, y) || isDoor(x + 1, y)) return true;

    // 5. 检查上下相邻的墙体是否属于横向墙链（即该墙左右也是墙体，形成东西向隔断）
    const downIsHWall = bDown && (isBoundary(x - 1, y + 1) || isBoundary(x + 1, y + 1));
    const upIsHWall = bUp && (isBoundary(x - 1, y - 1) || isBoundary(x + 1, y - 1));
    if (downIsHWall || upIsHWall) return false;

    // 6. 检查左右相邻的墙体是否属于纵向墙链（即该墙上下也是墙体，形成南北向隔断）
    const leftIsVWall = bLeft && (isBoundary(x - 1, y - 1) || isBoundary(x - 1, y + 1));
    const rightIsVWall = bRight && (isBoundary(x + 1, y - 1) || isBoundary(x + 1, y + 1));
    if (leftIsVWall || rightIsVWall) return true;

    // 7. 通行通道延伸判定：
    const isPassable = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return false;
      const t = layout[ty]?.[tx];
      if (!t) return true;
      return t.type !== 'wall' && t.type !== 'fake_wall' && t.type !== 'lava';
    };

    const vPass = (isPassable(x, y - 1) ? 1 : 0) + (isPassable(x, y + 1) ? 1 : 0);
    const hPass = (isPassable(x - 1, y) ? 1 : 0) + (isPassable(x + 1, y) ? 1 : 0);

    if (vPass > hPass) return false; // 南北通透走廊 -> 横向门拦截
    if (hPass > vPass) return true;  // 东西通透走廊 -> 纵向门拦截

    return false;
  }

  // 计算怪物的看门朝向（使其智能面向所看护的房门、关键隘口或通道）
  private getMonsterGuardRotation(layout: (Tile | null)[][], x: number, y: number): number {
    const isDoorTile = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return false;
      const t = layout[ty]?.[tx];
      return !!t && t.type.startsWith('door_');
    };

    const isWallTile = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return true;
      const t = layout[ty]?.[tx];
      return !!t && (t.type === 'wall' || t.type === 'fake_wall');
    };

    // 1. 在视线无墙体阻挡的方向优先查找门 (距离 1~4 格)
    const directions: { dx: number; dy: number; rot: number }[] = [
      { dx: -1, dy: 0, rot: -Math.PI / 2 }, // 西 / 左
      { dx: 1, dy: 0, rot: Math.PI / 2 },  // 东 / 右
      { dx: 0, dy: -1, rot: Math.PI },      // 北 / 上
      { dx: 0, dy: 1, rot: 0 },            // 南 / 下
    ];

    let closestDist = 999;
    let bestRot = 0;

    for (const d of directions) {
      for (let dist = 1; dist <= 4; dist++) {
        const tx = x + d.dx * dist;
        const ty = y + d.dy * dist;
        if (tx < 0 || tx > 10 || ty < 0 || ty > 10) break;
        if (isWallTile(tx, ty)) break; // 墙体遮挡视线
        if (isDoorTile(tx, ty)) {
          if (dist < closestDist) {
            closestDist = dist;
            bestRot = d.rot;
          }
          break;
        }
      }
    }

    if (closestDist < 999) {
      return bestRot;
    }

    // 2. 若正交直线无门，检查斜对角相邻门
    const diagonalNeighbors = [
      { dx: -1, dy: -1, rots: [-Math.PI / 2, Math.PI] },
      { dx: 1, dy: -1, rots: [Math.PI / 2, Math.PI] },
      { dx: -1, dy: 1, rots: [-Math.PI / 2, 0] },
      { dx: 1, dy: 1, rots: [Math.PI / 2, 0] },
    ];
    for (const diag of diagonalNeighbors) {
      const tx = x + diag.dx;
      const ty = y + diag.dy;
      if (isDoorTile(tx, ty)) {
        if (!isWallTile(x + diag.dx, y)) return diag.rots[0];
        if (!isWallTile(x, y + diag.dy)) return diag.rots[1];
      }
    }

    // 3. 检查是否在守护楼梯/传送光圈
    const isStairsTile = (tx: number, ty: number): boolean => {
      if (tx < 0 || tx > 10 || ty < 0 || ty > 10) return false;
      const t = layout[ty]?.[tx];
      return !!t && (t.type === 'stairs_up' || t.type === 'stairs_down');
    };
    for (const d of directions) {
      for (let dist = 1; dist <= 3; dist++) {
        const tx = x + d.dx * dist;
        const ty = y + d.dy * dist;
        if (tx < 0 || tx > 10 || ty < 0 || ty > 10) break;
        if (isWallTile(tx, ty)) break;
        if (isStairsTile(tx, ty)) return d.rot;
      }
    }

    return 0; // 默认面向南方 (0)
  }

  // 创建单格 3D 实体
  private buildTileObject(
    tile: Tile,
    theme: string,
    layout?: (Tile | null)[][],
    x?: number,
    y?: number
  ): THREE.Object3D | null {
    switch (tile.type) {
      case 'wall':
      case 'fake_wall':
        return ModelFactory.createWallMesh(theme, layout, x, y);
      case 'door_yellow':
        return ModelFactory.createDoorMesh('yellow');
      case 'door_blue':
        return ModelFactory.createDoorMesh('blue');
      case 'door_red':
        return ModelFactory.createDoorMesh('red');
      case 'door_iron':
        if (tile.itemType === 'center_fly') {
          return ModelFactory.createFlyerCageMesh();
        }
        return ModelFactory.createDoorMesh('iron');
      case 'monster':
        if (tile.monsterId) {
          return ModelFactory.createMonsterMesh(tile.monsterId);
        }
        return null;
      case 'item':
        if (tile.itemType) {
          return ModelFactory.createItemMesh(tile.itemType);
        }
        return null;
      case 'stairs_up':
        return ModelFactory.createStairsMesh(true);
      case 'stairs_down':
        return ModelFactory.createStairsMesh(false);
      case 'shop':
        return ModelFactory.createShopMesh(true);
      case 'npc': {
        if (tile.npcId === 'honor_monument' || tile.npcId === 'monument') return ModelFactory.createHonorMonumentMesh();
        if (tile.npcId === 'fairy') return ModelFactory.createFairyMesh();
        if (tile.npcId === 'elder_exp') return ModelFactory.createOldManMesh('exp');
        if (tile.npcId === 'old_man_manual' || tile.npcId === 'elder' || tile.npcId === 'old_man') return ModelFactory.createOldManMesh('normal');
        if (tile.npcId === 'trader' || tile.npcId === 'merchant') return ModelFactory.createTraderMesh();
        if (tile.npcId === 'thief') return ModelFactory.createThiefMesh();
        if (tile.npcId === 'princess') return ModelFactory.createPrincessMesh();
        return ModelFactory.createOldManMesh('normal');
      }
      case 'lava':
        return ModelFactory.createLavaMesh();
      default:
        return null;
    }
  }

  // 移除地图上某格瓦片（附带开门动画或消散动画）
  public removeTile(x: number, y: number, isDoor: boolean = false) {
    const key = `${x}_${y}`;
    const mesh = this.tileMeshes.get(key);
    if (!mesh) return;

    if (isDoor) {
      // 开启门动画：向两侧纯平移滑入墙体
      // 1. 先克隆材质以隔离变更
      mesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          if (m.material) {
            m.material = Array.isArray(m.material)
              ? m.material.map((mat) => mat.clone())
              : m.material.clone();
          }
        }
      });

      // 2. 计算世界空间裁剪面：门扇超出瓦片边界(±0.5)后被裁剪，视觉上缩入墙体消失
      const doorObj = mesh as THREE.Group;
      doorObj.updateMatrixWorld(true);
      // 本地空间：保留 x ∈ [-0.5, 0.5] 范围内的几何体
      const clipLeft = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.5);
      const clipRight = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.5);
      // 变换到世界空间 (自动适配门的旋转，如纵向门 rotation.y = π/2)
      clipLeft.applyMatrix4(doorObj.matrixWorld);
      clipRight.applyMatrix4(doorObj.matrixWorld);

      // 3. 将裁剪面应用到所有克隆材质上
      doorObj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          if (m.material) {
            const applyClip = (mat: THREE.Material) => {
              (mat as any).clippingPlanes = [clipLeft, clipRight];
              (mat as any).clipShadows = true;
              mat.needsUpdate = true;
            };
            if (Array.isArray(m.material)) {
              m.material.forEach(applyClip);
            } else {
              applyClip(m.material);
            }
          }
        }
      });

      this.openingDoors.push({
        group: doorObj,
        startTime: performance.now(),
        duration: 450,
      });
      this.tileMeshes.delete(key);
      this.animatedItems = this.animatedItems.filter((item) => item.mesh !== mesh);
    } else {
      // 普通物品 / 怪物拾取后淡出并移除
      this.floorGroup.remove(mesh);
      this.tileMeshes.delete(key);
      this.animatedItems = this.animatedItems.filter((item) => item.mesh !== mesh);
    }
  }

  // 动态在场景中生成或替换瓦片三维模型 (如暗墙粉碎后显现隐藏宝物/怪物/小偷铁铲)
  public spawnTile(x: number, y: number, tile: Tile, theme: string = 'magma', layout?: (Tile | null)[][]) {
    this.removeTile(x, y, false);
    if (!tile || tile.type === 'floor') return;
    const tileObj = this.buildTileObject(tile, theme, layout, x, y);
    if (tileObj) {
      const world = ThreeCanvas.gridToWorld(x, y);
      tileObj.position.set(world.x, 0, world.z);

      tileObj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const isTransparent = Array.isArray(mesh.material)
            ? mesh.material.some((m) => m.transparent)
            : (mesh.material as THREE.Material)?.transparent;
          if (
            mesh.name.includes('rune') ||
            mesh.name.includes('ring') ||
            mesh.name.includes('face') ||
            isTransparent
          ) {
            mesh.castShadow = false;
          } else {
            mesh.castShadow = true;
          }
          mesh.receiveShadow = true;
        }
      });

      this.floorGroup.add(tileObj);
      this.tileMeshes.set(`${x}_${y}`, tileObj);

      if (tile.type === 'item') {
        this.animatedItems.push({
          type: 'item_rotate',
          mesh: tileObj,
          initialX: world.x,
          initialY: 0.15,
        });
      } else if (tile.type === 'monster') {
        const heroWorld = ThreeCanvas.gridToWorld(this.playerGridPos.x, this.playerGridPos.y);
        const dx = heroWorld.x - world.x;
        const dz = heroWorld.z - world.z;
        tileObj.rotation.y = Math.atan2(dx, dz);
        if (tileObj.name.includes('slime')) {
          this.animatedItems.push({
            type: 'slime',
            mesh: tileObj,
            initialX: world.x,
            initialY: 0,
            baseScale: tileObj.scale.clone(),
          });
        }
      }
    }
  }

  // 更新玩家位置与朝向（平滑移动与踏步）
  public updatePlayer(x: number, y: number, facing: Direction, immediate: boolean = false) {
    const posChanged = x !== this.playerGridPos.x || y !== this.playerGridPos.y;
    this.playerGridPos = { x, y };
    this.playerFacing = facing;
    const world = ThreeCanvas.gridToWorld(x, y);

    this.heroTargetPos.set(world.x, 0, world.z);
    if (immediate) {
      this.heroCurrentPos.copy(this.heroTargetPos);
      this.heroWalkProgress = 1.0;
      this.calculateCameraTargets();
      this.camera.position.copy(this.cameraTargetPos);
      this.cameraCurrentLook.copy(this.cameraTargetLook);
      this.camera.lookAt(this.cameraCurrentLook);
    } else if (posChanged) {
      this.heroWalkProgress = 0.0;
      // 勇士走动时，若视角被拖拽偏移，逐步回弹靠近主角
      if (this.targetPanOffset.lengthSq() > 0.05) {
        this.targetPanOffset.multiplyScalar(0.75);
        if (this.targetPanOffset.lengthSq() < 0.05) this.targetPanOffset.set(0, 0);
        this.notifyCameraStateChange();
      }
    } else {
      this.heroWalkProgress = 1.0;
      this.heroCurrentPos.copy(this.heroTargetPos);
    }

    // 朝向旋转
    if (this.heroGroup) {
      let targetRot = 0;
      if (facing === 'down') targetRot = 0;
      else if (facing === 'up') targetRot = Math.PI;
      else if (facing === 'right') targetRot = Math.PI / 2;
      else if (facing === 'left') targetRot = -Math.PI / 2;
      this.heroGroup.rotation.y = targetRot;
    }
  }

  // 寻路目标信标指示器 (Path Target Marker)
  public setPathTarget(gridX: number, gridY: number) {
    if (!this.pathMarker) {
      const geo = new THREE.RingGeometry(0.18, 0.30, 24);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      this.pathMarker = new THREE.Mesh(geo, mat);
      this.pathMarker.rotation.x = -Math.PI / 2;
      this.pathMarker.name = 'path_marker';
      this.pathMarker.renderOrder = 20;
      this.scene.add(this.pathMarker);
    }
    const world = ThreeCanvas.gridToWorld(gridX, gridY);
    this.pathMarker.position.set(world.x, 0.025, world.z);
    this.pathMarker.visible = true;
  }

  public clearPathTarget() {
    if (this.pathMarker) {
      this.pathMarker.visible = false;
    }
  }

  // 瓦片检视选中指示器 (Selection Marker)
  public setSelectedTile(gridX: number | null, gridY: number | null) {
    if (gridX === null || gridY === null || gridX < 0 || gridX > 10 || gridY < 0 || gridY > 10) {
      this.selectedTilePos = null;
      if (this.selectionMarker) {
        this.selectionMarker.visible = false;
      }
      return;
    }

    this.selectedTilePos = { x: gridX, y: gridY };
    if (!this.selectionMarker) {
      this.selectionMarker = ModelFactory.createSelectionMarkerMesh();
      this.scene.add(this.selectionMarker);
    }

    const world = ThreeCanvas.gridToWorld(gridX, gridY);
    this.selectionMarker.position.set(world.x, 0.03, world.z);
    this.selectionMarker.visible = true;
  }

  public getSelectedTile(): { x: number; y: number } | null {
    return this.selectedTilePos;
  }

  // 添加 3D 浮动文字（伤害 / 获得物品）
  public addFloatingText(text: string, color: string, gridX: number, gridY: number) {
    const world = ThreeCanvas.gridToWorld(gridX, gridY);
    this.floatingTexts.push({
      id: Math.random().toString(36).substring(2, 9),
      text,
      color,
      x: world.x,
      y: 0.8,
      z: world.z,
      opacity: 1.0,
      createdAt: performance.now(),
    });
  }

  // 主渲染循环 (严格限制在 60 FPS，杜绝 120Hz/144Hz 高刷下过载发热与风扇狂转)
  private startLoop() {
    let lastTime = performance.now();
    let lastRenderTime = performance.now();

    const animate = (time: number) => {
      // 节流帧率：两次渲染间隔至少 ~15.5ms (≈ 60fps)
      const timeSinceLastRender = time - lastRenderTime;
      if (timeSinceLastRender < 15.5) {
        this.reqId = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      lastRenderTime = time;

      // 1. 勇士移动插值与踏步弹跳
      if (this.heroWalkProgress < 1.0) {
        this.heroWalkProgress = Math.min(1.0, this.heroWalkProgress + delta * 9.0);
        this.heroCurrentPos.lerp(this.heroTargetPos, 0.35);

        if (this.heroGroup) {
          const bob = Math.sin(this.heroWalkProgress * Math.PI) * 0.12;
          this.heroGroup.position.set(this.heroCurrentPos.x, bob, this.heroCurrentPos.z);
        }
      } else if (this.heroGroup) {
        this.heroGroup.position.set(this.heroTargetPos.x, 0, this.heroTargetPos.z);
        this.heroCurrentPos.copy(this.heroTargetPos);
      }

      // 随身火把跟随
      this.playerTorchLight.position.set(
        this.heroCurrentPos.x,
        1.2 + Math.sin(time * 0.005) * 0.04,
        this.heroCurrentPos.z
      );
      this.playerTorchLight.intensity = 1.35 + Math.sin(time * 0.01) * 0.1;

      // 2. 摄像机视角插值
      this.updateCamera(delta);

      // 3. 场景中动态物体待机动画（极速单项更新，零遍历开销）
      this.animateSceneObjects(time, delta);

      // 4. 门开启升降动画更新
      this.updateOpeningDoors(time);

      // 5. 渲染输出
      this.renderer.render(this.scene, this.camera);
      this.reqId = requestAnimationFrame(animate);
    };

    this.reqId = requestAnimationFrame(animate);
  }

  // 计算摄像机位置与焦点目标 (策略俯视视角，支持平移、Ctrl+滚轮缩放、Shift+拖拽自由旋转)
  private calculateCameraTargets() {
    const heroX = this.heroCurrentPos.x;
    const heroZ = this.heroCurrentPos.z;

    const focusX = heroX + this.panOffset.x;
    const focusZ = heroZ + this.panOffset.y;
    const zoomFactor = 1.0 / this.currentZoom;

    const radius = 11.5 * zoomFactor;
    const sinPitch = Math.sin(this.cameraPitch);
    const cosPitch = Math.cos(this.cameraPitch);
    const sinYaw = Math.sin(this.cameraYaw);
    const cosYaw = Math.cos(this.cameraYaw);

    const camX = focusX + radius * cosPitch * sinYaw;
    const camY = 0.4 + radius * sinPitch;
    const camZ = focusZ + radius * cosPitch * cosYaw;

    this.cameraTargetPos.set(camX, camY, camZ);
    this.cameraTargetLook.set(focusX, 0.4, focusZ);
  }

  // 计算摄像机位置与平滑插值
  private updateCamera(delta: number) {
    // 平滑插值视口缩放、平移偏移量以及相机旋转角 (Yaw / Pitch)
    this.currentZoom = THREE.MathUtils.lerp(this.currentZoom, this.targetZoom, 0.18);
    this.panOffset.lerp(this.targetPanOffset, 0.22);
    this.cameraYaw = THREE.MathUtils.lerp(this.cameraYaw, this.targetCameraYaw, 0.18);
    this.cameraPitch = THREE.MathUtils.lerp(this.cameraPitch, this.targetCameraPitch, 0.18);

    this.calculateCameraTargets();

    // 平滑插值摄像机位置与注视点
    const lerpSpeed = 0.14;
    this.camera.position.lerp(this.cameraTargetPos, lerpSpeed);
    this.cameraCurrentLook.lerp(this.cameraTargetLook, lerpSpeed);
    this.camera.lookAt(this.cameraCurrentLook);
  }

  // 场景物体微动与悬浮自转 (直接遍历极小规模注册列表，零递归查询)
  private animateSceneObjects(time: number, delta: number) {
    const sec = time * 0.001;

    for (let i = 0; i < this.animatedItems.length; i++) {
      const item = this.animatedItems[i];
      const mesh = item.mesh;

      if (item.type === 'item_rotate') {
        mesh.rotation.y += delta * 2.2;
        mesh.position.y = Math.sin(sec * 3.5 + item.initialX * 2) * 0.06;
      } else if (item.type === 'shop') {
        if (item.crystal) {
          item.crystal.rotation.y += delta * 1.5;
          item.crystal.position.y = 0.74 + Math.sin(sec * 2.5) * 0.02;
        }
        if (item.shopkeeper) {
          item.shopkeeper.position.y = Math.sin(sec * 2.2) * 0.012;
        }
        if (item.lanternL) {
          item.lanternL.rotation.z = Math.sin(sec * 2.0) * 0.05;
        }
        if (item.lanternR) {
          item.lanternR.rotation.z = Math.cos(sec * 2.0) * 0.05;
        }
      } else if (item.type === 'altar') {
        if (item.crystal) {
          item.crystal.rotation.y += delta * 1.8;
          item.crystal.rotation.x = Math.sin(sec * 2) * 0.2;
          item.crystal.position.y = 0.65 + Math.sin(sec * 3) * 0.08;
        }
      } else if (item.type === 'fairy') {
        const flutter = Math.sin(sec * 10) * 0.24;
        if (item.wingL) item.wingL.rotation.y = -flutter;
        if (item.wingR) item.wingR.rotation.y = flutter;
        if (item.wandStar) item.wandStar.rotation.y += delta * 2.6;
        if (item.rune) item.rune.rotation.z += delta * 0.35;
        mesh.position.y = Math.sin(sec * 2.5) * 0.04;
      } else if (item.type === 'slime') {
        // 怪物实时朝向主角
        const dx = this.heroCurrentPos.x - mesh.position.x;
        const dz = this.heroCurrentPos.z - mesh.position.z;
        if (dx * dx + dz * dz > 0.001) {
          const targetAngle = Math.atan2(dx, dz);
          let diff = targetAngle - mesh.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          mesh.rotation.y += diff * Math.min(1.0, delta * 8.0);
        }

        const sx = item.baseScale ? item.baseScale.x : 1.0;
        const sy = item.baseScale ? item.baseScale.y : 1.0;
        const sz = item.baseScale ? item.baseScale.z : 1.0;
        const scaleY = 0.84 + Math.sin(sec * 4.0 + item.initialX * 1.5) * 0.08;
        const scaleXZ = 1.08 - Math.sin(sec * 4.0 + item.initialX * 1.5) * 0.05;
        mesh.scale.set(sx * scaleXZ, sy * scaleY, sz * scaleXZ);
      } else if (item.type === 'bat') {
        // 怪物实时朝向主角
        const dx = this.heroCurrentPos.x - mesh.position.x;
        const dz = this.heroCurrentPos.z - mesh.position.z;
        if (dx * dx + dz * dz > 0.001) {
          const targetAngle = Math.atan2(dx, dz);
          let diff = targetAngle - mesh.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          mesh.rotation.y += diff * Math.min(1.0, delta * 8.0);
        }

        mesh.position.y = 0.15 + Math.sin(sec * 6.0 + item.initialX * 2.0) * 0.08;
        if (item.batWingL && item.batWingR) {
          // 水平展翅上下扑击 (Flapping downwards against air)
          const flap = Math.sin(sec * 14.0 + item.initialX * 3.0) * 0.38;
          const pitch = Math.cos(sec * 14.0 + item.initialX * 3.0) * 0.12;
          item.batWingL.rotation.z = 0.15 - flap;
          item.batWingL.rotation.x = 0.08 + pitch;
          item.batWingR.rotation.z = -0.15 + flap;
          item.batWingR.rotation.x = 0.08 + pitch;
        }
      } else if (item.type === 'monster_idle') {
        // 怪物实时朝向主角
        const dx = this.heroCurrentPos.x - mesh.position.x;
        const dz = this.heroCurrentPos.z - mesh.position.z;
        if (dx * dx + dz * dz > 0.001) {
          const targetAngle = Math.atan2(dx, dz);
          let diff = targetAngle - mesh.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          mesh.rotation.y += diff * Math.min(1.0, delta * 8.0);
        }

        const sx = item.baseScale ? item.baseScale.x : 1.0;
        const sy = item.baseScale ? item.baseScale.y : 1.0;
        const sz = item.baseScale ? item.baseScale.z : 1.0;
        const name = item.mesh.name;
        if (name.includes('mage') || name.includes('vampire')) {
          // 法师与吸血鬼：神秘暗夜悬浮漂移与微幅升沉
          mesh.position.y = 0.03 + Math.sin(sec * 2.6 + item.initialX * 2.0) * 0.035;
        } else if (name.includes('octopus') || name.includes('dragon') || name.includes('boss') || name.includes('demon_lord')) {
          // 巨型领主与魔王：浑厚威压脉动与呼吸
          const breath = Math.sin(sec * 2.2 + item.initialX) * 0.025;
          mesh.scale.set(sx * (1 + breath * 0.4), sy * (1 + breath), sz * (1 + breath * 0.4));
          mesh.position.y = Math.sin(sec * 2.0 + item.initialX) * 0.015;

          // 终极真魔王双翼轻缓威仪展开挥动
          if (name.includes('demon_lord')) {
            const wingL = mesh.getObjectByName('wing_l');
            const wingR = mesh.getObjectByName('wing_r');
            const flap = Math.sin(sec * 2.2) * 0.12;
            if (wingL) wingL.rotation.y = -flap;
            if (wingR) wingR.rotation.y = flap;
          }
        } else {
          // 骷髅、守卫与骑士：持械警戒呼吸微动
          const breath = Math.sin(sec * 2.8 + item.initialX * 2.0) * 0.02;
          mesh.scale.set(sx * (1 + breath * 0.3), sy * (1 + breath), sz * (1 + breath * 0.3));
          mesh.position.y = Math.sin(sec * 2.8 + item.initialX * 2.0) * 0.012;
        }
      } else if (item.type === 'giant_squid') {
        if (item.mantle) {
          const breath = 1.0 + Math.sin(sec * 1.8) * 0.03;
          item.mantle.scale.set(breath, 1.0 + Math.cos(sec * 1.8) * 0.02, breath);
        }
        if (item.leftFlank) {
          item.leftFlank.rotation.z = Math.sin(sec * 2.2) * 0.06;
          item.leftFlank.rotation.y = Math.cos(sec * 1.6) * 0.04;
        }
        if (item.rightFlank) {
          item.rightFlank.rotation.z = -Math.sin(sec * 2.2 + 0.8) * 0.06;
          item.rightFlank.rotation.y = -Math.cos(sec * 1.6 + 0.8) * 0.04;
        }
        if (item.strikingL) {
          item.strikingL.rotation.x = Math.sin(sec * 2.5) * 0.12;
          item.strikingL.rotation.z = Math.cos(sec * 2.0) * 0.08;
        }
        if (item.strikingR) {
          item.strikingR.rotation.x = Math.cos(sec * 2.5) * 0.12;
          item.strikingR.rotation.z = -Math.sin(sec * 2.0) * 0.08;
        }
        if (item.finL) {
          item.finL.rotation.z = Math.sin(sec * 2.0) * 0.10;
        }
        if (item.finR) {
          item.finR.rotation.z = -Math.sin(sec * 2.0) * 0.10;
        }
        mesh.position.y = (item.initialY ?? 0) + Math.sin(sec * 1.6) * 0.025;
      } else if (item.type === 'portal') {
        // 1. 空心柱表面箭头流动 (Flowing Arrows on Light Wall Cylinder)
        if (item.portalCylinder) {
          const mat = item.portalCylinder.material as THREE.MeshStandardMaterial;
          if (mat && mat.map) {
            // isUp: 箭头朝上流动 (offset.y 递减使纹理贴图向上平移)；!isUp: offset.y 递增使贴图向下平移
            const flowSpeed = 0.65;
            const dir = item.isUp ? -1 : 1;
            mat.map.offset.y = (mat.map.offset.y + dir * flowSpeed * delta) % 1.0;
            if (mat.emissiveMap) {
              mat.emissiveMap.offset.y = mat.map.offset.y;
            }
            if (mat.opacity !== undefined) {
              mat.opacity = 0.80 + Math.sin(sec * 3.0) * 0.08;
            }
          }
          const pulse = Math.sin(sec * 3.2) * 0.018;
          item.portalCylinder.scale.set(1 + pulse, 1, 1 + pulse);
        }

        // 2. 地面发光霓虹圈呼吸微动
        if (item.portalGroundRing) {
          const ringScale = 1 + Math.sin(sec * 2.6) * 0.012;
          item.portalGroundRing.scale.set(ringScale, ringScale, ringScale);
        }

        // 3. 浮空能量光环沿空心柱上下漂移和缓动自转
        if (item.portalFloatRings) {
          item.portalFloatRings.rotation.y += delta * 0.6;
          const ring1 = item.portalFloatRings.getObjectByName('float_ring_1');
          const ring2 = item.portalFloatRings.getObjectByName('float_ring_2');
          if (ring1) {
            ring1.position.y = 0.36 + Math.sin(sec * 2.2) * 0.10;
          }
          if (ring2) {
            ring2.position.y = 0.88 + Math.sin(sec * 2.2 + Math.PI) * 0.10;
          }
        }
      } else if (item.type === 'npc') {
        if (item.bubble) {
          item.bubble.position.y = 1.25 + Math.sin(sec * 2.8) * 0.04;
        }
        if (item.halo) {
          item.halo.rotation.z += delta * 0.8;
        }
      } else if (item.type === 'lava') {
        const pulse = Math.sin(sec * 3.5 + item.initialX * 2.0 + item.initialY * 2.0) * 0.5 + 0.5;
        if (item.bubble) {
          item.bubble.scale.setScalar(0.75 + pulse * 0.5);
          item.bubble.position.y = 0.02 + pulse * 0.03;
        }
      }
    }

    // 寻路目标光环缓动自转
    if (this.pathMarker && this.pathMarker.visible) {
      this.pathMarker.rotation.z += delta * 3.5;
    }

    // 选中光标缓动微呼吸
    if (this.selectionMarker && this.selectionMarker.visible) {
      const ring = this.selectionMarker.getObjectByName('selection_ring');
      if (ring) {
        ring.rotation.z += delta * 1.5;
      }
    }
  }

  // 门开启平移进墙裁剪动画 (门扇纯平直滑入两侧墙体，裁剪面使其自然消失于墙内)
  private updateOpeningDoors(now: number) {
    for (let i = this.openingDoors.length - 1; i >= 0; i--) {
      const item = this.openingDoors[i];
      const elapsed = now - item.startTime;
      const p = Math.min(1.0, elapsed / item.duration);
      const ease = 1 - Math.pow(1 - p, 3); // 丝滑立方缓出 (Cubic Ease Out)

      const leafL = item.group.getObjectByName('door_leaf_l');
      const leafR = item.group.getObjectByName('door_leaf_r');

      if (leafL && leafR) {
        // 双扇平开：左右门扇纯平直向两侧滑入墙体内 (裁剪面在瓦片边界 ±0.5 处截断)
        leafL.position.x = -ease * 0.54;
        leafR.position.x = ease * 0.54;
      } else {
        const panel = item.group.getObjectByName('door_panel');
        if (panel) {
          panel.scale.x = Math.max(0.01, 1 - ease);
        }
      }

      // 动画完毕，从场景中移除门对象
      if (p >= 1.0) {
        this.floorGroup.remove(item.group);
        this.openingDoors.splice(i, 1);
      }
    }
  }

  // 窗口重置
  private onResize = () => {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const w = rect.width || this.container.clientWidth;
    const h = rect.height || this.container.clientHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // 鼠标与手势交互事件处理
  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // 移动端双指触控手势处理 (双指 Pinch 缩放与双指滑动旋转视角)
  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      this.isTwoFingerGesture = true;
      this.hasTwoFingerMoved = false;
      this.isDragging = false;
      this.dragMode = 'none';
      this.pointerDownOnCanvas = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.lastTouchDistance = Math.hypot(dx, dy);
      this.lastTouchCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      if (e.cancelable) e.preventDefault();
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.hypot(dx, dy);
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      const deltaDist = newDistance - this.lastTouchDistance;
      const deltaCenterX = centerX - this.lastTouchCenter.x;
      const deltaCenterY = centerY - this.lastTouchCenter.y;

      if (Math.abs(deltaDist) > 2 || Math.hypot(deltaCenterX, deltaCenterY) > 2) {
        this.hasTwoFingerMoved = true;
      }

      // 双指 Pinch 缩放 (两指聚拢缩小、张开放大)
      if (Math.abs(deltaDist) > 0.5) {
        this.setZoom(this.targetZoom + deltaDist * 0.005);
      }

      // 双指同向滑动旋转视角 (水平 Yaw 偏航角与垂直 Pitch 俯仰角)
      if (Math.hypot(deltaCenterX, deltaCenterY) > 0.5) {
        this.targetCameraYaw -= deltaCenterX * 0.008;
        this.targetCameraPitch = THREE.MathUtils.clamp(
          this.targetCameraPitch + deltaCenterY * 0.006,
          0.35,
          1.45
        );
        this.notifyCameraStateChange();
      }

      this.lastTouchDistance = newDistance;
      this.lastTouchCenter = { x: centerX, y: centerY };
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      this.isTwoFingerGesture = false;
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    if (this.isTwoFingerGesture) {
      this.pointerDownOnCanvas = false;
      return;
    }
    if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
    // 若点击目标不是 3D 画布（如卡片、按钮等 DOM UI），交由 DOM 元素自身响应，不捕获指针也不干扰
    if (e.target !== this.renderer.domElement) {
      this.pointerDownOnCanvas = false;
      return;
    }
    this.pointerDownOnCanvas = true;

    this.lastPointerPos = { x: e.clientX, y: e.clientY };
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    this.initialPanOffset = { x: this.targetPanOffset.x, y: this.targetPanOffset.y };
    this.isPanMoved = false;

    if (e.button === 0) {
      if (e.shiftKey) {
        // Shift + 左键拖动 -> 旋转视角
        this.isDragging = true;
        this.dragMode = 'rotate';
        this.container.style.cursor = 'crosshair';
      } else {
        // 电脑版常规左键拖拽 / 手机版单指拖拽 -> 平移地图
        this.isDragging = true;
        this.dragMode = 'pan';
        this.container.style.cursor = 'grabbing';
      }
    } else if (e.button === 1) {
      // 中键拖动平移
      this.isDragging = true;
      this.dragMode = 'pan';
      this.container.style.cursor = 'grabbing';
    } else if (e.button === 2) {
      this.isDragging = false;
      this.dragMode = 'none';
    }

    try {
      this.container.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging || this.dragMode === 'none') return;
    const dx = e.clientX - this.lastPointerPos.x;
    const dy = e.clientY - this.lastPointerPos.y;
    this.lastPointerPos = { x: e.clientX, y: e.clientY };

    if (this.dragMode === 'rotate') {
      // Shift + 左键拖动：自由旋转视角 (Yaw & Pitch) - 水平旋转方向反转，符合直觉操作
      this.targetCameraYaw -= dx * 0.008;
      this.targetCameraPitch = THREE.MathUtils.clamp(
        this.targetCameraPitch + dy * 0.006,
        0.35,
        1.45
      );
      this.notifyCameraStateChange();
    } else if (this.dragMode === 'pan') {
      // 电脑端左键拖拽 / 手机端单指拖拽：平移视角和地图，保持摄像机角度绝对不变
      const totalDist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      if (totalDist < 6 && !this.isPanMoved) {
        // 6px 防抖死区，避免轻触或单击目标时发生微晃
        return;
      }
      this.isPanMoved = true;

      const panFactor = (1.0 / this.currentZoom) * 0.016;
      const cosY = Math.cos(this.cameraYaw);
      const sinY = Math.sin(this.cameraYaw);

      const screenDx = -dx * panFactor;
      const screenDz = -dy * panFactor * 1.35;

      this.targetPanOffset.x += screenDx * cosY + screenDz * sinY;
      this.targetPanOffset.y += -screenDx * sinY + screenDz * cosY;

      this.targetPanOffset.x = THREE.MathUtils.clamp(this.targetPanOffset.x, -12, 12);
      this.targetPanOffset.y = THREE.MathUtils.clamp(this.targetPanOffset.y, -12, 12);
      this.notifyCameraStateChange();
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    if (this.hasTwoFingerMoved || this.isTwoFingerGesture) {
      this.hasTwoFingerMoved = false;
      this.pointerDownOnCanvas = false;
      this.isDragging = false;
      this.dragMode = 'none';
      try {
        this.container.releasePointerCapture(e.pointerId);
      } catch (_) {}
      return;
    }

    if (!this.pointerDownOnCanvas) return;
    this.pointerDownOnCanvas = false;

    this.isDragging = false;
    this.dragMode = 'none';
    this.container.style.cursor = 'grab';

    try {
      this.container.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);

    // 1. 左键/触屏单击与双击判定 (位移 < 10px 判定为点击，若位移 >= 10px 则为拖拽平移地图)
    if (e.button === 0 && dist < 10 && !e.shiftKey) {
      // 纯净点击：若微位移在 6~9px 之间，无缝复位初始平移位置确保完全零漂移
      if (this.isPanMoved) {
        this.targetPanOffset.x = this.initialPanOffset.x;
        this.targetPanOffset.y = this.initialPanOffset.y;
        this.notifyCameraStateChange();
      }
      const coords = this.raycastToGrid(e.clientX, e.clientY);
      const now = performance.now();
      const timeSinceLast = now - this.lastLeftClickTime;
      const posDist = Math.hypot(
        e.clientX - this.lastLeftClickPos.x,
        e.clientY - this.lastLeftClickPos.y
      );

      // 触屏双击自动寻路判定 (仅在手机触屏 touch 下支持双击寻路；电脑端鼠标左键双击严禁自动寻路，必须且只能右键双击寻路)
      if (
        e.pointerType === 'touch' &&
        timeSinceLast < 380 &&
        posDist < 35 &&
        coords &&
        this.lastLeftClickCoords &&
        coords.gridX === this.lastLeftClickCoords.gridX &&
        coords.gridY === this.lastLeftClickCoords.gridY
      ) {
        this.lastLeftClickTime = 0;
        this.lastLeftClickCoords = null;
        if (this.onDoubleClickTile) {
          this.onDoubleClickTile(coords.gridX, coords.gridY);
        }
        return;
      }

      this.lastLeftClickTime = now;
      this.lastLeftClickPos = { x: e.clientX, y: e.clientY };
      this.lastLeftClickCoords = coords;

      if (coords) {
        if (this.onSelectTile) {
          this.onSelectTile(coords.gridX, coords.gridY);
        }
      } else {
        if (this.onSelectTile) {
          this.onSelectTile(-1, -1);
        }
      }
      return;
    }

    // 2. 电脑端右键点击：双击自动寻路判定 (位移 < 8px，仅右键双击生效)
    if (e.button === 2 && dist < 8) {
      const now = performance.now();
      const timeSinceLast = now - this.lastRightClickTime;
      const posDist = Math.hypot(
        e.clientX - this.lastRightClickPos.x,
        e.clientY - this.lastRightClickPos.y
      );

      if (timeSinceLast < 380 && posDist < 20) {
        // 电脑端右键双击自动寻路！
        this.lastRightClickTime = 0;
        const coords = this.raycastToGrid(e.clientX, e.clientY);
        if (coords) {
          if (this.onRightDoubleClickTile) {
            this.onRightDoubleClickTile(coords.gridX, coords.gridY);
          }
        }
      } else {
        this.lastRightClickTime = now;
        this.lastRightClickPos = { x: e.clientX, y: e.clientY };
      }
    }
  };

  // 转换屏幕点击坐标至 11x11 地图网格坐标
  public raycastToGrid(clientX: number, clientY: number): { gridX: number; gridY: number } | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);

    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);

    // 1. 优先检测 3D 实体对象 (怪物、NPC、道具、门、祭坛等)
    const targetObjects: THREE.Object3D[] = [];
    this.tileMeshes.forEach((mesh) => targetObjects.push(mesh));

    const intersects = this.raycaster.intersectObjects(targetObjects, true);
    if (intersects.length > 0) {
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr.parent && curr.parent !== this.floorGroup && curr.parent !== this.scene) {
          curr = curr.parent;
        }
        if (curr) {
          const hitGridX = Math.round(hit.point.x + 5);
          const hitGridY = Math.round(hit.point.z + 5);
          if (hitGridX >= 0 && hitGridX <= 10 && hitGridY >= 0 && hitGridY <= 10) {
            if (this.tileMeshes.get(`${hitGridX}_${hitGridY}`) === curr) {
              return { gridX: hitGridX, gridY: hitGridY };
            }
          }

          for (const [key, obj] of this.tileMeshes.entries()) {
            if (obj === curr) {
              const [xStr, yStr] = key.split('_');
              const gx = parseInt(xStr, 10);
              const gy = parseInt(yStr, 10);
              if (!isNaN(gx) && !isNaN(gy) && gx >= 0 && gx <= 10 && gy >= 0 && gy <= 10) {
                return { gridX: gx, gridY: gy };
              }
            }
          }
        }
      }
    }

    // 2. 与水平地面平面 y = 0 相交
    const hitPoint = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      hitPoint
    );

    if (hit) {
      const gridX = Math.round(hitPoint.x + 5);
      const gridY = Math.round(hitPoint.z + 5);
      if (gridX >= 0 && gridX <= 10 && gridY >= 0 && gridY <= 10) {
        return { gridX, gridY };
      }
    }

    return null;
  }

  private onWheel = (e: WheelEvent) => {
    // 严格限制：只有按住 Ctrl (或 macOS 的 Cmd) 时才允许缩放，避免普通上/下滚动误触缩放
    if (!e.ctrlKey && !e.metaKey) {
      return;
    }
    e.preventDefault();
    const delta = -e.deltaY * 0.008;
    this.setZoom(this.targetZoom + delta);
  };

  private notifyCameraStateChange() {
    if (this.onCameraStateChange) {
      const isModified =
        this.targetPanOffset.lengthSq() > 0.05 ||
        Math.abs(this.targetZoom - 1.0) > 0.05 ||
        Math.abs(this.targetCameraYaw) > 0.05 ||
        Math.abs(this.targetCameraPitch - 0.85) > 0.05;
      this.onCameraStateChange(this.targetZoom, isModified);
    }
  }

  // 公共视口控制 API
  public setZoom(zoom: number) {
    this.targetZoom = THREE.MathUtils.clamp(zoom, 0.45, 2.2);
    this.notifyCameraStateChange();
  }

  public zoomIn(step: number = 0.15) {
    this.setZoom(this.targetZoom + step);
  }

  public zoomOut(step: number = 0.15) {
    this.setZoom(this.targetZoom - step);
  }

  public resetCameraView() {
    this.targetPanOffset.set(0, 0);
    this.targetZoom = 1.0;
    this.targetCameraYaw = 0;
    this.targetCameraPitch = 0.85;
    this.notifyCameraStateChange();
  }

  public getZoom(): number {
    return this.targetZoom;
  }

  public getCameraYaw(): number {
    return this.cameraYaw;
  }

  // 销毁引擎
  public dispose() {
    window.removeEventListener('resize', this.onResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('wheel', this.onWheel);
    this.container.removeEventListener('contextmenu', this.onContextMenu);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchend', this.onTouchEnd);
    this.container.removeEventListener('touchcancel', this.onTouchEnd);
    if (this.reqId) cancelAnimationFrame(this.reqId);
    if (this.selectionMarker) {
      this.scene.remove(this.selectionMarker);
    }
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
