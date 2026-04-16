import * as THREE from 'three'
import { Environment, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import { RoomPortal } from './RoomPortal'

const ROOM_WIDTH = 20
const ROOM_DEPTH = 15
const ROOM_HEIGHT = 3.5

export const HubRoom = () => {
  const floorRef = useRef<THREE.Mesh>(null)

  return (
    <>
      {/* Environment */}
      <Environment preset="studio" />

      {/* Lighting */}
      <ambientLight intensity={0.3} color={0xffffff} />
      <directionalLight
        position={[25, 15, 25]}
        intensity={1.5}
        color={0xffd700}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[-20, 10, -20]} intensity={0.6} color={0x4488ff} distance={40} />

      {/* Floor */}
      <mesh
        ref={floorRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x0a0e27}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x1a1f3a} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Walls */}
      {/* Front Wall */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1f3a} roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1f3a} roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1f3a} roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1f3a} roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Center Welcome Sign/Logo */}
      <group position={[0, 5, -20]}>
        {/* Glowing frame */}
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[8, 3, 0.2]} />
          <meshStandardMaterial color={0x00ffff} emissive={0x00ffff} emissiveIntensity={0.5} metalness={0.8} />
        </mesh>

        {/* Text background */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[7.5, 2.5, 0.1]} />
          <meshStandardMaterial color={0x0a0e27} metalness={0.1} roughness={0.9} />
        </mesh>
      </group>

      {/* Portal to Film Studio - Left side */}
      <RoomPortal
        position={[-8, 0, 0]}
        targetRoom="studio"
        label="Studio"
        color={0xff00ff}
      />

      {/* Portal to Arcade Lounge - Right side */}
      <RoomPortal
        position={[8, 0, 0]}
        targetRoom="arcade"
        label="Arcade"
        color={0xffff00}
      />

      {/* Portal to Command Center - Back */}
      <RoomPortal
        position={[0, 0, 6]}
        targetRoom="command"
        label="Command"
        color={0x00ff00}
      />

      {/* Decorative pillars */}
      <mesh position={[-8, ROOM_HEIGHT / 2, -5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, ROOM_HEIGHT, 32]} />
        <meshStandardMaterial color={0xffd700} metalness={0.8} roughness={0.2} emissive={0xffd700} emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[8, ROOM_HEIGHT / 2, -5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, ROOM_HEIGHT, 32]} />
        <meshStandardMaterial color={0xffd700} metalness={0.8} roughness={0.2} emissive={0xffd700} emissiveIntensity={0.3} />
      </mesh>

      {/* Sparkles */}
      <Sparkles count={40} scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]} size={0.8} speed={0.3} opacity={0.15} />
    </>
  )
}
