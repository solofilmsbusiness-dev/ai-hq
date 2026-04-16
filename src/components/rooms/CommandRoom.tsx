import * as THREE from 'three'
import { Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'
import { Agent } from '../Agent'
import { LiveTaskBoard } from '../LiveTaskBoard'

// Pulsing red alert lamp
const RedAlert = ({ position }: { position: [number, number, number] }) => {
  const lightRef = useRef<THREE.PointLight>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = (Math.sin(t * 3) + 1) / 2
    if (lightRef.current) lightRef.current.intensity = 0.3 + pulse * 1.8
    if (meshRef.current) {
      const m = meshRef.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.5 + pulse * 2.5
    }
  })
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={0xff0033} emissive={0xff0033} emissiveIntensity={1.5} />
      </mesh>
      <pointLight ref={lightRef} color={0xff0033} distance={15} decay={2} />
    </group>
  )
}

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
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003 + index) * 0.3
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
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + Math.sin(Date.now() * 0.002) * 0.2
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
      {/* Tactical lighting — cool blue + red alerts */}
      <ambientLight intensity={0.08} color={0x0a1a30} />

      {/* Cool blue overhead key */}
      <spotLight
        position={[0, ROOM_HEIGHT - 0.5, 0]}
        target-position={[0, 0, 0]}
        intensity={4.5}
        angle={Math.PI / 2.5}
        penumbra={0.7}
        color={0x4488ff}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        distance={40}
        decay={1.5}
      />

      {/* Cyan rim from behind task board */}
      <pointLight position={[0, 7, -22]} intensity={3} color={0x00ffff} distance={45} decay={2} />

      {/* Red alert lamps in corners */}
      <RedAlert position={[-25, ROOM_HEIGHT - 0.6, -22]} />
      <RedAlert position={[25, ROOM_HEIGHT - 0.6, -22]} />
      <RedAlert position={[-25, ROOM_HEIGHT - 0.6, 22]} />
      <RedAlert position={[25, ROOM_HEIGHT - 0.6, 22]} />

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

      {/* Live agent activity feed */}
      <LiveTaskBoard position={[0, 5, -ROOM_DEPTH / 2 + 0.5]} />

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

      {/* BangOut — operations chief at command */}
      <Agent position={[-6, 0, 8]} color={0x4488ff} name="BangOut" phase={0.5} />
      {/* SoloBrain visiting */}
      <Agent position={[6, 0, 8]} color={0xaa55ff} name="SoloBrain" phase={2.1} />

      {/* Portal back to hub */}
      <RoomPortal position={[0, 0, -22]} targetRoom="hub" color={0x00ffff} />

      {/* Sparkles */}
      <Sparkles count={35} scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]} size={0.8} speed={0.3} opacity={0.15} color="#00ffff" />
    </>
  )
}
