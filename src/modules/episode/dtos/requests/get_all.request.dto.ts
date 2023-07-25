import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class GetAllEpisodeParams {
  @IsPositive()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: string;
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  page: string;
  @IsEnum(['name', 'code', 'character'], {
    message(validationArguments) {
      return `${validationArguments.value} is not in [ ${validationArguments.constraints}]`;
    },
  })
  @IsOptional()
  filter_type: 'name' | 'code' | 'character';
  @IsString()
  @IsOptional()
  filter_value: string;
}
