import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  agent: string
  status: 'todo' | 'inprogress' | 'done'
  progress: number
  createdAt: number
  completedAt?: number
}

export interface Agent {
  id: string
  name: string
  color: string
  status: 'idle' | 'working' | 'done'
  currentTask?: string
  tasksCompleted: number
  avgTimeMs: number
}

export interface ActivityEvent {
  timestamp: number
  type: 'task.created' | 'task.started' | 'task.completed' | 'agent.status_changed'
  agentId: string
  taskId?: string
  message: string
}

interface TaskStore {
  tasks: Record<string, Task>
  agents: Record<string, Agent>
  activityFeed: ActivityEvent[]
  selectedTask: string | null

  // Mutations
  addTask: (task: Task) => void
  updateTask: (id: string, changes: Partial<Task>) => void
  completeTask: (id: string) => void
  setAgentStatus: (agentId: string, status: Agent['status'], currentTask?: string) => void
  updateAgent: (id: string, changes: Partial<Agent>) => void
  addActivityEvent: (event: ActivityEvent) => void
  selectTask: (taskId: string | null) => void

  // Getters
  getTasksByStatus: (status: Task['status']) => Task[]
  getAgentTasks: (agentId: string) => Task[]
  getStats: () => { total: number; inProgress: number; completed: number; idle: number; working: number }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {},
  agents: {},
  activityFeed: [],
  selectedTask: null,

  addTask: (task) =>
    set((state) => {
      const newState = {
        tasks: { ...state.tasks, [task.id]: task },
        activityFeed: [
          ...state.activityFeed,
          {
            timestamp: Date.now(),
            type: 'task.created',
            agentId: '',
            taskId: task.id,
            message: `Task created: ${task.title}`,
          },
        ],
      }
      return newState
    }),

  updateTask: (id, changes) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [id]: { ...state.tasks[id], ...changes },
      },
    })),

  completeTask: (id) =>
    set((state) => {
      const task = state.tasks[id]
      if (!task) return state

      const now = Date.now()
      const duration = now - task.createdAt
      const agent = state.agents[task.agent]

      return {
        tasks: {
          ...state.tasks,
          [id]: {
            ...task,
            status: 'done',
            progress: 100,
            completedAt: now,
          },
        },
        agents: {
          ...state.agents,
          [task.agent]: {
            ...agent,
            tasksCompleted: agent.tasksCompleted + 1,
            avgTimeMs: (agent.avgTimeMs * (agent.tasksCompleted - 1) + duration) / agent.tasksCompleted,
            currentTask: undefined,
            status: 'idle',
          },
        },
        activityFeed: [
          ...state.activityFeed,
          {
            timestamp: now,
            type: 'task.completed',
            agentId: task.agent,
            taskId: id,
            message: `${agent.name} completed: ${task.title}`,
          },
        ],
      }
    }),

  setAgentStatus: (agentId, status, currentTask) =>
    set((state) => {
      const agent = state.agents[agentId]
      if (!agent) return state

      return {
        agents: {
          ...state.agents,
          [agentId]: {
            ...agent,
            status,
            currentTask,
          },
        },
        activityFeed: [
          ...state.activityFeed,
          {
            timestamp: Date.now(),
            type: 'agent.status_changed',
            agentId,
            message: `${agent.name} is now ${status}`,
          },
        ],
      }
    }),

  updateAgent: (id, changes) =>
    set((state) => ({
      agents: {
        ...state.agents,
        [id]: { ...state.agents[id], ...changes },
      },
    })),

  addActivityEvent: (event) =>
    set((state) => ({
      activityFeed: [event, ...state.activityFeed].slice(0, 50), // Keep last 50
    })),

  selectTask: (taskId) => set({ selectedTask: taskId }),

  getTasksByStatus: (status) => {
    const state = get()
    return Object.values(state.tasks).filter((t) => t.status === status)
  },

  getAgentTasks: (agentId) => {
    const state = get()
    return Object.values(state.tasks).filter((t) => t.agent === agentId)
  },

  getStats: () => {
    const state = get()
    const tasks = Object.values(state.tasks)
    const agents = Object.values(state.agents)

    return {
      total: tasks.length,
      inProgress: tasks.filter((t) => t.status === 'inprogress').length,
      completed: tasks.filter((t) => t.status === 'done').length,
      idle: agents.filter((a) => a.status === 'idle').length,
      working: agents.filter((a) => a.status === 'working').length,
    }
  },
}))
