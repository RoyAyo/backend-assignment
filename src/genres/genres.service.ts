import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateGenreDTO } from './dtos/create-genre.dtos';
import { Genre } from './entity/genres.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre) private genreRepository: Repository<Genre>,
  ) {}

  async findAll() {
    return this.genreRepository.find();
  }

  async create(data: CreateGenreDTO) {
    await this.genreRepository.insert({
      ...data,
    });
  }
}
