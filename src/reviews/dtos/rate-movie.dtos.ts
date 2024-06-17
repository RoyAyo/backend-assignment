import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class RateMovieDTO {
  @IsString()
  @IsOptional()
  comment: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
}
