'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Box, Cone } from '@react-three/drei';
import * as THREE from 'three';

export default function House3D() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.15;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
      <group ref={group} scale={1.2} position={[0, -4.5, 0]}>
        
        {/* Main Body (Architectural Texture) */}
        <Box args={[5, 4, 5]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#0B0C10" roughness={0.3} metalness={0.7} />
        </Box>

        {/* Classic Pyramid Roof */}
        <Cone args={[4.2, 3, 4]} position={[0, 5.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </Cone>

        {/* Glowing Base Light Strip for modern aesthetic */}
        <Box args={[5.2, 0.1, 5.2]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
        </Box>

        {/* Large Front Window Frame */}
        <Box args={[2.5, 3, 0.2]} position={[0, 2, 2.45]}>
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </Box>

        {/* Lit Interior / Glowing Window Glass */}
        <Box args={[2.3, 2.8, 0.1]} position={[0, 2, 2.5]}>
          <meshStandardMaterial color="#e0f2fe" emissive="#3b82f6" emissiveIntensity={1.5} />
        </Box>

        {/* Glowing Door */}
        <Box args={[0.9, 1.8, 0.1]} position={[0, 0.9, 2.55]}>
          <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={0.8} />
        </Box>

        {/* Chimney */}
        <Box args={[0.8, 3, 0.8]} position={[1.5, 5, -1.5]}>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Box>

        <Environment preset="city" />
      </group>
    </Float>
  );
}
