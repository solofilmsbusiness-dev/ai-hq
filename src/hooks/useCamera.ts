import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCameraStore } from '@/state/cameraStore'


const SPEED = 0.08
const FRICTION = 0.85

// World bounds: hub centered at origin, studio/arcade/command up to ±55 away.
const BOUND_X_MIN = -35
const BOUND_X_MAX = 55
const BOUND_Z_MIN = -55
const BOUND_Z_MAX = 55

export const useCamera = () => {
  const { camera } = useThree()
  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const position = useRef(new THREE.Vector3(0, 1.6, 5))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const pointerLocked = useRef(false)

  // Sync teleport requests from cameraStore (room portals + room switcher).
  useEffect(() => {
    const unsub = useCameraStore.subscribe((state, prev) => {
      if (state.position === prev.position) return
      const [x, y, z] = state.position
      position.current.set(x, y, z)
      camera.position.set(x, y, z)
      velocity.current.set(0, 0, 0)
    })
    return unsub
  }, [camera])

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

    // Boundary clipping (world covers all four rooms + hallways)
    position.current.x = Math.max(BOUND_X_MIN, Math.min(BOUND_X_MAX, position.current.x))
    position.current.y = Math.max(0.5, Math.min(9, position.current.y))
    position.current.z = Math.max(BOUND_Z_MIN, Math.min(BOUND_Z_MAX, position.current.z))

    camera.position.lerp(position.current, 0.1)
  })
}
