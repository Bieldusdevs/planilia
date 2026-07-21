'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@lingeriedonadona.com.br');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check against stored password or default
      const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
      
      // For demo purposes, we check against default credentials
      // In production, this would call the backend API
      if (email === 'admin@lingeriedonadona.com.br' && password === storedPassword) {
        const token = btoa(`${email}:${Date.now()}`);
        localStorage.setItem('accessToken', token);
        showToast('Login realizado com sucesso! 🎉', 'success');
        router.push('/');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error: any) {
      showToast(error.message || 'Credenciais inválidas. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-dark to-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💋</div>
            <h1 className="text-3xl font-bold text-light mb-2">
              Lingerie Dona Lingerie
            </h1>
            <p className="text-accent/80 text-sm">
              Sistema de Gestão - Acesso Administrativo
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              leftIcon={<span>✉️</span>}
              className="bg-white/10 border-white/20 text-light placeholder-gray-300"
            />

            <div>
              <label className="block text-sm font-medium text-light mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-light placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition-all pr-12"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-light transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              size="lg"
            >
              Entrar no Sistema
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-300">
            <p>🔐 Senha padrão: <strong className="text-accent">admin123</strong></p>
            <p className="mt-1">Altere após o primeiro login em ⚙️ Configurações</p>
          </div>
        </div>
      </div>
    </div>
  );
}
