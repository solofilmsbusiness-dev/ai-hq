import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ConcreteWall } from '../RealMaterials'

const W = 12, D = 10, H = 3.5

// Single monitor
const Screen = ({
  position, rotation, w = 0.7, h = 0.44, color = '#001a33', emissive = '#001a33'
}: {
  position: [number,number,number]
  rotation?: [number,number,number]
  w?: number, h?: number, color?: string, emissive?: string
}) => (
  <group position={position} rotation={rotation ?? [0,0,0]}>
    <mesh>
      <boxGeometry args={[w+0.04, h+0.04, 0.04]} />
      <meshStandardMaterial color=#0a0a0a metalness={0.5} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0, 0.025]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.75} />
    </mesh>
  </group>
)

// Animated scrolling data on screens
const DataMonitor = ({ position, rotation, color }: { position: [number,number,number], rotation?: [number,number,number], color: string }) => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.6 + Math.sin(clock.getElapsedTime() * 1.5 + position[0] * 2) * 0.15
    }
  })
  return (
    <group position={position} rotation={rotation ?? [0,0,0]}>
      <mesh>
        <boxGeometry args={[0.76, 0.48, 0.04]} />
        <meshStandardMaterial color=#080808 metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh ref={ref} position={[0, 0, 0.025]}>
        <planeGeometry args={[0.68, 0.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

// Monitor wall - large array behind main desk
const MonitorWall = () => (
  <group position={[0, 1.6, -D/2+0.1]}>
    {/* 3x2 grid main array */}
    {[-0.85, 0, 0.85].map((x, col) =>
      [0.28, -0.28].map((y, row) => (
        <DataMonitor
          key={col*2+row}
          position={[x, y, 0]}
          color={[['#001a44','#002233'],['#001a00','#002200'],['#1a0033','#110022']][col][row]}
        />
      ))
    )}
    {/* Wide bottom bar screen */}
    <Screen position={[0, -0.72, 0]} w={2.7} h={0.32} color=#000d1a emissive=#002244 />
    {/* glow from monitors */}
    <pointLight position={[0, 0, 0.5]} intensity={1.5} color=#0055aa distance={8} decay={2} />
  </group>
)

// Ops desk - curved command station
const CommandDesk = ({ position, rotY = 0 }: { position: [number,number,number], rotY?: number }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    {/* main surface */}
    <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.4, 0.05, 0.85]} />
      <meshStandardMaterial color=#0d1520 roughness={0.5} metalness={0.4} />
    </mesh>
    {/* raised back section */}
    <mesh position={[0, 1.0, -0.3]} castShadow>
      <boxGeometry args={[2.4, 0.4, 0.04]} />
      <meshStandardMaterial color=#0a1018 roughness={0.5} metalness={0.5} />
    </mesh>
    {/* legs */}
    {[[-1.1, 0.39, -0.35],[1.1, 0.39, -0.35],[-1.1, 0.39, 0.35],[1.1, 0.39, 0.35]].map(([x,y,z],i) => (
      <mesh key={i} position={[x as number, y as number, z as number]}>
        <cylinderGeometry args={[0.025, 0.025, 0.78, 6]} />
        <meshStandardMaterial color=#1a2233 metalness={0.85} roughness={0.2} />
      </mesh>
    ))}
    {/* desk monitors */}
    <DataMonitor position={[-0.65, 0.88, -0.25]} color=#001a33 />
    <DataMonitor position={[0.65, 0.88, -0.25]}  color=#001a00 />
    {/* keyboard */}
    <mesh position={[0, 0.8, 0.1]}>
      <boxGeometry args={[0.42, 0.02, 0.15]} />
      <meshStandardMaterial color=#0a0e18 metalness={0.4} roughness={0.7} />
    </mesh>
  </group>
)

// Server rack silhouette
const ServerRack = ({ position }: { position: [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[0.55, 2.0, 0.65]} />
      <meshStandardMaterial color=#0a0f18 metalness={0.7} roughness={0.4} />
    </mesh>
    {/* rack units with LEDs */}
    {[1.6, 1.35, 1.1, 0.85, 0.6, 0.35, 0.1].map((y, i) => (
      <group key={i}>
        <mesh position={[0, y, 0.33]}>
          <boxGeometry args={[0.5, 0.04, 0.02]} />
          <meshStandardMaterial color=#111827 metalness={0.5} roughness={0.6} />
        </mesh>
        {/* status LEDs */}
        <mesh position={[-0.18, y, 0.34]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color=#00ff44 emissive=#00ff44 emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[-0.14, y, 0.34]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#ff4400' : '#00aaff'} emissive={i % 3 === 0 ? '#ff4400' : '#00aaff'} emissiveIntensity={0.7} />
        </mesh>
      </group>
    ))}
  </group>
)

// Teal LED ceiling strip
const CeilingStrip = ({ axis, pos, length }: { axis: 'x'|'z', pos: [number,number,number], length: number }) => (
  <mesh position={pos}>
    <boxGeometry args={axis === 'x' ? [length, 0.025, 0.04] : [0.04, 0.025, length]} />
    <meshStandardMaterial color=#00ffcc emissive=#00ffcc emissiveIntensity={0.85} />
  </mesh>
)

export const CommandRoom = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color=#0a1520 />

      {/* Dark tech floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#090d14 roughness={0.8} metalness={0.2} />
      </mesh>
      {/* floor grid lines */}
      {[-4,-2,0,2,4].map((x,i) => (
        <mesh key={'fx'+i} position={[x, 0.005, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[0.02, D-0.5]} />
          <meshStandardMaterial color=#001830 transparent opacity={0.8} />
        </mesh>
      ))}
      {[-3,-1,1,3].map((z,i) => (
        <mesh key={'fz'+i} position={[0, 0.005, z]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W-0.5, 0.02]} />
          <meshStandardMaterial color=#001830 transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh position={[0, H, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#080c12 roughness={0.95} />
      </mesh>

      {/* Walls */}
      <ConcreteWall width={W} height={H} position={[0, H/2, -D/2]} rotation={[0, 0, 0]} />
      <ConcreteWall width={W} height={H} position={[0, H/2, D/2]}  rotation={[0, Math.PI, 0]} />
      <ConcreteWall width={D} height={H} position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} />
      <ConcreteWall width={D} height={H} position={[W/2, H/2, 0]}  rotation={[0, -Math.PI/2, 0]} />

      {/* Monitor wall at back */}
      <MonitorWall />

      {/* Command desk in front of monitors */}
      <CommandDesk position={[0, 0, -D/2+2.5]} />

      {/* Server racks on sides */}
      <ServerRack position={[-W/2+0.45, 0, -D/2+1.2]} />
      <ServerRack position={[-W/2+0.45, 0, -D/2+2.5]} />
      <ServerRack position={[W/2-0.45, 0, -D/2+1.2]} />
      <ServerRack position={[W/2-0.45, 0, -D/2+2.5]} />

      {/* Secondary desk at right side */}
      <CommandDesk position={[3.5, 0, 1.5]} rotY={-Math.PI/4} />

      {/* Ceiling teal LED strips */}
      <CeilingStrip axis=x pos={[0, H-0.02, -D/2+0.06]} length={W-0.4} />
      <CeilingStrip axis=x pos={[0, H-0.02, D/2-0.06]}  length={W-0.4} />
      <CeilingStrip axis=z pos={[-W/2+0.06, H-0.02, 0]} length={D-0.4} />
      <CeilingStrip axis=z pos={[W/2-0.06, H-0.02, 0]}  length={D-0.4} />
      {/* floor teal strips */}
      <CeilingStrip axis=x pos={[0, 0.015, -D/2+0.06]} length={W-0.4} />
      <CeilingStrip axis=x pos={[0, 0.015, D/2-0.06]}  length={W-0.4} />
      <CeilingStrip axis=z pos={[-W/2+0.06, 0.015, 0]} length={D-0.4} />
      <CeilingStrip axis=z pos={[W/2-0.06, 0.015, 0]}  length={D-0.4} />

      {/* Overhead ops lighting */}
      <pointLight position={[-2, H-0.5, 0]}  intensity={1.8} color=#00ddcc distance={9} decay={2} castShadow />
      <pointLight position={[2,  H-0.5, 0]}  intensity={1.8} color=#00ddcc distance={9} decay={2} castShadow />
      <pointLight position={[0,  H-0.5, -3]} intensity={1.2} color=#0077ff distance={7} decay={2} />
    </>
  )
}
