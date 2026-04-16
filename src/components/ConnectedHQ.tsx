import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { HubRoom } from './rooms/HubRoom'
import { StudioRoom } from './rooms/StudioRoom'
import { ArcadeRoom } from './rooms/ArcadeRoom'
import { CommandRoom } from './rooms/CommandRoom'
import { Hallway } from './Hallway'
import { useRoomStore } from '@/state/roomStore'

// Room center positions in world space
const ROOM_POSITIONS = {
  hub:     new Vector3(0, 0, 0),
  studio:  new Vector3(0, 0, -30),
  arcade:  new Vector3(30, 0, 0),
  command: new Vector3(0, 0, 30),
}

// Only render a room if camera is within this distance
const RENDER_DISTANCE = 45

export const ConnectedHQ = () => {
  const groupRef = useRef<Group>(null)
  const { setCurrentRoom } = useRoomStore()
  const camPos = useRef(new Vector3())

  const [visible, setVisible] = useState({
    hub: true,
    studio: false,
    arcade: false,
    command: false,
  })

  useFrame(({ camera }) => {
    camPos.current.copy(camera.position)
    const pos = camPos.current

    // Determine current room
    let room: 'hub' | 'studio' | 'arcade' | 'command' = 'hub'
    if (pos.z < -15) room = 'studio'
    else if (pos.x > 15) room = 'arcade'
    else if (pos.z > 15) room = 'command'
    setCurrentRoom(room)

    // Cull rooms beyond render distance
    setVisible({
      hub:     pos.distanceTo(ROOM_POSITIONS.hub) < RENDER_DISTANCE,
      studio:  pos.distanceTo(ROOM_POSITIONS.studio) < RENDER_DISTANCE,
      arcade:  pos.distanceTo(ROOM_POSITIONS.arcade) < RENDER_DISTANCE,
      command: pos.distanceTo(ROOM_POSITIONS.command) < RENDER_DISTANCE,
    })
  })

  return (
    <group ref={groupRef}>
      {/* HUB - Center atrium */}
      {visible.hub && (
        <group position={[0, 0, 0]}>
          <HubRoom />
        </group>
      )}

      {/* STUDIO - South */}
      {visible.studio && (
        <group position={[0, 0, -30]}>
          <StudioRoom />
        </group>
      )}

      {/* ARCADE - East */}
      {visible.arcade && (
        <group position={[30, 0, 0]}>
          <ArcadeRoom />
        </group>
      )}

      {/* COMMAND - North */}
      {visible.command && (
        <group position={[0, 0, 30]}>
          <CommandRoom />
        </group>
      )}

      {/* HALLWAYS - always visible (lightweight) */}
      <Hallway start={[0, 0, -7]}    end={[0, 0, -23]}   width={3.5} lightColor="#FFD700" ambientIntensity={0.4} />
      <Hallway start={[12.5, 0, 0]}  end={[27.5, 0, 0]}  width={3.5} lightColor="#00CCFF" ambientIntensity={0.3} />
      <Hallway start={[0, 0, 7]}     end={[0, 0, 23]}    width={3.5} lightColor="#00CCFF" ambientIntensity={0.3} />
      <Hallway start={[-12.5, 0, 0]} end={[-20, 0, 0]}   width={3.5} lightColor="#888888" ambientIntensity={0.2} />
    </group>
  )
}
