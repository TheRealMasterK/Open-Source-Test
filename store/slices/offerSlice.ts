/**
 * Offer Slice
 * Manages offer state including drafts and escrow flow
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer, CreateOfferPayload } from '@/types';

export interface EscrowFlowState {
  step: 'idle' | 'pending' | 'confirming' | 'complete' | 'error';
  txHash?: string;
  escrowId?: string;
  error?: string;
}

export interface OfferState {
  currentOffer: Offer | null;
  draftOffer: Partial<CreateOfferPayload>;
  escrowFlow: EscrowFlowState;
  selectedCurrency: string;
  activeTab: 'buy' | 'sell';
}

const initialState: OfferState = {
  currentOffer: null,
  draftOffer: {},
  escrowFlow: {
    step: 'idle',
  },
  selectedCurrency: 'USDT',
  activeTab: 'buy',
};

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setCurrentOffer: (state, action: PayloadAction<Offer | null>) => {
      console.log('[OfferSlice] setCurrentOffer:', action.payload?.id || 'null');
      state.currentOffer = action.payload;
    },

    setDraftOffer: (state, action: PayloadAction<Partial<CreateOfferPayload>>) => {
      console.log('[OfferSlice] setDraftOffer');
      state.draftOffer = action.payload;
    },

    updateDraftOffer: (state, action: PayloadAction<Partial<CreateOfferPayload>>) => {
      console.log('[OfferSlice] updateDraftOffer:', Object.keys(action.payload));
      state.draftOffer = {
        ...state.draftOffer,
        ...action.payload,
      };
    },

    clearDraftOffer: (state) => {
      console.log('[OfferSlice] clearDraftOffer');
      state.draftOffer = {};
    },

    setEscrowFlow: (state, action: PayloadAction<Partial<EscrowFlowState>>) => {
      console.log('[OfferSlice] setEscrowFlow:', action.payload.step);
      state.escrowFlow = {
        ...state.escrowFlow,
        ...action.payload,
      };
    },

    resetEscrowFlow: (state) => {
      console.log('[OfferSlice] resetEscrowFlow');
      state.escrowFlow = {
        step: 'idle',
      };
    },

    setSelectedCurrency: (state, action: PayloadAction<string>) => {
      console.log('[OfferSlice] setSelectedCurrency:', action.payload);
      state.selectedCurrency = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<'buy' | 'sell'>) => {
      console.log('[OfferSlice] setActiveTab:', action.payload);
      state.activeTab = action.payload;
    },
  },
});

export const {
  setCurrentOffer,
  setDraftOffer,
  updateDraftOffer,
  clearDraftOffer,
  setEscrowFlow,
  resetEscrowFlow,
  setSelectedCurrency,
  setActiveTab,
} = offerSlice.actions;

// Define RootState type for selectors (handles Redux Persist partial state)
type RootStateWithOffer = { offer?: OfferState };

// Default escrow flow state
const defaultEscrowFlow: EscrowFlowState = { step: 'idle' };

// Selectors - handle potentially undefined state during rehydration
export const selectCurrentOffer = (state: RootStateWithOffer) => state.offer?.currentOffer ?? null;
export const selectDraftOffer = (state: RootStateWithOffer) => state.offer?.draftOffer ?? {};
export const selectEscrowFlow = (state: RootStateWithOffer) => state.offer?.escrowFlow ?? defaultEscrowFlow;
export const selectSelectedCurrency = (state: RootStateWithOffer) => state.offer?.selectedCurrency ?? 'USDT';
export const selectActiveTab = (state: RootStateWithOffer): 'buy' | 'sell' => state.offer?.activeTab ?? 'buy';

export default offerSlice.reducer;
