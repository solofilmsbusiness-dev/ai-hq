import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRoomStore, RoomType } from '@/state/roomStore'
import { useCameraStore } from '@/state/cameraStore'

interface RoomPortalProps {
  position: [number, number, number]
  targetRoom: RoomType
  label: string
  color: number
}

const getRoomSpawnPoint = (room: RoomType): [number, number, number] => {
  switch (room) {
    case 'hub':
      return [0, 1.6, -10]
    case 'studio':
      return [-15, 1.6, 0]
    case 'arcade':
      return [15, 1.6, 0]
    case 'command':
      return [0, 1.6, 15]
    default:
      return [0, 1.6, 0]
  }
}

export const RoomPortal = ({ position, targetRoom, label, color }: RoomPortalProps) => {
  const glowRef = useRef<THREE.Mesh>(null)
  const setCurrentRoom = useRoomStore((state) => state.setCurrentRoom)
  const setCameraPosition = useCameraStore((state) => state.setPosition)

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.rotation.z += 0.01
      glowRef.current.position.y += Math.sin(Date.now() * 0.003) * 0.01
    }
  })

  const handlePortalClick = () => {
    setCurrentRoom(targetRoom)
    const spawnPoint = getRoomSpawnPoint(targetRoom)
    setCameraPosition(spawnPoint)
  }

  return (
    <group position={position}>
      {/* Portal ring (glowing, rotatable) */}
      <mesh ref={glowRef} position={[0, 1.5, 0.5]} onClick={handlePortalClick}>
        <torusGeometry args={[2.5, 0.2, 32, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Portal center glow */}
      <mesh position={[0, 1.5, 0]} onClick={handlePortalClick}>
        <cylinderGeometry args={[2.2, 2.2, 0.1, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Portal light */}
      <pointLight position={[0, 1.5, 0]} intensity={1.2} color={color} distance={15} />

      {/* Label */}
      <group position={[0, 0.5, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[3, 0.6, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Interaction hint - visible on hover */}
      <mesh position={[0, -1.2, 0.5]} onClick={handlePortalClick}>
        <boxGeometry args={[4, 0.5, 0.1]} />
        <meshStandardMaterial
          color={0x000000}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  )
}
