'use client';

import { CreditCard } from 'lucide-react';
import { Quotation } from '../../../lib/types/quotation.types';

/**
 * Propiedades para el componente ClientInfo
 */
interface ClientInfoProps {
  /**
   * Cotización con los datos del cliente
   */
  quotation: Quotation;
}

/**
 * Componente que muestra la información del cliente asociado a una cotización
 * @param props - Propiedades del componente
 * @returns Componente React
 */
export default function ClientInfo({ quotation }: ClientInfoProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Client Information</h2>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-1">Name</h3>
        <p className="text-sm">{quotation.client.name}</p>
      </div>

      {/* Additional client information would go here */}

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Information</h3>
        <div className="flex items-center space-x-2 text-sm mb-1">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <span>Payment Status:</span>
          <span className="font-medium">
            {quotation.status === 'approved' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
}
