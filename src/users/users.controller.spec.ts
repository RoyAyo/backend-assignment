import { ExecutionContext } from '@nestjs/common';
import { response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from '@mdb/auth/auth.guard';
import { HttpResponse } from '@mdb/utils/api.response';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;

  const user: any = {
    id: 1,
    name: 'Roy',
    email: 'roy@email.com',
  };

  const mockHttpResponse = {
    okResponse: jest.fn((res: Response, message: string, data: any) => data),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [HttpResponse],
    })
      .overrideProvider(HttpResponse)
      .useValue(mockHttpResponse)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should return the user from the guard', async () => {
    expect(await usersController.getCurrentUser(user, response)).toEqual(user);
  });
});
