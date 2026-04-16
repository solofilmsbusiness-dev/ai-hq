import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

interface PongGameProps {
  onClose: () => void
}

const GAME_WIDTH = 20
const GAME_HEIGHT = 12

export const PongGame = ({ onClose }: PongGameProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const ballRef = useRef<THREE.Mesh>(null)
  const playerPaddleRef = useRef<THREE.Mesh>(null)
  const aiPaddleRef = useRef<THREE.Mesh>(null)
  const scoreRef = useRef<THREE.Mesh>(null)

  const [gameState, setGameState] = useState({
    playerY: 0,
    ballX: -8,
    ballY: 0,
    ballVelX: 0.15,
    ballVelY: 0.08,
    score: 0,
    aiY: 0,
  })

  const keysPressed = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    setGameState((prev) => {
      let newState = { ...prev }

      // Player movement
      if (keysPressed.current['w'] || keysPressed.current['ArrowUp']) {
        newState.playerY = Math.min(newState.playerY + 0.4, GAME_HEIGHT / 2 - 0.5)
      }
      if (keysPressed.current['s'] || keysPressed.current['ArrowDown']) {
        newState.playerY = Math.max(newState.playerY - 0.4, -GAME_HEIGHT / 2 + 0.5)
      }

      // Ball movement
      newState.ballX += newState.ballVelX
      newState.ballY += newState.ballVelY

      // Ball bounce off top/bottom
      if (newState.ballY > GAME_HEIGHT / 2 - 0.3 || newState.ballY < -GAME_HEIGHT / 2 + 0.3) {
        newState.ballVelY *= -1
        newState.ballY = Math.max(-GAME_HEIGHT / 2 + 0.3, Math.min(newState.ballY, GAME_HEIGHT / 2 - 0.3))
      }

      // AI movement (simple tracking)
      const aiTarget = newState.ballY
      if (newState.aiY < aiTarget - 0.1) {
        newState.aiY += 0.35
      } else if (newState.aiY > aiTarget + 0.1) {
        newState.aiY -= 0.35
      }
      newState.aiY = Math.max(-GAME_HEIGHT / 2 + 0.5, Math.min(newState.aiY, GAME_HEIGHT / 2 - 0.5))

      // Ball collision with paddles
      const paddleWidth = 0.4
      const paddleHeight = 2

      // Player paddle collision
      if (
        newState.ballX < -8 + paddleWidth &&
        newState.ballX > -9 + paddleWidth &&
        newState.ballY < newState.playerY + paddleHeight / 2 &&
        newState.ballY > newState.playerY - paddleHeight / 2
      ) {
        newState.ballVelX *= -1.05 // Speed up
        newState.ballX = -8 + paddleWidth
        newState.ballVelY += (newState.ballY - newState.playerY) * 0.1
      }

      // AI paddle collision
      if (
        newState.ballX > 8 - paddleWidth &&
        newState.ballX < 9 - paddleWidth &&
        newState.ballY < newState.aiY + paddleHeight / 2 &&
        newState.ballY > newState.aiY - paddleHeight / 2
      ) {
        newState.ballVelX *= -1.05 // Speed up
        newState.ballX = 8 - paddleWidth
        newState.ballVelY += (newState.ballY - newState.aiY) * 0.1
      }

      // Ball out of bounds - reset
      if (newState.ballX > GAME_WIDTH / 2 + 5) {
        newState.score += 1
        newState.ballX = -8
        newState.ballY = 0
        newState.ballVelX = 0.15
        newState.ballVelY = Math.random() * 0.1 - 0.05
      }

      if (newState.ballX < -GAME_WIDTH / 2 - 5) {
        newState.ballX = -8
        newState.ballY = 0
        newState.ballVelX = 0.15
        newState.ballVelY = Math.random() * 0.1 - 0.05
      }

      // Cap ball velocity
      const maxVel = 0.4
      newState.ballVelX = Math.max(-maxVel, Math.min(newState.ballVelX, maxVel))
      newState.ballVelY = Math.max(-maxVel, Math.min(newState.ballVelY, maxVel))

      return newState
    })
  })

  // Update visual positions
  if (ballRef.current) {
    ballRef.current.position.x = gameState.ballX
    ballRef.current.position.y = gameState.ballY
  }

  if (playerPaddleRef.current) {
    playerPaddleRef.current.position.y = gameState.playerY
  }

  if (aiPaddleRef.current) {
    aiPaddleRef.current.position.y = gameState.aiY
  }

  return (
    <group ref={groupRef} position={[0, 5, 2]}>
      {/* Game boundary */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[GAME_WIDTH + 2, GAME_HEIGHT + 2, 0.05]} />
        <meshStandardMaterial
          color={0xffff00}
          emissive={0xffff00}
          emissiveIntensity={0.6}
          metalness={0.9}
        />
      </mesh>

      {/* Game field background */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[GAME_WIDTH, GAME_HEIGHT, 0.1]} />
        <meshStandardMaterial color={0x000011} metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Center line */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[0, -GAME_HEIGHT / 2 + i + 0.5, 0.05]}>
          <boxGeometry args={[0.1, 0.8, 0.02]} />
          <meshStandardMaterial color={0xffffff} emissive={0xffffff} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Ball */}
      <mesh ref={ballRef} position={[gameState.ballX, gameState.ballY, 0.1]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={0xffff00}
          emissive={0xffff00}
          emissiveIntensity={0.8}
          metalness={0.8}
        />
      </mesh>

      {/* Player paddle (left) */}
      <mesh ref={playerPaddleRef} position={[-9, gameState.playerY, 0.1]} castShadow>
        <boxGeometry args={[0.4, 2, 0.1]} />
        <meshStandardMaterial
          color={0x00ff00}
          emissive={0x00ff00}
          emissiveIntensity={0.6}
          metalness={0.7}
        />
      </mesh>

      {/* AI paddle (right) */}
      <mesh ref={aiPaddleRef} position={[9, gameState.aiY, 0.1]} castShadow>
        <boxGeometry args={[0.4, 2, 0.1]} />
        <meshStandardMaterial
          color={0x00ffff}
          emissive={0x00ffff}
          emissiveIntensity={0.6}
          metalness={0.7}
        />
      </mesh>

      {/* Score display mesh (simple placeholder) */}
      <mesh ref={scoreRef} position={[0, GAME_HEIGHT / 2 + 1, 0.1]} castShadow>
        <boxGeometry args={[3, 0.5, 0.05]} />
        <meshStandardMaterial
          color={0xffff00}
          emissive={0xffff00}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Close game button hint - clickable area at bottom */}
      <mesh position={[0, -GAME_HEIGHT / 2 - 1, 0.1]} onClick={onClose}>
        <boxGeometry args={[4, 0.6, 0.05]} />
        <meshStandardMaterial color={0x000000} transparent opacity={0} />
      </mesh>

      {/* Score text (we'll render this via UI overlay) */}
      <group position={[0, GAME_HEIGHT / 2 + 1.5, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.4, 0.05]} />
          <meshStandardMaterial
            color={0xffff00}
            emissive={0xffff00}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  )
}
