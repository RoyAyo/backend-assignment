import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMovieDTO } from './dtos/create-movie.dtos';
import { Movie } from './entity/movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
  ) {}

  async findOne(movieId: number) {
    const movie = await this.moviesRepository.findOne({
      where: {
        id: movieId,
      },
      relations: ['genres'],
    });
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  async findAll(genres: string[] = [], rating?: string) {
    if (genres.length > 0 && Array.isArray(genres)) {
      const movies = await this.moviesRepository
        .createQueryBuilder('movies')
        .leftJoinAndSelect('movies.genres', 'genres')
        .where('LOWER(genres.name) IN (:...genres)', { genres })
        .getMany();
      return movies;
    }
    if (rating) {
      // use bayessian average to rate based on score and count
      const minReviewCount = 5;
      const globalAverageRating = 3.0;
      const movies = await this.moviesRepository
        .createQueryBuilder('movies')
        .addSelect(
          `(
          (movies.rating * movies.noOfReviews / (movies.noOfReviews + :minReviewCount)) +
          (:globalAverageRating * :minReviewCount / (movies.noOfReviews + :minReviewCount))
        )`,
          'score',
        )
        .orderBy('score', rating === '-1' ? 'ASC' : 'DESC')
        .setParameters({ globalAverageRating, minReviewCount })
        .getMany();
      return movies;
    }
    const movies = await this.moviesRepository.find({
      relations: ['genres'],
    });
    return movies;
  }

  async create(data: CreateMovieDTO) {
    const genres = data.genreIds.map((id) => ({ id }));
    const movies = this.moviesRepository.create({
      ...data,
      genres,
    });
    return this.moviesRepository.save(movies);
  }

  async updateReview(movie: Movie, rating: number) {
    const totalRatings = movie.rating * movie.noOfReviews + rating;
    const newRatings = Number(
      (totalRatings / (movie.noOfReviews + 1)).toFixed(1),
    );
    const updateReview = {
      noOfReviews: movie.noOfReviews + 1,
      rating: newRatings,
    };
    this.moviesRepository.merge(movie, updateReview);

    return await this.moviesRepository.save(movie);
  }
}
