'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuotationStore } from '../../lib/store/quotationStore';
import { QuotationStatusValue } from '../../lib/types/quotation.types';

import QuotationHeader from './components/QuotationHeader';
import QuotationDetails from './components/QuotationDetails';
import ClientInfo from './components/ClientInfo';
import DeleteModal from './components/DeleteModal';

/**
 * Página de detalle de una cotización
 * @returns Componente React
 */
export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getQuotation, currentQuotation, loading, error, deleteQuotation } = useQuotationStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * ID de la cotización obtenido de los parámetros de la URL
   */
  const id = params?.id as string;

  /**
   * Cargar los datos de la cotización al montar el componente
   */
  useEffect(() => {
    if (id) {
      getQuotation(id);
    }
  }, [id, getQuotation]);

  /**
   * Maneja la eliminación de la cotización
   */
  const handleDelete = async () => {
    try {
      await deleteQuotation(id);
      router.push('/quotations');
    } catch (err) {
      console.error('Error deleting quotation:', err);
    }
  };

  /**
   * Obtiene la clase CSS para el badge de estado
   * @param status - Estado de la cotización
   * @returns Clase CSS para el badge
   */
  const getStatusBadgeClass = (status: QuotationStatusValue) => {
    const baseClass = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'draft':
        return `${baseClass} bg-gray-200 text-gray-800`;
      case 'sent':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'approved':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
          <a href="/quotations" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Quotations
          </a>
        </div>
      </div>
    );
  }

  // No se encontró la cotización
  if (!currentQuotation) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p>Quotation not found</p>
          <a href="/quotations" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Quotations
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <QuotationHeader
        id={id}
        quotation={currentQuotation}
        getStatusBadgeClass={getStatusBadgeClass}
        onShowDeleteModal={() => setShowDeleteModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <QuotationDetails quotation={currentQuotation} />
        <ClientInfo quotation={currentQuotation} />
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
