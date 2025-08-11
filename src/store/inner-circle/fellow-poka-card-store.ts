import { create } from "zustand";

interface BuddyCard {
  buddyId: string;
  fullName: string;
  profileImage: string;
  email: string;
  phone: string;
  booksSharedByBuddy: any[];
  booksSharedByUser: any[];
  librariesSharedByBuddy: any[];
  librariesSharedByUser: any[];
  sharedByBuddyToUser: number;
  sharedByUserToBuddy: number;
  totalBooksSharedByBuddy: number;
  totalBooksSharedByUser: number;
}

interface FellowPokaCardState {
  buddies: BuddyCard[];
  setBuddiesStoreData: (buddies: BuddyCard[]) => void;
  updateBuddy: (buddyId: string, data: Partial<BuddyCard>) => void;
  clearBuddies: () => void;
}

export const FellowPokaCardStore = create<FellowPokaCardState>((set) => ({
  buddies: [],
  setBuddiesStoreData: (buddies) => set({ buddies }),
  updateBuddy: (buddyId, data) =>
    set((state) => ({
      buddies: state.buddies.map((buddy) =>
        buddy.buddyId === buddyId ? { ...buddy, ...data } : buddy
      ),
    })),
  clearBuddies: () => set({ buddies: [] }),
}));
