"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAudio } from "@/components/AudioProvider";
import { storyScroll } from "@/lib/scrollStore";

type RecordSpec = {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  tilt: [number, number, number];
  opacity: number;
};

const RECORDS: RecordSpec[] = [
  { position: [-2.75, 0.9, -1.4], scale: 1.02, speed: 0.21, phase: 0, tilt: [0.2, -0.3, 0.4], opacity: 0.62 },
  { position: [2.95, -0.65, -0.8], scale: 1.28, speed: 0.16, phase: 1.7, tilt: [-0.28, 0.25, -0.3], opacity: 0.5 },
  { position: [-1.7, -1.85, -2.2], scale: 0.72, speed: 0.27, phase: 3.1, tilt: [0.4, 0.15, -0.2], opacity: 0.38 },
  { position: [1.55, 2.05, -2.6], scale: 0.58, speed: 0.33, phase: 4.4, tilt: [-0.15, 0.4, 0.2], opacity: 0.34 },
  { position: [0.2, -2.5, -3.4], scale: 0.92, speed: 0.19, phase: 2.3, tilt: [0.3, -0.1, 0.5], opacity: 0.24 },
];

function Vinyl({ spec }: { spec: RecordSpec }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const { getLevels } = useAudio();

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const t = state.clock.elapsedTime;
    const levels = getLevels();
    const drift = storyScroll.progress * 1.15;

    node.position.x = spec.position[0] + Math.sin(t * spec.speed + spec.phase) * 0.18;
    node.position.y = spec.position[1] + Math.cos(t * spec.speed * 0.8 + spec.phase) * 0.22;
    node.position.z = spec.position[2] + drift;
    node.rotation.z += delta * (0.08 + spec.speed * 0.22) * (spec.position[0] < 0 ? 1 : -1);
    node.rotation.x = spec.tilt[0] + Math.sin(t * 0.14 + spec.phase) * 0.05;
    node.rotation.y = spec.tilt[1] + Math.cos(t * 0.11 + spec.phase) * 0.05;

    const pulse = 1 + levels.bass * 0.045;
    node.scale.setScalar(spec.scale * pulse);
    if (ring.current) {
      const material = ring.current.material as THREE.MeshBasicMaterial;
      material.opacity = spec.opacity * (0.55 + levels.high * 0.9);
    }
  });

  return (
    <group ref={group} position={spec.position} rotation={spec.tilt} scale={spec.scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.035, 64]} />
        <meshStandardMaterial
          color="#150e09"
          roughness={0.42}
          metalness={0.68}
          transparent
          opacity={spec.opacity + 0.22}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.023]}>
        <torusGeometry args={[0.99, 0.014, 8, 96]} />
        <meshBasicMaterial
          color="#e8b173"
          transparent
          opacity={spec.opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.024]}>
        <torusGeometry args={[0.73, 0.006, 6, 80]} />
        <meshBasicMaterial color="#b9753c" transparent opacity={spec.opacity * 0.6} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.026]}>
        <circleGeometry args={[0.31, 40]} />
        <meshStandardMaterial color="#e96836" roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.028]}>
        <ringGeometry args={[0.31, 0.315, 40]} />
        <meshBasicMaterial color="#ffd9a3" transparent opacity={spec.opacity} />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
        <ringGeometry args={[0.05, 0.055, 24]} />
        <meshBasicMaterial color="#050403" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const { getLevels } = useAudio();

  const geometry = useMemo(() => {
    const count = 280;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const node = points.current;
    if (!node) return;
    const t = state.clock.elapsedTime;
    node.rotation.y = t * 0.014;
    const levels = getLevels();
    const material = node.material as THREE.PointsMaterial;
    material.opacity = 0.18 + levels.high * 0.22;
    material.size = 0.018 + levels.bass * 0.012;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#f0c086"
        size={0.02}
        transparent
        opacity={0.24}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector2());

  useFrame((state) => {
    const px = state.pointer.x;
    const py = state.pointer.y;
    target.current.x += (px * 0.55 - target.current.x) * 0.035;
    target.current.y += (py * 0.36 - target.current.y) * 0.035;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.position.z = 6.4 - storyScroll.progress * 1.4;
    camera.lookAt(target.current.x * 0.2, target.current.y * 0.2, 0);
  });

  return null;
}

function Halo() {
  const ref = useRef<THREE.Mesh>(null);
  const { getLevels } = useAudio();

  useFrame((state) => {
    const node = ref.current;
    if (!node) return;
    const levels = getLevels();
    node.rotation.z = state.clock.elapsedTime * 0.06;
    node.scale.setScalar(1 + levels.bass * 0.09);
  });

  return (
    <mesh ref={ref} position={[0, 0, -4.5]}>
      <ringGeometry args={[1.8, 3.1, 96]} />
      <meshBasicMaterial
        color="#a45a26"
        transparent
        opacity={0.055}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Scene3D() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return (
    <div className="scene-stage" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <fog attach="fog" args={["#050403", 5.5, 13]} />
        <ambientLight intensity={0.32} />
        <directionalLight position={[4, 6, 5]} intensity={0.85} color="#ffd9ab" />
        <pointLight position={[-4, -2, 2]} intensity={5} distance={12} color="#d96a2c" />
        <pointLight position={[3, 2, -2]} intensity={3} distance={10} color="#8f5a2f" />

        <CameraRig />
        <Halo />
        {RECORDS.map((spec, index) => (
          <Vinyl key={index} spec={spec} />
        ))}
        <Dust />
      </Canvas>
    </div>
  );
}
