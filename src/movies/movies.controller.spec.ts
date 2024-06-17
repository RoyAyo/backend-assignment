import { Test, TestingModule } from '@nestjs/testing';
import { response } from 'express';

import { HttpResponse } from '@mdb/utils/api.response';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  let MockMoviesService = {
    create: jest.fn((body) => body),
    findAll: jest.fn(() => body),
    findOne: jest.fn((id) => body[id]),
  };

  const MockHttpResponse = {
    okResponse: jest.fn((res: Response, message: string, data: any) => data),
    createdResponse: jest.fn(
      (res: Response, message: string, data: any) => data,
    ),
  };

  const body = [
    {
      title: 'Interstellar',
      releaseDate: '2014',
      description: 'Amazing Movie',
      genreIds: [1, 2],
    },
    {
      title: 'Inception',
      releaseDate: '2010',
      description: 'Great Movie',
      genreIds: [1, 2],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService, HttpResponse],
    })
      .overrideProvider(HttpResponse)
      .useValue(MockHttpResponse)
      .overrideProvider(MoviesService)
      .useValue(MockMoviesService)
      .compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create movie', async () => {
    await controller.create(body[0], response);
    expect(service.create).toHaveBeenCalledWith(body[0]);
  });

  it('should return all movies', async () => {
    expect(await controller.find(response)).toEqual(body);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single movie of the passed id', async () => {
    expect(await controller.findOne(response, 1)).toEqual(body[1]);
    expect(await controller.findOne(response, 2)).toEqual(body[2]);
  });
});
