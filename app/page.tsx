'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface Order {
  id: number;
  number: string;
  date: string;
  clientName: string;
  clientPhone?: string;
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

interface Visit {
  id: number;
  clientName: string;
  clientPhone?: string;
  address: string;
  visitDate: string;
  visitTime: string;
  productType?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [storeName, setStoreName] = useState('Lingerie Dona Lingerie');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load data from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('lingerie_orders') || '[]');
    const savedVisits = JSON.parse(localStorage.getItem('lingerie_visits') || '[]');
    const savedSettings = JSON.parse(localStorage.getItem('lingerie_settings') || '{}');

    setOrders(savedOrders);
    setVisits(savedVisits);
    if (savedSettings.storeName) setStoreName(savedSettings.storeName);
    
    setLoading(false);
  }, [router]);

  // Calculate stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const upcomingVisits = visits.filter(v => 
    v.status === 'SCHEDULED' && new Date(v.visitDate) >= new Date()
  ).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">
                Bem-vinda, {storeName}! 💋
              </h1>
              <p className="text-gray-600">
                Aqui está um resumo do seu dia a dia
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total de Pedidos</p>
                      <p className="text-3xl font-bold text-secondary">{totalOrders}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <ShoppingBagIcon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Faturamento</p>
                      <p className="text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <CurrencyDollarIcon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Visitas Agendadas</p>
                      <p className="text-3xl font-bold text-secondary">{upcomingVisits}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <CalendarIcon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Pedidos Pendentes</p>
                      <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <ClockIcon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>⚡ Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    variant="primary" 
                    className="h-24 flex-col gap-2"
                    onClick={() => router.push('/orders')}
                  >
                    <ShoppingBagIcon className="w-6 h-6" />
                    Novo Pedido
                  </Button>
                  <Button 
                    variant="primary" 
                    className="h-24 flex-col gap-2"
                    onClick={() => router.push('/invoices')}
                  >
                    <CurrencyDollarIcon className="w-6 h-6" />
                    Nova Nota Fiscal
                  </Button>
                  <Button 
                    variant="primary" 
                    className="h-24 flex-col gap-2"
                    onClick={() => router.push('/visits')}
                  >
                    <CalendarIcon className="w-6 h-6" />
                    Agendar Visita
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-24 flex-col gap-2"
                    onClick={() => router.push('/tips')}
                  >
                    <ArrowTrendingUpIcon className="w-6 h-6" />
                    Dicas de Vendas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders & Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>📋 Pedidos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum pedido cadastrado ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-secondary">#{order.number} - {order.clientName}</p>
                            <p className="text-sm text-gray-600">{order.product} • {formatDate(order.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatCurrency(order.totalPrice)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status === 'COMPLETED' ? 'Concluído' :
                               order.status === 'PENDING' ? 'Pendente' :
                               order.status === 'CANCELLED' ? 'Cancelado' : 'Processando'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length > 5 && (
                        <button 
                          onClick={() => router.push('/orders')}
                          className="text-primary font-medium text-sm hover:text-accent transition-colors"
                        >
                          Ver todos os {orders.length} pedidos →
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Visits */}
              <Card>
                <CardHeader>
                  <CardTitle>🏠 Visitas Próximas</CardTitle>
                </CardHeader>
                <CardContent>
                  {visits.filter(v => v.status === 'SCHEDULED').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhuma visita agendada.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {visits
                        .filter(v => v.status === 'SCHEDULED')
                        .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
                        .slice(0, 5)
                        .map((visit) => (
                          <div key={visit.id} className="p-3 bg-gray-50 rounded-xl border-l-4 border-primary">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-secondary">{visit.clientName}</p>
                                <p className="text-sm text-gray-600">📅 {formatDate(visit.visitDate)} às {visit.visitTime}</p>
                                <p className="text-sm text-gray-600">📍 {visit.address}</p>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Agendada
                              </span>
                            </div>
                          </div>
                        ))}
                      {visits.filter(v => v.status === 'SCHEDULED').length > 5 && (
                        <button 
                          onClick={() => router.push('/visits')}
                          className="text-primary font-medium text-sm hover:text-accent transition-colors"
                        >
                          Ver todas as visitas →
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
