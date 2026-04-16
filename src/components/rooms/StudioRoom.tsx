import * as THREE from 'three'
import { Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'
import { Agent } from '../Agent'

const ROOM_WIDTH = 60
const ROOM_DEPTH = 50
const ROOM_HEIGHT = 12

// Editing Bay Component
const EditingBay = ({ position, index }: { position: [number, number, number]; index: number }) => {
  const screenRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (screenRef.current) {
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(Date.now() * 0.002 + index) * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Desk */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 0.1, 2.5]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Left Monitor */}
      <mesh position={[-1.5, 1.2, 0]} castShadow ref={screenRef}>
        <boxGeometry args={[1.8, 1.2, 0.1]} />
        <meshStandardMaterial
          color={0x001a00}
          emissive={0x00ff00}
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Right Monitor */}
      <mesh position={[1.5, 1.2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.1]} />
        <meshStandardMaterial
          color={0x001a00}
          emissive={0x00ff00}
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Monitor stands */}
      <mesh position={[-1.5, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[1.5, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.05, 0.5]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  )
}

// Professional lighting rig
const LightingRig = () => {
  const rigRef = useRef<THREE.Group>(null)

  return (
    <group ref={rigRef}>
      {/* Main rig frame */}
      <mesh position={[0, ROOM_HEIGHT - 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[40, 0.5, 5]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Lights on rig */}
      {[
        { pos: [-15, ROOM_HEIGHT - 1.5, 0], color: 0xffd700 },
        { pos: [-5, ROOM_HEIGHT - 1.5, 0], color: 0xffd700 },
        { pos: [5, ROOM_HEIGHT - 1.5, 0], color: 0x4488ff },
        { pos: [15, ROOM_HEIGHT - 1.5, 0], color: 0x4488ff },
      ].map((light, i) => (
        <group key={i} position={light.pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 32]} />
            <meshStandardMaterial color={0x1a1a1a} metalness={0.8} roughness={0.2} />
          </mesh>
          <pointLight position={[0, -0.5, 0]} intensity={0.8} color={light.color} distance={30} />
        </group>
      ))}
    </group>
  )
}

// Camera on mount
const CameraRig = () => {
  const cameraRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={cameraRef} position={[25, 2, -18]}>
      {/* Mount */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 3, 1]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Camera body */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1.2]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 2.2, 0.8]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 32]} />
        <meshStandardMaterial color={0x333333} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export const StudioRoom = () => {
  const floorRef = useRef<THREE.Mesh>(null)

  return (
    <>
      {/* Moody film-set lighting — magenta key + cool fill */}
      <ambientLight intensity={0.08} color={0x2a0a2a} />

      {/* Magenta key on editing bays (left side) */}
      <pointLight position={[-20, 9, 0]} intensity={4} color={0xff44ff} distance={32} decay={1.7} />
      <pointLight position={[-20, 5, -10]} intensity={1.5} color={0xff00ff} distance={20} decay={2} />
      <pointLight position={[-20, 5, 10]} intensity={1.5} color={0xff00ff} distance={20} decay={2} />

      {/* Purple back rim */}
      <pointLight position={[0, 8, 22]} intensity={2.5} color={0x8844ff} distance={40} decay={2} />

      {/* Cool blue fill on color grading bay (right side) */}
      <pointLight position={[20, 9, 0]} intensity={3} color={0x4488ff} distance={28} decay={1.8} />

      {/* Floor */}
      <mesh ref={floorRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0f0f0f} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Walls - very dark */}
      {/* Front */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f0f} side={THREE.DoubleSide} />
      </mesh>

      {/* Back */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f0f} side={THREE.DoubleSide} />
      </mesh>

      {/* Left */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f0f} side={THREE.DoubleSide} />
      </mesh>

      {/* Right */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f0f} side={THREE.DoubleSide} />
      </mesh>

      {/* Three editing bays - left side */}
      <EditingBay position={[-20, 1, -10]} index={0} />
      <EditingBay position={[-20, 1, 0]} index={1} />
      <EditingBay position={[-20, 1, 10]} index={2} />

      {/* Lighting Rig */}
      <LightingRig />

      {/* Camera on mount */}
      <CameraRig />

      {/* Color grading suite - right side */}
      <group position={[20, 1, 0]}>
        {/* Main display */}
        <mesh castShadow>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial
            color={0x000f00}
            emissive={0x00ff00}
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Grading wheel (visual) */}
        <mesh position={[0, -0.8, 0.2]} castShadow>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color={0x333333} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Color circles on wheel */}
        {[
          { angle: 0, color: 0xff0000 },
          { angle: Math.PI / 2, color: 0x00ff00 },
          { angle: Math.PI, color: 0x0000ff },
          { angle: (3 * Math.PI) / 2, color: 0xffff00 },
        ].map((segment, i) => (
          <mesh
            key={i}
            position={[Math.cos(segment.angle) * 0.7, -0.8, 0.3 + Math.sin(segment.angle) * 0.7]}
            castShadow
          >
            <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
            <meshStandardMaterial color={segment.color} metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Hermes — director of the studio */}
      <Agent position={[0, 0, 5]} color={0x00ddff} name="Hermes" phase={1.2} />

      {/* Portal back to hub */}
      <RoomPortal position={[-28, 0, 20]} targetRoom="hub" color={0x00ffff} />

      {/* Sparkles */}
      <Sparkles count={20} scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]} size={0.6} speed={0.2} opacity={0.15} color="#ff44ff" />
    </>
  )
}
