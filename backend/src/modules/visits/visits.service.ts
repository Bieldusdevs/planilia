import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.repository';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { VisitStatus } from '@prisma/client';

@Injectable()
export class VisitsService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async create(createVisitDto: CreateVisitDto) {
    const visitDate = new Date(createVisitDto.visitDate);
    return this.prismaRepository.createVisit({
      clientName: createVisitDto.clientName,
      clientPhone: createVisitDto.clientPhone,
      clientEmail: createVisitDto.clientEmail,
      address: createVisitDto.address,
      visitDate,
      visitTime: createVisitDto.visitTime,
      productType: createVisitDto.productType,
      status: VisitStatus.SCHEDULED,
      notes: createVisitDto.notes,
    });
  }

  async findAll(params: { status?: string; date?: string }) {
    const { status, date } = params;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.visitDate = { gte: startDate, lte: endDate };
    }

    const visits = await this.prismaRepository.findVisits({
      where,
      orderBy: { visitDate: 'asc' },
    });

    return {
      data: visits,
      meta: { total: visits.length },
    };
  }

  async findOne(id: number) {
    const visit = await this.prismaRepository.findVisitById(id);
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async update(id: number, updateVisitDto: UpdateVisitDto) {
    const visit = await this.prismaRepository.findVisitById(id);
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    const updateData: any = { ...updateVisitDto };
    if (updateVisitDto.visitDate) {
      updateData.visitDate = new Date(updateVisitDto.visitDate);
    }

    return this.prismaRepository.updateVisit(id, updateData);
  }

  async complete(id: number) {
    const visit = await this.prismaRepository.findVisitById(id);
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return this.prismaRepository.updateVisit(id, { status: VisitStatus.COMPLETED });
  }

  async remove(id: number) {
    const visit = await this.prismaRepository.findVisitById(id);
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return this.prismaRepository.deleteVisit(id);
  }
}
