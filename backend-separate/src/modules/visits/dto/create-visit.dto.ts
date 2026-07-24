import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { VisitStatus } from '@prisma/client';

export class CreateVisitDto {
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

  @ApiProperty({ description: 'Visit address', example: 'Rua das Acácias, 456 - Bairro Jardim' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Visit date', example: '2024-01-15' })
  @IsDateString()
  visitDate: string;

  @ApiProperty({ description: 'Visit time', example: '14:30' })
  @IsString()
  visitTime: string;

  @ApiProperty({ description: 'Product type interested', example: 'Conjuntos', required: false })
  @IsString()
  @IsOptional()
  productType?: string;

  @ApiProperty({ description: 'Visit status', enum: VisitStatus, required: false })
  @IsEnum(VisitStatus)
  @IsOptional()
  status?: VisitStatus;

  @ApiProperty({ description: 'Notes about the visit', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
