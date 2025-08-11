// store/navigate-tab-store.ts
import { create } from "zustand";

export type MainTabType =
  | "Library"
  | "Inner Circle"
  | "I am Bored"
  | "My Persona";

interface NavigateTabState {
  currentTab: MainTabType;
  previousTab: MainTabType | null;
  setTab: (tab: MainTabType) => void;
  goBack: () => void;
}

export const useNavigateTabStore = create<NavigateTabState>((set, get) => ({
  currentTab: "Library",
  previousTab: null,
  setTab: (tab) =>
    set((state) => ({
      previousTab: state.currentTab,
      currentTab: tab,
    })),
  goBack: () => {
    const prev = get().previousTab;
    if (prev) {
      set({ currentTab: prev, previousTab: null });
    }
  },
}));
