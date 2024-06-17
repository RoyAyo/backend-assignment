import { response } from 'express';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpResponse } from '@mdb/utils/api.response';
import { Movie } from '@mdb/movies/entity/movies.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { User } from '@mdb/users/entity/users.entity';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  const reviews = [
    {
      id: 1,
      movie: { id: 1 },
      user: { id: 1 },
      rating: 5,
      comment: 'Bad film',
    },
  ];

  const MockHttpResponse = {
    okResponse: jest.fn((res: Response, message: string, data: any) => data),
    createdResponse: jest.fn(
      (res: Response, message: string, data: any) => data,
    ),
  };

  let MockReviewService = {
    getMovieReviews: jest.fn().mockResolvedValue(reviews),
    rateMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        ReviewsService,
        HttpResponse,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: Repository,
        },
      ],
    })
      .overrideProvider(HttpResponse)
      .useValue(MockHttpResponse)
      .overrideProvider(ReviewsService)
      .useValue(MockReviewService)
      .compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get reviews of a movie', async () => {
    expect(await controller.getMovieReviews(1, response)).toEqual(reviews);
    expect(MockReviewService.getMovieReviews).toHaveBeenCalled();
  });

  it('should add a review to a movie', async () => {
    const user: any = {
      id: 1,
    };
    const body = {
      comment: 'Garbage!',
      rating: 2,
    };
    const movieId = 1;
    await controller.rateMovie(user, movieId, body, response);
    expect(MockReviewService.rateMovie).toHaveBeenCalledWith(
      body,
      user,
      movieId,
    );
  });
});
