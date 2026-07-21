import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.repository';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async findOne() {
    const settings = await this.prismaRepository.getSettings();
    if (!settings) {
      // Create default settings
      return this.prismaRepository.updateSettings({
        storeName: 'Lingerie Dona Lingerie',
        phone: '(31) 99999-9999',
        email: 'contato@lingeriedonadona.com.br',
        cnpj: '12.345.678/0001-90',
        address: 'Rua das Flores, 123 - Bairro Jardim das Acácias - Belo Horizonte/MG',
        instagram: '@lingeriedonadona',
        facebook: 'LingerieDonaLingerie',
        primaryColor: '#c18a36',
        secondaryColor: '#1a0c0a',
      });
    }
    return settings;
  }

  async update(updateSettingDto: UpdateSettingDto) {
    return this.prismaRepository.updateSettings(updateSettingDto);
  }
}
