import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Genre } from './entity/genres.entity';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { HttpResponse } from '@mdb/utils/api.response';
import { Repository } from 'typeorm';

describe('GenresController', () => {
  let controller: GenresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        GenresService,
        HttpResponse,
        {
          provide: getRepositoryToken(Genre),
          useValue: Repository,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
