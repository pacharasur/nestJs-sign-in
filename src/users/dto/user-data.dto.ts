import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto {

  @IsEmail()
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
