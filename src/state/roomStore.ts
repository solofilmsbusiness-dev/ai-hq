import { create } from 'zustand'

export type RoomType = 'hub' | 'studio' | 'arcade' | 'command'

interface RoomPosition {
  x: number
  y: number
  z: number
}

interface RoomStore {
  currentRoom: RoomType
  setCurrentRoom: (room: RoomType) => void
  playerPosition: RoomPosition
  setPlayerPosition: (pos: RoomPosition) => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: 'hub',
  setCurrentRoom: (room) => set({ currentRoom: room }),
  playerPosition: { x: 0, y: 1.6, z: 0 },
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
}))
