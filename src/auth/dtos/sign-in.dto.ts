import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignInUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
