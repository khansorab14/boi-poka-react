import { create } from "zustand";

interface UIState {
  showLibrary: boolean;
  toggleLibrary: () => void;
  setShowLibrary: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showLibrary: false,
  toggleLibrary: () => set((state) => ({ showLibrary: !state.showLibrary })),
  setShowLibrary: (value) => set({ showLibrary: value }),
}));
