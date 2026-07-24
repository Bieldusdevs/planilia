import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Order, Invoice, InvoiceItem, Visit, StoreSetting } from '@prisma/client';

@Injectable()
export class PrismaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ===== USER =====
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { email: string; password: string; name: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // ===== ORDERS =====
  async findOrders(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<Order[]> {
    return this.prisma.order.findMany(params);
  }

  async findOrderById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async findOrderByNumber(number: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { number } });
  }

  async createOrder(data: any): Promise<Order> {
    return this.prisma.order.create({ data });
  }

  async updateOrder(id: number, data: any): Promise<Order> {
    return this.prisma.order.update({ where: { id }, data });
  }

  async deleteOrder(id: number): Promise<Order> {
    return this.prisma.order.delete({ where: { id } });
  }

  async countOrders(where?: any): Promise<number> {
    return this.prisma.order.count({ where });
  }

  // ===== INVOICES =====
  async findInvoices(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<Invoice[]> {
    return this.prisma.invoice.findMany(params);
  }

  async findInvoiceById(id: number): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async createInvoice(data: any): Promise<Invoice> {
    return this.prisma.invoice.create({ data });
  }

  async updateInvoice(id: number, data: any): Promise<Invoice> {
    return this.prisma.invoice.update({ where: { id }, data });
  }

  async deleteInvoice(id: number): Promise<Invoice> {
    return this.prisma.invoice.delete({ where: { id } });
  }

  // ===== VISITS =====
  async findVisits(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<Visit[]> {
    return this.prisma.visit.findMany(params);
  }

  async findVisitById(id: number): Promise<Visit | null> {
    return this.prisma.visit.findUnique({ where: { id } });
  }

  async createVisit(data: any): Promise<Visit> {
    return this.prisma.visit.create({ data });
  }

  async updateVisit(id: number, data: any): Promise<Visit> {
    return this.prisma.visit.update({ where: { id }, data });
  }

  async deleteVisit(id: number): Promise<Visit> {
    return this.prisma.visit.delete({ where: { id } });
  }

  // ===== SETTINGS =====
  async getSettings(): Promise<StoreSetting | null> {
    return this.prisma.storeSetting.findFirst();
  }

  async updateSettings(data: any): Promise<StoreSetting> {
    const existing = await this.getSettings();
    if (existing) {
      return this.prisma.storeSetting.update({ where: { id: existing.id }, data });
    }
    return this.prisma.storeSetting.create({ data });
  }
}
