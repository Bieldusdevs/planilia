# 💋 Lingerie Dona Lingerie - Sistema de Gestão

> **Sistema completo de gestão para lojas de lingerie** - Gerencie pedidos, notas fiscais, visitas a domicílio e dicas de vendas em uma única plataforma premium.

---

## 🚀 Deploy no Vercel (Frontend)

O frontend está pronto para ser implantado no Vercel. **Importante:** O Vercel precisa saber que o frontend está na pasta `frontend/`.

### Passo 1: Configure o projeto no Vercel
1. Acesse [vercel.com](https://vercel.com) e crie um novo projeto
2. Importe este repositório
3. **Na tela de configuração, configure:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Passo 2: Configure as variáveis de ambiente
Na seção "Environment Variables" do Vercel, adicione:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

> **Modo Standalone:** O frontend funciona completamente offline usando localStorage! Não é necessário um backend para usar todas as funcionalidades.

### Passo 3: Deploy
Clique em "Deploy" e pronto! O site estará online em instantes.

**Ou use a CLI:**
```bash
npm install -g vercel
vercel --cwd frontend
```

---

## 🏗️ Arquitetura do Projeto

```
lingerie-dona-lingerie/
├── frontend/              # Next.js 14 (Awwwards-level UI)
│   ├── app/               # App Router (Next.js 14)
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Dashboard
│   │   ├── login/         # Login page
│   │   ├── orders/        # Orders management
│   │   ├── invoices/      # Invoices management
│   │   ├── visits/        # Home visits management
│   │   ├── tips/          # Sales tips
│   │   └── settings/      # Store settings
│   ├── components/        # Reusable components
│   │   ├── ui/            # UI components (Button, Input, Card, Modal, Toast)
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   ├── orders/        # Order components
│   │   ├── invoices/      # Invoice components
│   │   └── visits/        # Visit components
│   ├── lib/               # API client, utilities
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   ├── styles/            # CSS/Tailwind styles
│   ├── vercel.json        # Vercel configuration
│   └── Dockerfile         # Docker support
│
├── backend/               # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/      # Authentication (JWT)
│   │   │   ├── orders/    # Orders management
│   │   │   ├── invoices/  # Invoices management
│   │   │   ├── visits/    # Visits management
│   │   │   ├── settings/  # Store settings
│   │   │   └── users/     # User management
│   │   ├── prisma/        # Prisma ORM
│   │   ├── common/        # Common decorators/guards
│   │   └── shared/        # Shared utilities
│   ├── prisma/            # Database schema
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml     # Docker orchestration
└── README.md
```

---

## 🎨 Tecnologias Utilizadas

### Frontend (Next.js)
| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 14.x | Framework React |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 3.x | Estilização |
| **Framer Motion** | 11.x | Animações |
| **React Hook Form** | 7.x | Formulários |
| **React Query** | 5.x | Gerenciamento de estado |
| **Heroicons** | 2.x | Ícones |
| **React Hook Form** | 7.x | Validação de formulários |

### Backend (NestJS)
| Tecnologia | Versão | Uso |
|---|---|---|
| **NestJS** | 10.x | Framework Node.js |
| **TypeScript** | 5.x | Tipagem estática |
| **PostgreSQL** | 16 | Banco de dados |
| **Prisma ORM** | 5.x | ORM |
| **JWT** | - | Autenticação |
| **Passport** | - | Estratégias de auth |
| **Swagger** | - | Documentação API |
| **bcrypt** | - | Hash de senhas |
| **SheetJS** | - | Exportação Excel |

---

## 🎯 Funcionalidades

### 📋 Pedidos & Encomendas
- Cadastro de pedidos com cliente, produto, tamanho, cor, quantidade e preço
- Edição e exclusão de pedidos
- Pesquisa por cliente, produto ou telefone
- Filtros por status
- **Exportação para Excel (.xlsx)**
- **Download em CSV**
- Status: Pendente, Processando, Concluído, Cancelado

### 🧾 Nota Fiscal
- Geração de notas fiscais com múltiplos itens
- Cálculo automático de subtotal, desconto e total
- **Impressão profissional** com layout de nota fiscal
- **Exportação para Excel**
- Formas de pagamento: Pix, Dinheiro, Cartão

### 🏠 Visitas a Domicílio
- Agendamento de visitas com data, hora e endereço
- Tipos de peças interessadas
- Status: Agendada, Em Andamento, Concluída, Cancelada
- Marcar como concluída com um clique

### 💡 Dicas & Ajuda
- Formas de ganhar mais clientes
- Técnicas de venda
- Dicas para visitas a domicílio
- Fidelização de clientes
- Cuidados com as peças
- Marketing digital

### ⚙️ Configurações
- Dados da loja (nome, telefone, email, CNPJ, endereço)
- Redes sociais (Instagram, Facebook)
- Cores personalizadas
- Alteração de senha

---

## 🐳 Docker (Modo Completo)

Para rodar com backend e banco de dados:

```bash
docker-compose up -d
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- PostgreSQL: localhost:5432

### Credenciais Padrão
- **Email:** `admin@lingeriedonadona.com.br`
- **Senha:** `admin123`

---

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|---|---|---|
| Ouro Dourado | `#c18a36` | Cor primária |
| Burgundy Profundo | `#1a0c0a` | Cor secundária |
| Ouro Quente | `#d5ad67` | Detalhes |
| Creme Claro | `#eacf97` | Destaques |
| Preto Profundo | `#0a0a0a` | Texto |

---

## ⌨️ Atalhos

| Atalho | Ação |
|---|---|
| `Ctrl + E` | Exportar pedidos para Excel |
| `Ctrl + P` | Imprimir página |
| `Ctrl + F` | Focar na pesquisa |
| `A+` | Aumentar tamanho do texto |

---

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Celulares
- 💻 Tablets
- 🖥️ Desktops

---

## 📄 Licença

Desenvolvido para **Lingerie Dona Lingerie** - Todos os direitos reservados.
