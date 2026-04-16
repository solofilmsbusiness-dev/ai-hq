import * as THREE from 'three'
import { Sparkles, Text, useGLTF } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { MetalFloor, ConcreteWall } from '../RealMaterials'

const ROOM_WIDTH = 30
const ROOM_DEPTH = 30
const ROOM_HEIGHT = 10

const CentralOrb = () => {
  const orbRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (orbRef.current) { orbRef.current.rotation.x += delta * 0.3; orbRef.current.rotation.y += delta * 0.5 }
    if (ringRef.current) { ringRef.current.rotation.z += delta * 0.4 }
  })
  return (
    <group position={[0, 4.5, 0]}>
      <mesh ref={orbRef} castShadow>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={0xffd700} emissive={0xffd700} emissiveIntensity={2.2} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.05, 16, 100]} />
        <meshStandardMaterial color={0x00ccff} emissive={0x00ccff} emissiveIntensity={1.8} metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2.5} color={0xffd700} distance={20} decay={2} />
    </group>
  )
}

const ArmChairModel = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => {
  const { scene } = useGLTF('/models/ArmChair_01/ArmChair_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) { child.castShadow = true; child.receiveShadow = true }
  })
  return <primitive object={clone} position={position} rotation={[0, rotation, 0]} scale={1} />
}

const DeskLampModel = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF('/models/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) { child.castShadow = true; child.receiveShadow = true }
  })
  return <primitive object={clone} position={position} scale={1.2} />
}

const HangingLampModel = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF('/models/hanging_industrial_lamp/hanging_industrial_lamp_1k.gltf')
  const clone = scene.clone()
  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) { child.castShadow = true; child.receiveShadow = true }
  })
  return <primitive object={clone} position={position} scale={1.5} />
}

export const HubRoom = () => {
  return (
    <>
      {/* Lighting */}
      <spotLight position={[0, 9, 0]} target-position={[0, 0, 0]} intensity={6} angle={Math.PI / 4} penumbra={0.6} color={0xffd700} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-8, 5, -8]} intensity={3} color={0x4488ff} distance={25} decay={2} />
      <pointLight position={[8, 5, -8]} intensity={3} color={0x8844ff} distance={25} decay={2} />
      <pointLight position={[-8, 5, 8]} intensity={2} color={0x00ccff} distance={20} decay={2} />
      <pointLight position={[8, 5, 8]} intensity={2} color={0xffd700} distance={20} decay={2} />
      <ambientLight intensity={0.3} color={0x0a1040} />

      {/* Real PBR floor */}
      <Suspense fallback={
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
        </mesh>
      }>
        <MetalFloor width={ROOM_WIDTH} depth={ROOM_DEPTH} position={[0, 0, 0]} repeat={8} />
      </Suspense>

      {/* Real PBR walls */}
      <Suspense fallback={null}>
        <ConcreteWall width={ROOM_WIDTH} height={ROOM_HEIGHT} position={[0, ROOM_HEIGHT/2, -ROOM_DEPTH/2]} rotation={[0, 0, 0]} />
        <ConcreteWall width={ROOM_WIDTH} height={ROOM_HEIGHT} position={[0, ROOM_HEIGHT/2, ROOM_DEPTH/2]} rotation={[0, Math.PI, 0]} />
        <ConcreteWall width={ROOM_DEPTH} height={ROOM_HEIGHT} position={[-ROOM_WIDTH/2, ROOM_HEIGHT/2, 0]} rotation={[0, Math.PI/2, 0]} />
        <ConcreteWall width={ROOM_DEPTH} height={ROOM_HEIGHT} position={[ROOM_WIDTH/2, ROOM_HEIGHT/2, 0]} rotation={[0, -Math.PI/2, 0]} />
      </Suspense>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#050810" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Central orb */}
      <CentralOrb />

      {/* Floor glow ring */}
      <group position={[0, 0.02, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <mesh>
          <ringGeometry args={[3.6, 4, 64]} />
          <meshStandardMaterial color={0xffd700} emissive={0xffd700} emissiveIntensity={1.2} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh>
          <ringGeometry args={[6.5, 6.7, 64]} />
          <meshStandardMaterial color={0x00ccff} emissive={0x00ccff} emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Real 3D furniture */}
      <Suspense fallback={null}>
        <ArmChairModel position={[5, 0, 5]} rotation={Math.PI * 1.25} />
        <ArmChairModel position={[-5, 0, 5]} rotation={Math.PI * 0.75} />
        <ArmChairModel position={[5, 0, -5]} rotation={Math.PI * 1.75} />
        <ArmChairModel position={[-5, 0, -5]} rotation={Math.PI * 0.25} />
        <DeskLampModel position={[-10, 0, -8]} />
        <DeskLampModel position={[10, 0, -8]} />
        <HangingLampModel position={[0, 9.5, 0]} />
      </Suspense>

      {/* Sparkles */}
      <Sparkles count={40} scale={[20, 8, 20]} size={2} speed={0.3} color={0xffd700} opacity={0.6} />

      {/* Room label */}
      <Text position={[0, 8.5, -14.5]} fontSize={0.8} color="#ffd700" anchorX="center" anchorY="middle">
        AI HQ — HUB
      </Text>
    </>
  )
}

useGLTF.preload('/models/ArmChair_01/ArmChair_01_1k.gltf')
useGLTF.preload('/models/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf')
useGLTF.preload('/models/hanging_industrial_lamp/hanging_industrial_lamp_1k.gltf')
