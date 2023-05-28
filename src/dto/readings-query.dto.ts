import { ArrayOfStrings } from '../decorators/array-of-strings.decorator';

export class ReadingsQueryDto {
  @ArrayOfStrings()
  types: string[];
}
