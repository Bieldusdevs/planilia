'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/' },
  { id: 'orders', label: 'Pedidos', icon: '📋', href: '/orders' },
  { id: 'invoices', label: 'Notas Fiscais', icon: '🧾', href: '/invoices' },
  { id: 'visits', label: 'Visitas a Domicílio', icon: '🏠', href: '/visits' },
  { id: 'tips', label: 'Dicas & Ajuda', icon: '💡', href: '/tips' },
  { id: 'settings', label: 'Configurações', icon: '⚙️', href: '/settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside 
      className={clsx(
        "gold-gradient-dark text-light transition-all duration-300 ease-in-out h-[calc(100vh-64px)] overflow-y-auto",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setCollapsed(true);
                }
              }}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all duration-200",
                isActive
                  ? "bg-primary text-secondary font-semibold shadow-lg"
                  : "hover:bg-white/10 hover:text-accent"
              )}
              title={item.label}
            >
              <span className="text-xl min-w-[24px]">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full py-3 text-center text-accent hover:text-light transition-colors"
        title={collapsed ? "Expandir menu" : "Colapsar menu"}
      >
        {collapsed ? '➡️' : '⬅️'}
      </button>
    </aside>
  );
};
