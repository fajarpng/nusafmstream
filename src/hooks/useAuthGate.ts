import { create } from "zustand"

type AuthGate = {
  isAdmin: boolean
  onLogin: () => void
}

export const useAuthGate = create<AuthGate>()((set) => (
  {
    isAdmin: false,
    onLogin: () => set(() => ({ isAdmin: true })),
  }
))
