import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {

  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
