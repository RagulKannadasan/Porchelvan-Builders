import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// --- Shared Materials ---
const WhitePlaster = () => <meshStandardMaterial color="#f4f4f4" roughness={0.8} />;
const DarkConcrete = () => <meshStandardMaterial color="#4a4d52" roughness={0.9} />;
const WoodDeck = () => <meshStandardMaterial color="#8b5a2b" roughness={0.7} />;
const WoodSlats = () => <meshStandardMaterial color="#6b4423" roughness={0.8} />;
const BlackTrim = () => <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />;
const Glass = () => <meshPhysicalMaterial color="#c2d1e0" transmission={0.9} opacity={1} roughness={0.05} thickness={0.5} />;
const PoolWater = () => <meshPhysicalMaterial color="#40b4cc" transmission={0.8} opacity={0.9} roughness={0.1} />;
const Concrete = () => <meshStandardMaterial color="#a0a4a8" roughness={0.9} />;
const Grass = () => <meshStandardMaterial color="#4a7040" roughness={1} />;
const Foliage = () => <meshStandardMaterial color="#2d4a22" roughness={0.9} />;

// --- Sub-Components ---

function BaseAndLandscaping() {
  return (
    <group>
      {/* Massive Base/Property Line */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[24, 0.2, 18]} />
        <meshStandardMaterial color="#555" roughness={0.9} />
      </mesh>

      {/* Main Lawn */}
      <mesh position={[-2, 0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 16]} />
        <Grass />
      </mesh>

      {/* Large Driveway (Right Side) */}
      <mesh position={[8, 0.05, 3]} receiveShadow>
        <boxGeometry args={[6, 0.1, 10]} />
        <Concrete />
      </mesh>

      {/* Swimming Pool Area (Back Left) */}
      <group position={[-5, 0.06, -4]}>
        {/* Pool Water */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[6, 0.08, 4]} />
          <PoolWater />
        </mesh>
        {/* Wooden Pool Deck */}
        <mesh position={[0, -0.02, 3]} receiveShadow>
          <boxGeometry args={[8, 0.1, 2]} />
          <WoodDeck />
        </mesh>
        <mesh position={[4, -0.02, 0]} receiveShadow>
          <boxGeometry args={[2, 0.1, 8]} />
          <WoodDeck />
        </mesh>
      </group>

      {/* Trees and Bushes */}
      {[[-9, 3], [-8, 6], [-3, 7], [3, 7], [10, -6]].map((pos, i) => (
        <group position={[pos[0], 0, pos[1]]} key={i}>
          <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 1]} /><WoodSlats /></mesh>
          <mesh position={[0, 1.4, 0]} castShadow><dodecahedronGeometry args={[0.8]} /><Foliage /></mesh>
          <mesh position={[0.3, 1.1, -0.3]} castShadow><dodecahedronGeometry args={[0.6]} /><Foliage /></mesh>
        </group>
      ))}
    </group>
  );
}

function GroundFloor() {
  return (
    <group position={[0, 1.5, 0]}>
      {/* Main Central Living Area */}
      <mesh position={[0, 0, -1]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 6]} />
        <WhitePlaster />
      </mesh>

      {/* Massive Glass Wall Facing Pool */}
      <mesh position={[-2, 0, -4.01]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.8, 0.1]} />
        <Glass />
      </mesh>
      <mesh position={[-2, 0, -4.02]} castShadow><boxGeometry args={[4.2, 3, 0.05]} /><BlackTrim /></mesh>

      {/* Right Wing (Garage & Entrance) */}
      <mesh position={[6.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 8]} />
        <DarkConcrete />
      </mesh>

      {/* Wide Garage Door */}
      <mesh position={[6.5, -0.2, 4.01]} castShadow>
        <boxGeometry args={[4, 2.2, 0.1]} />
        <WoodSlats />
      </mesh>

      {/* Front Entrance Recess */}
      <mesh position={[2.5, 0, 2]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 2]} />
        <WoodDeck />
      </mesh>
      {/* Glass Front Door */}
      <mesh position={[2.5, -0.1, 3.01]} castShadow>
        <boxGeometry args={[1.5, 2.4, 0.05]} />
        <Glass />
      </mesh>

      {/* Left Wing (Guest / Office) */}
      <mesh position={[-6, 0, 1]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 5]} />
        <WhitePlaster />
      </mesh>
    </group>
  );
}

function UpperFloor() {
  return (
    <group position={[0, 4.5, 0]}>
      {/* Massive Overhanging Master Suite (Left) */}
      <mesh position={[-4, 0, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[10, 3, 7]} />
        <DarkConcrete />
      </mesh>

      {/* Upper Glass Wall */}
      <mesh position={[-6, 0, 2.01]} castShadow>
        <boxGeometry args={[4, 2.6, 0.1]} />
        <Glass />
      </mesh>

      {/* Decorative Wooden Louvers (Slats) across the master suite front */}
      <group position={[-2, 0, 2.1]}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh position={[i * 0.4 - 2.8, 0, 0]} key={i} castShadow>
            <boxGeometry args={[0.1, 3, 0.2]} />
            <WoodSlats />
          </mesh>
        ))}
      </group>

      {/* Right Wing Upper (Bedrooms) */}
      <mesh position={[5.5, 0, -1]} castShadow receiveShadow>
        <boxGeometry args={[7, 3, 6]} />
        <WhitePlaster />
      </mesh>

      {/* Upper Balcony over the garage */}
      <mesh position={[6.5, -1.4, 3]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 2]} />
        <Concrete />
      </mesh>
      {/* Balcony Glass Railing */}
      <mesh position={[6.5, -0.8, 3.95]} castShadow>
        <boxGeometry args={[5, 1, 0.05]} />
        <Glass />
      </mesh>

      {/* Connecting Bridge (Interior Viewable) */}
      <mesh position={[1.5, 0, -2]} castShadow>
        <boxGeometry args={[2, 2.8, 0.1]} />
        <Glass />
      </mesh>
    </group>
  );
}

function RoofsAndPillars() {
  return (
    <group>
      {/* Structural Pillars for Overhangs */}
      <mesh position={[-8.5, 1.5, -4.5]} castShadow receiveShadow><boxGeometry args={[0.3, 3, 0.3]} /><BlackTrim /></mesh>
      <mesh position={[-8.5, 1.5, 1.5]} castShadow receiveShadow><boxGeometry args={[0.3, 3, 0.3]} /><BlackTrim /></mesh>

      <group position={[0, 6.1, 0]}>
        {/* Main Flat Roof over Master Suite */}
        <mesh position={[-4, 0, -1.5]} castShadow receiveShadow>
          <boxGeometry args={[10.4, 0.2, 7.4]} />
          <WhitePlaster />
        </mesh>
        <mesh position={[-4, 0, -1.5]}><boxGeometry args={[10.5, 0.05, 7.5]} /><BlackTrim /></mesh>

        {/* Flat Roof over Right Wing */}
        <mesh position={[5.5, 0, -1]} castShadow receiveShadow>
          <boxGeometry args={[7.4, 0.2, 6.4]} />
          <WhitePlaster />
        </mesh>
        <mesh position={[5.5, 0, -1]}><boxGeometry args={[7.5, 0.05, 6.5]} /><BlackTrim /></mesh>
      </group>
    </group>
  );
}

function LuxuryVilla() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <BaseAndLandscaping />
      <GroundFloor />
      <UpperFloor />
      <RoofsAndPillars />
    </group>
  );
}

function ResponsiveModel() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const isTablet = size.width < 1024 && size.width >= 768;
  
  let scale = 0.9;
  if (isMobile) scale = 0.45;
  else if (isTablet) scale = 0.65;

  return (
    <group scale={scale}>
      <LuxuryVilla />
    </group>
  );
}

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh', background: 'transparent' }}>
      <Canvas shadows camera={{ position: [18, 14, 22], fov: 42 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[15, 20, 10]}
          intensity={1.3}
          castShadow
          shadow-mapSize={4096}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-15, 10, -10]} intensity={0.3} />

        <Environment preset="city" />

        <ResponsiveModel />

        <OrbitControls
          target={[0, 2, 0]}
          enableZoom={false}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
}