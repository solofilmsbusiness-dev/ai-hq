import * as THREE from 'three'

const ROOM_WIDTH = 40
const ROOM_DEPTH = 40
const ROOM_HEIGHT = 10

export const Room = () => {
  return (
    <>
      {/* Ambient light - soft overall illumination */}
      <ambientLight intensity={0.15} color={0xffffff} />

      {/* Main directional light - gold */}
      <directionalLight
        position={[15, 8, 15]}
        intensity={0.8}
        color={0xffd700}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Secondary point lights for accent */}
      <pointLight
        position={[-15, 6, -15]}
        intensity={0.4}
        color={0xffd700}
      />
      <pointLight
        position={[15, 6, -15]}
        intensity={0.3}
        color={0x4488ff}
      />

      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x0a0e27}
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_HEIGHT, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Front */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.8}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Back */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.8}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Left */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.8}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Right */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.8}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Accent pillar - left */}
      <mesh position={[-15, ROOM_HEIGHT / 2, -15]} castShadow receiveShadow>
        <boxGeometry args={[2, ROOM_HEIGHT, 2]} />
        <meshStandardMaterial
          color={0xffd700}
          roughness={0.3}
          metalness={0.7}
          emissive={0xffd700}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Accent pillar - right */}
      <mesh position={[15, ROOM_HEIGHT / 2, 15]} castShadow receiveShadow>
        <boxGeometry args={[2, ROOM_HEIGHT, 2]} />
        <meshStandardMaterial
          color={0xffd700}
          roughness={0.3}
          metalness={0.7}
          emissive={0xffd700}
          emissiveIntensity={0.1}
        />
      </mesh>
    </>
  )
}
