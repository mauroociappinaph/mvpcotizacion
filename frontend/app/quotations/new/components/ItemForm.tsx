'use client';

import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { QuotationItem } from '../../../lib/types/quotation.types';

/**
 * Propiedades para el componente ItemForm
 */
interface ItemFormProps {
  /**
   * Función para agregar un nuevo item a la cotización
   * @param item - El item a agregar
   */
  onAddItem: (item: Omit<QuotationItem, 'id' | 'quotationId'>) => void;
}

/**
 * Componente para agregar nuevos items a una cotización
 * @param props - Propiedades del componente
 * @returns Componente React
 */
export default function ItemForm({ onAddItem }: ItemFormProps) {
  /**
   * Estado del formulario de nuevo item
   */
  const [newItem, setNewItem] = useState<Omit<QuotationItem, 'id' | 'quotationId'>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  /**
   * Calcula el total del item cuando cambia la cantidad o el precio unitario
   */
  useEffect(() => {
    setNewItem(prev => ({
      ...prev,
      total: prev.quantity * prev.unitPrice
    }));
  }, [newItem.quantity, newItem.unitPrice]);

  /**
   * Maneja los cambios en los campos del formulario
   * @param e - Evento de cambio
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice'
        ? parseFloat(value) || 0
        : value
    }));
  };

  /**
   * Agrega el item actual y resetea el formulario
   */
  const handleAddItem = () => {
    if (!newItem.description) return;

    onAddItem({ ...newItem });

    setNewItem({
        description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-gray-50 p-4 rounded-md">
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="item-description">
            Item Description*
          </label>
          <input
            id="item-description"
            name="description"
            type="text"
            value={newItem.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Consulting Services"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="item-quantity">
            Quantity*
          </label>
          <input
            id="item-quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={newItem.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="item-unitPrice">
            Unit Price*
          </label>
          <input
            id="item-unitPrice"
            name="unitPrice"
            type="number"
            min="0"
            step="0.01"
            value={newItem.unitPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            disabled={!newItem.description}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="md:col-span-2 mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="item-description">
          Description
        </label>
        <textarea
          id="item-description"
          name="description"
          value={newItem.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Item description..."
        />
      </div>
    </>
  );
}
