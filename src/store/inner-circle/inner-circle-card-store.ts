// store/inner-circle-card-store.ts
import { create } from "zustand";

interface CardState {
  invitations: Record<string, any>;
  groups: Record<string, any>;
  buddies: Record<string, any>;
}

interface InnerCircleCardStore {
  cardStates: CardState;
  setCardState: (tab: keyof CardState, cardId: string, state: any) => void;
}

export const useInnerCircleCardStore = create<InnerCircleCardStore>((set) => ({
  cardStates: {
    invitations: {},
    groups: {},
    buddies: {},
  },
  setCardState: (tab, cardId, state) =>
    set((prev) => ({
      cardStates: {
        ...prev.cardStates,
        [tab]: {
          ...prev.cardStates[tab],
          [cardId]: { ...prev.cardStates[tab][cardId], ...state },
        },
      },
    })),
}));
