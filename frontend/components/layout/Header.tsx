'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  PrinterIcon, 
  SunIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

export const Header = ({ onSearch, searchPlaceholder = 'Pesquisar...', showSearch = false }: HeaderProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [fontSizeLarge, setFontSizeLarge] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [storeName, setStoreName] = useState('Lingerie Dona Lingerie');

  useEffect(() => {
    // Load settings
    const settings = localStorage.getItem('lingerie_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.storeName) setStoreName(parsed.storeName);
    }

    // Load font size preference
    const savedFontSize = localStorage.getItem('fontSizeLarge');
    if (savedFontSize === 'true') {
      setFontSizeLarge(true);
      document.body.classList.add('text-lg');
    }
  }, []);

  const toggleFontSize = () => {
    const newState = !fontSizeLarge;
    setFontSizeLarge(newState);
    localStorage.setItem('fontSizeLarge', String(newState));
    if (newState) {
      document.body.classList.add('text-lg');
    } else {
      document.body.classList.remove('text-lg');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    showToast('Logout realizado com sucesso!', 'info');
    router.push('/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="gold-gradient-dark text-light sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Store Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <span className="text-3xl">💋</span>
            <div>
              <h1 className="text-xl font-bold">{storeName}</h1>
              <p className="text-xs text-accent/70">Sistema de Gestão</p>
            </div>
          </Link>

          {/* Search */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-light placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFontSize}
              title={fontSizeLarge ? "Diminuir texto" : "Aumentar texto"}
              className={`p-2 rounded-xl transition-all duration-300 ${
                fontSizeLarge 
                  ? 'bg-accent text-secondary font-bold' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              🔍 A+
            </button>
            
            <button
              onClick={handlePrint}
              title="Imprimir página"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              title="Sair"
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
