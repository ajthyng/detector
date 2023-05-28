import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { SCD30DataDto } from '../dto/scd30-data.dto';
import { SensorDataService } from './sensor-data.service';
import { Response } from 'express';
import {
  CO2ReadingDto,
  HumidityReadingDto,
  TemperatureReadingDto,
} from '../dto/create-reading.dto';
import { ReadingsQueryDto } from '../dto/readings-query.dto';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post('/scd30')
  async receive(@Body() scd30Data: SCD30DataDto) {
    await this.sensorDataService.recordReadings([
      new CO2ReadingDto(scd30Data.co2.value, scd30Data.co2.units),
      new TemperatureReadingDto(
        scd30Data.temperature.value,
        scd30Data.temperature.units,
      ),
      new HumidityReadingDto(
        scd30Data.humidity.value,
        scd30Data.humidity.units,
      ),
    ]);
  }

  @Get('/scd30')
  async getReadings(@Query() query: ReadingsQueryDto) {
    const { readings, count } = await this.sensorDataService.getReadings(
      query.types,
    );

    return {
      readings,
      total: count,
    };
  }

  @Get('/subscribe/:sensor/:type')
  async subscribe(
    @Res() res: Response,
    @Param('sensor') sensor: string,
    @Param('type') type: string,
    @Query('duration') duration: number,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const initialAverage = await this.sensorDataService.getAverage(
      sensor,
      type,
      duration,
    );
    res.write(`${Math.round(initialAverage * 100) / 100}\n\n`);

    await this.sensorDataService.subscribeToReadings(async (data) => {
      if (data.sensor === sensor && data.type === type) {
        const average = await this.sensorDataService.getAverage(
          data.sensor,
          data.type,
          duration,
        );
        res.write(`${Math.round(average * 100) / 100}\n\n`);
      }
    });
  }

  @Get('/average/:sensor/:type')
  async getAverage(
    @Param('sensor') sensor: string,
    @Param('type') type: string,
    @Query('duration') duration: number,
  ) {
    return this.sensorDataService.getAverage(sensor, type, duration);
  }
}
