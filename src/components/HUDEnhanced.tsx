import { useTaskStore } from '../state/taskStore'
import { useRoomStore } from '../state/roomStore'
import { useEffect, useRef, useState } from 'react'
import { useRealtimeSystem } from '../hooks/useRealtimeSystem'
import { audioManager } from '../systems/audioManager'

export const HUDEnhanced = () => {
  const stats = useTaskStore((s) => s.getStats())
  const currentRoom = useRoomStore((s) => s.currentRoom)
  const realtimeStatus = useRealtimeSystem()
  const [fps, setFps] = useState(60)
  const [audioEnabled, setAudioEnabled] = useState(true)
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

  const toggleAudio = () => {
    const newState = !audioEnabled
    setAudioEnabled(newState)
    audioManager.setEnabled(newState)
    if (newState) {
      audioManager.play('taskCreated', 0.5) // Confirmation beep
    }
  }

  const statusBgColor =
    realtimeStatus.mode === 'real' ? 'bg-green-900/80' : 'bg-yellow-900/80'
  const statusBorder =
    realtimeStatus.mode === 'real' ? 'border-green-600/50' : 'border-yellow-600/50'
  const statusColor =
    realtimeStatus.mode === 'real' ? 'text-green-300' : 'text-yellow-300'

  return (
    <div className="fixed top-8 right-8 font-mono text-sm pointer-events-none text-white space-y-3">
      {/* Room name */}
      <div className="text-cyan-400 font-bold text-lg">
        {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
      </div>

      {/* Connection Status */}
      <div className={`${statusBgColor} ${statusBorder} border rounded p-3 backdrop-blur-sm pointer-events-auto cursor-pointer hover:opacity-90 transition-opacity`}>
        <div className={`${statusColor} text-xs font-bold mb-1`}>
          {realtimeStatus.mode === 'real' ? '🟢 LIVE' : '🟡 MOCK MODE'}
        </div>
        {realtimeStatus.error && (
          <div className="text-gray-300 text-xs">{realtimeStatus.error}</div>
        )}
      </div>

      {/* Agent status */}
      <div className="bg-gray-950/80 border border-cyan-600/50 rounded p-3 backdrop-blur-sm">
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
      <div className="bg-gray-950/80 border border-cyan-600/50 rounded p-3 backdrop-blur-sm">
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
        <div className="text-cyan-300 text-xs font-bold mb-2">PERFORMANCE</div>
        <div className="text-gray-300 text-xs">
          {fps} <span className={fps >= 50 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>FPS</span>
        </div>
      </div>

      {/* Audio Control */}
      <button
        onClick={toggleAudio}
        className={`
          w-full px-3 py-2 rounded text-xs font-bold transition-all pointer-events-auto
          ${audioEnabled
            ? 'bg-cyan-600/80 border border-cyan-400/50 hover:bg-cyan-500'
            : 'bg-gray-700/80 border border-gray-600/50 hover:bg-gray-600'
          }
        `}
      >
        {audioEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
      </button>

      {/* Help text */}
      <div className="mt-6 text-gray-600 text-xs space-y-1">
        <div>📋 Click bottom-right for task board</div>
        <div>🎮 WASD to move | Mouse to look</div>
      </div>
    </div>
  )
}
