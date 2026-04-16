import { io, Socket } from 'socket.io-client'
import { useTaskStore } from '../state/taskStore'
import type { Task, Agent } from '../state/taskStore'

let socket: Socket | null = null

export const initSocket = (url: string = 'http://localhost:3001'): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    try {
      socket = io(url, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
      })

      socket.on('connect', () => {
        console.log('🔌 Socket connected')
        socket!.emit('ui.ready', { timestamp: Date.now() })
        resolve(socket!)
      })

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected')
      })

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error)
      })

      // Task events
      socket.on('task.created', (task: Task) => {
        useTaskStore.getState().addTask(task)
      })

      socket.on('task.updated', (data: { id: string; changes: Partial<Task> }) => {
        useTaskStore.getState().updateTask(data.id, data.changes)
      })

      socket.on('task.completed', (taskId: string) => {
        useTaskStore.getState().completeTask(taskId)
      })

      // Agent events
      socket.on('agent.status', (data: { id: string; status: 'idle' | 'working' | 'done'; currentTask?: string }) => {
        useTaskStore.getState().setAgentStatus(data.id, data.status, data.currentTask)
      })

      socket.on('agent.activity', (data: { id: string; changes: Partial<Agent> }) => {
        useTaskStore.getState().updateAgent(data.id, data.changes)
      })

      // Fallback: try local socket in 2 seconds if not connected
      setTimeout(() => {
        if (!socket?.connected) {
          console.warn('⚠️ Socket not connected, falling back to mock mode')
          reject(new Error('Socket connection failed'))
        }
      }, 2000)
    } catch (error) {
      reject(error)
    }
  })
}

export const getSocket = (): Socket | null => socket

export const emitEvent = (event: string, data: any) => {
  if (socket?.connected) {
    socket.emit(event, data)
  } else {
    console.warn(`⚠️ Socket not connected, cannot emit ${event}`)
  }
}

export const closeSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}
