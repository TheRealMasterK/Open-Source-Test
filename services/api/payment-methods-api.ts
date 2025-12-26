/**
 * Payment Methods API Service
 * Handles payment method management API calls
 */

import { API_ENDPOINTS } from '@/config/api.config';
import { get, post, put, del } from './http-client';
import { PaymentMethod, CreatePaymentMethodPayload, UpdatePaymentMethodPayload } from '@/types';

/**
 * Get all payment methods
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  console.log('[PaymentMethodsAPI] getPaymentMethods: Fetching payment methods');

  try {
    const response = await get<PaymentMethod[]>(API_ENDPOINTS.PAYMENT_METHODS.BASE);

    if (response.success && response.data) {
      console.log('[PaymentMethodsAPI] getPaymentMethods: Found', response.data.length, 'methods');
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch payment methods');
  } catch (error) {
    console.error('[PaymentMethodsAPI] getPaymentMethods: Error', error);
    throw error;
  }
}

/**
 * Create payment method
 */
export async function createPaymentMethod(
  payload: CreatePaymentMethodPayload
): Promise<PaymentMethod> {
  console.log('[PaymentMethodsAPI] createPaymentMethod: Creating', payload.type, 'method');

  try {
    const response = await post<PaymentMethod>(API_ENDPOINTS.PAYMENT_METHODS.BASE, payload);

    if (response.success && response.data) {
      console.log('[PaymentMethodsAPI] createPaymentMethod: Success, ID:', response.data.id);
      return response.data;
    }

    throw new Error(response.message || 'Failed to create payment method');
  } catch (error) {
    console.error('[PaymentMethodsAPI] createPaymentMethod: Error', error);
    throw error;
  }
}

/**
 * Update payment method
 */
export async function updatePaymentMethod(
  id: string,
  payload: UpdatePaymentMethodPayload
): Promise<PaymentMethod> {
  console.log('[PaymentMethodsAPI] updatePaymentMethod: Updating method', id);

  try {
    const response = await put<PaymentMethod>(API_ENDPOINTS.PAYMENT_METHODS.BY_ID(id), payload);

    if (response.success && response.data) {
      console.log('[PaymentMethodsAPI] updatePaymentMethod: Success');
      return response.data;
    }

    throw new Error(response.message || 'Failed to update payment method');
  } catch (error) {
    console.error('[PaymentMethodsAPI] updatePaymentMethod: Error', error);
    throw error;
  }
}

/**
 * Delete payment method
 */
export async function deletePaymentMethod(id: string): Promise<void> {
  console.log('[PaymentMethodsAPI] deletePaymentMethod: Deleting method', id);

  try {
    const response = await del<void>(API_ENDPOINTS.PAYMENT_METHODS.BY_ID(id));

    if (response.success) {
      console.log('[PaymentMethodsAPI] deletePaymentMethod: Success');
      return;
    }

    throw new Error(response.message || 'Failed to delete payment method');
  } catch (error) {
    console.error('[PaymentMethodsAPI] deletePaymentMethod: Error', error);
    throw error;
  }
}

export default {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
