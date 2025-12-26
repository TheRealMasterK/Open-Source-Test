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
 * Extract trades array from various backend response structures
 * Backend may return: { trades: [...] }, { data: [...] }, or [...]
 */
function extractTradesArray(data: unknown): Trade[] {
  if (!data) {
    console.log('[TradesAPI] extractTradesArray: No data provided');
    return [];
  }

  // Log the structure for debugging
  const dataObj = data as Record<string, unknown>;
  console.log('[TradesAPI] Response structure:', {
    isArray: Array.isArray(data),
    keys: typeof data === 'object' && data !== null ? Object.keys(data) : [],
    hasTrades: 'trades' in dataObj,
    hasData: 'data' in dataObj,
  });

  // Direct array
  if (Array.isArray(data)) {
    console.log('[TradesAPI] Found direct array with', data.length, 'trades');
    return data as Trade[];
  }

  // Check for { trades: [...] }
  if (dataObj.trades && Array.isArray(dataObj.trades)) {
    console.log('[TradesAPI] Found trades in data.trades with', (dataObj.trades as Trade[]).length, 'trades');
    return dataObj.trades as Trade[];
  }

  // Check for { data: [...] }
  if (dataObj.data && Array.isArray(dataObj.data)) {
    console.log('[TradesAPI] Found trades in data.data with', (dataObj.data as Trade[]).length, 'trades');
    return dataObj.data as Trade[];
  }

  // Check for { data: { trades: [...] } }
  if (dataObj.data && typeof dataObj.data === 'object') {
    const innerData = dataObj.data as Record<string, unknown>;
    if (innerData.trades && Array.isArray(innerData.trades)) {
      console.log('[TradesAPI] Found trades in data.data.trades with', (innerData.trades as Trade[]).length, 'trades');
      return innerData.trades as Trade[];
    }
  }

  console.warn('[TradesAPI] Could not extract trades array from response');
  return [];
}

/**
 * Extract single trade from response
 */
function extractTrade(data: unknown): Trade | null {
  if (!data) {
    console.log('[TradesAPI] extractTrade: No data provided');
    return null;
  }

  const dataObj = data as Record<string, unknown>;
  console.log('[TradesAPI] Trade response structure:', {
    keys: typeof data === 'object' && data !== null ? Object.keys(data) : [],
    hasTrade: 'trade' in dataObj,
    hasId: 'id' in dataObj,
  });

  // Direct trade object with id
  if (dataObj.id) {
    console.log('[TradesAPI] Found direct trade object with ID:', dataObj.id);
    return data as Trade;
  }

  // Check for { trade: {...} }
  if (dataObj.trade && typeof dataObj.trade === 'object') {
    const trade = dataObj.trade as Trade;
    console.log('[TradesAPI] Found trade in data.trade with ID:', trade.id);
    return trade;
  }

  // Check for { data: {...} } with trade properties
  if (dataObj.data && typeof dataObj.data === 'object') {
    const innerData = dataObj.data as Record<string, unknown>;
    if (innerData.id) {
      console.log('[TradesAPI] Found trade in data.data with ID:', innerData.id);
      return innerData as unknown as Trade;
    }
    if (innerData.trade && typeof innerData.trade === 'object') {
      const trade = innerData.trade as unknown as Trade;
      console.log('[TradesAPI] Found trade in data.data.trade with ID:', trade.id);
      return trade;
    }
  }

  console.warn('[TradesAPI] Could not extract trade from response');
  return null;
}

/**
 * Create a new trade
 */
export async function createTrade(payload: CreateTradePayload): Promise<Trade> {
  console.log('[TradesAPI] createTrade: Creating trade for offer', payload.offerId);

  try {
    const response = await post<Record<string, unknown>>(API_ENDPOINTS.TRADES.BASE, payload);

    if (response.success && response.data) {
      const trade = extractTrade(response.data);
      if (trade) {
        console.log('[TradesAPI] createTrade: Success, ID:', trade.id);
        return trade;
      }
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
    const response = await get<Record<string, unknown>>(API_ENDPOINTS.TRADES.BASE, { params });

    if (response.success && response.data) {
      const trades = extractTradesArray(response.data);
      console.log('[TradesAPI] getTrades: Found', trades.length, 'trades');

      // Return in PaginatedResponse format
      const dataObj = response.data as Record<string, unknown>;
      return {
        data: trades,
        pagination: (dataObj.pagination as PaginatedResponse<Trade>['pagination']) || {
          page: 1,
          limit: trades.length,
          total: trades.length,
          totalPages: 1,
        },
      };
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
    const response = await get<Record<string, unknown>>(API_ENDPOINTS.TRADES.ACTIVE);

    if (response.success && response.data) {
      const trades = extractTradesArray(response.data);
      console.log('[TradesAPI] getActiveTrades: Found', trades.length, 'trades');
      return trades;
    }

    // Return empty array instead of throwing for "no trades" case
    console.log('[TradesAPI] getActiveTrades: No active trades found');
    return [];
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
    const response = await get<Record<string, unknown>>(API_ENDPOINTS.TRADES.COMPLETED);

    if (response.success && response.data) {
      const trades = extractTradesArray(response.data);
      console.log('[TradesAPI] getCompletedTrades: Found', trades.length, 'trades');
      return trades;
    }

    // Return empty array instead of throwing for "no trades" case
    console.log('[TradesAPI] getCompletedTrades: No completed trades found');
    return [];
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
    const response = await get<Record<string, unknown>>(API_ENDPOINTS.TRADES.BY_ID(tradeId));

    if (response.success && response.data) {
      const trade = extractTrade(response.data);
      if (trade) {
        console.log('[TradesAPI] getTrade: Success, ID:', trade.id);
        return trade;
      }
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
    const response = await patch<Record<string, unknown>>(API_ENDPOINTS.TRADES.STATUS(tradeId), {
      status,
    });

    if (response.success && response.data) {
      const trade = extractTrade(response.data);
      if (trade) {
        console.log('[TradesAPI] updateTradeStatus: Success, ID:', trade.id);
        return trade;
      }
    }

    throw new Error(response.message || 'Failed to update trade status');
  } catch (error) {
    console.error('[TradesAPI] updateTradeStatus: Error', error);
    throw error;
  }
}

/**
 * Extract messages array from response
 */
function extractMessagesArray(data: unknown): TradeMessage[] {
  if (!data) {
    console.log('[TradesAPI] extractMessagesArray: No data provided');
    return [];
  }

  const dataObj = data as Record<string, unknown>;

  // Direct array
  if (Array.isArray(data)) {
    console.log('[TradesAPI] Found direct messages array with', data.length, 'messages');
    return data as TradeMessage[];
  }

  // Check for { messages: [...] }
  if (dataObj.messages && Array.isArray(dataObj.messages)) {
    console.log('[TradesAPI] Found messages in data.messages with', (dataObj.messages as TradeMessage[]).length, 'messages');
    return dataObj.messages as TradeMessage[];
  }

  // Check for { data: [...] }
  if (dataObj.data && Array.isArray(dataObj.data)) {
    console.log('[TradesAPI] Found messages in data.data with', (dataObj.data as TradeMessage[]).length, 'messages');
    return dataObj.data as TradeMessage[];
  }

  console.warn('[TradesAPI] Could not extract messages array from response');
  return [];
}

/**
 * Extract single message from response
 */
function extractMessage(data: unknown): TradeMessage | null {
  if (!data) return null;

  const dataObj = data as Record<string, unknown>;

  // Direct message with id
  if (dataObj.id) {
    return data as TradeMessage;
  }

  // Check for { message: {...} }
  if (dataObj.message && typeof dataObj.message === 'object') {
    return dataObj.message as TradeMessage;
  }

  // Check for { data: {...} }
  if (dataObj.data && typeof dataObj.data === 'object') {
    const innerData = dataObj.data as Record<string, unknown>;
    if (innerData.id) {
      return innerData as unknown as TradeMessage;
    }
  }

  return null;
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
    const response = await post<Record<string, unknown>>(API_ENDPOINTS.TRADES.MESSAGES(tradeId), payload);

    if (response.success && response.data) {
      const message = extractMessage(response.data);
      if (message) {
        console.log('[TradesAPI] sendMessage: Success, ID:', message.id);
        return message;
      }
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
    const response = await get<Record<string, unknown>>(API_ENDPOINTS.TRADES.MESSAGES(tradeId));

    if (response.success && response.data) {
      const messages = extractMessagesArray(response.data);
      console.log('[TradesAPI] getMessages: Found', messages.length, 'messages');
      return messages;
    }

    // Return empty array for no messages
    console.log('[TradesAPI] getMessages: No messages found');
    return [];
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
