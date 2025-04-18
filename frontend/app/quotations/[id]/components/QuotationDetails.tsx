'use client';

import { FileText, Calendar, Clock } from 'lucide-react';
import { Quotation } from '../../../lib/types/quotation.types';
import { formatCurrency, formatDate } from '../../../lib/utils/formatters';

/**
 * Propiedades para el componente QuotationDetails
 */
interface QuotationDetailsProps {
  /**
   * Datos de la cotización a mostrar
   */
  quotation: Quotation;
}

/**
 * Componente que muestra los detalles principales de una cotización
 * @param props - Propiedades del componente
 * @returns Componente React
 */
export default function QuotationDetails({ quotation }: QuotationDetailsProps) {
  return (
    <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">Quotation Details</h2>
          <p className="text-gray-500 flex items-center mt-1">
            <FileText className="h-4 w-4 mr-1" />
            ID: {quotation.id}
          </p>
        </div>
        <div className="text-right">
          <div className="font-semibold text-lg">
            {formatCurrency(quotation.total)}
          </div>
          <div className="text-sm text-gray-500">Total Amount</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Issue Date:</span>
          </div>
          <div className="text-sm ml-5">{formatDate(quotation.date)}</div>
        </div>
        <div>
          <div className="flex items-center mb-1">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Due Date:</span>
          </div>
          <div className="text-sm ml-5">{formatDate(quotation.validUntil)}</div>
        </div>
      </div>

      <h3 className="font-semibold text-lg border-b pb-2 mb-4">Items</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotation.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.description || '-'}
                    </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-medium">{formatCurrency(quotation.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tax ({quotation.tax}%):</span>
            <span className="text-sm font-medium">
              {formatCurrency(quotation.subtotal * (quotation.tax / 100))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Discount ({quotation.discount}%):</span>
            <span className="text-sm font-medium">
              {formatCurrency(quotation.subtotal * (quotation.discount ?? 0 / 100))}
            </span>
          </div>
          <div className="flex justify-between border-t border-b py-2">
            <span className="font-bold">Total:</span>
            <span className="font-bold">{formatCurrency(quotation.total)}</span>
          </div>
        </div>
      </div>

      {quotation.notes && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">{quotation.notes}</p>
        </div>
      )}

      {quotation.terms && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">{quotation.terms}</p>
        </div>
      )}
    </div>
  );
}
