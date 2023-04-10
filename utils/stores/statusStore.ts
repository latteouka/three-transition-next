import { create } from "zustand";

interface StatusState {
  activeIndex: number;
  setActive: (index: number) => void;
}
export const useStatusStore = create<StatusState>()((set) => ({
  activeIndex: 0,
  setActive: (index) => set(() => ({ activeIndex: index })),
}));
