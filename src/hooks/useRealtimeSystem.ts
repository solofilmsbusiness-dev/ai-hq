import { useEffect, useRef, useState } from 'react'
import { initSocket, getSocket } from '../systems/socket'
import { startMockDataStream, stopMockDataStream } from '../systems/mockDataManager'

interface RealtimeStatus {
  connected: boolean
  mode: 'real' | 'mock'
  error?: string
}

export const useRealtimeSystem = (): RealtimeStatus => {
  const [status, setStatus] = useState<RealtimeStatus>({
    connected: false,
    mode: 'mock',
  })
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const init = async () => {
      try {
        // Try to connect to real socket server
        await initSocket('http://localhost:3001')
        
        if (getSocket()?.connected) {
          console.log('✅ Connected to real-time server')
          setStatus({ connected: true, mode: 'real' })
          return
        }
      } catch (error) {
        console.warn('⚠️ Real-time server unavailable, falling back to mock data')
      }

      // Fallback to mock data
      startMockDataStream()
      setStatus({ 
        connected: true, 
        mode: 'mock',
        error: 'Using mock data (server unavailable)'
      })
    }

    init()

    return () => {
      stopMockDataStream()
    }
  }, [])

  return status
}
