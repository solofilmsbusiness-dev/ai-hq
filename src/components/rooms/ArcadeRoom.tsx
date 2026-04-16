import * as THREE from 'three'
import { Environment, Sparkles } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'
import { PongGame } from './PongGame'

const ROOM_WIDTH = 50
const ROOM_DEPTH = 45
const ROOM_HEIGHT = 12

// Arcade Cabinet Component
const ArcadeCabinet = ({ position, index, onSelect }: { position: [number, number, number]; index: number; onSelect: () => void }) => {
  const [hovered, setHovered] = useState(false)
  const screenRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = hovered ? 0.9 : 0.6
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
      {/* Cabinet body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 3, 0.8]} />
        <meshStandardMaterial color={0x1a1a2a} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Screen */}
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

      {/* Bezel around screen */}
      <mesh position={[0, 1, 0.35]}>
        <boxGeometry args={[1.7, 2, 0.08]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0, 0.2, 0.35]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.6, 0.5]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Buttons */}
      {[
        { x: -0.5, y: 0.25, color: 0xff0000 },
        { x: 0, y: 0.25, color: 0x00ff00 },
        { x: 0.5, y: 0.25, color: 0x0000ff },
        { x: -0.25, y: -0.1, color: 0xffff00 },
        { x: 0.25, y: -0.1, color: 0xff00ff },
      ].map((btn, i) => (
        <mesh key={i} position={[btn.x, btn.y, 0.4]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
          <meshStandardMaterial color={btn.color} emissive={btn.color} emissiveIntensity={0.6} metalness={0.6} />
        </mesh>
      ))}

      {/* Neon outline */}
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

// Neon Signage
const NeonSign = ({ position, text, color }: { position: [number, number, number]; text: string; color: number }) => {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += Math.sin(Date.now() * 0.005) * 0.02
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Sign background */}
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

      {/* Glow light */}
      <pointLight position={[0, 0, 0.5]} intensity={1.5} color={color} distance={20} />
    </group>
  )
}

// Seating area
const CouchSeating = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Couch back */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 1, 0.3]} />
        <meshStandardMaterial color={0x2a1a1a} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Couch seat */}
      <mesh position={[0, -0.6, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.4, 1.5]} />
        <meshStandardMaterial color={0x1a0a0a} metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Side pillows */}
      <mesh position={[-2, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.8, 1]} />
        <meshStandardMaterial color={0x3a2a2a} metalness={0.1} roughness={0.8} />
      </mesh>

      <mesh position={[2, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.8, 1]} />
        <meshStandardMaterial color={0x3a2a2a} metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  )
}

export const ArcadeRoom = () => {
  const floorRef = useRef<THREE.Mesh>(null)
  const [selectedCabinet, setSelectedCabinet] = useState<number | null>(null)

  return (
    <>
      {/* Environment */}
      <Environment preset="studio" />

      {/* Arcade lighting - bright with neon */}
      <ambientLight intensity={0.4} color={0xffffff} />
      <directionalLight
        position={[25, 12, 20]}
        intensity={1.2}
        color={0xffff88}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
      />

      {/* Neon accent lights */}
      <pointLight position={[-20, 8, -15]} intensity={0.8} color={0x00ffff} distance={30} />
      <pointLight position={[20, 8, -15]} intensity={0.8} color={0xff00ff} distance={30} />
      <pointLight position={[0, 8, 15]} intensity={0.8} color={0xffff00} distance={30} />

      {/* Floor */}
      <mesh ref={floorRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x1a1a2a}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x0f0f1f} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Walls */}
      {/* Front */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1a2a} side={THREE.DoubleSide} />
      </mesh>

      {/* Back */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1a2a} side={THREE.DoubleSide} />
      </mesh>

      {/* Left */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1a2a} side={THREE.DoubleSide} />
      </mesh>

      {/* Right */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={0x1a1a2a} side={THREE.DoubleSide} />
      </mesh>

      {/* Main "ARCADE" Neon sign */}
      <NeonSign position={[0, 9, -20]} text="ARCADE" color={0x00ffff} />

      {/* Arcade Cabinets - two rows */}
      {/* Left column */}
      <ArcadeCabinet position={[-15, 1.5, -12]} index={0} onSelect={() => setSelectedCabinet(0)} />
      <ArcadeCabinet position={[-15, 1.5, 0]} index={1} onSelect={() => setSelectedCabinet(1)} />
      <ArcadeCabinet position={[-15, 1.5, 12]} index={2} onSelect={() => setSelectedCabinet(2)} />

      {/* Right column */}
      <ArcadeCabinet position={[15, 1.5, -12]} index={3} onSelect={() => setSelectedCabinet(3)} />
      <ArcadeCabinet position={[15, 1.5, 0]} index={4} onSelect={() => setSelectedCabinet(4)} />
      <ArcadeCabinet position={[15, 1.5, 12]} index={5} onSelect={() => setSelectedCabinet(5)} />

      {/* Pong Game - renders when cabinet selected */}
      {selectedCabinet !== null && <PongGame onClose={() => setSelectedCabinet(null)} />}

      {/* High Score Display */}
      <group position={[0, 7, -19]}>
        <mesh castShadow>
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

      {/* Seating areas */}
      <CouchSeating position={[-18, 0, 18]} />
      <CouchSeating position={[18, 0, 18]} />

      {/* Portal back to hub */}
      <RoomPortal position={[25, 0, 0]} targetRoom="hub" label="Hub" color={0x00ffff} />

      {/* Sparkles with cyan/magenta tint */}
      <Sparkles count={50} scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]} size={1} speed={0.4} opacity={0.2} />
    </>
  )
}
