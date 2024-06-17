import { IsString, IsNotEmpty, IsArray, IsDate } from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  genreIds: number[];

  @IsString()
  releaseDate?: string;
}
