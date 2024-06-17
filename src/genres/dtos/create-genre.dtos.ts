import { IsString, IsNotEmpty, IsArray, IsDate } from 'class-validator';

export class CreateGenreDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
