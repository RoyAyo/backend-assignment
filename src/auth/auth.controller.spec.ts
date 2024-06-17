import { response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpResponse } from '@mdb/utils/api.response';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UsersModule } from '@mdb/users/users.module';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '@mdb/users/entity/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<User>;

  const MockAuthService = {
    signUp: jest.fn((body) => {}),
    signIn: jest.fn((body) => {
      if (body.email === user.email && body.password === user.password) {
        return {
          _token: '12345',
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }),
  };

  const MockHttpResponse = {
    okResponse: jest.fn((res: Response, message: string, data: any) => data),
    createdResponse: jest.fn(
      (res: Response, message: string, data: any) => data,
    ),
  };

  const MockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  const user: any = {
    password: 'nlJT6W0O5qo31vd',
    email: 'roy@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        HttpResponse,
        AuthGuard,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    })
      .overrideProvider(HttpResponse)
      .useValue(MockHttpResponse)
      .overrideProvider(AuthService)
      .useValue(MockAuthService)
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call auth service with the correct body for signup', async () => {
    user.name = 'Roy';
    await authController.signUp(response, user);
    expect(authService.signUp).toHaveBeenCalledWith(user);
  });

  it('should call auth service with the correct body and return token', async () => {
    expect(await authController.signIn(response, user)).toHaveProperty(
      '_token',
    );
    expect(authService.signIn).toHaveBeenCalledWith(user);
  });
});
