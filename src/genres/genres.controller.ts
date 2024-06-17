import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { HttpResponse } from '@mdb/utils/api.response';
import { Response } from 'express';

import { CreateGenreDTO } from './dtos/create-genre.dtos';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(
    private readonly genresService: GenresService,
    private httpResponse: HttpResponse,
  ) {}

  @Get('')
  async findAll(@Body() body: CreateGenreDTO, @Res() res: Response) {
    const response = await this.genresService.findAll();
    return this.httpResponse.okResponse(res, '', response);
  }

  @Post('')
  async create(@Body() body: CreateGenreDTO, @Res() res: Response) {
    await this.genresService.create(body);
    return this.httpResponse.createdResponse(
      res,
      'Genre created successfully',
      {},
    );
  }
}
