import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MetalFloor, ConcreteWall } from '../RealMaterials'

// Urban hub: 14m × 14m × 4m — feels like a converted warehouse nexus
const W = 14
const D = 14
const H = 4

// ─── Central energy orb ──────────────────────────────────────────────────────
const EnergyOrb = () => {
  const orbRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.4
      const s = 1 + Math.sin(t * 1.5) * 0.04
      orbRef.current.scale.setScalar(s)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.3
    }
  })
  return (
    <group position={[0, 1.4, 0]}>
      {/* Core orb */}
      <mesh ref={orbRef} castShadow>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color={0x00aaff}
          emissive={0x0066cc}
          emissiveIntensity={1.2}
          metalness={0.3}
          roughness={0.1}
          wireframe={false}
        />
      </mesh>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.65, 0.02, 8, 64]} />
        <meshStandardMaterial
          color={0x00ffff}
          emissive={0x00ffff}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Glow light */}
      <pointLight intensity={3} color={0x00aaff} distance={8} decay={2} castShadow />
    </group>
  )
}

// ─── Industrial wall lamp ─────────────────────────────────────────────────────
const WallLamp = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/industrial_wall_lamp/industrial_wall_lamp_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return (
    <group position={position} rotation={rotation}>
      <primitive object={clone} scale={[0.8, 0.8, 0.8]} />
      <pointLight intensity={1.5} color={0xffaa44} distance={5} decay={2} />
    </group>
  )
}

// ─── Planter box ─────────────────────────────────────────────────────────────
const PlanterBox = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const { scene } = useGLTF('/models/planter_box_01/planter_box_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} scale={[scale, scale, scale]} />
}

// ─── Bar stools ───────────────────────────────────────────────────────────────
const BarStool = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/bar_chair_round_01/bar_chair_round_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[0.9, 0.9, 0.9]} />
}

// ─── Modern ceiling lamp ──────────────────────────────────────────────────────
const CeilingLamp = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF('/models/modern_ceiling_lamp_01/modern_ceiling_lamp_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return (
    <group position={position}>
      <primitive object={clone} scale={[0.9, 0.9, 0.9]} />
      <pointLight intensity={2} color={0xfff0dd} distance={7} decay={2} castShadow />
    </group>
  )
}

// ─── Sofa ─────────────────────────────────────────────────────────────────────
const Sofa = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/Sofa_01/Sofa_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1.1, 1.1, 1.1]} />
}

// ─── Urban exposed pipe accent ────────────────────────────────────────────────
const ExposedPipe = ({ position, length, axis = 'x' }: { position: [number, number, number]; length: number; axis?: string }) => (
  <group position={position} rotation={axis === 'z' ? [0, Math.PI/2, 0] : [0, 0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.04, 0.04, length, 8]} rotation={[0, 0, Math.PI/2] as any} />
      <meshStandardMaterial color={0x444444} metalness={0.9} roughness={0.3} />
    </mesh>
  </group>
)

// ─── HubRoom ──────────────────────────────────────────────────────────────────
export const HubRoom = () => {
  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.3} color={0x223344} />
      <directionalLight position={[3, H - 0.3, 3]} intensity={0.5} color={0xffeedd} castShadow />

      {/* ── Surfaces ── */}
      <MetalFloor width={W} depth={D} position={[0, 0, 0]} repeat={5} />

      {/* Ceiling — exposed concrete */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={0x2a2a2a} roughness={0.9} metalness={0.15} />
      </mesh>

      {/* ── Walls — urban concrete ── */}
      <ConcreteWall width={W} height={H} position={[0, H/2, -D/2]} rotation={[0, 0, 0]} />
      <ConcreteWall width={W} height={H} position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]} />
      <ConcreteWall width={D} height={H} position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} />
      <ConcreteWall width={D} height={H} position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]} />

      {/* ── Exposed pipes along ceiling (urban industrial) ── */}
      <ExposedPipe position={[0, H - 0.2, -D/2 + 1]} length={W - 2} axis="x" />
      <ExposedPipe position={[-W/2 + 1, H - 0.2, 0]} length={D - 2} axis="z" />

      {/* ── Wall lamps (warm industrial) ── */}
      <WallLamp position={[-W/2 + 0.1, H - 1, -3]} rotation={[0, Math.PI/2, 0]} />
      <WallLamp position={[-W/2 + 0.1, H - 1, 3]} rotation={[0, Math.PI/2, 0]} />
      <WallLamp position={[W/2 - 0.1, H - 1, -3]} rotation={[0, -Math.PI/2, 0]} />
      <WallLamp position={[W/2 - 0.1, H - 1, 3]} rotation={[0, -Math.PI/2, 0]} />

      {/* ── Pendant ceiling lamps ── */}
      <CeilingLamp position={[-3.5, H - 0.1, -3.5]} />
      <CeilingLamp position={[3.5, H - 0.1, -3.5]} />
      <CeilingLamp position={[-3.5, H - 0.1, 3.5]} />
      <CeilingLamp position={[3.5, H - 0.1, 3.5]} />

      {/* ── Central energy orb ── */}
      <EnergyOrb />

      {/* ── Lounge area — sofa + bar stools around orb ── */}
      <Sofa position={[-3.5, 0, 2.5]} rotation={[0, Math.PI / 6, 0]} />
      <Sofa position={[3.5, 0, 2.5]} rotation={[0, -Math.PI / 6, 0]} />
      <BarStool position={[-1.5, 0, -2]} rotation={[0, 0.3, 0]} />
      <BarStool position={[0, 0, -2.5]} rotation={[0, 0, 0]} />
      <BarStool position={[1.5, 0, -2]} rotation={[0, -0.3, 0]} />

      {/* ── Urban planters (greenery along walls) ── */}
      <PlanterBox position={[-W/2 + 0.5, 0, -D/2 + 0.5]} scale={1.0} />
      <PlanterBox position={[W/2 - 0.5, 0, -D/2 + 0.5]} scale={1.0} />
      <PlanterBox position={[-W/2 + 0.5, 0, D/2 - 0.5]} scale={1.0} />
      <PlanterBox position={[W/2 - 0.5, 0, D/2 - 0.5]} scale={1.0} />

      {/* ── Blue LED accent strips at floor (urban cool) ── */}
      {[
        [-W/2 + 0.05, 0.03, 0],
        [W/2 - 0.05, 0.03, 0],
        [0, 0.03, -D/2 + 0.05],
        [0, 0.03, D/2 - 0.05],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z] as [number,number,number]}
          rotation={[0, i < 2 ? Math.PI/2 : 0, 0]}>
          <boxGeometry args={[i < 2 ? D : W, 0.025, 0.025]} />
          <meshStandardMaterial color={0x0066ff} emissive={0x0066ff} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

useGLTF.preload('/models/industrial_wall_lamp/industrial_wall_lamp_1k.gltf')
useGLTF.preload('/models/planter_box_01/planter_box_01_1k.gltf')
useGLTF.preload('/models/bar_chair_round_01/bar_chair_round_01_1k.gltf')
useGLTF.preload('/models/modern_ceiling_lamp_01/modern_ceiling_lamp_01_1k.gltf')
useGLTF.preload('/models/Sofa_01/Sofa_01_1k.gltf')
