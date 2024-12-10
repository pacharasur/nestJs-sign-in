import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UserDto {

  @IsEmail({}, { message: 'ต้องเป็น email เท่านั้น' })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  nickname: string;
}


export class UserDetailDto {

  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  nickname: string;
}
