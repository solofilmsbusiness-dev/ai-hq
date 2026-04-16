import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { MetalFloor, ConcreteWall } from '../RealMaterials'
import { RoomPortal } from './RoomPortal'

// Command room: 12m × 9m × 3.2m — focused ops center feel
const W = 12
const D = 9
const H = 3.2

// ─── Models ──────────────────────────────────────────────────────────────────
const OfficeDesk = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/metal_office_desk/metal_office_desk_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1, 1, 1]} />
}

const Shelf = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/steel_frame_shelves_01/steel_frame_shelves_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1, 1, 1]} />
}

const FluorescentBar = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/mounted_fluorescent_lights/mounted_fluorescent_lights_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return (
    <group position={position} rotation={rotation}>
      <primitive object={clone} scale={[1.1, 1.1, 1.1]} />
      <pointLight intensity={2.2} color={0xe8f4ff} distance={6} decay={2} />
    </group>
  )
}

// ─── Monitor array ────────────────────────────────────────────────────────────
const MonitorArray = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    {[-0.8, 0, 0.8].map((x, i) => (
      <group key={i} position={[x, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.38, 0.04]} />
          <meshStandardMaterial color={0x111111} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[0.6, 0.34, 0.005]} />
          <meshStandardMaterial
            color={0x001122}
            emissive={i === 1 ? 0x004488 : 0x002244}
            emissiveIntensity={0.7}
          />
        </mesh>
        <mesh position={[0, -0.26, 0.02]} castShadow>
          <cylinderGeometry args={[0.025, 0.04, 0.16, 8]} />
          <meshStandardMaterial color={0x1a1a1a} metalness={0.9} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 0, 0.15]} intensity={0.2} color={0x0055aa} distance={1.5} decay={2} />
      </group>
    ))}
    {/* Wall mount bar */}
    <mesh position={[0, 0.28, -0.04]}>
      <boxGeometry args={[2.6, 0.04, 0.04]} />
      <meshStandardMaterial color={0x333333} metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
)

// ─── LED accent strip ─────────────────────────────────────────────────────────
const AccentStrip = ({ position, length, axis = 'x', color = 0x0044ff }: {
  position: [number, number, number]; length: number; axis?: string; color?: number
}) => (
  <group position={position}>
    <mesh rotation={axis === 'z' ? [0, Math.PI / 2, 0] : [0, 0, 0]}>
      <boxGeometry args={[length, 0.02, 0.02]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} toneMapped={false} />
    </mesh>
    <pointLight intensity={0.3} color={color} distance={3} decay={2} />
  </group>
)

// ─── CommandRoom ─────────────────────────────────────────────────────────────
export const CommandRoom = () => {
  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.25} color={0x112233} />
      <directionalLight position={[0, H - 0.5, 0]} intensity={0.5} color={0xe0eeff} castShadow />

      {/* Fluorescent bars across ceiling */}
      <FluorescentBar position={[-3, H - 0.1, -2]} rotation={[0, 0, 0]} />
      <FluorescentBar position={[3, H - 0.1, -2]} rotation={[0, 0, 0]} />
      <FluorescentBar position={[-3, H - 0.1, 2]} rotation={[0, 0, 0]} />
      <FluorescentBar position={[3, H - 0.1, 2]} rotation={[0, 0, 0]} />

      {/* ── Surfaces ── */}
      <MetalFloor width={W} depth={D} position={[0, 0, 0]} repeat={4} />

      {/* Ceiling */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={0x111118} roughness={0.95} metalness={0.1} />
      </mesh>

      {/* ── Walls ── */}
      <ConcreteWall width={W} height={H} position={[0, H/2, -D/2]} rotation={[0, 0, 0]} />
      <ConcreteWall width={W} height={H} position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]} />
      <ConcreteWall width={D} height={H} position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} />
      <ConcreteWall width={D} height={H} position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]} />

      {/* LED accent strips — command blue */}
      <AccentStrip position={[0, 0.04, -D/2 + 0.05]} length={W} axis="x" color={0x0055ff} />
      <AccentStrip position={[0, 0.04, D/2 - 0.05]} length={W} axis="x" color={0x0055ff} />
      <AccentStrip position={[-W/2 + 0.05, 0.04, 0]} length={D} axis="z" color={0x00aaff} />
      <AccentStrip position={[W/2 - 0.05, 0.04, 0]} length={D} axis="z" color={0x00aaff} />
      {/* Mid-wall strips */}
      <AccentStrip position={[0, H/2, -D/2 + 0.05]} length={W} axis="x" color={0x003399} />
      <AccentStrip position={[0, H/2, D/2 - 0.05]} length={W} axis="x" color={0x003399} />

      {/* ── Main monitor wall ── */}
      <MonitorArray position={[0, 1.6, -D/2 + 0.15]} rotation={[0, 0, 0]} />

      {/* ── Desks facing the monitor wall ── */}
      <OfficeDesk position={[-2.5, 0, -1.5]} rotation={[0, 0, 0]} />
      <OfficeDesk position={[0, 0, -1.5]} rotation={[0, 0, 0]} />
      <OfficeDesk position={[2.5, 0, -1.5]} rotation={[0, 0, 0]} />

      {/* Monitors on desks */}
      {[-2.5, 0, 2.5].map((x, i) => (
        <group key={i} position={[x, 0.85, -1.7]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.33, 0.04]} />
            <meshStandardMaterial color={0x111111} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <boxGeometry args={[0.5, 0.3, 0.005]} />
            <meshStandardMaterial color={0x001122} emissive={0x002255} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Shelving units on side wall ── */}
      <Shelf position={[-W/2 + 0.3, 0, -2]} rotation={[0, Math.PI/2, 0]} />
      <Shelf position={[-W/2 + 0.3, 0, 1]} rotation={[0, Math.PI/2, 0]} />

      {/* ── Portal back to hub ── */}
      <RoomPortal position={[0, 0, -D/2 + 0.2]} targetRoom="hub" color={0x0055ff} />
    </>
  )
}

useGLTF.preload('/models/metal_office_desk/metal_office_desk_1k.gltf')
useGLTF.preload('/models/steel_frame_shelves_01/steel_frame_shelves_01_1k.gltf')
useGLTF.preload('/models/mounted_fluorescent_lights/mounted_fluorescent_lights_1k.gltf')
