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

// Selectors
export const selectCurrentOffer = (state: { offer: OfferState }) => state.offer.currentOffer;
export const selectDraftOffer = (state: { offer: OfferState }) => state.offer.draftOffer;
export const selectEscrowFlow = (state: { offer: OfferState }) => state.offer.escrowFlow;
export const selectSelectedCurrency = (state: { offer: OfferState }) =>
  state.offer.selectedCurrency;
export const selectActiveTab = (state: { offer: OfferState }) => state.offer.activeTab;

export default offerSlice.reducer;
