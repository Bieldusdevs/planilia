# 💋 Lingerie Dona Lingerie - Sistema de Gestão

Sistema completo de gestão para loja de encomendas de lingeries.

## 🚀 Deploy no Vercel (Passo a Passo)

### 1. Subir o código para o GitHub

```bash
git add .
git commit -m "fix: reestrutura projeto para deploy no Vercel"
git push
```

### 2. Conectar no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe o repositório `planilia`
4. **Framework Preset**: Next.js (detecta automaticamente)
5. Clique em **"Deploy"**

Pronto! O build vai funcionar automaticamente. ✅

---

## 🔐 Login

- **Email**: `admin@lingeriedonadona.com.br`
- **Senha**: `admin123`

---

## ✨ Funcionalidades

- 📋 **Pedidos**: Cadastro, edição, filtros, exportação Excel/CSV
- 🧾 **Notas Fiscais**: Criação e impressão de notas fiscais
- 🏠 **Visitas a Domicílio**: Agendamento e gestão de visitas
- 💡 **Dicas**: Dicas de vendas, fidelização e marketing
- ⚙️ **Configurações**: Dados da loja, alterar senha, tema
- 🔍 **Acessibilidade**: Botão para aumentar tamanho das letras
- 🖨️ **Impressão**: Botão de imprimir em todas as páginas

---

## 🛠️ Tecnologias

- **Next.js 14** (React)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**
- **localStorage** (funciona 100% no frontend, sem backend)

---

## 🎨 Cores da Marca

- Ouro dourado: `#c18a36`
- Burgundy: `#1a0c0a`
- Ouro quente: `#d5ad67`
- Creme: `#eacf97`
- Preto: `#0a0a0a`

---

## 📦 Desenvolvimento Local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Backend (Opcional)

O backend NestJS está disponível em `backend-separate/` para deploy separado em serviços como Render, Railway ou Fly.io. O frontend funciona 100% standalone usando localStorage.
