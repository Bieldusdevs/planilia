import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  IsPhoneNumber,
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ description: 'Order number', example: '0001', required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ description: 'Order date', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ description: 'Client name', example: 'Maria Silva' })
  @IsString()
  clientName: string;

  @ApiProperty({ description: 'Client phone', example: '(31) 99999-9999', required: false })
  @IsString()
  @IsOptional()
  clientPhone?: string;

  @ApiProperty({ description: 'Client email', example: 'maria@email.com', required: false })
  @IsString()
  @IsOptional()
  clientEmail?: string;

  @ApiProperty({ description: 'Delivery address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

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
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 89.9, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Order status', enum: OrderStatus, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod, required: false })
  @IsEnum(PaymentMethod)
  @IsOptional()
  payment?: PaymentMethod;

  @ApiProperty({ description: 'Observations', required: false })
  @IsString()
  @IsOptional()
  observation?: string;
}
