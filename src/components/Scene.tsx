import { Canvas } from '@react-three/fiber'
import { CameraController } from './CameraController'
import { UI } from './UI'
import { ColorGrading } from './ColorGrading'
import { useRoomStore } from '@/state/roomStore'
import { HubRoom } from './rooms/HubRoom'
import { StudioRoom } from './rooms/StudioRoom'
import { ArcadeRoom } from './rooms/ArcadeRoom'
import { CommandRoom } from './rooms/CommandRoom'

const RoomRenderer = () => {
  const currentRoom = useRoomStore((state) => state.currentRoom)

  switch (currentRoom) {
    case 'hub':
      return <HubRoom />
    case 'studio':
      return <StudioRoom />
    case 'arcade':
      return <ArcadeRoom />
    case 'command':
      return <CommandRoom />
    default:
      return <HubRoom />
  }
}

export const Scene = () => {
  return (
    <>
      <Canvas
        dpr={[1, window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio]}
        camera={{
          position: [0, 1.6, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          precision: 'highp',
          stencil: false,
        }}
        performance={{
          current: 1, // Start at 60fps
          min: 0.5,
          max: 1,
        }}
      >
        <color attach="background" args={['#0A0E27']} />
        <RoomRenderer />
        <ColorGrading />
        <CameraController />
      </Canvas>
      <UI />
    </>
  )
}
