import { create } from 'zustand'
import * as THREE from 'three'

interface CameraStore {
  position: [number, number, number]
  setPosition: (pos: [number, number, number]) => void
  velocity: THREE.Vector3
  setVelocity: (vel: THREE.Vector3) => void
}

export const useCameraStore = create<CameraStore>((set) => ({
  position: [0, 1.6, 5],
  setPosition: (pos) => set({ position: pos }),
  velocity: new THREE.Vector3(0, 0, 0),
  setVelocity: (vel) => set({ velocity: vel }),
}))
