import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MetalFloor, ConcreteWall } from '../RealMaterials'

const W = 14, D = 14, H = 4

// Animated energy orb at the center of the hub
const EnergyOrb = () => {
  const orbRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.5
      orbRef.current.rotation.x = t * 0.2
      const s = 1 + Math.sin(t * 2) * 0.05
      orbRef.current.scale.setScalar(s)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.7
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.4) * 0.15
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.5
      ring2Ref.current.rotation.y = t * 0.3
    }
  })
  return (
    <group position={[0, 1.6, 0]}>
      <mesh ref={orbRef} castShadow>
        <icosahedronGeometry args={[0.38, 3]} />
        <meshStandardMaterial color=#0088ff emissive=#0044cc emissiveIntensity={0.7} metalness={0.2} roughness={0.1} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.65, 0.025, 8, 64]} />
        <meshStandardMaterial color=#00eeff emissive=#00ccff emissiveIntensity={0.9} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.85, 0.015, 8, 64]} />
        <meshStandardMaterial color=#0066ff emissive=#0055ff emissiveIntensity={0.8} />
      </mesh>
      <pointLight intensity={2.5} color=#0099ff distance={9} decay={2} />
      <pointLight intensity={1.0} color=#00eeff distance={14} decay={2} />
    </group>
  )
}

// Simple sofa shape from boxes
const Sofa = ({ position, rotY = 0 }: { position: [number,number,number], rotY?: number }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    {/* seat */}
    <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.3, 0.8]} />
      <meshStandardMaterial color=#1a1a2e roughness={0.9} metalness={0.0} />
    </mesh>
    {/* back */}
    <mesh position={[0, 0.55, -0.35]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.55, 0.15]} />
      <meshStandardMaterial color=#1a1a2e roughness={0.9} metalness={0.0} />
    </mesh>
    {/* left arm */}
    <mesh position={[-0.85, 0.38, -0.1]} castShadow>
      <boxGeometry args={[0.1, 0.35, 0.6]} />
      <meshStandardMaterial color=#111120 roughness={0.9} />
    </mesh>
    {/* right arm */}
    <mesh position={[0.85, 0.38, -0.1]} castShadow>
      <boxGeometry args={[0.1, 0.35, 0.6]} />
      <meshStandardMaterial color=#111120 roughness={0.9} />
    </mesh>
  </group>
)

// Coffee table
const Table = ({ position }: { position: [number,number,number] }) => (
  <group position={position}>
    <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.05, 0.5]} />
      <meshStandardMaterial color=#333355 metalness={0.6} roughness={0.3} />
    </mesh>
    {[[-0.38, 0.16, -0.2],[0.38, 0.16, -0.2],[-0.38, 0.16, 0.2],[0.38, 0.16, 0.2]].map(([x,y,z], i) => (
      <mesh key={i} position={[x as number, y as number, z as number]}>
        <cylinderGeometry args={[0.02, 0.02, 0.32, 6]} />
        <meshStandardMaterial color=#444466 metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
  </group>
)

// Wall sconce light fixture
const WallSconce = ({ position, rotY = 0 }: { position: [number,number,number], rotY?: number }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    {/* bracket */}
    <mesh position={[0, 0, 0.05]}>
      <boxGeometry args={[0.08, 0.4, 0.12]} />
      <meshStandardMaterial color=#333333 metalness={0.8} roughness={0.3} />
    </mesh>
    {/* bulb housing */}
    <mesh position={[0, -0.1, 0.18]}>
      <cylinderGeometry args={[0.1, 0.12, 0.2, 8]} />
      <meshStandardMaterial color=#222222 metalness={0.7} roughness={0.3} />
    </mesh>
    {/* emissive bulb */}
    <mesh position={[0, -0.1, 0.18]}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshStandardMaterial color=#ffcc88 emissive=#ffaa44 emissiveIntensity={0.9} />
    </mesh>
    <pointLight position={[0, -0.15, 0.25]} intensity={1.8} color=#ffaa44 distance={6} decay={2} castShadow />
  </group>
)

// Overhead industrial pendant
const Pendant = ({ position }: { position: [number,number,number] }) => (
  <group position={position}>
    {/* cord */}
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.6, 4]} />
      <meshStandardMaterial color=#222222 />
    </mesh>
    {/* shade */}
    <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.2, 0.25, 8, 1, true]} />
      <meshStandardMaterial color=#1a1a1a metalness={0.7} roughness={0.3} side={THREE.BackSide} />
    </mesh>
    <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.2, 0.25, 8, 1, true]} />
      <meshStandardMaterial color=#111111 metalness={0.7} roughness={0.4} />
    </mesh>
    {/* bulb */}
    <mesh position={[0, -0.05, 0]}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial color=#fff5dd emissive=#ffdd88 emissiveIntensity={0.9} />
    </mesh>
    <pointLight position={[0, -0.1, 0]} intensity={2.2} color=#fff0cc distance={8} decay={2} castShadow />
  </group>
)

// Exposed pipe accent
const Pipe = ({ start, end, r = 0.035 }: { start: [number,number,number], end: [number,number,number], r?: number }) => {
  const s = new THREE.Vector3(...start)
  const e = new THREE.Vector3(...end)
  const mid = s.clone().add(e).multiplyScalar(0.5)
  const len = s.distanceTo(e)
  const dir = e.clone().sub(s).normalize()
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir)
  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={q} castShadow>
      <cylinderGeometry args={[r, r, len, 8]} />
      <meshStandardMaterial color=#2a2a3a metalness={0.85} roughness={0.25} />
    </mesh>
  )
}

export const HubRoom = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color=#1a2a3a />
      <directionalLight position={[2, H - 0.5, 2]} intensity={0.4} color=#ffffff castShadow
        shadow-mapSize={[1024,1024]} shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />

      {/* Floor */}
      <MetalFloor width={W} depth={D} position={[0, 0, 0]} repeat={5} />

      {/* Ceiling - dark concrete */}
      <mesh position={[0, H, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#1c1c22 roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Walls */}
      <ConcreteWall width={W} height={H} position={[0, H/2, -D/2]} rotation={[0, 0, 0]} />
      <ConcreteWall width={W} height={H} position={[0, H/2, D/2]}  rotation={[0, Math.PI, 0]} />
      <ConcreteWall width={D} height={H} position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} />
      <ConcreteWall width={D} height={H} position={[W/2, H/2, 0]}  rotation={[0, -Math.PI/2, 0]} />

      {/* Exposed ceiling pipes */}
      <Pipe start={[-W/2+0.5, H-0.15, -D/2+1]} end={[W/2-0.5, H-0.15, -D/2+1]} />
      <Pipe start={[-W/2+1, H-0.15, -D/2+1]} end={[-W/2+1, H-0.15, D/2-1]} />
      <Pipe start={[W/2-1, H-0.15, -D/2+1]} end={[W/2-1, H-0.15, D/2-1]} />

      {/* Wall sconces */}
      <WallSconce position={[-W/2+0.05, H-0.9, -3]} rotY={Math.PI/2} />
      <WallSconce position={[-W/2+0.05, H-0.9,  3]} rotY={Math.PI/2} />
      <WallSconce position={[W/2-0.05, H-0.9, -3]}  rotY={-Math.PI/2} />
      <WallSconce position={[W/2-0.05, H-0.9,  3]}  rotY={-Math.PI/2} />
      <WallSconce position={[-3, H-0.9, -D/2+0.05]} rotY={0} />
      <WallSconce position={[ 3, H-0.9, -D/2+0.05]} rotY={0} />

      {/* Pendant lights */}
      <Pendant position={[-3.5, H-0.05, -3.5]} />
      <Pendant position={[ 3.5, H-0.05, -3.5]} />
      <Pendant position={[-3.5, H-0.05,  3.5]} />
      <Pendant position={[ 3.5, H-0.05,  3.5]} />

      {/* Energy Orb - hub centerpiece */}
      <EnergyOrb />

      {/* Lounge seating */}
      <Sofa position={[-3.2, 0, 2.2]}  rotY={Math.PI/6} />
      <Sofa position={[ 3.2, 0, 2.2]}  rotY={-Math.PI/6} />
      <Sofa position={[ 0,   0, 3.5]}  rotY={Math.PI} />
      <Table position={[ 0,   0, 2.2]} />

      {/* Blue LED floor strips */}
      <mesh position={[0, 0.015, -D/2+0.06]} receiveShadow>
        <boxGeometry args={[W-0.5, 0.02, 0.04]} />
        <meshStandardMaterial color=#0055ff emissive=#0055ff emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.015, D/2-0.06]} receiveShadow>
        <boxGeometry args={[W-0.5, 0.02, 0.04]} />
        <meshStandardMaterial color=#0055ff emissive=#0055ff emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-W/2+0.06, 0.015, 0]} receiveShadow>
        <boxGeometry args={[0.04, 0.02, D-0.5]} />
        <meshStandardMaterial color=#0055ff emissive=#0055ff emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[W/2-0.06, 0.015, 0]} receiveShadow>
        <boxGeometry args={[0.04, 0.02, D-0.5]} />
        <meshStandardMaterial color=#0055ff emissive=#0055ff emissiveIntensity={0.8} />
      </mesh>

      {/* Portal marker - south hallway to Studio */}
      <mesh position={[0, H/2, -D/2+0.05]} rotation={[0, 0, 0]}>
        <planeGeometry args={[3.5, H]} />
        <meshStandardMaterial color=#001133 emissive=#001133 emissiveIntensity={0.3} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Portal marker - east hallway to Arcade */}
      <mesh position={[W/2-0.05, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[3.5, H]} />
        <meshStandardMaterial color=#001133 emissive=#002244 emissiveIntensity={0.3} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Portal marker - north hallway to Command */}
      <mesh position={[0, H/2, D/2-0.05]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.5, H]} />
        <meshStandardMaterial color=#001133 emissive=#001133 emissiveIntensity={0.3} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}
