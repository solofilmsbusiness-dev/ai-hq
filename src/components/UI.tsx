import { useEffect, useRef, useState } from 'react'

export const UI = () => {
  const [fps, setFps] = useState(0)
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
    <div className="fixed inset-0 pointer-events-none">
      {/* Instructions */}
      <div className="absolute top-8 left-8 text-white font-mono text-sm space-y-2">
        <div className="text-hq-accent font-bold mb-4">AI HQ — Command Room</div>
        <div className="text-gray-400">
          <div>W/A/S/D — Move</div>
          <div>Mouse — Look around</div>
          <div>Click to lock mouse</div>
        </div>
      </div>

      {/* FPS Counter */}
      <div className="absolute top-8 right-8 text-hq-accent font-mono text-lg font-bold">
        {fps} FPS
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 border border-hq-accent opacity-50 rounded-full" />
      </div>
    </div>
  )
}
