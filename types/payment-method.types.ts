/**
 * Payment Method Types
 */

export type PaymentMethodType = 'bank' | 'ewallet' | 'crypto' | 'mobile_money';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  name: string;
  details: PaymentMethodDetails;
  isDefault: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethodDetails =
  | BankDetails
  | EWalletDetails
  | CryptoDetails
  | MobileMoneyDetails;

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branchCode?: string;
  swiftCode?: string;
  iban?: string;
}

export interface EWalletDetails {
  provider: string;
  walletId: string;
  email?: string;
  phone?: string;
}

export interface CryptoDetails {
  currency: string;
  network: string;
  address: string;
}

export interface MobileMoneyDetails {
  provider: string;
  mobileNumber: string;
  accountName: string;
}

export interface CreatePaymentMethodPayload {
  type: PaymentMethodType;
  name: string;
  details: PaymentMethodDetails;
  isDefault?: boolean;
}

export interface UpdatePaymentMethodPayload {
  name?: string;
  details?: Partial<PaymentMethodDetails>;
  isDefault?: boolean;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  bank: 'Bank Transfer',
  ewallet: 'E-Wallet',
  crypto: 'Crypto Wallet',
  mobile_money: 'Mobile Money',
};

export const PAYMENT_PROVIDERS: Record<PaymentMethodType, string[]> = {
  bank: ['Standard Bank', 'FNB', 'Nedbank', 'Absa', 'Capitec', 'Other'],
  ewallet: ['PayPal', 'Skrill', 'Wise', 'Neteller', 'Payoneer', 'Other'],
  crypto: ['USDT', 'BTC', 'ETH'],
  mobile_money: ['MTN', 'Vodafone', 'Airtel', 'M-Pesa', 'Other'],
};
