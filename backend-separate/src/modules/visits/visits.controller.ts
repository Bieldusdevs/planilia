import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('visits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a new home visit' })
  async create(@Body() createVisitDto: CreateVisitDto) {
    return this.visitsService.create(createVisitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all visits' })
  @ApiQuery({ name: 'status', required: false, enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date (YYYY-MM-DD)' })
  async findAll(
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.visitsService.findAll({ status, date });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single visit by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a visit' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVisitDto: UpdateVisitDto,
  ) {
    return this.visitsService.update(id, updateVisitDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a visit as completed' })
  async complete(@Param('id', ParseIntPipe) id: number) {
    return this.visitsService.complete(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visit' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.visitsService.remove(id);
  }
}
