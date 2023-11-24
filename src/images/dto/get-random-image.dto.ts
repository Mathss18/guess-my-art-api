import { IsArray } from 'class-validator';

export class GetRandomImageDto {
  @IsArray()
  exclude: string[];
}
