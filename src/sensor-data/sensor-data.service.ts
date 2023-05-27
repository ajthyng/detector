import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReadingDto } from '../dto/create-reading.dto';

@Injectable()
export class SensorDataService {
  constructor(private prisma: PrismaService) {}

  async getReadings() {
    return this.prisma.reading.findMany();
  }

  async recordReadings(createReadingDTO: CreateReadingDto) {
    return this.prisma.reading.create({
      data: createReadingDTO,
    });
  }
}
