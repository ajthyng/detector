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
import { buildSSEMessage, setSSEResponseHeaders } from '../util/sse.helpers';
import { SensorDataEvents } from './constants/sensor-data-events.enum';
import { Readings } from './constants/readings.enum';

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
      query.from,
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
    setSSEResponseHeaders(res);

    await this.sensorDataService.subscribeToReadings(async (data) => {
      if (data.sensor === sensor && data.type === type) {
        const average = await this.sensorDataService.getAverage(
          data.sensor,
          data.type,
          duration,
        );

        switch (data.type) {
          case Readings.CO2:
            res.write(
              buildSSEMessage(
                `{"value":${average},"unit":"${data.units}"}`,
                SensorDataEvents.CO2_AVERAGE,
              ),
            );
            break;
          case Readings.TEMPERATURE:
            res.write(
              buildSSEMessage(
                `{"value":${average},"unit":"${data.units}"}`,
                SensorDataEvents.TEMPERATURE_AVERAGE,
              ),
            );
            break;
          case Readings.HUMIDITY:
            res.write(
              buildSSEMessage(
                `{"value":${average},"unit":"${data.units}"}`,
                SensorDataEvents.HUMIDITY_AVERAGE,
              ),
            );
            break;
        }
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
