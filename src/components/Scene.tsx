import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { CameraController } from './CameraController'
import { UI } from './UI'
import { ColorGrading } from './ColorGrading'
import { ConnectedHQ } from './ConnectedHQ'

export const Scene = () => {
  return (
    <>
      <Canvas
        dpr={[1, window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio]}
        camera={{ position: [0, 1.6, 5], fov: 70, near: 0.1, far: 500 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, precision: 'highp', stencil: false }}
        shadows
      >
        <color attach="background" args={['#0A0E27']} />
        <fog attach="fog" args={['#0A0E27', 25, 90]} />
        <Suspense fallback={null}>
          <Environment files="/hdri/studio_small_08_1k.hdr" background={false} />
          <ConnectedHQ />
        </Suspense>
        <ColorGrading />
        <CameraController />
        <EffectComposer>
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.6} mipmapBlur />
        </EffectComposer>
      </Canvas>
      <UI />
    </>
  )
}
