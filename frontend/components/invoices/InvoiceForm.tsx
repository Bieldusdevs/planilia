'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useToast } from '../ui/Toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InvoiceFormProps {
  invoice?: any | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  clientName: string;
  clientCpf: string;
  clientAddress: string;
  clientPhone: string;
  paymentMethod: string;
  discount: number;
  items: {
    product: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export const InvoiceForm = ({ invoice, onSuccess, onCancel }: InvoiceFormProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      clientCpf: '',
      clientAddress: '',
      clientPhone: '',
      paymentMethod: 'PIX',
      discount: 0,
      items: [{ product: '', size: '', color: '', quantity: 1, unitPrice: 0 }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedDiscount = watch('discount', 0);

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  const total = subtotal - (watchedDiscount || 0);

  useEffect(() => {
    if (invoice) {
      reset({
        clientName: invoice.clientName,
        clientCpf: invoice.clientCpf || '',
        clientAddress: invoice.clientAddress || '',
        clientPhone: invoice.clientPhone || '',
        paymentMethod: invoice.paymentMethod,
        discount: invoice.discount,
        items: invoice.items.map((item: any) => ({
          product: item.product,
          size: item.size || '',
          color: item.color || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    }
  }, [invoice, reset]);

  const addItem = () => {
    append({ product: '', size: '', color: '', quantity: 1, unitPrice: 0 });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      
      let items = data.items.map((item) => {
        const total = item.quantity * item.unitPrice;
        return {
          id: Date.now() + Math.random(),
          ...item,
          totalPrice: total,
        };
      });
      
      if (invoice) {
        // Update existing invoice
        const index = invoices.findIndex((i: any) => i.id === invoice.id);
        if (index !== -1) {
          invoices[index] = {
            ...invoices[index],
            clientName: data.clientName,
            clientCpf: data.clientCpf,
            clientAddress: data.clientAddress,
            clientPhone: data.clientPhone,
            paymentMethod: data.paymentMethod,
            subtotal,
            discount: data.discount || 0,
            total,
            items,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Create new invoice
        const count = invoices.length;
        const invoiceNumber = String(count + 1).padStart(6, '0');
        
        const newInvoice = {
          id: Date.now(),
          number: invoiceNumber,
          date: new Date().toISOString(),
          clientName: data.clientName,
          clientCpf: data.clientCpf,
          clientAddress: data.clientAddress,
          clientPhone: data.clientPhone,
          paymentMethod: data.paymentMethod,
          subtotal,
          discount: data.discount || 0,
          total,
          status: 'PENDING',
          items,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        invoices.push(newInvoice);
      }
      
      localStorage.setItem('lingerie_invoices', JSON.stringify(invoices));
      showToast(invoice ? 'Nota fiscal atualizada com sucesso!' : 'Nota fiscal criada com sucesso!', 'success');
      onSuccess?.();
    } catch (error: any) {
      showToast('Erro ao salvar nota fiscal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome do Cliente *"
              placeholder="Nome completo"
              error={errors.clientName?.message}
              {...register('clientName', { required: 'Nome é obrigatório' })}
            />
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              {...register('clientCpf')}
            />
            <Input
              label="Telefone"
              placeholder="(31) 99999-9999"
              {...register('clientPhone')}
            />
            <Input
              label="Endereço"
              placeholder="Rua, Número, Bairro, Cidade"
              {...register('clientAddress')}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary mb-1">Forma de Pagamento *</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                {...register('paymentMethod', { required: 'Pagamento é obrigatório' })}
              >
                <option value="PIX">📱 Pix</option>
                <option value="CASH">💵 Dinheiro</option>
                <option value="CREDIT_CARD">💳 Cartão de Crédito</option>
                <option value="DEBIT_CARD">💳 Cartão de Débito</option>
              </select>
              {errors.paymentMethod && <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>🛍️ Itens da Nota Fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end p-3 bg-gray-50 rounded-xl">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-secondary mb-1">Produto *</label>
                  <input
                    type="text"
                    placeholder="Descrição do produto"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register(`items.${index}.product` as const, { required: 'Produto é obrigatório' })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Tam.</label>
                  <input
                    type="text"
                    placeholder="M"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register(`items.${index}.size` as const)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Cor</label>
                  <input
                    type="text"
                    placeholder="Preto"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register(`items.${index}.color` as const)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Qtde</label>
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register(`items.${index}.quantity` as const, { 
                      required: 'Quantidade é obrigatória',
                      min: { value: 1, message: 'Mínimo 1' }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Preço</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    defaultValue={0}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register(`items.${index}.unitPrice` as const, { 
                      required: 'Preço é obrigatório',
                      min: { value: 0, message: 'Mínimo R$ 0,00' }
                    })}
                  />
                </div>
                {fields.length > 1 && (
                  <div className="md:col-span-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remover item
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-primary font-semibold hover:text-accent transition-colors"
          >
            ➕ Adicionar mais um item
          </button>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-w-md ml-auto">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Desconto:</span>
              <input
                type="number"
                min={0}
                step={0.01}
                defaultValue={0}
                className="w-32 px-3 py-1 rounded-lg border-2 border-gray-200 text-right focus:outline-none focus:ring-2 focus:ring-primary/20"
                {...register('discount')}
              />
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-primary">
              <span className="text-secondary font-bold text-xl">TOTAL:</span>
              <span className="text-primary font-bold text-2xl">{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} variant="primary">
          {invoice ? '✏️ Atualizar Nota' : '💾 Salvar Nota Fiscal'}
        </Button>
      </div>
    </form>
  );
};
