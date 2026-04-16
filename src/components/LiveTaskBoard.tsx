import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { useTaskStore } from '@/state/taskStore'

interface LiveTaskBoardProps {
  position: [number, number, number]
}

const AGENT_COLORS: Record<string, string> = {
  bangout: '#4488ff',
  solobrain: '#aa55ff',
  hermes: '#00ddff',
}

const FALLBACK_ENTRIES = [
  { agent: 'BangOut', message: 'patched auth middleware', t: '2m ago', color: '#4488ff' },
  { agent: 'SoloBrain', message: 'analyzed Q1 metrics', t: '4m ago', color: '#aa55ff' },
  { agent: 'Hermes', message: 'rendered scene preview', t: '7m ago', color: '#00ddff' },
  { agent: 'BangOut', message: 'opened PR #284', t: '12m ago', color: '#4488ff' },
  { agent: 'SoloBrain', message: 'drafted weekly summary', t: '18m ago', color: '#aa55ff' },
]

const formatRelative = (ms: number) => {
  const delta = Date.now() - ms
  const s = Math.floor(delta / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

const colorFor = (agentId: string, agents: Record<string, { color: string; name: string }>) => {
  if (agents[agentId]?.color) return agents[agentId].color
  const key = agentId.toLowerCase()
  return AGENT_COLORS[key] ?? '#00ffff'
}

const nameFor = (agentId: string, agents: Record<string, { name: string }>) => {
  if (agents[agentId]?.name) return agents[agentId].name
  return agentId || 'system'
}

export const LiveTaskBoard = ({ position }: LiveTaskBoardProps) => {
  const activityFeed = useTaskStore((s) => s.activityFeed)
  const agents = useTaskStore((s) => s.agents)

  const entries = useMemo(() => {
    if (activityFeed.length === 0) return FALLBACK_ENTRIES
    return activityFeed.slice(0, 5).map((e) => ({
      agent: nameFor(e.agentId, agents),
      message: e.message,
      t: formatRelative(e.timestamp),
      color: colorFor(e.agentId, agents),
    }))
  }, [activityFeed, agents])

  return (
    <group position={position}>
      {/* Backing panel */}
      <mesh>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial
          color={0x000814}
          emissive={0x002244}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 2.05, 0.05]}
        fontSize={0.35}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#000000"
      >
        // LIVE AGENT FEED
      </Text>

      {/* Divider */}
      <mesh position={[0, 1.7, 0.04]}>
        <planeGeometry args={[9.4, 0.03]} />
        <meshBasicMaterial color={0x00ffff} />
      </mesh>

      {/* Entries */}
      {entries.map((e, i) => {
        const y = 1.2 - i * 0.55
        return (
          <group key={i} position={[0, y, 0.05]}>
            <Text
              position={[-4.5, 0, 0]}
              fontSize={0.22}
              color={e.color}
              anchorX="left"
              anchorY="middle"
              outlineWidth={0.008}
              outlineColor="#000000"
            >
              {e.agent}
            </Text>
            <Text
              position={[-2.4, 0, 0]}
              fontSize={0.2}
              color="#cccccc"
              anchorX="left"
              anchorY="middle"
              maxWidth={5.5}
            >
              {e.message}
            </Text>
            <Text
              position={[4.5, 0, 0]}
              fontSize={0.18}
              color="#666688"
              anchorX="right"
              anchorY="middle"
            >
              {e.t}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
