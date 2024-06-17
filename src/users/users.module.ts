import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpResponse } from '@mdb/utils/api.response';
import { UsersController } from './users.controller';
import { User } from './entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [HttpResponse],
  exports: [TypeOrmModule],
})
export class UsersModule {}
