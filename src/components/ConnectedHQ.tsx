import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { HubRoom } from './rooms/HubRoom'
import { StudioRoom } from './rooms/StudioRoom'
import { ArcadeRoom } from './rooms/ArcadeRoom'
import { CommandRoom } from './rooms/CommandRoom'
import { Hallway } from './Hallway'
import { useRoomStore } from '@/state/roomStore'

export const ConnectedHQ = () => {
  const groupRef = useRef<Group>(null)
  const { setCurrentRoom } = useRoomStore()

  // Track which room player is in based on camera position
  useFrame(({ camera }) => {
    if (!groupRef.current) return

    const cameraPos = camera.position
    const worldPos = groupRef.current.localToWorld(cameraPos.clone())

    // Determine current room based on world position
    let room: 'hub' | 'studio' | 'arcade' | 'command' = 'hub'

    // Studio: z < -15 (southern region)
    if (worldPos.z < -15) {
      room = 'studio'
    }
    // Arcade: x > 15 (eastern region)
    else if (worldPos.x > 15) {
      room = 'arcade'
    }
    // Command: z > 15 (northern region)
    else if (worldPos.z > 15) {
      room = 'command'
    }
    // Hub: default (central atrium)

    setCurrentRoom(room)
  })

  return (
    <group ref={groupRef}>
      {/* HUB - Center atrium (0, 0, 0) */}
      <group position={[0, 0, 0]}>
        <HubRoom />
      </group>

      {/* STUDIO - South (-Z direction) */}
      <group position={[0, 0, -30]}>
        <StudioRoom />
      </group>

      {/* ARCADE - East (+X direction) */}
      <group position={[30, 0, 0]}>
        <ArcadeRoom />
      </group>

      {/* COMMAND - North (+Z direction) */}
      <group position={[0, 0, 30]}>
        <CommandRoom />
      </group>

      {/* HALLWAYS connecting rooms */}
      {/* South Hallway: Hub → Studio */}
      <Hallway
        start={[0, 0, -7]}
        end={[0, 0, -23]}
        width={3.5}
        lightColor="#FFD700"
        ambientIntensity={0.4}
      />

      {/* East Hallway: Hub → Arcade */}
      <Hallway
        start={[12.5, 0, 0]}
        end={[27.5, 0, 0]}
        width={3.5}
        lightColor="#00CCFF"
        ambientIntensity={0.3}
      />

      {/* North Hallway: Hub → Command */}
      <Hallway
        start={[0, 0, 7]}
        end={[0, 0, 23]}
        width={3.5}
        lightColor="#00CCFF"
        ambientIntensity={0.3}
      />

      {/* West Hallway: Hub → Exit (optional, leads out) */}
      <Hallway
        start={[-12.5, 0, 0]}
        end={[-20, 0, 0]}
        width={3.5}
        lightColor="#888888"
        ambientIntensity={0.2}
      />
    </group>
  )
}
