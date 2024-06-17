import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoviesModule } from '@mdb/movies/movies.module';
import { UsersModule } from '@mdb/users/users.module';
import { HttpResponse } from '@mdb/utils/api.response';
import { Review } from './entity/reviews.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), MoviesModule, UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, HttpResponse],
  exports: [ReviewsService, TypeOrmModule],
})
export class ReviewsModule {}
