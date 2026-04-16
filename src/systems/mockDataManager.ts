import { useTaskStore } from '../state/taskStore'
import type { Task, Agent } from '../state/taskStore'
import { audioManager } from './audioManager'

const AGENT_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta']
const AGENT_COLORS = ['blue', 'purple', 'cyan', 'magenta']
const TASK_TEMPLATES = [
  'Render video frame',
  'Encode asset',
  'Process audio',
  'Compile shader',
  'Bake lighting',
  'Optimize mesh',
  'Generate thumbnail',
  'Process animation',
  'Sync database',
  'Update cache',
]

let mockIntervalId: NodeJS.Timeout | null = null
let taskCounter = 0

export const initMockAgents = () => {
  const store = useTaskStore.getState()
  
  AGENT_NAMES.forEach((name, i) => {
    const agent: Agent = {
      id: `agent-${i}`,
      name,
      color: AGENT_COLORS[i],
      status: 'idle',
      tasksCompleted: 0,
      avgTimeMs: 0,
    }
    store.updateAgent(agent.id, agent)
  })
}

export const startMockDataStream = () => {
  if (mockIntervalId) return // Already running

  initMockAgents()

  mockIntervalId = setInterval(() => {
    const store = useTaskStore.getState()
    const agents = Object.values(store.agents)
    
    if (agents.length === 0) return

    // Randomly create a new task
    if (Math.random() > 0.3) {
      const task: Task = {
        id: `task-${++taskCounter}`,
        title: TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)],
        agent: agents[Math.floor(Math.random() * agents.length)].id,
        status: 'todo',
        progress: 0,
        createdAt: Date.now(),
      }
      
      store.addTask(task)
      audioManager.play('taskCreated', 0.7)
    }

    // Progress existing tasks
    const tasks = Object.values(store.tasks)
    const inProgressTasks = tasks.filter((t) => t.status === 'inprogress')
    
    inProgressTasks.forEach((task) => {
      const progress = task.progress + Math.random() * 25
      
      if (progress >= 100) {
        store.completeTask(task.id)
        audioManager.play('taskCompleted', 0.8)
      } else {
        store.updateTask(task.id, { progress: Math.min(progress, 99) })
      }
    })

    // Start queued tasks
    const todoTasks = tasks.filter((t) => t.status === 'todo')
    if (todoTasks.length > 0 && inProgressTasks.length < Math.ceil(agents.length * 0.7)) {
      const task = todoTasks[0]
      const agent = agents.find((a) => a.status === 'idle') || agents[0]
      
      store.updateTask(task.id, { 
        status: 'inprogress',
        agent: agent.id,
        progress: 5
      })
      store.setAgentStatus(agent.id, 'working', task.id)
      audioManager.play('taskStarted', 0.6)
    }
  }, 2000) // Every 2 seconds
}

export const stopMockDataStream = () => {
  if (mockIntervalId) {
    clearInterval(mockIntervalId)
    mockIntervalId = null
  }
}

export const isMockStreamRunning = (): boolean => mockIntervalId !== null
