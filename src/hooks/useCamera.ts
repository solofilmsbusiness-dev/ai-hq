import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'


const SPEED = 0.08
const FRICTION = 0.85

export const useCamera = () => {
  const { camera } = useThree()
  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const position = useRef(new THREE.Vector3(0, 1.6, 5))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const pointerLocked = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return

      const pitchSpeed = 0.005
      const yawSpeed = 0.005

      euler.current.setFromQuaternion(camera.quaternion)
      euler.current.x -= e.movementY * pitchSpeed
      euler.current.y -= e.movementX * yawSpeed

      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x))

      camera.quaternion.setFromEuler(euler.current)
    }

    const handlePointerLock = async () => {
      try {
        await document.documentElement.requestPointerLock()
        pointerLocked.current = true
      } catch (err) {
        console.error('Pointer lock failed:', err)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handlePointerLock)
    document.addEventListener('pointerlockchange', () => {
      pointerLocked.current = !!document.pointerLockElement
    })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handlePointerLock)
    }
  }, [camera])

  useFrame(() => {
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()

    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    right.crossVectors(forward, camera.up).normalize()

    velocity.current.multiplyScalar(FRICTION)

    if (keysPressed.current['w']) velocity.current.add(forward.multiplyScalar(SPEED))
    if (keysPressed.current['s']) velocity.current.add(forward.multiplyScalar(-SPEED))
    if (keysPressed.current['a']) velocity.current.add(right.multiplyScalar(-SPEED))
    if (keysPressed.current['d']) velocity.current.add(right.multiplyScalar(SPEED))

    position.current.add(velocity.current)

    // Boundary clipping
    position.current.x = Math.max(-19, Math.min(19, position.current.x))
    position.current.y = Math.max(0.5, Math.min(9, position.current.y))
    position.current.z = Math.max(-19, Math.min(19, position.current.z))

    camera.position.lerp(position.current, 0.1)
  })
}
