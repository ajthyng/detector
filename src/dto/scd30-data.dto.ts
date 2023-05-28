import { IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Quantity {
  @IsNumber()
  value: string;

  @IsString()
  @MinLength(1)
  units: string;
}

export class SCD30DataDto {
  @ValidateNested()
  @Type(() => Quantity)
  co2: Quantity;

  @ValidateNested()
  @Type(() => Quantity)
  temperature: Quantity;

  @ValidateNested()
  @Type(() => Quantity)
  humidity: Quantity;
}
