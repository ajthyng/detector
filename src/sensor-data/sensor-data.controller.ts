import { Body, Controller, Get, Post } from '@nestjs/common';
import { SCD30DataDto } from '../dto/scd30-data.dto';
import { SensorDataService } from './sensor-data.service';
import { Sensors } from './constants/sensors.enum';
import { Readings } from './constants/readings.enum';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post('/scd30')
  async receive(@Body() scd30Data: SCD30DataDto) {
    await this.sensorDataService.recordReadings({
      sensor: Sensors.SCD30,
      reading: Readings.CO2,
      unit: scd30Data.co2.unit,
      value: scd30Data.co2.value,
    });

    await this.sensorDataService.recordReadings({
      sensor: Sensors.SCD30,
      reading: Readings.TEMPERATURE,
      unit: scd30Data.temperature.unit,
      value: scd30Data.temperature.value,
    });

    await this.sensorDataService.recordReadings({
      sensor: Sensors.SCD30,
      reading: Readings.HUMIDITY,
      unit: scd30Data.humidity.unit,
      value: scd30Data.humidity.value,
    });
  }

  @Get('/scd30')
  async getReadings() {
    const readings = await this.sensorDataService.getReadings();

    return {
      readings,
      total: readings.length,
    };
  }
}
