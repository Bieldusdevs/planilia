'use client';

import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface Order {
  id: number;
  number: string;
  date: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address?: string;
  product: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  payment?: string;
  observation?: string;
}

interface OrderListProps {
  onEdit?: (order: Order) => void;
  refreshTrigger?: number;
}

const statusConfig = {
  PENDING: { label: 'Pendente', icon: ClockIcon, color: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { label: 'Processando', icon: ClockIcon, color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Concluído', icon: CheckCircleIcon, color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', icon: XCircleIcon, color: 'bg-red-100 text-red-800' },
};

export const OrderList = ({ onEdit, refreshTrigger }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const { showToast } = useToast();

  const fetchOrders = () => {
    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('lingerie_orders') || '[]');
      setOrders(savedOrders);
    } catch (error) {
      showToast('Erro ao carregar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const deleteOrder = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;
    
    const savedOrders = JSON.parse(localStorage.getItem('lingerie_orders') || '[]');
    const filtered = savedOrders.filter((o: any) => o.id !== id);
    localStorage.setItem('lingerie_orders', JSON.stringify(filtered));
    setOrders(filtered);
    showToast('Pedido excluído com sucesso!', 'success');
  };

  const exportToExcel = () => {
    if (orders.length === 0) {
      showToast('Nenhum pedido para exportar!', 'error');
      return;
    }

    // Use SheetJS if available, otherwise use CSV
    const exportData = filteredOrders.map(o => ({
      'Número do Pedido': o.number,
      'Data': formatDate(o.date),
      'Cliente': o.clientName,
      'Telefone': o.clientPhone || '',
      'Produto': o.product,
      'Tamanho': o.size || '',
      'Cor': o.color || '',
      'Quantidade': o.quantity,
      'Preço Unitário': o.unitPrice.toFixed(2),
      'Total': o.totalPrice.toFixed(2),
      'Status': o.status === 'PENDING' ? 'Pendente' : 
                o.status === 'COMPLETED' ? 'Concluído' : 
                o.status === 'CANCELLED' ? 'Cancelado' : 'Processando',
      'Observação': o.observation || '',
    }));

    // Try to use xlsx library
    if (typeof window !== 'undefined' && (window as any).XLSX) {
      const ws = (window as any).XLSX.utils.json_to_sheet(exportData);
      const wb = (window as any).XLSX.utils.book_new();
      (window as any).XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
      const fileName = `pedidos_lingerie_${new Date().toISOString().split('T')[0]}.xlsx`;
      (window as any).XLSX.writeFile(wb, fileName);
    } else {
      // Fallback to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `pedidos_lingerie_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }

    showToast('Planilha exportada com sucesso!', 'success');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      o.product?.toLowerCase().includes(search.toLowerCase()) ||
      o.clientPhone?.includes(search) ||
      String(o.number).includes(search);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Pesquisar pedidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border-2 border-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <ShoppingBagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendentes</option>
            <option value="PROCESSING">Processando</option>
            <option value="COMPLETED">Concluídos</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
            onClick={exportToExcel}
          >
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-white/80 rounded-xl p-4 text-center border-2 border-accent/20">
          <div className="text-2xl font-bold text-secondary">{filteredOrders.length}</div>
          <div className="text-sm text-gray-600">Total de Pedidos</div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 text-center border-2 border-accent/20">
          <div className="text-2xl font-bold text-green-600">
            {filteredOrders.filter(o => o.status === 'COMPLETED').length}
          </div>
          <div className="text-sm text-gray-600">Concluídos</div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 text-center border-2 border-accent/20">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredOrders.filter(o => o.status === 'PENDING').length}
          </div>
          <div className="text-sm text-gray-600">Pendentes</div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 text-center border-2 border-accent/20">
          <div className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</div>
          <div className="text-sm text-gray-600">Valor Total</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-accent/20">
        <table className="w-full bg-white">
          <thead>
            <tr className="gold-gradient text-secondary">
              <th className="text-left py-3 px-4 font-semibold">#</th>
              <th className="text-left py-3 px-4 font-semibold">Data</th>
              <th className="text-left py-3 px-4 font-semibold">Cliente</th>
              <th className="text-left py-3 px-4 font-semibold">Telefone</th>
              <th className="text-left py-3 px-4 font-semibold">Produto</th>
              <th className="text-left py-3 px-4 font-semibold">Tam.</th>
              <th className="text-left py-3 px-4 font-semibold">Cor</th>
              <th className="text-right py-3 px-4 font-semibold">Qtde</th>
              <th className="text-right py-3 px-4 font-semibold">Preço</th>
              <th className="text-right py-3 px-4 font-semibold">Total</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
              <th className="text-center py-3 px-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  Carregando pedidos...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  📭 Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;

                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-secondary">{order.number}</td>
                    <td className="py-3 px-4">{formatDate(order.date)}</td>
                    <td className="py-3 px-4 font-medium">{order.clientName}</td>
                    <td className="py-3 px-4">{order.clientPhone || '-'}</td>
                    <td className="py-3 px-4">{order.product}</td>
                    <td className="py-3 px-4">{order.size || '-'}</td>
                    <td className="py-3 px-4">{order.color || '-'}</td>
                    <td className="py-3 px-4 text-right">{order.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(order.unitPrice)}</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">{formatCurrency(order.totalPrice)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => onEdit?.(order)}
                          className="p-1 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                          title="Excluir"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
