import * as THREE from 'three'
import { Environment, Sparkles } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const ROOM_WIDTH = 40
const ROOM_DEPTH = 40
const ROOM_HEIGHT = 10

// Agent Station Component
const AgentStation = ({ position, color }: { position: [number, number, number], color: string }) => {
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.005
    }
  })

  const colorMap = {
    blue: 0x4488ff,
    purple: 0x8844ff,
    cyan: 0x00ffff,
  }

  const hexColor = colorMap[color as keyof typeof colorMap] || 0x4488ff

  return (
    <group position={position}>
      {/* Base glow */}
      <mesh ref={glowRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32]} />
        <meshStandardMaterial
          color={hexColor}
          emissive={hexColor}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing pillar */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 4, 32]} />
        <meshStandardMaterial
          color={hexColor}
          emissive={hexColor}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Top accent ring */}
      <mesh position={[0, 4.2, 0]}>
        <torusGeometry args={[2.8, 0.15, 32, 100]} />
        <meshStandardMaterial
          color={hexColor}
          emissive={hexColor}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Light source inside */}
      <pointLight
        position={[0, 3, 0]}
        intensity={0.6}
        color={hexColor}
        distance={20}
      />
    </group>
  )
}

// Dust Particle System
const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 500

  useEffect(() => {
    if (!particlesRef.current) return

    const positionAttribute = particlesRef.current.geometry.getAttribute('position')
    const positions = positionAttribute.array as Float32Array

    // Animate particles slowly
    let animationId: number
    const startTime = Date.now()
    const originalPositions = new Float32Array(positions)

    const animate = () => {
      const elapsedTime = (Date.now() - startTime) * 0.0001
      
      for (let i = 0; i < positions.length; i += 3) {
        const originalY = originalPositions[i + 1]
        const waveHeight = Math.sin(elapsedTime + i * 0.01) * 0.3
        positions[i + 1] = originalY + waveHeight
      }

      positionAttribute.needsUpdate = true
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  // Create particle positions
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * ROOM_WIDTH
    positions[i + 1] = Math.random() * ROOM_HEIGHT
    positions[i + 2] = (Math.random() - 0.5) * ROOM_DEPTH
  }

  const positionAttribute = new THREE.BufferAttribute(positions, 3)

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttribute} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={0xffd700}
        transparent
        opacity={0.1}
        sizeAttenuation
      />
    </points>
  )
}

// Enhanced Room with HDRI and professional lighting
export const Room = () => {
  const floorRef = useRef<THREE.Mesh>(null)

  return (
    <>
      {/* HDRI Environment for realistic lighting */}
      <Environment preset="studio" />

      {/* Refined lighting system */}
      {/* Ambient light - soft fill */}
      <ambientLight intensity={0.2} color={0xffffff} />

      {/* Main directional light - gold with shadow mapping */}
      <directionalLight
        position={[20, 12, 20]}
        intensity={1.2}
        color={0xffd700}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      {/* Secondary directional light - cool accent */}
      <directionalLight
        position={[-20, 8, -20]}
        intensity={0.4}
        color={0x4488ff}
        castShadow={false}
      />

      {/* Key light accent - subtle gold point */}
      <pointLight
        position={[-15, 8, -15]}
        intensity={0.5}
        color={0xffd700}
        distance={30}
      />

      {/* Rim light - blue accent */}
      <pointLight
        position={[20, 6, -20]}
        intensity={0.3}
        color={0x4488ff}
        distance={25}
      />

      {/* Floor with enhanced materials */}
      <mesh
        ref={floorRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow={false}
      >
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x0a0e27}
          roughness={0.7}
          metalness={0.3}
          envMapIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ceiling with soft glow */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow={false}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Front */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow castShadow={false}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Back */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} receiveShadow castShadow={false}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Left */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow={false}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall - Right */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow={false}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={0x1a1f3a}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gold accent pillar - left */}
      <mesh position={[-15, ROOM_HEIGHT / 2, -15]} castShadow receiveShadow>
        <boxGeometry args={[2, ROOM_HEIGHT, 2]} />
        <meshStandardMaterial
          color={0xffd700}
          roughness={0.2}
          metalness={0.8}
          emissive={0xffd700}
          emissiveIntensity={0.2}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Gold accent pillar - right */}
      <mesh position={[15, ROOM_HEIGHT / 2, 15]} castShadow receiveShadow>
        <boxGeometry args={[2, ROOM_HEIGHT, 2]} />
        <meshStandardMaterial
          color={0xffd700}
          roughness={0.2}
          metalness={0.8}
          emissive={0xffd700}
          emissiveIntensity={0.2}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Agent Stations - 3 glowing bases */}
      <AgentStation position={[-12, 0, 12]} color="blue" />
      <AgentStation position={[0, 0, -18]} color="purple" />
      <AgentStation position={[12, 0, 12]} color="cyan" />

      {/* Particle system for dust effect */}
      <ParticleSystem />

      {/* Subtle sparkles for cinematic effect */}
      <Sparkles
        count={30}
        scale={[ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH]}
        size={0.8}
        speed={0.3}
        opacity={0.15}
      />
    </>
  )
}
