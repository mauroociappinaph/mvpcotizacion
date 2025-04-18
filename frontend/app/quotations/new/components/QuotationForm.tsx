'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { QuotationData, QuotationItem } from '../../../lib/types/quotation.types';
import { formatCurrency } from '../../../lib/utils/formatters';
import ItemsTable from './ItemsTable';
import ItemForm from './ItemForm';

/**
 * Propiedades para el componente QuotationForm
 */
interface QuotationFormProps {
  /**
   * Lista de clientes disponibles para asignar a la cotización
   */
  clients: Array<{ id: string; name: string }>;
  /**
   * Estado de carga del formulario
   */
  loading: boolean;
  /**
   * Mensaje de error si existe
   */
  error: string | null;
  /**
   * Función para limpiar errores
   */
  clearError: () => void;
  /**
   * Función de envío del formulario
   * @param data - Datos de la cotización a crear
   */
  onSubmit: (data: QuotationData) => Promise<void>;
}

/**
 * Componente de formulario para crear nuevas cotizaciones
 * @param props - Propiedades del componente
 * @returns Componente React
 */
export default function QuotationForm({
  clients,
  loading,
  error,
  clearError,
  onSubmit
}: QuotationFormProps) {
  /**
   * Estado del formulario de cotización
   */
  const [formData, setFormData] = useState<QuotationData>({
    title: '',
    clientId: '',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    items: []
  });

  /**
   * Calcula subtotal, impuestos, descuento y total cuando cambian los items o porcentajes
   */
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (formData.tax / 100);
    const discountAmount = subtotal * (formData.discount / 100);
    const total = subtotal + taxAmount - discountAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  }, [formData.items, formData.tax, formData.discount]);

  /**
   * Maneja los cambios en los campos del formulario
   * @param e - Evento de cambio
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tax' || name === 'discount' ? parseFloat(value) || 0 : value
    }));
  };

  /**
   * Agrega un item a la cotización
   * @param item - Item a agregar
   */
  const addItem = (item: Omit<QuotationItem, 'id' | 'quotationId'>) => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  /**
   * Elimina un item de la cotización
   * @param index - Índice del item a eliminar
   */
  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  /**
   * Maneja el envío del formulario
   * @param e - Evento de formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      alert('Please select a client');
      return;
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Link href="/quotations" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Quotations</span>
        </Link>
        <h1 className="text-2xl font-bold">New Quotation</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="text-sm underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Quotation Title*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Website Development Services"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientId">
              Client*
            </label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="issueDate">
              Issue Date*
            </label>
            <input
              id="issueDate"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
              Due Date*
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes for the client..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="terms">
              Terms & Conditions
            </label>
            <textarea
              id="terms"
              name="terms"
              value={formData.terms || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Payment terms, delivery conditions, etc..."
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Items</h3>

        <ItemsTable
          items={formData.items as QuotationItem[]}
          onRemoveItem={removeItem}
        />

            <ItemForm onAddItem={addItem} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            {/* Left Column - Empty */}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Tax (%):</span>
                <input
                  type="number"
                  name="tax"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tax}
                  onChange={handleChange}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="font-medium">{formatCurrency(formData.subtotal * (formData.tax / 100))}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Discount (%):</span>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="font-medium">{formatCurrency(formData.subtotal * (formData.discount / 100))}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold">{formatCurrency(formData.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/quotations"
            className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Save Quotation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
