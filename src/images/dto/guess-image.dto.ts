import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class GuessImageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  text: string;
}
