import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '@mdb/auth/auth.guard';
import { CurrentUser } from '@mdb/users/current-user.decorator';
import { HttpResponse } from '@mdb/utils/api.response';
import { RateMovieDTO } from './dtos/rate-movie.dtos';
import { ReviewsService } from './reviews.service';
import { User } from '@mdb/users/entity/users.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewService: ReviewsService,
    private http: HttpResponse,
  ) {}

  @Get('/movie/:movieId')
  async getMovieReviews(
    @Param('movieId', new ParseIntPipe({})) movieId: number,
    @Res() res: Response,
  ) {
    const response = await this.reviewService.getMovieReviews(movieId);
    return this.http.okResponse(res, '', response);
  }

  @UseGuards(AuthGuard)
  @Post('movie/:movieId')
  async rateMovie(
    @CurrentUser() user: User,
    @Param('movieId', new ParseIntPipe({})) movieId: number,
    @Body() body: RateMovieDTO,
    @Res() res: Response,
  ) {
    await this.reviewService.rateMovie(body, user, movieId);
    return this.http.createdResponse(res, 'Movie successfully rated', {});
  }
}
