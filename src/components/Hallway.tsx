import { useMemo } from 'react'
import { Vector3 } from 'three'

interface HallwayProps {
  start: [number, number, number]
  end: [number, number, number]
  width?: number
  height?: number
  lightColor?: string
  ambientIntensity?: number
}

export const Hallway = ({
  start,
  end,
  width = 3.5,
  height = 3.5,
  lightColor = '#FFFFFF',
  ambientIntensity = 0.4,
}: HallwayProps) => {
  const { length, direction, middle } = useMemo(() => {
    const startVec = new Vector3(...start)
    const endVec = new Vector3(...end)
    const lengthVal = startVec.distanceTo(endVec)
    const dir = endVec.clone().sub(startVec).normalize()
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5)
    return {
      length: lengthVal,
      direction: dir,
      middle: mid,
    }
  }, [start, end])

  // Calculate rotation to align hallway with direction
  const angle = Math.atan2(direction.x, direction.z)

  return (
    <group position={[middle.x, 0, middle.z]} rotation={[0, angle, 0]}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#2A2A3E"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, height, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#1A1A2E"
          metalness={0.05}
          roughness={0.9}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, height, length]} />
        <meshStandardMaterial
          color="#2A2A3E"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, height, length]} />
        <meshStandardMaterial
          color="#2A2A3E"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Accent Lighting along hallway */}
      {useMemo(() => {
        const lights = []
        const segments = Math.ceil(length / 5) // Light every 5 units
        for (let i = 0; i <= segments; i++) {
          const z = -length / 2 + (i / segments) * length
          lights.push(
            <pointLight
              key={`hallway-light-${i}`}
              position={[0, height * 0.8, z]}
              intensity={0.3}
              distance={8}
              color={lightColor}
              castShadow={false}
            />
          )
        }
        return lights
      }, [length, height, lightColor])}

      {/* Ambient light for hallway */}
      <pointLight
        position={[0, height * 0.5, 0]}
        intensity={ambientIntensity * 0.5}
        distance={20}
        color={lightColor}
      />
    </group>
  )
}
