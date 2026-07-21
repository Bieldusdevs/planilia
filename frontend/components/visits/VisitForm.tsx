'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useToast } from '../ui/Toast';

interface VisitFormProps {
  visit?: any | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  visitDate: string;
  visitTime: string;
  productType: string;
  status: string;
  notes: string;
}

export const VisitForm = ({ visit, onSuccess, onCancel }: VisitFormProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      address: '',
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: '',
      productType: '',
      status: 'SCHEDULED',
      notes: '',
    }
  });

  useEffect(() => {
    if (visit) {
      reset({
        clientName: visit.clientName,
        clientPhone: visit.clientPhone || '',
        clientEmail: visit.clientEmail || '',
        address: visit.address,
        visitDate: visit.visitDate.split('T')[0],
        visitTime: visit.visitTime,
        productType: visit.productType || '',
        status: visit.status,
        notes: visit.notes || '',
      });
    }
  }, [visit, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const visits = JSON.parse(localStorage.getItem('lingerie_visits') || '[]');
      
      if (visit) {
        // Update existing visit
        const index = visits.findIndex((v: any) => v.id === visit.id);
        if (index !== -1) {
          visits[index] = {
            ...visits[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Create new visit
        const newVisit = {
          id: Date.now(),
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          clientEmail: data.clientEmail,
          address: data.address,
          visitDate: data.visitDate,
          visitTime: data.visitTime,
          productType: data.productType,
          status: data.status || 'SCHEDULED',
          notes: data.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        visits.push(newVisit);
      }
      
      localStorage.setItem('lingerie_visits', JSON.stringify(visits));
      showToast(visit ? 'Visita atualizada com sucesso!' : 'Visita agendada com sucesso!', 'success');
      onSuccess?.();
    } catch (error: any) {
      showToast('Erro ao salvar visita', 'error');
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
        </div>

        {/* Visit Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-secondary mb-3">🏠 Detalhes da Visita</h3>
          
          <Input
            label="Endereço Completo *"
            placeholder="Rua, Número, Bairro, Cidade"
            leftIcon={<span>📍</span>}
            error={errors.address?.message}
            {...register('address', { required: 'Endereço é obrigatório' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data *"
              type="date"
              error={errors.visitDate?.message}
              {...register('visitDate', { required: 'Data é obrigatória' })}
            />
            <Input
              label="Hora *"
              type="time"
              error={errors.visitTime?.message}
              {...register('visitTime', { required: 'Hora é obrigatória' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Tipo de Peça</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('productType')}
            >
              <option value="">Selecione...</option>
              <option value="Conjuntos">Conjuntos</option>
              <option value="Sutiã">Sutiã</option>
              <option value="Calcinha">Calcinha</option>
              <option value="Biquíni">Biquíni</option>
              <option value="Legging">Legging</option>
              <option value="Calça">Calça</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Status</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('status')}
            >
              <option value="SCHEDULED">Agendada</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="COMPLETED">Concluída</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">Observações</label>
        <textarea
          className="w-full px-4 py-2.5 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
          rows={3}
          placeholder="O que o cliente quer ver? Preferências de cor, tamanho, estilo..."
          {...register('notes')}
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
          {visit ? '✏️ Atualizar Visita' : '💾 Agendar Visita'}
        </Button>
      </div>
    </form>
  );
};
