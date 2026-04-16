import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomPortal } from './RoomPortal'
import { MetalFloor, ConcreteWall } from '../RealMaterials'

// Human-scale studio: 12m wide × 9m deep × 3.2m tall (feels like a real studio)
const W = 12
const D = 9
const H = 3.2

// ─── LED Panel Light ─────────────────────────────────────────────────────────
const LEDPanel = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (\!ref.current) return
    // Very subtle cool-white LED flicker (imperceptible but alive)
    const t = clock.getElapsedTime()
    ;(ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.95 + Math.sin(t * 120 + position[0] * 10) * 0.02
  })
  return (
    <group position={position}>
      {/* Panel housing */}
      <mesh>
        <boxGeometry args={[1.2, 0.04, 0.6]} />
        <meshStandardMaterial color={0x2a2a2a} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* LED emissive face */}
      <mesh ref={ref} position={[0, -0.025, 0]}>
        <boxGeometry args={[1.1, 0.01, 0.55]} />
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xddeeff}
          emissiveIntensity={0.95}
          toneMapped={false}
        />
      </mesh>
      {/* Cool white light output */}
      <pointLight
        position={[0, -0.3, 0]}
        intensity={2.5}
        color={0xddeeff}
        distance={6}
        decay={2}
        castShadow
      />
    </group>
  )
}

// ─── Fluorescent Studio Bar Light ────────────────────────────────────────────
const StudioBar = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={[2.4, 0.06, 0.1]} />
      <meshStandardMaterial color={0x111111} metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, -0.02, 0]}>
      <boxGeometry args={[2.3, 0.02, 0.08]} />
      <meshStandardMaterial
        color={0xffffff}
        emissive={0xe8f4ff}
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </mesh>
    <pointLight position={[0, -0.5, 0]} intensity={1.8} color={0xe8f4ff} distance={5} decay={2} />
  </group>
)

// ─── GLTF Models ─────────────────────────────────────────────────────────────
const FilmCamera = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/Camera_01/Camera_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1.6, 1.6, 1.6]} />
}

const VideoCamera = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/vintage_video_camera/vintage_video_camera_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1.4, 1.4, 1.4]} />
}

const StudioDesk = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/metal_office_desk/metal_office_desk_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1, 1, 1]} />
}

const MountedLights = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/mounted_fluorescent_lights/mounted_fluorescent_lights_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return (
    <group position={position} rotation={rotation}>
      <primitive object={clone} scale={[1.2, 1.2, 1.2]} />
      <pointLight intensity={2} color={0xe8f4ff} distance={6} decay={2} />
    </group>
  )
}

const MetalShelves = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const { scene } = useGLTF('/models/steel_frame_shelves_01/steel_frame_shelves_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} rotation={rotation} scale={[1, 1, 1]} />
}

const Plant = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const { scene } = useGLTF('/models/potted_plant_01/potted_plant_01_1k.gltf')
  const clone = scene.clone()
  clone.traverse((n: any) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
  return <primitive object={clone} position={position} scale={[scale, scale, scale]} />
}

// ─── Acoustic foam panel on wall ─────────────────────────────────────────────
const AcousticPanel = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={[0.6, 0.6, 0.08]} />
    <meshStandardMaterial color={0x1a1a2a} roughness={0.95} metalness={0.0} />
  </mesh>
)

// ─── Monitor screen ───────────────────────────────────────────────────────────
const Monitor = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    {/* Screen */}
    <mesh castShadow>
      <boxGeometry args={[0.7, 0.4, 0.04]} />
      <meshStandardMaterial color={0x111111} metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Display face */}
    <mesh position={[0, 0, 0.022]}>
      <boxGeometry args={[0.65, 0.37, 0.005]} />
      <meshStandardMaterial
        color={0x001133}
        emissive={0x0044aa}
        emissiveIntensity={0.6}
        metalness={0.1}
        roughness={0.1}
      />
    </mesh>
    {/* Stand */}
    <mesh position={[0, -0.28, 0]} castShadow>
      <cylinderGeometry args={[0.03, 0.06, 0.18, 8]} />
      <meshStandardMaterial color={0x222222} metalness={0.9} roughness={0.1} />
    </mesh>
    <mesh position={[0, -0.37, 0.05]}>
      <boxGeometry args={[0.2, 0.02, 0.14]} />
      <meshStandardMaterial color={0x222222} metalness={0.9} roughness={0.1} />
    </mesh>
    <pointLight position={[0, 0, 0.2]} intensity={0.3} color={0x0066ff} distance={2} decay={2} />
  </group>
)

// ─── LED Color strip ─────────────────────────────────────────────────────────
const LEDStrip = ({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: number }) => {
  const midX = (start[0] + end[0]) / 2
  const midY = (start[1] + end[1]) / 2
  const midZ = (start[2] + end[2]) / 2
  const len = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
    Math.pow(end[1] - start[1], 2) +
    Math.pow(end[2] - start[2], 2)
  )
  const isZ = Math.abs(end[2] - start[2]) > Math.abs(end[0] - start[0])
  return (
    <group position={[midX, midY, midZ]}>
      <mesh rotation={isZ ? [0, Math.PI / 2, 0] : [0, 0, 0]}>
        <boxGeometry args={isZ ? [len, 0.03, 0.03] : [len, 0.03, 0.03]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <pointLight intensity={0.5} color={color} distance={3} decay={2} />
    </group>
  )
}

// ─── StudioRoom ───────────────────────────────────────────────────────────────
export const StudioRoom = () => {
  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.4} color={0xffffff} />
      <directionalLight position={[0, H - 0.5, 0]} intensity={0.6} color={0xe8f4ff} castShadow />

      {/* LED panels in ceiling grid */}
      <LEDPanel position={[-3, H - 0.05, -2]} />
      <LEDPanel position={[3, H - 0.05, -2]} />
      <LEDPanel position={[-3, H - 0.05, 2]} />
      <LEDPanel position={[3, H - 0.05, 2]} />
      <LEDPanel position={[0, H - 0.05, 0]} />

      {/* Mounted fluorescent bars on walls */}
      <MountedLights position={[-W / 2 + 0.1, H - 0.5, -2]} rotation={[0, Math.PI / 2, 0]} />
      <MountedLights position={[W / 2 - 0.1, H - 0.5, 2]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Colored LED strips at floor level — studio accent */}
      <LEDStrip start={[-W/2, 0.05, -D/2]} end={[W/2, 0.05, -D/2]} color={0x0088ff} />
      <LEDStrip start={[-W/2, 0.05, D/2]} end={[W/2, 0.05, D/2]} color={0x0088ff} />
      <LEDStrip start={[-W/2, 0.05, -D/2]} end={[-W/2, 0.05, D/2]} color={0x00ffaa} />
      <LEDStrip start={[W/2, 0.05, -D/2]} end={[W/2, 0.05, D/2]} color={0x00ffaa} />

      {/* ── Surfaces ── */}
      <MetalFloor width={W} depth={D} position={[0, 0, 0]} repeat={4} />

      {/* Ceiling */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={0x1a1a1a} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* ── Walls — dark acoustic treatment ── */}
      <ConcreteWall width={W} height={H} position={[0, H/2, -D/2]} rotation={[0, 0, 0]} />
      <ConcreteWall width={W} height={H} position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]} />
      <ConcreteWall width={D} height={H} position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} />
      <ConcreteWall width={D} height={H} position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]} />

      {/* Acoustic foam grid on back wall */}
      {[-2, -1, 0, 1, 2].map(x =>
        [1, 2].map(y => (
          <AcousticPanel
            key={`af-${x}-${y}`}
            position={[x * 0.7, y * 0.75, -D/2 + 0.05]}
            rotation={[0, 0, 0]}
          />
        ))
      )}

      {/* ── Studio Workstation Corner ── */}
      <StudioDesk position={[-W/2 + 1, 0, -D/2 + 1.2]} rotation={[0, Math.PI/4, 0]} />
      <Monitor position={[-W/2 + 1.2, 0.85, -D/2 + 1.0]} rotation={[0, Math.PI/4, 0]} />
      <Monitor position={[-W/2 + 0.6, 0.85, -D/2 + 1.6]} rotation={[0, Math.PI/3, 0]} />

      {/* Second desk along right wall */}
      <StudioDesk position={[W/2 - 1, 0, -D/2 + 1.2]} rotation={[0, -Math.PI/4, 0]} />
      <Monitor position={[W/2 - 1.2, 0.85, -D/2 + 1.0]} rotation={[0, -Math.PI/4, 0]} />

      {/* ── Film Cameras ── */}
      <FilmCamera position={[0, 0.8, D/2 - 1.5]} rotation={[0, Math.PI, 0]} />
      <FilmCamera position={[-2, 0.8, D/2 - 2]} rotation={[0, -Math.PI * 0.75, 0]} />
      <VideoCamera position={[2.5, 0.8, 1]} rotation={[0, -Math.PI * 0.6, 0]} />

      {/* ── Metal shelving for gear ── */}
      <MetalShelves position={[W/2 - 0.3, 0, 1]} rotation={[0, -Math.PI/2, 0]} />
      <MetalShelves position={[W/2 - 0.3, 0, -1.5]} rotation={[0, -Math.PI/2, 0]} />

      {/* ── Plants (studio life) ── */}
      <Plant position={[-W/2 + 0.4, 0, D/2 - 0.4]} scale={1.2} />
      <Plant position={[W/2 - 0.4, 0, D/2 - 0.4]} scale={0.9} />

      {/* ── Studio bar lights overhead (key + fill) ── */}
      <StudioBar position={[-1.5, H - 0.1, 0]} />
      <StudioBar position={[1.5, H - 0.1, 0]} />
      <StudioBar position={[0, H - 0.1, -2]} />

      {/* ── Portal back to hub ── */}
      <RoomPortal position={[0, 0, D/2 - 0.2]} targetRoom="hub" color={0x00ccff} />
    </>
  )
}

useGLTF.preload('/models/Camera_01/Camera_01_1k.gltf')
useGLTF.preload('/models/vintage_video_camera/vintage_video_camera_1k.gltf')
useGLTF.preload('/models/metal_office_desk/metal_office_desk_1k.gltf')
useGLTF.preload('/models/mounted_fluorescent_lights/mounted_fluorescent_lights_1k.gltf')
useGLTF.preload('/models/steel_frame_shelves_01/steel_frame_shelves_01_1k.gltf')
useGLTF.preload('/models/potted_plant_01/potted_plant_01_1k.gltf')
