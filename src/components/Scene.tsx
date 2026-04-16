import { Canvas } from '@react-three/fiber'
import { Room } from './Room'
import { CameraController } from './CameraController'
import { UI } from './UI'

export const Scene = () => {
  return (
    <>
      <Canvas
        dpr={window.devicePixelRatio}
        camera={{
          position: [0, 1.6, 5],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#0A0E27']} />
        <Room />
        <CameraController />
      </Canvas>
      <UI />
    </>
  )
}
