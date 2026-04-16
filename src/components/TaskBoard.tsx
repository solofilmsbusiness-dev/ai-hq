import { useTaskStore } from '../state/taskStore'
import { useState } from 'react'

export const TaskBoard = () => {
  const tasks = useTaskStore((s) => s.tasks)
  const agents = useTaskStore((s) => s.agents)
  const selectedTask = useTaskStore((s) => s.selectedTask)
  const selectTask = useTaskStore((s) => s.selectTask)
  const [expanded, setExpanded] = useState(false)

  const todoTasks = Object.values(tasks).filter((t) => t.status === 'todo')
  const inProgressTasks = Object.values(tasks).filter((t) => t.status === 'inprogress')
  const doneTasks = Object.values(tasks).filter((t) => t.status === 'done')

  const getAgentColor = (agentId: string): string => {
    const agent = agents[agentId]
    return agent ? agent.color : '#888888'
  }

  const TaskCard = ({ taskId }: { taskId: string }) => {
    const task = tasks[taskId]
    if (!task) return null

    const isSelected = selectedTask === taskId
    const agent = agents[task.agent]
    const borderColor = getAgentColor(task.agent)

    return (
      <div
        onClick={() => selectTask(isSelected ? null : taskId)}
        className={`
          p-3 rounded-lg cursor-pointer transition-all duration-200
          bg-gray-900 border-l-4 hover:bg-gray-800
          ${isSelected ? 'ring-2 ring-cyan-400 bg-gray-800' : ''}
        `}
        style={{ borderLeftColor: borderColor }}
      >
        <div className="font-mono text-xs text-gray-400 mb-1">{task.id.slice(0, 8)}</div>
        <div className="text-sm font-semibold text-white mb-2 truncate">{task.title}</div>

        {task.status === 'inprogress' && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{agent?.name || task.agent}</span>
          <span
            className={`
              px-2 py-1 rounded-full text-xs font-mono
              ${
                task.status === 'todo'
                  ? 'bg-gray-700 text-gray-300'
                  : task.status === 'inprogress'
                    ? 'bg-cyan-900 text-cyan-200'
                    : 'bg-green-900 text-green-200'
              }
            `}
          >
            {task.status}
          </span>
        </div>
      </div>
    )
  }

  const columnClass = 'flex-1 min-w-0'

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-8 right-8 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded-lg text-sm transition-colors z-40 pointer-events-auto shadow-lg"
      >
        📋 Task Board
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8 pointer-events-auto">
      <div className="bg-gray-950 border-2 border-cyan-600 rounded-lg w-full max-w-5xl max-h-96 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-cyan-600/30 bg-gray-900">
          <h2 className="font-mono text-cyan-400 font-bold flex items-center gap-2">
            <span>⚙️ Task Board</span>
            <span className="text-xs text-gray-500">
              {todoTasks.length} queued | {inProgressTasks.length} working | {doneTasks.length} done
            </span>
          </h2>
          <button
            onClick={() => setExpanded(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 flex gap-4 p-4 overflow-auto">
          {/* To Do */}
          <div className={columnClass}>
            <div className="font-mono text-xs font-bold text-gray-500 uppercase mb-3">To Do</div>
            <div className="space-y-2 flex flex-col">
              {todoTasks.map((task) => (
                <TaskCard key={task.id} taskId={task.id} />
              ))}
              {todoTasks.length === 0 && (
                <div className="text-center text-gray-600 text-xs py-8">No tasks</div>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className={columnClass}>
            <div className="font-mono text-xs font-bold text-cyan-400 uppercase mb-3">In Progress</div>
            <div className="space-y-2">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} taskId={task.id} />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="text-center text-gray-600 text-xs py-8">No active tasks</div>
              )}
            </div>
          </div>

          {/* Done */}
          <div className={columnClass}>
            <div className="font-mono text-xs font-bold text-green-500 uppercase mb-3">Done</div>
            <div className="space-y-2">
              {doneTasks.slice(0, 10).map((task) => (
                <TaskCard key={task.id} taskId={task.id} />
              ))}
              {doneTasks.length === 0 && (
                <div className="text-center text-gray-600 text-xs py-8">No completed tasks</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
