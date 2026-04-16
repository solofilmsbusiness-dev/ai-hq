import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PongGame } from './PongGame'

const W = 20, D = 16, H = 3.8

// Arcade cabinet
const Cabinet = ({
  position, rotY = 0, screenColor = '#00ff88', label = 'PLAY'
}: {
  position: [number,number,number], rotY?: number, screenColor?: string, label?: string
}) => {
  const screenRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.6 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.15
    }
  })
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* main body */}
      <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 1.75, 0.55]} />
        <meshStandardMaterial color=#111111 metalness={0.5} roughness={0.6} />
      </mesh>
      {/* screen bezel */}
      <mesh position={[0, 1.25, 0.285]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.56, 0.44, 0.04]} />
        <meshStandardMaterial color=#0a0a0a metalness={0.4} roughness={0.5} />
      </mesh>
      {/* screen */}
      <mesh ref={screenRef} position={[0, 1.25, 0.3]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[0.48, 0.36]} />
        <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.7} />
      </mesh>
      {/* marquee top */}
      <mesh position={[0, 1.78, 0.2]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[0.68, 0.25, 0.06]} />
        <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.5} />
      </mesh>
      {/* control panel */}
      <mesh position={[0, 0.96, 0.27]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.65, 0.06, 0.3]} />
        <meshStandardMaterial color=#1a1a1a metalness={0.5} roughness={0.5} />
      </mesh>
      {/* joystick */}
      <mesh position={[-0.12, 0.99, 0.26]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        <meshStandardMaterial color=#cc0000 metalness={0.6} roughness={0.3} />
      </mesh>
      {/* buttons */}
      {[0, 0.07, 0.14].map((dx, i) => (
        <mesh key={i} position={[0.05+dx, 0.99, 0.26]}>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 8]} />
          <meshStandardMaterial color={['#ff0055','#00aaff','#ffff00'][i]} emissive={['#ff0055','#00aaff','#ffff00'][i]} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* glow light */}
      <pointLight position={[0, 1.4, 0.5]} intensity={0.8} color={screenColor} distance={3} decay={2} />
    </group>
  )
}

// Neon tube wall accent
const NeonTube = ({ start, end, color }: { start: [number,number,number], end: [number,number,number], color: string }) => {
  const s = new THREE.Vector3(...start)
  const e = new THREE.Vector3(...end)
  const mid = s.clone().add(e).multiplyScalar(0.5)
  const len = s.distanceTo(e)
  const dir = e.clone().sub(s).normalize()
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir)
  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={q}>
      <cylinderGeometry args={[0.02, 0.02, len, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.95} />
    </mesh>
  )
}

// Sofa
const Sofa = ({ position, rotY = 0, color = '#1a0a2e' }: { position: [number,number,number], rotY?: number, color?: string }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.0, 0.3, 0.85]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.52, -0.38]} castShadow>
      <boxGeometry args={[2.0, 0.5, 0.14]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    <mesh position={[-0.94, 0.38, -0.1]}>
      <boxGeometry args={[0.12, 0.32, 0.62]} />
      <meshStandardMaterial color=#120820 roughness={0.85} />
    </mesh>
    <mesh position={[0.94, 0.38, -0.1]}>
      <boxGeometry args={[0.12, 0.32, 0.62]} />
      <meshStandardMaterial color=#120820 roughness={0.85} />
    </mesh>
  </group>
)

// Ceiling neon grid
const CeilingGrid = () => {
  const lines = []
  for (let x = -W/2+2; x <= W/2-2; x += 3) {
    lines.push(<mesh key={'x'+x} position={[x, H-0.05, 0]}>
      <boxGeometry args={[0.02, 0.02, D-1]} />
      <meshStandardMaterial color=#5500ff emissive=#5500ff emissiveIntensity={0.6} transparent opacity={0.8} />
    </mesh>)
  }
  for (let z = -D/2+2; z <= D/2-2; z += 3) {
    lines.push(<mesh key={'z'+z} position={[0, H-0.05, z]}>
      <boxGeometry args={[W-1, 0.02, 0.02]} />
      <meshStandardMaterial color=#5500ff emissive=#5500ff emissiveIntensity={0.6} transparent opacity={0.8} />
    </mesh>)
  }
  return <>{lines}</>
}

export const ArcadeRoom = () => {
  return (
    <>
      {/* Lighting - dark with neon pops */}
      <ambientLight intensity={0.15} color=#0a0015 />

      {/* Black floor with subtle grid */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#070007 roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Ceiling - very dark */}
      <mesh position={[0, H, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color=#050005 roughness={0.95} />
      </mesh>
      <CeilingGrid />

      {/* Walls - dark with neon border */}
      {[
        { pos: [0, H/2, -D/2] as [number,number,number], rot: [0,0,0] as [number,number,number] },
        { pos: [0, H/2, D/2]  as [number,number,number], rot: [0,Math.PI,0] as [number,number,number] },
        { pos: [-W/2, H/2, 0] as [number,number,number], rot: [0,Math.PI/2,0] as [number,number,number] },
        { pos: [W/2, H/2, 0]  as [number,number,number], rot: [0,-Math.PI/2,0] as [number,number,number] },
      ].map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot} receiveShadow>
          <planeGeometry args={[i < 2 ? W : D, H]} />
          <meshStandardMaterial color=#080008 roughness={0.9} />
        </mesh>
      ))}

      {/* Neon border strips - floor */}
      <NeonTube start={[-W/2+0.05, 0.05, -D/2+0.05]} end={[W/2-0.05, 0.05, -D/2+0.05]} color=#ff00cc />
      <NeonTube start={[-W/2+0.05, 0.05, D/2-0.05]} end={[W/2-0.05, 0.05, D/2-0.05]} color=#ff00cc />
      <NeonTube start={[-W/2+0.05, 0.05, -D/2+0.05]} end={[-W/2+0.05, 0.05, D/2-0.05]} color=#ff00cc />
      <NeonTube start={[W/2-0.05, 0.05, -D/2+0.05]} end={[W/2-0.05, 0.05, D/2-0.05]} color=#ff00cc />

      {/* Neon border strips - ceiling */}
      <NeonTube start={[-W/2+0.05, H-0.05, -D/2+0.05]} end={[W/2-0.05, H-0.05, -D/2+0.05]} color=#00ccff />
      <NeonTube start={[-W/2+0.05, H-0.05, D/2-0.05]} end={[W/2-0.05, H-0.05, D/2-0.05]} color=#00ccff />
      <NeonTube start={[-W/2+0.05, H-0.05, -D/2+0.05]} end={[-W/2+0.05, H-0.05, D/2-0.05]} color=#00ccff />
      <NeonTube start={[W/2-0.05, H-0.05, -D/2+0.05]} end={[W/2-0.05, H-0.05, D/2-0.05]} color=#00ccff />

      {/* Neon vertical corners */}
      <NeonTube start={[-W/2+0.05, 0.05, -D/2+0.05]} end={[-W/2+0.05, H-0.05, -D/2+0.05]} color=#aa00ff />
      <NeonTube start={[W/2-0.05, 0.05, -D/2+0.05]}  end={[W/2-0.05, H-0.05, -D/2+0.05]}  color=#aa00ff />
      <NeonTube start={[-W/2+0.05, 0.05, D/2-0.05]}   end={[-W/2+0.05, H-0.05, D/2-0.05]}  color=#aa00ff />
      <NeonTube start={[W/2-0.05, 0.05, D/2-0.05]}    end={[W/2-0.05, H-0.05, D/2-0.05]}   color=#aa00ff />

      {/* Wall neon accents */}
      <NeonTube start={[-W/2+0.06, 1.0, -D/2+0.06]} end={[-W/2+0.06, 2.8, -D/2+0.06]} color=#ff00cc />
      <NeonTube start={[W/2-0.06, 1.0, -D/2+0.06]}  end={[W/2-0.06, 2.8, -D/2+0.06]} color=#ff00cc />
      <NeonTube start={[-W/2+0.06, 1.0, D/2-0.06]}  end={[-W/2+0.06, 2.8, D/2-0.06]} color=#00ccff />
      <NeonTube start={[W/2-0.06, 1.0, D/2-0.06]}   end={[W/2-0.06, 2.8, D/2-0.06]}  color=#00ccff />

      {/* Arcade cabinets - two rows */}
      <Cabinet position={[-7, 0, -6.5]} rotY={0.15}  screenColor=#00ff88 />
      <Cabinet position={[-4, 0, -6.5]} rotY={0.05}  screenColor=#ff4400 />
      <Cabinet position={[-1, 0, -6.5]} rotY={-0.05} screenColor=#4488ff />
      <Cabinet position={[ 2, 0, -6.5]} rotY={-0.1}  screenColor=#ffcc00 />
      <Cabinet position={[ 5, 0, -6.5]} rotY={0.08}  screenColor=#ff00cc />
      <Cabinet position={[ 8, 0, -6.5]} rotY={-0.08} screenColor=#00ffcc />

      {/* Overhead arcade lights */}
      <pointLight position={[-5.5, H-0.5, -5.5]} intensity={1.2} color=#ff44cc distance={8} decay={2} />
      <pointLight position={[ 3.5, H-0.5, -5.5]} intensity={1.2} color=#4488ff distance={8} decay={2} />
      <pointLight position={[-2,   H-0.5,  2.5]} intensity={0.8} color=#aa00ff distance={10} decay={2} />

      {/* Pong game table area */}
      <group position={[0, 0, 2.5]} scale={[0.4, 0.4, 0.4]}>
        <PongGame onClose={() => {}} />
      </group>

      {/* Sofas in lounge area */}
      <Sofa position={[-7.5, 0, 4]} rotY={Math.PI/2} />
      <Sofa position={[7.5, 0, 4]}  rotY={-Math.PI/2} />
      <Sofa position={[0, 0, 6.5]}  rotY={Math.PI} />
    </>
  )
}
