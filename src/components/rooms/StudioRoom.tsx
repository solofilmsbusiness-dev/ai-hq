import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ConcreteWall } from '../RealMaterials'

const W = 12, D = 10, H = 3.5

// Ring light (studio key light) - animated slow rotation
const RingLight = ({ position }: { position: [number,number,number] }) => {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.15) * 0.05
  })
  return (
    <group ref={ref} position={position}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a)*0.7, Math.sin(a)*0.7, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color=#ffffff emissive=#ffffee emissiveIntensity={0.95} />
          </mesh>
        )
      })}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.7, 0.03, 8, 48]} />
        <meshStandardMaterial color=#cccccc metalness={0.7} roughness={0.3} />
      </mesh>
      {/* inner ring - smaller */}
      {[0,1,2,3,4,5].map(i => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={'i'+i} position={[Math.cos(a)*0.35, Math.sin(a)*0.35, 0]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color=#ffffff emissive=#ffffee emissiveIntensity={0.9} />
          </mesh>
        )
      })}
      <pointLight intensity={4} color=#fff5ee distance={10} decay={2} castShadow />
    </group>
  )
}

// Camera on tripod shape
const CameraRig = ({ position, rotY = 0 }: { position: [number,number,number], rotY?: number }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    {/* camera body */}
    <mesh position={[0, 1.35, 0]} castShadow>
      <boxGeometry args={[0.22, 0.16, 0.32]} />
      <meshStandardMaterial color=#111111 metalness={0.6} roughness={0.4} />
    </mesh>
    {/* lens */}
    <mesh position={[0, 1.35, 0.22]} rotation={[Math.PI/2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.075, 0.065, 0.18, 12]} />
      <meshStandardMaterial color=#0a0a0a metalness={0.7} roughness={0.3} />
    </mesh>
    {/* lens glass */}
    <mesh position={[0, 1.35, 0.32]}>
      <circleGeometry args={[0.065, 12]} />
      <meshStandardMaterial color=#001133 metalness={0.1} roughness={0.0} transparent opacity={0.8} />
    </mesh>
    {/* tripod legs */}
    {[[-0.18, 0, 0.12],[0.18, 0, 0.12],[0, 0, -0.18]].map(([x,y,z], i) => {
      const legEnd = new THREE.Vector3(x as number*2.5, -1.35, z as number*2.5)
      const legStart = new THREE.Vector3(0, 0, 0)
      const dir = legEnd.clone().sub(legStart).normalize()
      const len = legEnd.length()
      const mid = legEnd.clone().multiplyScalar(0.5)
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir)
      return (
        <mesh key={i} position={[mid.x, mid.y+1.35, mid.z]} quaternion={q}>
          <cylinderGeometry args={[0.012, 0.012, len, 6]} />
          <meshStandardMaterial color=#222222 metalness={0.8} roughness={0.2} />
        </mesh>
      )
    })}
    {/* tripod center mount */}
    <mesh position={[0, 1.25, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
      <meshStandardMaterial color=#333333 metalness={0.7} roughness={0.3} />
    </mesh>
  </group>
)

// Monitor / screen
const Monitor = ({ position, rotY = 0, color = '#001a44' }: { position: [number,number,number], rotY?: number, color?: string }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    {/* screen bezel */}
    <mesh position={[0, 0.32, 0]} castShadow>
      <boxGeometry args={[0.72, 0.46, 0.04]} />
      <meshStandardMaterial color=#0a0a0a metalness={0.5} roughness={0.4} />
    </mesh>
    {/* screen */}
    <mesh position={[0, 0.32, 0.025]}>
      <planeGeometry args={[0.64, 0.38]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
    </mesh>
    {/* stand */}
    <mesh position={[0, 0.06, 0]}>
      <boxGeometry args={[0.22, 0.12, 0.18]} />
      <meshStandardMaterial color=#111111 metalness={0.6} roughness={0.4} />
    </mesh>
  </group>
)

// Editing desk
const Desk = ({ position, rotY = 0 }: { position: [number,number,number], rotY?: number }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    {/* surface */}
    <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.04, 0.75]} />
      <meshStandardMaterial color=#1a1a2a roughness={0.6} metalness={0.3} />
    </mesh>
    {/* legs */}
    {[[-0.82, 0.375, -0.3],[0.82, 0.375, -0.3],[-0.82, 0.375, 0.3],[0.82, 0.375, 0.3]].map(([x,y,z],i) => (
      <mesh key={i} position={[x as number, y as number, z as number]}>
        <cylinderGeometry args={[0.025, 0.025, 0.75, 6]} />
        <meshStandardMaterial color=#333344 metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
    {/* monitors on desk */}
    <Monitor position={[-0.35, 0.77, -0.22]} rotY={0.1} />
    <Monitor position={[ 0.35, 0.77, -0.22]} rotY={-0.1} color=#001a00 />
    {/* keyboard */}
    <mesh position={[0, 0.77, 0.05]}>
      <boxGeometry args={[0.38, 0.02, 0.14]} />
      <meshStandardMaterial color=#111122 metalness={0.4} roughness={0.7} />
    </mesh>
  </group>
)

// Acoustic foam panel on wall
const AcousticPanel = ({ position, rotation, w = 0.6, h = 1.2 }: { position: [number,number,number], rotation: [number,number,number], w?: number, h?: number }) => (
  <mesh position={position} rotation={rotation} receiveShadow>
    <boxGeometry args={[w, h, 0.06]} />
    <meshStandardMaterial color=#1a1a28 roughness={0.95} metalness={0.0} />
  </mesh>
)

// Overhead LED bar light
const LEDBar = ({ position, length = 1.2 }: { position: [number,number,number], length?: number }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={[length, 0.06, 0.12]} />
      <meshStandardMaterial color=#111111 metalness={0.6} roughness={0.4} />
    </mesh>
    <mesh position={[0, -0.04, 0]}>
      <boxGeometry args={[length-0.05, 0.02, 0.09]} />
      <meshStandardMaterial color=#eeffff emissive=#ccffff emissiveIntensity={0.9} />
    </mesh>
    <pointLight position={[0, -0.1, 0]} intensity={1.8} color=#ddfff8 distance={6} decay={2} />
  </group>
)

export const StudioRoom = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color=#1a1525 />

      {/* Dark wood-tone floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#0f0c0a roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Ceiling with track rail look */}
      <mesh position={[0, H, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#141414 roughness={0.9} />
      </mesh>
      {/* track rails */}
      {[-2.5, 0, 2.5].map((z, i) => (
        <mesh key={i} position={[0, H-0.05, z]}>
          <boxGeometry args={[W-0.5, 0.06, 0.08]} />
          <meshStandardMaterial color=#1a1a1a metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Walls - dark studio treatment */}
      <ConcreteWall width={W} height={H} position={[0, H/2, -D/2]} rotation={[0, 0, 0]} />
      <ConcreteWall width={W} height={H} position={[0, H/2, D/2]}  rotation={[0, Math.PI, 0]} />
      <ConcreteWall width={D} height={H} position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} />
      <ConcreteWall width={D} height={H} position={[W/2, H/2, 0]}  rotation={[0, -Math.PI/2, 0]} />

      {/* Acoustic panels - back wall */}
      {[-4, -2.4, -0.8, 0.8, 2.4, 4].map((x, i) => (
        <AcousticPanel key={i} position={[x, 1.4, -D/2+0.05]} rotation={[0, 0, 0]} />
      ))}
      {/* side wall panels */}
      {[-3, 0, 3].map((z, i) => (
        <AcousticPanel key={i} position={[-W/2+0.05, 1.4, z]} rotation={[0, Math.PI/2, 0]} w={0.9} />
      ))}

      {/* Overhead LED bars on tracks */}
      {[-2.5, 0, 2.5].map((z, i) => (
        <LEDBar key={i} position={[-1.5, H-0.12, z]} length={1.4} />
      ))}
      {[-2.5, 0, 2.5].map((z, i) => (
        <LEDBar key={'r'+i} position={[1.5, H-0.12, z]} length={1.4} />
      ))}

      {/* Key ring light facing shoot area */}
      <RingLight position={[-1.5, H-0.5, 1]} />
      <RingLight position={[ 1.5, H-0.5, 1]} />

      {/* Shoot area: cameras + backdrop */}
      <CameraRig position={[-3.5, 0, 3]} rotY={Math.PI*0.85} />
      <CameraRig position={[ 3.5, 0, 2.5]} rotY={-Math.PI*0.85} />

      {/* Backdrop - curved white/grey */}
      <mesh position={[0, H/2, -D/2+0.3]} receiveShadow>
        <planeGeometry args={[7, H]} />
        <meshStandardMaterial color=#cccccc roughness={0.95} />
      </mesh>
      {/* Backdrop floor curve */}
      <mesh position={[0, 0.02, -D/2+0.8]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[7, 1.2]} />
        <meshStandardMaterial color=#bbbbbb roughness={0.95} />
      </mesh>

      {/* Edit bay */}
      <Desk position={[3.5, 0, -2.5]} rotY={Math.PI*0.9} />

      {/* Orange accent strip - ceiling edge */}
      <mesh position={[0, H-0.02, -D/2+0.05]}>
        <boxGeometry args={[W-0.4, 0.02, 0.04]} />
        <meshStandardMaterial color=#ff6600 emissive=#ff4400 emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[-W/2+0.05, H-0.02, 0]}>
        <boxGeometry args={[0.04, 0.02, D-0.4]} />
        <meshStandardMaterial color=#ff6600 emissive=#ff4400 emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[W/2-0.05, H-0.02, 0]}>
        <boxGeometry args={[0.04, 0.02, D-0.4]} />
        <meshStandardMaterial color=#ff6600 emissive=#ff4400 emissiveIntensity={0.7} />
      </mesh>

      {/* warm fill */}
      <pointLight position={[0, 2.5, 0]} intensity={0.5} color=#ffcc88 distance={12} decay={2} />
    </>
  )
}
