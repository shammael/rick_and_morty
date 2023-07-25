import { IsString } from 'class-validator';

export class GetOneRequestDto {
  @IsString()
  id: string;
}
