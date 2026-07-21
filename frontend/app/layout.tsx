import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lingerie Dona Lingerie - Sistema de Gestão',
  description: 'Sistema completo para gerenciamento de pedidos, notas fiscais e visitas a domicílio da Lingerie Dona Lingerie',
  keywords: 'lingerie, encomendas, pedidos, nota fiscal, visitas a domicílio',
  authors: [{ name: 'Lingerie Dona Lingerie' }],
  openGraph: {
    title: 'Lingerie Dona Lingerie - Sistema de Gestão',
    description: 'Sistema completo para gerenciamento de pedidos, notas fiscais e visitas a domicílio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
