import { useTaskStore } from '../state/taskStore'
import { useEffect, useRef } from 'react'

export const ActivityFeed = () => {
  const activityFeed = useTaskStore((s) => s.activityFeed)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activityFeed])

  const getIconForType = (type: string) => {
    switch (type) {
      case 'task.created':
        return '✨'
      case 'task.started':
        return '▶️'
      case 'task.completed':
        return '✅'
      case 'agent.status_changed':
        return '🔄'
      default:
        return '•'
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'task.created':
        return 'text-blue-300'
      case 'task.started':
        return 'text-yellow-300'
      case 'task.completed':
        return 'text-green-300'
      case 'agent.status_changed':
        return 'text-purple-300'
      default:
        return 'text-gray-300'
    }
  }

  return (
    <div className="fixed bottom-8 left-8 w-80 h-64 bg-gray-950/90 border border-cyan-600/50 rounded-lg backdrop-blur-sm flex flex-col pointer-events-auto z-40 shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-cyan-600/30 bg-gray-900">
        <h3 className="font-mono text-cyan-300 text-sm font-bold">📡 Activity Feed</h3>
      </div>

      {/* Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1 font-mono text-xs scrollbar-thin scrollbar-thumb-cyan-600/30 scrollbar-track-gray-900"
      >
        {activityFeed.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No activity yet...</div>
        ) : (
          activityFeed.map((event, idx) => (
            <div key={idx} className="flex gap-2 text-gray-300 hover:text-gray-100 transition-colors">
              <span className="flex-shrink-0 text-base">{getIconForType(event.type)}</span>
              <div className="flex-1 min-w-0">
                <div className={`${getColorForType(event.type)} truncate`}>{event.message}</div>
                <div className="text-gray-600 text-xs mt-0.5">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
