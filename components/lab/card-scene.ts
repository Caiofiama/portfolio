// One full-screen WebGL canvas that draws every 3D project card. Cards are placed from
// screen-space states (centre in CSS pixels, height in pixels, angles in degrees): the camera is set
// so one world unit is one CSS pixel at z = 0.
import * as THREE from "three";
import { CARD_ASPECT } from "./constants";

export type CardState = {
  x: number;
  y: number;
  h: number;
  rz: number;
  ry: number;
  rx: number;
  z: number;
  op: number;
  shadow: number;
};

export type DrawItem = { project: number; state: CardState };

/** A card face: a pre-rendered picture, or a canvas drawn on the spot. */
type TexSource = HTMLImageElement | HTMLCanvasElement;

const D2R = Math.PI / 180;

/** One face of the card: flat at the rim, gently puffed toward the middle, like a pressed panel. */
function face(back: boolean) {
  const geometry = new THREE.PlaneGeometry(1, CARD_ASPECT, 24, 38);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const uv = geometry.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    const across = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * u - 1), 3)), 0.6);
    const along = Math.pow(Math.min(1, Math.min(v, 1 - v) / 0.07), 0.7);
    const z = 0.003 + 0.035 * across * along;
    position.setZ(i, back ? -z : z);
    if (back) uv.setX(i, 1 - u);
  }
  if (back) {
    // Reverse every triangle so the back face points outward.
    const index = geometry.index;
    if (index) {
      const a = index.array as Uint16Array | Uint32Array;
      for (let i = 0; i < a.length; i += 3) {
        const t = a[i + 1];
        a[i + 1] = a[i + 2];
        a[i + 2] = t;
      }
      index.needsUpdate = true;
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.6)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type Slot = {
  group: THREE.Group;
  front: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  back: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  project: number;
};

export class CardStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private raycaster = new THREE.Raycaster();
  private slots: Slot[] = [];
  private fronts: THREE.Texture[] = [];
  private backs: THREE.Texture[] = [];
  private disposables: { dispose: () => void }[] = [];
  private vw = 1;
  private vh = 1;

  /** Only creates the renderer (it throws where WebGL is missing); `prepare` builds the rest. */
  constructor(
    canvas: HTMLCanvasElement,
    private frontSources: TexSource[],
    private backSources: TexSource[],
    private pool: number,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(0x000000, 0);
  }

  /**
   * Builds the scene in short steps with a pause between them, so the page stays responsive while
   * it loads: lights, cards, shaders, then one face picture at a time. False if cancelled.
   */
  async prepare(cancelled: () => boolean) {
    const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
    const step = async () => {
      await pause();
      return !cancelled();
    };
    if (!(await step())) return false;

    // A sky light in place of a reflected room: it gives the varnish the same soft top light
    // without generating an environment map, which cost about a third of a second on load.
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.35));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(-0.6, 0.9, 1.4);
    this.scene.add(key);
    if (!(await step())) return false;

    const anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    const toTexture = (source: TexSource) => {
      const texture = new THREE.Texture(source);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;
      return texture;
    };
    this.fronts = this.frontSources.map(toTexture);
    this.backs = this.backSources.map(toTexture);

    const frontGeometry = face(false);
    const backGeometry = face(true);
    const shadowGeometry = new THREE.PlaneGeometry(1.25, 1.04 * CARD_ASPECT);
    const shadowMap = shadowTexture();
    this.disposables.push(frontGeometry, backGeometry, shadowGeometry, shadowMap, ...this.fronts, ...this.backs);

    const material = (map: THREE.Texture) =>
      new THREE.MeshPhysicalMaterial({
        map,
        transparent: true,
        alphaTest: 0.5,
        // Dark cards: a lighter varnish than a foil wrapper, or the face turns milky head-on.
        roughness: 0.7,
        metalness: 0,
        specularIntensity: 0.45,
        clearcoat: 0.16,
        clearcoatRoughness: 0.45,
      });

    for (let i = 0; i < this.pool; i++) {
      const group = new THREE.Group();
      group.rotation.order = "ZYX";
      const front = new THREE.Mesh(frontGeometry, material(this.fronts[0]));
      const back = new THREE.Mesh(backGeometry, material(this.backs[0]));
      group.add(front, back);
      const shadow = new THREE.Mesh(
        shadowGeometry,
        new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false }),
      );
      shadow.renderOrder = -1;
      group.visible = shadow.visible = false;
      this.scene.add(group, shadow);
      this.disposables.push(front.material, back.material, shadow.material);
      this.slots.push({ group, front, back, shadow, project: 0 });
    }
    if (!(await step())) return false;

    // Every card shares one shader: compile it from one visible card, in parallel where the GPU
    // driver allows it.
    const first = this.slots[0];
    first.group.visible = first.shadow.visible = true;
    await this.renderer.compileAsync(this.scene, this.camera);
    first.group.visible = first.shadow.visible = false;

    // Send the pictures to the GPU one at a time, fronts first.
    for (const texture of [...this.fronts, ...this.backs]) {
      if (!(await step())) return false;
      this.renderer.initTexture(texture);
    }
    return !cancelled();
  }

  resize(vw: number, vh: number, dpr: number) {
    this.vw = vw;
    this.vh = vh;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(vw, vh, false);
    const d = Math.min(2200, Math.max(1000, 1500 * Math.min(vw / 1440, vh / 900)));
    this.camera.fov = (2 * Math.atan(vh / 2 / d)) / D2R;
    this.camera.aspect = vw / vh;
    this.camera.near = 10;
    this.camera.far = 4 * d;
    this.camera.position.set(0, 0, d);
    this.camera.updateProjectionMatrix();
  }

  /** Places one card per item; slots without an item are hidden. */
  draw(items: DrawItem[]) {
    this.slots.forEach((slot, i) => {
      const item = items[i];
      if (!item || item.state.op <= 0.01) {
        slot.group.visible = slot.shadow.visible = false;
        return;
      }
      const { state: st, project } = item;
      if (slot.project !== project) {
        slot.project = project;
        slot.front.material.map = this.fronts[project];
        slot.back.material.map = this.backs[project];
      }
      const s = st.h / CARD_ASPECT;
      slot.group.visible = true;
      slot.group.position.set(st.x - this.vw / 2, this.vh / 2 - st.y, st.z);
      slot.group.scale.set(s, s, s);
      slot.group.rotation.set(st.rx * D2R, st.ry * D2R, -st.rz * D2R);
      for (const mesh of [slot.front, slot.back]) {
        mesh.material.opacity = st.op;
        mesh.material.alphaTest = 0.5 * Math.min(1, st.op);
      }
      slot.shadow.visible = st.shadow > 0;
      slot.shadow.position.set(st.x - this.vw / 2, this.vh / 2 - (st.y + 0.05 * st.h), st.z - 0.32 * st.h);
      slot.shadow.rotation.z = -st.rz * D2R;
      slot.shadow.scale.set(s * Math.max(0.3, Math.abs(Math.cos(st.ry * D2R))), s, 1);
      slot.shadow.material.opacity = 0.5 * st.op * st.shadow;
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** The item index under a viewport point, or -1. */
  pick(clientX: number, clientY: number) {
    const pointer = new THREE.Vector2((clientX / this.vw) * 2 - 1, -(clientY / this.vh) * 2 + 1);
    this.raycaster.setFromCamera(pointer, this.camera);
    const meshes = this.slots.filter((s) => s.group.visible).flatMap((s) => [s.front, s.back]);
    const hit = this.raycaster.intersectObjects(meshes, false)[0];
    if (!hit) return -1;
    return this.slots.findIndex((s) => s.front === hit.object || s.back === hit.object);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}
