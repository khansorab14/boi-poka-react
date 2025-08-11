// stores/useInnerCircleTabStore.ts
import { create } from "zustand";

type TabType = "invitations" | "groups" | "fellow pokas";

interface InnerCircleTabState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useInnerCircleTabStore = create<InnerCircleTabState>((set) => ({
  activeTab: "invitations",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
