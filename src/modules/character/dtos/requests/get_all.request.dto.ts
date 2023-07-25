import { CharacterState, CharacterStatus, Specy } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { DynamicFilterValue } from '../../decorators';

export class GetAllParamsDtos {
  @IsEnum(['specy', 'state', 'status'], {
    message(validationArguments) {
      return `${validationArguments.value} is not in [ ${validationArguments.constraints}]`;
    },
  })
  @IsOptional()
  filter_type: 'specy' | 'status' | 'state';
  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: string;
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  page: string;
  @DynamicFilterValue()
  @IsOptional()
  filter_value: Specy | CharacterStatus | CharacterState;
}
