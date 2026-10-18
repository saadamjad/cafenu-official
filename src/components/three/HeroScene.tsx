"use client";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

/** Deterministic PRNG (mulberry32) so the scene is identical on every render. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SceneInput = { scroll: number; px: number; py: number };

/** Kraft takeaway cup sleeve, drawn once to a canvas texture. */
function useCupTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    const g = c.getContext("2d")!;
    g.scale(2, 2); // 2x canvas for a crisp logo; drawing below uses 1024x512 coordinates
    const grad = g.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#d8b585");
    grad.addColorStop(1, "#c29c68");
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 512);
    // paper fibre speckle
    const r = seeded(7);
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = `rgba(80,50,30,${r() * 0.08})`;
      g.fillRect(r() * 1024, r() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    // the real Cafe Nu logo, centred at u = 0.5 (faces the camera after the PI rotation)
    const logo = new Image();
    logo.onload = () => {
      // cylinder u is stretched ~1.1x vs v, so draw slightly narrower to stay round
      g.drawImage(logo, 512 - 135, 256 - 150, 270, 300);
      tex.needsUpdate = true;
    };
    logo.src = "/images/cafe-nu-logo.png";
    return tex;
  }, []);
}

const steamVertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.x += sin(uv.y * 5.0 + uTime * 1.3) * 0.12 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const steamFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  void main() {
    vec2 uv = vUv;
    float n = noise(vec2(uv.x * 4.0, uv.y * 3.0 - uTime * 0.6));
    n = smoothstep(0.45, 1.0, n);
    float edges = smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.75, uv.x);
    float fade = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.4, uv.y);
    gl_FragColor = vec4(vec3(1.0, 0.97, 0.92), n * edges * fade * 0.55);
  }
`;

function Steam() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh position={[0, 2.35, 0]}>
      <planeGeometry args={[1.1, 2.2, 16, 32]} />
      <shaderMaterial
        ref={mat}
        vertexShader={steamVertex}
        fragmentShader={steamFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Cup({ input }: { input: MutableRefObject<SceneInput> }) {
  const group = useRef<THREE.Group>(null);
  const tex = useCupTexture();
  const { viewport } = useThree();

  const lid = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 1.32),
          new THREE.Vector2(0.62, 1.32),
          new THREE.Vector2(0.7, 1.26),
          new THREE.Vector2(0.92, 1.18),
          new THREE.Vector2(0.94, 1.06),
          new THREE.Vector2(0.86, 1.02),
        ],
        64,
      ),
    [],
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { scroll, px, py } = input.current;
    const t = state.clock.elapsedTime;
    const wide = viewport.aspect > 1.1;
    // desktop: in front of the photo arch; phones: tucked at the right edge beside the copy
    const x = wide ? viewport.width * 0.13 : viewport.width * 0.22;
    const y = wide ? -0.75 : -viewport.height * 0.12;
    g.position.x = THREE.MathUtils.damp(g.position.x, x, 2.5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, y - scroll * 1.2 + Math.sin(t * 1.1) * 0.07, 2.5, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.PI + Math.sin(t * 0.35) * 0.35 + px * 0.5 + scroll * Math.PI * 1.4, 2, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, py * 0.22 + scroll * 0.2, 2, dt);
    // the "pour": cup tips forward as you scroll out of the hero
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.12 - scroll * 0.9, 2, dt);
    const s = wide ? 0.62 : 0.5;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 2.5, dt));
  });

  return (
    <group ref={group} rotation={[0, Math.PI, -0.12]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.86, 0.64, 2.1, 72, 1, true]} />
        <meshStandardMaterial map={tex} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.64, 48]} />
        <meshStandardMaterial color="#b08a58" roughness={0.9} />
      </mesh>
      <mesh geometry={lid} position={[0, -0.02, 0]}>
        <meshStandardMaterial color="#161616" roughness={0.3} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.28, 1.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.05, 0.16, 6, 12]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <Steam />
    </group>
  );
}

function Beans({ count, edges }: { count: number; edges: boolean }) {
  const { viewport } = useThree();
  const beans = useMemo(() => {
    const r = seeded(42);
    const rand = (a: number, b: number) => a + r() * (b - a);
    // on phones keep beans out of the text column so copy stays readable
    const bx = () => (edges ? (r() < 0.5 ? -1 : 1) * rand(0.6, 1) : rand(-1, 1));
    return Array.from({ length: count }, () => ({
      pos: [bx(), rand(-1, 1), rand(-2.5, 1.2)] as const,
      rot: [rand(0, 6), rand(0, 6), rand(0, 6)] as [number, number, number],
      scale: rand(0.75, 1.25),
      speed: rand(0.8, 1.8),
    }));
  }, [count, edges]);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 32, 16), []);

  return (
    <>
      {beans.map((b, i) => (
        <Float key={i} speed={b.speed * 0.8} rotationIntensity={1.2} floatIntensity={1.2}>
          <group
            position={[b.pos[0] * viewport.width * 0.5, b.pos[1] * viewport.height * 0.5, b.pos[2]]}
            rotation={b.rot}
            scale={b.scale * (edges ? 0.7 : 1)}
          >
            <mesh geometry={geo} scale={[0.17, 0.25, 0.12]}>
              <meshStandardMaterial color="#4b321f" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.105]} scale={[0.018, 0.2, 0.02]} geometry={geo}>
              <meshStandardMaterial color="#1f120b" roughness={0.8} />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  );
}

export default function HeroScene({ input, compact }: { input: MutableRefObject<SceneInput>; compact: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Stop rendering when the hero is scrolled away to save battery and main-thread time.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={compact ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0.4, 6.5], fov: 38 }}
        gl={{ alpha: true, antialias: !compact, powerPreference: "high-performance" }}
        shadows={!compact}
        frameloop={active ? "always" : "never"}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffe7c4" castShadow />
        <pointLight position={[-4, 1, 2]} intensity={20} color="#cfaa76" />
        <pointLight position={[3, -2, -2]} intensity={8} color="#fff4e2" />
        <Cup input={input} />
        <Beans count={compact ? 8 : 16} edges={compact} />
        {!compact && <ContactShadows position={[0, -1.9, 0]} opacity={0.45} scale={10} blur={2.6} far={4} />}
      </Canvas>
    </div>
  );
}
