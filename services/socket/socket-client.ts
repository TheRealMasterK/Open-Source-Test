/**
 * Socket Client
 * Manages WebSocket connections for real-time features
 */

import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/config/api.config';
import { getToken } from '../api/token-manager';

let socket: Socket | null = null;

export type SocketEvent =
  | 'offer:new'
  | 'offer:update'
  | 'offer:delete'
  | 'trade:status'
  | 'trade:message'
  | 'escrow:update'
  | 'price:update'
  | 'user:online'
  | 'user:offline';

interface SocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onReconnect?: (attemptNumber: number) => void;
}

/**
 * Connect to WebSocket server
 */
export async function connect(callbacks?: SocketCallbacks): Promise<Socket> {
  console.log('[Socket] connect: Connecting to', API_CONFIG.SOCKET_URL);

  if (socket?.connected) {
    console.log('[Socket] connect: Already connected');
    return socket;
  }

  const token = await getToken();

  socket = io(API_CONFIG.SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('[Socket] Connected successfully, ID:', socket?.id);
    callbacks?.onConnect?.();
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
    callbacks?.onDisconnect?.(reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
    callbacks?.onError?.(error);
  });

  socket.io.on('reconnect', (attemptNumber) => {
    console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
    callbacks?.onReconnect?.(attemptNumber);
  });

  socket.io.on('reconnect_attempt', (attemptNumber) => {
    console.log('[Socket] Reconnection attempt', attemptNumber);
  });

  socket.io.on('reconnect_failed', () => {
    console.error('[Socket] Reconnection failed');
  });

  return socket;
}

/**
 * Disconnect from WebSocket server
 */
export function disconnect(): void {
  console.log('[Socket] disconnect: Disconnecting');

  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] disconnect: Disconnected');
  }
}

/**
 * Check if connected
 */
export function isConnected(): boolean {
  return socket?.connected ?? false;
}

/**
 * Get socket instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Subscribe to an event
 */
export function subscribe<T = unknown>(
  event: SocketEvent | string,
  callback: (data: T) => void
): void {
  console.log('[Socket] subscribe: Subscribing to', event);

  if (!socket) {
    console.warn('[Socket] subscribe: Not connected, cannot subscribe');
    return;
  }

  socket.on(event, callback);
}

/**
 * Unsubscribe from an event
 */
export function unsubscribe(event: SocketEvent | string): void {
  console.log('[Socket] unsubscribe: Unsubscribing from', event);

  if (!socket) {
    return;
  }

  socket.off(event);
}

/**
 * Emit an event
 */
export function emit<T = unknown>(event: string, data?: T): void {
  console.log('[Socket] emit:', event, data);

  if (!socket?.connected) {
    console.warn('[Socket] emit: Not connected, cannot emit');
    return;
  }

  socket.emit(event, data);
}

/**
 * Join a room (e.g., trade chat room)
 */
export function joinRoom(room: string): void {
  console.log('[Socket] joinRoom:', room);
  emit('join:room', { room });
}

/**
 * Leave a room
 */
export function leaveRoom(room: string): void {
  console.log('[Socket] leaveRoom:', room);
  emit('leave:room', { room });
}

export default {
  connect,
  disconnect,
  isConnected,
  getSocket,
  subscribe,
  unsubscribe,
  emit,
  joinRoom,
  leaveRoom,
};
