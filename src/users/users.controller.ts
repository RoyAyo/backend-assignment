import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '@mdb/auth/auth.guard';
import { CurrentUser } from './current-user.decorator';
import { HttpResponse } from '@mdb/utils/api.response';
import { User } from './entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private http: HttpResponse) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() user: User, @Res() res: Response) {
    return this.http.okResponse(res, '', user);
  }
}
