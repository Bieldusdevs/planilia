'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PrinterIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface InvoiceItem {
  id: number;
  product: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: number;
  number: string;
  date: string;
  clientName: string;
  clientCpf?: string;
  clientAddress?: string;
  clientPhone?: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchInvoices();
  }, [router]);

  const fetchInvoices = () => {
    setLoading(true);
    try {
      const saved = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      setInvoices(saved);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const settings = JSON.parse(localStorage.getItem('lingerie_settings') || '{}');
    const storeName = settings.storeName || 'Lingerie Dona Lingerie';
    const storeAddress = settings.address || 'Rua das Flores, 123 - Belo Horizonte/MG';
    const storePhone = settings.phone || '(31) 99999-9999';
    const storeCnpj = settings.cnpj || '12.345.678/0001-90';
    const storeEmail = settings.email || 'contato@lingeriedonadona.com.br';

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const paymentText = {
      CASH: '💵 Dinheiro',
      PIX: '📱 Pix',
      CREDIT_CARD: '💳 Cartão de Crédito',
      DEBIT_CARD: '💳 Cartão de Débito',
    }[invoice.paymentMethod as keyof typeof paymentText] || invoice.paymentMethod;

    let itemsHtml = '';
    invoice.items.forEach((item) => {
      itemsHtml += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.product}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.size || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.color || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.unitPrice)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.totalPrice)}</td>
        </tr>
      `;
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nota Fiscal - ${storeName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #000; }
    .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
    .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #c18a36; }
    .store-info h2 { color: #1a0c0a; font-size: 24px; margin: 0 0 10px 0; }
    .store-info p { margin: 5px 0; font-size: 14px; }
    .invoice-logo { font-size: 48px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #c18a36; color: #fff; padding: 10px; text-align: left; font-size: 13px; }
    td { padding: 8px; border: 1px solid #ddd; font-size: 13px; }
    .totals { text-align: right; margin-top: 20px; }
    .totals .total-line { margin: 8px 0; }
    .totals .total-line.final { font-weight: bold; font-size: 18px; color: #c18a36; border-top: 2px solid #c18a36; padding-top: 10px; }
    .client-info { margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    @media print { body { margin: 0; padding: 0; } .invoice-container { border: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="store-info">
        <h2>${storeName}</h2>
        <p>📍 ${storeAddress}</p>
        <p>📞 ${storePhone} | 🆔 CNPJ: ${storeCnpj}</p>
        <p>📧 ${storeEmail}</p>
      </div>
      <div class="invoice-logo">💋</div>
    </div>
    
    <div style="text-align: right; margin-bottom: 20px;">
      <h3>Nota Fiscal #${invoice.number}</h3>
      <p><strong>Data:</strong> ${formatDate(invoice.date)}</p>
      <p><strong>Status:</strong> ${invoice.status}</p>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Tamanho</th>
          <th>Cor</th>
          <th>Qtde</th>
          <th>Preço Unit.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <div class="totals">
      <div class="total-line"><span>Subtotal:</span> <span>${formatCurrency(invoice.subtotal)}</span></div>
      <div class="total-line"><span>Desconto:</span> <span>${formatCurrency(invoice.discount)}</span></div>
      <div class="total-line final"><span>TOTAL:</span> <span>${formatCurrency(invoice.total)}</span></div>
    </div>
    
    <div class="client-info">
      <p><strong>Cliente:</strong> ${invoice.clientName}</p>
      <p><strong>CPF:</strong> ${invoice.clientCpf || 'Não informado'}</p>
      <p><strong>Endereço:</strong> ${invoice.clientAddress || 'Não informado'}</p>
      <p><strong>Telefone:</strong> ${invoice.clientPhone || 'Não informado'}</p>
      <p><strong>Pagamento:</strong> ${paymentText}</p>
    </div>
    
    <div class="footer">
      <p>Obrigada por comprar na ${storeName}!</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta nota fiscal?')) return;
    const saved = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
    const filtered = saved.filter((i: any) => i.id !== id);
    localStorage.setItem('lingerie_invoices', JSON.stringify(filtered));
    setInvoices(filtered);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">🧾 Notas Fiscais</h1>
              <p className="text-gray-600">Gerencie e imprima notas fiscais</p>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Pesquisar notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border-2 border-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="ALL">Todos os status</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="PAID">Pagas</option>
                  <option value="CANCELLED">Canceladas</option>
                </select>
              </div>

              <Button 
                variant="primary"
                leftIcon={<PlusIcon className="w-5 h-5" />}
                onClick={() => setShowForm(true)}
              >
                Nova Nota Fiscal
              </Button>
            </div>

            {/* Invoice Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-secondary">
                      {editingInvoice ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
                    </h2>
                    <button
                      onClick={() => { setShowForm(false); setEditingInvoice(null); }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <InvoiceForm
                      invoice={editingInvoice}
                      onSuccess={() => {
                        setShowForm(false);
                        setEditingInvoice(null);
                        fetchInvoices();
                      }}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingInvoice(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Invoices Table */}
            <Card>
              <CardHeader>
                <CardTitle>📝 Notas Fiscais Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredInvoices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <PrinterIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Nenhuma nota fiscal encontrada.</p>
                    <p className="text-sm mt-2">Clique em "Nova Nota Fiscal" para começar.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="gold-gradient text-secondary">
                          <th className="text-left py-3 px-4 font-semibold">#</th>
                          <th className="text-left py-3 px-4 font-semibold">Data</th>
                          <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                          <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                          <th className="text-right py-3 px-4 font-semibold">Desconto</th>
                          <th className="text-right py-3 px-4 font-semibold">Total</th>
                          <th className="text-center py-3 px-4 font-semibold">Pagamento</th>
                          <th className="text-center py-3 px-4 font-semibold">Status</th>
                          <th className="text-center py-3 px-4 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-secondary">{invoice.number}</td>
                            <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                            <td className="py-3 px-4 font-medium">{invoice.clientName}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(invoice.subtotal)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(invoice.discount)}</td>
                            <td className="py-3 px-4 text-right font-bold text-primary">{formatCurrency(invoice.total)}</td>
                            <td className="py-3 px-4 text-center">
                              {invoice.paymentMethod === 'PIX' ? '📱 Pix' :
                               invoice.paymentMethod === 'CASH' ? '💵 Dinheiro' :
                               invoice.paymentMethod === 'CREDIT_CARD' ? '💳 Crédito' :
                               '💳 Débito'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {invoice.status === 'PAID' ? 'Pago' :
                                 invoice.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={() => handlePrint(invoice)}
                                  className="p-1 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="Imprimir"
                                >
                                  <PrinterIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingInvoice(invoice);
                                    setShowForm(true);
                                  }}
                                  className="p-1 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                                  title="Editar"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(invoice.id)}
                                  className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                                  title="Excluir"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
