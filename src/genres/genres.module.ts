import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre } from './entity/genres.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpResponse } from '@mdb/utils/api.response';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenresController],
  providers: [GenresService, HttpResponse],
})
export class GenresModule {}
