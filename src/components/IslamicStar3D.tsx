import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function RotatingStar() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <MeshDistortMaterial 
        color="#f97316" 
        speed={2} 
        distort={0.4} 
        radius={1}
        emissive="#f97316"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const count = 50;
  const meshRef = useRef<THREE.Group>(null!);
  
  const particles = Array.from({ length: count }, () => ({
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ] as [number, number, number],
    scale: Math.random() * 0.1
  }));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.05;
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshStandardMaterial color="#f97316" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function IslamicStar3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <RotatingStar />
        </Float>
        
        <FloatingParticles />
        
        <mesh position={[0, 0, -2]} scale={10}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#0a0a0a" transparent opacity={0.5} />
        </mesh>
      </Canvas>
    </div>
  );
}
