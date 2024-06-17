import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';

import { Genre } from '@mdb/genres/entity/genres.entity';
import { Review } from '@mdb/reviews/entity/reviews.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  noOfReviews: number;

  @Column(`decimal`, { default: 0 })
  rating: number;

  @Column({ nullable: true })
  releaseDate: string;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
