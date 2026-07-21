'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TipsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const tipCategories = [
    {
      title: '📈 Formas de Ganhar Mais Clientes',
      icon: '📈',
      tips: [
        'Use WhatsApp Business para resposta rápida e catálogo de produtos',
        'Poste fotos de novidades no Instagram com stories interativos',
        'Crie um programa de indicação: cliente que traga amiga ganha 10% de desconto',
        'Ofereça consultoria de modelos adequados ao tipo corporal',
        'Faça parcerias com lojas de roupas e salões de beleza',
        'Participe de feiras femininas e eventos de moda local',
        'Mantenha uma embalagem bonita e presenteie com fita personalizada',
        'Use depoimentos de clientes satisfeitas (com permissão)',
        'Crie um sorteio mensal no Instagram para engajar seguidores',
        'Ofereça frete grátis para compras acima de R$ 200',
      ],
    },
    {
      title: '💬 Técnicas de Venda',
      icon: '💬',
      tips: [
        'Pergunte sobre o estilo de vida da cliente para sugerir produtos',
        'Demonstre confiança, mas não seja invasiva',
        'Use a técnica do cross-selling: "Esse sutiã combina com essa calcinha"',
        'Ofereça provar vários tamanhos para garantir o conforto',
        'Conte sobre os benefícios de cada peça (conforto, sustentação, modelagem)',
        'Use linguagem positiva: em vez de "não fica", diga "esse modelo realça melhor"',
        'Ofereça desconto progressivo: "Se levar 2, dá 10% de desconto"',
        'Sempre pergunte: "Precisa de ajuda com mais nada hoje?"',
        'Demonstre o produto usando o espelho para a cliente ver o resultado',
        'Lembre-se do nome da cliente e use sempre que possível',
      ],
    },
    {
      title: '🏠 Dicas para Visitas a Domicílio',
      icon: '🏠',
      tips: [
        'Leve uma mala organizada com várias opções de tamanhos',
        'Traga espelho de bolso para a cliente conferir o ajuste',
        'Mantenha produtos limpos e cheirosos (mas sem exagero)',
        'Respeite o espaço da cliente e pergunte antes de abrir gavetas',
        'Leve um catálogo físico ou tablet com fotos de todos os modelos',
        'Ofereça chá ou água para criar um ambiente acolhedor',
        'Leve sacolas discretas para a cliente não se sentir exposta',
        'Marque visitas em horários que não incomodem a rotina da cliente',
        'Leve amostras grátis de novos produtos para demonstrar',
        'Use roupão ou avental limpo para não sujar as roupas da cliente',
      ],
    },
    {
      title: '💎 Fidelização de Clientes',
      icon: '💎',
      tips: [
        'Crie um cartão de fidelidade: a cada R$ 500 gastos, ganhe 1 peça grátis',
        'Lembre o aniversário da cliente com mensagem personalizada',
        'Ofereça troca gratuita em até 30 dias',
        'Mantenha um histórico de compras para sugerir novidades',
        'Crie uma lista VIP com benefícios exclusivos',
        'Envie novidades por WhatsApp com foto do novo estoque',
        'Ofereça frete grátis para compras acima de R$ 200',
        'Entregue com nota fiscal e embalagem especial',
        'Crie um grupo exclusivo no WhatsApp para clientes VIP',
        'Ofereça desconto no aniversário do cliente',
      ],
    },
    {
      title: '🧼 Cuidados com as Peças',
      icon: '🧼',
      tips: [
        'Lave em água fria com sabão neutro',
        'Não use bloco ou ferro direto no tecido',
        'Secar à sombra para não amarelar',
        'Evitar produtos químicos (perfume, desodorante)',
        'Lavar separado por cor',
        'Não passar ferro em aplicações decorativas',
        'Guarde em local arejado para não mofo',
        'Lavar antes do primeiro uso para evitar manchas',
        'Use saco de tecido para guardar, não plástico',
        'Não deixar de molhar para não endurecer',
      ],
    },
    {
      title: '📱 Marketing Digital',
      icon: '📱',
      tips: [
        'Crie posts no Instagram mostrando novos chegados',
        'Use reels mostrando como modelar diferentes tipos de sutiã',
        'Faça stories com dicas de combinar peças',
        'Use hashtags locais: #LingerieBH #LingerieMG',
        'Marque clientes satisfeitas (com permissão) em posts',
        'Crie um grupo no WhatsApp com ofertas exclusivas',
        'Faça lives mostrando novas coleções',
        'Use o TikTok para dicas rápidas de modelagem',
        'Crie um conteúdo educativo sobre como escolher o tamanho certo',
        'Compartilhe bastidores do dia a dia da loja',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">💡 Dicas & Ajuda para Vendedoras</h1>
              <p className="text-gray-600">Tudo que você precisa saber para vender mais e prestar um ótimo atendimento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tipCategories.map((category, index) => (
                <Card key={index} hover>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold mt-0.5">✓</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dica do Dia */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>🎯 Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/20">
                  <p className="text-lg text-secondary mb-4">
                    <strong>💌 Regra de ouro para visitas a domicílio:</strong>
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    "Lembre-se: você não está vendendo apenas lingerie, está vendendo 
                    confiança e bem-estar. Uma cliente que se sente à vontade para 
                    conversar abre mais possibilidades de compra. Sempre pergunte: 
                    'Como você se sente mais confortável hoje?' e deixe isso guiar 
                    suas sugestões."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
