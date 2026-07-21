// ===== Auth Types =====
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'SELLER';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// ===== Order Types =====
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export interface Order {
  id: number;
  number: string;
  date: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address?: string;
  product: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  payment?: PaymentMethod;
  observation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address?: string;
  product: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  status?: OrderStatus;
  payment?: PaymentMethod;
  observation?: string;
}

// ===== Invoice Types =====
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface InvoiceItem {
  id: number;
  product: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: number;
  number: string;
  date: string;
  clientName: string;
  clientCpf?: string;
  clientAddress?: string;
  clientPhone?: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  clientName: string;
  clientCpf?: string;
  clientAddress?: string;
  clientPhone?: string;
  paymentMethod: PaymentMethod;
  discount?: number;
  items: {
    product: string;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
  }[];
}

// ===== Visit Types =====
export type VisitStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Visit {
  id: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  visitDate: string;
  visitTime: string;
  productType?: string;
  status: VisitStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitDto {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  visitDate: string;
  visitTime: string;
  productType?: string;
  notes?: string;
}

// ===== Settings Types =====
export interface StoreSetting {
  id: number;
  storeName: string;
  phone?: string;
  email?: string;
  cnpj?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
  updatedAt: string;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}
