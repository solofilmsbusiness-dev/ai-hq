import { useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'

interface FloorProps {
  width?: number
  depth?: number
  position?: [number, number, number]
  repeat?: number
}

export const MetalFloor = ({ width = 30, depth = 30, position = [0, 0, 0], repeat = 6 }: FloorProps) => {
  const [diffuse, normal, rough, arm] = useTexture([
    '/textures/metal_floor/blue_metal_plate_1k_diff.jpg',
    '/textures/metal_floor/blue_metal_plate_1k_nor_gl.jpg',
    '/textures/metal_floor/blue_metal_plate_1k_rough.jpg',
    '/textures/metal_floor/blue_metal_plate_1k_arm.jpg',
  ])
  ;[diffuse, normal, rough, arm].forEach((t) => {
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(repeat, repeat)
    t.needsUpdate = true
  })
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        map={diffuse}
        normalMap={normal}
        roughnessMap={rough}
        aoMap={arm}
        metalness={0.7}
        roughness={0.4}
      />
    </mesh>
  )
}

interface WallProps {
  width?: number
  height?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  repeat?: number
}

export const ConcreteWall = ({ width = 30, height = 10, position = [0, 5, 0], rotation = [0, 0, 0], repeat = 4 }: WallProps) => {
  const [diffuse, normal, rough, arm] = useTexture([
    '/textures/concrete_wall/anti_slip_concrete_1k_diff.jpg',
    '/textures/concrete_wall/anti_slip_concrete_1k_nor_gl.jpg',
    '/textures/concrete_wall/anti_slip_concrete_1k_rough.jpg',
    '/textures/concrete_wall/anti_slip_concrete_1k_arm.jpg',
  ])
  ;[diffuse, normal, rough, arm].forEach((t) => {
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(repeat, Math.ceil(repeat * (height / width)))
    t.needsUpdate = true
  })
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={diffuse}
        normalMap={normal}
        roughnessMap={rough}
        aoMap={arm}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  )
}
