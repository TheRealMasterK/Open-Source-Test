/**
 * useCopyToClipboard Hook
 * Custom hook for copying text to clipboard with feedback
 */

import { useState, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';

interface UseCopyToClipboardOptions {
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  resetDelay?: number;
}

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const {
    showToast = true,
    successMessage = 'Copied to clipboard',
    errorMessage = 'Failed to copy',
    resetDelay = 2000,
  } = options;

  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();

  /**
   * Reset copied state
   */
  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  /**
   * Copy text to clipboard
   */
  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) {
        console.warn('[useCopyToClipboard] No text provided');
        return false;
      }

      try {
        console.log('[useCopyToClipboard] Copying text...');
        await Clipboard.setStringAsync(text);
        setCopied(true);

        if (showToast) {
          dispatch(
            addToast({
              type: 'success',
              message: successMessage,
            })
          );
        }

        // Auto-reset after delay
        if (resetDelay > 0) {
          setTimeout(() => {
            setCopied(false);
          }, resetDelay);
        }

        console.log('[useCopyToClipboard] Text copied successfully');
        return true;
      } catch (error) {
        console.error('[useCopyToClipboard] Error copying text:', error);

        if (showToast) {
          dispatch(
            addToast({
              type: 'error',
              message: errorMessage,
            })
          );
        }

        return false;
      }
    },
    [showToast, successMessage, errorMessage, resetDelay, dispatch]
  );

  return {
    copied,
    copy,
    reset,
  };
}

/**
 * Simple hook variant that just copies without state tracking
 */
export function useCopyText() {
  const dispatch = useAppDispatch();

  return useCallback(
    async (text: string, message?: string): Promise<boolean> => {
      try {
        await Clipboard.setStringAsync(text);
        dispatch(
          addToast({
            type: 'success',
            message: message || 'Copied!',
          })
        );
        return true;
      } catch (error) {
        console.error('[useCopyText] Error:', error);
        dispatch(
          addToast({
            type: 'error',
            message: 'Failed to copy',
          })
        );
        return false;
      }
    },
    [dispatch]
  );
}

export default useCopyToClipboard;
