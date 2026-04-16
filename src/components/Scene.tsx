import { Canvas } from '@react-three/fiber'
import { CameraController } from './CameraController'
import { UI } from './UI'
import { ColorGrading } from './ColorGrading'
import { ConnectedHQ } from './ConnectedHQ'

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
        {/* Connected HQ: Single 3D world with all rooms + hallways */}
        <ConnectedHQ />
        <ColorGrading />
        <CameraController />
      </Canvas>
      <UI />
    </>
  )
}
