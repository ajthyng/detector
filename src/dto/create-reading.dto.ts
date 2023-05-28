import { Sensors } from '../sensor-data/constants/sensors.enum';
import { Readings } from '../sensor-data/constants/readings.enum';

export class CreateReadingDto {
  type: string;
  value: string;
  units: string;
  sensor: string;
}

export class CO2ReadingDto implements CreateReadingDto {
  type = Readings.CO2;
  sensor = Sensors.SCD30;

  constructor(value: string, units: string) {
    this.value = value;
    this.units = units;
  }

  value: string;
  units: string;
}

export class TemperatureReadingDto implements CreateReadingDto {
  type = Readings.TEMPERATURE;
  sensor = Sensors.SCD30;

  constructor(value: string, units: string) {
    this.value = value;
    this.units = units;
  }

  value: string;
  units: string;
}

export class HumidityReadingDto implements CreateReadingDto {
  type = Readings.HUMIDITY;
  sensor = Sensors.SCD30;

  constructor(value: string, units: string) {
    this.value = value;
    this.units = units;
  }

  value: string;
  units: string;
}
