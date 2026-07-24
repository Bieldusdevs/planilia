import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';
import * as XLSX from 'xlsx';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async create(createOrderDto: CreateOrderDto) {
    // Generate order number
    const count = await this.prismaRepository.countOrders();
    const orderNumber = String(count + 1).padStart(4, '0');

    const totalPrice = createOrderDto.quantity * createOrderDto.unitPrice;

    const order = await this.prismaRepository.createOrder({
      number: orderNumber,
      date: new Date(),
      clientName: createOrderDto.clientName,
      clientPhone: createOrderDto.clientPhone,
      clientEmail: createOrderDto.clientEmail,
      address: createOrderDto.address,
      product: createOrderDto.product,
      size: createOrderDto.size,
      color: createOrderDto.color,
      quantity: createOrderDto.quantity,
      unitPrice: createOrderDto.unitPrice,
      totalPrice,
      status: createOrderDto.status || OrderStatus.PENDING,
      payment: createOrderDto.payment,
      observation: createOrderDto.observation,
    });

    return order;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 50, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { product: { contains: search, mode: 'insensitive' } },
        { clientPhone: { contains: search, mode: 'insensitive' } },
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prismaRepository.findOrders({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaRepository.countOrders(where),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const order = await this.prismaRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prismaRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const totalPrice = (updateOrderDto.quantity || order.quantity) * 
                       (updateOrderDto.unitPrice || Number(order.unitPrice));

    return this.prismaRepository.updateOrder(id, {
      ...updateOrderDto,
      totalPrice,
    });
  }

  async remove(id: number) {
    const order = await this.prismaRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.prismaRepository.deleteOrder(id);
  }

  async exportToExcel(params: { status?: string; search?: string }) {
    const { status, search } = params;
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { product: { contains: search, mode: 'insensitive' } },
        { clientPhone: { contains: search, mode: 'insensitive' } },
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orders = await this.prismaRepository.findOrders({ where, orderBy: { createdAt: 'desc' } });

    const worksheetData = orders.map((o) => ({
      'Número do Pedido': o.number,
      'Data': new Date(o.date).toLocaleDateString('pt-BR'),
      'Cliente': o.clientName,
      'Telefone': o.clientPhone || '',
      'Email': o.clientEmail || '',
      'Endereço': o.address || '',
      'Produto': o.product,
      'Tamanho': o.size || '',
      'Cor': o.color || '',
      'Quantidade': o.quantity,
      'Preço Unitário': Number(o.unitPrice).toFixed(2),
      'Total': Number(o.totalPrice).toFixed(2),
      'Status': o.status,
      'Pagamento': o.payment || '',
      'Observação': o.observation || '',
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');

    // Auto-adjust column widths
    const cols = [
      { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 18 },
      { wch: 25 }, { wch: 30 }, { wch: 25 }, { wch: 10 },
      { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 30 },
    ];
    ws['!cols'] = cols;

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return {
      filename: `pedidos_lingerie_${new Date().toISOString().split('T')[0]}.xlsx`,
      buffer: Buffer.from(buffer).toString('base64'),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      count: orders.length,
    };
  }
}
