import { create } from 'zustand';
import { Quotation, QuotationData } from '../types/quotation.types';
import * as api from '../services/api';

interface QuotationState {
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchQuotations: () => Promise<void>;
  getQuotation: (id: string) => Promise<void>;
  createQuotation: (data: QuotationData) => Promise<void>;
  updateQuotation: (id: string, data: Partial<QuotationData>) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useQuotationStore = create<QuotationState>((set, get) => ({
  quotations: [],
  currentQuotation: null,
  loading: false,
  error: null,

  fetchQuotations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.getQuotations();
      if (response.data) {
        set({ quotations: response.data });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch quotations' });
    } finally {
      set({ loading: false });
    }
  },

  getQuotation: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.getQuotation(id);
      if (response.data) {
        set({ currentQuotation: response.data });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch quotation' });
    } finally {
      set({ loading: false });
    }
  },

  createQuotation: async (data: QuotationData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.createQuotation(data);
      if (response.data) {
        set((state) => ({
          quotations: [...state.quotations, response.data],
          currentQuotation: response.data
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create quotation' });
    } finally {
      set({ loading: false });
    }
  },

  updateQuotation: async (id: string, data: Partial<QuotationData>) => {
    try {
      set({ loading: true, error: null });
      const response = await api.updateQuotation(id, data);
      if (response.data) {
        set((state) => ({
          quotations: state.quotations.map((quotation) =>
            quotation.id === id ? response.data : quotation
          ),
          currentQuotation: state.currentQuotation?.id === id
            ? response.data
            : state.currentQuotation
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update quotation' });
    } finally {
      set({ loading: false });
    }
  },

  deleteQuotation: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await api.deleteQuotation(id);
      set((state) => ({
        quotations: state.quotations.filter((quotation) => quotation.id !== id),
        currentQuotation: state.currentQuotation?.id === id
          ? null
          : state.currentQuotation
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete quotation' });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null })
}));
