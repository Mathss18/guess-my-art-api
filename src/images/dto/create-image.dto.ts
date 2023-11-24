import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  text: string;
}
