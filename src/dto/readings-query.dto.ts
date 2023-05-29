import { ArrayOfStrings } from '../decorators/array-of-strings.decorator';
import { IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReadingsQueryDto {
  @ArrayOfStrings()
  types: string[];

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  from: Date;
}
