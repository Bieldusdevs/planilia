import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.repository';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async findByEmail(email: string) {
    return this.prismaRepository.findUserByEmail(email);
  }

  async findById(id: number) {
    return this.prismaRepository.findUserById(id);
  }

  async create(data: { email: string; password: string; name: string; role?: UserRole }) {
    return this.prismaRepository.createUser(data);
  }
}
