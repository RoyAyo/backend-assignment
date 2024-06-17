import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MoviesService } from '@mdb/movies/movies.service';
import { Review } from './entity/reviews.entity';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;

  let reviews = [
    {
      id: 1,
      rating: 5,
      comment: 'Yes',
      movie: {
        id: 1,
      },
      user: {
        id: 2,
      },
    },
  ];

  let movies: any = [
    {
      id: 1,
      name: 'Interstellar',
      releaseDate: '01-01-2014',
      noOfReviews: 60,
      rating: 5,
    },
    {
      id: 2,
      name: 'Inception',
      releaseDate: '01-01-2010',
      noOfReviews: 10,
      rating: 4,
    },
    {
      id: 3,
      name: 'Dunkirk',
      releaseDate: '01-01-2017',
      noOfReviews: 12,
      rating: 3,
    },
    {
      id: 4,
      name: 'The Godfather',
      releaseDate: '01-01-1972',
      noOfReviews: 120,
      rating: 5,
    },
  ];

  const MockReviewRepository = {
    findOne: jest.fn().mockImplementation((fn) => {
      const movieId = fn?.where?.movie?.id;
      const userId = fn?.where?.user?.id;
      if (userId) {
        return reviews.find(
          (review: any) =>
            review.movie.id === movieId && review.user.id === userId,
        );
      }
      return reviews.find((review: any) => review.movie.id === movieId);
    }),
    find: jest.fn().mockImplementation((fn) => {
      const movieId = fn?.where?.movie?.id;
      return reviews.filter((review: any) => review.movie.id === movieId);
    }),
    create: jest.fn((body: Review) => {
      reviews.push({
        id: reviews.length + 1,
        ...body,
      });
    }),
    save: jest.fn((body) => body),
  };

  const MockMoviesService = {
    findOne: jest.fn((id) => {
      if (movies[id - 1]) {
        return movies[id - 1];
      }
      throw new Error('Invalid movie');
    }),
    updateReview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: MockReviewRepository,
        },
        MoviesService,
      ],
    })
      .overrideProvider(MoviesService)
      .useValue(MockMoviesService)
      .compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get movie reviews', async () => {
    const movieId = 1;
    expect(await service.getMovieReviews(movieId)).toHaveLength(1);
  });

  describe('GET MOVIE REVIEW', () => {
    const users: any = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];

    it('should add a new review to a movie', async () => {
      const newReview = {
        comment: 'Garbage!',
        rating: 1,
      };
      await service.rateMovie(newReview, users[0], 1);
      expect(reviews.length).toBe(2);
      expect(reviews[1].user).toEqual({ id: 1 });
      expect(reviews[1].movie).toEqual({ id: 1 });
    });

    it('should throw an error if user previously rated', async () => {
      const newReview = {
        comment: 'Garbage!',
        rating: 2,
      };
      await expect(service.rateMovie(newReview, users[0], 1)).rejects.toThrow(
        new HttpException('User already rated the movie', HttpStatus.CONFLICT),
      );
    });
  });

  it('should get the movie review after new addition', async () => {
    const movieId = 1;
    expect(await service.getMovieReviews(movieId)).toHaveLength(2);
  });
});
