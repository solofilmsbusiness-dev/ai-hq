import * as THREE from 'three'
import { Text, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import { MetalFloor, ConcreteWall } from '../RealMaterials'

const ROOM_WIDTH = 30
const ROOM_DEPTH = 30
const ROOM_HEIGHT = 10

const SofaModel = ({ position, rotation = 0 }: { position: [number,number,number], rotation?: number }) => {
  const { scene } = useGLTF('/models/Sofa_01/Sofa_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={[0, rotation, 0]} scale={1.2} />
}

const ChairModel = ({ position, rotation = 0 }: { position: [number,number,number], rotation?: number }) => {
  const { scene } = useGLTF('/models/ArmChair_01/ArmChair_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={[0, rotation, 0]} scale={1} />
}

const TableModel = ({ position }: { position: [number,number,number] }) => {
  const { scene } = useGLTF('/models/WoodenTable_01/WoodenTable_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} position={position} scale={1.3} />
}

export const StudioRoom = () => {
  return (
    <group position={[0, 0, -30]}>
      {/* Lighting */}
      <spotLight position={[0, 9, 0]} target-position={[0, 0, -30]} intensity={5} angle={Math.PI/3} penumbra={0.5} color={0x8844ff} castShadow />
      <pointLight position={[-8, 4, 0]} intensity={3} color={0xff44aa} distance={20} decay={2} />
      <pointLight position={[8, 4, 0]} intensity={3} color={0x8844ff} distance={20} decay={2} />
      <pointLight position={[0, 2, 5]} intensity={2} color={0xffaa44} distance={12} decay={2} />
      <ambientLight intensity={0.25} color={0x180a30} />

      {/* Real surfaces */}
      <Suspense fallback={
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
          <meshStandardMaterial color="#0f0a1a" metalness={0.6} roughness={0.5} />
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
        <meshStandardMaterial color="#080510" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Real 3D furniture */}
      <Suspense fallback={null}>
        <SofaModel position={[0, 0, -3]} rotation={0} />
        <ChairModel position={[-5, 0, -3]} rotation={Math.PI * 0.1} />
        <ChairModel position={[5, 0, -3]} rotation={-Math.PI * 0.1} />
        <TableModel position={[0, 0, -7]} />
      </Suspense>

      {/* Neon accent strip on walls */}
      <mesh position={[0, 0.05, -14.9]} rotation={[0, 0, 0]}>
        <boxGeometry args={[28, 0.08, 0.08]} />
        <meshStandardMaterial color={0x8844ff} emissive={0x8844ff} emissiveIntensity={3} />
      </mesh>
      <mesh position={[-14.9, 0.05, 0]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[28, 0.08, 0.08]} />
        <meshStandardMaterial color={0xff44aa} emissive={0xff44aa} emissiveIntensity={3} />
      </mesh>

      {/* Room label */}
      <Text position={[0, 8.5, -14.5]} fontSize={0.8} color="#8844ff" anchorX="center" anchorY="middle">
        CREATIVE STUDIO
      </Text>
    </group>
  )
}

useGLTF.preload('/models/Sofa_01/Sofa_01_1k.gltf')
useGLTF.preload('/models/WoodenTable_01/WoodenTable_01_1k.gltf')
