import * as THREE from 'three'
import { Text, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import { MetalFloor, ConcreteWall } from '../RealMaterials'

const ROOM_WIDTH = 30
const ROOM_DEPTH = 30
const ROOM_HEIGHT = 10

const DeskModel = ({ position, rotation = 0 }: { position: [number,number,number], rotation?: number }) => {
  const { scene } = useGLTF('/models/SchoolDesk_01/SchoolDesk_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={[0, rotation, 0]} scale={1.2} />
}

const ShelfModel = ({ position, rotation = 0 }: { position: [number,number,number], rotation?: number }) => {
  const { scene } = useGLTF('/models/Shelf_01/Shelf_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={[0, rotation, 0]} scale={1} />
}

const TVModel = ({ position, rotation = 0 }: { position: [number,number,number], rotation?: number }) => {
  const { scene } = useGLTF('/models/Television_01/Television_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={[0, rotation, 0]} scale={2} />
}

export const CommandRoom = () => {
  return (
    <group position={[0, 0, 30]}>
      {/* Lighting */}
      <spotLight position={[0, 9, 0]} target-position={[0, 0, 30]} intensity={5} angle={Math.PI/3} penumbra={0.5} color={0x4488ff} castShadow />
      <pointLight position={[-8, 4, 0]} intensity={3} color={0x00ccff} distance={20} decay={2} />
      <pointLight position={[8, 4, 0]} intensity={3} color={0x4488ff} distance={20} decay={2} />
      <pointLight position={[0, 4, -10]} intensity={2} color={0xff2244} distance={15} decay={2} />
      <ambientLight intensity={0.2} color={0x001030} />

      {/* Real surfaces */}
      <Suspense fallback={
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
          <meshStandardMaterial color="#0a1020" metalness={0.8} roughness={0.3} />
        </mesh>
      }>
        <MetalFloor width={ROOM_WIDTH} depth={ROOM_DEPTH} position={[0, 0, 0]} repeat={8} />
      </Suspense>
      <Suspense fallback={null}>
        <ConcreteWall width={ROOM_WIDTH} height={ROOM_HEIGHT} position={[0, ROOM_HEIGHT/2, -ROOM_DEPTH/2]} rotation={[0,0,0]} />
        <ConcreteWall width={ROOM_WIDTH} height={ROOM_HEIGHT} position={[0, ROOM_HEIGHT/2, ROOM_DEPTH/2]} rotation={[0,Math.PI,0]} />
        <ConcreteWall width={ROOM_DEPTH} height={ROOM_HEIGHT} position={[-ROOM_WIDTH/2, ROOM_HEIGHT/2, 0]} rotation={[0,Math.PI/2,0]} />
        <ConcreteWall width={ROOM_DEPTH} height={ROOM_HEIGHT} position={[ROOM_WIDTH/2, ROOM_HEIGHT/2, 0]} rotation={[0,-Math.PI/2,0]} />
      </Suspense>
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI/2,0,0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#050810" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Real 3D furniture */}
      <Suspense fallback={null}>
        <DeskModel position={[-9, 0, -5]} rotation={0} />
        <DeskModel position={[-3, 0, -5]} rotation={0} />
        <DeskModel position={[3, 0, -5]} rotation={0} />
        <DeskModel position={[9, 0, -5]} rotation={0} />
        <ShelfModel position={[-12, 0, -13]} rotation={Math.PI/2} />
        <ShelfModel position={[12, 0, -13]} rotation={-Math.PI/2} />
        <TVModel position={[0, 3, -14]} rotation={0} />
      </Suspense>

      {/* Holographic screen glow behind TV */}
      <mesh position={[0, 3, -13.5]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={0x002244} emissive={0x0044ff} emissiveIntensity={0.4} transparent opacity={0.3} />
      </mesh>

      {/* Floor grid lines */}
      <gridHelper args={[28, 14, 0x004488, 0x002244]} position={[0, 0.01, 0]} />

      {/* Room label */}
      <Text position={[0, 8.5, -14.5]} fontSize={0.8} color="#4488ff" anchorX="center" anchorY="middle">
        COMMAND CENTER
      </Text>
    </group>
  )
}

useGLTF.preload('/models/SchoolDesk_01/SchoolDesk_01_1k.gltf')
useGLTF.preload('/models/Shelf_01/Shelf_01_1k.gltf')
useGLTF.preload('/models/Television_01/Television_01_1k.gltf')
