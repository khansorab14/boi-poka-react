// stores/useBuddyStore.ts
import { create } from "zustand";

interface BuddyData {
  fullName: string;
  id: string;
  [key: string]: any; // for other fields like libraries, profile pic, etc.
}

interface BuddyStoreState {
  selectedBuddy: BuddyData | null;
  setSelectedBuddy: (buddy: BuddyData) => void;
  clearSelectedBuddy: () => void;
}

export const useBuddyStore = create<BuddyStoreState>((set) => ({
  selectedBuddy: null,
  setSelectedBuddy: (buddy) => set({ selectedBuddy: buddy }),
  clearSelectedBuddy: () => set({ selectedBuddy: null }),
}));
