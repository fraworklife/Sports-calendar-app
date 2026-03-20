import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  /** @type {string} */
  @IsEmail()
  email;

  /** @type {string} */
  @IsString()
  @MinLength(6)
  password;

  /** @type {string} */
  @IsString()
  @MinLength(2)
  name;
}

export class LoginDto {
  /** @type {string} */
  @IsEmail()
  email;

  /** @type {string} */
  @IsString()
  password;
}
