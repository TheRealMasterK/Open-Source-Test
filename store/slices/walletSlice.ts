/**
 * Wallet Slice
 * Manages wallet state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletBalances } from '@/types';

export interface WalletState {
  balances: WalletBalances;
  selectedNetwork: string;
  depositAddress: string | null;
  isLoadingBalances: boolean;
}

const initialState: WalletState = {
  balances: {
    USDT: 0,
    BTC: 0,
    ETH: 0,
    estimatedValueUSD: 0,
    estimatedValueZAR: 0,
  },
  selectedNetwork: 'tron',
  depositAddress: null,
  isLoadingBalances: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalances: (state, action: PayloadAction<WalletBalances>) => {
      console.log('[WalletSlice] setBalances:', action.payload);
      state.balances = action.payload;
    },

    updateBalance: (
      state,
      action: PayloadAction<{ currency: keyof Omit<WalletBalances, 'estimatedValueUSD' | 'estimatedValueZAR'>; amount: number }>
    ) => {
      console.log('[WalletSlice] updateBalance:', action.payload.currency, action.payload.amount);
      state.balances[action.payload.currency] = action.payload.amount;
    },

    setSelectedNetwork: (state, action: PayloadAction<string>) => {
      console.log('[WalletSlice] setSelectedNetwork:', action.payload);
      state.selectedNetwork = action.payload;
    },

    setDepositAddress: (state, action: PayloadAction<string | null>) => {
      console.log('[WalletSlice] setDepositAddress:', action.payload ? 'set' : 'cleared');
      state.depositAddress = action.payload;
    },

    setLoadingBalances: (state, action: PayloadAction<boolean>) => {
      state.isLoadingBalances = action.payload;
    },

    clearWallet: (state) => {
      console.log('[WalletSlice] clearWallet');
      state.balances = initialState.balances;
      state.depositAddress = null;
    },
  },
});

export const {
  setBalances,
  updateBalance,
  setSelectedNetwork,
  setDepositAddress,
  setLoadingBalances,
  clearWallet,
} = walletSlice.actions;

// Selectors
export const selectBalances = (state: { wallet: WalletState }) => state.wallet.balances;
export const selectSelectedNetwork = (state: { wallet: WalletState }) => state.wallet.selectedNetwork;
export const selectDepositAddress = (state: { wallet: WalletState }) => state.wallet.depositAddress;
export const selectIsLoadingBalances = (state: { wallet: WalletState }) => state.wallet.isLoadingBalances;

export default walletSlice.reducer;
