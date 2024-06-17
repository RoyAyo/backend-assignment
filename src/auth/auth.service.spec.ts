import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { AuthHelpers } from '@mdb/utils/auth.helpers';
import { User } from '@mdb/users/entity/users.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { SignInUserDTO } from './dtos/sign-in.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should register a new user successfully', async () => {
      const createUserDTO: CreateUserDTO = {
        email: 'roy@example.com',
        name: 'Roy Ayo',
        password: 'testpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'insert').mockResolvedValue(undefined);

      await authService.signUp(createUserDTO);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDTO.email },
      });
      expect(userRepository.insert).toHaveBeenCalledWith({
        email: createUserDTO.email,
        name: createUserDTO.name,
        password: expect.any(String),
      });
    });

    it('should throw an error if email is already registered', async () => {
      const createUserDTO: CreateUserDTO = {
        email: 'testuser@example.com',
        name: 'Test User',
        password: 'testpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);

      await expect(authService.signUp(createUserDTO)).rejects.toThrow(
        new HttpException('Email already registered', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const signInUserDTO: SignInUserDTO = {
        email: 'testuser@example.com',
        password: 'testpassword',
      };

      const user: any = {
        id: 1,
        email: signInUserDTO.email,
        name: 'Test User',
        password: AuthHelpers.hashPassword(signInUserDTO.password),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(AuthHelpers, 'validatePassword').mockReturnValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('testToken');

      const result = await authService.signIn(signInUserDTO);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInUserDTO.email },
      });
      expect(AuthHelpers.validatePassword).toHaveBeenCalledWith(
        signInUserDTO.password,
        user.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual({ _token: 'testToken' });
    });

    it('should throw an error if email is not found', async () => {
      const signInUserDTO: SignInUserDTO = {
        email: 'testuser@example.com',
        password: 'testpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.signIn(signInUserDTO)).rejects.toThrow(
        new HttpException(
          'Inavlid email/password sent',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const signInUserDTO: SignInUserDTO = {
        email: 'testuser@example.com',
        password: 'testpassword',
      };

      const user: any = {
        id: 1,
        email: signInUserDTO.email,
        name: 'Test User',
        password: AuthHelpers.hashPassword('wrongpassword'),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(AuthHelpers, 'validatePassword').mockReturnValue(false);

      await expect(authService.signIn(signInUserDTO)).rejects.toThrow(
        new HttpException(
          'Inavlid email/password sent',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
