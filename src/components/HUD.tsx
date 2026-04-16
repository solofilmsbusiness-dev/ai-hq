import { useTaskStore } from '../state/taskStore'
import { useRoomStore } from '../state/roomStore'
import { useEffect, useRef, useState } from 'react'

export const HUD = () => {
  const stats = useTaskStore((s) => s.getStats())
  const currentRoom = useRoomStore((s) => s.currentRoom)
  const [fps, setFps] = useState(60)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const delta = (now - lastTimeRef.current) / 1000
      const currentFps = Math.round(frameCountRef.current / delta)
      setFps(currentFps)
      frameCountRef.current = 0
      lastTimeRef.current = now
    }, 1000)

    const countFrame = () => {
      frameCountRef.current++
      requestAnimationFrame(countFrame)
    }
    countFrame()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-8 right-8 font-mono text-sm pointer-events-none text-white">
      {/* Room name */}
      <div className="text-cyan-400 font-bold mb-4 text-lg">
        {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
      </div>

      {/* Agent status */}
      <div className="bg-gray-950/80 border border-cyan-600/50 rounded p-3 mb-3 backdrop-blur-sm">
        <div className="text-cyan-300 text-xs font-bold mb-2">AGENTS</div>
        <div className="text-gray-300 text-xs space-y-1">
          <div>
            <span className="text-green-400">●</span> {stats.idle} Idle
          </div>
          <div>
            <span className="text-yellow-400">●</span> {stats.working} Working
          </div>
        </div>
      </div>

      {/* Task count */}
      <div className="bg-gray-950/80 border border-cyan-600/50 rounded p-3 mb-3 backdrop-blur-sm">
        <div className="text-cyan-300 text-xs font-bold mb-2">TASKS</div>
        <div className="text-gray-300 text-xs space-y-1">
          <div>
            <span className="text-blue-400">●</span> {stats.inProgress} In Progress
          </div>
          <div>
            <span className="text-purple-400">●</span> {stats.total - stats.inProgress - stats.completed} Queued
          </div>
          <div>
            <span className="text-green-400">●</span> {stats.completed} Completed
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-gray-950/80 border border-cyan-600/50 rounded p-3 backdrop-blur-sm">
        <div className="text-cyan-300 text-xs font-bold mb-2">SYSTEM</div>
        <div className="text-gray-300 text-xs">
          {fps} <span className={fps >= 50 ? 'text-green-400' : 'text-yellow-400'}>FPS</span>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-6 text-gray-600 text-xs">
        <div>📋 Click task board button</div>
        <div>🎮 WASD to move</div>
      </div>
    </div>
  )
}
