import { Module } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { SensorDataController } from './sensor-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reading } from '../entities/reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reading])],
  providers: [SensorDataService],
  controllers: [SensorDataController],
})
export class SensorDataModule {}
