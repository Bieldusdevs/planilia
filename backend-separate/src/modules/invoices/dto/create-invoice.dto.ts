import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {
  @ApiProperty({ description: 'Product name', example: 'Conjunto de seda' })
  @IsString()
  product: string;

  @ApiProperty({ description: 'Product size', example: 'M', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ description: 'Product color', example: 'Preto', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ description: 'Quantity', example: 1, minimum: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 89.9, minimum: 0 })
  @IsNumber()
  unitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Invoice number', example: '000001', required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ description: 'Invoice date', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ description: 'Client name', example: 'Maria Silva' })
  @IsString()
  clientName: string;

  @ApiProperty({ description: 'Client CPF', example: '123.456.789-00', required: false })
  @IsString()
  @IsOptional()
  clientCpf?: string;

  @ApiProperty({ description: 'Client address', required: false })
  @IsString()
  @IsOptional()
  clientAddress?: string;

  @ApiProperty({ description: 'Client phone', required: false })
  @IsString()
  @IsOptional()
  clientPhone?: string;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Discount amount', default: 0 })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty({ description: 'Invoice items', type: [CreateInvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
