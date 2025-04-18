'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Pencil, Trash2 } from 'lucide-react';
import { Quotation, QuotationStatusValue } from '../../../lib/types/quotation.types';

/**
 * Props para el componente QuotationHeader
 */
interface QuotationHeaderProps {
  /**
   * ID de la cotización
   */
  id: string;
  /**
   * Datos de la cotización
   */
  quotation: Quotation;
  /**
   * Función para obtener la clase CSS del badge de estado
   * @param status - Estado de la cotización
   */
  getStatusBadgeClass: (status: QuotationStatusValue) => string;
  /**
   * Función para mostrar el modal de eliminación
   */
  onShowDeleteModal: () => void;
}

/**
 * Componente que muestra el encabezado de una cotización con acciones
 * @param props - Props del componente
 * @returns Componente React
 */
export default function QuotationHeader({
  id,
  quotation,
  getStatusBadgeClass,
  onShowDeleteModal
}: QuotationHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Link href="/quotations" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-2xl font-bold">{quotation.title}</h1>
        <span className={`ml-4 ${getStatusBadgeClass(quotation.status)}`}>
          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => window.print()}
          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-colors"
        >
          <Download className="h-4 w-4 mr-1" />
          <span>Download</span>
        </button>
        <Link
          href={`/quotations/${id}/edit`}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors"
        >
          <Pencil className="h-4 w-4 mr-1" />
          <span>Edit</span>
        </Link>
        <button
          onClick={onShowDeleteModal}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
