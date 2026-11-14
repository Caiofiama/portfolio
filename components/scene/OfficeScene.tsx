"use client";

// The hero's 3D office: four desks, one per featured project, built from the Kenney CC0
// furniture in /office/office-kit.glb. It draws only when something changes (scroll, hover),
// so an idle page costs nothing. The page tells it what is true through heroStore.
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { featuredProjects } from "@/content/projects";
import { heroStore } from "@/lib/hero-store";

const KIT = "/office/office-kit.glb";
const ACCENT = new THREE.Color("#3fe0ff");
const SIGNAL = new THREE.Color("#ff7a45");

/** Room size in metres; the floor runs from (0, 0) to (W, D). */
const W = 3.6;
const D = 3.15;

/** Desk centres, in the order of featuredProjects: the first project sits nearest the camera. */
const DESKS: [number, number][] = [
  [2.6, 2.25],
  [1.1, 2.25],
  [2.6, 0.95],
  [1.1, 0.95],
];

/** On wide screens the office moves right, clear of the words. Share of the canvas width. */
const SHIFT = 0.21;
/** And a little down, towards the middle of the space under the header. */
const DROP = 0.02;

type Pose = { position: THREE.Vector3; target: THREE.Vector3 };

function pose(target: [number, number, number], distance: number, elevation: number, azimuth: number): Pose {
  const el = THREE.MathUtils.degToRad(elevation);
  const az = THREE.MathUtils.degToRad(azimuth);
  const t = new THREE.Vector3(...target);
  const offset = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
  return { position: t.clone().addScaledVector(offset, distance), target: t };
}

/** The whole office at the top of the page, then closer to the desks as the hero scrolls away. */
const START = pose([W / 2, 0.4, D / 2], 13, 32, 38);
const END = pose([W / 2, 0.5, D / 2 - 0.2], 10.2, 24, 28);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Night colours for the Kenney material names. */
function makePalette() {
  const flat = (color: string, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });
  const palette: Record<string, THREE.MeshStandardMaterial> = {
    wood: flat("#2f323d"),
    woodDark: flat("#20222a"),
    metal: flat("#7b8494", 0.5),
    metalDark: flat("#16181e", 0.6),
    metalMedium: flat("#3f4350", 0.6),
    plant: flat("#2e7466"),
    carpet: flat("#1d1f27", 1),
    carpetDarker: flat("#16181e", 1),
    glass: new THREE.MeshStandardMaterial({ color: "#3fe0ff", transparent: true, opacity: 0.25, roughness: 0.2 }),
    _defaultMat: flat("#2f323d"),
  };
  return palette;
}

type Materials = Record<string, THREE.Material>;

/** One piece of furniture from the kit, in the night palette. */
function Model({
  kit,
  name,
  palette,
  override,
  ...props
}: {
  kit: THREE.Object3D;
  name: string;
  palette: Materials;
  override?: Materials;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}) {
  const object = useMemo(() => {
    const source = kit.getObjectByName(name);
    if (!source) throw new Error(`office-kit.glb has no model named ${name}`);
    const copy = source.clone(true);
    const pick = (m: THREE.Material) => override?.[m.name] ?? palette[m.name] ?? palette._defaultMat;
    copy.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.material = Array.isArray(o.material) ? o.material.map(pick) : pick(o.material);
      o.castShadow = true;
      o.receiveShadow = true;
    });
    return copy;
  }, [kit, name, palette, override]);
  return <primitive object={object} {...props} />;
}

let lastPointerType = "mouse";

function Desk({
  kit,
  palette,
  slug,
  x,
  z,
  screen,
  lightRef,
}: {
  kit: THREE.Object3D;
  palette: Materials;
  slug: string;
  x: number;
  z: number;
  screen: THREE.MeshStandardMaterial;
  lightRef: (light: THREE.PointLight | null) => void;
}) {
  // The monitor's panel is the model's "metal" material.
  const screenOverride = useMemo(() => ({ metal: screen }), [screen]);
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.pointerType === "touch") return;
    heroStore.setActive(slug);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    document.body.style.cursor = "";
    if (!heroStore.isPinned()) heroStore.setActive(null);
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // A tap pins the card, which carries the link; a mouse click goes straight to the project.
    if (lastPointerType === "touch") heroStore.setActive(slug, true);
    else heroStore.open(slug);
  };
  return (
    <group position={[x, 0, z]}>
      <Model kit={kit} palette={palette} name="desk" rotation={[0, Math.PI, 0]} />
      <Model
        kit={kit}
        palette={palette}
        override={screenOverride}
        name="computerScreen"
        position={[0, 0.385, -0.1]}
        rotation={[0, Math.PI, 0]}
      />
      <Model kit={kit} palette={palette} name="computerKeyboard" position={[0, 0.385, 0.07]} rotation={[0, Math.PI, 0]} />
      <Model kit={kit} palette={palette} name="computerMouse" position={[0.22, 0.385, 0.08]} rotation={[0, Math.PI, 0]} />
      <Model kit={kit} palette={palette} name="chairDesk" position={[0, 0, 0.45]} />
      <pointLight ref={lightRef} position={[0, 0.72, 0.16]} color={ACCENT} intensity={1.1} distance={2.4} decay={2} />
      <mesh
        position={[0, 0.42, 0.18]}
        onPointerOver={over}
        onPointerOut={out}
        onPointerDown={(e) => {
          lastPointerType = e.pointerType;
        }}
        onClick={click}
      >
        <boxGeometry args={[0.95, 0.9, 1.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  );
}

function Office({ onReady, still }: { onReady?: () => void; still: boolean }) {
  const { scene: kit } = useGLTF(KIT, false, false);
  const { camera, size, invalidate } = useThree();
  const palette = useMemo(makePalette, []);
  const screens = useMemo(
    () =>
      featuredProjects.map(
        () => new THREE.MeshStandardMaterial({ color: "#05080c", emissive: ACCENT.clone(), emissiveIntensity: 1, roughness: 0.4 }),
      ),
    [],
  );
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  const glow = useRef(featuredProjects.map(() => 0));
  const progress = useRef(still ? 0 : heroStore.progress);
  const announced = useRef(false);
  const look = useRef(new THREE.Vector3());
  const point = useRef(new THREE.Vector3());

  useEffect(() => {
    heroStore.invalidate = () => invalidate();
    return () => {
      heroStore.invalidate = () => {};
      document.body.style.cursor = "";
    };
  }, [invalidate]);

  useEffect(
    () => () => {
      Object.values(palette).forEach((m) => m.dispose());
      screens.forEach((m) => m.dispose());
    },
    [palette, screens],
  );

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (size.width >= 1024) cam.setViewOffset(size.width, size.height, -size.width * SHIFT, -size.height * DROP, size.width, size.height);
    else cam.clearViewOffset();
    invalidate();
  }, [camera, size, invalidate]);

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 7);
    let moving = false;

    const goal = still ? 0 : heroStore.progress;
    if (Math.abs(goal - progress.current) > 0.0005) {
      progress.current += (goal - progress.current) * k;
      moving = true;
    } else progress.current = goal;
    const t = smooth(progress.current);
    camera.position.lerpVectors(START.position, END.position, t);
    camera.lookAt(look.current.lerpVectors(START.target, END.target, t));
    camera.updateMatrixWorld();

    const active = heroStore.getActive();
    featuredProjects.forEach((project, i) => {
      const want = project.slug === active ? 1 : 0;
      if (Math.abs(want - glow.current[i]) > 0.002) {
        glow.current[i] += (want - glow.current[i]) * k;
        moving = true;
      } else glow.current[i] = want;
      const v = glow.current[i];
      screens[i].emissive.lerpColors(ACCENT, SIGNAL, v);
      screens[i].emissiveIntensity = 1 + v * 0.6;
      const light = lights.current[i];
      if (light) {
        light.color.lerpColors(ACCENT, SIGNAL, v);
        light.intensity = 1.1 + v * 1.1;
      }
    });

    // Pin the HTML card above the desk in focus.
    const card = heroStore.card;
    const index = featuredProjects.findIndex((p) => p.slug === active);
    if (card && index >= 0) {
      point.current.set(DESKS[index][0], 0.92, DESKS[index][1]).project(camera);
      const x = THREE.MathUtils.clamp((point.current.x * 0.5 + 0.5) * size.width, 148, size.width - 148);
      const y = Math.max((-point.current.y * 0.5 + 0.5) * size.height, 250);
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    if (moving) state.invalidate();
    if (!announced.current) {
      announced.current = true;
      onReady?.();
    }
  });

  return (
    <group>
      <hemisphereLight args={["#a9c2ff", "#12141a", 2.4]} />
      <directionalLight
        position={[W / 2 + 2.5, 6, D / 2 + 3.5]}
        color="#d6e2ff"
        intensity={3}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={16}
      />

      {/* The room: a floor slab and two low back walls. */}
      <mesh position={[W / 2, -0.06, D / 2]} receiveShadow>
        <boxGeometry args={[W + 0.3, 0.12, D + 0.3]} />
        <meshStandardMaterial color="#15171d" roughness={0.95} />
      </mesh>
      <mesh position={[W / 2, 0.6, -0.1]} receiveShadow castShadow>
        <boxGeometry args={[W + 0.3, 1.2, 0.1]} />
        <meshStandardMaterial color="#20232b" roughness={0.95} />
      </mesh>
      <mesh position={[-0.1, 0.6, D / 2 - 0.05]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 1.2, D + 0.2]} />
        <meshStandardMaterial color="#20232b" roughness={0.95} />
      </mesh>

      <Model kit={kit} palette={palette} name="rugRectangle" position={[W / 2 - 0.05, 0.002, D / 2 - 0.05]} scale={[1.6, 1, 2]} />
      <Model kit={kit} palette={palette} name="bookcaseOpen" position={[W / 2 - 0.05, 0, 0.16]} />
      <Model kit={kit} palette={palette} name="bookcaseOpenLow" position={[0.16, 0, D / 2 - 0.1]} rotation={[0, Math.PI / 2, 0]} />
      <Model kit={kit} palette={palette} name="plantSmall2" position={[0.16, 0.4, D / 2 - 0.1]} />
      <Model kit={kit} palette={palette} name="pottedPlant" position={[0.3, 0, 0.3]} />
      <Model kit={kit} palette={palette} name="pottedPlant" position={[0.3, 0, D - 0.35]} />
      <Model kit={kit} palette={palette} name="pottedPlant" position={[W - 0.28, 0, 0.28]} />
      <Model kit={kit} palette={palette} name="trashcan" position={[W - 0.25, 0, 1.6]} scale={0.8} />

      {featuredProjects.map((project, i) => (
        <Desk
          key={project.slug}
          kit={kit}
          palette={palette}
          slug={project.slug}
          x={DESKS[i][0]}
          z={DESKS[i][1]}
          screen={screens[i]}
          lightRef={(light) => {
            lights.current[i] = light;
          }}
        />
      ))}
    </group>
  );
}

/**
 * `still` freezes the camera at the top-of-page view (used to shoot the poster).
 * `onReady` fires after the first frame is drawn; `onLost` if the browser takes the WebGL context away.
 */
export default function OfficeScene({
  onReady,
  onLost,
  still = false,
}: {
  onReady?: () => void;
  onLost?: () => void;
  still?: boolean;
}) {
  return (
    <Canvas
      flat
      shadows
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.5, far: 40, position: START.position.toArray() }}
      onPointerMissed={() => heroStore.setActive(null)}
      onCreated={({ gl }) => {
        // If the context is lost or a shader fails to compile, the page goes back to the poster.
        gl.domElement.addEventListener("webglcontextlost", () => onLost?.(), { once: true });
        gl.debug.onShaderError = () => onLost?.();
      }}
    >
      <Suspense fallback={null}>
        <Office onReady={onReady} still={still} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(KIT, false, false);
