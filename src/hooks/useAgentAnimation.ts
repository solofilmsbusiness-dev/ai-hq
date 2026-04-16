import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTaskStore } from '../state/taskStore'

export interface AgentAnimationState {
  glowIntensity: number
  movementSpeed: number
  isWorking: boolean
  hasCompleted: boolean
}

export const useAgentAnimation = (agentId: string, glowRef: React.RefObject<THREE.Mesh>) => {
  const agent = useTaskStore((s) => s.agents[agentId])
  const task = useTaskStore((s) => (agent?.currentTask ? s.tasks[agent.currentTask] : null))
  const celebrationRef = useRef<{ timeout: NodeJS.Timeout | null }>({ timeout: null })

  useEffect(() => {
    if (!glowRef.current) return

    const material = glowRef.current.material as THREE.MeshStandardMaterial
    if (!material) return

    // Calculate glow intensity based on agent status
    let targetIntensity = 0.3 // Idle

    if (agent?.status === 'working') {
      targetIntensity = 0.8 + Math.sin(Date.now() * 0.003) * 0.2 // Pulsing when working
    } else if (agent?.status === 'done') {
      targetIntensity = 1.0 // Bright when completed
    }

    // Smooth transition
    const current = material.emissiveIntensity || 0.3
    material.emissiveIntensity = current + (targetIntensity - current) * 0.1

    // Color shift based on progress
    if (task && agent?.status === 'working') {
      const hslValue = Math.floor(120 * (task.progress / 100)) // Green progression
      const rgb = hslToRgb(hslValue / 360, 1, 0.5)
      material.emissive.setRGB(rgb.r, rgb.g, rgb.b)
    }
  }, [agent?.status, agent?.currentTask, task?.progress, glowRef])

  useEffect(() => {
    // Trigger celebration animation when task completes
    if (agent?.status === 'done' && task?.status === 'done') {
      if (celebrationRef.current.timeout) {
        clearTimeout(celebrationRef.current.timeout)
      }

      // Brief celebration glow
      if (glowRef.current) {
        const material = glowRef.current.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = 1.2
      }

      celebrationRef.current.timeout = setTimeout(() => {
        if (glowRef.current) {
          const material = glowRef.current.material as THREE.MeshStandardMaterial
          material.emissiveIntensity = 0.3
        }
      }, 2000)
    }

    return () => {
      if (celebrationRef.current.timeout) {
        clearTimeout(celebrationRef.current.timeout)
      }
    }
  }, [agent?.status, task?.status, glowRef])

  return {
    glowIntensity: agent?.status === 'working' ? 0.8 : agent?.status === 'done' ? 1.0 : 0.3,
    movementSpeed: agent?.status === 'working' ? 1.5 : 0.5,
    isWorking: agent?.status === 'working',
    hasCompleted: agent?.status === 'done',
  }
}

// Convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number) => {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r, g, b }
}
