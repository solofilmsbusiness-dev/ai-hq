import { useEffect, useRef, useState } from 'react'
import { useRoomStore, RoomType } from '@/state/roomStore'

const ROOMS: { id: RoomType; label: string; key: string; color: string }[] = [
  { id: 'hub',     label: 'Hub',     key: '1', color: '#00ffff' },
  { id: 'studio',  label: 'Studio',  key: '2', color: '#ff00ff' },
  { id: 'arcade',  label: 'Arcade',  key: '3', color: '#ffff00' },
  { id: 'command', label: 'Command', key: '4', color: '#00ff88' },
]

export const UI = () => {
  const [fps, setFps] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(Date.now())
  const currentRoom = useRoomStore((state) => state.currentRoom)
  const setCurrentRoom = useRoomStore((state) => state.setCurrentRoom)

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

  // Keyboard shortcuts 1-4 to switch rooms
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const room = ROOMS.find((r) => r.key === e.key)
      if (room) setCurrentRoom(room.id)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setCurrentRoom])

  const activeRoom = ROOMS.find((r) => r.id === currentRoom)

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top-left: Title + controls */}
      <div className="absolute top-8 left-8 text-white font-mono text-sm space-y-1">
        <div style={{ color: activeRoom?.color ?? '#ffd700' }} className="font-bold text-base mb-3">
          AI HQ — {activeRoom?.label ?? 'Hub'}
        </div>
        <div className="text-gray-500 text-xs">
          <div>W/A/S/D — Move &nbsp;|&nbsp; Mouse — Look</div>
          <div>Click canvas to lock mouse &nbsp;|&nbsp; Esc to unlock</div>
        </div>
      </div>

      {/* FPS Counter */}
      <div className="absolute top-8 right-8 text-yellow-400 font-mono text-lg font-bold">
        {fps} FPS
      </div>

      {/* Room switcher — bottom center */}
      <div
        className="absolute bottom-8 left-1/2 flex gap-3 pointer-events-auto"
        style={{ transform: 'translateX(-50%)' }}
      >
        {ROOMS.map((room) => {
          const active = currentRoom === room.id
          return (
            <button
              key={room.id}
              onClick={() => setCurrentRoom(room.id)}
              style={{
                borderColor: room.color,
                color: active ? '#0a0e27' : room.color,
                backgroundColor: active ? room.color : 'rgba(10,14,39,0.85)',
                boxShadow: active ? `0 0 18px ${room.color}` : 'none',
              }}
              className="px-4 py-2 rounded font-mono text-sm font-bold border transition-all duration-200 hover:opacity-90"
            >
              [{room.key}] {room.label}
            </button>
          )
        })}
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-5 h-5 rounded-full border opacity-60"
          style={{ borderColor: activeRoom?.color ?? '#ffd700' }}
        />
      </div>
    </div>
  )
}
