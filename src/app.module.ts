import { Module } from '@nestjs/common';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SensorDataModule, PrismaModule],
})
export class AppModule {}
