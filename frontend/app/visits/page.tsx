'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VisitForm } from '@/components/visits/VisitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface Visit {
  id: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  visitDate: string;
  visitTime: string;
  productType?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VisitsPage() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchVisits();
  }, [router]);

  const fetchVisits = () => {
    setLoading(true);
    try {
      const saved = JSON.parse(localStorage.getItem('lingerie_visits') || '[]');
      setVisits(saved);
    } catch (error) {
      console.error('Failed to fetch visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (id: number) => {
    const saved = JSON.parse(localStorage.getItem('lingerie_visits') || '[]');
    const updated = saved.map((v: any) => 
      v.id === id ? { ...v, status: 'COMPLETED', updatedAt: new Date().toISOString() } : v
    );
    localStorage.setItem('lingerie_visits', JSON.stringify(updated));
    setVisits(updated);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta visita?')) return;
    const saved = JSON.parse(localStorage.getItem('lingerie_visits') || '[]');
    const filtered = saved.filter((v: any) => v.id !== id);
    localStorage.setItem('lingerie_visits', JSON.stringify(filtered));
    setVisits(filtered);
  };

  const filteredVisits = visits.filter(visit => {
    const matchesStatus = statusFilter === 'ALL' || visit.status === statusFilter;
    const matchesDate = !dateFilter || visit.visitDate.split('T')[0] === dateFilter;
    return matchesStatus && matchesDate;
  });

  const sortedVisits = [...filteredVisits].sort((a, b) => {
    const dateA = new Date(a.visitDate + 'T' + a.visitTime);
    const dateB = new Date(b.visitDate + 'T' + b.visitTime);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const statusConfig = {
    SCHEDULED: { label: 'Agendada', color: 'bg-blue-100 text-blue-800' },
    IN_PROGRESS: { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' },
    COMPLETED: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">🏠 Visitas a Domicílio</h1>
              <p className="text-gray-600">Agende e gerencie visitas a domicílio dos clientes</p>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="ALL">Todos</option>
                  <option value="SCHEDULED">Agendadas</option>
                  <option value="IN_PROGRESS">Em Andamento</option>
                  <option value="COMPLETED">Concluídas</option>
                  <option value="CANCELLED">Canceladas</option>
                </select>
                
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                />
              </div>

              <Button 
                variant="primary"
                leftIcon={<PlusIcon className="w-5 h-5" />}
                onClick={() => setShowForm(true)}
              >
                Agendar Visita
              </Button>
            </div>

            {/* Visit Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-secondary">
                      {editingVisit ? 'Editar Visita' : 'Agendar Nova Visita'}
                    </h2>
                    <button
                      onClick={() => { setShowForm(false); setEditingVisit(null); }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <VisitForm
                      visit={editingVisit}
                      onSuccess={() => {
                        setShowForm(false);
                        setEditingVisit(null);
                        fetchVisits();
                      }}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingVisit(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Visits List */}
            <Card>
              <CardHeader>
                <CardTitle>📝 Lista de Visitas</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedVisits.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Nenhuma visita encontrada.</p>
                    <p className="text-sm mt-2">Clique em "Agendar Visita" para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedVisits.map((visit) => {
                      const status = statusConfig[visit.status] || statusConfig.SCHEDULED;

                      return (
                        <div 
                          key={visit.id} 
                          className={`p-4 rounded-xl border-l-4 transition-all ${
                            visit.status === 'SCHEDULED' ? 'border-blue-500 bg-blue-50/50' :
                            visit.status === 'COMPLETED' ? 'border-green-500 bg-green-50/50' :
                            visit.status === 'CANCELLED' ? 'border-red-500 bg-red-50/50' :
                            'border-yellow-500 bg-yellow-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-secondary text-lg">{visit.clientName}</h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <CalendarIcon className="w-4 h-4 text-primary" />
                                  <span>{formatDate(visit.visitDate)} às {visit.visitTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPinIcon className="w-4 h-4 text-primary" />
                                  <span>{visit.address}</span>
                                </div>
                                {visit.clientPhone && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <span>📱</span>
                                    <span>{visit.clientPhone}</span>
                                  </div>
                                )}
                                {visit.productType && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <span>👚</span>
                                    <span>{visit.productType}</span>
                                  </div>
                                )}
                              </div>
                              
                              {visit.notes && (
                                <p className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                                  <strong>Observações:</strong> {visit.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              {visit.status === 'SCHEDULED' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                                  onClick={() => handleComplete(visit.id)}
                                >
                                  Concluir
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<PencilIcon className="w-4 h-4" />}
                                onClick={() => {
                                  setEditingVisit(visit);
                                  setShowForm(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                leftIcon={<TrashIcon className="w-4 h-4" />}
                                onClick={() => handleDelete(visit.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
