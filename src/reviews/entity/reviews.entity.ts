import { Movie } from '@mdb/movies/entity/movies.entity';
import { User } from '@mdb/users/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: 0 })
  rating: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie: Movie;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
