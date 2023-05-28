import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { isEmpty } from 'lodash';

export const ArrayOfStrings = () =>
  applyDecorators(
    IsString({ each: true }),
    Transform(({ value }) => {
      return convertCommaSeparatedStringToArray(value);
    }),
  );

export const convertCommaSeparatedStringToArray = (value: any) => {
  return value
    ?.split?.(',')
    .map((val?: string) => val?.trim?.())
    .filter(
      (val?: string) => !isEmpty(val) && val !== 'null' && val !== 'undefined',
    );
};
