'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { OrderForm } from '@/components/orders/OrderForm';
import { OrderList } from '@/components/orders/OrderList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function OrdersPage() {
  const router = useRouter();
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSuccess = () => {
    setEditingOrder(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header 
        showSearch={true}
        searchPlaceholder="Pesquisar pedidos por cliente, produto ou telefone..."
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">📋 Gerenciamento de Pedidos</h1>
              <p className="text-gray-600">Cadastre, edite e exporte pedidos e encomendas</p>
            </div>

            {/* Order Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingOrder ? '✏️ Editar Pedido' : '➕ Novo Pedido / Encomenda'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderForm
                  order={editingOrder}
                  onSuccess={handleSuccess}
                  onCancel={editingOrder ? handleCancel : undefined}
                />
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card>
              <CardHeader>
                <CardTitle>📝 Lista de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderList
                  onEdit={handleEdit}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
