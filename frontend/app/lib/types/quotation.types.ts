/**
 * Quotation-related type definitions
 */

/**
 * Posibles valores para el estado de una cotización
 */
export type QuotationStatusValue = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

/**
 * Representa un elemento/item en una cotización
 */
export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Información del cliente asociado a una cotización
 */
export interface ClientInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

/**
 * Representa una cotización completa
 */
export interface Quotation {
  id: string;
  title: string;
  number: string;
  status: QuotationStatusValue;
  date: string;
  validUntil: string;
  client: ClientInfo;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationData {
  title: string;
  clientId: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  terms?: string;
  items: Omit<QuotationItem, 'id' | 'quotationId'>[];
}

export interface QuotationItemData {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

export interface ClientData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface QuotationState {
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchQuotations: () => Promise<void>;
  getQuotation: (id: string) => Promise<void>;
  createQuotation: (data: Partial<Quotation>) => Promise<void>;
  updateQuotation: (id: string, data: Partial<Quotation>) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
}
