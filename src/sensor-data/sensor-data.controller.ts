import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { SCD30DataDto } from '../dto/scd30-data.dto';
import { SensorDataService } from './sensor-data.service';
import { Sensors } from './constants/sensors.enum';
import { Readings } from './constants/readings.enum';
import { Response } from 'express';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post('/scd30')
  async receive(@Body() scd30Data: SCD30DataDto) {
    await this.sensorDataService.recordReadings({
      sensor: Sensors.SCD30,
      type: Readings.CO2,
      units: scd30Data.co2.units,
      value: scd30Data.co2.value,
    });

    await this.sensorDataService.recordReadings({
      sensor: Sensors.SCD30,
      type: Readings.TEMPERATURE,
      units: scd30Data.temperature.units,
      value: scd30Data.temperature.value,
    });

    await this.sensorDataService.recordReadings({
      sensor: Sensors.SCD30,
      type: Readings.HUMIDITY,
      units: scd30Data.humidity.units,
      value: scd30Data.humidity.value,
    });
  }

  @Get('/scd30')
  async getReadings() {
    const { readings, count } = await this.sensorDataService.getReadings();

    return {
      readings,
      total: count,
    };
  }

  @Get('/subscribe/:sensor')
  async subscribe(@Res() res: Response, @Param('sensor') sensor: string) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    await this.sensorDataService.subscribeToReadings((data) => {
      res.write(JSON.stringify(data));
    });
  }
}
