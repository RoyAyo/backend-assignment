import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { HttpResponse } from '@mdb/utils/api.response';
import { SignInUserDTO } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private httpResponse: HttpResponse,
  ) {}

  @Post('/sign-up')
  async signUp(@Res() res: Response, @Body() data: CreateUserDTO) {
    await this.authService.signUp(data);
    return this.httpResponse.createdResponse(
      res,
      'User created successfully, kindly login',
      {},
    );
  }

  @Post('/sign-in')
  async signIn(@Res() res: Response, @Body() data: SignInUserDTO) {
    const response = await this.authService.signIn(data);
    return this.httpResponse.okResponse(
      res,
      'User successfully logged in',
      response,
    );
  }
}
