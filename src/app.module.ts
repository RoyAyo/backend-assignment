import config from '@mdb/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@mdb/app.controller';
import { AuthModule } from '@mdb/auth/auth.module';
import { AppService } from '@mdb/app.service';
import { GenresModule } from '@mdb/genres/genres.module';
import { MoviesModule } from '@mdb/movies/movies.module';
import { ReviewsModule } from '@mdb/reviews/reviews.module';
import { UsersModule } from '@mdb/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.postgres.host,
      port: config.postgres.port,
      username: config.postgres.username,
      password: config.postgres.password,
      database: config.postgres.database,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: config.jwt.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    UsersModule,
    MoviesModule,
    ReviewsModule,
    AuthModule,
    GenresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
