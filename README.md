# AI HQ — 3D Command Center

A cinematic 3D command room built with React, Three.js, and Vite.

## Status

**Day 1 ✅ COMPLETE** — Scaffold + Basic 3D Scene + Camera Controls

### Day 1 Deliverables
- ✅ Vite + React 18 + TypeScript scaffold
- ✅ Three.js + React Three Fiber + Drei
- ✅ Project structure (components, hooks, state, systems)
- ✅ Basic 3D scene:
  - Dark floor (#0A0E27)
  - 4 walls (#1a1f3a)
  - Ceiling
  - 3-light system (ambient + directional gold + point lights)
  - Accent pillars with gold emissive material
- ✅ Smooth camera controller:
  - WASD movement
  - Mouse look (pointer lock)
  - Friction-based movement
  - Boundary clipping
- ✅ UI overlay:
  - Instructions
  - FPS counter
  - Crosshair
- ✅ Production build verified
- ✅ All code committed to GitHub

## Getting Started

```bash
npm install
npm run dev  # http://localhost:5173
npm run build
npm run preview
```

## Controls

- **W/A/S/D** — Move forward/left/back/right
- **Mouse** — Look around (click to lock)
- **Click** — Lock/unlock mouse

## Next Steps (Day 2)

- [ ] Cinematic lighting improvements
- [ ] Environment mapping (HDRI reflections)
- [ ] Agent stations (interactive models)
- [ ] Particle effects
- [ ] WebSocket integration for real-time updates
- [ ] Audio integration

## Project Structure

```
src/
├── components/
│   ├── Scene.tsx        # Canvas wrapper
│   ├── Room.tsx         # 3D geometry + lighting
│   ├── CameraController.tsx
│   └── UI.tsx           # HUD overlay
├── hooks/
│   └── useCamera.ts     # Movement + look controls
├── state/
│   └── cameraStore.ts   # Zustand camera store
├── App.tsx
└── main.tsx
```

## Tech Stack

- **React 18** — UI framework
- **Three.js** — 3D rendering
- **React Three Fiber** — React renderer for Three.js
- **@react-three/drei** — Useful 3D helpers
- **Zustand** — State management
- **Tailwind CSS** — Styling
- **Vite** — Build tool

## FPS Target

**60 FPS locked** (smooth, cinematic feel)

## Aesthetic

- **Dark theme**: #0A0E27 (primary), #1a1f3a (secondary)
- **Gold accents**: #FFD700 (emissive highlights)
- **Cinematic mood**: Apple Store meets Cyberpunk
