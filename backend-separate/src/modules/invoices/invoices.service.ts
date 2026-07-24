import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.repository';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';
import * as XLSX from 'xlsx';

@Injectable()
export class InvoicesService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const count = await this.prismaRepository.countOrders();
    const invoiceNumber = String(count + 1).padStart(6, '0');

    // Calculate totals
    let subtotal = 0;
    const items = createInvoiceDto.items.map((item) => {
      const total = item.quantity * item.unitPrice;
      subtotal += total;
      return {
        product: item.product,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: total,
      };
    });

    const discount = createInvoiceDto.discount || 0;
    const total = subtotal - discount;

    const invoice = await this.prismaRepository.createInvoice({
      number: invoiceNumber,
      date: new Date(),
      clientName: createInvoiceDto.clientName,
      clientCpf: createInvoiceDto.clientCpf,
      clientAddress: createInvoiceDto.clientAddress,
      clientPhone: createInvoiceDto.clientPhone,
      paymentMethod: createInvoiceDto.paymentMethod,
      subtotal,
      discount,
      total,
      status: InvoiceStatus.PENDING,
      items: {
        create: items,
      },
    });

    return invoice;
  }

  async findAll(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      this.prismaRepository.findInvoices({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prismaRepository.countOrders(), // approximate count
    ]);

    return {
      data: invoices,
      meta: {
        total: invoices.length,
        page,
        limit,
      },
    };
  }

  async findOne(id: number) {
    const invoice = await this.prismaRepository.findInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.prismaRepository.findInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return this.prismaRepository.updateInvoice(id, updateInvoiceDto);
  }

  async remove(id: number) {
    const invoice = await this.prismaRepository.findInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return this.prismaRepository.deleteInvoice(id);
  }

  async generatePrintView(invoice: any) {
    const settings = await this.prismaRepository.getSettings();
    const storeName = settings?.storeName || 'Lingerie Dona Lingerie';
    const storeAddress = settings?.address || 'Rua das Flores, 123 - Belo Horizonte/MG';
    const storePhone = settings?.phone || '(31) 99999-9999';
    const storeCnpj = settings?.cnpj || '12.345.678/0001-90';
    const storeEmail = settings?.email || 'contato@lingeriedonadona.com.br';

    const formatCurrency = (value: number) => {
      return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const paymentText = {
      CASH: 'Dinheiro',
      PIX: 'Pix',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
    }[invoice.paymentMethod] || invoice.paymentMethod;

    let itemsHtml = '';
    invoice.items.forEach((item: any) => {
      itemsHtml += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.product}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.size || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.color || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(Number(item.unitPrice))}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(Number(item.totalPrice))}</td>
        </tr>
      `;
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nota Fiscal - ${storeName}</title>
  <style>
    body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #000; }
    .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
    .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 3px solid #c18a36; padding-bottom: 20px; }
    .store-info h2 { color: #1a0c0a; font-size: 24px; margin: 0 0 10px 0; }
    .store-info p { margin: 5px 0; font-size: 14px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h3 { color: #c18a36; font-size: 20px; margin: 0 0 10px 0; }
    .invoice-meta p { margin: 5px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #c18a36; color: #fff; padding: 10px; text-align: left; font-size: 13px; }
    td { padding: 8px; font-size: 13px; }
    .totals { text-align: right; margin-top: 20px; }
    .totals .total-line { margin: 8px 0; }
    .totals .total-line.final { font-weight: bold; font-size: 18px; color: #c18a36; border-top: 2px solid #c18a36; padding-top: 10px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    @media print { body { margin: 0; padding: 0; } .invoice-container { border: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="store-info">
        <h2>${storeName}</h2>
        <p>${storeAddress}</p>
        <p>Tel: ${storePhone} | CNPJ: ${storeCnpj}</p>
        <p>${storeEmail}</p>
      </div>
      <div class="invoice-logo" style="font-size: 48px;">💋</div>
    </div>
    
    <div class="invoice-meta">
      <h3>Nota Fiscal #${invoice.number}</h3>
      <p><strong>Data:</strong> ${formatDate(invoice.date)}</p>
      <p><strong>Status:</strong> ${invoice.status}</p>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Tamanho</th>
          <th>Cor</th>
          <th>Qtde</th>
          <th>Preço Unit.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <div class="totals">
      <div class="total-line"><span>Subtotal:</span> <span>${formatCurrency(Number(invoice.subtotal))}</span></div>
      <div class="total-line"><span>Desconto:</span> <span>${formatCurrency(Number(invoice.discount))}</span></div>
      <div class="total-line final"><span>TOTAL:</span> <span>${formatCurrency(Number(invoice.total))}</span></div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
      <p><strong>Cliente:</strong> ${invoice.clientName}</p>
      <p><strong>CPF:</strong> ${invoice.clientCpf || 'Não informado'}</p>
      <p><strong>Endereço:</strong> ${invoice.clientAddress || 'Não informado'}</p>
      <p><strong>Telefone:</strong> ${invoice.clientPhone || 'Não informado'}</p>
      <p><strong>Pagamento:</strong> ${paymentText}</p>
    </div>
    
    <div class="footer">
      <p>Obrigada por comprar na ${storeName}! | www.${storeName.toLowerCase().replace(/\s/g, '')}.com.br</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  async exportToExcel(id: number) {
    const invoice = await this.findOne(id);
    const settings = await this.prismaRepository.getSettings();

    const worksheetData = invoice.items.map((item: any) => ({
      'Produto': item.product,
      'Tamanho': item.size || '',
      'Cor': item.color || '',
      'Quantidade': item.quantity,
      'Preço Unitário': Number(item.unitPrice).toFixed(2),
      'Total': Number(item.totalPrice).toFixed(2),
    }));

    // Add summary rows
    worksheetData.push({});
    worksheetData.push({
      'Produto': 'SUBTOTAL',
      'Total': Number(invoice.subtotal).toFixed(2),
    });
    worksheetData.push({
      'Produto': 'DESCONTO',
      'Total': Number(invoice.discount).toFixed(2),
    });
    worksheetData.push({
      'Produto': 'TOTAL',
      'Total': Number(invoice.total).toFixed(2),
    });

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nota Fiscal');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return {
      filename: `nota_fiscal_${invoice.number}.xlsx`,
      buffer: Buffer.from(buffer).toString('base64'),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }
}
