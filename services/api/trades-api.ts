/**
 * Trades API Service
 * Handles trade-related API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, post, patch } from './http-client';
import {
  Trade,
  CreateTradePayload,
  TradeMessage,
  SendMessagePayload,
  TradeListParams,
  TradeStatus,
  PaginatedResponse,
} from '@/types';

/**
 * Create a new trade
 */
export async function createTrade(payload: CreateTradePayload): Promise<Trade> {
  console.log('[TradesAPI] createTrade: Creating trade for offer', payload.offerId);

  try {
    const response = await post<Trade>(API_ENDPOINTS.TRADES.BASE, payload);

    if (response.success && response.data) {
      console.log('[TradesAPI] createTrade: Success, ID:', response.data.id);
      return response.data;
    }

    throw new Error(response.message || 'Failed to create trade');
  } catch (error) {
    console.error('[TradesAPI] createTrade: Error', error);
    throw error;
  }
}

/**
 * Get all trades with optional filters
 */
export async function getTrades(params?: TradeListParams): Promise<PaginatedResponse<Trade>> {
  console.log('[TradesAPI] getTrades: Fetching trades with params:', params);

  try {
    const response = await get<PaginatedResponse<Trade>>(API_ENDPOINTS.TRADES.BASE, { params });

    if (response.success && response.data) {
      console.log('[TradesAPI] getTrades: Found', response.data.data.length, 'trades');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch trades');
  } catch (error) {
    console.error('[TradesAPI] getTrades: Error', error);
    throw error;
  }
}

/**
 * Get active trades
 */
export async function getActiveTrades(): Promise<Trade[]> {
  console.log('[TradesAPI] getActiveTrades: Fetching active trades');

  try {
    const response = await get<Trade[]>(API_ENDPOINTS.TRADES.ACTIVE);

    if (response.success && response.data) {
      console.log('[TradesAPI] getActiveTrades: Found', response.data.length, 'trades');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch active trades');
  } catch (error) {
    console.error('[TradesAPI] getActiveTrades: Error', error);
    throw error;
  }
}

/**
 * Get completed trades
 */
export async function getCompletedTrades(): Promise<Trade[]> {
  console.log('[TradesAPI] getCompletedTrades: Fetching completed trades');

  try {
    const response = await get<Trade[]>(API_ENDPOINTS.TRADES.COMPLETED);

    if (response.success && response.data) {
      console.log('[TradesAPI] getCompletedTrades: Found', response.data.length, 'trades');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch completed trades');
  } catch (error) {
    console.error('[TradesAPI] getCompletedTrades: Error', error);
    throw error;
  }
}

/**
 * Get a single trade by ID
 */
export async function getTrade(tradeId: string): Promise<Trade> {
  console.log('[TradesAPI] getTrade: Fetching trade', tradeId);

  try {
    const response = await get<Trade>(API_ENDPOINTS.TRADES.BY_ID(tradeId));

    if (response.success && response.data) {
      console.log('[TradesAPI] getTrade: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch trade');
  } catch (error) {
    console.error('[TradesAPI] getTrade: Error', error);
    throw error;
  }
}

/**
 * Update trade status
 */
export async function updateTradeStatus(tradeId: string, status: TradeStatus): Promise<Trade> {
  console.log('[TradesAPI] updateTradeStatus: Updating trade', tradeId, 'to', status);

  try {
    const response = await patch<Trade>(API_ENDPOINTS.TRADES.STATUS(tradeId), {
      status,
    });

    if (response.success && response.data) {
      console.log('[TradesAPI] updateTradeStatus: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to update trade status');
  } catch (error) {
    console.error('[TradesAPI] updateTradeStatus: Error', error);
    throw error;
  }
}

/**
 * Send message in trade chat
 */
export async function sendMessage(
  tradeId: string,
  payload: SendMessagePayload
): Promise<TradeMessage> {
  console.log('[TradesAPI] sendMessage: Sending message for trade', tradeId);

  try {
    const response = await post<TradeMessage>(API_ENDPOINTS.TRADES.MESSAGES(tradeId), payload);

    if (response.success && response.data) {
      console.log('[TradesAPI] sendMessage: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to send message');
  } catch (error) {
    console.error('[TradesAPI] sendMessage: Error', error);
    throw error;
  }
}

/**
 * Get trade messages
 */
export async function getMessages(tradeId: string): Promise<TradeMessage[]> {
  console.log('[TradesAPI] getMessages: Fetching messages for trade', tradeId);

  try {
    const response = await get<TradeMessage[]>(API_ENDPOINTS.TRADES.MESSAGES(tradeId));

    if (response.success && response.data) {
      console.log('[TradesAPI] getMessages: Found', response.data.length, 'messages');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch messages');
  } catch (error) {
    console.error('[TradesAPI] getMessages: Error', error);
    throw error;
  }
}

export default {
  createTrade,
  getTrades,
  getActiveTrades,
  getCompletedTrades,
  getTrade,
  updateTradeStatus,
  sendMessage,
  getMessages,
};
