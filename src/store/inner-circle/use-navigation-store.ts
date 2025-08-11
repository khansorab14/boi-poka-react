// useNavigationDataStore.ts
import { create } from "zustand";

export const useNavigationDataStore = create((set) => ({
  refreshData: true,
  setRefreshData: (value: any) => set({ refreshData: value }),
}));
