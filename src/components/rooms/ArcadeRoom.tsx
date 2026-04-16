import * as THREE from 'three'
import { Sparkles, useGLTF } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'
import { PongGame } from './PongGame'
import { MetalFloor } from '../RealMaterials'

// ─── Flickering neon point light ───────────────────────────────────────────
const NeonFlicker = ({
  position,
  color,
}: {
  position: [number, number, number]
  color: number
}) => {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (\!ref.current) return
    const t = clock.getElapsedTime()
    const flicker =
      0.7 + Math.sin(t * 17 + position[0]) * 0.15 + Math.sin(t * 29) * 0.1
    const drop = Math.random() < 0.01 ? 0.3 : 1
    ref.current.intensity = flicker * drop * 1.6
  })
  return (
    <pointLight
      ref={ref}
      position={position}
      color={color}
      distance={28}
      decay={2}
    />
  )
}

// ─── Real Sofa Model ────────────────────────────────────────────────────────
const SofaModel = ({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) => {
  const { scene } = useGLTF('/models/Sofa_01/Sofa_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => {
    if (n.isMesh) {
      n.castShadow = true
      n.receiveShadow = true
    }
  })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1.8, 1.8, 1.8]} />
}

// ─── Real Hanging Lamp ──────────────────────────────────────────────────────
const HangingLampModel = ({
  position,
}: {
  position: [number, number, number]
}) => {
  const { scene } = useGLTF('/models/hanging_industrial_lamp/hanging_industrial_lamp_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => {
    if (n.isMesh) {
      n.castShadow = true
      n.receiveShadow = true
    }
  })
  return (
    <group position={position}>
      <primitive object={clone} scale={[1.2, 1.2, 1.2]} />
      <pointLight intensity={0.8} color={0x9900ff} distance={18} decay={2} />
    </group>
  )
}

// ─── Arcade Cabinet ─────────────────────────────────────────────────────────
const ArcadeCabinet = ({
  position,
  index,
  onSelect,
}: {
  position: [number, number, number]
  index: number
  onSelect: () => void
}) => {
  const [hovered, setHovered] = useState(false)
  const screenRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (screenRef.current) {
      ;(
        screenRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = hovered ? 0.9 : 0.6
    }
    if (glowRef.current) {
      glowRef.current.scale.set(
        hovered ? 1.1 : 1,
        hovered ? 1.1 : 1,
        hovered ? 1.1 : 1
      )
    }
  })
  return (
    <group ref={glowRef} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 3, 0.8]} />
        <meshStandardMaterial color={0x1a1a2a} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh
        position={[0, 1, 0.42]}
        castShadow
        ref={screenRef}
        onClick={onSelect}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 1.8, 0.1]} />
        <meshStandardMaterial
          color={0x000033}
          emissive={index % 2 === 0 ? 0x00ffff : 0xff00ff}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 1, 0.35]}>
        <boxGeometry args={[1.7, 2, 0.08]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.35]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.6, 0.5]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.3} roughness={0.7} />
      </mesh>
      {[
        { x: -0.5, y: 0.25, color: 0xff0000 },
        { x: 0, y: 0.25, color: 0x00ff00 },
        { x: 0.5, y: 0.25, color: 0x0000ff },
        { x: -0.25, y: -0.1, color: 0xffff00 },
        { x: 0.25, y: -0.1, color: 0xff00ff },
      ].map((btn, i) => (
        <mesh key={i} position={[btn.x, btn.y, 0.4]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
          <meshStandardMaterial
            color={btn.color}
            emissive={btn.color}
            emissiveIntensity={0.6}
            metalness={0.6}
          />
        </mesh>
      ))}
      {hovered && (
        <pointLight
          position={[0, 1, 0.5]}
          intensity={0.8}
          color={index % 2 === 0 ? 0x00ffff : 0xff00ff}
          distance={8}
        />
      )}
    </group>
  )
}

// ─── Neon Sign ───────────────────────────────────────────────────────────────
const NeonSign = ({
  position,
  color,
}: {
  position: [number, number, number]
  color: number
}) => {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += Math.sin(Date.now() * 0.005) * 0.001
    }
  })
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <boxGeometry args={[6, 1.5, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 0, 0.5]} intensity={1.5} color={color} distance={20} />
    </group>
  )
}

// ─── Neon wall strip ─────────────────────────────────────────────────────────
const NeonStrip = ({
  position,
  rotation,
  color,
  length = 10,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  color: number
  length?: number
}) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <boxGeometry args={[length, 0.08, 0.08]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
    <pointLight intensity={0.4} color={color} distance={8} decay={2} />
  </group>
)

const ROOM_WIDTH = 50
const ROOM_DEPTH = 45
const ROOM_HEIGHT = 12

// ─── ArcadeRoom ──────────────────────────────────────────────────────────────
export const ArcadeRoom = () => {
  const [selectedCabinet, setSelectedCabinet] = useState<number | null>(null)

  return (
    <>
      {/* Arcade ambient — very dark, neon lit */}
      <ambientLight intensity={0.08} color={0x110a22} />

      {/* Flickering neon lights */}
      <NeonFlicker position={[-20, 8, -15]} color={0x00ffff} />
      <NeonFlicker position={[20, 8, -15]} color={0xff00ff} />
      <NeonFlicker position={[0, 8, 18]} color={0xffff00} />
      <NeonFlicker position={[-18, 6, 18]} color={0xff44ff} />
      <NeonFlicker position={[18, 6, 18]} color={0x00ffff} />
      <directionalLight position={[10, 12, 5]} intensity={0.2} color={0xff66cc} />

      {/* ── Real PBR floor (dark tinted by arcade lighting) ── */}
      <MetalFloor width={ROOM_WIDTH} depth={ROOM_DEPTH} position={[0, 0, 0]} repeat={8} />

      {/* ── Ceiling ── */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0a0a14} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── Walls — dark metal panels with neon strip accents ── */}
      {/* Front */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x12121f} roughness={0.7} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Back */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x12121f} roughness={0.7} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Left */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x12121f} roughness={0.7} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Right */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x12121f} roughness={0.7} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Neon strips along walls at floor and mid-height ── */}
      <NeonStrip position={[-ROOM_WIDTH / 2 + 0.1, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} color={0x00ffff} length={ROOM_DEPTH} />
      <NeonStrip position={[ROOM_WIDTH / 2 - 0.1, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} color={0xff00ff} length={ROOM_DEPTH} />
      <NeonStrip position={[0, 0.1, -ROOM_DEPTH / 2 + 0.1]} rotation={[0, 0, 0]} color={0x9900ff} length={ROOM_WIDTH} />
      <NeonStrip position={[0, 0.1, ROOM_DEPTH / 2 - 0.1]} rotation={[0, 0, 0]} color={0xffff00} length={ROOM_WIDTH} />
      {/* Mid-wall strips */}
      <NeonStrip position={[-ROOM_WIDTH / 2 + 0.1, 5, 0]} rotation={[0, Math.PI / 2, 0]} color={0xff00ff} length={ROOM_DEPTH} />
      <NeonStrip position={[ROOM_WIDTH / 2 - 0.1, 5, 0]} rotation={[0, Math.PI / 2, 0]} color={0x00ffff} length={ROOM_DEPTH} />

      {/* ── Hanging industrial lamps overhead ── */}
      <HangingLampModel position={[-8, ROOM_HEIGHT, -8]} />
      <HangingLampModel position={[8, ROOM_HEIGHT, -8]} />
      <HangingLampModel position={[-8, ROOM_HEIGHT, 8]} />
      <HangingLampModel position={[8, ROOM_HEIGHT, 8]} />
      <HangingLampModel position={[0, ROOM_HEIGHT, 0]} />

      {/* ── Main ARCADE neon sign ── */}
      <NeonSign position={[0, 9, -ROOM_DEPTH / 2 + 1]} color={0x00ffff} />
      {/* High score strip */}
      <group position={[0, 7, -ROOM_DEPTH / 2 + 1]}>
        <mesh>
          <boxGeometry args={[10, 1.5, 0.1]} />
          <meshStandardMaterial
            color={0xff00ff}
            emissive={0xff00ff}
            emissiveIntensity={0.6}
            metalness={0.8}
          />
        </mesh>
        <pointLight position={[0, 0, 0.5]} intensity={1.2} color={0xff00ff} distance={20} />
      </group>

      {/* ── Arcade Cabinets ── */}
      <ArcadeCabinet position={[-15, 1.5, -12]} index={0} onSelect={() => setSelectedCabinet(0)} />
      <ArcadeCabinet position={[-15, 1.5, 0]}  index={1} onSelect={() => setSelectedCabinet(1)} />
      <ArcadeCabinet position={[-15, 1.5, 12]} index={2} onSelect={() => setSelectedCabinet(2)} />
      <ArcadeCabinet position={[15, 1.5, -12]}  index={3} onSelect={() => setSelectedCabinet(3)} />
      <ArcadeCabinet position={[15, 1.5, 0]}   index={4} onSelect={() => setSelectedCabinet(4)} />
      <ArcadeCabinet position={[15, 1.5, 12]}  index={5} onSelect={() => setSelectedCabinet(5)} />

      {/* ── Pong Game overlay ── */}
      {selectedCabinet \!== null && (
        <PongGame onClose={() => setSelectedCabinet(null)} />
      )}

      {/* ── Real Sofa seating areas ── */}
      <SofaModel position={[-18, 0, 16]} rotation={[0, Math.PI / 4, 0]} />
      <SofaModel position={[18, 0, 16]}  rotation={[0, -Math.PI / 4, 0]} />
      <SofaModel position={[0, 0, 18]}   rotation={[0, Math.PI, 0]} />

      {/* ── Portal back to hub ── */}
      <RoomPortal position={[-25, 0, 0]} targetRoom="hub" color={0x00ffff} />

      {/* ── Sparkles ── */}
      <Sparkles
        count={60}
        scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]}
        size={1.2}
        speed={0.3}
        opacity={0.25}
        color={0x9900ff}
      />
    </>
  )
}

useGLTF.preload('/models/Sofa_01/Sofa_01_1k.gltf')
useGLTF.preload('/models/hanging_industrial_lamp/hanging_industrial_lamp_1k.gltf')
