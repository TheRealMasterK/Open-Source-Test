/**
 * useRefresh Hook
 * Custom hook for pull-to-refresh functionality
 */

import { useState, useCallback } from 'react';

interface UseRefreshOptions {
  onRefresh: () => Promise<void> | void;
  minRefreshTime?: number; // Minimum time to show refresh indicator
}

interface UseRefreshReturn {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

export function useRefresh(options: UseRefreshOptions): UseRefreshReturn {
  const { onRefresh: refreshCallback, minRefreshTime = 500 } = options;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('[useRefresh] Starting refresh...');
    setRefreshing(true);

    const startTime = Date.now();

    try {
      await refreshCallback();
    } catch (error) {
      console.error('[useRefresh] Error during refresh:', error);
    }

    // Ensure minimum refresh time for better UX
    const elapsed = Date.now() - startTime;
    if (elapsed < minRefreshTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minRefreshTime - elapsed)
      );
    }

    setRefreshing(false);
    console.log('[useRefresh] Refresh complete');
  }, [refreshCallback, minRefreshTime]);

  return {
    refreshing,
    onRefresh,
  };
}

/**
 * Hook for combining multiple refresh callbacks
 */
export function useMultiRefresh(
  refreshCallbacks: Array<() => Promise<void> | void>,
  options?: { minRefreshTime?: number }
): UseRefreshReturn {
  const { minRefreshTime = 500 } = options || {};

  const combinedRefresh = useCallback(async () => {
    console.log('[useMultiRefresh] Starting refresh with', refreshCallbacks.length, 'callbacks');
    await Promise.all(refreshCallbacks.map((cb) => cb()));
  }, [refreshCallbacks]);

  return useRefresh({
    onRefresh: combinedRefresh,
    minRefreshTime,
  });
}

export default useRefresh;
