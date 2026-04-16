import { useEffect, useRef, useState } from 'react'
import { useRoomStore, RoomType } from '@/state/roomStore'
import { useCameraStore } from '@/state/cameraStore'

const ROOMS: { id: RoomType; label: string; key: string; color: string; spawn: [number, number, number] }[] = [
  { id: 'hub',     label: 'Hub',     key: '1', color: '#00ffff', spawn: [0, 1.6, 8] },
  { id: 'studio',  label: 'Studio',  key: '2', color: '#ff00ff', spawn: [0, 1.6, -10] },
  { id: 'arcade',  label: 'Arcade',  key: '3', color: '#ffff00', spawn: [22, 1.6, 0] },
  { id: 'command', label: 'Command', key: '4', color: '#00ff88', spawn: [0, 1.6, 22] },
]

export const UI = () => {
  const [fps, setFps] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(Date.now())
  const currentRoom = useRoomStore((state) => state.currentRoom)
  const setCurrentRoom = useRoomStore((state) => state.setCurrentRoom)
  const setCameraPosition = useCameraStore((state) => state.setPosition)

  const goToRoom = (id: RoomType) => {
    const room = ROOMS.find((r) => r.id === id)
    if (!room) return
    setCurrentRoom(id)
    setCameraPosition(room.spawn)
  }

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

  // Keyboard shortcuts 1-4 to switch rooms (teleport camera)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const room = ROOMS.find((r) => r.key === e.key)
      if (room) goToRoom(room.id)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

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
              onClick={() => goToRoom(room.id)}
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
