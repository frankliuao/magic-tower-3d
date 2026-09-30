// src/engine/MonsterThumbnailRenderer.ts
import * as THREE from 'three';
import { ModelFactory } from './ModelFactory';
import { MONSTERS } from '../data/monsters';

/**
 * 3D 怪物模型离线高质量 2D 肖像快照渲染器
 * 将 3D 角色网格以专业三点布光渲染为 128x128 透明背景 PNG 图标，
 * 并缓存在内存中供怪物手册与战斗界面使用。
 */
export class MonsterThumbnailRenderer {
  private static cache: Map<string, string> = new Map();
  private static renderer: THREE.WebGLRenderer | null = null;
  private static scene: THREE.Scene | null = null;
  private static camera: THREE.PerspectiveCamera | null = null;
  private static initialized: boolean = false;

  private static init() {
    if (this.initialized) return;
    this.initialized = true;

    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'low-power',
      });
      this.renderer.setSize(128, 128);
      this.renderer.setPixelRatio(1);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);

      // 三点摄影棚级别灯光
      const ambient = new THREE.AmbientLight(0xffffff, 0.95);
      const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
      keyLight.position.set(3.0, 4.5, 3.5);

      const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
      fillLight.position.set(-3.0, 1.5, 2.0);

      const rimLight = new THREE.DirectionalLight(0xfef08a, 0.85);
      rimLight.position.set(-1.5, 3.0, -3.0);

      this.scene.add(ambient, keyLight, fillLight, rimLight);
    } catch (e) {
      console.warn('MonsterThumbnailRenderer WebGL init skipped or failed', e);
    }
  }

  /**
   * 获取指定怪物的 2D 肖像 DataURL
   */
  public static getThumbnail(monsterId: string): string {
    if (this.cache.has(monsterId)) {
      return this.cache.get(monsterId)!;
    }

    this.init();
    if (!this.renderer || !this.scene || !this.camera) {
      return '';
    }

    try {
      const mesh = ModelFactory.createMonsterMesh(monsterId);
      mesh.position.set(0, 0, 0);
      this.scene.add(mesh);

      // 计算边界盒与自适应特写镜头取景
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.6);

      // 英雄仰角与 45 度侧角观察
      const distance = maxDim * 1.75;
      this.camera.position.set(
        center.x + distance * 0.55,
        center.y + distance * 0.35,
        center.z + distance * 0.82
      );
      this.camera.lookAt(center.x, center.y, center.z);

      this.renderer.render(this.scene, this.camera);
      const dataUrl = this.renderer.domElement.toDataURL('image/png');

      this.scene.remove(mesh);

      this.cache.set(monsterId, dataUrl);
      return dataUrl;
    } catch (e) {
      console.warn(`Failed to render thumbnail for monster: ${monsterId}`, e);
      return '';
    }
  }

  /**
   * 预热生成所有怪物的肖像快照
   */
  public static preloadAll() {
    if (typeof window === 'undefined') return;
    Object.keys(MONSTERS).forEach((id) => {
      this.getThumbnail(id);
    });
  }
}
