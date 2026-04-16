import * as THREE from 'three'
import { Environment, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'

const ROOM_WIDTH = 60
const ROOM_DEPTH = 50
const ROOM_HEIGHT = 12

// Agent Station with animated displays
const AgentStation = ({ position, color, index }: { position: [number, number, number]; color: number; index: number }) => {
  const glowRef = useRef<THREE.Mesh>(null)
  const screenRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.005
    }
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003 + index) * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Base platform */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Central pillar */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow ref={glowRef}>
        <cylinderGeometry args={[1.5, 2, 3, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Top ring */}
      <mesh position={[0, 3.2, 0]}>
        <torusGeometry args={[2.2, 0.2, 32, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Activity display screen */}
      <mesh ref={screenRef} position={[0, 2, 0.8]} castShadow>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial
          color={0x001a00}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Holographic lines animation */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.2 + i * 0.4, 0.7]}>
          <boxGeometry args={[1.8, 0.1, 0.05]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Light source */}
      <pointLight position={[0, 2, 1]} intensity={0.8} color={color} distance={18} />
    </group>
  )
}

// Central Task Board Display
const TaskBoard = () => {
  const boardRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (boardRef.current) {
      boardRef.current.rotation.y += 0.001
    }
  })

  return (
    <group position={[0, 6, -18]} ref={boardRef}>
      {/* Main display */}
      <mesh castShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial
          color={0x001f1f}
          emissive={0x00ffff}
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Display frame */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[12.5, 5.5, 0.15]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Grid overlay on display */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <mesh key={`${row}-${col}`} position={[-4 + col * 4, 2 - row * 1.3, 0.1]}>
            <boxGeometry args={[3.5, 1, 0.05]} />
            <meshStandardMaterial
              color={0x00ff00}
              emissive={0x00ff00}
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))
      )}

      {/* Glow light */}
      <pointLight position={[0, 0, 1]} intensity={1.5} color={0x00ffff} distance={30} />
    </group>
  )
}

// Activity Monitor Screens
const MonitorScreen = ({ position, color }: { position: [number, number, number]; color: number }) => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.4 + Math.sin(Date.now() * 0.002) * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Screen */}
      <mesh ref={ref} castShadow>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial
          color={0x000033}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Bezel */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, 0.3]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Activity indicator */}
      <pointLight position={[0, 0.6, 0.1]} intensity={0.6} color={color} distance={10} />
    </group>
  )
}

export const CommandRoom = () => {
  const floorRef = useRef<THREE.Mesh>(null)

  return (
    <>
      {/* Environment */}
      <Environment preset="studio" />

      {/* Command center lighting - tactical */}
      <ambientLight intensity={0.25} color={0xffffff} />
      <directionalLight
        position={[30, 15, 25]}
        intensity={1.4}
        color={0xffd700}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Cyan accent light */}
      <pointLight position={[0, 10, 0]} intensity={0.8} color={0x00ffff} distance={50} />

      {/* Floor */}
      <mesh ref={floorRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0a0a0f} roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0f0f15} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Walls */}
      {/* Front */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f15} side={THREE.DoubleSide} />
      </mesh>

      {/* Back */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f15} side={THREE.DoubleSide} />
      </mesh>

      {/* Left */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f15} side={THREE.DoubleSide} />
      </mesh>

      {/* Right */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x0f0f15} side={THREE.DoubleSide} />
      </mesh>

      {/* Central task board */}
      <TaskBoard />

      {/* Agent stations - arranged in circle */}
      <AgentStation position={[-18, 0, 0]} color={0x4488ff} index={0} />
      <AgentStation position={[0, 0, -18]} color={0x8844ff} index={1} />
      <AgentStation position={[18, 0, 0]} color={0x00ffff} index={2} />
      <AgentStation position={[0, 0, 18]} color={0xff44ff} index={3} />

      {/* Monitor screens - left wall */}
      <MonitorScreen position={[-28, 5, -10]} color={0xff00ff} />
      <MonitorScreen position={[-28, 5, 0]} color={0x00ff00} />
      <MonitorScreen position={[-28, 5, 10]} color={0x00ffff} />

      {/* Monitor screens - right wall */}
      <MonitorScreen position={[28, 5, -10]} color={0xff00ff} />
      <MonitorScreen position={[28, 5, 0]} color={0x00ff00} />
      <MonitorScreen position={[28, 5, 10]} color={0x00ffff} />

      {/* Support pillars */}
      <mesh position={[-20, ROOM_HEIGHT / 2, -18]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, ROOM_HEIGHT, 32]} />
        <meshStandardMaterial color={0xffd700} metalness={0.8} roughness={0.2} emissive={0xffd700} emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[20, ROOM_HEIGHT / 2, 18]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, ROOM_HEIGHT, 32]} />
        <meshStandardMaterial color={0xffd700} metalness={0.8} roughness={0.2} emissive={0xffd700} emissiveIntensity={0.25} />
      </mesh>

      {/* Portal back to hub */}
      <RoomPortal position={[0, 0, -22]} targetRoom="hub" label="Hub" color={0x00ffff} />

      {/* Sparkles */}
      <Sparkles count={35} scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]} size={0.8} speed={0.3} opacity={0.15} />
    </>
  )
}
