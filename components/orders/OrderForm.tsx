'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';

interface OrderFormProps {
  order?: any | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  product: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  status: string;
  payment: string;
  observation: string;
}

export const OrderForm = ({ order, onSuccess, onCancel }: OrderFormProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      address: '',
      product: '',
      size: '',
      color: '',
      quantity: 1,
      unitPrice: 0,
      status: 'PENDING',
      payment: 'PIX',
      observation: '',
    }
  });

  useEffect(() => {
    if (order) {
      reset({
        clientName: order.clientName,
        clientPhone: order.clientPhone || '',
        clientEmail: order.clientEmail || '',
        address: order.address || '',
        product: order.product,
        size: order.size || '',
        color: order.color || '',
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        status: order.status,
        payment: order.payment || 'PIX',
        observation: order.observation || '',
      });
    }
  }, [order, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const orders = JSON.parse(localStorage.getItem('lingerie_orders') || '[]');
      
      const totalPrice = data.quantity * data.unitPrice;
      
      if (order) {
        // Update existing order
        const index = orders.findIndex((o: any) => o.id === order.id);
        if (index !== -1) {
          orders[index] = {
            ...orders[index],
            ...data,
            unitPrice: data.unitPrice,
            totalPrice,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Create new order
        const count = orders.length;
        const orderNumber = String(count + 1).padStart(4, '0');
        const newOrder = {
          id: Date.now(),
          number: orderNumber,
          date: new Date().toISOString(),
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          clientEmail: data.clientEmail,
          address: data.address,
          product: data.product,
          size: data.size,
          color: data.color,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          totalPrice,
          status: data.status,
          payment: data.payment,
          observation: data.observation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        orders.push(newOrder);
      }
      
      localStorage.setItem('lingerie_orders', JSON.stringify(orders));
      showToast(order ? 'Pedido atualizado com sucesso!' : 'Pedido salvo com sucesso!', 'success');
      onSuccess?.();
    } catch (error: any) {
      showToast('Erro ao salvar pedido', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-secondary mb-3">👤 Dados do Cliente</h3>
          
          <Input
            label="Nome do Cliente *"
            placeholder="Nome completo"
            error={errors.clientName?.message}
            {...register('clientName', { required: 'Nome é obrigatório' })}
          />

          <Input
            label="Telefone"
            placeholder="(31) 99999-9999"
            leftIcon={<span>📱</span>}
            {...register('clientPhone')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="cliente@email.com"
            leftIcon={<span>✉️</span>}
            {...register('clientEmail')}
          />

          <Input
            label="Endereço"
            placeholder="Rua, Número, Bairro, Cidade"
            leftIcon={<span>📍</span>}
            {...register('address')}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-secondary mb-3">👚 Dados do Produto</h3>
          
          <Input
            label="Produto *"
            placeholder="Ex: Conjunto de seda"
            error={errors.product?.message}
            {...register('product', { required: 'Produto é obrigatório' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tamanho"
              placeholder="M, G, 42"
              {...register('size')}
            />
            <Input
              label="Cor"
              placeholder="Preto, Rosa"
              {...register('color')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantidade *"
              type="number"
              min={1}
              defaultValue={1}
              error={errors.quantity?.message}
              {...register('quantity', { 
                required: 'Quantidade é obrigatória',
                min: { value: 1, message: 'Mínimo 1' }
              })}
            />
            <Input
              label="Preço Unitário (R$) *"
              type="number"
              min={0}
              step={0.01}
              placeholder="0,00"
              error={errors.unitPrice?.message}
              {...register('unitPrice', { 
                required: 'Preço é obrigatório',
                min: { value: 0, message: 'Mínimo R$ 0,00' }
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Status</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                {...register('status')}
              >
                <option value="PENDING">Pendente</option>
                <option value="PROCESSING">Processando</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Pagamento</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                {...register('payment')}
              >
                <option value="PIX">Pix</option>
                <option value="CASH">Dinheiro</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="DEBIT_CARD">Cartão de Débito</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Observation */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">Observação</label>
        <textarea
          className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
          rows={3}
          placeholder="Observações sobre o pedido..."
          {...register('observation')}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} variant="primary">
          {order ? '✏️ Atualizar Pedido' : '💾 Salvar Pedido'}
        </Button>
      </div>
    </form>
  );
};
