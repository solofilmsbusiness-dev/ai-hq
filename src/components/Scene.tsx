import { Canvas } from '@react-three/fiber'
import { Room } from './Room'
import { CameraController } from './CameraController'
import { UI } from './UI'
import { ColorGrading } from './ColorGrading'

export const Scene = () => {
  return (
    <>
      <Canvas
        dpr={[1, window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio]}
        camera={{
          position: [0, 2, 8],
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
        <Room />
        <ColorGrading />
        <CameraController />
      </Canvas>
      <UI />
    </>
  )
}
