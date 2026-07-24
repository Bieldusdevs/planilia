import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsInt, Min } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ description: 'Store name', example: 'Lingerie Dona Lingerie', required: false })
  @IsString()
  @IsOptional()
  storeName?: string;

  @ApiProperty({ description: 'Store phone', example: '(31) 99999-9999', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Store email', example: 'contato@lingeriedonadona.com.br', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Store CNPJ', example: '12.345.678/0001-90', required: false })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ description: 'Store address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Instagram handle', required: false })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ description: 'Facebook page', required: false })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiProperty({ description: 'Primary color (hex)', example: '#c18a36', required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ description: 'Secondary color (hex)', example: '#1a0c0a', required: false })
  @IsString()
  @IsOptional()
  secondaryColor?: string;
}
