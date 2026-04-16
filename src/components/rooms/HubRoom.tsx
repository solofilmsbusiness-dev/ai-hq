import * as THREE from 'three'
import { Sparkles, Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'
import { Agent } from '../Agent'

const ROOM_WIDTH = 30
const ROOM_DEPTH = 30
const ROOM_HEIGHT = 10

// Rotating central icosahedron logo
const CentralOrb = () => {
  const orbRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.x += delta * 0.3
      orbRef.current.rotation.y += delta * 0.5
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4
    }
  })

  return (
    <group position={[0, 4.5, 0]}>
      <mesh ref={orbRef} castShadow>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={0xffd700}
          emissive={0xffd700}
          emissiveIntensity={2.2}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={0x00ccff}
          emissive={0x00ccff}
          emissiveIntensity={1.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2.5} color={0xffd700} distance={20} decay={2} />
    </group>
  )
}

// Compass-rose floor inlay
const FloorInlay = () => {
  return (
    <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[3.6, 4, 64]} />
        <meshStandardMaterial color={0xffd700} emissive={0xffd700} emissiveIntensity={1.2} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh>
        <ringGeometry args={[6.5, 6.7, 64]} />
        <meshStandardMaterial color={0x00ccff} emissive={0x00ccff} emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

export const HubRoom = () => {
  return (
    <>
      {/* Warm gold key spotlight from above */}
      <spotLight
        position={[0, 9, 0]}
        target-position={[0, 0, 0]}
        intensity={6}
        angle={Math.PI / 4}
        penumbra={0.6}
        color={0xffd700}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        distance={30}
        decay={1.5}
      />

      {/* Cool blue rim lights from corners */}
      <pointLight position={[-12, 6, -12]} intensity={1.2} color={0x4488ff} distance={25} decay={2} />
      <pointLight position={[12, 6, -12]} intensity={1.2} color={0x4488ff} distance={25} decay={2} />
      <pointLight position={[-12, 6, 12]} intensity={1.2} color={0x4488ff} distance={25} decay={2} />
      <pointLight position={[12, 6, 12]} intensity={1.2} color={0x4488ff} distance={25} decay={2} />

      {/* Soft ambient */}
      <ambientLight intensity={0.15} color={0x223355} />

      {/* Reflective floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x05060f}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <FloorInlay />

      {/* Tall ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0a0e27} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x141a35} roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x141a35} roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x141a35} roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x141a35} roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Central holographic logo */}
      <CentralOrb />

      {/* Welcome label */}
      <Text
        position={[0, 7.5, -ROOM_DEPTH / 2 + 0.2]}
        fontSize={0.7}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        AI HQ — ATRIUM
      </Text>

      {/* SoloBrain agent in atrium */}
      <Agent position={[3, 0, 3]} color={0xaa55ff} name="SoloBrain" />

      {/* Four directional portals — N/S/E/W */}
      {/* North → Command */}
      <RoomPortal position={[0, 0, 12]} targetRoom="command" color={0x00ff88} />
      {/* South → Studio */}
      <RoomPortal position={[0, 0, -12]} targetRoom="studio" color={0xff00ff} />
      {/* East → Arcade */}
      <RoomPortal position={[12, 0, 0]} targetRoom="arcade" color={0xffff00} />
      {/* West → Atrium marker (decorative back to hub) */}
      <RoomPortal position={[-12, 0, 0]} targetRoom="hub" color={0x00ccff} />

      {/* Decorative gold pillars at corners */}
      {[
        [-13, -13],
        [13, -13],
        [-13, 13],
        [13, 13],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, ROOM_HEIGHT / 2, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, ROOM_HEIGHT, 32]} />
          <meshStandardMaterial color={0xffd700} metalness={0.9} roughness={0.15} emissive={0xffd700} emissiveIntensity={0.6} />
        </mesh>
      ))}

      <Sparkles count={60} scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]} size={1.2} speed={0.3} opacity={0.25} color="#ffd700" />
    </>
  )
}
