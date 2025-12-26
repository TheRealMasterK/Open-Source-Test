/**
 * useSocket Hook
 * Custom hook for managing socket connections and events
 */

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socketClient from '@/services/socket/socket-client';
import { useAppSelector, useAppDispatch } from '@/store';
import { setOnlineStatus } from '@/store/slices/uiSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { tradeKeys } from '@/hooks/api/useTrades';
import { walletKeys } from '@/hooks/api/useWallet';
import { offerKeys } from '@/hooks/api/useOffers';

interface UseSocketOptions {
  autoConnect?: boolean;
  enableTradeUpdates?: boolean;
  enableWalletUpdates?: boolean;
  enableOfferUpdates?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
  const {
    autoConnect = true,
    enableTradeUpdates = true,
    enableWalletUpdates = true,
    enableOfferUpdates = true,
  } = options;

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isConnectedRef = useRef(false);

  /**
   * Connect to socket
   */
  const connect = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('[useSocket] Not authenticated, skipping connection');
      return;
    }

    console.log('[useSocket] Connecting...');
    await socketClient.connect();
    isConnectedRef.current = true;
    dispatch(setOnlineStatus(true));
  }, [isAuthenticated, dispatch]);

  /**
   * Disconnect from socket
   */
  const disconnect = useCallback(() => {
    console.log('[useSocket] Disconnecting...');
    socketClient.disconnect();
    isConnectedRef.current = false;
    dispatch(setOnlineStatus(false));
  }, [dispatch]);

  /**
   * Join a trade room for real-time updates
   */
  const joinTradeRoom = useCallback((tradeId: string) => {
    console.log('[useSocket] Joining trade room:', tradeId);
    socketClient.joinRoom(`trade:${tradeId}`);
  }, []);

  /**
   * Leave a trade room
   */
  const leaveTradeRoom = useCallback((tradeId: string) => {
    console.log('[useSocket] Leaving trade room:', tradeId);
    socketClient.leaveRoom(`trade:${tradeId}`);
  }, []);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Trade update handler
    const handleTradeUpdate = (data: { tradeId: string; trade: unknown }) => {
      if (!enableTradeUpdates) return;

      console.log('[useSocket] Trade update received:', data.tradeId);
      queryClient.setQueryData(tradeKeys.detail(data.tradeId), data.trade);
      queryClient.invalidateQueries({ queryKey: tradeKeys.active() });
    };

    // Trade message handler
    const handleTradeMessage = (data: { tradeId: string; message: unknown }) => {
      if (!enableTradeUpdates) return;

      console.log('[useSocket] Trade message received:', data.tradeId);
      queryClient.invalidateQueries({
        queryKey: tradeKeys.messages(data.tradeId),
      });
    };

    // Wallet update handler
    const handleWalletUpdate = () => {
      if (!enableWalletUpdates) return;

      console.log('[useSocket] Wallet update received');
      queryClient.invalidateQueries({ queryKey: walletKeys.balance() });
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() });
    };

    // Offer update handler
    const handleOfferUpdate = (data: { offerId: string }) => {
      if (!enableOfferUpdates) return;

      console.log('[useSocket] Offer update received:', data.offerId);
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(data.offerId) });
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    };

    // Subscribe to events
    socketClient.subscribe('trade:status', handleTradeUpdate);
    socketClient.subscribe('trade:message', handleTradeMessage);
    socketClient.subscribe('price:update', handleWalletUpdate);
    socketClient.subscribe('offer:update', handleOfferUpdate);

    // Auto-connect if enabled
    if (autoConnect && !isConnectedRef.current) {
      connect();
    }

    // Cleanup
    return () => {
      socketClient.unsubscribe('trade:status');
      socketClient.unsubscribe('trade:message');
      socketClient.unsubscribe('price:update');
      socketClient.unsubscribe('offer:update');
    };
  }, [
    isAuthenticated,
    autoConnect,
    enableTradeUpdates,
    enableWalletUpdates,
    enableOfferUpdates,
    connect,
    queryClient,
  ]);

  // Disconnect on unmount or auth change
  useEffect(() => {
    return () => {
      if (isConnectedRef.current) {
        disconnect();
      }
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    joinTradeRoom,
    leaveTradeRoom,
    isConnected: socketClient.isConnected(),
  };
}

export default useSocket;
