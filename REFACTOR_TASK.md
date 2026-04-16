# URGENT REFACTOR: Connected Building Architecture

## Current Problem
Scene.tsx uses room switching (click portal, teleport). Cam wants WALKING through actual hallways.

## What to Build
Single 3D world with all 4 rooms positioned + connected by hallways.

## Architecture
```
HubRoom [0,0,0] (25×20×3.5)
├── Hallway_S → StudioRoom [0,0,-30] (28×24×4)
├── Hallway_E → ArcadeRoom [30,0,0] (25×18×3.2)
├── Hallway_N → CommandRoom [0,0,30] (26×20×3.2)
└── Hallway_W → Exit
```

## Files to Create/Modify
1. src/components/ConnectedHQ.tsx (NEW)
   - Renders all 4 rooms positioned in world
   - Renders 4 hallways
   - Single Three.js scene
   
2. src/components/Scene.tsx
   - Replace RoomRenderer with ConnectedHQ
   - Remove room switch logic
   
3. src/components/Hallway.tsx (NEW)
   - 3.5m wide hallway geometry
   - Lighting transitions
   - No loading screens

4. Update Room Components
   - Remove portal logic if present
   - Rooms work as world-positioned objects

## Success
Walk from Hub → Studio → Arcade → Command WITHOUT loading/teleporting.
60fps locked. All rooms in single frame.

TIMELINE: 1.5-2 hours
