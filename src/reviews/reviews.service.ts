import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MoviesService } from '@mdb/movies/movies.service';
import { RateMovieDTO } from '@mdb/reviews/dtos/rate-movie.dtos';
import { Review } from './entity/reviews.entity';
import { User } from '@mdb/users/entity/users.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private readonly moviesService: MoviesService,
  ) {}

  async getMovieReviews(movieId: number) {
    const movie = await this.moviesService.findOne(movieId);
    return this.reviewRepository.find({
      where: {
        movie: {
          id: movie.id,
        },
      },
    });
  }

  async rateMovie(data: RateMovieDTO, user: User, movieId: number) {
    const movie = await this.moviesService.findOne(movieId);
    const alreadyRated = await this.reviewRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        movie: {
          id: movie.id,
        },
      },
    });
    if (alreadyRated)
      throw new HttpException(
        'User already rated the movie',
        HttpStatus.CONFLICT,
      );
    const reviewData = this.reviewRepository.create({
      comment: data.comment,
      rating: data.rating,
      name: user.name,
      user: {
        id: user.id,
      },
      movie: {
        id: movie.id,
      },
    });
    await this.reviewRepository.save(reviewData);
    await this.moviesService.updateReview(movie, data.rating);
  }
}
