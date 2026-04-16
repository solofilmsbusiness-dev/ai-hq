import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const ColorGrading = () => {
  const { scene } = useThree()

  useEffect(() => {
    // Apply color grading to the scene
    const originalBackground = scene.background

    // Cool/warm balance via fog
    scene.fog = new THREE.Fog(0x0a0e27, 50, 150)

    return () => {
      scene.background = originalBackground
      scene.fog = null
    }
  }, [scene])

  return null
}
