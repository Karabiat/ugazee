"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { storyScroll } from "@/lib/scrollStore";

const GROOVES = [1.42, 1.31, 1.2, 1.09, 0.98, 0.87, 0.76, 0.65, 0.55];

function VinylDisc() {
  const group = useRef<THREE.Group>(null);
  const glint = useRef<THREE.Mesh>(null);

  const grooveGeometry = useMemo(() => {
    return GROOVES.map((radius) => {
      const geometry = new THREE.TorusGeometry(radius, 0.0045, 6, 120);
      return { radius, geometry };
    });
  }, []);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const p = storyScroll.progress;
    node.rotation.z += delta * 0.045;
    node.rotation.y = 0.22 + state.pointer.x * 0.2 + p * 0.32;
    node.rotation.x = -0.2 + state.pointer.y * 0.12 + Math.sin(p * Math.PI * 2) * 0.08;
    node.position.y = Math.sin(p * Math.PI * 3) * 0.1;

    if (glint.current) {
      const material = glint.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.08 + Math.max(0, Math.sin(state.clock.elapsedTime * 0.8)) * 0.06;
    }
  });

  return (
    <group ref={group} scale={0.9}>
      {/* Record body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.52, 1.52, 0.075, 128]} />
        <meshStandardMaterial color="#0d0a07" roughness={0.32} metalness={0.82} />
      </mesh>

      {/* Grooves */}
      {grooveGeometry.map(({ radius, geometry }) => (
        <mesh
          key={radius}
          geometry={geometry}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0.039]}
        >
          <meshBasicMaterial
            color="#b98b58"
            transparent
            opacity={0.14 + (1.52 - radius) * 0.16}
          />
        </mesh>
      ))}

      {/* Edge highlight */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
        <torusGeometry args={[1.505, 0.012, 8, 160]} />
        <meshBasicMaterial
          color="#f0c086"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.045]}>
        <circleGeometry args={[0.46, 64]} />
        <meshStandardMaterial color="#c85a2c" roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.048]}>
        <ringGeometry args={[0.45, 0.462, 64]} />
        <meshBasicMaterial color="#2a1207" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
        <ringGeometry args={[0.2, 0.205, 48]} />
        <meshBasicMaterial color="#f3e0c4" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.052]}>
        <circleGeometry args={[0.026, 24]} />
        <meshBasicMaterial color="#050403" />
      </mesh>

      {/* Animated sheen */}
      <mesh ref={glint} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.042]}>
        <ringGeometry args={[0.58, 1.49, 128, 1, 0.35, 0.55]} />
        <meshBasicMaterial
          color="#ffd9a3"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ambient ring under the disc */}
      <mesh position={[0, -0.12, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 2.5, 96]} />
        <meshBasicMaterial
          color="#c26a2c"
          transparent
          opacity={0.055}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Rig() {
  useFrame((state) => {
    state.camera.position.x = state.pointer.x * 0.12;
    state.camera.position.y = state.pointer.y * 0.08;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function RecordRingScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3.5, 4, 5]} intensity={1.6} color="#ffe3ba" />
      <pointLight position={[-3, -2, 3]} intensity={8} distance={10} color="#d9662b" />
      <pointLight position={[2, 2.5, -2]} intensity={4} distance={9} color="#6f4a2b" />
      <Rig />
      <VinylDisc />
    </Canvas>
  );
}
