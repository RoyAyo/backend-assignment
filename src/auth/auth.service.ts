import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthHelpers } from '@mdb/utils/auth.helpers';
import { User } from '@mdb/users/entity/users.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { SignInUserDTO } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async signUp(data: CreateUserDTO) {
    const user = await this.findUserByEmail(data.email);
    if (user) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = AuthHelpers.hashPassword(data.password);
    await this.usersRepository.insert({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });
  }

  async signIn(data: SignInUserDTO) {
    const user = await this.findUserByEmail(data.email);

    if (!user || !AuthHelpers.validatePassword(data.password, user.password)) {
      throw new HttpException(
        'Inavlid email/password sent',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { id: user.id };
    const _token = await this.jwtService.signAsync(payload);

    return {
      _token,
    };
  }
}
