'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { 
  SaveIcon, 
  KeyIcon, 
  TrashIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    storeName: 'Lingerie Dona Lingerie',
    phone: '(31) 99999-9999',
    email: 'contato@lingeriedonadona.com.br',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - Bairro Jardim das Acácias - Belo Horizonte/MG',
    instagram: '@lingeriedonadona',
    facebook: 'LingerieDonaLingerie',
    primaryColor: '#c18a36',
    secondaryColor: '#1a0c0a',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('lingerie_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, [router]);

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('lingerie_settings', JSON.stringify(settings));
      showToast('Configurações salvas com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao salvar configurações', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    const currentPass = localStorage.getItem('adminPassword') || 'admin123';
    
    if (currentPassword !== currentPass) {
      showToast('Senha atual incorreta!', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As senhas não coincidem!', 'error');
      return;
    }
    if (newPassword.length < 4) {
      showToast('A senha deve ter pelo menos 4 caracteres!', 'error');
      return;
    }

    localStorage.setItem('adminPassword', newPassword);
    showToast('Senha alterada com sucesso!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClearData = () => {
    if (!confirm('⚠️ ATENÇÃO: Esta ação apagará TODOS os pedidos e visitas cadastrados. Deseja continuar?')) return;
    localStorage.removeItem('lingerie_orders');
    localStorage.removeItem('lingerie_visits');
    localStorage.removeItem('lingerie_invoices');
    showToast('Todos os dados foram apagados!', 'success');
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
              <h1 className="text-3xl font-bold text-secondary mb-2">⚙️ Configurações</h1>
              <p className="text-gray-600">Gerencie as configurações da loja e da conta</p>
            </div>

            {/* Store Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🏪 Informações da Loja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nome da Loja"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  />
                  <Input
                    label="Telefone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                  <Input
                    label="CNPJ"
                    value={settings.cnpj}
                    onChange={(e) => setSettings({ ...settings, cnpj: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Endereço Completo"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Instagram"
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  />
                  <Input
                    label="Facebook"
                    value={settings.facebook}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Cor Primária</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-10 rounded-xl cursor-pointer"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Cor Secundária</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        className="w-12 h-10 rounded-xl cursor-pointer"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="primary" 
                    isLoading={saving}
                    leftIcon={<SaveIcon className="w-5 h-5" />}
                    onClick={handleSave}
                  >
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🔒 Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-3">
                    <Input
                      label="Senha Atual"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <Input
                    label="Nova Senha"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="warning" 
                    leftIcon={<KeyIcon className="w-5 h-5" />}
                    onClick={handleChangePassword}
                  >
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>🗑️ Gerenciar Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Apague todos os pedidos e visitas cadastrados. Esta ação não pode ser desfeita.
                </p>
                <Button 
                  variant="danger" 
                  leftIcon={<TrashIcon className="w-5 h-5" />}
                  onClick={handleClearData}
                >
                  Apagar Todos os Dados
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
