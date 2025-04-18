'use client';

import { Trash2 } from 'lucide-react';
import { QuotationItem } from '../../../lib/types/quotation.types';
import { formatCurrency } from '../../../lib/utils/formatters';

/**
 * Propiedades para el componente ItemsTable
 */
interface ItemsTableProps {
  /**
   * Items de la cotización a mostrar
   */
  items: QuotationItem[];
  /**
   * Función para eliminar un item de la cotización
   * @param index - Índice del item a eliminar
   */
  onRemoveItem: (index: number) => void;
}

/**
 * Componente que muestra una tabla con los items de una cotización
 * @param props - Propiedades del componente
 * @returns Componente React
 */
export default function ItemsTable({ items, onRemoveItem }: ItemsTableProps) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
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
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No items added yet. Use the form below to add items.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
