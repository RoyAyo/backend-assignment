import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Movie } from './entity/movies.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  const genres = [
    {
      id: 1,
      name: 'Sci-fi',
    },
    {
      id: 2,
      name: 'Drama',
    },
    {
      id: 3,
      name: 'Crime',
    },
  ];

  let movies: any = [
    {
      id: 1,
      name: 'Interstellar',
      releaseDate: '01-01-2014',
      noOfReviews: 60,
      rating: 5,
      genres: [genres[1], genres[2]],
    },
    {
      id: 2,
      name: 'Inception',
      releaseDate: '01-01-2010',
      noOfReviews: 10,
      rating: 4,
      genres: [genres[2], genres[3]],
    },
    {
      id: 3,
      name: 'Dunkirk',
      releaseDate: '01-01-2017',
      noOfReviews: 12,
      rating: 3,
      genres: [genres[3]],
    },
    {
      id: 4,
      name: 'The Godfather',
      releaseDate: '01-01-1972',
      noOfReviews: 120,
      rating: 5,
      genres: [genres[3]],
    },
  ];

  const MockMovieRepository = {
    find: jest.fn().mockResolvedValue(movies),
    findOne: jest.fn().mockImplementation((fn) => {
      const id = fn?.where?.id;
      return movies.find((movie: any) => movie.id === id);
    }),
    create: jest.fn((body) => body),
    save: jest.fn((body) => body),
    merge: jest.fn((movie, updated) => {
      movies[movie.id - 1] = {
        ...movie,
        ...updated,
      };
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: MockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all movies', async () => {
    expect(await service.findAll()).toEqual(movies);
  });

  describe('FindOne', () => {
    it('should return a single movie based on id', async () => {
      expect(await service.findOne(1)).toEqual(movies[0]);
      expect(await service.findOne(3)).toEqual(movies[2]);
    });
  });

  describe('update review', () => {
    it('should update the rating', async () => {
      await service.updateReview(movies[2], 5);
      expect(movies[2].rating).toBeCloseTo(3.2, 1);
    });
  });
});
