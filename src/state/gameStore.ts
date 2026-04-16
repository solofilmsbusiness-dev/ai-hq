import { create } from 'zustand'

interface PongState {
  playerY: number
  ballX: number
  ballY: number
  ballVelX: number
  ballVelY: number
  score: number
  aiY: number
}

interface GameStore {
  pongState: PongState
  isPongActive: boolean
  startPong: () => void
  endPong: () => void
  updatePongState: (state: Partial<PongState>) => void
}

export const useGameStore = create<GameStore>((set) => ({
  pongState: {
    playerY: 0,
    ballX: 0,
    ballY: 0,
    ballVelX: 0.1,
    ballVelY: 0.05,
    score: 0,
    aiY: 0,
  },
  isPongActive: false,
  startPong: () => {
    set({
      isPongActive: true,
      pongState: {
        playerY: 0,
        ballX: -8,
        ballY: 0,
        ballVelX: 0.08,
        ballVelY: 0.03,
        score: 0,
        aiY: 0,
      },
    })
  },
  endPong: () => set({ isPongActive: false }),
  updatePongState: (newState) =>
    set((state) => ({
      pongState: { ...state.pongState, ...newState },
    })),
}))
