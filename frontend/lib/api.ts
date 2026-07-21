/**
 * API Client - Lingerie Dona Lingerie
 * 
 * This client works in two modes:
 * 1. Connected mode: Uses the backend API (NestJS)
 * 2. Standalone mode: Uses localStorage (for Vercel deployment without backend)
 */

import axios from 'axios';

// ===== Axios Instance =====
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ===== Local Storage Data Layer =====
const STORAGE_KEYS = {
  orders: 'lingerie_orders',
  visits: 'lingerie_visits',
  settings: 'lingerie_settings',
  users: 'lingerie_users',
};

// Initialize default settings
const getDefaultSettings = () => ({
  id: 1,
  storeName: 'Lingerie Dona Lingerie',
  phone: '(31) 99999-9999',
  email: 'contato@lingeriedonadona.com.br',
  cnpj: '12.345.678/0001-90',
  address: 'Rua das Flores, 123 - Bairro Jardim das Acácias - Belo Horizonte/MG',
  instagram: '@lingeriedonadona',
  facebook: 'LingerieDonaLingerie',
  primaryColor: '#c18a36',
  secondaryColor: '#1a0c0a',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Initialize default user
const getDefaultUser = () => ({
  id: 1,
  email: 'admin@lingeriedonadona.com.br',
  name: 'Dona Lingerie',
  role: 'ADMIN',
  password: 'admin123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ===== Auth API =====
export const authAPI = {
  login: async (email: string, password: string) => {
    // Try backend first
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
      const defaultUser = getDefaultUser();
      
      // Check if default user exists
      if (!users.length) {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([defaultUser]));
      }
      
      const allUsers = [...users, defaultUser];
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('accessToken', token);
      
      return {
        data: {
          access_token: token,
          user: userWithoutPassword,
        },
      };
    }
  },

  register: async (data: any) => {
    try {
      const response = await api.post('/auth/register', data);
      return response;
    } catch {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
      const newUser = {
        id: users.length + 1,
        ...data,
        role: data.role || 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
      const { password: _, ...result } = newUser;
      return { data: result };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
      const defaultUser = getDefaultUser();
      const allUsers = [...users, defaultUser];
      const user = allUsers[0];
      const { password: _, ...result } = user;
      return { data: result };
    }
  },
};

// ===== Orders API =====
export const ordersAPI = {
  getAll: async (params?: any) => {
    try {
      const response = await api.get('/orders', { params });
      return response;
    } catch {
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      let filtered = orders;
      
      if (params?.status) {
        filtered = filtered.filter((o: any) => o.status === params.status);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter((o: any) => 
          o.clientName?.toLowerCase().includes(search) ||
          o.product?.toLowerCase().includes(search) ||
          o.clientPhone?.includes(search) ||
          String(o.number).includes(search)
        );
      }
      
      const page = params?.page || 1;
      const limit = params?.limit || 50;
      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit);
      
      return {
        data: {
          data: paginated,
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        },
      };
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch {
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      const order = orders.find((o: any) => o.id === id);
      if (!order) throw new Error('Order not found');
      return { data: order };
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/orders', data);
      return response;
    } catch {
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      const count = orders.length;
      const orderNumber = String(count + 1).padStart(4, '0');
      const totalPrice = data.quantity * data.unitPrice;
      
      const newOrder = {
        id: Date.now(),
        number: orderNumber,
        date: new Date().toISOString(),
        clientName: data.clientName,
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
        address: data.address || '',
        product: data.product,
        size: data.size || '',
        color: data.color || '',
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalPrice,
        status: data.status || 'PENDING',
        payment: data.payment || null,
        observation: data.observation || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      orders.push(newOrder);
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
      return { data: newOrder };
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await api.patch(`/orders/${id}`, data);
      return response;
    } catch {
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      const index = orders.findIndex((o: any) => o.id === id);
      if (index === -1) throw new Error('Order not found');
      
      orders[index] = { ...orders[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
      return { data: orders[index] };
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response;
    } catch {
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      const filtered = orders.filter((o: any) => o.id !== id);
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(filtered));
      return { data: { id } };
    }
  },

  export: async (params?: any) => {
    try {
      const response = await api.get('/orders/export', { params });
      return response;
    } catch {
      // Fallback: return data for client-side export
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      let filtered = orders;
      
      if (params?.status) {
        filtered = filtered.filter((o: any) => o.status === params.status);
      }
      
      return {
        data: {
          orders: filtered,
          filename: `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`,
        },
      };
    }
  },
};

// ===== Invoices API =====
export const invoicesAPI = {
  getAll: async (params?: any) => {
    try {
      const response = await api.get('/invoices', { params });
      return response;
    } catch {
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      return { data: { data: invoices, meta: { total: invoices.length } } };
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response;
    } catch {
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      const invoice = invoices.find((i: any) => i.id === id);
      if (!invoice) throw new Error('Invoice not found');
      return { data: invoice };
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/invoices', data);
      return response;
    } catch {
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      const count = invoices.length;
      const invoiceNumber = String(count + 1).padStart(6, '0');
      
      let subtotal = 0;
      const items = data.items.map((item: any) => {
        const total = item.quantity * item.unitPrice;
        subtotal += total;
        return { ...item, totalPrice: total };
      });
      
      const total = subtotal - (data.discount || 0);
      
      const newInvoice = {
        id: Date.now(),
        number: invoiceNumber,
        date: new Date().toISOString(),
        clientName: data.clientName,
        clientCpf: data.clientCpf || '',
        clientAddress: data.clientAddress || '',
        clientPhone: data.clientPhone || '',
        paymentMethod: data.paymentMethod,
        subtotal,
        discount: data.discount || 0,
        total,
        status: 'PENDING',
        items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      invoices.push(newInvoice);
      localStorage.setItem('lingerie_invoices', JSON.stringify(invoices));
      return { data: newInvoice };
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await api.patch(`/invoices/${id}`, data);
      return response;
    } catch {
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      const index = invoices.findIndex((i: any) => i.id === id);
      if (index === -1) throw new Error('Invoice not found');
      
      invoices[index] = { ...invoices[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('lingerie_invoices', JSON.stringify(invoices));
      return { data: invoices[index] };
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response;
    } catch {
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      const filtered = invoices.filter((i: any) => i.id !== id);
      localStorage.setItem('lingerie_invoices', JSON.stringify(filtered));
      return { data: { id } };
    }
  },

  print: async (id: number) => {
    try {
      const response = await api.get(`/invoices/${id}/print`);
      return response;
    } catch {
      // Return a simple print view
      const invoices = JSON.parse(localStorage.getItem('lingerie_invoices') || '[]');
      const invoice = invoices.find((i: any) => i.id === id);
      if (!invoice) throw new Error('Invoice not found');
      return { data: 'print-view' };
    }
  },

  export: async (id: number) => {
    try {
      const response = await api.get(`/invoices/${id}/export`);
      return response;
    } catch {
      return { data: { message: 'Export ready' } };
    }
  },
};

// ===== Visits API =====
export const visitsAPI = {
  getAll: async (params?: any) => {
    try {
      const response = await api.get('/visits', { params });
      return response;
    } catch {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.visits) || '[]');
      let filtered = visits;
      
      if (params?.status) {
        filtered = filtered.filter((v: any) => v.status === params.status);
      }
      if (params?.date) {
        filtered = filtered.filter((v: any) => v.visitDate.split('T')[0] === params.date);
      }
      
      return { data: { data: filtered, meta: { total: filtered.length } } };
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/visits/${id}`);
      return response;
    } catch {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.visits) || '[]');
      const visit = visits.find((v: any) => v.id === id);
      if (!visit) throw new Error('Visit not found');
      return { data: visit };
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/visits', data);
      return response;
    } catch {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.visits) || '[]');
      
      const newVisit = {
        id: Date.now(),
        clientName: data.clientName,
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
        address: data.address,
        visitDate: data.visitDate,
        visitTime: data.visitTime,
        productType: data.productType || '',
        status: 'SCHEDULED',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      visits.push(newVisit);
      localStorage.setItem(STORAGE_KEYS.visits, JSON.stringify(visits));
      return { data: newVisit };
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await api.patch(`/visits/${id}`, data);
      return response;
    } catch {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.visits) || '[]');
      const index = visits.findIndex((v: any) => v.id === id);
      if (index === -1) throw new Error('Visit not found');
      
      visits[index] = { ...visits[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.visits, JSON.stringify(visits));
      return { data: visits[index] };
    }
  },

  complete: async (id: number) => {
    try {
      const response = await api.patch(`/visits/${id}/complete`);
      return response;
    } catch {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.visits) || '[]');
      const index = visits.findIndex((v: any) => v.id === id);
      if (index === -1) throw new Error('Visit not found');
      
      visits[index].status = 'COMPLETED';
      visits[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.visits, JSON.stringify(visits));
      return { data: visits[index] };
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/visits/${id}`);
      return response;
    } catch {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.visits) || '[]');
      const filtered = visits.filter((v: any) => v.id !== id);
      localStorage.setItem(STORAGE_KEYS.visits, JSON.stringify(filtered));
      return { data: { id } };
    }
  },
};

// ===== Settings API =====
export const settingsAPI = {
  get: async () => {
    try {
      const response = await api.get('/settings');
      return response;
    } catch {
      // Fallback to localStorage
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || 'null');
      if (!settings) {
        const defaultSettings = getDefaultSettings();
        localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaultSettings));
        return { data: defaultSettings };
      }
      return { data: settings };
    }
  },

  update: async (data: any) => {
    try {
      const response = await api.patch('/settings', data);
      return response;
    } catch {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || 'null');
      const updated = {
        ...(existing || getDefaultSettings()),
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updated));
      return { data: updated };
    }
  },
};

export default api;
