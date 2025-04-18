'use client';

import { useRouter } from 'next/navigation';
import { useQuotationStore } from '../../lib/store/quotationStore';
import { QuotationData } from '../../lib/types/quotation.types';
import QuotationForm from './components/QuotationForm';

/**
 * Página para crear una nueva cotización
 * @returns Componente React
 */
export default function NewQuotationPage() {
  const router = useRouter();
  const { createQuotation, loading, error, clearError } = useQuotationStore();

  /**
   * Lista de ejemplo de clientes
   */
  const clients = [
    { id: '1', name: 'Example Client 1' },
    { id: '2', name: 'Example Client 2' },
  ];

  /**
   * Maneja la creación de una nueva cotización
   * @param data - Datos de la cotización a crear
   */
  const handleSubmit = async (data: QuotationData) => {
    try {
      await createQuotation(data);
      router.push('/quotations');
    } catch (err) {
      console.error('Error creating quotation:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <QuotationForm
        clients={clients}
        loading={loading}
        error={error}
        clearError={clearError}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
