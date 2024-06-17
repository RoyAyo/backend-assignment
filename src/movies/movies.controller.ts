import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { HttpResponse } from '@mdb/utils/api.response';
import { CreateMovieDTO } from './dtos/create-movie.dtos';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private http: HttpResponse,
  ) {}

  @Get('')
  async find(
    @Res() res: Response,
    @Query('genres') genre?: string,
    @Query('rating') rating?: string,
  ) {
    const genres =
      genre && genre.split(',').map((genre) => genre.toLowerCase());
    const response = await this.moviesService.findAll(genres, rating);
    return this.http.okResponse(res, '', response);
  }

  @Get('/:id')
  async findOne(
    @Res() res: Response,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const response = await this.moviesService.findOne(id);
    return this.http.okResponse(res, '', response);
  }

  @Post('')
  async create(@Body() body: CreateMovieDTO, @Res() res: Response) {
    await this.moviesService.create(body);
    return this.http.createdResponse(res, 'Movie created successfully', {});
  }
}
