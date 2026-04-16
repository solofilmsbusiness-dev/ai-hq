import { Suspense, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { HubRoom } from './rooms/HubRoom'
import { StudioRoom } from './rooms/StudioRoom'
import { ArcadeRoom } from './rooms/ArcadeRoom'
import { CommandRoom } from './rooms/CommandRoom'
import { Hallway } from './Hallway'
import { useRoomStore, RoomType } from '@/state/roomStore'

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
  const setCurrentRoom = useRoomStore((s) => s.setCurrentRoom)
  const camPos = useRef(new Vector3())
  const lastRoom = useRef<RoomType>('hub')

  const [visible, setVisible] = useState({
    hub: true,
    studio: false,
    arcade: false,
    command: false,
  })
  const lastVisible = useRef(visible)

  useFrame(({ camera }) => {
    camPos.current.copy(camera.position)
    const pos = camPos.current

    // Determine current room
    let room: RoomType = 'hub'
    if (pos.z < -15) room = 'studio'
    else if (pos.x > 15) room = 'arcade'
    else if (pos.z > 15) room = 'command'
    if (room !== lastRoom.current) {
      lastRoom.current = room
      setCurrentRoom(room)
    }

    // Cull rooms beyond render distance — only update state on change
    const next = {
      hub:     pos.distanceTo(ROOM_POSITIONS.hub) < RENDER_DISTANCE,
      studio:  pos.distanceTo(ROOM_POSITIONS.studio) < RENDER_DISTANCE,
      arcade:  pos.distanceTo(ROOM_POSITIONS.arcade) < RENDER_DISTANCE,
      command: pos.distanceTo(ROOM_POSITIONS.command) < RENDER_DISTANCE,
    }
    const prev = lastVisible.current
    if (
      next.hub !== prev.hub ||
      next.studio !== prev.studio ||
      next.arcade !== prev.arcade ||
      next.command !== prev.command
    ) {
      lastVisible.current = next
      setVisible(next)
    }
  })

  return (
    <group ref={groupRef}>
      {/* HUB - Center atrium */}
      {visible.hub && (
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <HubRoom />
          </group>
        </Suspense>
      )}

      {/* STUDIO - South */}
      {visible.studio && (
        <Suspense fallback={null}>
          <group position={[0, 0, -30]}>
            <StudioRoom />
          </group>
        </Suspense>
      )}

      {/* ARCADE - East */}
      {visible.arcade && (
        <Suspense fallback={null}>
          <group position={[30, 0, 0]}>
            <ArcadeRoom />
          </group>
        </Suspense>
      )}

      {/* COMMAND - North */}
      {visible.command && (
        <Suspense fallback={null}>
          <group position={[0, 0, 30]}>
            <CommandRoom />
          </group>
        </Suspense>
      )}

      {/* HALLWAYS - always visible (lightweight) */}
      <Hallway start={[0, 0, -7]}    end={[0, 0, -23]}   width={3.5} lightColor="#FFD700" ambientIntensity={0.4} />
      <Hallway start={[12.5, 0, 0]}  end={[27.5, 0, 0]}  width={3.5} lightColor="#00CCFF" ambientIntensity={0.3} />
      <Hallway start={[0, 0, 7]}     end={[0, 0, 23]}    width={3.5} lightColor="#00CCFF" ambientIntensity={0.3} />
      <Hallway start={[-12.5, 0, 0]} end={[-20, 0, 0]}   width={3.5} lightColor="#888888" ambientIntensity={0.2} />
    </group>
  )
}
