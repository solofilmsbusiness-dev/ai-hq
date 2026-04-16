import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

interface AgentProps {
  position: [number, number, number]
  color: number
  name: string
  /** seed offset so multiple agents bob/rotate out of sync */
  phase?: number
}

/**
 * Humanoid agent figure: capsule body, glowing head, soft aura, name label.
 * Idle animation: subtle bob + slow rotation.
 */
export const Agent = ({ position, color, name, phase = 0 }: AgentProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const auraRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.08
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.25
    }
    if (auraRef.current) {
      const m = auraRef.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.18 + Math.sin(t * 2) * 0.05
    }
    if (headRef.current) {
      const m = headRef.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 1.6 + Math.sin(t * 3) * 0.4
    }
  })

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Aura shell */}
        <mesh ref={auraRef} position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
        </mesh>

        {/* Body — capsule */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <capsuleGeometry args={[0.28, 0.9, 8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>

        {/* Head — glowing sphere */}
        <mesh ref={headRef} position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.6}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>

        {/* Visor band */}
        <mesh position={[0, 1.7, 0.18]}>
          <boxGeometry args={[0.32, 0.05, 0.06]} />
          <meshStandardMaterial color={0x000000} emissive={0x00ffff} emissiveIntensity={2} />
        </mesh>

        {/* Floating name label */}
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.18}
          color={`#${color.toString(16).padStart(6, '0')}`}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#000000"
        >
          {name}
        </Text>

        {/* Aura point light */}
        <pointLight position={[0, 1.2, 0]} intensity={1.2} color={color} distance={6} decay={2} />
      </group>
    </group>
  )
}
