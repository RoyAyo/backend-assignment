import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpResponse } from '@mdb/utils/api.response';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entity/movies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [MoviesService, HttpResponse],
  exports: [TypeOrmModule, MoviesService],
})
export class MoviesModule {}
